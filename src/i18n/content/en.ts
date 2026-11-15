import { playgroundEn } from '../playground.en';
import type { ContentTranslation } from './types';

/**
 * English version of the data in `src/data/`. `scripts/verify-i18n.ts`
 * fails if an id in the data has no translation here.
 */
export const contentEn: ContentTranslation = {
  // Topic names come from the Playground axis texts, so portal and filters match.
  topics: {
    slope: {
      name: playgroundEn.axes.slope.name,
      description: 'How flat the ground is and why that decides where a spacecraft can land or a vehicle can drive.',
    },
    roughness: {
      name: playgroundEn.axes.roughness.name,
      description: 'How smooth or rocky a surface is, and how radar lets us see it from space.',
    },
    mineralogy: {
      name: playgroundEn.axes.mineralogy.name,
      description: 'What the rocks of the Earth and the Moon are made of, and how their composition is recognized from space.',
    },
    albedo: {
      name: playgroundEn.axes.albedo.name,
      description: 'How much sunlight a surface reflects and what that reveals about its composition and temperature.',
    },
    thermal: {
      name: playgroundEn.axes.thermal.name,
      description: 'How much the temperature changes between day and night, and why the lack of an atmosphere makes the Moon extreme.',
    },
    aridity: {
      name: playgroundEn.axes.aridity.name,
      description: 'How dry and free of vegetation a place is, and why deserts are good analogs of a lifeless world.',
    },
    volatiles: {
      name: playgroundEn.axes.volatiles.name,
      description: 'Where there may be water or ice below the surface, and why lunar ice is key for a permanent base.',
    },
    dust: {
      name: playgroundEn.axes.dust.name,
      description: 'How fine the soil is and why lunar dust is a challenge for astronauts and their equipment.',
    },
    craters: {
      name: playgroundEn.axes.craters.name,
      description: 'How craters and cavities form, and what their shape reveals about their origin and erosion.',
    },
  },

  submodules: {
    'terreno-plano-para-aterrizar': { title: 'Flat ground for landing', tag: 'Engineering' },
    'medir-pendientes-desde-el-espacio': { title: 'Measuring slopes from space', tag: 'Cartography' },
    'donde-si-y-donde-no-aterrizar': { title: 'Where to land and where not to', tag: 'Analogs' },
    'superficies-lisas-y-rocosas': { title: 'Smooth and rocky surfaces', tag: 'Geology' },
    'ver-la-rugosidad-con-radar': { title: 'Seeing roughness with radar', tag: 'Physics' },
    'campos-de-lava-y-sierras': { title: 'Lava fields and mountain ranges', tag: 'Analogs' },
    'rocas-oscuras-y-rocas-claras': { title: 'Dark rocks and light rocks', tag: 'Geology' },
    'leer-la-composicion-desde-el-espacio': { title: 'Reading composition from space', tag: 'Remote sensing' },
    'volcanes-de-baja-california-y-sonora': { title: 'Volcanoes of Baja California and Sonora', tag: 'Analogs' },
    'cuanta-luz-refleja-una-superficie': { title: 'How much light does a surface reflect?', tag: 'Physics' },
    'medir-el-albedo-con-satelites': { title: 'Measuring albedo with satellites', tag: 'Remote sensing' },
    'sitios-claros-y-oscuros': { title: 'Bright sites and dark sites', tag: 'Analogs' },
    'el-clima-en-la-luna': { title: 'The climate on the Moon', tag: 'Climatology' },
    'medir-la-temperatura-desde-orbita': { title: 'Measuring temperature from orbit', tag: 'Remote sensing' },
    'del-dia-a-la-noche': { title: 'From day to night in Sonora and on the Moon', tag: 'Analogs' },
    'salida-de-la-tierra': { title: 'Earthrise', tag: 'Astronomy' },
    'mexico-visto-desde-el-espacio': { title: 'Mexico seen from space', tag: 'Geography' },
    'desiertos-como-analogos-lunares': { title: 'Deserts as lunar analogs', tag: 'Analogs' },
    'agua-en-la-tierra-hielo-en-la-luna': { title: 'Water on Earth, ice on the Moon', tag: 'Hydrology' },
    'buscar-agua-desde-el-espacio': { title: 'Looking for water from space', tag: 'Remote sensing' },
    'seco-contra-helado': { title: 'Dry versus icy: Cucapá and Shackleton', tag: 'Analogs' },
    'huellas-en-el-polvo-lunar': { title: 'Footprints in the lunar dust', tag: 'Geology' },
    'cuanto-polvo-fino-tiene-un-suelo': { title: 'How much fine dust a soil holds', tag: 'Soil science' },
    'polvo-en-la-laguna-salada': { title: 'Dust in Laguna Salada and on the Moon', tag: 'Analogs' },
    'crater-barringer': { title: 'How a crater forms', tag: 'Geology' },
    'crater-tycho': { title: 'Measuring the shape of a crater', tag: 'Geometry' },
    'crateres-y-cavidades-de-la-region': { title: 'Craters and cavities of the region', tag: 'Analogs' },
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
    'apollo11-lro': {
      alt: 'Orbital view of the Mare Tranquillitatis plain with small craters, where Apollo 11 landed.',
      author: 'NASA Goddard Space Flight Center (LRO)',
      license: 'Public domain',
    },
    'shackleton-lroc': {
      alt: 'Shackleton crater, at the lunar south pole, with its interior in shadow and its rim lit.',
      author: 'LROC and ShadowCam teams (NASA/KARI/ASU)',
      license: 'Public domain',
    },
    'marius-pit': {
      alt: 'Two orbital views of a dark pit in the lunar surface, in the Marius Hills.',
      author: 'NASA / LROC team, Arizona State University',
      license: 'Public domain',
    },
    'gruithuisen-apollo15': {
      alt: 'Oblique orbital view of the Gruithuisen volcanic domes next to a lunar mare.',
      author: 'James Stuby, based on a NASA image (Apollo 15)',
      license: 'Public domain',
    },
    'linne-lro': {
      alt: 'The lunar crater Linné, round and bowl-shaped, seen from orbit.',
      author: 'NASA (LRO, NAC camera)',
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
