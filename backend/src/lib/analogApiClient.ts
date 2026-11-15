import { z } from 'zod';
import { analogSchema, sourceSchema } from './analogValidation.js';
export const rankedAnalogSchema=analogSchema.extend({ranking:z.object({overallScore:z.number().nullable(),coverage:z.number(),reason:z.string(),missingDimensions:z.array(z.string())})});
const responseSchema=z.object({data:z.array(rankedAnalogSchema),meta:z.object({total:z.number(),page:z.number(),limit:z.number(),version:z.string()})});
export async function getAnalogRankings(planet:string,profile:string,signal?:AbortSignal){
 const query=new URLSearchParams({profile,sort:'similarity'});if(planet)query.set('planet',planet);
 const response=await fetch('/api/rankings?'+query,{signal:signal??null});
 if(!response.ok)throw Error('Comparisons could not load. Please try again.');
 return responseSchema.parse(await response.json());
}
export async function getAnalogSources(signal?:AbortSignal){
 const response=await fetch('/api/sources?limit=100',{signal:signal??null});
 if(!response.ok)throw Error('Sources could not load.');
 return z.object({data:z.array(sourceSchema)}).parse(await response.json());
}
