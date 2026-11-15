import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizedDistance,mineralOverlap,scoreAnalog,profiles } from '../src/lib/analogScoring.js';
import { catalog } from '../server/analogRepository.js';
test('distance and overlap handle units-independent arithmetic and unknown inventory',()=>{
 assert.equal(normalizedDistance(10,12,10),80);assert.equal(normalizedDistance(0,20,10),0);
 assert.throws(()=>normalizedDistance(0,1,0));assert.throws(()=>normalizedDistance(NaN,1,1));
 assert.equal(mineralOverlap(['a','a','b'],['b','c']),100/3);assert.equal(mineralOverlap([],['a']),null);
});
test('missing does not become zero; expert assessments cannot masquerade as measured scores',()=>{
 assert.equal(scoreAnalog(catalog.analogs[0]!.dimensions).overallScore,null);
 const d=catalog.analogs[0]!.dimensions.map(d=>({...d,score:90,method:'expert-preliminary' as const}));assert.equal(scoreAnalog(d).overallScore,null);
});
test('known weighted example and coverage gate',()=>{
 const d=catalog.analogs[0]!.dimensions.map(d=>({...d,score:80,method:'normalized-distance' as const,measurementIds:['synthetic-test-only']}));
 assert.equal(scoreAnalog(d).overallScore,80);
 const varied=d.map(x=>({...x,score:x.name==='geology'?100:x.name==='terrain'?0:50}));
 assert.equal(scoreAnalog(varied).overallScore,52.5);
 const partial=d.map(x=>({...x,score:['geology','terrain','materials','water'].includes(x.name)?80:null}));
 const result=scoreAnalog(partial);assert.equal(result.coverage,0.7);assert.equal(result.overallScore,80);
 partial[0]!.score=null;assert.equal(scoreAnalog(partial).overallScore,null);
});
test('adjustable weights reject negative, zero, NaN and duplicate dimensions',()=>{
 const d=catalog.analogs[0]!.dimensions;
 assert.throws(()=>scoreAnalog(d,{...profiles.balanced!,geology:-1}));
 assert.throws(()=>scoreAnalog(d,Object.fromEntries(Object.keys(profiles.balanced!).map(k=>[k,0])) as typeof profiles.balanced));
 assert.throws(()=>scoreAnalog([...d,d[0]!]));
});
