import type { z } from 'zod';
import type { analogSchema, earthSchema, planetarySchema, sourceSchema, dimensionSchema, imagerySchema, measurementSchema, weightsSchema, querySchema } from '../lib/analogValidation.js';
export type AnalogComparison = z.infer<typeof analogSchema>;
export type EarthLocation = z.infer<typeof earthSchema>;
export type PlanetaryLocation = z.infer<typeof planetarySchema>;
export type ScientificSource = z.infer<typeof sourceSchema>;
export type SimilarityDimension = z.infer<typeof dimensionSchema>;
export type SatelliteImage = z.infer<typeof imagerySchema>;
export type Measurement = z.infer<typeof measurementSchema>;
export type Weights = z.infer<typeof weightsSchema>;
export type AnalogQuery = z.infer<typeof querySchema>;
export type Planet = PlanetaryLocation['planet'];
export type EvidenceStatus = AnalogComparison['evidenceStatus'];
export interface CollectionResponse<T> { data: T[]; meta: { total: number; page: number; limit: number; version: string }; }
