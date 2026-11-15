const byId = id => document.getElementById(id);
const form = byId('request-form');
const base = byId('base');
const search = byId('search');
const examples = byId('example');
const parameters = byId('parameters');
let operations = [];
let components;
let current;
let activeRequest;

const defaultOrigin = location.protocol === 'file:' ? 'http://localhost:3000' : location.origin;
base.value = defaultOrigin;

function node(tag, value) {
  const element = document.createElement(tag);
  if (value !== undefined) element.textContent = value;
  return element;
}

function renderNavigation() {
  const needle = search.value.trim().toLowerCase();
  const matches = operations.filter(({ path, operation }) =>
    needle.split(/\s+/).every(word => [path, operation.summary, operation.description, operation.tags[0]]
      .some(value => value.toLowerCase().includes(word))));
  const routes = byId('routes');
  routes.replaceChildren();
  for (const category of new Set(matches.map(({ operation }) => operation.tags[0]))) {
    routes.append(node('h2', category));
    for (const { path, operation } of matches.filter(entry => entry.operation.tags[0] === category)) {
      const link = node('a');
      link.href = '#' + operation.operationId;
      link.append(node('code', path));
      link.title = operation.summary;
      if (current?.operation === operation) link.setAttribute('aria-current', 'location');
      routes.append(link);
    }
  }
  byId('search-status').textContent = matches.length + ' of ' + operations.length + ' endpoints';
}

function resolved(schema) {
  if (schema.$ref) return components[schema.$ref.split('/').at(-1)];
  if (schema.allOf) return resolved(schema.allOf[0]);
  if (schema.anyOf) return resolved(schema.anyOf.find(choice => choice.type !== 'null') ?? schema.anyOf[0]);
  return schema;
}

function fieldType(schema) {
  if (schema.$ref) return schema.$ref.split('/').at(-1);
  if (schema.allOf) return fieldType(schema.allOf[0]);
  if (schema.anyOf) return schema.anyOf.map(fieldType).join(' | ');
  if (schema.enum) return schema.enum.join(' | ');
  if (Object.hasOwn(schema, 'const')) return JSON.stringify(schema.const);
  if (schema.prefixItems) return '[' + schema.prefixItems.map(fieldType).join(', ') + ']';
  if (schema.type === 'array') return fieldType(schema.items) + '[]';
  return Array.isArray(schema.type) ? schema.type.join(' | ') : schema.type;
}

function fieldList(schema) {
  const fields = node('ul');
  for (const [key, value] of Object.entries(schema.properties ?? {})) {
    const item = node('li');
    const detail = resolved(value);
    const child = detail.type === 'array' && detail.items ? resolved(detail.items) : detail;
    const label = node('code', key + (schema.required.includes(key) ? '' : '?'));
    const type = document.createTextNode(' · ' + fieldType(value));
    if (child.properties) {
      const group = node('details');
      const summary = node('summary');
      summary.append(label, type);
      group.append(summary, fieldList(child));
      item.append(group);
    } else {
      item.append(label, type);
    }
    fields.append(item);
  }
  return fields;
}

function renderContract(operation) {
  const schema = operation.responses[200].content['application/json'].schema;
  const groups = (schema.oneOf ?? [schema]).map((choice, index) => {
    const group = node('details');
    const expanded = resolved(choice);
    const name = expanded.properties?.data ? fieldType(expanded.properties.data) : expanded.properties?.type?.const;
    group.append(node('summary', name ?? 'Response'), fieldList(expanded));
    group.open = index === 0;
    return group;
  });
  byId('fields').replaceChildren(...groups);
  const statuses = Object.entries(operation.responses).map(([code, response]) => {
    const message = response.content?.['application/json']?.examples?.error?.value?.error?.code;
    return node('li', code + ' · ' + response.description + (message ? ' (' + message + ')' : ''));
  });
  if (current.options) statuses.push(node('li', '204 · Empty OPTIONS preflight response.'));
  byId('statuses').replaceChildren(...statuses);
}

function makeParameter(parameter) {
  const { schema, name, required } = parameter;
  const wrapper = node('div');
  const field = node(schema.enum ? 'select' : 'input');
  field.id = 'parameter-' + name;
  field.name = name;
  field.required = required;
  field.autocomplete = 'off';
  if (schema.enum) {
    field.append(new Option(schema.default ? 'Default (' + schema.default + ')' : 'Omit', ''));
    field.append(...schema.enum.map(choice => new Option(choice, choice)));
  } else {
    field.spellcheck = false;
    if (schema.type === 'integer') {
      field.inputMode = 'numeric';
      field.pattern = '[1-9][0-9]*';
    } else if (schema.pattern) {
      field.pattern = schema.pattern.replace('-]', '\\x2d]');
    }
    if (schema.maxLength) field.maxLength = schema.maxLength;
    field.placeholder = schema.default ?? parameter.example ?? '';
  }
  const label = node('label', name + (required ? ' (required)' : ''));
  label.htmlFor = field.id;
  const help = node('small', parameter.description);
  help.id = field.id + '-hint';
  field.setAttribute('aria-describedby', help.id);
  wrapper.append(label, field, help);
  return wrapper;
}

function displayExample() {
  const samples = current.operation.responses[200].content['application/json'].examples;
  const sample = samples[examples.value];
  const request = new URL(sample['x-request-path'], defaultOrigin);
  const values = request.pathname.split('/');
  const template = current.path.split('/');
  for (const parameter of current.operation.parameters ?? []) {
    const field = byId('parameter-' + parameter.name);
    field.value = parameter.in === 'path'
      ? decodeURIComponent(values[template.indexOf('{' + parameter.name + '}')])
      : request.searchParams.get(parameter.name) ?? '';
  }
  byId('example-response').textContent = JSON.stringify(sample.value, null, 2);
  renderCurl();
}

function renderEndpoint(entry) {
  activeRequest?.abort();
  activeRequest = undefined;
  current = entry;
  const { path, operation } = entry;
  byId('endpoint-category').textContent = operation.tags[0];
  byId('endpoint-title').textContent = operation.summary;
  byId('endpoint-path').textContent = 'GET ' + path;
  byId('endpoint-description').textContent = operation.description;
  byId('endpoint').hidden = false;
  byId('load-status').hidden = true;
  const params = operation.parameters ?? [];
  parameters.replaceChildren(...params.map(makeParameter));
  byId('parameter-fields').hidden = params.length === 0;
  const samples = operation.responses[200].content['application/json'].examples;
  examples.replaceChildren(...Object.entries(samples).map(([key, sample]) => new Option(sample.summary, key)));
  byId('send').disabled = false;
  byId('live-panel').hidden = true;
  byId('response-status').textContent = 'Send a request to see the status and timing.';
  byId('copy-status').textContent = '';
  displayExample();
  renderContract(operation);
  renderNavigation();
}

function buildRequest() {
  const origin = new URL(base.value);
  if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' ||
    origin.search || origin.hash || origin.username || origin.password) {
    throw new Error('Enter a backend origin such as http://localhost:3000, with no path or credentials.');
  }
  let path = current.path;
  const query = new URLSearchParams();
  for (const parameter of current.operation.parameters ?? []) {
    const value = byId('parameter-' + parameter.name).value;
    if (!value && parameter.required) throw new Error('Enter ' + parameter.name + '.');
    if (value && parameter.schema.minimum !== undefined &&
      (!/^[1-9]\d*$/.test(value) || Number(value) > parameter.schema.maximum)) {
      throw new Error(parameter.name + ' must be between ' + parameter.schema.minimum + ' and ' + parameter.schema.maximum + '.');
    }
    if (parameter.in === 'path') {
      if (parameter.schema.pattern && !new RegExp(parameter.schema.pattern).test(value)) {
        throw new Error('Enter a catalog ID using lowercase letters, digits, or hyphens.');
      }
      path = path.replace('{' + parameter.name + '}', encodeURIComponent(value));
    } else if (value) {
      query.set(parameter.name, value);
    }
  }
  const request = new URL(path, origin);
  request.search = query.toString();
  return request;
}

function renderCurl() {
  let command;
  try {
    const request = buildRequest();
    const quotedUrl = "'" + request.href.replaceAll("'", "'\"'\"'") + "'";
    command = 'curl -i -H \'Accept: application/json\' ' + quotedUrl;
  } catch (error) {
    command = error.message;
  }
  byId('curl').textContent = command;
}

form.addEventListener('input', () => {
  byId('copy-status').textContent = '';
  renderCurl();
});
examples.addEventListener('change', displayExample);
search.addEventListener('input', renderNavigation);

byId('copy').addEventListener('click', async () => {
  if (!form.reportValidity()) return;
  try {
    buildRequest();
  } catch (error) {
    byId('copy-status').textContent = error.message;
    return;
  }
  try {
    await navigator.clipboard.writeText(byId('curl').textContent);
    byId('copy-status').textContent = 'Copied.';
  } catch {
    byId('copy-status').textContent = 'Select the command above to copy it manually.';
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const status = byId('response-status');
  byId('live-panel').hidden = true;
  const controller = new AbortController();
  const send = byId('send');
  try {
    const request = buildRequest();
    activeRequest = controller;
    send.disabled = true;
    status.textContent = 'Sending request…';
    const start = performance.now();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]);
    const response = await fetch(request, {
      headers: { Accept: 'application/json' }, credentials: 'omit', signal,
    });
    const body = await response.text();
    if (activeRequest !== controller) return;
    status.textContent = 'HTTP ' + response.status + ' · ' + Math.round(performance.now() - start) + ' ms';
    let formatted = body;
    try { formatted = JSON.stringify(JSON.parse(body), null, 2); } catch { /* Keep any non-JSON response visible. */ }
    byId('live-response').textContent = formatted || '(Empty body)';
    byId('live-panel').hidden = false;
  } catch (error) {
    if (controller.signal.aborted) return;
    status.textContent = error instanceof TypeError
      ? 'Could not reach the API. Check that Vercel is running and that the backend allows this browser origin.'
      : error.message;
  } finally {
    if (activeRequest === controller) {
      activeRequest = undefined;
      send.disabled = false;
    }
  }
});

function openFromHash() {
  const id = location.hash.slice(1);
  const entry = operations.find(({ operation }) => operation.operationId === id);
  if (entry) {
    if (current !== entry) renderEndpoint(entry);
    byId('endpoint-title').focus({ preventScroll: true });
    byId('reference').scrollIntoView();
  } else if (!current && operations.length) {
    renderEndpoint(operations[0]);
  }
}
window.addEventListener('hashchange', openFromHash);

try {
  const response = await fetch('./openapi.json');
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const spec = await response.json();
  components = spec.components.schemas;
  operations = Object.entries(spec.paths).map(([path, methods]) => ({ path, operation: methods.get, options: methods.options }));
  openFromHash();
} catch {
  byId('load-status').textContent = 'Could not load the API specification. Open these docs through Vercel or a local HTTP server.';
}
