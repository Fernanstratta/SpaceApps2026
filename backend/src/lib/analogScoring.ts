import type { SimilarityDimension, Weights } from '../types/planetaryAnalog.js';
import { dimensionNames, dimensionSchema, weightsSchema } from './analogValidation.js';

export const profiles: Record<string, Weights> = {
  balanced: { geology:25, terrain:20, environment:15, materials:15, water:10, operations:10, subsurface:5 },
  geology: { geology:40, terrain:20, environment:5, materials:15, water:10, operations:5, subsurface:5 },
  astrobiology: { geology:20, terrain:5, environment:10, materials:5, water:30, operations:5, subsurface:25 },
  mobility: { geology:5, terrain:40, environment:5, materials:25, water:0, operations:25, subsurface:0 },
  'lunar-operations': { geology:10, terrain:30, environment:20, materials:20, water:0, operations:20, subsurface:0 },
  'lunar-resources': { geology:25, terrain:10, environment:15, materials:15, water:15, operations:5, subsurface:15 },
  'human-training': { geology:10, terrain:20, environment:15, materials:10, water:5, operations:35, subsurface:5 },
};

/** Same variable, units, spatial support and physical interpretation must be established first. */
export function normalizedDistance(a:number,b:number,tolerance:number):number {
  if (![a,b,tolerance].every(Number.isFinite) || tolerance<=0) throw new Error('Finite values and positive tolerance required');
  return 100*Math.max(0,1-Math.abs(a-b)/tolerance);
}
export function mineralOverlap(a:string[],b:string[]):number|null {
  const x=new Set(a),y=new Set(b),union=new Set([...x,...y]);
  if (!x.size || !y.size) return null; // Empty inventory means unknown, not proven absence.
  return 100*[...x].filter(v=>y.has(v)).length/union.size;
}
export function scoreAnalog(dimensions:SimilarityDimension[], weights:Weights=profiles.balanced!) {
  weightsSchema.parse(weights);
  const names=new Set<string>();
  for(const d of dimensions){dimensionSchema.parse(d);if(names.has(d.name))throw new Error('Duplicate dimension');names.add(d.name);}
  const total=Object.values(weights).reduce((a,b)=>a+b,0);
  const eligible=dimensions.filter(d=>d.score!==null && d.method!=='unscored' && d.method!=='expert-preliminary' && d.measurementIds.length>0 && weights[d.name]>0);
  const availableWeight=eligible.reduce((s,d)=>s+weights[d.name],0);
  const coverage=availableWeight/total;
  const active=dimensionNames.filter(n=>weights[n]>0);
  const minimumDimensions=Math.min(3,active.length);
  const sufficient=coverage>=0.7 && eligible.length>=minimumDimensions;
  const missingDimensions=active.filter(n=>!eligible.some(d=>d.name===n));
  return {
    overallScore:sufficient?Math.round(eligible.reduce((s,d)=>s+d.score!*weights[d.name],0)/availableWeight*100)/100:null,
    coverage, missingDimensions, weights, status:sufficient?'computed':'insufficient-data',
    reason:sufficient?'Renormalized over measured dimensions; coverage is reported separately.':'Requires at least 70% weighted coverage and up to three measured dimensions. No missing value is treated as zero.',
    confidence: eligible.length ? (eligible.some(d=>d.confidence==='low')?'low':eligible.some(d=>d.confidence==='medium')?'medium':'high') : null,
    method:'starman-distance-v1; heuristic thresholds, not scientific validation',
  };
}
