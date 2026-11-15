#!/usr/bin/env python3
"""
s2_aoi_stats.py — Ejes 4 (albedo) y 6 (aridez/NDVI) del ILS, lado terrestre, con Sentinel-2 L2A.

Lee los COG de Sentinel-2 L2A del catálogo STAC abierto de Earth Search (AWS, sin cuenta)
y calcula, dentro del AOI circular de cada sitio de pipeline/catalog/earth-sites.json:

  - albedo de banda ancha  α = 0.356·B2 + 0.130·B4 + 0.373·B8 + 0.085·B11 + 0.072·B12 − 0.0018
  - NDVI = (B8 − B4) / (B8 + B4)

Máscaras (las mismas que evalscript_s2_indices.js):
  - SCL 0, 1, 3, 8, 9, 10, 11 (sin dato, saturado, sombra de nube, nubes, cirro, nieve)
  - SCL 6 (agua) SIEMPRE
  - NDVI > 0.2 (vegetación) para el albedo. El NDVI del eje 6 se reporta sin quitar la
    vegetación, porque es justo lo que mide; también se da el valor con la vegetación quitada.

Agregación (eje 4 y eje 6 usan la temporada seca, mayo–agosto por defecto):
  - por escena: mediana del AOI;
  - por sitio: mediana de las medianas de escena (temporada seca) y, para el NDVI,
    el máximo anual de las medianas de escena (contexto de "temporada seca más máximo anual").

Uso:
  python pipeline/s2_aoi_stats.py                       # todos los sitios, 2024
  python pipeline/s2_aoi_stats.py --sites laguna_salada --year 2023 --dry-months 6 7 8

Requiere: numpy, rasterio (pip install -r pipeline/requirements.txt)
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
from rasterio.warp import transform as warp_transform
from rasterio.windows import Window, from_bounds

STAC = "https://earth-search.aws.element84.com/v1"
COLLECTION = "sentinel-2-l2a"
CATALOG = Path(__file__).resolve().parent / "catalog" / "earth-sites.json"
INVALID_SCL = (0, 1, 3, 8, 9, 10, 11)
WATER_SCL = 6
VEG_NDVI = 0.2
BANDS = {"B02": "blue", "B04": "red", "B08": "nir", "B11": "swir16", "B12": "swir22"}
ALBEDO = {"B02": 0.356, "B04": 0.130, "B08": 0.373, "B11": 0.085, "B12": 0.072}
ALBEDO_OFFSET = -0.0018
MIN_VALID = 0.8   # fracción mínima del AOI con píxeles limpios para aceptar una escena


def stac_search(lon: float, lat: float, start: str, end: str, max_cloud: float) -> list[dict]:
    body = {"collections": [COLLECTION], "intersects": {"type": "Point", "coordinates": [lon, lat]},
            "datetime": f"{start}T00:00:00Z/{end}T23:59:59Z", "limit": 200,
            "query": {"eo:cloud_cover": {"lt": max_cloud}},
            "sortby": [{"field": "properties.datetime", "direction": "asc"}]}
    req = urllib.request.Request(f"{STAC}/search", data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.load(r)["features"]


def reflectance_offset(props: dict) -> float:
    """DN → ρ: ρ = (DN + offset)/1e4. Earth Search ya corrige la línea base 04.00 si boa_offset_applied."""
    if props.get("earthsearch:boa_offset_applied", False):
        return 0.0
    return -1000.0 if float(props.get("s2:processing_baseline", "0")) >= 4.0 else 0.0


def pick_scenes(features: list[dict], months: set[int] | None, n: int) -> list[dict]:
    """Una sola teja MGRS (la más frecuente) y n escenas repartidas en el periodo."""
    if months:
        features = [f for f in features if int(f["properties"]["datetime"][5:7]) in months]
    if not features:
        return []
    tiles = [f["properties"].get("grid:code", f["id"].split("_")[1]) for f in features]
    tile = max(set(tiles), key=tiles.count)
    features = [f for f, t in zip(features, tiles) if t == tile]
    if len(features) > n:
        features = [features[int(i)] for i in np.linspace(0, len(features) - 1, n)]
    return features


def scene_stats(item: dict, sites: list[dict]) -> dict:
    """Estadísticas de una escena para varios AOI (abre cada banda una sola vez)."""
    props = item["properties"]
    off = reflectance_offset(props)
    out = {}
    with rasterio.open(item["assets"]["red"]["href"]) as ref:
        grids = {}
        for s in sites:
            x, y = warp_transform("EPSG:4326", ref.crs, [s["lon"]], [s["lat"]])
            r = s["aoi"]["radius_m"]
            win = from_bounds(x[0] - r, y[0] - r, x[0] + r, y[0] + r, ref.transform).round_offsets().round_lengths()
            tr = ref.window_transform(win)
            rows, cols = np.indices((int(win.height), int(win.width)))
            xs, ys = tr.c + (cols + 0.5) * tr.a, tr.f + (rows + 0.5) * tr.e
            grids[s["site_id"]] = (win, np.hypot(xs - x[0], ys - y[0]) <= r)
        bounds = {k: rasterio.windows.bounds(w, ref.transform) for k, (w, _) in grids.items()}
        crs = ref.crs

    arrays = defaultdict(dict)
    for band, key in list(BANDS.items()) + [("SCL", "scl")]:
        with rasterio.open(item["assets"][key]["href"]) as src:
            if src.crs != crs:
                raise ValueError(f"{item['id']}: CRS distinto entre bandas")
            for sid, (win, _) in grids.items():
                w = from_bounds(*bounds[sid], src.transform)
                arrays[sid][band] = src.read(
                    1, window=w, out_shape=(int(win.height), int(win.width)), boundless=True, fill_value=0,
                    resampling=Resampling.nearest if band == "SCL" else Resampling.bilinear).astype("float64")

    for sid, (win, inside) in grids.items():
        a = arrays[sid]
        scl = a["SCL"].astype(int)
        rho = {b: (a[b] + off) / 1e4 for b in BANDS}
        with np.errstate(invalid="ignore", divide="ignore"):
            ndvi = (rho["B08"] - rho["B04"]) / (rho["B08"] + rho["B04"])
        albedo = sum(ALBEDO[b] * rho[b] for b in ALBEDO) + ALBEDO_OFFSET
        has_data = inside & (scl != 0) & (a["B04"] > 0)
        clean = has_data & ~np.isin(scl, INVALID_SCL) & np.isfinite(ndvi)
        water = clean & (scl == WATER_SCL)
        dry = clean & ~water
        veg = dry & (ndvi > VEG_NDVI)
        bare = dry & ~veg
        n_in = int(inside.sum())
        out[sid] = {
            "valid_frac": round(float(dry.sum() / n_in), 4),
            "coverage": round(float(has_data.sum() / n_in), 4),
            "water_frac": round(float(water.sum() / max(clean.sum(), 1)), 4),
            "veg_frac": round(float(veg.sum() / max(dry.sum(), 1)), 4),
            "albedo_median": round(float(np.median(albedo[bare])), 4) if bare.any() else None,
            "ndvi_median": round(float(np.median(ndvi[dry])), 4) if dry.any() else None,
            "ndvi_median_vegmasked": round(float(np.median(ndvi[bare])), 4) if bare.any() else None,
            "pixels": int(dry.sum()),
        }
    return out


def with_retries(fn, *args, attempts: int = 4):
    """Reintenta lecturas HTTP truncadas de los COG (errores transitorios de S3)."""
    for i in range(attempts):
        try:
            return fn(*args)
        except rasterio.errors.RasterioIOError:
            if i == attempts - 1:
                raise
            time.sleep(2 ** i)


def main() -> None:
    p = argparse.ArgumentParser(description="Albedo (eje 4) y NDVI (eje 6) de Sentinel-2 L2A por AOI")
    p.add_argument("--sites", nargs="*", help="site_id a procesar (por defecto todos los terrestres)")
    p.add_argument("--year", type=int, default=2024)
    p.add_argument("--dry-months", nargs="*", type=int, default=[5, 6, 7, 8])
    p.add_argument("--dry-scenes", type=int, default=6, help="Escenas de temporada seca por sitio")
    p.add_argument("--year-scenes", type=int, default=12, help="Escenas del año para el máximo de NDVI")
    p.add_argument("--max-cloud", type=float, default=5.0)
    p.add_argument("--cache", type=Path, help="JSON con resultados por escena para reanudar una corrida")
    args = p.parse_args()
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")

    sites = [s for s in json.loads(CATALOG.read_text(encoding="utf-8"))
             if s["body"] == "earth" and (not args.sites or s["site_id"] in args.sites)]
    start, end = f"{args.year}-01-01", f"{args.year}-12-31"

    plan = defaultdict(lambda: {"item": None, "sites": [], "dry": set()})
    for s in sites:
        feats = stac_search(s["lon"], s["lat"], start, end, args.max_cloud)
        dry = pick_scenes(feats, set(args.dry_months), args.dry_scenes)
        year = pick_scenes(feats, None, args.year_scenes)
        for f in {f["id"]: f for f in dry + year}.values():
            plan[f["id"]]["item"] = f
            plan[f["id"]]["sites"].append(s)
        for f in dry:
            plan[f["id"]]["dry"].add(s["site_id"])

    cache = json.loads(args.cache.read_text(encoding="utf-8")) if args.cache and args.cache.exists() else {}
    per_site = defaultdict(list)
    env = rasterio.Env(GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2", GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR")
    env.__enter__()
    for sid_scene, job in sorted(plan.items(), key=lambda kv: kv[1]["item"]["properties"]["datetime"]):
        wanted = {s["site_id"] for s in job["sites"]}
        if wanted <= set(cache.get(sid_scene, {})):
            stats = {k: cache[sid_scene][k] for k in wanted}
        else:
            stats = with_retries(scene_stats, job["item"], job["sites"])
            if args.cache:
                cache[sid_scene] = {**cache.get(sid_scene, {}), **stats}
                args.cache.write_text(json.dumps(cache), encoding="utf-8")
        stats = {k: dict(v) for k, v in stats.items()}
        date = job["item"]["properties"]["datetime"][:10]
        for site_id, st in stats.items():
            st.update(scene=sid_scene, date=date, dry_season=site_id in job["dry"])
            per_site[site_id].append(st)
        print(f"{date} {sid_scene}: " + ", ".join(f"{k} α={v['albedo_median']} ndvi={v['ndvi_median']} "
                                                   f"ok={v['valid_frac']}" for k, v in stats.items()),
              file=sys.stderr, flush=True)

    result = {}
    for s in sites:
        scenes = [st for st in per_site[s["site_id"]] if st["valid_frac"] >= MIN_VALID and st["coverage"] >= 0.95]
        dry = [st for st in scenes if st["dry_season"]]
        med = lambda key, rows: (round(float(np.median([r[key] for r in rows if r[key] is not None])), 4)
                                 if any(r[key] is not None for r in rows) else None)
        result[s["site_id"]] = {
            "albedo_broadband": med("albedo_median", dry),
            "ndvi_median_dry": med("ndvi_median", dry),
            "ndvi_median_dry_vegmasked": med("ndvi_median_vegmasked", dry),
            "ndvi_annual_max": round(max(r["ndvi_median"] for r in scenes), 4) if scenes else None,
            "albedo_range_dry": [min(r["albedo_median"] for r in dry), max(r["albedo_median"] for r in dry)] if dry else None,
            "water_frac_max_dry": max((r["water_frac"] for r in dry), default=None),
            "veg_frac_max_dry": max((r["veg_frac"] for r in dry), default=None),
            "veg_frac_max_year": max((r["veg_frac"] for r in scenes), default=None),
            "n_dry_scenes": len(dry), "n_year_scenes": len(scenes),
            "dry_dates": [r["date"] for r in dry],
            "aoi": {"lat": s["lat"], "lon": s["lon"], "radius_m": s["aoi"]["radius_m"]},
            "masks": "SCL 0,1,3,8,9,10,11 + agua SCL 6; albedo sin vegetación (NDVI > 0.2)",
        }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
