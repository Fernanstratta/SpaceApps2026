#!/usr/bin/env python3
"""
diviner_lunar.py — Ejes 4 (albedo) y 5 (amplitud térmica) del ILS, lado lunar, con LRO Diviner.

Todo viene del bundle PDS4 urn:nasa:pds:lro_diviner_derived1 (PDS Geosciences, sin cuenta).
Los archivos pesan de 150 MB a 2 GB, así que el script solo pide por HTTP Range los bytes
que caen en cada AOI de pipeline/catalog/moon-sites.json.

Eje 5, ΔT (K):
  - Sitios no polares: GCP (Williams et al. 2017), tabla de celdas de 0.5° × 0.5° con la
    temperatura bolométrica media en 96 intervalos de 0.25 h de hora local (2009–2015).
    ΔT = T_max − T_min de la curva diurna media en la celda que contiene el centro del AOI.
    Una celda mide ~15 km: es un valor de contexto regional, más grande que el AOI.
  - Polo (|lat| > 80°): PCP (Williams et al. 2019), temperatura bolométrica a 240 m por hora
    local, separada en verano e invierno (2009–2019). Por estación se promedia el AOI en cada
    hora; ΔT = media de las dos amplitudes diurnas (T_max − T_min de cada estación), que es la
    misma idea que la media anual de la amplitud diaria de MODIS en la Tierra. También se
    reportan los extremos anuales (máximo de verano − mínimo de invierno).

Eje 4, albedo:
  - GDR L2 (mapas de ~14 días, diurnos): reflectancia del canal 1 (0.35–2.8 µm, "VB1",
    I/F observado en nadir) y hora local de cada píxel. Se usan solo los mapas en que el sitio
    se observó a menos de --noon-window horas del mediodía. La reflectancia se normaliza a
    incidencia cero con la ley de Lommel–Seeliger (emisión en nadir):
        A = (I/F) · (1 + cos i) / (2 cos i),   cos i = cos(lat) · cos(15° · (hora − 12))
    Valor del sitio = mediana entre mapas de la media del AOI (píxeles de 128 ppd ≈ 237 m),
    descartando mapas a más de 3·MAD de la mediana (calibración temprana o saturación).
  - Polo: con el Sol a < 2° sobre el horizonte, "cerca del mediodía" no existe y la
    normalización diverge. El script no inventa un albedo polar: lo reporta como no medible.

Uso:
  python pipeline/diviner_lunar.py                      # los 5 sitios lunares
  python pipeline/diviner_lunar.py --sites linne --noon-window 1.0

Requiere: numpy (pip install -r pipeline/requirements.txt)
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np

BASE = "https://pds-geosciences.wustl.edu/lro/urn-nasa-pds-lro_diviner_derived1"
CATALOG = Path(__file__).resolve().parent / "catalog" / "moon-sites.json"
R_MOON = 1737400.0
MISSING = -32768
POLAR_LAT = 80.0

# GCP: filas ASCII fijas de 113 bytes, orden longitud → latitud → 96 horas locales.
GCP_ROW = 113
GCP_LT_BINS = 96
GCP_LAT_BANDS = 20  # celdas de 0.5° por banda de 10°
# PCP: filas ASCII fijas de 59 bytes "x, y, clon, clat, tbol", ordenadas por x.
PCP_ROW = 59


def http_range(url: str, start: int, end: int, attempts: int = 5) -> bytes:
    """Bytes [start, end] de url (inclusive), con reintentos ante cortes del servidor."""
    for i in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"Range": f"bytes={start}-{end}"})
            with urllib.request.urlopen(req, timeout=120) as r:
                data = r.read()
            if len(data) == end - start + 1:
                return data
        except (urllib.error.URLError, TimeoutError, ConnectionError):
            pass
        time.sleep(2 ** i)
    raise RuntimeError(f"No se pudo leer {url} [{start}-{end}]")


def http_text(url: str) -> str:
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read().decode("utf-8", "replace")


def label_value(label: str, key: str) -> str:
    m = re.search(rf"^\s*{key}\s*=\s*\"?([^\"\n]+)", label, re.M)
    if not m:
        raise ValueError(f"Falta {key} en la etiqueta PDS")
    return m.group(1).strip().split()[0]


# ---------------------------------------------------------------------------
# Eje 5 — GCP (sitios no polares)
# ---------------------------------------------------------------------------

def gcp_band_file(lat: float) -> tuple[str, int]:
    """Archivo GCP de la banda de 10° que contiene lat, y la latitud sur de la banda."""
    lo = math.floor(lat / 10) * 10
    hi = lo + 10
    tag = lambda v, hemi: f"{abs(v):02d}{hemi}"
    name = f"{tag(lo, 'n')}{tag(hi, 'n')}" if lo >= 0 else f"{tag(lo, 's')}{tag(hi, 's')}"
    return f"global_cumul_avg_cyl_{name}_002.tab", lo


def gcp_diurnal_curve(lon: float, lat: float) -> tuple[np.ndarray, np.ndarray, dict]:
    lon = ((lon + 180) % 360) - 180
    fname, lat_min = gcp_band_file(lat)
    ilon, ilat = int((lon + 180) // 0.5), int((lat - lat_min) // 0.5)
    first = ((ilon * GCP_LAT_BANDS) + ilat) * GCP_LT_BINS + 1  # +1: fila de encabezado
    raw = http_range(f"{BASE}/data_derived_gcp/{fname}", first * GCP_ROW, (first + GCP_LT_BINS) * GCP_ROW - 1)
    rows = [r.split(",") for r in raw.decode().strip().splitlines()]
    clon, clat = float(rows[0][0]), float(rows[0][1])
    if abs(clon - lon) > 0.25 or abs(clat - lat) > 0.25:
        raise ValueError(f"La celda GCP leída ({clon}, {clat}) no corresponde a ({lon}, {lat})")
    lt = np.array([float(r[2]) for r in rows])
    tbol = np.array([float(r[10]) for r in rows])
    ok = tbol > 0
    return lt[ok], tbol[ok], {"cell_center": [clon, clat], "file": fname}


def thermal_gcp(site: dict) -> dict:
    lt, t, info = gcp_diurnal_curve(site["lon"], site["lat"])
    if lt.size < 48:
        raise ValueError(f"{site['site_id']}: curva diurna GCP incompleta ({lt.size} de 96 horas)")
    near = lambda h: float(t[np.argmin(np.abs(lt - h))])
    return {
        "delta_T": round(float(t.max() - t.min()), 1),
        "T_max": round(float(t.max()), 1), "T_max_hour": float(lt[np.argmax(t)]),
        "T_min": round(float(t.min()), 1), "T_min_hour": float(lt[np.argmin(t)]),
        "T_noon_minus_T_0530": round(near(12.0) - near(5.5), 1),
        "local_time_bins": int(lt.size), "product": "GCP 0.5°", **info,
    }


# ---------------------------------------------------------------------------
# Eje 5 — PCP (polo)
# ---------------------------------------------------------------------------

def polar_xy(lon: float, lat: float) -> tuple[float, float]:
    """Coordenadas estereográficas polares normalizadas por R (convención de PCP)."""
    rho = 2 * math.tan(math.radians(90 - abs(lat)) / 2)
    return rho * math.sin(math.radians(lon)), rho * math.cos(math.radians(lon))


def pcp_aoi_mean(url: str, x0: float, y0: float, r: float) -> float | None:
    n_rows = int(label_value(http_text(url[:-4] + ".lbl"), "FILE_RECORDS")) - 1
    x_at = lambda i: float(http_range(url, (i + 1) * PCP_ROW, (i + 2) * PCP_ROW - 1).split(b",")[0])
    lo, hi = 0, n_rows - 1
    while lo < hi:  # primera fila con x ≥ x0 − r
        mid = (lo + hi) // 2
        if x_at(mid) < x0 - r:
            lo = mid + 1
        else:
            hi = mid
    vals, start, chunk = [], lo, 4000
    while start < n_rows:
        raw = http_range(url, (start + 1) * PCP_ROW, (min(start + chunk, n_rows) + 1) * PCP_ROW - 1)
        arr = np.array([[float(v) for v in row.split(",")] for row in raw.decode().strip().splitlines()])
        inside = np.hypot(arr[:, 0] - x0, arr[:, 1] - y0) <= r
        vals.extend(arr[inside, 4][arr[inside, 4] > 0])
        if arr[-1, 0] > x0 + r:
            break
        start += chunk
    return float(np.mean(vals)) if vals else None


def thermal_pcp(site: dict, workers: int) -> dict:
    hemi = "pols" if site["lat"] < 0 else "poln"
    x0, y0 = polar_xy(site["lon"], site["lat"])
    r = site["aoi"]["radius_m"] / R_MOON
    jobs = [(season, h) for season in ("sum", "win") for h in range(1, 25)]
    url = lambda s, h: f"{BASE}/data_derived_pcp/diurnal/ltim/{hemi}/pcp_avg_tbol_{hemi}_{s}_ltim{h:02d}_240.tab"
    with ThreadPoolExecutor(workers) as ex:
        means = list(ex.map(lambda j: pcp_aoi_mean(url(*j), x0, y0, r), jobs))
    curves = {s: {h: m for (ss, h), m in zip(jobs, means) if ss == s and m is not None} for s in ("sum", "win")}
    amp = {s: max(c.values()) - min(c.values()) for s, c in curves.items() if len(c) >= 12}
    if not amp:
        raise ValueError(f"{site['site_id']}: PCP sin datos suficientes en el AOI")
    return {
        "delta_T": round(float(np.mean(list(amp.values()))), 1),
        "delta_T_by_season": {s: round(v, 1) for s, v in amp.items()},
        "T_max_summer": round(max(curves["sum"].values()), 1) if curves["sum"] else None,
        "T_min_winter": round(min(curves["win"].values()), 1) if curves["win"] else None,
        "annual_extreme_range": (round(max(curves["sum"].values()) - min(curves["win"].values()), 1)
                                 if curves["sum"] and curves["win"] else None),
        "hours_with_data": {s: len(c) for s, c in curves.items()},
        "product": "PCP 240 m (verano e invierno, 24 horas locales)",
    }


# ---------------------------------------------------------------------------
# Eje 4 — GDR L2 VB1 cerca del mediodía
# ---------------------------------------------------------------------------

def gdr_day_maps(inventory_csv: str) -> list[str]:
    dates = sorted(set(re.findall(r"dgdr_vb1_avg_cyl_(\d{8})d_128_img", inventory_csv)))
    return dates


def gdr_url(date: str, var: str, ppd: int) -> str:
    return f"{BASE}/data_derived_gdr_l2/{date[:4]}/cylindrical/img/dgdr_{var}_avg_cyl_{date}d_{ppd:03d}_img.img"


def gdr_rows(date: str, var: str, ppd: int, row0: int, row1: int) -> np.ndarray:
    ns = 360 * ppd
    raw = http_range(gdr_url(date, var, ppd), row0 * ns * 2, (row1 + 1) * ns * 2 - 1)
    return np.frombuffer(raw, "<i2").reshape(-1, ns)


def site_rowcol(lon: float, lat: float, ppd: int) -> tuple[float, float]:
    return (90 - lat) * ppd, (lon % 360) * ppd   # mapas de 0° a 360° E, 90° N arriba


LTIM_SCALE, LTIM_OFFSET, VB_SCALE = 0.0833333333, 2730.00273000273, 1e-4


def local_time_at(date: str, lon: float, lat: float) -> float | None:
    r, c = site_rowcol(lon, lat, 4)
    a = gdr_rows(date, "ltim", 4, int(r), int(r))[0]
    cols = [int(c) % 1440, (int(c) + 1) % 1440, (int(c) - 1) % 1440]
    vals = [a[k] for k in cols if a[k] != MISSING]
    return float(vals[0] * LTIM_SCALE + LTIM_OFFSET) if vals else None


def albedo_map(date: str, site: dict, hour: float) -> dict | None:
    ppd = 128
    lat, lon, rad = site["lat"], site["lon"], site["aoi"]["radius_m"]
    r, c = site_rowcol(lon, lat, ppd)
    dr = rad / (2 * math.pi * R_MOON / 360 / ppd)
    row0, row1 = int(math.floor(r - dr - 1)), int(math.ceil(r + dr + 1))
    a = gdr_rows(date, "vb1", ppd, row0, row1)
    dc = dr / max(math.cos(math.radians(lat)), 1e-6)
    cols = np.arange(int(math.floor(c - dc - 1)), int(math.ceil(c + dc + 1)) + 1)
    block = a[:, cols % (360 * ppd)].astype(float)
    rr, cc = np.meshgrid(np.arange(row0, row1 + 1) + 0.5, cols + 0.5, indexing="ij")
    dy = (rr - r) * (2 * math.pi * R_MOON / 360 / ppd)
    dx = (cc - c) * (2 * math.pi * R_MOON / 360 / ppd) * math.cos(math.radians(lat))
    inside = np.hypot(dx, dy) <= rad
    ok = inside & (block != MISSING)
    if ok.sum() < max(3, 0.3 * inside.sum()):
        return None
    iof = block[ok] * VB_SCALE
    cos_i = math.cos(math.radians(lat)) * math.cos(math.radians(15 * (hour - 12)))
    normalized = iof * (1 + cos_i) / (2 * cos_i)
    return {"date": date, "local_time": round(hour, 2), "pixels": int(ok.sum()),
            "coverage": round(float(ok.sum() / inside.sum()), 3),
            "iof_mean": round(float(iof.mean()), 4), "albedo_mean": round(float(normalized.mean()), 4)}


def albedo_gdr(site: dict, dates: list[str], window_h: float, workers: int) -> dict:
    if abs(site["lat"]) > POLAR_LAT:
        return {"albedo": None, "reason": "Iluminación rasante en el polo (Sol < 2° sobre el horizonte): "
                "no hay observación cerca del mediodía y la normalización por incidencia diverge."}
    with ThreadPoolExecutor(workers) as ex:
        hours = list(ex.map(lambda d: local_time_at(d, site["lon"], site["lat"]), dates))
    picks = [(d, h) for d, h in zip(dates, hours) if h is not None and abs(h - 12) <= window_h]
    with ThreadPoolExecutor(workers) as ex:
        maps = [m for m in ex.map(lambda dh: albedo_map(dh[0], site, dh[1]), picks) if m]
    if not maps:
        return {"albedo": None, "reason": f"Sin mapas GDR L2 de 128 ppd con el AOI cubierto a ±{window_h} h del mediodía",
                "candidate_maps": len(picks)}
    # Mapas atípicos (calibración temprana, saturación): fuera de 3·MAD de la mediana.
    all_vals = np.array([m["albedo_mean"] for m in maps])
    med = np.median(all_vals)
    mad = max(1.4826 * np.median(np.abs(all_vals - med)), 0.05 * med)
    keep = [m for m in maps if abs(m["albedo_mean"] - med) <= 3 * mad]
    vals = [m["albedo_mean"] for m in keep]
    return {"albedo": round(float(np.median(vals)), 4),
            "iof_median": round(float(np.median([m["iof_mean"] for m in keep])), 4),
            "albedo_range": [min(vals), max(vals)], "n_maps": len(keep), "rejected_maps": len(maps) - len(keep),
            "candidate_maps": len(picks), "maps": maps, "product": "GDR L2 VB1 128 ppd"}


def main() -> None:
    p = argparse.ArgumentParser(description="Albedo (eje 4) y ΔT (eje 5) de Diviner por AOI lunar")
    p.add_argument("--sites", nargs="*")
    p.add_argument("--noon-window", type=float, default=1.5, help="Horas alrededor del mediodía (por defecto 1.5)")
    p.add_argument("--workers", type=int, default=6)
    args = p.parse_args()
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8")

    sites = [s for s in json.loads(CATALOG.read_text(encoding="utf-8"))
             if s["body"] == "moon" and (not args.sites or s["site_id"] in args.sites)]
    inventory = http_text(f"{BASE}/data_derived_gdr_l2/collection_data_derived_gdr_level2_inventory.csv")
    dates = gdr_day_maps(inventory)
    print(f"GDR L2: {len(dates)} mapas diurnos de 128 ppd", file=sys.stderr)

    result = {}
    for s in sites:
        polar = abs(s["lat"]) > POLAR_LAT
        thermal = thermal_pcp(s, args.workers) if polar else thermal_gcp(s)
        albedo = albedo_gdr(s, dates, args.noon_window, args.workers)
        result[s["site_id"]] = {"thermal": thermal, "albedo": albedo,
                                "aoi": {"lat": s["lat"], "lon": s["lon"], "radius_m": s["aoi"]["radius_m"]}}
        print(f"{s['site_id']}: ΔT={thermal['delta_T']} K  albedo={albedo.get('albedo')} "
              f"({albedo.get('n_maps', 0)} mapas)", file=sys.stderr, flush=True)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
