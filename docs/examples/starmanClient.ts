import type { ApiError } from '../../src/lib/spaceApiTypes';

export class StarmanApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code: string) {
    super(message);
    this.name = 'StarmanApiError';
  }
}

function isApiError(body: unknown): body is ApiError {
  if (typeof body !== 'object' || body === null || !('error' in body)) return false;
  const { error } = body;
  return typeof error === 'object' && error !== null
    && 'code' in error && typeof error.code === 'string'
    && 'message' in error && typeof error.message === 'string';
}

export function createStarmanClient(baseUrl = '') {
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
        if (isApiError(body)) throw new StarmanApiError(body.error.message, response.status, body.error.code);
        throw new StarmanApiError(`Request failed with HTTP ${response.status}.`, response.status, 'HTTP_ERROR');
      }
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        throw new StarmanApiError('Expected a JSON object from Starman.', response.status, 'INVALID_RESPONSE');
      }

      return body as T;
    },
  };
}
