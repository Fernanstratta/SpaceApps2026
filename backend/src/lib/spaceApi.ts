import type { Comparison, AnalogPairSummary, ApiError, Apod, DataResponse, HealthResponse, Planet } from './spaceApiTypes';

export class SpaceApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'SpaceApiError';
  }
}

function hasApiError(body: unknown): body is ApiError {
  if (typeof body !== 'object' || body === null || !('error' in body)) return false;
  const { error } = body;
  return typeof error === 'object' && error !== null
    && 'code' in error && typeof error.code === 'string'
    && 'message' in error && typeof error.message === 'string';
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    headers: { Accept: 'application/json' },
    signal: signal ?? null,
  });

  const contentType = response.headers.get('content-type');
  const body: unknown = contentType?.includes('application/json')
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    if (hasApiError(body)) {
      throw new SpaceApiError(body.error.message, response.status, body.error.code);
    }
    throw new SpaceApiError(`Space API request failed (HTTP ${response.status}).`, response.status, 'HTTP_ERROR');
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new SpaceApiError('The Space API returned an invalid response.', response.status, 'INVALID_RESPONSE');
  }
  return body as T;
}

export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return request<HealthResponse>('health', signal);
}

export async function getPlanets(signal?: AbortSignal): Promise<Planet[]> {
  const { data } = await request<DataResponse<Planet[]>>('planets', signal);
  if (!Array.isArray(data)) {
    throw new SpaceApiError('The Space API returned an invalid planets response.', 200, 'INVALID_RESPONSE');
  }
  return data;
}

export async function getApod(signal?: AbortSignal): Promise<Apod> {
  const { data } = await request<DataResponse<Apod>>('apod', signal);
  if (typeof data !== 'object' || data === null) {
    throw new SpaceApiError('The Space API returned an invalid APOD response.', 200, 'INVALID_RESPONSE');
  }
  return data;
}

export async function getAnalogPairs(signal?: AbortSignal): Promise<AnalogPairSummary[]> {
  const { data } = await request<DataResponse<AnalogPairSummary[]>>('lunar-analogs', signal);
  if (!Array.isArray(data)) {
    throw new SpaceApiError('La API devolvió una lista de pares inválida.', 200, 'INVALID_RESPONSE');
  }
  return data;
}

export async function getAnalogPair(id: string, signal?: AbortSignal): Promise<Comparison> {
  const query = new URLSearchParams({ id });
  const { data } = await request<DataResponse<Comparison>>(`lunar-analogs?${query}`, signal);
  if (typeof data !== 'object' || data === null || !Array.isArray(data.axes) || data.axes.length !== 9) {
    throw new SpaceApiError('La API devolvió un par lunar inválido.', 200, 'INVALID_RESPONSE');
  }
  return data;
}
