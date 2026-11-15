import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { catalog } from '../server/analogRepository.js';
test('POWER context reproduces from archived raw data and checksums',async()=>{
 const report=JSON.parse(await readFile('research/power-ingestion.json','utf8'));
 for(const e of catalog.earth){
  const raw=await readFile(`research/raw/power-${e.id}-2024.json`,'utf8');const data=JSON.parse(raw);
  const row=report.records.find((r:{id:string})=>r.id===e.id);assert.equal(createHash('sha256').update(raw).digest('hex'),row.sha256);
  const values=(Object.values(data.properties.parameter.T2M) as number[]).filter(v=>Number.isFinite(v)&&v!==data.header.fill_value&&v!==-999);
  assert.equal(values.length,366);assert.equal(data.parameters.T2M.units,'C');
  assert.equal(e.measurements[0]!.value,Math.round(values.reduce((a,b)=>a+b,0)/366*100)/100);
  assert.equal(e.measurements[0]!.status,'modeled');
 }
});
