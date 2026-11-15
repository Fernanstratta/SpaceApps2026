import { getPairLabels } from '../../data/analogText';
import { axisAcrossPairs, getPair, isPairId, pairAxis } from '../../data/lunarAnalogs';
import { playgroundLink } from '../../data/playground';
import { useI18n } from '../../i18n/I18nContext';
import { Link } from '../../router/Link';
import type { SubmoduleComparison } from '../../types';
import { AxisCard } from '../analogs/AxisCard';
import { AxisScale } from '../analogs/AxisScale';
import { IlsSummary } from '../analogs/IlsSummary';
import { useAnalogText } from '../analogs/useAnalogText';

/**
 * Comparación Tierra–Luna de una lección, con los datos del backend de sus
 * pares. Usa los mismos componentes que Starman Playground, con el nivel de
 * detalle de la lección:
 *  - `simple` (primaria): la escala y una ficha sencilla por par.
 *  - `guided` (secundaria): además, tolerancia, peso, confianza y advertencias.
 *  - `full` (preparatoria): además, fuente, método y valor crudo, y el ILS de cada par.
 */
export function LessonComparison({ comparison }: { comparison: SubmoduleComparison }) {
  const { language } = useI18n();
  const { t } = useAnalogText();
  const pairIds = comparison.pairIds.filter(isPairId);
  const rows = axisAcrossPairs(comparison.axisId, pairIds);
  const detail = comparison.detail;

  return (
    <div className={`lesson-comparison lesson-comparison--${detail}`}>
      <p className="lesson-comparison__lead">{comparison.lead}</p>
      <AxisScale axisId={comparison.axisId} rows={rows} showTolerance={detail !== 'simple'} />
      <div className="lesson-comparison__cards">
        {pairIds.map((id) => {
          const pair = getPair(id);
          return (
            <div key={id} className="lesson-comparison__pair">
              <AxisCard pair={pair} axis={pairAxis(pair, comparison.axisId)} detail={detail} heading="pair" />
              {detail === 'full' ? <IlsSummary pair={pair} compact /> : null}
              <Link className="lesson-comparison__link" to={playgroundLink({ pair: id, axis: comparison.axisId })}>
                {t.openInPlayground}: {getPairLabels(pair, language).short} →
              </Link>
            </div>
          );
        })}
      </div>
      <p className="lesson-comparison__disclaimer">{t.ils.disclaimer}</p>
    </div>
  );
}
