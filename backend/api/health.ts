import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireGet } from '../server/http.js';
import type { HealthResponse } from '../src/lib/spaceApiTypes';

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (!requireGet(request, response)) return;

  const body: HealthResponse = { status: 'ok' };
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json(body);
}
