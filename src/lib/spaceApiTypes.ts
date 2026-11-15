export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface DataResponse<T> {
  data: T;
}

export interface HealthResponse {
  status: 'ok';
}

export interface Planet {
  id: string;
  name: string;
  summary: string;
  funFact: string;
  sourceUrl: string;
}

export interface Apod {
  title: string;
  date: string;
  description: string;
  imageUrl: string | null;
  sourceUrl: string;
  credit: string | null;
  source: 'nasa' | 'fallback';
}

export type PlanetsResponse = DataResponse<Planet[]>;
export type ApodResponse = DataResponse<Apod>;

export type ValueStatus = 'measured' | 'literature' | 'reference' | 'placeholder';
export type Confidence = 'A' | 'B' | 'C';
export type SimilarityMode = 'linear' | 'log_ratio';

export interface AxisSideValue {
  value: number;
  status: ValueStatus;
  source: string;
  source_url?: string;
  method?: string;
  observed_at?: string;
  resolution_m?: number;
  /** Valor crudo del instrumento antes de normalizar (ejes 2 y 3). */
  raw?: { value: number; units?: string; instrument?: string };
  /** Cómo se obtuvo `value` a partir de `raw`. */
  normalization?: { method: AxisNormalization; source: string; [detail: string]: unknown };
}

export type AxisNormalization = 'percentile_within_body' | 'absolute_felsic0_mafic1' | 'physical_units';

export interface Metric {
  id: number;
  key: 'slope' | 'roughness' | 'mineralogy' | 'albedo' | 'thermal'
    | 'aridity' | 'ice' | 'dust' | 'craters';
  name_es: string;
  metric: string;
  units: string;
  mode: SimilarityMode;
  normalization: AxisNormalization;
  tolerance_R: number;
  weight: number;
  confidence: Confidence;
  source_plan: { earth: string; moon: string };
}

export interface AnalogAxis extends Metric {
  flag: 'similitud_por_ausencia' | null;
  earth: AxisSideValue | null;
  moon: AxisSideValue | null;
  similarity: number | null;
  available: boolean;
}

interface AnalogSiteSummary {
  site_id: string;
  name: string;
  lat: number;
  lon: number;
  coordinate_status: 'reference' | 'provisional';
}

interface Site extends AnalogSiteSummary {
  region: string;
  type_es: string;
  coordinate_source_url?: string;
  aoi: { shape: 'circle'; radius_m: number; note: string };
  facts: Record<string, number>;
}

export interface EarthSite extends Site {
  body: 'earth';
}

export interface MoonSite extends Site {
  body: 'moon';
}

export interface AnalogPairSummary {
  pair_id: string;
  title_es: string;
  earth_site: AnalogSiteSummary;
  moon_site: AnalogSiteSummary;
  ils: {
    value: number | null;
    formula: string;
    axes_used: number;
    data_completeness: number;
    has_placeholders: boolean;
  };
}

export interface Comparison extends AnalogPairSummary {
  schema_version: string;
  generated_at: string;
  earth_site: EarthSite;
  moon_site: MoonSite;
  axes: AnalogAxis[];
  education: {
    match_es: string;
    hook_es: string;
    breaks_es: { axis: string; text: string }[];
  };
}
