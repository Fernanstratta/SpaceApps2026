#!/usr/bin/env python3
"""
slope_fsafe.py — Eje 1 del ILS: fracción del AOI con pendiente < umbral (f_safe),
calculada SIEMPRE sobre una malla común en metros (30 m por defecto).

Regla del eje 1: la pendiente depende de la escala, así que la Tierra y la Luna
se comparan a la misma resolución efectiva. El script:

  1. Recorta el DEM alrededor del AOI (con margen) para no cargar el mosaico entero.
  2. Re-proyecta a una proyección métrica y re-muestrea a --res metros:
       - Tierra (DEM en grados, p. ej. Copernicus GLO-30): UTM automático por longitud.
       - Luna (NAC DTM, SLDEM2015, LOLA): el DTM ya viene en metros; se conserva su CRS.
     Para bajar resolución se usa promedio por área (Resampling.average), que es lo
     que "ve" un sensor de píxel más grande. Subir resolución NO crea detalle: si el
     DEM nativo es más grueso que --res, el script se detiene (ver --allow-upsample).
  3. Calcula la pendiente con el método de Horn (ventana 3×3) sobre la malla común.
  4. Devuelve f_safe y estadísticas dentro de un círculo de radio --radius-m.

Requiere: numpy, rasterio  (pip install -r pipeline/requirements.txt)

Ejemplos:
  # Tierra: Copernicus DEM GLO-30 (grados) → UTM a 30 m
  python pipeline/slope_fsafe.py Copernicus_DSM_COG_10_N32_00_W116_00_DEM.tif \
      --lonlat -115.65 32.36 --radius-m 5000

  # Luna: LROC NAC DTM (PDS3 .IMG, metros) → 30 m. --moon-lonlat convierte lat/lon
  # con la esfera lunar del propio DTM; --xy recibe metros en su CRS.
  python pipeline/slope_fsafe.py NAC_DTM_LINNECRATER_E277N0118.IMG \
      --moon-lonlat 11.79 27.73 --radius-m 1650

  # Descarga el DTM antes de medir. Leerlo en remoto (/vsicurl/) no es fiable: cuando el
  # servidor de LROC limita las peticiones (HTTP 429), GDAL puede devolver bloques en 0.

  # Par sin cobertura NAC del AOI: SLDEM2015 (~59 m/px). Ambos lados a la MISMA malla:
  python pipeline/slope_fsafe.py SLDEM2015_512_00N_30N_000_045_FLOAT.IMG --z-scale 1000 \n      --moon-lonlat LON LAT --radius-m 5000 --res 60
  python pipeline/slope_fsafe.py copernicus.tif --lonlat LON LAT --radius-m 5000 --res 60
"""

from __future__ import annotations

import argparse
import json
import math

import numpy as np
import rasterio
from rasterio.crs import CRS
from rasterio.enums import Resampling
from rasterio.transform import from_origin
from rasterio.warp import reproject, transform as warp_transform
from rasterio.windows import from_bounds

# Margen extra alrededor del AOI para que la ventana 3×3 del borde tenga vecinos.
MARGIN_PX = 3
# Los DTM de PDS marcan sin dato con valores especiales cercanos a −3.4e38 (NULL, LRS, HRS…).
PDS_SPECIAL_BELOW = -1e30


def body_geographic_crs(crs: CRS) -> CRS:
    """CRS geográfico (lon/lat) sobre la misma esfera o elipsoide que un DTM proyectado."""
    params = crs.to_dict()
    if "R" in params:
        return CRS.from_proj4(f"+proj=longlat +R={params['R']} +no_defs")
    if "a" in params:
        return CRS.from_proj4(f"+proj=longlat +a={params['a']} +b={params.get('b', params['a'])} +no_defs")
    raise SystemExit("No se pudo leer el radio del cuerpo en el CRS del DTM; usa --xy en metros.")


def utm_crs_for(lon: float, lat: float) -> CRS:
    zone = int((lon + 180) // 6) + 1
    return CRS.from_epsg((32600 if lat >= 0 else 32700) + zone)


def native_resolution_m(src, center_xy_src) -> float:
    """Tamaño de píxel nativo en metros (aprox. en el centro si el DEM está en grados)."""
    px, py = abs(src.transform.a), abs(src.transform.e)
    if src.crs is not None and src.crs.is_geographic:
        lat = center_xy_src[1]
        # Radio terrestre medio; solo se usa para DEM terrestres en grados.
        m_per_deg = math.pi * 6371008.8 / 180
        return max(px * m_per_deg * math.cos(math.radians(lat)), py * m_per_deg)
    return max(px, py)


def resample_to_common_grid(path: str, center: tuple[float, float], center_is_lonlat: bool | str,
                            radius_m: float, res_m: float, allow_upsample: bool = False,
                            z_scale: float = 1.0):
    """Devuelve (z, transform, crs, info) en una malla métrica de res_m metros centrada en el AOI.

    center_is_lonlat: True o "lonlat" (Tierra, grados), "moon_lonlat" (grados sobre la esfera
    del DTM proyectado) o False / "xy" (metros en el CRS del DTM).
    z_scale: factor a metros de las alturas (1000 para los tiles SLDEM2015 de PDS, que vienen en km).
    """
    kind = {True: "lonlat", False: "xy"}.get(center_is_lonlat, center_is_lonlat)
    env = rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR",
                       CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif,.TIF,.img,.IMG,.lbl,.LBL")
    with env, rasterio.open(path) as src:
        if src.crs is None:
            raise SystemExit("El DEM no tiene CRS. Revisa la etiqueta (PDS/GeoTIFF) antes de medir.")

        if kind == "moon_lonlat":
            if src.crs.is_geographic:
                raise SystemExit("--moon-lonlat requiere un DTM proyectado en metros.")
            geog = body_geographic_crs(src.crs)
            xs, ys = warp_transform(geog, src.crs, [center[0]], [center[1]])
            center, kind = (xs[0], ys[0]), "xy"
        lunar = kind == "xy"

        if kind == "lonlat":
            if not src.crs.is_geographic and src.crs.to_epsg() is None:
                raise SystemExit("--lonlat es solo para DEM terrestres; para la Luna usa --xy en metros del DTM.")
            lon, lat = center
            dst_crs = utm_crs_for(lon, lat) if src.crs.is_geographic else src.crs
            cx, cy = (warp_transform("EPSG:4326", dst_crs, [lon], [lat]))
            cx, cy = cx[0], cy[0]
            sx, sy = warp_transform("EPSG:4326", src.crs, [lon], [lat])
            center_src = (sx[0], sy[0])
        else:
            if src.crs.is_geographic:
                raise SystemExit("Este DEM está en grados. Para la Luna usa un DTM proyectado en metros "
                                 "(NAC DTM, SLDEM2015 o LOLA proyectados) o re-proyéctalo con gdalwarp.")
            dst_crs = src.crs
            cx, cy = center
            center_src = center

        native = native_resolution_m(src, center_src if src.crs.is_geographic else (cx, cy))
        if native > res_m * 1.05 and not allow_upsample:
            raise SystemExit(
                f"El DEM nativo (~{native:.1f} m/px) es más grueso que la malla pedida ({res_m} m). "
                "Llevarlo a una malla más fina no crea detalle y suavizaría las pendientes. Usa un DTM más fino "
                f"(p. ej. LROC NAC) o compara ambos lados con --res {math.ceil(native)}.")

        # Malla destino: cuadrada, alineada al centro del AOI, con margen para el kernel 3×3.
        half = radius_m + MARGIN_PX * res_m
        n = int(math.ceil(2 * half / res_m))
        dst_transform = from_origin(cx - n * res_m / 2, cy + n * res_m / 2, res_m, res_m)

        # Ventana de lectura en el DEM fuente (con 10% de holgura) para no leer el mosaico entero.
        west, south, east, north = cx - half * 1.1, cy - half * 1.1, cx + half * 1.1, cy + half * 1.1
        if src.crs != dst_crs:
            xs, ys = warp_transform(dst_crs, src.crs, [west, east, west, east], [south, south, north, north])
            west, east, south, north = min(xs), max(xs), min(ys), max(ys)
        window = from_bounds(west, south, east, north, src.transform).round_offsets().round_lengths()
        data = src.read(1, window=window, masked=True, boundless=True, fill_value=src.nodata or -32768)
        src_transform = src.window_transform(window)
        source = data.astype("float32").filled(np.nan)
        source[source < PDS_SPECIAL_BELOW] = np.nan
        if lunar and np.mean(source[np.isfinite(source)] == 0) > 0.01:
            raise SystemExit("Más del 1 % de la ventana vale exactamente 0: bloques vacíos o lectura "
                             "remota incompleta. Descarga el DTM y vuelve a medir.")
        source *= z_scale

        z = np.full((n, n), np.nan, dtype="float64")
        reproject(
            source=source,
            destination=z,
            src_transform=src_transform, src_crs=src.crs, src_nodata=np.nan,
            dst_transform=dst_transform, dst_crs=dst_crs, dst_nodata=np.nan,
            resampling=Resampling.average if native < res_m else Resampling.bilinear,
        )

    info = {"native_res_m": round(native, 2), "res_m": res_m, "crs": dst_crs.to_string(),
            "resampling": "average" if native < res_m else "bilinear"}
    return z, dst_transform, (cx, cy), info


def horn_slope_deg(z: np.ndarray, res_m: float) -> np.ndarray:
    """Pendiente en grados (Horn, 1981). Los bordes y vecinos sin dato quedan en NaN."""
    p = np.pad(z, 1, constant_values=np.nan)
    a, b, c = p[:-2, :-2], p[:-2, 1:-1], p[:-2, 2:]
    d, f = p[1:-1, :-2], p[1:-1, 2:]
    g, h, i = p[2:, :-2], p[2:, 1:-1], p[2:, 2:]
    dzdx = ((c + 2 * f + i) - (a + 2 * d + g)) / (8 * res_m)
    dzdy = ((g + 2 * h + i) - (a + 2 * b + c)) / (8 * res_m)
    return np.degrees(np.arctan(np.hypot(dzdx, dzdy)))


def circle_mask(shape, transform, center_xy, radius_m) -> np.ndarray:
    rows, cols = np.indices(shape)
    xs = transform.c + (cols + 0.5) * transform.a
    ys = transform.f + (rows + 0.5) * transform.e
    return np.hypot(xs - center_xy[0], ys - center_xy[1]) <= radius_m


def measure_fsafe(path: str, center, center_is_lonlat: bool | str, radius_m: float,
                  res_m: float = 30.0, threshold_deg: float = 10.0, allow_upsample: bool = False,
                  min_coverage: float = 0.9, z_scale: float = 1.0) -> dict:
    z, tr, cxy, info = resample_to_common_grid(path, center, center_is_lonlat, radius_m, res_m,
                                               allow_upsample, z_scale)
    slope = horn_slope_deg(z, res_m)
    aoi = circle_mask(z.shape, tr, cxy, radius_m)
    valid = aoi & np.isfinite(slope)
    expected = int(aoi.sum())
    if valid.sum() < min_coverage * expected:
        raise SystemExit(f"Solo {valid.sum()} de {expected} píxeles del AOI tienen dato "
                         f"({valid.sum() / expected:.0%}): el DEM no cubre el AOI completo.")
    s = slope[valid]
    return {
        "f_safe": round(float(np.mean(s < threshold_deg)), 4),
        "threshold_deg": threshold_deg,
        "slope_mean_deg": round(float(s.mean()), 2),
        "slope_p50_deg": round(float(np.percentile(s, 50)), 2),
        "slope_p90_deg": round(float(np.percentile(s, 90)), 2),
        "frac_over_15deg": round(float(np.mean(s > 15)), 4),
        "elev_min_m": round(float(np.nanmin(z[aoi])), 1),
        "elev_max_m": round(float(np.nanmax(z[aoi])), 1),
        "radius_m": radius_m,
        "pixels": int(valid.sum()),
        "coverage": round(float(valid.sum() / expected), 4),
        "method": "Horn 3×3 sobre malla común; bajada de resolución por promedio de área",
        **info,
    }


def main() -> None:
    p = argparse.ArgumentParser(description="f_safe (eje 1) a resolución común")
    p.add_argument("dem")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--lonlat", nargs=2, type=float, metavar=("LON", "LAT"), help="Centro en grados (DEM terrestre)")
    g.add_argument("--moon-lonlat", nargs=2, type=float, metavar=("LON", "LAT"),
                   help="Centro en grados lunares; se proyecta con la esfera del DTM")
    g.add_argument("--xy", nargs=2, type=float, metavar=("X", "Y"), help="Centro en metros del CRS del DTM (Luna)")
    p.add_argument("--radius-m", type=float, required=True, help="Radio del AOI circular (m)")
    p.add_argument("--res", type=float, default=30.0, help="Resolución común en metros (por defecto 30)")
    p.add_argument("--threshold", type=float, default=10.0, help="Umbral de pendiente segura (°)")
    p.add_argument("--min-coverage", type=float, default=0.9,
                   help="Fracción mínima del AOI con dato para aceptar la medición (por defecto 0.9)")
    p.add_argument("--z-scale", type=float, default=1.0,
                   help="Factor de alturas a metros (1000 para SLDEM2015 de PDS, en km)")
    p.add_argument("--allow-upsample", action="store_true",
                   help="Permite subir resolución (no recomendado: suaviza pendientes)")
    args = p.parse_args()

    kind = "lonlat" if args.lonlat else "moon_lonlat" if args.moon_lonlat else "xy"
    center = tuple(args.lonlat or args.moon_lonlat or args.xy)
    result = measure_fsafe(args.dem, center, kind, args.radius_m,
                           args.res, args.threshold, args.allow_upsample, args.min_coverage, args.z_scale)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
