import { normalizeCountryCode } from './detect';

/**
 * Detección del país del visitante SIN pedir permiso de ubicación (nada de GPS).
 * El país lo aporta el hosting o el backend a partir de la IP. Proveedores, en
 * orden (el primero que responda gana):
 *
 *  1. `?country=MX` en la URL — solo para pruebas manuales.
 *  2. Valor inyectado por el servidor en el HTML (síncrono, sin esperas):
 *       <meta name="terranauta-country" content="MX">
 *     o `window.__TERRANAUTA_GEO__ = { country: 'MX' }`.
 *  3. Endpoint del backend, si está configurado en `VITE_GEO_ENDPOINT`
 *     (p. ej. `/api/geo`). Debe responder JSON `GeoResponse`.
 *
 * Si ninguno da un país, la app usa el idioma del navegador.
 * Contrato completo y ejemplos para el backend: `docs/i18n.md`.
 */

/** Respuesta esperada de `GET VITE_GEO_ENDPOINT`. */
export interface GeoResponse {
  /** ISO 3166-1 alfa-2, p. ej. "MX". `null` o ausente si no se conoce. */
  country?: string | null;
}

export type CountrySource = 'query' | 'injected' | 'endpoint';

export interface CountryDetection {
  code: string | null;
  source: CountrySource | null;
}

declare global {
  interface Window {
    __TERRANAUTA_GEO__?: GeoResponse;
  }
}

/** Tiempo máximo de espera del endpoint antes de seguir con el idioma del navegador. */
const ENDPOINT_TIMEOUT_MS = 1500;

function fromQuery(): string | null {
  return normalizeCountryCode(new URLSearchParams(window.location.search).get('country'));
}

function fromInjectedValue(): string | null {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="terranauta-country"]')?.content;
  return normalizeCountryCode(window.__TERRANAUTA_GEO__?.country ?? meta);
}

async function fromEndpoint(endpoint: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), ENDPOINT_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      credentials: 'same-origin',
    });
    if (!response.ok) return null;
    const data = (await response.json()) as GeoResponse;
    return normalizeCountryCode(data.country);
  } catch {
    return null; // Sin red, timeout o JSON inválido: se usa el navegador.
  } finally {
    window.clearTimeout(timer);
  }
}

export async function detectCountry(): Promise<CountryDetection> {
  const query = fromQuery();
  if (query) return { code: query, source: 'query' };

  const injected = fromInjectedValue();
  if (injected) return { code: injected, source: 'injected' };

  const endpoint = import.meta.env.VITE_GEO_ENDPOINT?.trim();
  if (endpoint) {
    const code = await fromEndpoint(endpoint);
    if (code) return { code, source: 'endpoint' };
  }
  return { code: null, source: null };
}
