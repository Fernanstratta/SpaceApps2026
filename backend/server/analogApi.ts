import type { VercelRequest, VercelResponse } from '@vercel/node';
import { querySchema } from '../src/lib/analogValidation.js';
import { profiles, scoreAnalog } from '../src/lib/analogScoring.js';
import { localAnalogRepository } from './analogRepository.js';
import type { AnalogRepository } from './analogRepository.js';

type Resource='analogs'|'locations'|'rankings'|'sources'|'datasets'|'compare'|'planetary'|'imagery';
const confidenceValue={low:0,medium:1,high:2};
function sourceReferences(value:unknown,ids=new Set<string>()):Set<string>{
  if(value && typeof value==='object')for(const [key,v] of Object.entries(value)){
    if(key==='sourceIds'||key.endsWith('SourceIds'))for(const id of v as string[])ids.add(id);
    sourceReferences(v,ids);
  }
  return ids;
}
export function createAnalogHandler(resource:Resource,repository:AnalogRepository=localAnalogRepository) {
  return async function handler(req:VercelRequest,res:VercelResponse) {
    // Same-origin by default. Explicit allowlist only; public read-only API uses no cookies.
    const origin=req.headers.origin;
    const allowed=(process.env.TERRANAUTA_ALLOWED_ORIGINS??process.env.STARMAN_ALLOWED_ORIGINS??'').split(',').map(x=>x.trim()).filter(Boolean);
    res.setHeader('Vary','Origin');
    if(typeof origin==='string' && allowed.includes(origin))res.setHeader('Access-Control-Allow-Origin',origin);
    res.setHeader('Cache-Control','no-store');
    if(req.method==='OPTIONS'){
      res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Accept, Content-Type');
      return res.status(204).end();
    }
    const error=(status:number,code:string,message:string)=>res.status(status).json({error:{code,message}});
    if(req.method!=='GET'){res.setHeader('Allow','GET, OPTIONS');return error(405,'METHOD_NOT_ALLOWED','Use GET.');}
    const parsed=querySchema.safeParse(req.query);
    if(!parsed.success)return error(400,'INVALID_QUERY',parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '));
    const q=parsed.data;
    try {
      const db=await repository.read();
      const weights=q.weights??profiles[q.profile]!;
      const filtered=db.analogs.filter(a=>{
        const p=db.planetary.find(p=>p.id===a.planetaryLocationId)!;
        return (!q.planet||p.planet===q.planet)&&(!q.location||a.earthLocationId===q.location)&&(!q.type||a.analogType.includes(q.type))&&confidenceValue[a.researchConfidence]>=confidenceValue[q.confidence];
      });
      const ranked=filtered.map(a=>({...a,ranking:scoreAnalog(a.dimensions,weights)}));
      ranked.sort((a,b)=>{
        if(q.sort==='evidence')return confidenceValue[b.researchConfidence]-confidenceValue[a.researchConfidence]||a.researchPriority-b.researchPriority;
        if(q.sort==='similarity'||resource==='rankings'){
          const x=a.ranking.overallScore,y=b.ranking.overallScore;
          if(x!==y)return x===null?1:y===null?-1:y-x;
        }
        return a.researchPriority-b.researchPriority||a.id.localeCompare(b.id);
      });
      let result:unknown;
      if(resource==='compare'){
        if(!q.earth||!q.planetary)return error(400,'INVALID_QUERY','earth and planetary are required.');
        const a=ranked.find(a=>a.earthLocationId===q.earth&&a.planetaryLocationId===q.planetary);
        if(!a)return error(404,'NOT_FOUND','No comparison for this pair.');
        const pair={comparison:a,earth:db.earth.find(e=>e.id===q.earth),planetary:db.planetary.find(p=>p.id===q.planetary),imagery:db.imagery.filter(i=>a.imageryIds.includes(i.id))};
        const refs=sourceReferences(pair);
        result={data:{...pair,sources:db.sources.filter(s=>refs.has(s.id))}};
      }else{
        let rows:{id:string}[];
        switch(resource){
          case 'analogs':case 'rankings':rows=ranked;break;
          case 'locations':rows=db.earth.filter(e=>(!q.location||e.id===q.location)&&(!q.planet||filtered.some(a=>a.earthLocationId===e.id)));break;
          case 'sources':rows=db.sources;break;
          case 'datasets':rows=db.sources.filter(s=>s.kind==='dataset'||s.kind==='portal');break;
          case 'imagery':rows=db.imagery.filter(i=>!q.location||i.locationId===q.location);break;
          case 'planetary':rows=db.planetary.filter(p=>!q.planet||p.planet===q.planet);break;
        }
        if(q.id){
          const row=rows.find(x=>x.id===q.id);if(!row)return error(404,'NOT_FOUND','Record not found.');result={data:row};
        }else if(resource==='locations'&&q.format==='geojson'){
          const ids=new Set(rows.slice((q.page-1)*q.limit,q.page*q.limit).map(r=>r.id));
          result={type:'FeatureCollection',features:db.earth.filter(e=>ids.has(e.id)).map(e=>({type:'Feature',id:e.id,geometry:{type:'Point',coordinates:[e.longitude,e.latitude]},properties:{name:e.name,country:e.country,state:e.state,coordinateRole:e.coordinateRole,qualityFlags:e.qualityFlags}})),meta:{total:rows.length,page:q.page,limit:q.limit,version:'1.0.0'}};
        }else result={data:rows.slice((q.page-1)*q.limit,q.page*q.limit),meta:{total:rows.length,page:q.page,limit:q.limit,version:'1.0.0'}};
      }
      res.setHeader('Cache-Control','public, max-age=60, s-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).json(result);
    }catch(err){console.error('Analog catalog error',err instanceof Error?err.message:'unknown');return error(500,'INTERNAL_ERROR','The catalog is temporarily unavailable.');}
  };
}
