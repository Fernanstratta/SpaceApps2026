import type { ReactElement } from 'react';
import type { TopicId } from '../../types';

/** Small decorative line icons, one per topic (comparative axis). */
export function TopicIcon({ topicId }: { topicId: TopicId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[topicId]}
    </svg>
  );
}

const ICONS: Record<TopicId, ReactElement> = {
  // Pendiente: una ladera con su ángulo.
  slope: (
    <>
      <path d="M3 19h18L7 7z" />
      <path d="M11 19a4 4 0 0 0-1.2-2.9" />
    </>
  ),
  // Rugosidad: perfil irregular y ondas de radar.
  roughness: (
    <>
      <path d="M2 18l3-2 2 2 3-3 2 2 3-4 2 3 3-2 2 1" />
      <path d="M9 9a4 4 0 0 1 6 0M6.5 6.5a8 8 0 0 1 11 0" />
    </>
  ),
  // Composición: un cristal.
  mineralogy: (
    <>
      <path d="M12 3l7 6-7 12L5 9z" />
      <path d="M5 9h14M12 3v18" />
    </>
  ),
  // Albedo: el Sol y un rayo reflejado.
  albedo: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <path d="M8.5 8.5L13 18l5-9" />
      <path d="M3 19h18" />
    </>
  ),
  // Amplitud térmica: termómetro.
  thermal: (
    <>
      <path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z" />
      <path d="M12 9v7" />
    </>
  ),
  // Aridez: hoja tachada.
  aridity: (
    <>
      <path d="M6 18c0-7 5-11 13-12-1 8-5 13-12 13" />
      <path d="M4 4l16 16" />
    </>
  ),
  // Humedad y hielo: gota.
  ice: (
    <>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      <path d="M9.5 14.5h5M12 12v5" />
    </>
  ),
  // Polvo: partículas finas.
  dust: (
    <>
      <circle cx="6" cy="15" r="1.4" />
      <circle cx="11" cy="17" r="1" />
      <circle cx="15" cy="13" r="1.6" />
      <circle cx="19" cy="17" r="1" />
      <circle cx="9" cy="10" r="1" />
      <path d="M3 20h18" />
    </>
  ),
  // Cráteres y cavidades.
  craters: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="2.2" />
      <circle cx="15" cy="15" r="1.5" />
    </>
  ),
};
