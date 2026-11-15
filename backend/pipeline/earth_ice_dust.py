#!/usr/bin/env python3
"""
earth_ice_dust.py — Ejes 7 (humedad/hielo) y 8 (polvo fino) del ILS, lado terrestre. Confianza C.

Eje 7: sustituto abierto de SMAP SPL3SMP_E (que exige cuenta de NASA Earthdata): humedad relativa
del suelo superficial GWETTOP (0 = seco, 1 = saturado) de MERRA-2, climatología mensual de la
API de NASA POWER (sin clave). Clase de volátiles (misma escala 0–3 que en la Luna):
  0 = seco: media anual < 0.4 y ningún mes ≥ 0.6, sin suelo congelado;
  1 = humedad estacional (algún mes ≥ 0.6) o media anual 0.4–0.6;
  2 = suelo húmedo persistente (media anual ≥ 0.6) o congelamiento estacional (media del mes
      más frío < 0 °C; las heladas nocturnas ocasionales no cuentan);
  3 = hielo estable (permafrost).
La celda de MERRA-2 mide ~50 km: es un valor regional de contexto.

Eje 8: fracción de partículas < ~63 µm = (limo + arcilla) / 1000 de SoilGrids 2.0
(ISRIC, 250 m, 0–5 cm, g/kg), media del AOI.

Uso:
  python pipeline/earth_ice_dust.py
"""

from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

import numpy as np
import rasterio
from rasterio.warp import transform as warp_transform
from rasterio.windows import from_bounds

ROOT = Path(__file__).resolve().parent
SITES = ROOT / "catalog" / "earth-sites.json"
POWER = ("https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=GWETTOP,T2M"
         "&community=AG&longitude={lon}&latitude={lat}&format=JSON")
SOILGRIDS = "/vsicurl/https://files.isric.org/soilgrids/latest/data/{var}/{var}_0-5cm_mean.vrt"
MONTHS = ("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC")


def volatile_class(annual: float, monthly_max: float, coldest_month_c: float) -> int:
    if annual >= 0.6 or coldest_month_c < 0:
        return 2
    if annual >= 0.4 or monthly_max >= 0.6:
        return 1
    return 0


def soilgrids_mean(var: str, site: dict) -> float:
    with rasterio.open(SOILGRIDS.format(var=var)) as s:
        x, y = warp_transform("EPSG:4326", s.crs, [site["lon"]], [site["lat"]])
        r = site["aoi"]["radius_m"]
        win = from_bounds(x[0] - r, y[0] - r, x[0] + r, y[0] + r, s.transform).round_offsets().round_lengths()
        a = s.read(1, window=win, boundless=True, fill_value=0).astype(float)
        tr = s.window_transform(win)
    rows, cols = np.indices(a.shape)
    d = np.hypot(tr.c + (cols + .5) * tr.a - x[0], tr.f + (rows + .5) * tr.e - y[0])
    ok = (a > 0) & (d <= max(r, abs(tr.a)))
    return float(a[ok].mean()) if ok.any() else float("nan")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    env = rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", GDAL_HTTP_MAX_RETRY="4",
                       CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".vrt,.tif")
    env.__enter__()
    out = {}
    for s in json.loads(SITES.read_text(encoding="utf-8")):
        if s["body"] != "earth":
            continue
        with urllib.request.urlopen(POWER.format(lon=s["lon"], lat=s["lat"]), timeout=120) as r:
            par = json.load(r)["properties"]["parameter"]
        g = par["GWETTOP"]
        monthly = [g[m] for m in MONTHS]
        tmin = min(par["T2M"][m] for m in MONTHS)
        silt, clay = soilgrids_mean("silt", s), soilgrids_mean("clay", s)
        out[s["site_id"]] = {
            "gwettop_annual": g["ANN"], "gwettop_max_month": max(monthly), "gwettop_min_month": min(monthly),
            "t2m_mean_coldest_month_C": tmin,
            "volatile_class": volatile_class(g["ANN"], max(monthly), tmin),
            "silt_g_kg": round(silt, 1), "clay_g_kg": round(clay, 1),
            "fine_fraction": round((silt + clay) / 1000, 3),
        }
        print(s["site_id"], out[s["site_id"]], file=sys.stderr, flush=True)
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
