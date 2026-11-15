import { z } from 'zod';
import earthData from '../data/earth-locations.json' with { type: 'json' };
import planetaryData from '../data/planetary-locations.json' with { type: 'json' };
import analogData from '../data/analog-comparisons.json' with { type: 'json' };
import sourceData from '../data/scientific-sources.json' with { type: 'json' };
import imageData from '../data/satellite-imagery.json' with { type: 'json' };
import { analogSchema, earthSchema, planetarySchema, sourceSchema, imagerySchema } from '../src/lib/analogValidation.js';

export const catalog = {
  analogs: z.array(analogSchema).parse(analogData), earth: z.array(earthSchema).parse(earthData),
  planetary: z.array(planetarySchema).parse(planetaryData), sources: z.array(sourceSchema).parse(sourceData),
  imagery: z.array(imagerySchema).parse(imageData),
};
export type Catalog = typeof catalog;

export function validateRelations(data:Catalog):void {
  for(const rows of Object.values(data)) {
    const ids=rows.map(r=>r.id);if(new Set(ids).size!==ids.length)throw new Error('Duplicate catalog ID');
  }
  const sources=new Set(data.sources.map(s=>s.id));
  function visit(value:unknown):void {
    if(!value || typeof value!=='object')return;
    for(const [key,v] of Object.entries(value)){
      if(key.endsWith('SourceIds') || key==='sourceIds')for(const id of v as string[])if(!sources.has(id))throw new Error('Unresolved source: '+id);
      visit(v);
    }
  }
  visit(data);
  const locations=new Set([...data.earth,...data.planetary].map(x=>x.id));
  const measurementIds=new Set(data.earth.flatMap(e=>e.measurements.map(m=>m.id)));
  for(const i of data.imagery)if(!locations.has(i.locationId))throw new Error('Unresolved image location');
  for(const a of data.analogs){
    if(!data.earth.some(e=>e.id===a.earthLocationId)||!data.planetary.some(p=>p.id===a.planetaryLocationId))throw new Error('Unresolved analog location');
    if(new Set(a.dimensions.map(d=>d.name)).size!==7)throw new Error('Duplicate dimension');
    for(const d of a.dimensions){
      for(const id of d.measurementIds)if(!measurementIds.has(id))throw new Error('Unresolved measurement');
      if(d.score!==null && (d.method==='unscored'||d.measurementIds.length===0))throw new Error('Score without provenance');
    }
    for(const id of a.imageryIds)if(!data.imagery.some(i=>i.id===id && [a.earthLocationId,a.planetaryLocationId].includes(i.locationId)))throw new Error('Unresolved or mismatched image');
  }
}
validateRelations(catalog);
// Replace this adapter when introducing a database; handlers depend on the interface.
export interface AnalogRepository { read(): Promise<Catalog>; }
export const localAnalogRepository:AnalogRepository={ read:async()=>catalog };
