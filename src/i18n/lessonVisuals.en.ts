import type { LessonVisualsText } from './lessonVisuals.es';

/** Labels of the lesson figures (English). Values come from the backend. */
export const lessonVisualsEn: LessonVisualsText = {
  figure: 'Figure',
  illustrative: 'Illustrative sketch: not to scale.',
  fromBackend: 'Values from the backend.',
  noComparable: 'No comparable data',

  slopeRamp: {
    title: 'Tilt the ground',
    label: 'Ground tilt',
    value: (deg) => `${deg}°`,
    safe: 'Nearly flat: a lander can touch down.',
    risky: 'Too steep: the lander could slide or tip over.',
    threshold: (deg) => `The slope axis counts as “nearly flat” everything under ${deg}°.`,
    alt: (deg, safe) => `Ramp tilted ${deg}° with a lander on top. ${safe ? 'It is nearly flat ground.' : 'It is too steep.'}`,
  },

  slopeWaffle: {
    title: 'How much ground is nearly flat',
    cell: 'Each square is 1% of the analysis area.',
    flat: 'Slope under 10°',
    steep: '10° or more',
    share: (percent) => `${percent} nearly flat`,
    alt: (site, percent) => `${site}: ${percent} of the area has a slope under 10°.`,
  },

  radar: {
    title: 'How radar “sees” roughness',
    smooth: 'Smooth surface',
    smoothText: 'The signal bounces like a mirror and almost nothing returns to the satellite.',
    rough: 'Rough surface',
    roughText: 'Rocks scatter the signal in every direction and part of it comes back.',
    alt: 'Two surfaces receive a radar signal. On the smooth one the signal bounces away; on the rough one part of it returns to the satellite.',
    rulersTitle: 'Where each site stands within its own world',
    earthRuler: 'Among the deserts of northwestern Mexico',
    moonRuler: 'Among all places on the Moon',
    smoother: 'smoother',
    rougher: 'rougher',
    percentile: (site, value) => `${site}: percentile ${value}`,
    raw: (value) => `raw ${value}`,
  },

  felsicMafic: {
    title: 'From felsic to mafic',
    felsic: 'Felsic',
    felsicRocks: 'granite, dacite: light, rich in silica',
    mafic: 'Mafic',
    maficRocks: 'basalt: dark, rich in iron and magnesium',
    caveat: 'Value with known limitations',
    alt: (list) => `Composition scale from 0 (felsic) to 1 (mafic). ${list}`,
    item: (site, value) => `${site}: ${value}`,
  },

  albedo: {
    title: 'How light each surface is',
    tone: 'The shade of each square is approximate; the number is the data.',
    scale: 'From 0 (black, reflects nothing) to 1 (white, reflects everything)',
    alt: (site, value) => `${site}: albedo ${value}`,
    reflects: (percent) => `reflects ${percent}`,
  },

  thermal: {
    title: 'How much the temperature changes between day and night',
    linear: 'Normal scale',
    log: 'Log scale',
    scaleLabel: 'Scale',
    linearHint: 'On a normal scale, the difference looks as large as it is.',
    logHint: 'On a log scale each mark is 10 times the previous one: that is how this axis is computed.',
    times: (times) => `≈ ${times} times more`,
    alt: (list) => `Bars with the day/night temperature range of each site. ${list}`,
    item: (site, value) => `${site}: ${value}`,
  },

  ndvi: {
    title: 'What NDVI tells us',
    water: 'Water',
    bare: 'Rock and bare soil',
    shrub: 'Shrubland',
    forest: 'Dense vegetation',
    moon: 'The Moon is set to 0 by definition',
    alt: (list) => `NDVI scale from −1 to 1 with the sites marked. ${list}`,
    item: (site, value) => `${site}: ${value}`,
  },

  ice: {
    title: 'Where ice can last',
    classes: ['Class 0: dry', 'Class 1: ice in a minor part', 'Class 2: persistent moisture', 'Class 3: stable ice'],
    desert: 'Desert on Earth',
    rim: 'Sunlit rim',
    shadow: 'Permanently shadowed interior',
    subsurface: 'Ice below the surface',
    sun: 'Grazing sunlight',
    alt: 'Cross-section of a lunar polar crater next to desert ground. The desert is dry; on the sunlit crater rim ice only lasts below the surface in part of the area; the always-shadowed interior can hold stable ice.',
    valueOf: (site, value) => `${site}: ${value}`,
    notSurface: 'The rim has no surface ice.',
  },

  grains: {
    title: 'Particle sizes',
    clay: 'Clay',
    silt: 'Silt',
    sand: 'Sand',
    gravel: 'Gravel',
    hair: 'A human hair is about 70 µm',
    limit: 'Fine dust limit: ~63 µm',
    fineShare: 'Fine dust fraction at each site',
    alt: (list) => `Fraction of particles smaller than 63 micrometres at each site. ${list}`,
    item: (site, value) => `${site}: ${value}`,
  },

  crater: {
    title: 'The shape of the relief, at the same scale',
    note: 'Every profile is drawn with the same width, so you compare proportions, not size.',
    depth: 'depth',
    height: 'height',
    diameter: 'diameter',
    ratio: (kind, value) => `${kind} = ${value}`,
    alt: (list) => `Relief profiles drawn with the same width. ${list}`,
    item: (site, value) => `${site}: ${value}`,
    realSize: 'Real size',
    meters: (depth, diameter) => `${depth} m deep · ${diameter} m across`,
  },

  terrain: {
    title: 'The real relief of El Elegante',
    only: 'For now only El Elegante has an elevation model. The other sites are shown in photos and profiles.',
  },
};
