import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog,validateRelations } from '../server/analogRepository.js';
import { earthSchema,planetarySchema } from '../src/lib/analogValidation.js';
test('catalog schemas and all references resolve',()=>{validateRelations(catalog);assert.equal(catalog.analogs.length,3);});
test('geography stays separated and coordinate ranges are enforced',()=>{
 assert.equal(catalog.earth.find(e=>e.id==='algodones')!.state,'California');
 assert.equal(catalog.earth.find(e=>e.id==='cerro-prieto')!.state,'Baja California');
 assert.equal(earthSchema.safeParse({...catalog.earth[0],latitude:91}).success,false);
 assert.equal(planetarySchema.safeParse({...catalog.planetary[0],longitude:-1}).success,false);
 const e=catalog.earth.find(e=>e.id==='algodones')!;assert.ok(Math.abs(e.latitude-(32+58.982/60))<1e-10);
});
test('unknown scores and publication limits are preserved',()=>{
 for(const a of catalog.analogs){assert.equal(a.overallScore,null);assert.ok(a.dimensions.every(d=>d.score===null));
 assert.equal(a.educational.summary30.split(/\s+/).length,30);
 const n=a.educational.explanation.split(/\s+/).length;assert.ok(n>=100&&n<=150);
 assert.equal(a.educational.facts.length,3);}
});
test('dangling citations and duplicate records are rejected',()=>{
 const d=structuredClone(catalog);d.analogs[0]!.sourceIds.push('missing');assert.throws(()=>validateRelations(d));
 const x=structuredClone(catalog);x.earth.push(x.earth[0]!);assert.throws(()=>validateRelations(x));
});
