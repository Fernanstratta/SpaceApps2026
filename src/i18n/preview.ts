import type { Language } from './config';
import type { ProposalId } from '../preview/missionPalettes';

/**
 * Textos de la vista previa de diseño (solo en desarrollo). El contenido de
 * las misiones NO está aquí: se usa el real de `i18n/missions`.
 */
const es = {
  pageTitle: 'Vista previa: Misiones en modo claro',
  eyebrow: 'Vista previa local · solo en desarrollo',
  title: 'Tres propuestas para la sección de Misiones',
  intro:
    'Elige una propuesta para ver tus misiones con ese diseño. Los textos, imágenes, edades y botones son los reales; los botones llevan a las misiones de verdad.',
  isolated: 'Esta vista no cambia la página actual ni el modo oscuro. Las propuestas son para el modo claro.',
  choose: 'Propuesta',
  palette: 'Paleta',
  swatches: { bg: 'Fondo', surface: 'Superficie', action: 'Acción', accent: 'Acento' },
  changesTitle: 'Qué cambia',
  desktop: 'Escritorio',
  mobile: 'Móvil',
  sectionTitle: 'Misiones',
  sectionLead: 'Dos misiones para explorar la Tierra y la Luna: una para secundaria y bachillerato y otra para los más pequeños.',
  reliefCaption: 'Relieve calculado de datos de elevación: dos cráteres de la Tierra y uno de la Luna, 3 × 3 km cada uno.',
  demEarth: 'Tierra',
  demMoon: 'Luna',
  proposals: {
    atlas: {
      name: 'Atlas Tierra–Luna',
      summary: 'Azul niebla, texto azul tinta y superficies celestes. El mapa manda.',
      desktop: [
        'El mapa de relieve de la misión 12–17 ocupa unas dos terceras partes del ancho; la pregunta y los botones van en una columna lateral celeste.',
        '4Kids invierte la composición: texto a la izquierda y el mapa de Lunita como imagen principal a la derecha.',
      ],
      mobile: [
        'Cada misión se apila: primero el mapa, después la columna con la pregunta y botones a todo el ancho.',
        'Los tres mapas de relieve pasan a una fila que se desplaza de lado.',
      ],
    },
    cuaderno: {
      name: 'Cuaderno de campo',
      summary: 'Arena suave, títulos azul marino y acentos verde petróleo. Sin tarjetas: fichas sobre el fondo.',
      desktop: [
        'Dos fichas horizontales: imagen con pie de foto a un lado y el texto alineado directamente sobre el fondo arena.',
        'Separadores finos y espacio en blanco marcan la jerarquía en lugar de cajas blancas.',
      ],
      mobile: [
        'Cada ficha se vuelve vertical: imagen, pie de foto y texto en una sola columna.',
        'Los separadores finos se mantienen entre fichas; los botones ocupan todo el ancho.',
      ],
    },
    museo: {
      name: 'Museo interactivo',
      summary: 'Salas de ancho completo en azul hielo y lavanda suave; 4Kids gira alrededor del rompecabezas.',
      desktop: [
        'Misión 12–17 en una sala azul hielo: la panorámica del Apolo 16 a todo lo ancho arriba y la pregunta debajo.',
        '4Kids en una sala lavanda: las tres piezas del rompecabezas rodean el texto, con amarillo y turquesa como acentos.',
      ],
      mobile: [
        'La panorámica se recorta en una franja más alta para que se lea; la pregunta va debajo.',
        'Las piezas del rompecabezas forman una fila arriba del texto de 4Kids.',
      ],
    },
  } satisfies Record<ProposalId, { name: string; summary: string; desktop: string[]; mobile: string[] }>,
};

const en: typeof es = {
  pageTitle: 'Preview: Missions in light mode',
  eyebrow: 'Local preview · development only',
  title: 'Three proposals for the Missions section',
  intro:
    'Pick a proposal to see your missions in that design. Texts, images, ages and buttons are the real ones; the buttons open the real missions.',
  isolated: 'This view does not change the current page or dark mode. The proposals are for light mode.',
  choose: 'Proposal',
  palette: 'Palette',
  swatches: { bg: 'Background', surface: 'Surface', action: 'Action', accent: 'Accent' },
  changesTitle: 'What changes',
  desktop: 'Desktop',
  mobile: 'Mobile',
  sectionTitle: 'Missions',
  sectionLead: 'Two missions to explore the Earth and the Moon: one for middle and high school and one for younger kids.',
  reliefCaption: 'Relief computed from elevation data: two craters on Earth and one on the Moon, 3 × 3 km each.',
  demEarth: 'Earth',
  demMoon: 'Moon',
  proposals: {
    atlas: {
      name: 'Earth–Moon Atlas',
      summary: 'Fog blue, ink-blue text and sky surfaces. The map leads.',
      desktop: [
        'The 12–17 mission relief map takes about two thirds of the width; the question and buttons sit in a sky-blue side column.',
        '4Kids flips the layout: text on the left and Lunita’s map as the main image on the right.',
      ],
      mobile: [
        'Each mission stacks: map first, then the column with the question and full-width buttons.',
        'The three relief maps become a row that scrolls sideways.',
      ],
    },
    cuaderno: {
      name: 'Field notebook',
      summary: 'Soft sand, navy titles and teal accents. No cards: entries sit on the background.',
      desktop: [
        'Two horizontal entries: image with caption on one side and text aligned directly on the sand background.',
        'Thin rules and white space set the hierarchy instead of white boxes.',
      ],
      mobile: [
        'Each entry becomes vertical: image, caption and text in a single column.',
        'Thin rules stay between entries; buttons take the full width.',
      ],
    },
    museo: {
      name: 'Interactive museum',
      summary: 'Full-width rooms in ice blue and soft lavender; 4Kids is built around the puzzle.',
      desktop: [
        '12–17 mission in an ice-blue room: the Apollo 16 panorama full width on top and the question below.',
        '4Kids in a lavender room: the three puzzle pieces surround the text, with yellow and turquoise accents.',
      ],
      mobile: [
        'The panorama is cropped into a taller strip so it reads well; the question goes below.',
        'The puzzle pieces form a row above the 4Kids text.',
      ],
    },
  },
};

export const PREVIEW_TEXT: Record<Language, typeof es> = { es, en };
export type PreviewText = typeof es;
