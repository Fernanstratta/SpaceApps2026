import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { VercelRequest,VercelResponse } from '@vercel/node';
import { createAnalogHandler } from '../server/analogApi.js';
import { rankedAnalogSchema } from '../src/lib/analogApiClient.js';
import config from '../vercel.json' with {type:'json'};
test('real HTTP adapter exercises detail rewrite and frontend schema',async()=>{
 const server=createServer(async(req,res)=>{
  const u=new URL(req.url!,'http://localhost');
  const rule=config.rewrites.find(r=>r.source==='/api/analogs/:id')!;
  const id=u.pathname.split('/')[3];
  const routed=id?new URL(rule.destination.replace(':id',encodeURIComponent(id)),'http://localhost'):u;
  const query:Record<string,string|string[]>={};
  for(const key of new Set(routed.searchParams.keys())){const values=routed.searchParams.getAll(key);query[key]=values.length===1?values[0]!:values;}
  const bridge={setHeader:(k:string,v:string)=>res.setHeader(k,v),status:(status:number)=>{res.statusCode=status;return bridge;},json:(value:unknown)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));return bridge;},end:()=>res.end()};
  await createAnalogHandler('analogs')({method:req.method,headers:req.headers,query} as VercelRequest,bridge as unknown as VercelResponse);
 });
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const base=`http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const r=await fetch(base+'/api/analogs/cerro-prieto-gusev');assert.equal(r.status,200);
  const b=await r.json() as {data:unknown};assert.equal(rankedAnalogSchema.parse(b.data).id,'cerro-prieto-gusev');
  assert.equal((await fetch(base+'/api/analogs?planet=Mars&planet=Moon')).status,400);
 }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
