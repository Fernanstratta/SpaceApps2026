import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const [files, { rewrites }, spec] = await Promise.all([
  readdir(new URL('api/', root)),
  json('vercel.json'),
  json('public/docs/openapi.json'),
]);

const functions = files
  .filter(file => file.endsWith('.ts'))
  .map(file => '/api/' + file.slice(0, -3));
const aliases = rewrites
  .filter(rule => rule.source.startsWith('/api/'))
  .map(rule => rule.source.replace(/:(\w+)/g, '{$1}'));

assert.deepEqual(Object.keys(spec.paths).sort(), [...functions, ...aliases].sort());
const ids = new Set();
for (const [path, methods] of Object.entries(spec.paths)) {
  assert.ok(methods.get, 'Missing GET on ' + path);
  const variables = [...path.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
  for (const operation of Object.values(methods)) {
    const pathParams = (operation.parameters ?? []).filter(parameter => parameter.in === 'path');
    assert.ok(pathParams.every(parameter => parameter.required), 'Optional path parameter on ' + path);
    assert.deepEqual(pathParams.map(parameter => parameter.name).sort(), variables);
    assert.ok(operation.operationId && !ids.has(operation.operationId), 'Duplicate or missing operation ID on ' + path);
    ids.add(operation.operationId);
  }
}
console.log(`Verified ${functions.length} function paths, ${aliases.length} aliases, and ${ids.size} operations.`);
