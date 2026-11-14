import type { CelestialBodyInformation } from '../../types';
import { getDataState } from '../../utils/nullable';
import { DataStateMessage } from '../common/DataStateMessage';

interface CelestialBodyPanelProps {
  body: 'earth' | 'moon';
  title: string;
  information: CelestialBodyInformation | null;
}

/** Information panel for the Earth or the Moon. Renders nothing invented. */
export function CelestialBodyPanel({ body, title, information }: CelestialBodyPanelProps) {
  const state = getDataState(information);

  return (
    <article className={`body-panel body-panel--${body}`} data-state={state}>
      <h3 className="body-panel__title">
        <span className={`body-dot body-dot--${body}`} aria-hidden="true" />
        {title}
      </h3>
      {state !== 'available' || !information ? (
        <DataStateMessage state={state === 'available' ? 'empty' : state} compact />
      ) : (
        <>
          {information.summary ? <p>{information.summary}</p> : null}
          {information.measurements && information.measurements.length > 0 ? (
            <dl className="field-list">
              {information.measurements.map((measurement) => (
                <div className="field-list__row" key={measurement.id}>
                  <dt>{measurement.label}</dt>
                  <dd>
                    {String(measurement.value)}
                    {measurement.unit ? ` ${measurement.unit}` : ''}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </>
      )}
    </article>
  );
}
