#!/usr/bin/env python3
"""
s1_roughness.py — Eje 2 del ILS (rugosidad por radar), lado terrestre, con Sentinel-1.

Producto: Sentinel-1 GRD IW con corrección radiométrica de terreno (RTC, γ⁰ en potencia lineal,
10 m), colección sentinel-1-rtc de Microsoft Planetary Computer (sin cuenta: token SAS anónimo).

Métrica cruda: razón de polarización cruzada CR = 10·log10(⟨γ⁰VH⟩ / ⟨γ⁰VV⟩) en dB, con las
potencias promediadas en el AOI. Una superficie más rugosa (bloques, lava, escarpes) despolariza
más y sube el CR. Valor del sitio = mediana de 3 escenas de julio–agosto de 2024 (temporada seca).

Población de referencia terrestre: celdas de 1 km de desierto (ESA WorldCover 2021: matorral 20,
pastizal 30 o suelo desnudo 60; sin cultivos, zonas urbanas ni agua) en las mismas escenas,
con el mismo estimador. Se guardan 1001 cuantiles en pipeline/catalog/reference-populations.json
para que ils_pipeline.py convierta el CR de cada sitio en percentil dentro de la Tierra.

Uso:
  python pipeline/s1_roughness.py [--write-population]
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.request
from collections import defaultdict
from pathlib import Path

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.warp import reproject, transform as warp_transform, transform_bounds
from rasterio.windows import from_bounds
from rasterio.transform import from_origin

ROOT = Path(__file__).resolve().parent
SITES = ROOT / "catalog" / "earth-sites.json"
POPULATIONS = ROOT / "catalog" / "reference-populations.json"
STAC = "https://planetarycomputer.microsoft.com/api/stac/v1"
SAS = "https://planetarycomputer.microsoft.com/api/sas/v1/token"
DESERT_CLASSES = (20, 30, 60)
CELL_M, COARSE_M = 1000, 100
DATES = "2024-07-01T00:00:00Z/2024-08-31T23:59:59Z"
_TOKENS: dict[tuple[str, str], str] = {}


def http_json(url: str, body: dict | None = None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.load(r)


def signed(href: str) -> str:
    host, container = href.split("/")[2], href.split("/")[3]
    key = (host.split(".")[0], container)
    if key not in _TOKENS:
        _TOKENS[key] = http_json(f"{SAS}/{key[0]}/{key[1]}")["token"]
    return f"{href}?{_TOKENS[key]}"


def retry(fn, *args, attempts=4):
    for i in range(attempts):
        try:
            return fn(*args)
        except rasterio.errors.RasterioIOError:
            if i == attempts - 1:
                raise
            time.sleep(2 ** i)


def search(collection: str, lon: float, lat: float, datetime: str | None = None) -> list[dict]:
    body = {"collections": [collection], "intersects": {"type": "Point", "coordinates": [lon, lat]}, "limit": 100}
    if datetime:
        body["datetime"] = datetime
    return http_json(f"{STAC}/search", body)["features"]


def site_cr(item: dict, site: dict) -> float | None:
    out = {}
    for pol in ("vv", "vh"):
        with rasterio.open(signed(item["assets"][pol]["href"])) as s:
            x, y = warp_transform("EPSG:4326", s.crs, [site["lon"]], [site["lat"]])
            r = site["aoi"]["radius_m"]
            win = from_bounds(x[0] - r, y[0] - r, x[0] + r, y[0] + r, s.transform).round_offsets().round_lengths()
            a = s.read(1, window=win, boundless=True, fill_value=0).astype(float)
            tr = s.window_transform(win)
        rows, cols = np.indices(a.shape)
        inside = np.hypot(tr.c + (cols + .5) * tr.a - x[0], tr.f + (rows + .5) * tr.e - y[0]) <= r
        ok = inside & np.isfinite(a) & (a > 0)
        if ok.sum() < 0.8 * inside.sum():
            return None
        out[pol] = a[ok].mean()
    return float(10 * np.log10(out["vh"] / out["vv"]))


def scene_population(item: dict) -> np.ndarray:
    """CR (dB) de celdas de 1 km de desierto en toda la escena (lectura a 100 m)."""
    with rasterio.open(signed(item["assets"]["vv"]["href"])) as s:
        f = COARSE_M / abs(s.transform.a)
        shape = (int(s.height / f), int(s.width / f))
        vv = s.read(1, out_shape=shape, resampling=Resampling.average).astype(float)
        tr = s.transform * s.transform.scale(s.width / shape[1], s.height / shape[0])
        crs, bounds = s.crs, s.bounds
    with rasterio.open(signed(item["assets"]["vh"]["href"])) as s:
        vh = s.read(1, out_shape=shape, resampling=Resampling.average).astype(float)

    lc = np.zeros(shape, dtype="uint8")
    w, so, e, n = transform_bounds(crs, "EPSG:4326", *bounds)
    for tile in http_json(f"{STAC}/search", {"collections": ["esa-worldcover"], "bbox": [w, so, e, n],
                                              "limit": 50})["features"]:
        with rasterio.open(signed(tile["assets"]["map"]["href"])) as t:
            tmp = np.zeros(shape, dtype="uint8")
            reproject(rasterio.band(t, 1), tmp, dst_transform=tr, dst_crs=crs, resampling=Resampling.mode)
        lc = np.where(tmp > 0, tmp, lc)

    k = CELL_M // COARSE_M
    h, wd = (shape[0] // k) * k, (shape[1] // k) * k
    blocks = lambda a: a[:h, :wd].reshape(h // k, k, wd // k, k)
    ok = blocks(np.isfinite(vv) & np.isfinite(vh) & (vv > 0) & (vh > 0) & np.isin(lc, DESERT_CLASSES)).all(axis=(1, 3))
    cvv = np.nanmean(blocks(np.where(vv > 0, vv, np.nan)), axis=(1, 3))
    cvh = np.nanmean(blocks(np.where(vh > 0, vh, np.nan)), axis=(1, 3))
    return (10 * np.log10(cvh / cvv))[ok]


def main() -> None:
    p = argparse.ArgumentParser(description="CR de Sentinel-1 por AOI y población terrestre (eje 2)")
    p.add_argument("--write-population", action="store_true")
    p.add_argument("--scenes", type=int, default=3)
    args = p.parse_args()
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")
    env = rasterio.Env(GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2", GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR")
    env.__enter__()

    sites = [s for s in json.loads(SITES.read_text(encoding="utf-8")) if s["body"] == "earth"]
    results, used_scenes = defaultdict(list), {}
    for s in sites:
        feats = [f for f in search("sentinel-1-rtc", s["lon"], s["lat"], DATES)
                 if f["properties"].get("sat:orbit_state") == "descending"]
        by_orbit = defaultdict(list)
        for f in feats:
            by_orbit[f["properties"]["sat:relative_orbit"]].append(f)
        for orbit, items in sorted(by_orbit.items(), key=lambda kv: -len(kv[1])):
            items = sorted(items, key=lambda f: f["properties"]["datetime"])[-args.scenes:]
            vals = [v for v in (retry(site_cr, it, s) for it in items) if v is not None]
            if vals:
                results[s["site_id"]] = vals
                for it in items:
                    used_scenes[it["id"]] = it
                print(f"{s['site_id']}: órbita {orbit}, CR = {np.round(vals, 2)} dB", file=sys.stderr, flush=True)
                break

    pop = []
    for sid, it in used_scenes.items():
        cells = retry(scene_population, it)
        pop.append(cells)
        print(f"población {sid}: {cells.size} celdas de desierto, mediana {np.median(cells):.2f} dB", file=sys.stderr, flush=True)
    pop = np.concatenate(pop)
    quant = [round(float(v), 3) for v in np.quantile(pop, np.linspace(0, 1, 1001))]

    out = {"sites": {sid: {"cr_db": round(float(np.median(v)), 3), "cr_db_scenes": [round(x, 3) for x in v]}
                     for sid, v in results.items()},
           "population": {"cells": int(pop.size), "p05_p50_p95": [quant[50], quant[500], quant[950]],
                          "scenes": sorted(used_scenes)}}
    if args.write_population:
        pops = json.loads(POPULATIONS.read_text(encoding="utf-8")) if POPULATIONS.exists() else {}
        pops.setdefault("roughness", {})["earth"] = {
            "name": "Sentinel-1 RTC, CR = γ⁰VH/γ⁰VV (dB), celdas de 1 km de desierto del NO de México",
            "source": ("Sentinel-1 RTC (Planetary Computer), julio–agosto de 2024, órbitas descendentes; "
                       f"ESA WorldCover 2021 clases {DESERT_CLASSES}; {pop.size} celdas; 1001 cuantiles"),
            "values": quant}
        POPULATIONS.write_text(json.dumps(pops, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
