/** Editable copy for the single-page Inicio (hero + "¿Qué es Starman?"). */
export const HOME_CONTENT = {
  hero: {
    title: 'Starman',
    lead: 'Explora el universo a través de la Tierra. Descubre cómo los fenómenos y características de la Luna y otros cuerpos celestes se relacionan con nuestro planeta mediante experiencias educativas.',
    primaryCta: 'Explorar Portal Educativo',
  },
  intro: {
    title: '¿Qué es Starman?',
    purpose: {
      title: '¿Para qué sirve?',
      body: 'Reúne temas de astronomía en un solo lugar, con información organizada para aprender en casa o en el salón de clases.',
    },
    realWorld: {
      title: 'Aprender desde lugares conocidos',
      body: 'Starman relacionará la información astronómica con lugares reales de la Tierra. Así, los conceptos científicos se entienden a partir de entornos familiares y los docentes pueden planear actividades y salidas escolares.',
    },
  },
  audiences: {
    title: 'Cada tema, dos vistas',
    student: 'para estudiantes',
    teacher: 'para docentes',
    cta: 'Explorar los módulos',
  },
  topicsTitle: 'Temas del portal',
} as const;

/**
 * Hero Moon image: transparent PNG supplied by the Starman team, served from
 * `public/46124-moon.png`. Its transparent background blends into the black
 * hero. Before publishing, confirm the image's license; if its source
 * requires attribution, fill in `credit` (and `creditUrl`) and it will be
 * shown under the Moon.
 */
export const HERO_MOON_IMAGE: {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string | null;
  creditUrl: string | null;
} = {
  src: `${import.meta.env.BASE_URL}46124-moon.png`,
  width: 348,
  height: 368,
  alt: 'Fotografía de la Luna.',
  credit: null,
  creditUrl: null,
};
