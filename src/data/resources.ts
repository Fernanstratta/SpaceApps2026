import type { Resource, ResourceCategory, ResourceCategoryId } from '../types';

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'astronomical-data',
    name: 'Datos astronómicos',
    description: 'Parámetros físicos y orbitales de la Tierra y la Luna publicados por agencias espaciales.',
  },
  {
    id: 'lunar-geological',
    name: 'Información lunar y geológica',
    description: 'Imágenes, mapas geológicos y bases de datos sobre la superficie lunar y los cráteres de impacto.',
  },
  {
    id: 'earth-geographic',
    name: 'Datos geográficos terrestres',
    description: 'Imágenes satelitales e información geográfica de la Tierra, incluida información de México.',
  },
  {
    id: 'cartographic',
    name: 'Información cartográfica',
    description: 'Datos abiertos para construir y mostrar mapas.',
  },
  {
    id: 'scientific-educational',
    name: 'Referencias científicas y educativas',
    description: 'Materiales de divulgación y recursos para el aula de agencias espaciales reconocidas.',
  },
];

/**
 * Verified sources only. Each entry points to the official site of the
 * responsible organization. When a license could not be confirmed, `license`
 * is `null` and the UI asks the reader to check the source's terms.
 */
export const resources: Resource[] = [
  // --- Datos astronómicos ---
  {
    id: 'nasa-nssdca-moon-fact-sheet',
    categoryId: 'astronomical-data',
    name: 'Moon Fact Sheet (Hoja de datos de la Luna)',
    organization: 'NASA – Goddard Space Flight Center (NSSDCA)',
    description:
      'Tabla de parámetros físicos y orbitales de la Luna, con una comparación directa entre la Luna y la Tierra.',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
    informationType: 'Parámetros físicos y orbitales',
    license: null,
    licenseUrl: null,
  },
  {
    id: 'nasa-nssdca-earth-fact-sheet',
    categoryId: 'astronomical-data',
    name: 'Earth Fact Sheet (Hoja de datos de la Tierra)',
    organization: 'NASA – Goddard Space Flight Center (NSSDCA)',
    description: 'Tabla de parámetros físicos, orbitales y atmosféricos de la Tierra.',
    sourceUrl: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
    informationType: 'Parámetros físicos y orbitales',
    license: null,
    licenseUrl: null,
  },
  {
    id: 'nasa-jpl-horizons',
    categoryId: 'astronomical-data',
    name: 'Sistema Horizons',
    organization: 'NASA – Jet Propulsion Laboratory (JPL)',
    description:
      'Servicio en línea que genera efemérides de alta precisión para cuerpos del sistema solar, incluida la Luna. Ofrece interfaz web y API.',
    sourceUrl: 'https://ssd.jpl.nasa.gov/horizons/',
    informationType: 'Efemérides y posiciones orbitales',
    license: null,
    licenseUrl: null,
  },

  // --- Información lunar y geológica ---
  {
    id: 'nasa-moon-trek',
    categoryId: 'lunar-geological',
    name: 'Moon Trek',
    organization: 'NASA – Solar System Treks (JPL / SSERVI)',
    description:
      'Portal web interactivo para explorar mapas y datos lunares de misiones pasadas y actuales: topografía, mineralogía y geología.',
    sourceUrl: 'https://trek.nasa.gov/moon/',
    informationType: 'Mapas y visualización de datos lunares',
    license: null,
    licenseUrl: null,
  },
  {
    id: 'lroc-asu',
    categoryId: 'lunar-geological',
    name: 'Lunar Reconnaissance Orbiter Camera (LROC)',
    organization: 'Arizona State University / NASA',
    description:
      'Sitio oficial del sistema de cámaras de la sonda Lunar Reconnaissance Orbiter, con imágenes de alta resolución de la superficie lunar.',
    sourceUrl: 'https://www.lroc.asu.edu/',
    informationType: 'Imágenes de la superficie lunar',
    license: null,
    licenseUrl: null,
  },
  {
    id: 'usgs-unified-geologic-map-moon',
    categoryId: 'lunar-geological',
    name: 'Mapa Geológico Unificado de la Luna, 1:5M (2020)',
    organization: 'USGS – Astrogeology Science Center',
    description:
      'Mapa geológico digital, global y uniforme de la Luna a escala 1:5,000,000, con unidades geológicas y elementos lineales.',
    sourceUrl:
      'https://astrogeology.usgs.gov/search/map/unified_geologic_map_of_the_moon_1_5m_2020',
    informationType: 'Mapa geológico (SIG)',
    license: null,
    licenseUrl: null,
  },
  {
    id: 'passc-earth-impact-database',
    categoryId: 'lunar-geological',
    name: 'Earth Impact Database',
    organization: 'Planetary and Space Science Centre, University of New Brunswick',
    description:
      'Base de datos de estructuras de impacto confirmadas en la Tierra, mantenida como fuente de información sin fines de lucro.',
    sourceUrl: 'http://www.passc.net/EarthImpactDatabase/New%20website_05-2018/Index.html',
    informationType: 'Cráteres de impacto terrestres',
    license: null,
    licenseUrl: null,
  },

  // --- Datos geográficos terrestres ---
  {
    id: 'usgs-earthexplorer',
    categoryId: 'earth-geographic',
    name: 'EarthExplorer',
    organization: 'USGS – Earth Resources Observation and Science (EROS) Center',
    description:
      'Herramienta en línea para buscar y descargar imágenes satelitales, fotografías aéreas, datos de elevación y productos cartográficos.',
    sourceUrl: 'https://earthexplorer.usgs.gov/',
    informationType: 'Imágenes satelitales y datos de elevación',
    license:
      'La mayoría de los datos son de dominio público; algunos conjuntos tienen restricciones indicadas en el propio sitio.',
    licenseUrl: null,
  },
  {
    id: 'inegi',
    categoryId: 'earth-geographic',
    name: 'Información geográfica de México',
    organization: 'Instituto Nacional de Estadística y Geografía (INEGI)',
    description:
      'Organismo oficial de México que publica información geográfica y estadística del país, útil para ubicaciones en Baja California.',
    sourceUrl: 'https://www.inegi.org.mx/',
    informationType: 'Información geográfica y estadística nacional',
    license:
      'Términos de Libre Uso de la Información del INEGI. Atribución sugerida: «Fuente: INEGI, nombre del producto».',
    licenseUrl: 'https://www.inegi.org.mx/inegi/terminos.html',
  },

  // --- Información cartográfica ---
  {
    id: 'openstreetmap',
    categoryId: 'cartographic',
    name: 'OpenStreetMap',
    organization: 'Fundación OpenStreetMap y colaboradores',
    description:
      'Datos de mapas abiertos creados por una comunidad global. Terranauta los usará como mapa base en sus mapas interactivos.',
    sourceUrl: 'https://www.openstreetmap.org/',
    informationType: 'Datos cartográficos abiertos',
    license: 'Open Database License (ODbL). Atribución: «© Colaboradores de OpenStreetMap».',
    licenseUrl: 'https://www.openstreetmap.org/copyright',
  },
  {
    id: 'natural-earth',
    categoryId: 'cartographic',
    name: 'Natural Earth',
    organization: 'Natural Earth (con apoyo de NACIS)',
    description:
      'Conjunto de datos de mapas vectoriales y ráster a escalas 1:10m, 1:50m y 1:110m para mapas de pequeña escala.',
    sourceUrl: 'https://www.naturalearthdata.com/',
    informationType: 'Datos cartográficos vectoriales y ráster',
    license: 'Dominio público.',
    licenseUrl: 'https://www.naturalearthdata.com/about/terms-of-use/',
  },

  // --- Referencias científicas y educativas ---
  {
    id: 'nasa-science-moon',
    categoryId: 'scientific-educational',
    name: 'La Luna – NASA Science',
    organization: 'NASA',
    description:
      'Sección de divulgación de la NASA sobre la Luna: datos generales, exploración, órbita, superficie y misiones.',
    sourceUrl: 'https://science.nasa.gov/moon/',
    informationType: 'Divulgación científica',
    license: null,
    licenseUrl: null,
  },
  {
    id: 'esa-teach-with-space',
    categoryId: 'scientific-educational',
    name: 'Teach with Space – Recursos para el aula',
    organization: 'Agencia Espacial Europea (ESA)',
    description:
      'Colección de recursos curriculares para el aula que usan el espacio como punto de partida para lecciones de ciencias, con guías, actividades y experimentos.',
    sourceUrl: 'https://www.esa.int/Education/Classroom_resources',
    informationType: 'Recursos didácticos',
    license: null,
    licenseUrl: null,
  },
];

export function getResourcesByCategory(categoryId: ResourceCategoryId): Resource[] {
  return resources.filter((resource) => resource.categoryId === categoryId);
}
