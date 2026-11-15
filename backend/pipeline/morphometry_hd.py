#!/usr/bin/env python3
"""
morphometry_hd.py — Eje 9 del ILS fuera de los cráteres: razón altura/diámetro (h/D) de domos y conos.

Se aplica la MISMA regla en la Tierra y en la Luna, sobre una malla común (60 m por defecto,
la resolución de SLDEM2015) creada con slope_fsafe.resample_to_common_grid:

  dome   Un solo domo. Cima = punto más alto a menos de --search-m del centro dado.
         Perfil radial = mediana de 16 sectores. Base z_b = percentil 25 del anillo
         [0.8·R_max, R_max] (lado más bajo: la planicie). h = z_cima − z_b.
         Radio basal = primer radio donde el perfil baja a z_b + 0.1·h. D = 2·radio basal.

  cones  Campo de conos dentro de un cuadrado de lado 2·--half-m. Candidatos = máximos locales
         en ventanas de 1.2 km. Para cada uno, en 8 azimuts: radio basal = primer radio, después
         de la pendiente máxima, donde la pendiente del perfil cae bajo 5°. Se aceptan conos con
         h ≥ 30 m, 300 m ≤ D ≤ 3 km, pendiente máxima del flanco ≥ 8° y radios basales
         consistentes (coeficiente de variación ≤ 0.35). Valor = mediana de h/D.

Entradas: DEM en grados (Tierra, --lonlat) o DTM proyectado en metros (Luna, --moon-lonlat);
SLDEM2015 en km se pasa con --z-scale 1000 (o ya convertido a metros).

Uso:
  python pipeline/morphometry_hd.py dome  DEM --lonlat LON LAT --search-m 1500 --rmax-m 4000
  python pipeline/morphometry_hd.py cones DEM --moon-lonlat LON LAT --half-m 40000
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np
from scipy.ndimage import maximum_filter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from slope_fsafe import resample_to_common_grid  # noqa: E402


def sector_profiles(z, r0, c0, res, rmax, n_sectors):
    rows, cols = np.indices(z.shape)
    dy, dx = (rows - r0) * res, (cols - c0) * res
    d = np.hypot(dx, dy)
    az = (np.degrees(np.arctan2(dx, -dy)) % 360) // (360 / n_sectors)
    nb = int(rmax // res)
    prof = np.full((n_sectors, nb), np.nan)
    ring = np.minimum((d // res).astype(int), nb)
    ok = np.isfinite(z) & (ring < nb)
    for s in range(n_sectors):
        m = ok & (az == s)
        for b in np.unique(ring[m]):
            prof[s, b] = np.median(z[m & (ring == b)])
    return prof, (np.arange(nb) + 0.5) * res


def measure_dome(z, res, center_rc, search_m, rmax_m):
    rows, cols = np.indices(z.shape)
    near = np.hypot(rows - center_rc[0], cols - center_rc[1]) * res <= search_m
    r0, c0 = np.unravel_index(np.nanargmax(np.where(near, z, -np.inf)), z.shape)
    prof, r = sector_profiles(z, r0, c0, res, rmax_m, 16)
    p = np.nanmedian(prof, axis=0)
    zs = float(z[r0, c0])
    d = np.hypot(rows - r0, cols - c0) * res
    ann = (d >= 0.8 * rmax_m) & (d <= rmax_m) & np.isfinite(z)
    zb = float(np.percentile(z[ann], 25))
    h = zs - zb
    below = np.nonzero(p <= zb + 0.1 * h)[0]
    if h <= 0 or below.size == 0:
        raise SystemExit("No se encontró la base del domo dentro de --rmax-m.")
    rb = float(r[below[0]])
    sector_rb = [float(r[np.nonzero(ps <= zb + 0.1 * h)[0][0]]) for ps in prof if np.any(ps <= zb + 0.1 * h)]
    return {"summit_elev_m": round(zs, 1), "base_elev_m": round(zb, 1), "height_m": round(h, 1),
            "basal_diameter_m": round(2 * rb), "h_over_D": round(h / (2 * rb), 4),
            "basal_radius_cv": round(float(np.std(sector_rb) / np.mean(sector_rb)), 3), "summit_rc": [int(r0), int(c0)]}


def measure_cones(z, res, half_m):
    win = max(3, int(round(1200 / res)) | 1)
    peaks = np.argwhere((z == maximum_filter(np.nan_to_num(z, nan=-1e9), size=win)) & np.isfinite(z))
    edge = int(1800 / res) + 1
    cones = []
    for r0, c0 in peaks:
        if min(r0, c0, z.shape[0] - 1 - r0, z.shape[1] - 1 - c0) < edge:
            continue
        prof, r = sector_profiles(z[r0 - edge:r0 + edge + 1, c0 - edge:c0 + edge + 1], edge, edge, res, 1800, 8)
        zs = float(z[r0, c0])
        rbs, slopes_max, hs = [], [], []
        for ps in prof:
            ok = np.isfinite(ps)
            if ok.sum() < 0.8 * ps.size:
                break
            ps = np.interp(r, r[ok], ps[ok])  # anillos vacíos cerca de la cima
            ps[0] = zs
            s = -np.gradient(ps, res)
            k = int(np.argmax(s))
            flat = np.nonzero((np.arange(s.size) > k) & (s < math.tan(math.radians(5))))[0]
            if flat.size == 0:
                break
            rbs.append(r[flat[0]]); slopes_max.append(math.degrees(math.atan(s[k]))); hs.append(zs - ps[flat[0]])
        if len(rbs) < 8:
            continue
        h, D = float(np.mean(hs)), 2 * float(np.mean(rbs))
        cv = float(np.std(rbs) / np.mean(rbs))
        if h >= 30 and 300 <= D <= 3000 and np.median(slopes_max) >= 8 and cv <= 0.35:
            cones.append({"rc": [int(r0), int(c0)], "height_m": round(h, 1), "basal_diameter_m": round(D),
                          "h_over_D": round(h / D, 4), "max_flank_slope_deg": round(float(np.median(slopes_max)), 1),
                          "basal_radius_cv": round(cv, 3)})
    if not cones:
        return {"n_cones": 0}
    hd = np.array([c["h_over_D"] for c in cones])
    return {"n_cones": len(cones), "h_over_D_median": round(float(np.median(hd)), 4),
            "h_over_D_p25_p75": [round(float(v), 4) for v in np.percentile(hd, [25, 75])],
            "cones": sorted(cones, key=lambda c: -c["height_m"])[:15]}


def main() -> None:
    p = argparse.ArgumentParser(description="h/D de domos y conos sobre malla común")
    p.add_argument("mode", choices=("dome", "cones"))
    p.add_argument("dem")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--lonlat", nargs=2, type=float)
    g.add_argument("--moon-lonlat", nargs=2, type=float)
    p.add_argument("--res", type=float, default=60.0)
    p.add_argument("--z-scale", type=float, default=1.0)
    p.add_argument("--search-m", type=float, default=1500)
    p.add_argument("--rmax-m", type=float, default=4000)
    p.add_argument("--half-m", type=float, default=20000)
    args = p.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    kind = "lonlat" if args.lonlat else "moon_lonlat"
    center = tuple(args.lonlat or args.moon_lonlat)
    extent = args.search_m + args.rmax_m if args.mode == "dome" else args.half_m
    z, tr, cxy, info = resample_to_common_grid(args.dem, center, kind, extent, args.res, z_scale=args.z_scale)
    crc = ((tr.f - cxy[1]) / abs(tr.e), (cxy[0] - tr.c) / tr.a)
    res = measure_dome(z, args.res, crc, args.search_m, args.rmax_m) if args.mode == "dome" else measure_cones(z, args.res, args.half_m)
    print(json.dumps({**res, "res_m": args.res, "native_res_m": info["native_res_m"], "mode": args.mode}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
