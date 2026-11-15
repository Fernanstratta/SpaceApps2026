import type { ContentTranslation } from './types';

/**
 * English version of the data in `src/data/`. `scripts/verify-i18n.ts`
 * fails if an id in the data has no translation here.
 */
export const contentEn: ContentTranslation = {
  topics: {
    'size-scale': {
      name: 'Size and scale',
      description: 'How the sizes of the Earth and the Moon compare, and how to represent them to scale.',
    },
    gravity: {
      name: 'Gravity',
      description: 'What gravity is and how it affects objects and people on each celestial body.',
    },
    'surface-terrain': {
      name: 'Surface and terrain',
      description: 'The landforms of the Earth and the Moon: mountains, plains, valleys and lunar maria.',
    },
    'earth-moon-distance': {
      name: 'Distance between the Earth and the Moon',
      description: 'How far away the Moon is and how we can picture that distance.',
    },
    temperature: {
      name: 'Temperature',
      description: 'Why temperature changes differently on the Earth and on the Moon.',
    },
    'impact-craters': {
      name: 'Impact craters',
      description: 'How craters form and why they are preserved differently on each body.',
    },
    atmosphere: {
      name: 'Atmosphere',
      description: 'What an atmosphere is and how the Earth’s differs from the lunar environment.',
    },
    'water-ice': {
      name: 'Water and ice',
      description: 'Where water is found on Earth and what we know about ice on the Moon.',
    },
  },

  submodules: {
    'tierra-desde-el-espacio': { title: 'The Earth seen from space', tag: 'Astronomy' },
    'tierra-sobre-la-luna': { title: 'The Earth, small above the Moon', tag: 'Scale' },
    'saltar-en-la-luna': { title: 'Jumping on the Moon', tag: 'Physics' },
    'caminar-con-menos-peso': { title: 'Walking with less weight', tag: 'Physics' },
    'rocas-lunares-en-la-tierra': { title: 'Moon rocks on Earth', tag: 'Geology' },
    'huellas-en-el-polvo-lunar': { title: 'Footprints in the lunar dust', tag: 'Geology' },
    'salida-de-la-tierra': { title: 'Earthrise', tag: 'Astronomy' },
    'medir-la-distancia-con-laser': { title: 'Measuring the distance with lasers', tag: 'Physics' },
    'el-clima-en-la-luna': { title: 'The climate on the Moon', tag: 'Climatology' },
    'mexico-visto-desde-el-espacio': { title: 'Mexico seen from space', tag: 'Geography' },
    'crater-barringer': { title: 'Barringer Crater, Arizona', tag: 'Geology' },
    'crater-tycho': { title: 'Tycho crater', tag: 'Astronomy' },
    'la-capa-que-nos-protege': { title: 'The thin layer that protects us', tag: 'Meteorology' },
    'atardecer-desde-el-espacio': { title: 'Sunset from space', tag: 'Meteorology' },
    'icebergs-en-groenlandia': { title: 'Icebergs in Greenland', tag: 'Geography' },
    'hielo-marino-en-la-antartida': { title: 'Sea ice in Antarctica', tag: 'Climatology' },
  },

  images: {
    'blue-marble': {
      alt: 'The whole Earth seen from the Apollo 17 spacecraft, with Africa and Antarctica visible.',
      author: 'NASA / Apollo 17 crew',
      license: 'Public domain',
    },
    'first-earthrise': {
      alt: 'The Earth, small and partly lit, above the Moon’s horizon.',
      author: 'NASA / William Anders (Apollo 8)',
      license: 'Public domain',
    },
    'young-jump': {
      alt: 'Astronaut John Young jumping on the lunar surface next to the lunar module.',
      author: 'NASA / Charles M. Duke Jr. (Apollo 16)',
      license: 'Public domain',
    },
    aldrin: {
      alt: 'Astronaut Buzz Aldrin standing on the surface of the Moon.',
      author: 'NASA / Neil Armstrong (Apollo 11)',
      license: 'Public domain',
    },
    'genesis-rock': {
      alt: 'The “Genesis Rock” on the lunar soil, next to a scale instrument.',
      author: 'NASA (Apollo 15); crop by James Stuby',
      license: 'CC0 1.0',
    },
    bootprint: {
      alt: 'An astronaut’s bootprint in the dust of the Moon.',
      author: 'NASA / Buzz Aldrin (Apollo 11)',
      license: 'Public domain',
    },
    earthrise: {
      alt: '“Earthrise”: the Earth appears above the lunar horizon.',
      author: 'NASA / Bill Anders (Apollo 8)',
      license: 'Public domain',
    },
    'laser-reflector': {
      alt: 'Laser retroreflector placed on the lunar surface by Apollo 11.',
      author: 'NASA (Apollo 11)',
      license: 'Public domain',
    },
    'diviner-south-pole': {
      alt: 'Color map of the surface temperature at the Moon’s south pole.',
      author: 'NASA / GSFC / UCLA (Diviner instrument, LRO)',
      license: 'Public domain',
    },
    'mexico-from-iss': {
      alt: 'The territory of Mexico photographed from the International Space Station.',
      author: 'NASA / International Space Station Expedition 16',
      license: 'Public domain',
    },
    barringer: {
      alt: 'Aerial view of Barringer Crater, an impact crater in the Arizona desert.',
      author: 'USGS / D. Roddy',
      license: 'Public domain',
    },
    tycho: {
      alt: 'The central peak of the lunar crater Tycho casting a long shadow at sunrise.',
      author: 'NASA / GSFC / Arizona State University (LRO)',
      license: 'Public domain',
    },
    'top-of-atmosphere': {
      alt: 'The upper layers of the Earth’s atmosphere seen from orbit, with the Moon in the background.',
      author: 'NASA Earth Observatory (International Space Station)',
      license: 'Public domain',
    },
    'iss-sunset': {
      alt: 'Sunset over the Indian Ocean seen from the International Space Station.',
      author: 'NASA / International Space Station Expedition 23',
      license: 'Public domain',
    },
    'greenland-iceberg': {
      alt: 'An iceberg locked in the sea ice of a bay in Greenland.',
      author: 'NASA / Jeremy Harbeck (Operation IceBridge)',
      license: 'Public domain',
    },
    'antarctic-sea-ice': {
      alt: 'Sea ice covering the Bellingshausen Sea, off the coast of Antarctica.',
      author: 'NASA / Michael Studinger (Operation IceBridge)',
      license: 'Public domain',
    },
  },

  resourceCategories: {
    'astronomical-data': {
      name: 'Astronomical data',
      description: 'Physical and orbital parameters of the Earth and the Moon published by space agencies.',
    },
    'lunar-geological': {
      name: 'Lunar and geological information',
      description: 'Images, geological maps and databases about the lunar surface and impact craters.',
    },
    'earth-geographic': {
      name: 'Earth geographic data',
      description: 'Satellite imagery and geographic information about the Earth, including Mexico.',
    },
    cartographic: {
      name: 'Cartographic information',
      description: 'Open data for building and displaying maps.',
    },
    'scientific-educational': {
      name: 'Scientific and educational references',
      description: 'Outreach materials and classroom resources from recognized space agencies.',
    },
  },

  resources: {
    'nasa-nssdca-moon-fact-sheet': {
      name: 'Moon Fact Sheet',
      description: 'Table of the Moon’s physical and orbital parameters, with a direct comparison between the Moon and the Earth.',
      informationType: 'Physical and orbital parameters',
    },
    'nasa-nssdca-earth-fact-sheet': {
      name: 'Earth Fact Sheet',
      description: 'Table of the Earth’s physical, orbital and atmospheric parameters.',
      informationType: 'Physical and orbital parameters',
    },
    'nasa-jpl-horizons': {
      name: 'Horizons System',
      description:
        'Online service that generates high-precision ephemerides for solar system bodies, including the Moon. It offers a web interface and an API.',
      informationType: 'Ephemerides and orbital positions',
    },
    'nasa-moon-trek': {
      description:
        'Interactive web portal to explore lunar maps and data from past and current missions: topography, mineralogy and geology.',
      informationType: 'Lunar maps and data visualization',
    },
    'lroc-asu': {
      description:
        'Official website of the Lunar Reconnaissance Orbiter camera system, with high-resolution images of the lunar surface.',
      informationType: 'Images of the lunar surface',
    },
    'usgs-unified-geologic-map-moon': {
      name: 'Unified Geologic Map of the Moon, 1:5M (2020)',
      description:
        'Digital, global and uniform geologic map of the Moon at a 1:5,000,000 scale, with geologic units and linear features.',
      informationType: 'Geologic map (GIS)',
    },
    'passc-earth-impact-database': {
      description: 'Database of confirmed impact structures on Earth, maintained as a non-profit source of information.',
      informationType: 'Terrestrial impact craters',
    },
    'usgs-earthexplorer': {
      description:
        'Online tool to search for and download satellite imagery, aerial photographs, elevation data and cartographic products.',
      informationType: 'Satellite imagery and elevation data',
      license: 'Most data are in the public domain; some datasets have restrictions noted on the site itself.',
    },
    inegi: {
      name: 'Geographic information of Mexico',
      organization: 'Instituto Nacional de Estadística y Geografía (INEGI)',
      description:
        'Mexico’s official agency that publishes the country’s geographic and statistical information, useful for locations in Baja California.',
      informationType: 'National geographic and statistical information',
      license:
        'INEGI Free Use of Information Terms (Términos de Libre Uso de la Información del INEGI). Suggested attribution: “Fuente: INEGI, nombre del producto”.',
    },
    openstreetmap: {
      organization: 'OpenStreetMap Foundation and contributors',
      description: 'Open map data created by a global community. Starman will use it as the base map in its interactive maps.',
      informationType: 'Open cartographic data',
      license: 'Open Database License (ODbL). Attribution: “© OpenStreetMap contributors”.',
    },
    'natural-earth': {
      organization: 'Natural Earth (supported by NACIS)',
      description: 'Vector and raster map datasets at 1:10m, 1:50m and 1:110m scales for small-scale maps.',
      informationType: 'Vector and raster cartographic data',
      license: 'Public domain.',
    },
    'nasa-science-moon': {
      name: 'Moon – NASA Science',
      description: 'NASA’s outreach section about the Moon: general facts, exploration, orbit, surface and missions.',
      informationType: 'Science outreach',
    },
    'esa-teach-with-space': {
      name: 'Teach with Space – Classroom resources',
      organization: 'European Space Agency (ESA)',
      description:
        'Collection of curriculum resources for the classroom that use space as a starting point for science lessons, with guides, activities and experiments.',
      informationType: 'Teaching resources',
    },
  },

  referenceLocations: {
    'mexicali-bc': { country: 'Mexico' },
  },
};
