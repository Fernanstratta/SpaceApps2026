import test from 'node:test';
import assert from 'node:assert/strict';
import type { VercelRequest,VercelResponse } from '@vercel/node';
import { createAnalogHandler } from '../server/analogApi.js';
import planetsHandler from '../api/planets.js';
type Payload={data?:unknown[];meta?:{total:number};error?:{code:string};features?:{geometry:{coordinates:number[]}}[]};
async function call(resource:Parameters<typeof createAnalogHandler>[0],query:Record<string,unknown>={},method='GET'){
 let status=0,body:Payload={},headers:Record<string,string>={};
 const res={setHeader:(k:string,v:string)=>{headers[k]=v;},status:(s:number)=>{status=s;return res;},json:(b:Payload)=>{body=b;return res;},end:()=>res};
 await createAnalogHandler(resource)({query,method,headers:{}} as VercelRequest,res as unknown as VercelResponse);
 return {status,body,headers};
}
test('invalid inputs fail consistently',async()=>{
 for(const q of [{planet:'Pluto'},{limit:'101'},{page:'0'},{page:'1.2'},{planet:['Mars','Moon']},{weights:'{'},{weights:'{}'},{typo:'x'}])assert.equal((await call('analogs',q)).status,400);
 assert.equal((await call('compare')).status,400);assert.equal((await call('analogs',{id:'missing'})).status,404);
 assert.equal((await call('compare',{earth:'missing',planetary:'gusev'})).status,404);
});
test('method, preflight and caching contracts',async()=>{
 const wrong=await call('analogs',{},'POST');assert.equal(wrong.status,405);assert.equal(wrong.headers['Cache-Control'],'no-store');
 assert.equal((await call('analogs',{},'OPTIONS')).status,204);
 assert.match((await call('sources')).headers['Cache-Control']!,/s-maxage/);
});
test('filtering, paging, detail, GeoJSON and comparison envelopes',async()=>{
 const mars=await call('analogs',{planet:'Mars',limit:'1'});assert.equal(mars.body.meta!.total,2);assert.equal(mars.body.data!.length,1);
 assert.equal((await call('rankings',{confidence:'high'})).body.data!.length,0);
 assert.equal((await call('locations',{format:'geojson'})).body.features!.length,3);
 assert.equal((await call('compare',{earth:'cerro-prieto',planetary:'gusev'})).status,200);
 assert.equal((await call('analogs',{id:'cerro-prieto-gusev'})).status,200);
 for(const name of ['sources','datasets','imagery','planetary'] as const)assert.equal((await call(name)).status,200);
});
test('existing planets contract remains eight planets',()=>{
 let body:{data:unknown[]}={data:[]};const res={setHeader:()=>{},status:()=>res,json:(b:typeof body)=>{body=b;}};
 planetsHandler({method:'GET'} as VercelRequest,res as unknown as VercelResponse);assert.equal(body.data.length,8);
});
