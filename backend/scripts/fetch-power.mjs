// Offline ingestion only. Never called by request handlers.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const base=new URL('../',import.meta.url);
const locations=JSON.parse(await readFile(new URL('data/earth-locations.json',base),'utf8'));
await mkdir(new URL('research/raw/',base),{recursive:true});
const log=[];
for(const e of locations){
 const url=new URL('https://power.larc.nasa.gov/api/temporal/daily/point');
 for(const [k,v] of Object.entries({parameters:'T2M',community:'AG',longitude:e.longitude,latitude:e.latitude,start:'20240101',end:'20241231',format:'JSON'}))url.searchParams.set(k,String(v));
 try {
  const res=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!res.ok)throw Error(`HTTP ${res.status}`);
  const raw=await res.text(),data=JSON.parse(raw),values=Object.values(data.properties.parameter.T2M).filter(v=>Number.isFinite(v)&&v!==data.header.fill_value&&v!==-999);
  if(!values.length||data.parameters.T2M.units!=='C')throw Error('Missing values or unexpected units');
  const relative=`research/raw/power-${e.id}-2024.json`;await writeFile(new URL(relative,base),raw);
  const mean=values.reduce((a,b)=>a+b,0)/values.length;
  e.measurements=e.measurements.filter(m=>m.id!=='power-'+e.id);
  e.measurements.push({id:'power-'+e.id,variable:'2024 mean of daily 2 m air temperature',value:Math.round(mean*100)/100,unit:'degC',status:'modeled',sourceIds:['power'],observedAt:'2024-01-01/2024-12-31',footprint:'POWER grid cell selected at representative marker; baseline meteorology grid, not a site polygon',resolution:'0.5 × 0.625 degrees',uncertainty:`Reanalysis; ${values.length}/366 valid daily values. Not land surface temperature or a weather station.`,method:`Arithmetic mean after fill-value masking; raw data: ${relative}`});
  log.push({id:e.id,status:'retrieved',url:String(url),sha256:createHash('sha256').update(raw).digest('hex'),validDays:values.length,meanC:mean});
 }catch(err){log.push({id:e.id,status:'unavailable',url:String(url),reason:String(err)});}
}
await writeFile(new URL('data/earth-locations.json',base),JSON.stringify(locations,null,2)+'\n');
await writeFile(new URL('research/power-ingestion.json',base),JSON.stringify({accessedAt:new Date().toISOString(),records:log},null,2)+'\n');
console.log(log);
