import { TERRAIN_META } from '../../data/missions/roverMission';
import { useRoverMissionText } from '../../i18n/missions';
import { SourceLink } from './SourceLink';

/** Transparencia: qué datos están verificados, cuáles se calculan y cuáles serían simulados. */
export function DataNotes() {
  const { data } = useRoverMissionText();
  return (
    <section className="data-notes" aria-labelledby="data-notes-title">
      <h2 id="data-notes-title">{data.title}</h2>
      <ul>
        <li>{data.verified}</li>
        <li>{data.computed}</li>
        <li>
          <strong>{data.simulated}</strong>
        </li>
        <li>{data.resolutionLimit}</li>
      </ul>
      <p className="data-notes__attribution">
        {data.attributionEarth} <SourceLink id="copernicus-dem" /> · <SourceLink id="open-meteo" />
      </p>
      <p className="data-notes__attribution">
        {data.attributionMoon} <SourceLink id="sldem2015" />
      </p>
      <p className="data-notes__attribution">{data.downloaded(TERRAIN_META.generatedAt)}</p>
    </section>
  );
}
