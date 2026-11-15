import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { MAP_PIECES, TRAY_ORDER, type MapPieceId } from '../../data/missions/lunitaMission';
import { useLunitaMissionText } from '../../i18n/missions';
import { MapPieceArt } from './LunitaArt';

interface Drag {
  piece: MapPieceId;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  moving: boolean;
}

/** Distancia en px antes de considerar que el toque es un arrastre y no un clic. */
const DRAG_THRESHOLD = 6;

/**
 * Mapa terrestre en tres piezas. Se arma de tres formas equivalentes:
 *  - Arrastrando una pieza hasta su espacio (mouse o dedo; eventos pointer).
 *  - Tocando una pieza y luego un espacio.
 *  - Con teclado: Tab hasta una pieza, Enter, Tab hasta un espacio, Enter.
 * Una pieza en el espacio equivocado no se coloca: se explica por qué y se reintenta.
 *
 * Al completarlo, los espacios pasan a ser botones para señalar qué parte
 * se parece al terreno lunar (`onPickRegion`).
 */
export function MapPuzzle({
  placed,
  onPlace,
  region,
  onPickRegion,
}: {
  placed: MapPieceId[];
  onPlace: (piece: MapPieceId) => void;
  region: MapPieceId | null;
  onPickRegion: (piece: MapPieceId) => void;
}) {
  const t = useLunitaMissionText().step2;
  const [selected, setSelected] = useState<MapPieceId | null>(null);
  const [message, setMessage] = useState('');
  const [wrongSlot, setWrongSlot] = useState<MapPieceId | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const slotRefs = useRef(new Map<MapPieceId, HTMLElement>());
  const suppressClick = useRef(false);
  const complete = placed.length === MAP_PIECES.length;
  const loose = TRAY_ORDER.filter((piece) => !placed.includes(piece));

  const tryPlace = (piece: MapPieceId, slot: MapPieceId) => {
    if (piece === slot) {
      onPlace(piece);
      setSelected(null);
      setWrongSlot(null);
      setMessage(t.placed(t.pieces[piece]));
    } else {
      setWrongSlot(null);
      // Reinicia la animación de «sacudida» aunque se repita el mismo espacio.
      requestAnimationFrame(() => setWrongSlot(slot));
      setMessage(t.wrong);
    }
  };

  const slotAt = (x: number, y: number): MapPieceId | null => {
    for (const [id, el] of slotRefs.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
    }
    return null;
  };

  const onPointerDown = (piece: MapPieceId) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    // Si el arrastre anterior colocó la pieza, su botón desapareció antes del «click»: se limpia aquí.
    suppressClick.current = false;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({
      piece,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      width: rect.width,
      height: rect.height,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      moving: false,
    });
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const moving = drag.moving || Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > DRAG_THRESHOLD;
    setDrag({ ...drag, x: event.clientX, y: event.clientY, moving });
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (drag.moving) {
      // El «click» que sigue a este arrastre se ignora; si no llega (la pieza ya se colocó), el aviso caduca solo.
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      const slot = slotAt(event.clientX, event.clientY);
      if (slot && !placed.includes(slot)) tryPlace(drag.piece, slot);
    }
    setDrag(null);
  };

  const onPieceClick = (piece: MapPieceId) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    const next = selected === piece ? null : piece;
    setSelected(next);
    setMessage(next ? t.selected(t.pieces[next]) : '');
  };

  const hovered = drag?.moving ? slotAt(drag.x, drag.y) : null;

  return (
    <div className="lunita-puzzle">
      <div className="lunita-board" role="group" aria-label={t.board}>
        {MAP_PIECES.map((slot, index) => {
          const filled = placed.includes(slot);
          const classes = [
            'lunita-slot',
            filled ? 'is-filled' : '',
            wrongSlot === slot ? 'is-wrong' : '',
            hovered === slot && !filled ? 'is-hovered' : '',
            complete && region === slot ? 'is-picked' : '',
          ]
            .filter(Boolean)
            .join(' ');
          const setRef = (el: HTMLElement | null) => {
            if (el) slotRefs.current.set(slot, el);
            else slotRefs.current.delete(slot);
          };
          if (complete) {
            return (
              <button
                key={slot}
                ref={setRef}
                type="button"
                className={classes}
                aria-pressed={region === slot}
                onClick={() => onPickRegion(slot)}
              >
                <MapPieceArt piece={slot} className="lunita-slot__art" />
                <span className="lunita-slot__name">{t.pieces[slot]}</span>
              </button>
            );
          }
          if (filled) {
            return (
              <div key={slot} ref={setRef} className={classes}>
                <MapPieceArt piece={slot} className="lunita-slot__art" />
                <span className="visually-hidden">
                  {t.slot(index + 1)}: {t.pieces[slot]}
                </span>
              </div>
            );
          }
          return (
            <button
              key={slot}
              ref={setRef}
              type="button"
              className={classes}
              onClick={() => (selected ? tryPlace(selected, slot) : setMessage(t.instruction))}
              onAnimationEnd={() => setWrongSlot(null)}
            >
              <span className="lunita-slot__number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="lunita-slot__empty">
                {t.slot(index + 1)}
                <span className="visually-hidden"> — {t.emptySlot}</span>
              </span>
            </button>
          );
        })}
      </div>

      {complete ? null : (
        <>
          <p className="lunita-tray__title">{t.tray}</p>
          <ul className="lunita-tray">
            {loose.map((piece) => (
              <li key={piece}>
                <button
                  type="button"
                  className={[
                    'lunita-piece',
                    selected === piece ? 'is-selected' : '',
                    drag?.piece === piece && drag.moving ? 'is-dragging' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={selected === piece}
                  onPointerDown={onPointerDown(piece)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={() => setDrag(null)}
                  onClick={() => onPieceClick(piece)}
                >
                  <MapPieceArt piece={piece} className="lunita-piece__art" />
                  <span className="lunita-piece__name">{t.pieces[piece]}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="lunita-hint">{t.keyboardHint}</p>
        </>
      )}

      <p className="lunita-live" role="status" aria-live="polite">
        {complete ? '' : message}
      </p>

      {drag?.moving ? (
        <div
          className="lunita-piece lunita-piece--ghost"
          aria-hidden="true"
          style={{
            width: drag.width,
            height: drag.height,
            transform: `translate(${drag.x - drag.offsetX}px, ${drag.y - drag.offsetY}px)`,
          }}
        >
          <MapPieceArt piece={drag.piece} className="lunita-piece__art" />
          <span className="lunita-piece__name">{t.pieces[drag.piece]}</span>
        </div>
      ) : null}
    </div>
  );
}
