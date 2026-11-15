/**
 * Verifica el bilingüismo sin navegador (`npm run verify:i18n`):
 *  - Elección de idioma: México, Estados Unidos, país desconocido, cambio
 *    manual guardado y enlaces directos a /es o /en.
 *  - Que reescribir una URL sin idioma nunca provoque otra redirección.
 *  - Rutas: prefijo de idioma y slugs traducidos (ida y vuelta).
 *  - Que todos los datos y textos tengan versión en inglés, y que los créditos
 *    conserven autores, instituciones y licencias.
 */
import { images, resourceCategories, resources, submodules, topics } from '../src/data';
import { DEFAULT_REFERENCE_LOCATION } from '../src/data/locations';
import { getDataApi } from '../src/data/localized';
import { SPANISH_SPEAKING_COUNTRIES } from '../src/i18n/config';
import { contentEn } from '../src/i18n/content/en';
import { languageForCountry, planInitialLanguage, type LanguageInput } from '../src/i18n/detect';
import { en } from '../src/i18n/messages/en';
import { roverEn } from '../src/i18n/missions/rover.en';
import { roverEs } from '../src/i18n/missions/rover.es';
import { es } from '../src/i18n/messages/es';
import { localizePath, parsePath } from '../src/i18n/paths';
import { readSavedLanguage, saveLanguage } from '../src/i18n/storage';
import { ROUTES } from '../src/router/routes';

let failures = 0;
let passed = 0;
function check(condition: boolean, message: string): void {
  if (condition) passed += 1;
  else {
    failures += 1;
    console.error(`✗ ${message}`);
  }
}
function section(title: string): void {
  console.log(`\n${title}`);
}

type Input = Omit<LanguageInput, 'urlLanguage'>;
const base: Input = { savedLanguage: null, countryCode: null, browserLanguages: [] };

/** Comprueba el idioma, el origen de la decisión, la redirección y que no haya bucle. */
function scenario(
  label: string,
  pathname: string,
  input: Partial<Input>,
  expected: { language: 'es' | 'en'; source: string; redirectTo: string | null },
): void {
  const fullInput = { ...base, ...input };
  const plan = planInitialLanguage(pathname, fullInput);
  const ok =
    plan.language === expected.language && plan.source === expected.source && plan.redirectTo === expected.redirectTo;
  check(
    ok,
    `${label}: esperado ${JSON.stringify(expected)}, obtenido ${JSON.stringify(plan)}`,
  );
  if (plan.redirectTo) {
    const second = planInitialLanguage(plan.redirectTo, fullInput);
    check(
      second.redirectTo === null && second.language === plan.language,
      `${label}: la URL reescrita (${plan.redirectTo}) vuelve a redirigir → posible bucle`,
    );
  }
  if (ok) console.log(`  ✓ ${label} → ${plan.language} (${plan.source})${plan.redirectTo ? `, URL ${plan.redirectTo}` : ''}`);
}

// ---------------------------------------------------------------------------
section('Detección inicial (URL sin idioma)');
scenario('México', '/', { countryCode: 'MX', browserLanguages: ['en-US'] }, { language: 'es', source: 'country', redirectTo: '/es' });
scenario('Estados Unidos', '/', { countryCode: 'US', browserLanguages: ['es-MX'] }, { language: 'en', source: 'country', redirectTo: '/en' });
scenario('España', '/', { countryCode: 'es' }, { language: 'es', source: 'country', redirectTo: '/es' });
scenario('Francia (no hispanohablante)', '/', { countryCode: 'FR', browserLanguages: ['fr-FR'] }, { language: 'en', source: 'country', redirectTo: '/en' });
scenario('País desconocido + navegador en inglés', '/', { browserLanguages: ['en-GB', 'es'] }, { language: 'en', source: 'browser', redirectTo: '/en' });
scenario('País desconocido + navegador en español', '/', { browserLanguages: ['es-AR'] }, { language: 'es', source: 'browser', redirectTo: '/es' });
scenario('País desconocido + navegador en francés', '/', { browserLanguages: ['fr-FR', 'en'] }, { language: 'es', source: 'default', redirectTo: '/es' });
scenario('País desconocido sin idioma de navegador', '/', {}, { language: 'es', source: 'default', redirectTo: '/es' });
scenario('Código "XX" (desconocido en Cloudflare)', '/', { countryCode: 'XX', browserLanguages: ['en-US'] }, { language: 'en', source: 'browser', redirectTo: '/en' });
scenario('Código "T1" (Tor en Cloudflare)', '/', { countryCode: 'T1', browserLanguages: ['es'] }, { language: 'es', source: 'browser', redirectTo: '/es' });
scenario('Enlace antiguo sin idioma, desde EE. UU.', '/portal-educativo/gravity', { countryCode: 'US' }, { language: 'en', source: 'country', redirectTo: '/en/educational-portal/gravity' });

section('Cambio manual de idioma (elección guardada)');
scenario('Eligió EN y vuelve desde México', '/', { savedLanguage: 'en', countryCode: 'MX' }, { language: 'en', source: 'saved', redirectTo: '/en' });
scenario('Eligió ES y vuelve desde EE. UU.', '/portal-educativo', { savedLanguage: 'es', countryCode: 'US' }, { language: 'es', source: 'saved', redirectTo: '/es/portal-educativo' });

// Persistencia real de `storage.ts` con un localStorage simulado.
const memory = new Map<string, string>();
(globalThis as { window?: unknown }).window = {
  localStorage: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => void memory.set(key, value),
  },
};
check(readSavedLanguage() === null, 'Sin elección guardada al inicio');
saveLanguage('en');
check(readSavedLanguage() === 'en', 'saveLanguage("en") se recupera en la siguiente visita');
const afterSwitch = planInitialLanguage('/', { ...base, savedLanguage: readSavedLanguage(), countryCode: 'MX' });
check(afterSwitch.language === 'en', 'Tras elegir EN, una visita desde México sigue en inglés');
console.log('  ✓ La elección se guarda y tiene prioridad sobre el país');

section('Enlaces directos con idioma (se respetan, sin redirección)');
scenario('/en/... con elección ES y país MX', '/en/educational-portal/gravity', { savedLanguage: 'es', countryCode: 'MX' }, { language: 'en', source: 'url', redirectTo: null });
scenario('/es/... con elección EN y país US', '/es/portal-educativo', { savedLanguage: 'en', countryCode: 'US' }, { language: 'es', source: 'url', redirectTo: null });
scenario('/en (raíz en inglés)', '/en', { countryCode: 'MX' }, { language: 'en', source: 'url', redirectTo: null });

section('Países hispanohablantes');
for (const code of SPANISH_SPEAKING_COUNTRIES) check(languageForCountry(code) === 'es', `${code} debería ser español`);
for (const code of ['US', 'CA', 'GB', 'BR', 'FR', 'DE', 'JP', 'BZ']) check(languageForCountry(code) === 'en', `${code} debería ser inglés`);
check(!SPANISH_SPEAKING_COUNTRIES.has('US'), 'EE. UU. no está en la lista de países hispanohablantes');
console.log(`  ✓ ${SPANISH_SPEAKING_COUNTRIES.size} países → español; resto → inglés`);

// ---------------------------------------------------------------------------
section('Rutas con prefijo de idioma');
const internalPaths = [
  ROUTES.home,
  ROUTES.portal,
  ROUTES.login,
  ROUTES.register,
  ROUTES.missionStart,
  ROUTES.missionTeach,
  ...topics.map((topic) => ROUTES.topic(topic.id)),
  ...submodules.map((item) => ROUTES.submodule(item.topicId, item.id)),
];
for (const path of internalPaths) {
  for (const language of ['es', 'en'] as const) {
    const localized = localizePath(path, language);
    const parsed = parsePath(localized);
    check(
      parsed.language === language && parsed.path === path,
      `Ida y vuelta ${path} (${language}) → ${localized} → ${JSON.stringify(parsed)}`,
    );
  }
}
check(localizePath('/portal-educativo/gravity', 'en') === '/en/educational-portal/gravity', 'Slug traducido en inglés');
check(localizePath('/iniciar-sesion', 'en') === '/en/sign-in', 'Slug de inicio de sesión en inglés');
check(localizePath(ROUTES.missionStart, 'en') === '/en/educational-portal/mission/lunar-rover/start', 'Slug de la misión en inglés');
check(localizePath(ROUTES.missionTeach, 'en') === '/en/educational-portal/mission/lunar-rover/teach', 'Slug de la guía docente en inglés');
check(parsePath('/en/portal-educativo').path === '/portal-educativo', 'Acepta el slug en español bajo /en');
check(parsePath('/portal-educativo').language === null, 'Ruta sin prefijo = sin idioma explícito');
check(parsePath('/fr/portal-educativo').language === null, 'Un prefijo no soportado no cuenta como idioma');
console.log(`  ✓ ${internalPaths.length * 2} rutas convertidas en ambos sentidos`);

// ---------------------------------------------------------------------------
section('Traducciones de datos');
for (const topic of topics) check(Boolean(contentEn.topics[topic.id]?.name), `Falta inglés del tema ${topic.id}`);
for (const item of submodules) check(Boolean(contentEn.submodules[item.id]?.title), `Falta inglés del submódulo ${item.id}`);
for (const category of resourceCategories)
  check(Boolean(contentEn.resourceCategories[category.id]?.name), `Falta inglés de la categoría ${category.id}`);
for (const resource of resources) check(Boolean(contentEn.resources[resource.id]?.description), `Falta inglés del recurso ${resource.id}`);
check(Boolean(contentEn.referenceLocations[DEFAULT_REFERENCE_LOCATION.id]), 'Falta inglés de la ubicación de referencia');

// Ids sobrantes (traducción de algo que ya no existe).
const known = {
  submodules: new Set(submodules.map((item) => item.id)),
  images: new Set(images.map((image) => image.id)),
  resources: new Set(resources.map((resource) => resource.id)),
};
for (const id of Object.keys(contentEn.submodules)) check(known.submodules.has(id), `Traducción de submódulo inexistente: ${id}`);
for (const id of Object.keys(contentEn.images)) check(known.images.has(id), `Traducción de imagen inexistente: ${id}`);
for (const id of Object.keys(contentEn.resources)) check(known.resources.has(id), `Traducción de recurso inexistente: ${id}`);

section('Créditos de imágenes (autores, URLs y licencias)');
const LICENSE_EN: Record<string, string> = { 'Dominio público': 'Public domain', 'CC0 1.0': 'CC0 1.0' };
const enApi = getDataApi('en');
for (const image of images) {
  const translated = contentEn.images[image.id];
  check(Boolean(translated?.alt), `Falta el texto alternativo en inglés de ${image.id}`);
  if (!translated) continue;
  check(translated.license === LICENSE_EN[image.license], `${image.id}: licencia cambiada (${image.license} → ${translated.license})`);
  // Cada nombre propio o sigla del crédito original debe seguir en el inglés.
  // Se excluyen las descripciones que sí se traducen (Apolo → Apollo,
  // Estación Espacial Internacional → International Space Station…).
  const DESCRIPTIVE = /Apolo|Expedición|Operación|Estación|Espacial|Internacional/;
  const names = image.author.match(/\b(?:[A-Z][A-Za-z.]*(?:\s+[A-Z][A-Za-z.]*)+|[A-Z]{2,})\b/g) ?? [];
  for (const name of names.filter((n) => !DESCRIPTIVE.test(n))) {
    check(translated.author.includes(name), `${image.id}: el crédito en inglés perdió «${name}»`);
  }
  const localized = enApi.getImage(image.id);
  check(localized?.file === image.file && localized.commonsPath === image.commonsPath, `${image.id}: cambió el archivo o la URL`);
}
for (const resource of resources) {
  const localized = enApi.resources.find((item) => item.id === resource.id);
  check(
    localized?.sourceUrl === resource.sourceUrl && localized.licenseUrl === resource.licenseUrl,
    `${resource.id}: cambió una URL al traducir`,
  );
}
console.log(`  ✓ ${images.length} imágenes y ${resources.length} recursos conservan autores, URLs y licencias`);

// ---------------------------------------------------------------------------
section('Textos de la interfaz');
function keyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key));
}
function valueAt(root: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], root);
}
const esKeys = keyPaths(es);
const enKeys = new Set(keyPaths(en));
for (const key of esKeys) {
  check(enKeys.has(key), `Falta en inglés: ${key}`);
  const value = valueAt(en, key);
  check(typeof value === 'function' || (typeof value === 'string' && value.trim() !== ''), `Texto vacío en inglés: ${key}`);
}
for (const key of enKeys) check(esKeys.includes(key), `Clave sobrante en inglés: ${key}`);
console.log(`  ✓ ${esKeys.length} textos con versión en ambos idiomas`);

section('Textos de la Misión 01');
const missionEsKeys = keyPaths(roverEs);
const missionEnKeys = new Set(keyPaths(roverEn));
for (const key of missionEsKeys) {
  check(missionEnKeys.has(key), `Falta en inglés (misión): ${key}`);
  const value = valueAt(roverEn, key);
  check(typeof value === 'function' || typeof value === 'number' || (typeof value === 'string' && value.trim() !== ''), `Texto vacío en inglés (misión): ${key}`);
}
for (const key of missionEnKeys) check(missionEsKeys.includes(key), `Clave sobrante en inglés (misión): ${key}`);
console.log(`  ✓ ${missionEsKeys.length} textos de la misión con versión en ambos idiomas`);

// ---------------------------------------------------------------------------
console.log('');
if (failures > 0) {
  console.error(`✗ ${failures} comprobaciones fallidas (${passed} correctas).`);
  process.exit(1);
}
console.log(`✓ i18n verificado: ${passed} comprobaciones correctas.`);
