import { useEffect, useState } from 'react';
import { getAnalogPair, getAnalogPairs } from '../lib/spaceApi';
import type { Comparison, AnalogPairSummary, AxisSideValue, EarthSite, MoonSite } from '../lib/spaceApiTypes';

const scoreFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });
const metricFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 4 });
const percentFormat = new Intl.NumberFormat('es-MX', { style: 'percent', maximumFractionDigits: 1 });
const valueStatus = {
  measured: 'Medido',
  literature: 'Publicado',
  reference: 'Referencia',
  placeholder: 'Provisional',
};

function SiteCard({ label, site }: { label: string; site: EarthSite | MoonSite }) {
  return (
    <article>
      <p className="lunar-site-label">{label}</p>
      <h4>{site.name}</h4>
      <p>{site.region} · {site.type_es}</p>
      <p>
        {metricFormat.format(site.lat)}°, {metricFormat.format(site.lon)}° ·{' '}
        {site.coordinate_status === 'provisional' ? 'Coordenadas provisionales' : 'Coordenadas de referencia'}
      </p>
      <p>Radio del área de análisis de {metricFormat.format(site.aoi.radius_m / 1000)} km. {site.aoi.note}</p>
      {site.coordinate_source_url && <a href={site.coordinate_source_url}>Fuente de coordenadas</a>}
    </article>
  );
}

function AxisValue({ entry, sourcePlan }: { entry: AxisSideValue | null; sourcePlan: string }) {
  if (!entry) {
    return (
      <>
        <span className="lunar-note">Medición pendiente</span>
        <small>Fuente prevista · {sourcePlan}</small>
      </>
    );
  }

  return (
    <>
      <strong>{metricFormat.format(entry.value)}</strong>{' '}
      <span className="lunar-badge" data-provisional={entry.status === 'placeholder'}>
        {valueStatus[entry.status]}
      </span>
      <small>{entry.source_url ? <a href={entry.source_url}>{entry.source}</a> : entry.source}</small>
      {entry.method && <small>{entry.method}</small>}
      {entry.observed_at && <small>Periodo de observación {entry.observed_at}</small>}
      {entry.resolution_m !== undefined && (
        <small>Resolución de {metricFormat.format(entry.resolution_m)} m</small>
      )}
    </>
  );
}

function PairDetails({ pair }: { pair: Comparison }) {
  const { ils } = pair;

  return (
    <>
      <h3>{pair.title_es}</h3>
      <div className="evidence-grid">
        <SiteCard label="Tierra" site={pair.earth_site} />
        <SiteCard label="Luna" site={pair.moon_site} />
      </div>
      <p className="lunar-result">
        <strong>
          {ils.value === null
            ? 'ILS sin datos comparables'
            : `ILS${ils.data_completeness < 1 ? ' parcial' : ''} de ${scoreFormat.format(ils.value)} / 100`}
        </strong>
        {' · '}{ils.axes_used} de {pair.axes.length} ejes con puntuación
        {' · '}{percentFormat.format(ils.data_completeness)} del peso cubierto
      </p>
      {ils.has_placeholders && (
        <p className="lunar-warning">Los valores marcados como provisionales quedan fuera del cálculo del ILS.</p>
      )}
      <div className="lunar-table-wrap" role="region" aria-label="Resultados de los nueve ejes" tabIndex={0}>
        <table className="lunar-axes">
          <thead>
            <tr>
              <th scope="col">Eje</th>
              <th scope="col">Tierra</th>
              <th scope="col">Luna</th>
              <th scope="col">Similitud</th>
            </tr>
          </thead>
          <tbody>
            {pair.axes.map(axis => (
              <tr key={axis.key}>
                <th scope="row">
                  {axis.name_es}
                  <small>{axis.units}</small>
                  <span className="lunar-badge">Confianza del método {axis.confidence}</span>
                </th>
                <td><AxisValue entry={axis.earth} sourcePlan={axis.source_plan.earth} /></td>
                <td><AxisValue entry={axis.moon} sourcePlan={axis.source_plan.moon} /></td>
                <td>
                  {axis.similarity === null ? (
                    <span className="lunar-note">Sin puntuación</span>
                  ) : (
                    <>
                      <strong>{scoreFormat.format(axis.similarity)} / 100</strong>
                      <meter min={0} max={100} value={axis.similarity} aria-label={`Similitud en ${axis.name_es}`} />
                      {axis.flag === 'similitud_por_ausencia' && <small>Similitud por ausencia de hielo</small>}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="analogy">
        <h4>En qué se parecen</h4>
        <p>{pair.education.match_es}</p>
        <h4>Pregunta para explorar</h4>
        <p>{pair.education.hook_es}</p>
        <h4>Dónde se rompe la analogía</h4>
        <div className="lunar-limitations">
          {pair.education.breaks_es.map(({ axis, text }) => <p key={axis}>{text}</p>)}
        </div>
      </div>
    </>
  );
}

export function LunarAnalogComparator() {
  const [catalog, setCatalog] = useState<AnalogPairSummary[] | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [pair, setPair] = useState<Comparison | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const [pairError, setPairError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getAnalogPairs(controller.signal).then(
      entries => {
        if (controller.signal.aborted) return;
        setCatalog(entries);
        setSelectedId(entries[0]?.pair_id ?? '');
      },
      () => { if (!controller.signal.aborted) setCatalogError(true); },
    );
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const controller = new AbortController();
    getAnalogPair(selectedId, controller.signal).then(
      entry => { if (!controller.signal.aborted) setPair(entry); },
      () => { if (!controller.signal.aborted) setPairError(true); },
    );
    return () => controller.abort();
  }, [selectedId]);

  return (
    <section id="lunar-analogs" lang="es" aria-labelledby="lunar-analogs-heading">
      <h2 id="lunar-analogs-heading">Baja California y Sonora ↔ Luna</h2>
      <p>Compara cinco pares de sitios con los nueve ejes del Índice de Similitud Lunar (ILS).</p>
      {catalogError && <p role="alert">No se pudo cargar el catálogo lunar. Vuelve a intentar más tarde.</p>}
      {!catalog && !catalogError && <p role="status">Cargando pares lunares…</p>}
      {catalog?.length === 0 && <p>El catálogo lunar está vacío.</p>}
      {catalog && catalog.length > 0 && (
        <>
          <label className="lunar-picker">
            Par de sitios
            <select value={selectedId} onChange={event => {
              setPair(null);
              setPairError(false);
              setSelectedId(event.currentTarget.value);
            }}>
              {catalog.map(entry => <option key={entry.pair_id} value={entry.pair_id}>{entry.title_es}</option>)}
            </select>
          </label>
          {pairError && <p role="alert">No se pudo cargar la comparación. Selecciona otro par o vuelve a intentar más tarde.</p>}
          {!pair && !pairError && <p role="status">Cargando la comparación…</p>}
          {pair && <PairDetails pair={pair} />}
        </>
      )}
    </section>
  );
}
