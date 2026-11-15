import { readFile,writeFile } from 'node:fs/promises';
const base=new URL('../',import.meta.url);
const sources=JSON.parse(await readFile(new URL('data/scientific-sources.json',base),'utf8'));
const checks=[];
// A transport check is not a scientific verification or a license grant.
for(let i=0;i<sources.length;i+=4){
 checks.push(...await Promise.all(sources.slice(i,i+4).map(async s=>{
  try{const r=await fetch(s.url,{signal:AbortSignal.timeout(12000)});await r.body?.cancel();return {id:s.id,url:s.url,finalUrl:r.url,httpStatus:r.status,reachable:r.ok};}
  catch(e){return {id:s.id,url:s.url,reachable:false,error:String(e)};}
 })));
}
await writeFile(new URL('research/url-checks.json',base),JSON.stringify({checkedAt:new Date().toISOString(),note:'Transport only. Browser search access may differ; does not overwrite reviewed scientific metadata.',checks},null,2)+'\n');
console.log({total:checks.length,reachable:checks.filter(c=>c.reachable).length,failed:checks.filter(c=>!c.reachable).map(c=>({id:c.id,status:c.httpStatus,error:c.error}))});
