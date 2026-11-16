import type { ApiError } from '../../src/lib/spaceApiTypes';

export class TerranautaApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code: string) {
    super(message);
    this.name = 'TerranautaApiError';
  }
}

function isApiError(body: unknown): body is ApiError {
  if (typeof body !== 'object' || body === null || !('error' in body)) return false;
  const { error } = body;
  return typeof error === 'object' && error !== null
    && 'code' in error && typeof error.code === 'string'
    && 'message' in error && typeof error.message === 'string';
}

export function createTerranautaClient(baseUrl = '') {
  const origin = baseUrl.replace(/\/+$/, '');

  return {
    async get<T>(path: `/api/${string}`, query?: URLSearchParams, signal?: AbortSignal): Promise<T> {
      const queryString = query?.toString();
      const suffix = queryString ? `?${queryString}` : '';
      const response = await fetch(`${origin}${path}${suffix}`, {
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        signal: signal ?? null,
      });

      const contentType = response.headers.get('content-type');
      const body: unknown = contentType?.includes('application/json')
        ? await response.json().catch(() => null)
        : null;

      if (!response.ok) {
        if (isApiError(body)) throw new TerranautaApiError(body.error.message, response.status, body.error.code);
        throw new TerranautaApiError(`Request failed with HTTP ${response.status}.`, response.status, 'HTTP_ERROR');
      }
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        throw new TerranautaApiError('Expected a JSON object from Terranauta.', response.status, 'INVALID_RESPONSE');
      }

      return body as T;
    },
  };
}
