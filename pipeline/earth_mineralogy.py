#!/usr/bin/env python3
"""
earth_mineralogy.py — Eje 3 del ILS (composición félsica–máfica), lado terrestre.

Sustituto abierto de ASTER GED AG100 (que exige cuenta de NASA Earthdata): emisividad de
MODIS MOD21A2/MYD21A2 v061 (8 días, 1 km), colección modis-21A2-061 de Planetary Computer.

Métrica cruda: ε29/ε31 (8.55 µm / 11 µm). El cuarzo y los feldespatos tienen su banda
reststrahlen cerca de 8.5–9.3 µm (ε29 bajo); en el basalto se desplaza hacia ~10 µm y ε29
sube. Es el análogo terrestre de la Christiansen Feature de Diviner: los dos miden la
polimerización de los silicatos en el infrarrojo térmico. La razón con ε31 quita el efecto
de humedad y vegetación, que suben todas las bandas por igual.

Valor del sitio: media en el AOI de la mediana por píxel de los compuestos de mayo a agosto
de 2023 (Terra y Aqua). Escala absoluta félsico 0 – máfico 1 con dos anclas del mismo producto:
  máfico  = mediana del campo de lava basáltica del Pinacate (anillo de 6 a 15 km de la cumbre);
  félsico = media del círculo de 10 km con el ε29/ε31 más bajo del erg del Gran Desierto
            (arena de cuarzo y feldespato) al oeste del Pinacate.
El mismo principio que en la Luna, donde las anclas son las modas del CF en tierras altas
feldespáticas y en mares basálticos.

Uso:
  python pipeline/earth_mineralogy.py
"""

from __future__ import annotations

import json
import sys
import time
import urllib.request
from pathlib import Path

import numpy as np
import rasterio
from rasterio.warp import transform as warp_transform
from rasterio.windows import from_bounds
from scipy.signal import fftconvolve

ROOT = Path(__file__).resolve().parent
SITES = ROOT / "catalog" / "earth-sites.json"
STAC = "https://planetarycomputer.microsoft.com/api/stac/v1"
SAS = "https://planetarycomputer.microsoft.com/api/sas/v1/token"
SCALE, OFFSET = 0.002, 0.49
REGION = (-116.0, 31.3, -113.0, 32.8)          # oeste, sur, este, norte (grados)
PINACATE_SUMMIT = (-113.49909, 31.77239)
ERG_BOX = (-114.9, 31.5, -113.75, 32.4)        # Gran Desierto, al oeste del escudo
_TOKENS: dict[tuple[str, str], str] = {}


def http_json(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def signed(href):
    host, container = href.split("/")[2], href.split("/")[3]
    key = (host.split(".")[0], container)
    if key not in _TOKENS:
        _TOKENS[key] = http_json(f"{SAS}/{key[0]}/{key[1]}")["token"]
    return f"{href}?{_TOKENS[key]}"


def read_region(href):
    for i in range(4):
        try:
            with rasterio.open(signed(href)) as s:
                xs, ys = warp_transform("EPSG:4326", s.crs, [REGION[0], REGION[2], REGION[0], REGION[2]],
                                        [REGION[1], REGION[1], REGION[3], REGION[3]])
                win = from_bounds(min(xs), min(ys), max(xs), max(ys), s.transform).round_offsets().round_lengths()
                a = s.read(1, window=win, boundless=True, fill_value=0).astype(float)
                return np.where(a > 0, a * SCALE + OFFSET, np.nan), s.window_transform(win), s.crs
        except rasterio.errors.RasterioIOError:
            time.sleep(2 ** i)
    raise RuntimeError(href)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    env = rasterio.Env(GDAL_HTTP_MAX_RETRY="4", GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR")
    env.__enter__()
    items = http_json(f"{STAC}/search", {"collections": ["modis-21A2-061"], "limit": 100,
                                         "intersects": {"type": "Point", "coordinates": [-114.5, 32.0]},
                                         "datetime": "2023-05-01T00:00:00Z/2023-08-31T23:59:59Z"})["features"]
    ratios = []
    for it in items:
        e29, tr, crs = read_region(it["assets"]["Emis_29"]["href"])
        e31, _, _ = read_region(it["assets"]["Emis_31"]["href"])
        ratios.append(e29 / e31)
    with np.errstate(all="ignore"):
        ratio = np.nanmedian(np.stack(ratios), axis=0)

    rows, cols = np.indices(ratio.shape)
    xs, ys = tr.c + (cols + .5) * tr.a, tr.f + (rows + .5) * tr.e
    lon, lat = (np.array(v).reshape(ratio.shape) for v in warp_transform(crs, "EPSG:4326", xs.ravel(), ys.ravel()))
    km = lambda lo, la: 6371.0088 * np.hypot(np.radians(lon - lo) * np.cos(np.radians(la)), np.radians(lat - la))

    d_pin = km(*PINACATE_SUMMIT)
    mafic = float(np.nanmedian(ratio[(d_pin >= 6) & (d_pin <= 15)]))

    k = 5  # círculo de 10 km a 1 km/píxel
    yy, xx = np.mgrid[-k:k + 1, -k:k + 1]
    disk = (np.hypot(xx, yy) <= k).astype(float)
    ok = np.isfinite(ratio)
    mean10 = fftconvolve(np.where(ok, ratio, 0), disk, "same") / np.maximum(fftconvolve(ok.astype(float), disk, "same"), 1e-9)
    full = fftconvolve(ok.astype(float), disk, "same") > disk.sum() - 0.5
    in_box = (lon >= ERG_BOX[0]) & (lon <= ERG_BOX[2]) & (lat >= ERG_BOX[1]) & (lat <= ERG_BOX[3])
    cand = np.where(full & in_box, mean10, np.inf)
    r0, c0 = np.unravel_index(np.argmin(cand), cand.shape)
    felsic = float(mean10[r0, c0])

    out = {"anchors": {"felsic_ratio": round(felsic, 4), "felsic_center": [round(float(lat[r0, c0]), 3), round(float(lon[r0, c0]), 3)],
                       "mafic_ratio": round(mafic, 4), "mafic_area": "anillo de 6–15 km alrededor de la cumbre del Pinacate"},
           "composites": len(ratios), "region_p05_p50_p95": [round(float(v), 4) for v in np.nanpercentile(ratio, [5, 50, 95])],
           "sites": {}}
    for s in json.loads(SITES.read_text(encoding="utf-8")):
        if s["body"] != "earth":
            continue
        d = km(s["lon"], s["lat"])
        m = (d <= s["aoi"]["radius_m"] / 1000) & ok
        if not m.any():
            m = (d == np.nanmin(np.where(ok, d, np.inf)))
        raw = float(np.nanmean(ratio[m]))
        out["sites"][s["site_id"]] = {"ratio_e29_e31": round(raw, 4), "pixels_1km": int(m.sum()),
                                      "mafic_score": round(min(1, max(0, (raw - felsic) / (mafic - felsic))), 3)}
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
