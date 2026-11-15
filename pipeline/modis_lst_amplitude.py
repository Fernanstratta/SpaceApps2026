#!/usr/bin/env python3
"""
modis_lst_amplitude.py — Eje 5 del ILS, lado terrestre: amplitud térmica día/noche ΔT (K).

Producto: Aqua MODIS MYD11A2 v061 (LST 8 días, 1 km; pasos ~13:30 y ~01:30 hora local),
servido como COG por Microsoft Planetary Computer (colección modis-11A2-061, sin cuenta:
las URL se firman con un token SAS anónimo de la cuenta y el contenedor de cada archivo).

Para cada compuesto de 8 días del año:
  ΔT_pixel = (LST_Day_1km − LST_Night_1km) · 0.02   (factor de escala del producto)
usando solo píxeles con calidad aceptable en el día y la noche:
  QC bits 0–1 ∈ {00, 01} (LST producido) y bits 6–7 ≤ 01 (error de LST ≤ 2 K).
El valor del compuesto es la media de ΔT dentro del AOI; el del sitio es la media anual
de los compuestos (al menos 50 % del AOI con dato).

Píxeles en el AOI: los de 1 km cuyo centro cae dentro del círculo; si el AOI es más chico
que un píxel (p. ej. Cerro Prieto, r = 1.2 km) se usa como mínimo el píxel más cercano.

Uso:
  python pipeline/modis_lst_amplitude.py                 # todos los sitios terrestres, 2023
  python pipeline/modis_lst_amplitude.py --year 2022 --sites cerro_prieto
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.request
from pathlib import Path

import numpy as np
import rasterio
from rasterio.warp import transform as warp_transform
from rasterio.windows import from_bounds

STAC = "https://planetarycomputer.microsoft.com/api/stac/v1"
SAS = "https://planetarycomputer.microsoft.com/api/sas/v1/token"
CATALOG = Path(__file__).resolve().parent / "catalog" / "earth-sites.json"
SCALE = 0.02
R_EARTH = 6371008.8


def http_json(url: str, body: dict | None = None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.load(r)


def search(lon: float, lat: float, year: int) -> list[dict]:
    feats, body = [], {"collections": ["modis-11A2-061"], "limit": 100,
                       "intersects": {"type": "Point", "coordinates": [lon, lat]},
                       "datetime": f"{year}-01-01T00:00:00Z/{year}-12-31T23:59:59Z",
                       "query": {"platform": {"eq": "aqua"}}}
    page = http_json(f"{STAC}/search", body)
    while True:
        feats += page["features"]
        nxt = next((l for l in page.get("links", []) if l.get("rel") == "next"), None)
        if not nxt:
            break
        page = http_json(nxt["href"], nxt.get("body")) if nxt.get("method") == "POST" else http_json(nxt["href"])
    return sorted({f["id"]: f for f in feats}.values(), key=lambda f: f["properties"]["start_datetime"])


_TOKENS: dict[tuple[str, str], str] = {}


def signed(href: str) -> str:
    """Firma una URL de Azure Blob con el token SAS anónimo de su cuenta/contenedor."""
    host, container = href.split("/")[2], href.split("/")[3]
    key = (host.split(".")[0], container)
    if key not in _TOKENS:
        _TOKENS[key] = http_json(f"{SAS}/{key[0]}/{key[1]}")["token"]
    return f"{href}?{_TOKENS[key]}"


def qc_ok(qc: np.ndarray) -> np.ndarray:
    return ((qc & 0b11) <= 1) & (((qc >> 6) & 0b11) <= 1)


def haversine_m(lon1, lat1, lon2, lat2):
    p1, p2 = np.radians(lat1), np.radians(lat2)
    a = np.sin((p2 - p1) / 2) ** 2 + np.cos(p1) * np.cos(p2) * np.sin(np.radians(lon2 - lon1) / 2) ** 2
    return 2 * R_EARTH * np.arcsin(np.sqrt(a))


def composite_delta(item: dict, site: dict) -> tuple[float, int, int] | None:
    href = lambda k: signed(item["assets"][k]["href"])
    r = site["aoi"]["radius_m"]
    with rasterio.open(href("LST_Day_1km")) as src:
        x, y = warp_transform("EPSG:4326", src.crs, [site["lon"]], [site["lat"]])
        pad = r + 2 * abs(src.transform.a)
        win = from_bounds(x[0] - pad, y[0] - pad, x[0] + pad, y[0] + pad, src.transform).round_offsets().round_lengths()
        tr = src.window_transform(win)
        day = src.read(1, window=win, boundless=True, fill_value=0).astype(int)
    rows, cols = np.indices(day.shape)
    lon, lat = warp_transform(src.crs, "EPSG:4326", (tr.c + (cols + 0.5) * tr.a).ravel(),
                              (tr.f + (rows + 0.5) * tr.e).ravel())
    d = haversine_m(np.array(lon), np.array(lat), site["lon"], site["lat"]).reshape(day.shape)
    inside = d <= r
    if not inside.any():
        inside = d == d.min()
    reads = {}
    for k in ("LST_Night_1km", "QC_Day", "QC_Night"):
        with rasterio.open(href(k)) as s:
            reads[k] = s.read(1, window=win, boundless=True, fill_value=0).astype(int)
    good = inside & (day > 0) & (reads["LST_Night_1km"] > 0) & qc_ok(reads["QC_Day"]) & qc_ok(reads["QC_Night"])
    if good.sum() < 0.5 * inside.sum():
        return None
    delta = (day[good] - reads["LST_Night_1km"][good]) * SCALE
    return float(delta.mean()), int(good.sum()), int(inside.sum())


def with_retries(fn, *args, attempts: int = 4):
    """Reintenta lecturas HTTP truncadas (errores transitorios del almacenamiento)."""
    for i in range(attempts):
        try:
            return fn(*args)
        except rasterio.errors.RasterioIOError:
            if i == attempts - 1:
                raise
            time.sleep(2 ** i)


def main() -> None:
    p = argparse.ArgumentParser(description="ΔT día/noche de MYD11A2 v061 por AOI (eje 5)")
    p.add_argument("--sites", nargs="*")
    p.add_argument("--year", type=int, default=2023,
                   help="Año completo (Planetary Computer tiene MYD11A2 hasta marzo de 2024)")
    args = p.parse_args()
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    sites = [s for s in json.loads(CATALOG.read_text(encoding="utf-8"))
             if s["body"] == "earth" and (not args.sites or s["site_id"] in args.sites)]

    result = {}
    env = rasterio.Env(GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2",
                       GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR")
    env.__enter__()
    for s in sites:
        series = []
        for item in search(s["lon"], s["lat"], args.year):
            res = with_retries(composite_delta, item, s)
            if res:
                series.append({"start": item["properties"]["start_datetime"][:10], "delta_T": round(res[0], 2),
                               "pixels": res[1], "aoi_pixels": res[2]})
        vals = np.array([r["delta_T"] for r in series])
        if vals.size < 30:
            print(f"AVISO {s['site_id']}: solo {vals.size} compuestos válidos en {args.year}; "
                  "la media anual puede estar sesgada por estación.", file=sys.stderr)
        result[s["site_id"]] = {
            "delta_T_annual_mean": round(float(vals.mean()), 2) if vals.size else None,
            "delta_T_std": round(float(vals.std()), 2) if vals.size else None,
            "delta_T_min": round(float(vals.min()), 2) if vals.size else None,
            "delta_T_max": round(float(vals.max()), 2) if vals.size else None,
            "n_composites": int(vals.size),
            "aoi_pixels_1km": max((r["aoi_pixels"] for r in series), default=0),
            "year": args.year,
            "series": series,
        }
        print(f"{s['site_id']}: ΔT={result[s['site_id']]['delta_T_annual_mean']} K "
              f"({vals.size} compuestos)", file=sys.stderr, flush=True)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
