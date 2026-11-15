import { useState } from 'react';
import { MIN_NOTE_LENGTH, type Finding } from '../../hooks/useMissionProgress';
import { useRoverMissionText } from '../../i18n/missions';
import { FindingSummary } from './FindingSummary';

interface FindingLogProps {
  findings: Finding[];
  max: number;
  onEditNote: (id: string, note: string) => void;
  onRemove: (id: string) => void;
}

/**
 * Bitácora de hallazgos: cada uno con su referencia en el visor, dato, capas,
 * fuente y nota. La nota se puede editar y el hallazgo, eliminar.
 */
export function FindingLog({ findings, max, onEditNote, onRemove }: FindingLogProps) {
  const { log } = useRoverMissionText();
  const [editing, setEditing] = useState<{ id: string; note: string } | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  return (
    <section className="finding-log" aria-labelledby="finding-log-title">
      <div className="finding-log__head">
        <h3 id="finding-log-title" className="mission-step__subtitle">
          {log.title}
        </h3>
        <span className="finding-log__count">{log.count(findings.length, max)}</span>
      </div>

      {findings.length === 0 ? (
        <p className="field__hint">{log.none}</p>
      ) : (
        <ol className="finding-log__list">
          {findings.map((finding, i) => {
            const isEditing = editing?.id === finding.id;
            const missingNote = finding.note.trim().length < MIN_NOTE_LENGTH;
            return (
              <li key={finding.id} className={`finding-card${missingNote ? ' finding-card--incomplete' : ''}`}>
                <span className="finding-card__number" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="finding-card__body">
                  <FindingSummary finding={finding} showNote={!isEditing} />
                  {missingNote && !isEditing ? <p className="field__error">{log.noteMissing}</p> : null}

                  {isEditing ? (
                    <div className="field">
                      <label htmlFor={`note-${finding.id}`}>{log.noteLabel}</label>
                      <textarea
                        id={`note-${finding.id}`}
                        rows={3}
                        maxLength={600}
                        value={editing.note}
                        onChange={(event) => setEditing({ id: finding.id, note: event.target.value })}
                      />
                      <div className="finding-card__actions">
                        <button
                          type="button"
                          className="button button--primary button--small"
                          disabled={editing.note.trim().length < MIN_NOTE_LENGTH}
                          onClick={() => {
                            onEditNote(finding.id, editing.note.trim());
                            setEditing(null);
                          }}
                        >
                          {log.save}
                        </button>
                        <button type="button" className="button button--ghost button--small" onClick={() => setEditing(null)}>
                          {log.cancel}
                        </button>
                      </div>
                    </div>
                  ) : confirmRemove === finding.id ? (
                    <div className="finding-card__actions" role="group" aria-label={log.removeConfirm}>
                      <span className="finding-card__confirm">{log.removeConfirm}</span>
                      <button
                        type="button"
                        className="button button--danger button--small"
                        onClick={() => {
                          onRemove(finding.id);
                          setConfirmRemove(null);
                        }}
                      >
                        {log.removeYes}
                      </button>
                      <button type="button" className="button button--ghost button--small" onClick={() => setConfirmRemove(null)}>
                        {log.removeNo}
                      </button>
                    </div>
                  ) : (
                    <div className="finding-card__actions">
                      <button type="button" className="link-button" onClick={() => setEditing({ id: finding.id, note: finding.note })}>
                        {log.edit}
                        <span className="visually-hidden"> {i + 1}</span>
                      </button>
                      <button type="button" className="link-button link-button--danger" onClick={() => setConfirmRemove(finding.id)}>
                        {log.remove}
                        <span className="visually-hidden"> {i + 1}</span>
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
