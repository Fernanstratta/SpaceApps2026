import { z } from 'zod';

export const dimensionNames = ['geology', 'terrain', 'environment', 'materials', 'water', 'operations', 'subsurface'] as const;
export const planetSchema = z.enum(['Moon', 'Mars']);
export const confidenceSchema = z.enum(['low', 'medium', 'high']);
export const statusSchema = z.enum(['verified', 'interpreted', 'modeled', 'hypothesis']);
const refs = z.array(z.string().min(1)).min(1);
export const claimSchema = z.object({ text: z.string().min(1), sourceIds: refs, status: statusSchema }).strict();
export const sourceSchema = z.object({
  id: z.string(), title: z.string(), organization: z.string(), url: z.url(), doi: z.string().nullable(),
  datasetId: z.string().nullable(), accessedAt: z.iso.date(), kind: z.enum(['primary-research', 'official-summary', 'dataset', 'portal']),
  accessStatus: z.enum(['accessed', 'metadata-only', 'unavailable']), limitations: z.string(),
  temporalCoverage: z.string().nullable(), spatialResolution: z.string().nullable(), geographicCoverage: z.string(),
  variables: z.array(z.string()), accessMethod: z.string(), license: z.string(), attribution: z.string(),
}).strict();
export const measurementSchema = z.object({
  id: z.string(), variable: z.string(), value: z.number().finite().nullable(), unit: z.string(),
  status: statusSchema, sourceIds: refs, observedAt: z.string().nullable(), footprint: z.string(),
  resolution: z.string().nullable(), uncertainty: z.string(), method: z.string(),
}).strict();
const latitude = z.number().finite().min(-90).max(90);
export const earthSchema = z.object({
  id: z.string(), name: z.string(), country: z.string(), state: z.string(), municipality: z.string().nullable(),
  region: z.string(), latitude, longitude: z.number().finite().min(-180).max(180),
  coordinateSystem: z.literal('EPSG:4326'), coordinateRole: z.string(), coordinateSourceIds: refs,
  coordinateUncertainty: z.string(), boundary: z.null(), description: claimSchema,
  measurements: z.array(measurementSchema), qualityFlags: z.array(z.string()),
}).strict();
export const planetarySchema = z.object({
  id: z.string(), name: z.string(), planet: planetSchema, latitude, longitude: z.number().finite().min(0).lt(360),
  coordinateSystem: z.string(), longitudeDirection: z.literal('east-positive'), latitudeType: z.enum(['planetocentric', 'source-unspecified']),
  coordinateRole: z.string(), coordinateSourceIds: refs, coordinateUncertainty: z.string(),
  description: claimSchema, qualityFlags: z.array(z.string()),
}).strict();
export const dimensionSchema = z.object({
  name: z.enum(dimensionNames), score: z.number().min(0).max(100).nullable(), confidence: confidenceSchema,
  explanation: z.string(), sourceIds: refs, measurementIds: z.array(z.string()),
  method: z.enum(['unscored', 'normalized-distance', 'jaccard', 'expert-preliminary']),
}).strict();
export const analogSchema = z.object({
  id: z.string(), earthLocationId: z.string(), planetaryLocationId: z.string(), title: z.string(), summary: z.string(),
  analogType: z.array(z.enum(['environmental', 'geological', 'process', 'operational'])).min(1),
  dimensions: z.array(dimensionSchema).length(7), overallScore: z.number().min(0).max(100).nullable(),
  scoringMethod: z.string(), similarities: z.array(claimSchema), differences: z.array(claimSchema),
  explorationApplications: z.array(z.string()), evidenceStatus: statusSchema, sourceIds: refs,
  researchConfidence: confidenceSchema, researchPriority: z.number().int().positive(), priorityReason: z.string(),
  alternativeMatches: z.array(z.object({name: z.string(), decision: z.string(), sourceIds: refs}).strict()),
  educational: z.object({
    headline: z.string(), summary30: z.string(), explanation: z.string(), youngExplorers: z.string(),
    students: z.string(), advanced: z.string(), facts: z.array(claimSchema).length(3), whyItMatters: z.string(),
    analogyBreakdown: z.string(), sourceIds: refs,
    quiz: z.object({ question: z.string(), options: z.array(z.string()).length(4), answerIndex: z.number().int().min(0).max(3), explanation: z.string() }).strict(),
  }).strict(),
  experiment: z.object({ title: z.string(), steps: z.array(z.string()), measurements: z.array(z.string()), outcomeLabel: z.literal('Educational scenario; not a real mission prediction'), limitations: z.string() }).strict(),
  imageryIds: z.array(z.string()), qualityFlags: z.array(z.string()),
}).strict();
export const imagerySchema = z.object({
  id: z.string(), locationId: z.string(), body: z.enum(['Earth','Moon','Mars']), product: z.string(),
  productId: z.string().nullable(), url: z.url(), previewUrl: z.url().nullable(), acquiredAt: z.string().nullable(),
  spatialResolution: z.string().nullable(), sourceIds: refs, credit: z.string(), license: z.string(),
  status: z.enum(['metadata-verified','discovery-only']), limitations: z.string(),
}).strict();
export const weightsSchema = z.object(Object.fromEntries(dimensionNames.map(n => [n,z.number().finite().min(0).max(100)])) as Record<typeof dimensionNames[number], z.ZodNumber>).strict()
  .refine(w => Object.values(w).some(v=>v>0), 'At least one weight must be positive');
export const querySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).optional(), planet: planetSchema.optional(),
  location: z.string().optional(), type: z.enum(['environmental','geological','process','operational']).optional(),
  profile: z.enum(['balanced','geology','astrobiology','mobility','lunar-operations','lunar-resources','human-training']).default('balanced'),
  confidence: confidenceSchema.default('low'), sort: z.enum(['similarity','evidence','priority']).default('priority'),
  page: z.string().regex(/^[1-9]\d*$/).transform(Number).pipe(z.number().max(100000)).default(1),
  limit: z.string().regex(/^[1-9]\d*$/).transform(Number).pipe(z.number().max(100)).default(20),
  earth: z.string().optional(), planetary: z.string().optional(), format: z.enum(['json','geojson']).default('json'),
  weights: z.string().max(1000).transform((v,ctx)=>{try{return JSON.parse(v) as unknown;}catch{ctx.addIssue({code:'custom',message:'weights must be JSON'});return z.NEVER;}}).pipe(weightsSchema).optional(),
}).strict();
