#!/usr/bin/env python3
"""Genera el catálogo ILS a partir de los registros locales en pipeline/catalog."""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "catalog"
SCHEMA_VERSION = "1.0.0"
STATUSES = {"measured", "literature", "reference", "placeholder"}
FORMULA = "sum(w_i * S_i) / sum(w_i)"

# clave, nombre, métrica, unidades, tolerancia, peso, confianza metodológica
AXES = (
    ("slope", "Pendiente", "f_safe", "fracción con pendiente < 10°", 0.5, 1.5, "A"),
    ("roughness", "Rugosidad superficial", "roughness_percentile", "percentil (0–1)", 1, 1, "B"),
    ("mineralogy", "Composición mineralógica", "mafic_score", "escala félsica–máfica (0–1)", 1, 1.5, "B"),
    ("albedo", "Albedo y reflectancia", "albedo_broadband", "fracción (0–1)", 0.15, 1, "A"),
    ("thermal", "Amplitud térmica día/noche", "delta_T", "K", 10, 1, "A"),
    ("aridity", "Aridez y vegetación", "ndvi_median", "NDVI (−1 a 1)", 0.3, 0.5, "A"),
    ("ice", "Humedad y estabilidad del hielo", "volatile_class", "clase (0–3)", 3, 1, "C"),
    ("dust", "Polvo y regolito fino", "fine_fraction", "fracción de partículas < ~63 µm", 1, 0.75, "C"),
    ("craters", "Morfología de cráteres", "depth_diameter_ratio", "razón profundidad/diámetro (d/D)", 0.2, 1, "B"),
)
SOURCE_PLANS = {
    "slope": ("Copernicus DEM GLO-30", "LOLA o LROC NAC DTM a la misma escala efectiva"),
    "roughness": ("Sentinel-1 GRD IW con población de referencia",
                  "LRO Mini-RF CPR con población de referencia"),
    "mineralogy": ("ASTER GED AG100 o Sentinel-2 L2A, con calibración",
                   "Diviner GDR, Christiansen Feature, con calibración"),
    "albedo": ("Albedo estimado con Sentinel-2 L2A", "Reflectancia solar Diviner GDR"),
    "thermal": ("Amplitud de temperatura superficial de Aqua MODIS MYD11A2",
                "Amplitud de temperatura superficial de Diviner RCP, GCP o PRP"),
    "aridity": ("NDVI de temporada seca de Sentinel-2 L2A", "Referencia didáctica de vegetación"),
    "ice": ("Humedad de suelo SMAP SPL3SMP_E", "Estabilidad térmica según Diviner PRP"),
    "dust": ("Fracción de limo y arcilla de SoilGrids", "Granulometría publicada de muestras lunares"),
    "craters": ("Profundidad y diámetro de DEM o literatura",
                "Profundidad y diámetro de LROC NAC DTM o literatura"),
}
BOUNDS = {"aridity": (-1, 1), "ice": (0, 3), "thermal": (0, math.inf),
          "craters": (0, math.inf)}

# Normalización antes de calcular S_i (sección 4 del contexto ILS):
#  - Eje 2 (radar): Sentinel-1 y Mini-RF miden cosas distintas en bandas distintas, así que el
#    valor crudo se convierte a percentil dentro de una población de referencia de SU cuerpo.
#  - Eje 3 (mineralogía): escala absoluta félsico = 0 → máfico = 1, calibrada con anclas de cada
#    instrumento. Un percentil la destruiría: el basalto debe quedar máfico en los dos cuerpos.
#  - El resto de los ejes se comparan en unidades físicas.
PERCENTILE_AXES = {"roughness"}
CALIBRATED_AXES = {"mineralogy"}
NORMALIZATION = {key: "percentile_within_body" if key in PERCENTILE_AXES
                 else "absolute_felsic0_mafic1" if key in CALIBRATED_AXES else "physical_units"
                 for key, *_ in AXES}
REFERENCE_POPULATIONS = CATALOG / "reference-populations.json"
MIN_POPULATION = 20


def percentile_within_body(raw: float, population: list[float]) -> float:
    """Rango medio: (n_menores + n_iguales/2) / n, en [0, 1]."""
    below = sum(v < raw for v in population)
    equal = sum(v == raw for v in population)
    return (below + equal / 2) / len(population)


def normalize_side(key: str, side: dict | None, body: str, populations: dict) -> dict | None:
    """Convierte side["raw"] al valor normalizado del eje; los registros sin "raw" no cambian."""
    if side is None or "raw" not in side:
        return side
    raw = side["raw"]
    x = raw.get("value") if isinstance(raw, dict) else None
    if type(x) not in (int, float) or not math.isfinite(x):
        raise ValueError(f"{key}: valor crudo inválido ({x})")
    if "value" in side:
        raise ValueError(f"{key}: usa 'raw' o 'value', no ambos")

    if key in PERCENTILE_AXES:
        population = populations.get(key, {}).get(body)
        values = population.get("values", []) if population else []
        if len(values) < MIN_POPULATION or not all(type(v) in (int, float) and math.isfinite(v) for v in values):
            raise ValueError(f"{key}: falta una población de referencia de {body} con ≥ {MIN_POPULATION} valores")
        value = percentile_within_body(x, values)
        normalization = {"method": NORMALIZATION[key], "population": population["name"],
                         "n": len(values), "source": population["source"]}
    elif key in CALIBRATED_AXES:
        cal = side.get("calibration") or {}
        felsic, mafic = cal.get("felsic"), cal.get("mafic")
        if (type(felsic) not in (int, float) or type(mafic) not in (int, float) or felsic == mafic
                or not str(cal.get("source", "")).strip()):
            raise ValueError(f"{key}: la calibración necesita anclas 'felsic', 'mafic' y 'source'")
        value = min(1.0, max(0.0, (x - felsic) / (mafic - felsic)))
        normalization = {"method": NORMALIZATION[key], "felsic": felsic, "mafic": mafic,
                         "source": cal["source"]}
    else:
        raise ValueError(f"{key}: 'raw' solo aplica a ejes con percentil o calibración")
    return {**side, "value": round(value, 4), "normalization": normalization}


def check_value(key: str, side: dict | None) -> None:
    if side is None:
        return
    value = side["value"]
    low, high = BOUNDS.get(key, (0, 1))
    if (type(value) not in (int, float) or not math.isfinite(value)
            or not low <= value <= high
            or (key == "thermal" and value == 0)
            or (key == "ice" and not float(value).is_integer())):
        raise ValueError(f"{key}: valor inválido ({value})")
    if side["status"] not in STATUSES or not side["source"].strip():
        raise ValueError(f"{key}: estado o procedencia inválidos")


def validate_site(site: dict, body: str) -> None:
    if site["body"] != body or not re.fullmatch(r"[a-z0-9_]+", site["site_id"]):
        raise ValueError(f"Identificador o cuerpo inválido para {body}")
    if not (-90 <= site["lat"] <= 90 and -180 <= site["lon"] <= 180):
        raise ValueError(f"Coordenadas inválidas para {body}")
    if site["coordinate_status"] not in {"reference", "provisional"}:
        raise ValueError(f"Estado de coordenadas inválido para {body}")
    aoi = site["aoi"]
    if aoi["shape"] != "circle" or not (0 < aoi["radius_m"] < math.inf):
        raise ValueError(f"Área de análisis inválida para {body}")


def build_pair(comparison: dict, earth_site: dict, moon_site: dict,
               measurements: dict, generated_at: str) -> dict:
    if not re.fullmatch(r"[a-z0-9_]+", comparison["pair_id"]):
        raise ValueError("Identificador de par inválido")
    earth_values = measurements.get(earth_site["site_id"], {})
    moon_values = measurements.get(moon_site["site_id"], {})

    axes = []
    weighted_sum = total_weight = used_weight = 0.0
    axes_used = 0
    has_placeholders = False
    for axis_id, (key, name, metric, units, tolerance, weight, confidence) in enumerate(AXES, 1):
        earth, moon = earth_values.get(key), moon_values.get(key)
        sides = (earth, moon)
        has_placeholders |= any(side is not None and side["status"] == "placeholder" for side in sides)
        available = all(side is not None and side["status"] != "placeholder" for side in sides)
        mode = "log_ratio" if key == "thermal" else "linear"
        score = flag = None
        if available:
            x, y = earth["value"], moon["value"]
            if key == "ice" and x == y == 0:
                weight = 0.5
                flag = "similitud_por_ausencia"
            distance = abs(math.log10(x) - math.log10(y)) if mode == "log_ratio" else abs(x - y)
            limit = math.log10(tolerance) if mode == "log_ratio" else tolerance
            score = 100 * max(0, 1 - distance / limit)
            weighted_sum += score * weight
            used_weight += weight
            axes_used += 1
        total_weight += weight
        earth_source, moon_source = SOURCE_PLANS[key]
        axes.append({
            "id": axis_id, "key": key, "name_es": name, "metric": metric, "units": units,
            "mode": mode, "normalization": NORMALIZATION[key],
            "tolerance_R": tolerance, "weight": weight, "confidence": confidence,
            "source_plan": {"earth": earth_source, "moon": moon_source},
            "flag": flag, "earth": earth, "moon": moon, "available": available,
            "similarity": round(score, 1) if score is not None else None,
        })

    return {
        "schema_version": SCHEMA_VERSION, "generated_at": generated_at,
        **{key: comparison[key] for key in ("pair_id", "title_es", "education")},
        "earth_site": earth_site, "moon_site": moon_site,
        "axes": axes,
        "ils": {
            "value": round(weighted_sum / used_weight, 1) if used_weight else None,
            "formula": FORMULA,
            "axes_used": axes_used,
            "data_completeness": round(used_weight / total_weight, 4),
            "has_placeholders": has_placeholders,
        },
    }


def summarize(pair: dict) -> dict:
    summary = {key: pair[key] for key in ("pair_id", "title_es", "ils")}
    for key in ("earth_site", "moon_site"):
        summary[key] = {field: pair[key][field] for field in
                        ("site_id", "name", "lat", "lon", "coordinate_status")}
    return summary


def load_catalog(generated_at: str) -> list[dict]:
    def read(name: str):
        return json.loads((CATALOG / name).read_text(encoding="utf-8"))

    sites = {}
    for body in ("earth", "moon"):
        for site in read(f"{body}-sites.json"):
            validate_site(site, body)
            site_id = site["site_id"]
            if site_id in sites:
                raise ValueError(f"ID de sitio duplicado: {site_id}")
            sites[site_id] = site

    measurements = read("measurements.json")
    populations = (json.loads(REFERENCE_POPULATIONS.read_text(encoding="utf-8"))
                   if REFERENCE_POPULATIONS.exists() else {})
    axis_keys = {axis[0] for axis in AXES}
    for site_id, values in measurements.items():
        if site_id not in sites:
            raise ValueError(f"Mediciones de sitio desconocido: {site_id}")
        if unknown := values.keys() - axis_keys:
            raise ValueError(f"Ejes desconocidos para {site_id}: {sorted(unknown)}")
        for key in values:
            values[key] = normalize_side(key, values[key], sites[site_id]["body"], populations)
            check_value(key, values[key])

    pairs = []
    for comparison in read("comparisons.json"):
        earth = sites.get(comparison["earth_site_id"])
        moon = sites.get(comparison["moon_site_id"])
        if not earth or earth["body"] != "earth" or not moon or moon["body"] != "moon":
            raise ValueError(f"Sitios inválidos para {comparison['pair_id']}")
        pairs.append(build_pair(comparison, earth, moon, measurements, generated_at))
    if not pairs or len({pair["pair_id"] for pair in pairs}) != len(pairs):
        raise ValueError("El catálogo debe tener pares con identificadores únicos")
    return pairs


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT.parent / "data" / "lunar-analogs")
    parser.add_argument("--generated-at", help="Fecha con zona horaria en ISO-8601 (opcional)")
    args = parser.parse_args()

    timestamp = datetime.fromisoformat(args.generated_at) if args.generated_at else datetime.now(timezone.utc)
    if timestamp.tzinfo is None:
        parser.error("--generated-at requiere una zona horaria")
    generated_at = timestamp.astimezone(timezone.utc).isoformat(timespec="seconds")
    try:
        pairs = load_catalog(generated_at)
    except (KeyError, OSError, TypeError, ValueError) as error:
        parser.error(str(error))

    outputs = [(Path("pairs") / f"{p['pair_id']}.json", p) for p in pairs]
    outputs.append((Path("index.json"), [summarize(p) for p in pairs]))
    serialized = [(args.out / path, json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + "\n")
                  for path, data in outputs]
    for path, data in serialized:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(data, encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")  # la consola de Windows (cp1252) no imprime "→"
    print(f"{len(pairs)} pares ILS → {args.out}")


if __name__ == "__main__":
    main()
