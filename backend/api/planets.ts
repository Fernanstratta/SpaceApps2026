import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireGet } from '../server/http.js';
import { planets } from '../server/planets.js';
import type { PlanetsResponse } from '../src/lib/spaceApiTypes';

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (!requireGet(request, response)) return;

  const body: PlanetsResponse = { data: planets };
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');
  response.status(200).json(body);
}
