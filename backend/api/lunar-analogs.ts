import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireGet } from '../server/http.js';
import { getLunarAnalog, lunarAnalogIndex } from '../server/lunarAnalogs.js';
import type { Comparison, AnalogPairSummary, ApiError, DataResponse } from '../src/lib/spaceApiTypes';

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (!requireGet(request, response)) return;

  const { id } = request.query;
  const data = id === undefined ? lunarAnalogIndex : typeof id === 'string' ? getLunarAnalog(id) : undefined;
  if (!data) {
    const body: ApiError = { error: { code: 'PAIR_NOT_FOUND', message: 'Par lunar no encontrado.' } };
    response.setHeader('Cache-Control', 'no-store');
    response.status(404).json(body);
    return;
  }

  const body: DataResponse<Comparison | AnalogPairSummary[]> = { data };
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400');
  response.status(200).json(body);
}
