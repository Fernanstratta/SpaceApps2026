import { useEffect, useId, useRef, useState } from 'react';

/**
 * Botón «?» con una explicación breve. Se muestra al pasar el ratón, al
 * enfocar con el teclado o al tocarlo (en pantallas táctiles); Escape lo
 * cierra. El texto está enlazado con `aria-describedby`, así que los
 * lectores de pantalla lo leen al llegar al botón.
 */
export function InfoTip({ label, text }: { label: string; text: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);

  // Mantiene la burbuja dentro de la pantalla (las tarjetas de las orillas).
  const place = () => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    bubble.style.setProperty('--tip-shift', '0px');
    const rect = bubble.getBoundingClientRect();
    const pad = 8;
    let shift = 0;
    if (rect.left < pad) shift = pad - rect.left;
    else if (rect.right > window.innerWidth - pad) shift = window.innerWidth - pad - rect.right;
    bubble.style.setProperty('--tip-shift', `${Math.round(shift)}px`);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <span ref={ref} className={`info-tip${open ? ' is-open' : ''}`} onPointerEnter={place} onFocus={place}>
      <button
        type="button"
        className="info-tip__button"
        aria-label={label}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => {
          place();
          setOpen((value) => !value);
        }}
      >
        ?
      </button>
      <span id={id} ref={bubbleRef} role="tooltip" className="info-tip__bubble">
        {text}
      </span>
    </span>
  );
}
