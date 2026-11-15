#!/usr/bin/env python3
"""
crater_dD.py — Mide d/D (profundidad/diámetro) y f_safe (fracción con pendiente
< umbral) de un cráter a partir de un DEM GeoTIFF en proyección MÉTRICA.

Funciona igual para la Tierra (Copernicus DEM re-proyectado a UTM) y para la
Luna (LROC NAC DTM o SLDEM2015 en proyección equirectangular/estereográfica en metros).

Método:
  1. Traza N perfiles radiales desde el centro hasta r_max.
  2. En cada perfil, el borde (rim) es el punto de máxima elevación.
  3. D = 2 * mediana del radio del borde;  borde_z = elevación media del borde.
  4. Fondo = elevación mínima dentro de 0.3 * radio del borde.
  5. d = borde_z - fondo;  d/D = d / D.
  6. Gradiente sobre el DEM. f_safe es la fracción de píxeles válidos
     bajo el umbral dentro del radio de análisis.

Requiere: numpy, rasterio   (pip install numpy rasterio)

Ejemplos:
  # Tierra (centro en lon/lat, el DEM debe estar en UTM):
  python crater_dD.py elegante_utm12.tif --lonlat -113.3913 31.8467 --rmax 1500

  # Luna (centro en coordenadas del mapa, en metros del CRS del DTM):
  python crater_dD.py NAC_DTM_LINNE.tif --xy X Y --rmax 2000 --resample 30 --aoi-radius 1650
"""

from __future__ import annotations

import argparse
import json

import numpy as np
import rasterio
from rasterio.enums import Resampling
from rasterio.vrt import WarpedVRT
from rasterio.warp import transform as warp_transform


def load_dem(path: str, resample_m: float | None, lonlat, xy):
    with rasterio.open(path) as src:
        if not src.crs or not src.crs.is_projected or src.crs.linear_units_factor[1] != 1:
            raise ValueError("Usa un DEM con proyección en metros.")
        transform = src.transform
        pixel_m = transform.a
        if transform.b or transform.d or pixel_m <= 0 or not np.isclose(-transform.e, pixel_m):
            raise ValueError("Usa una cuadrícula orientada al norte con píxeles cuadrados.")
        if resample_m is not None and resample_m < pixel_m - 1e-6:
            raise ValueError("La resolución solicitada es más fina que la nativa del DEM.")
        if resample_m is not None and resample_m > pixel_m + 1e-6:
            ratio = resample_m / pixel_m
            w, h = int(src.width / ratio), int(src.height / ratio)
            if min(w, h) < 3:
                raise ValueError("El DEM es demasiado pequeño para esta resolución.")
            transform = transform * transform.scale(ratio, ratio)
            with WarpedVRT(src, transform=transform, width=w, height=h,
                           resampling=Resampling.average, dtype="float64", nodata=np.nan) as vrt:
                elevations = vrt.read(1, masked=True)
            pixel_m = resample_m
        else:
            elevations = src.read(1, masked=True)
        if min(elevations.shape) < 3:
            raise ValueError("El DEM debe tener al menos 3 × 3 píxeles.")

        if lonlat is not None:
            xs, ys = warp_transform("EPSG:4326", src.crs, [lonlat[0]], [lonlat[1]])
            x, y = xs[0], ys[0]
        else:
            x, y = xy
        col, row = ~transform * (x, y)
        # GDAL entrega coordenadas de esquina. La interpolación usa centros de píxel.
        return elevations.astype("float64").filled(np.nan), pixel_m, col - 0.5, row - 0.5


def bilinear(z, col, row):
    c0, r0 = np.floor(col).astype(int), np.floor(row).astype(int)
    c1, r1 = c0 + 1, r0 + 1
    h, w = z.shape
    ok = (c0 >= 0) & (r0 >= 0) & (c1 < w) & (r1 < h)
    out = np.full(col.shape, np.nan)
    dc, dr = col[ok] - c0[ok], row[ok] - r0[ok]
    out[ok] = (z[r0[ok], c0[ok]] * (1 - dc) * (1 - dr) + z[r0[ok], c1[ok]] * dc * (1 - dr)
               + z[r1[ok], c0[ok]] * (1 - dc) * dr + z[r1[ok], c1[ok]] * dc * dr)
    return out


def measure(z, px, col0, row0, rmax_m, n_profiles=72, slope_deg=10.0, aoi_radius=None):
    radii_m = np.arange(0, rmax_m, px / 2)
    rim_r, rim_z = [], []
    for ang in np.linspace(0, 2 * np.pi, n_profiles, endpoint=False):
        cols = col0 + np.cos(ang) * radii_m / px
        rows = row0 - np.sin(ang) * radii_m / px
        prof = bilinear(z, cols, rows)
        if not np.isfinite(prof).all():
            continue
        i = int(np.argmax(prof))
        if i == 0 or i == len(prof) - 1:
            continue  # el borde no quedó dentro de r_max: perfil descartado
        rim_r.append(radii_m[i])
        rim_z.append(prof[i])
    if len(rim_r) < n_profiles * 0.5:
        raise ValueError("Menos de la mitad de los perfiles encontró borde. Revisa el centro, radio y cobertura.")

    rim_r, rim_z = np.array(rim_r), np.array(rim_z)
    R_rim = float(np.median(rim_r))
    rim_elev = float(np.mean(rim_z))

    rr, cc = np.indices(z.shape)
    dist = np.hypot((cc - col0) * px, (rr - row0) * px)
    floor_samples = z[(dist <= 0.3 * R_rim) & np.isfinite(z)]
    if not floor_samples.size:
        raise ValueError("Faltan elevaciones válidas en el fondo del cráter.")
    floor = float(floor_samples.min())

    D = 2 * R_rim
    d = rim_elev - floor

    gy, gx = np.gradient(z, px)
    slope = np.degrees(np.arctan(np.hypot(gx, gy)))
    radius = aoi_radius if aoi_radius is not None else 1.5 * R_rim
    h, w = z.shape
    if radius / px > min(col0, row0, w - 1 - col0, h - 1 - row0):
        raise ValueError("El círculo de análisis excede la extensión del DEM.")
    in_aoi = dist <= radius
    samples = slope[in_aoi & np.isfinite(slope)]
    if not samples.size:
        raise ValueError("Faltan pendientes válidas en el área de análisis.")
    f_safe = float(np.mean(samples < slope_deg))

    return {
        "diameter_m": round(D, 1),
        "depth_m": round(d, 1),
        "depth_diameter_ratio": round(d / D, 3),
        "rim_radius_std_m": round(float(np.std(rim_r)), 1),
        "rim_elev_m": round(rim_elev, 1),
        "floor_elev_m": round(floor, 1),
        "profiles_used": int(len(rim_r)),
        "pixel_m": round(px, 2),
        "f_safe": round(f_safe, 3),
        "f_safe_threshold_deg": slope_deg,
        "f_safe_aoi_radius_m": round(radius, 1),
        "slope_coverage": round(samples.size / in_aoi.sum(), 4),
        "slope_mean_deg": round(float(samples.mean()), 2),
    }


def main():
    p = argparse.ArgumentParser(description="d/D y pendiente de un cráter desde un DEM")
    p.add_argument("dem")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--lonlat", nargs=2, type=float, metavar=("LON", "LAT"),
                   help="Centro en grados (solo DEM terrestres)")
    g.add_argument("--xy", nargs=2, type=float, metavar=("X", "Y"),
                   help="Centro en metros del CRS del DEM (Luna o Tierra)")
    p.add_argument("--rmax", type=float, required=True, help="Radio máximo de búsqueda del borde (m)")
    p.add_argument("--resample", type=float, default=None,
                   help="Re-muestrear a este tamaño de píxel (m) antes de medir (p. ej. 30)")
    p.add_argument("--aoi-radius", type=float, help="Radio fijo para f_safe (m).")
    p.add_argument("--slope-threshold", type=float, default=10.0)
    p.add_argument("--profiles", type=int, default=72)
    args = p.parse_args()

    for value in (args.rmax, args.resample, args.aoi_radius):
        if value is not None and not (0 < value < np.inf):
            p.error("Los radios y la resolución deben ser positivos y finitos.")
    coords = args.lonlat if args.lonlat is not None else args.xy
    if not all(np.isfinite(coords)) or not (0 < args.slope_threshold <= 90) or args.profiles < 4:
        p.error("Verifica las coordenadas, el umbral de pendiente y el número de perfiles.")
    try:
        z, pixel_m, col, row = load_dem(args.dem, args.resample, args.lonlat, args.xy)
        result = measure(z, pixel_m, col, row, args.rmax, args.profiles,
                         args.slope_threshold, args.aoi_radius)
    except (ValueError, rasterio.errors.RasterioError) as error:
        p.error(str(error))
    print(json.dumps(result, indent=2, ensure_ascii=False, allow_nan=False))


if __name__ == "__main__":
    main()
