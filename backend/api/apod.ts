import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLatestApod } from '../server/apod.js';
import { requireGet } from '../server/http.js';
import type { ApodResponse } from '../src/lib/spaceApiTypes';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!requireGet(request, response)) return;

  const body: ApodResponse = { data: await getLatestApod() };
  const cacheSeconds = body.data.source === 'nasa' ? 900 : 60;
  response.setHeader('Cache-Control', `public, max-age=0, s-maxage=${cacheSeconds}`);
  response.status(200).json(body);
}
