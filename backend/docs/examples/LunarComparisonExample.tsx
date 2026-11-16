import { useEffect, useState } from 'react';
import type { AnalogPairSummary, Comparison, DataResponse } from '../../src/lib/spaceApiTypes';
import { createTerranautaClient } from './terranautaClient.js';

const client = createTerranautaClient();
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 2 });

export function LunarComparisonExample() {
  const [pairs, setPairs] = useState<AnalogPairSummary[] | null>(null);
  const [detail, setDetail] = useState<Comparison | null>(null);
  const [pairId, setPairId] = useState('');
  const [listError, setListError] = useState('');
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    const request = new AbortController();
    client.get<DataResponse<AnalogPairSummary[]>>('/api/lunar-analogs', undefined, request.signal)
      .then(({ data }) => {
        if (request.signal.aborted) return;
        setPairs(data);
        setPairId(data[0]?.pair_id ?? '');
      })
      .catch((error: unknown) => {
        if (!request.signal.aborted) {
          setListError(error instanceof Error ? error.message : 'Could not load the lunar catalog.');
        }
      });
    return () => request.abort();
  }, []);

  useEffect(() => {
    if (!pairId) return;

    const request = new AbortController();
    client.get<DataResponse<Comparison>>('/api/lunar-analogs', new URLSearchParams({ id: pairId }), request.signal)
      .then(({ data }) => {
        if (!request.signal.aborted) setDetail(data);
      })
      .catch((error: unknown) => {
        if (!request.signal.aborted) {
          setDetailError(error instanceof Error ? error.message : 'Could not load this pair.');
        }
      });
    return () => request.abort();
  }, [pairId]);

  if (listError) return <p role="alert">{listError}</p>;
  if (pairs === null) return <p role="status">Loading lunar pairs…</p>;
  if (pairs.length === 0) return <p>No lunar pairs are available.</p>;

  return (
    <section>
      <h2>Earth–Moon comparison</h2>
      <label htmlFor="lunar-pair">Lunar analog pair</label>
      <select
        id="lunar-pair"
        value={pairId}
        onChange={event => {
          setDetail(null);
          setDetailError('');
          setPairId(event.target.value);
        }}
      >
        {pairs.map(pair => <option key={pair.pair_id} value={pair.pair_id}>{pair.title_es}</option>)}
      </select>
      {detailError && <p role="alert">{detailError}</p>}
      {!detail && !detailError && <p role="status">Loading comparison…</p>}
      {detail && (
        <article>
          <h3>{detail.earth_site.name} and {detail.moon_site.name}</h3>
          <p>
            {detail.ils.value === null ? 'Similarity pending' : `Similarity ${detail.ils.value}/100`}
            {' · '}Weighted coverage {percent.format(detail.ils.data_completeness)}
            {' · '}{detail.ils.axes_used} of {detail.axes.length} axes scored
          </p>
          <p>{detail.education.match_es}</p>
          <ul>
            {detail.axes.map(axis => (
              <li key={axis.key}>
                <strong>{axis.name_es}</strong>{' · '}
                {axis.similarity === null ? 'Pending' : `${axis.similarity}/100`}
                {' · '}Method grade {axis.confidence}
                {axis.earth && <> · Earth {axis.earth.value} ({axis.units}, {axis.earth.status})</>}
                {axis.moon && <> · Moon {axis.moon.value} ({axis.units}, {axis.moon.status})</>}
              </li>
            ))}
          </ul>
        </article>
      )}
    </section>
  );
}
