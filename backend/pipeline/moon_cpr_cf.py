#!/usr/bin/env python3
"""
moon_cpr_cf.py — Ejes 2 (rugosidad, radar) y 3 (mineralogía) del ILS, lado lunar.

Entradas (PDS Geosciences, sin cuenta; descárgalas una vez):
  Mini-RF CPR global, banda S, 32 ppd (~948 m), simple cilíndrica, float32:
    https://pds-geosciences.wustl.edu/lro/lro-l-mrflro-5-global-mosaic-v1/lromrf_1001/data/32ppd/global_cpr_32ppd_simp_0c.img
  Diviner Christiansen Feature (NEN), 32 ppd, ±60°, int16 × 0.001 µm:
    https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1/data_derived_gdr_l3/cylindrical/img/dgdr_nen_cf_clc_cyl_032_img.img

Eje 2: CPR medio del AOI. La población de referencia lunar son todos los píxeles válidos del
mosaico global, ponderados por área (cos lat); se guardan 1001 cuantiles en
pipeline/catalog/reference-populations.json para que ils_pipeline.py calcule el percentil.

Eje 3: CF medio del AOI (µm). Anclas de la escala absoluta félsico 0 – máfico 1:
  félsico = moda de CF en tierras altas feldespáticas de la cara oculta (−10° a 10°, 160° a 200° E);
  máfico  = moda de CF en mares basálticos de referencia (Imbrium, Serenitatis oriental,
            Tranquillitatis oriental, Crisium), que excluyen los cinco sitios del ILS.
Un CF menor que el ancla félsica (domos silícicos) queda en 0; uno mayor que la máfica, en 1.
Diviner enmascara el CF en pendientes fuertes y cráteres frescos: si el AOI no tiene al menos
5 píxeles válidos, el radio crece de 1 en 1 km (hasta AOI + 5 km) y se usa la mediana.
El CF solo existe entre ±60°: el borde de Shackleton no tiene valor.

Uso:
  python pipeline/moon_cpr_cf.py CPR.IMG CF.IMG [--write-population]
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent
SITES = ROOT / "catalog" / "moon-sites.json"
POPULATIONS = ROOT / "catalog" / "reference-populations.json"
R_MOON = 1737400.0
PPD = 32
CF_ROWS, CF_MAX_LAT = 3840, 60.0
HIGHLANDS = [(-10, 10, 160, 200)]
MARIA = [(30, 40, -25, -10), (18, 30, 18, 26), (5, 15, 28, 38), (12, 20, 53, 62)]  # lat0, lat1, lon0, lon1


def load_cpr(path: str) -> np.ndarray:
    a = np.fromfile(path, "<f4").reshape(180 * PPD, 360 * PPD)
    return np.where(np.isfinite(a) & (a > -1e30) & (a >= 0), a, np.nan)


def load_cf(path: str) -> np.ndarray:
    a = np.fromfile(path, "<i2").reshape(CF_ROWS, 360 * PPD).astype(float)
    return np.where(a == -32768, np.nan, a * 0.001)


def grid_latlon(rows: int, lat_top: float, lon_west: float):
    lat = lat_top - (np.arange(rows) + 0.5) / PPD
    lon = lon_west + (np.arange(360 * PPD) + 0.5) / PPD
    return lat, lon


def aoi_values(a: np.ndarray, lat_top: float, lon_west: float, site: dict) -> np.ndarray:
    """Valores de los píxeles cuyo centro cae en el AOI (al menos el píxel más cercano)."""
    lat, lon = grid_latlon(a.shape[0], lat_top, lon_west)
    r = site["aoi"]["radius_m"]
    dlat = math.degrees(r / R_MOON) + 2 / PPD
    rows = np.nonzero(np.abs(lat - site["lat"]) <= dlat)[0]
    if rows.size == 0:
        return np.array([])
    la = np.radians(lat[rows])[:, None]
    dlon = np.radians(((lon - site["lon"] + 180) % 360) - 180)[None, :]
    p0 = math.radians(site["lat"])
    d = 2 * R_MOON * np.arcsin(np.sqrt(np.sin((la - p0) / 2) ** 2 + np.cos(la) * math.cos(p0) * np.sin(dlon / 2) ** 2))
    block = a[rows]
    inside = (d <= r) & np.isfinite(block)
    if not inside.any():
        near = np.where(np.isfinite(block), d, np.inf)
        k = np.unravel_index(np.argmin(near), near.shape)
        return np.array([block[k]]) if np.isfinite(near[k]) and near[k] < 2 * R_MOON * math.radians(1 / PPD) else np.array([])
    return block[inside]


def box_mode(a: np.ndarray, lat_top: float, lon_west: float, boxes, bins=np.arange(7.6, 8.9, 0.01)) -> tuple[float, int]:
    lat, lon = grid_latlon(a.shape[0], lat_top, lon_west)
    vals, wts = [], []
    for la0, la1, lo0, lo1 in boxes:
        r = (lat >= la0) & (lat <= la1)
        lon_w = ((lon - lo0) % 360) <= (lo1 - lo0)
        blk = a[np.ix_(r, lon_w)]
        w = np.repeat(np.cos(np.radians(lat[r]))[:, None], blk.shape[1], 1)
        ok = np.isfinite(blk)
        vals.append(blk[ok]); wts.append(w[ok])
    v, w = np.concatenate(vals), np.concatenate(wts)
    h, e = np.histogram(v, bins=bins, weights=w)
    i = int(np.argmax(h))
    return round(float(e[i] + (e[1] - e[0]) / 2), 3), int(v.size)


def weighted_quantiles(a: np.ndarray, lat_top: float, n: int = 1001) -> list[float]:
    lat, _ = grid_latlon(a.shape[0], lat_top, -180)
    w = np.repeat(np.cos(np.radians(lat))[:, None], a.shape[1], 1)
    ok = np.isfinite(a)
    v, w = a[ok], w[ok]
    order = np.argsort(v)
    v, cw = v[order], np.cumsum(w[order])
    cw /= cw[-1]
    return [round(float(x), 4) for x in np.interp(np.linspace(0, 1, n), cw, v)]


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    p.add_argument("cpr")
    p.add_argument("cf")
    p.add_argument("--write-population", action="store_true",
                   help="Guarda los cuantiles de CPR lunar en catalog/reference-populations.json")
    args = p.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    cpr = load_cpr(args.cpr)      # 90° N arriba, −180° a la izquierda
    cf = load_cf(args.cf)         # 60° N arriba, 0° E a la izquierda
    felsic, n_h = box_mode(cf, CF_MAX_LAT, 0, HIGHLANDS)
    mafic, n_m = box_mode(cf, CF_MAX_LAT, 0, MARIA)

    sites = [s for s in json.loads(SITES.read_text(encoding="utf-8")) if s["body"] == "moon"]
    out = {"cf_anchors": {"felsic_um": felsic, "mafic_um": mafic, "highlands_pixels": n_h, "maria_pixels": n_m,
                          "highlands_boxes": HIGHLANDS, "maria_boxes": MARIA}, "sites": {}}
    for s in sites:
        c = aoi_values(cpr, 90, -180, s)
        f, cf_radius = np.array([]), None
        if abs(s["lat"]) <= CF_MAX_LAT:
            for extra in range(0, 6):
                probe = {**s, "aoi": {**s["aoi"], "radius_m": s["aoi"]["radius_m"] + 1000 * extra}}
                f = aoi_values(cf, CF_MAX_LAT, 0, probe)
                if f.size >= 5:
                    cf_radius = probe["aoi"]["radius_m"]
                    break
        out["sites"][s["site_id"]] = {
            "cpr_mean": round(float(np.mean(c)), 4) if c.size else None, "cpr_pixels": int(c.size),
            "cf_median_um": round(float(np.median(f)), 4) if f.size >= 5 else None, "cf_pixels": int(f.size),
            "cf_radius_m": cf_radius,
            "cf_p25_p75": [round(float(v), 3) for v in np.percentile(f, [25, 75])] if f.size >= 5 else None,
        }

    quant = weighted_quantiles(cpr, 90)
    out["cpr_population"] = {"n_quantiles": len(quant), "p05_p50_p95": [quant[50], quant[500], quant[950]]}
    if args.write_population:
        pops = json.loads(POPULATIONS.read_text(encoding="utf-8")) if POPULATIONS.exists() else {}
        pops.setdefault("roughness", {})["moon"] = {
            "name": "Mini-RF CPR global (banda S, 32 ppd), ponderado por área",
            "source": "LRO Mini-RF global mosaic, PDS Geosciences (lro-l-mrflro-5-global-mosaic-v1); 1001 cuantiles",
            "values": quant}
        POPULATIONS.write_text(json.dumps(pops, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
