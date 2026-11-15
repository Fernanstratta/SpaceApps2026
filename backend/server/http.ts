import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ApiError } from '../src/lib/spaceApiTypes';

export function requireGet(request: VercelRequest, response: VercelResponse): boolean {
  if (request.method === 'GET') return true;

  const body: ApiError = {
    error: { code: 'METHOD_NOT_ALLOWED', message: 'Use GET for this endpoint.' },
  };
  response.setHeader('Allow', 'GET');
  response.setHeader('Cache-Control', 'no-store');
  response.status(405).json(body);
  return false;
}
