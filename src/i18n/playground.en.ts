import type { PlaygroundText } from './playground.es';

/**
 * English texts for Starman Playground (same shape as `playground.es.ts`).
 * `backend` holds the translation of the texts the backend only sends in
 * Spanish (pair titles, site names, "how they are alike", "where it breaks").
 * `verify:data` checks that every backend text has a translation here.
 */
export const playgroundEn: PlaygroundText = {
  title: 'Starman Playground',
  lead: 'Compare places in Baja California and Sonora with sites on the Moon using the Lunar Similarity Index.',
  scope:
    'The team focused only on the Moon and only on sites in Baja California and Sonora, so students in the region can relate the content to places they know. The index does not say one site “is the same” as another: it shows how they are alike, how much, with what data, and where the analogy breaks.',

  filters: {
    panelLabel: 'Filters and axis explorer',
    clear: 'Clear filters',
    comparisons: (n, total) => (n === total ? `${total} comparisons` : `${n} of ${total} comparisons`),
    axesLegend: 'Explore by axis',
    axesHint: 'Pick an axis to see it across the five pairs: the value on Earth, the value on the Moon and how alike they are.',
    noAxis: 'None',
    similarity: 'Minimum index',
    similarityValue: (n) => (n === 0 ? 'Any' : `${n} or more`),
    similarityValueText: (n) => (n === 0 ? 'Any index value' : `Index of ${n} or more`),
    similarityScale: ['0', '50', '100'],
    noMatches: 'No comparison reaches that index.',
    noMatchesHint: 'Lower the minimum index or clear the filters to see the five pairs again.',
  },
  analogyTypes: {
    'crater-morphology': 'Crater morphology',
    'basaltic-volcanism': 'Basaltic volcanism',
    'silicic-volcanism': 'Silicic volcanism',
    'landing-terrain': 'Landing terrain',
    'risk-counterexample': 'Risk counterexample',
  },

  mapLabel: 'Interactive map of the Earth sites in Starman Playground',
  marker: (n, name) => `Pair ${n}: ${name}`,
  mapHint: 'Select a marker, or use Tab and Enter. The circle is the analysis area of each site.',
  mapLoading: 'Loading…',
  mapError: 'The map could not be loaded. The rest of the panel is still available.',
  showAll: 'Show all sites',

  areaPicker: 'Selected pair',
  areaPickerHint: 'Click a number to select its pair.',
  counter: (n, total) => `${n} of ${total}`,
  viewer: 'Pair viewer',
  earthTab: 'Earth',
  moonTab: 'Moon',
  view3dTab: '3D relief',
  prevPhoto: 'Previous photo',
  nextPhoto: 'Next photo',
  photoCounter: (n, total) => `Photo ${n} of ${total}`,
  photoError: 'This image could not be loaded.',
  noPhotos: 'This site has no photos yet.',
  goToComparison: 'See the full comparison',
  openInPlayground: 'Explore in Starman Playground',

  model3d: {
    label: (name) => `3D relief model of ${name}`,
    hint: (widthKm, exaggeration) => `Real relief, ${widthKm} × ${widthKm} km, height exaggerated ×${exaggeration}. Drag to rotate or use the buttons.`,
    sameScale: 'Both models use the same vertical exaggeration; the width of each window is given below it.',
    aoi: 'The ring marks the analysis area.',
    source: 'Relief source',
    error: 'The 3D model cannot be shown in this browser. The photos are still available.',
    missing: 'This site has no 3D model.',
    rotateLeft: 'Rotate left',
    rotateRight: 'Rotate right',
    slopeToggle: 'Colour by slope',
    slopeLegend: (deg) => `Green: slope under ${deg}°. Orange: ${deg}° or more.`,
    slopeNote:
      'The colour is illustrative: it is computed on this coarse grid. The official fraction for the slope axis is the backend value, measured in finer detail.',
  },

  ils: {
    name: 'Lunar Similarity Index',
    short: 'ILS',
    outOf: 'out of 100',
    noData: 'No comparable data',
    completeness: 'Data completeness',
    completenessHint: 'Share of the total axis weight that has comparable data for both sites.',
    axesUsed: (n, total) => `${n} of ${total} axes`,
    hasPlaceholders: 'Includes provisional values, which are left out of the calculation.',
    disclaimer:
      'The index is a teaching tool for comparing terrains. It does not measure whether a place is habitable or safe to land on, and a high value does not mean the two sites are the same.',
    notRanking: 'The order between pairs changes with the axes that weigh most: it is not a scientific ranking.',
    generated: (date, schema) => `Data generated on ${date} · schema ${schema}`,
    aria: (value, completeness) => `Lunar Similarity Index: ${value} out of 100, with ${completeness} completeness`,
  },

  sections: {
    comparison: 'Pair comparison',
    sites: 'The two sites',
    relief: 'The relief in 3D',
    axes: 'The nine similarities',
    table: 'Earth versus Moon, axis by axis',
    match: 'How they are alike',
    hook: 'Question for class',
    breaks: 'Where the analogy breaks',
    lowAxes: 'The axes where they are least alike',
    method: 'How the index is calculated',
    limitations: 'Data limitations',
    sources: 'Data sources',
    explorer: 'One axis across the five pairs',
  },

  site: {
    earth: 'Earth',
    moon: 'Moon',
    region: 'Region',
    type: 'Type',
    coords: 'Coordinates',
    coordStatus: { reference: 'Reference coordinate', provisional: 'Provisional coordinate' },
    coordMethod: 'How the point was set',
    coordSource: 'Coordinate source',
    area: 'Analysis area',
    areaCircle: (km) => `Circle with a ${km} radius`,
    facts: 'Site facts',
    factLabels: {
      diameter_m: 'Diameter',
      depth_m: 'Depth',
      age_ka: 'Age',
      crater_center_lat: 'Latitude of the crater centre',
      crater_center_lon: 'Longitude of the crater centre',
      crest_to_center_m: 'From the crest to the crater centre',
    },
    meters: (value) => `${value} m`,
    thousandYears: (value) => `about ${value} thousand years`,
    degrees: (value) => `${value}°`,
    dir: { n: 'N', s: 'S', e: 'E', w: 'W' },
    locatorTitle: 'Where it is on the Moon',
    locatorNear: 'Near side of the Moon (sketch, north up).',
    locatorPole: 'Lunar south pole: at the bottom edge of the disc.',
    locatorFar: 'It is on the far side: it cannot be seen from Earth.',
    locatorAlt: (name) => `Sketch of the near side of the Moon showing the position of ${name}`,
  },

  chart: {
    title: 'Similarity of each axis (0 to 100)',
    alt: (pair, list) => `Bar chart with the similarity of each axis for ${pair}. ${list}`,
    altItem: (axis, value) => `${axis}: ${value}`,
    noData: 'No comparable data',
    noDataLong: 'No comparable data: this axis is left out of the index.',
    weight: (value) => `weight ${value}`,
    weightLegend: 'The thickness of each bar is the weight of the axis in the index.',
    confidenceLegend: 'The letter is the confidence of the method (A, B or C).',
    mostAlike: 'Most alike',
    leastAlike: 'Least alike',
    byAbsence: 'by absence',
    scaleTitle: (axis) => `Values of “${axis}” on Earth and on the Moon`,
    scaleAlt: (axis, list) => `Scale of the ${axis} axis with the value of each site. ${list}`,
    scaleItem: (pair, earth, moon, similarity) => `${pair}: Earth ${earth}, Moon ${moon}, similarity ${similarity}`,
    scaleItemMissing: (pair) => `${pair}: no comparable data`,
    logScale: 'Logarithmic scale: each mark is 10 times the previous one.',
    tolerance: (value) => `Tolerance R = ${value}: with that difference the similarity reaches 0.`,
    toleranceLog: (value) => `Tolerance R = ${value}: if one value is ${value} times the other, the similarity reaches 0.`,
    timesMore: (times) => `The Moon swings about ${times} times more.`,
    earthMarker: 'Earth',
    moonMarker: 'Moon',
  },

  table: {
    caption: 'Value at each site, origin of the data and similarity for each axis',
    axis: 'Axis',
    earth: 'Earth',
    moon: 'Moon',
    similarity: 'Similarity',
    weight: 'Weight',
    confidence: 'Confidence',
    noValue: 'No data',
    noComparable: 'No comparable data',
    plannedSource: 'Planned source',
    raw: 'Raw instrument value',
    details: 'Source and method',
    source: 'Source',
    method: 'Method',
    observed: 'Observation period',
    resolution: 'Resolution',
    resolutionValue: (meters) => `${meters} m`,
    normalization: 'How it was converted',
    population: 'Reference population',
    anchors: (felsic, mafic) => `Felsic anchor ${felsic} · mafic anchor ${mafic}`,
    openSource: 'Open the source',
    measures: 'What it measures',
    why: 'Why it matters on the Moon',
    howToRead: 'How to read it',
    caveatBadge: 'Data with known limitations',
    learnMore: 'Learn this axis in the Portal',
    value: { kelvin: (value) => `${value} K`, iceClass: (value) => `class ${value}` },
  },

  statuses: {
    measured: { label: 'Measured', meaning: 'Computed by the team from satellite data.' },
    literature: { label: 'Literature', meaning: 'Taken from a scientific publication.' },
    reference: { label: 'Reference', meaning: 'A value fixed by definition or convention; it is not an observation.' },
    placeholder: { label: 'Provisional', meaning: 'An estimate still to be measured. It is left out of the index.' },
  },
  confidence: {
    A: 'Direct satellite data, comparable between the two bodies.',
    B: 'Needs calibration or a reference population.',
    C: 'A context estimate: modelled or scarce data, or coarse classes.',
  },
  confidenceLabel: (level) => `Confidence ${level}`,
  modes: { linear: 'Linear', log_ratio: 'Logarithmic ratio' },
  normalizations: {
    physical_units: { label: 'Physical units', meaning: 'The value is compared as it is, in its own units.' },
    percentile_within_body: {
      label: 'Percentile within each body',
      meaning: 'Each site becomes its position (from 0 to 1) relative to the rest of its own body; the positions are compared.',
    },
    absolute_felsic0_mafic1: {
      label: 'Absolute scale with anchors',
      meaning: 'Each instrument is mapped to a scale from 0 (felsic) to 1 (mafic) using two reference places on its own body.',
    },
  },
  absenceFlag: {
    label: 'Similarity by absence',
    short: 'Both are dry',
  },

  method: {
    intro:
      'For each axis the backend takes one value for the Earth site (x_T) and one for the lunar site (x_L) and computes a similarity S from 0 (nothing alike) to 100 (the same on that axis). This page only shows those results; it does not recalculate them.',
    linearTitle: 'Linear: used on eight axes',
    linearFormula: 'S = 100 · max(0, 1 − |x_T − x_L| / R)',
    logTitle: 'Logarithmic ratio: only for the thermal amplitude',
    logFormula: 'S = 100 · max(0, 1 − |log₁₀(x_T / x_L)| / log₁₀(R))',
    tolerance: 'R is the tolerance of the axis: the difference at which the similarity reaches 0.',
    example: (c) =>
      `Example: for the crater axis R = ${c.R}. El Elegante has d/D = ${c.earth} and Linné ${c.moon}; the resulting similarity is ${c.similarity}.`,
    totalTitle: 'The total index',
    totalFormula: 'ILS = Σ (w · S) / Σ w',
    total: (nominal, reduced) =>
      `w is the weight of each axis. Only axes with comparable data for both sites are added. The total weight of the nine axes is ${nominal}${
        reduced ? `, or ${reduced} when the ice axis loses weight` : ''
      }.`,
    completeness:
      'Completeness is the weight of the axes used divided by the total weight. A pair without a comparable axis has a completeness below 100%, and that is shown next to the index.',
    absence: (weight) =>
      `Similarity by absence: if both sites have ice class 0, the similarity of axis 7 is 100, but it only means “both are dry”.${
        weight ? ` In that case the weight of the axis drops to ${weight}.` : ''
      }`,
    missing: 'An axis without comparable data is left out of the index. It is not counted as a similarity of 0.',
    axesTitle: 'The nine axes',
    axesCaption: 'Comparison mode, tolerance, nominal weight and confidence of each axis',
    mode: 'Mode',
    toleranceShort: 'R',
    statusTitle: 'Where each value comes from',
    confidenceTitle: 'Confidence of the method',
    normalizationTitle: 'How values are converted',
  },

  limitations: {
    intro: 'These warnings apply to several pairs. Those for a specific axis appear next to that axis.',
    items: [
      {
        label: 'It is not a ranking.',
        text: 'The order between pairs changes with the axes that weigh most. Do not read it as an absolute scientific classification.',
      },
      {
        label: 'There is no anorthosite in the region.',
        text: 'No site in Baja California or Sonora has the light rock that makes up the lunar highlands.',
      },
      {
        label: 'Different instruments.',
        text: 'Several axes use different sensors on each body. That is why there are calibrations and percentiles, and why those axes have confidence B or C.',
      },
      {
        label: 'Substitute products.',
        text: 'Earth mineralogy uses MODIS MOD21 instead of ASTER GED AG100, and Earth moisture uses MERRA-2 (NASA POWER) instead of SMAP, because those products require a NASA Earthdata account.',
      },
      {
        label: 'Regional scales.',
        text: 'Lunar temperature away from the pole uses cells of about 15 km and Earth moisture, cells of about 50 km: they are context values, larger than the analysis area.',
      },
      {
        label: 'Different processes.',
        text: 'Even if two sites look alike, on Earth water, wind, life and tectonics are at work; on the Moon, impacts, vacuum and low gravity.',
      },
    ],
  },

  sources: {
    intro: 'Products and publications behind the values of this pair, as declared by the backend.',
    credits: 'Data credits',
    creditsList:
      'Copernicus DEM GLO-30 · LROC NAC DTM · SLDEM2015 (LOLA + SELENE) · Sentinel-1 RTC and ESA WorldCover (Microsoft Planetary Computer) · LRO Mini-RF · MODIS MOD21A2, MYD11A2 · Sentinel-2 L2A (Earth Search, AWS) · NASA POWER (MERRA-2) · SoilGrids 2.0 (ISRIC) · LRO Diviner (GDR L2, GDR L3, GCP, PCP, PRP) · LRO LOLA (albedo at 1064 nm).',
    literature: 'Main literature',
    literatureList:
      'Carrier (2003), lunar grain size · Paige et al. (2010), cold traps · Williams et al. (2017, 2019), Diviner temperatures · Gawronska et al. (2020) and Haruyama et al. (2013), anorthosite at Shackleton · Lemelin et al. (2016), LOLA albedo · Liang (2001), broadband albedo · Gutmann and Turrin (2006), El Elegante · Martellato et al. (2017), Linné.',
    usedIn: (axes) => `Axes: ${axes}`,
  },

  breakLabels: { origen: 'Origin' },

  caveats: {
    limitation: 'Known limitation',
    note: 'How to read this value',
    items: {
      mineralogyLinne: {
        title: 'Linné looks felsic, but it sits in basalt',
        text: (c) =>
          `Linné shows up as felsic (${c.moon}) although it sits in the basalt of a lunar mare. Its Christiansen Feature drops because of the crater’s fresh, immature ejecta, not because of its composition. That is why this axis gives a similarity of ${c.similarity} for this pair.`,
      },
      mineralogyQuartz: {
        title: 'The Earth index responds mostly to quartz',
        text: (c) =>
          `The granite of Sierra Cucapá (${c.value('cucapa_shackleton', 'mineralogy', 'earth')}) and the dacite of Cerro Prieto (${c.value(
            'cerro_prieto_gruithuisen',
            'mineralogy',
            'earth',
          )}) end up close to basalt, and the clays of Laguna Salada make it look mafic (${c.value(
            'laguna_salada_tranquillitatis',
            'mineralogy',
            'earth',
          )}).`,
      },
      mineralogySubstitute: {
        title: 'Substitute product',
        text: () => 'Earth mineralogy uses MODIS MOD21 emissivity instead of ASTER GED AG100, which requires a NASA Earthdata account.',
      },
      iceSubstitute: {
        title: 'Substitute product and regional scale',
        text: (c) =>
          `Earth moisture uses MERRA-2 (NASA POWER) instead of SMAP, which requires a NASA Earthdata account. Its cells are about ${c.cellKm} km across: it is a regional value, much larger than the analysis area.`,
      },
      iceShackleton: {
        title: 'The rim has no ice at the surface',
        text: () =>
          'The analysis area is a stretch of the crater rim and it is class 1: ice is stable only below the surface (at about 0.6 m) and in roughly 10% of the area. The crater interior, always in shadow, would be class 3.',
      },
      iceAbsence: {
        title: 'Both are dry',
        text: (c) =>
          `Both sites are class 0. The similarity of ${c.similarity} only means “both are dry”; it is not a strong match. That is why the weight of the axis drops to ${c.weight}.`,
      },
      albedoShackleton: {
        title: 'Albedo measured with a laser',
        text: () =>
          'At the south pole the Sun stays less than 2° above the horizon and Diviner cannot measure albedo. The value comes from the LOLA laser at 1064 nm, a single near-infrared wavelength, and tends to be higher than the broadband albedos of the other sites.',
      },
      thermalReal: {
        title: 'A real difference, not an error',
        text: (c) =>
          `The lunar site swings ${c.moon} between day and night and the Earth site, ${c.earth}: about ${c.times} times more. The Moon has no atmosphere and its day lasts 29.5 Earth days. This axis ending up near 0 is part of what the comparison teaches.`,
      },
      thermalRegional: {
        title: 'Regional scale',
        text: (c) => `The lunar temperature comes from a Diviner cell about ${c.cellKm} km across: it is a regional context value, larger than the analysis area.`,
      },
      dustModel: {
        title: 'Earth dust is a model',
        text: () => 'SoilGrids estimates soil even over bare rock (ranges, lava flows): it is not a direct measurement.',
      },
      cratersMissing: {
        title: 'No such axis, by design',
        text: (c) =>
          `There is no equivalent landform on both sides, so this axis is not compared and is left out of the index. The ${c.completeness} completeness of this pair is by design, not an error.`,
      },
      slopeResolution: {
        title: 'Same resolution on both bodies',
        text: (c) => `Both sites were compared at ${c.resolutionM} m per pixel. A finer elevation model would give steeper slopes.`,
      },
      aridityReference: {
        title: 'The Moon is 0 by definition',
        text: () => 'The lunar value is not an observation: it is set to 0 because there is no vegetation on the Moon.',
      },
      roughnessPercentile: {
        title: 'Positions are compared, not raw numbers',
        text: (c) =>
          `The Earth radar measured ${c.earthRaw} and the lunar one, ${c.moonRaw}. They are different instruments, so each value becomes its position within its own body and the positions are compared.`,
      },
    },
  },

  axes: {
    slope: {
      name: 'Slope',
      units: 'fraction with slope < 10°',
      question: 'How much of the terrain is nearly flat?',
      measures:
        'The fraction of the analysis area with a slope under 10°: the ground where a spacecraft could touch down or a vehicle could drive without tipping over. It goes from 0 (all sloping) to 1 (all nearly flat).',
      why: 'It is the first criterion for choosing a landing or base site. Apollo 11 came down in Mare Tranquillitatis because it is a plain.',
      earthSource: 'Copernicus DEM GLO-30, an elevation model with one height every 30 m, projected to metres.',
      moonSource: 'Elevation models from the LROC NAC camera (2 to 4 m per pixel) or SLDEM2015 (about 59 m), brought to the same grid as the Earth data.',
      notes:
        'Slope depends on scale: a finer model sees steeper slopes. That is why the two sites of a pair are always compared at the same resolution: 30 m in general and 60 m for Laguna Salada ↔ Mare Tranquillitatis.',
      scale: { low: 'all sloping', high: 'all nearly flat' },
    },
    roughness: {
      name: 'Surface roughness',
      units: 'percentile (0–1)',
      question: 'How rocky is the surface compared with the rest of its world?',
      measures:
        'How uneven the surface is at decimetre-to-metre scale (blocks, lava, scarps), based on how the radar signal comes back. The value is a percentile from 0 to 1 within its own body: 0.9 means “rougher than 90% of comparable places”.',
      why: 'Roughness decides where a vehicle can pass and how much risk a lander takes when touching down.',
      earthSource:
        'Sentinel-1 radar: the signal that comes back “crossed” (VH) is compared with the one that comes back “the same” (VV), in decibels. The percentile is computed against the desert cells of northwestern Mexico.',
      moonSource: 'Mini-RF radar on the LRO probe: circular polarization ratio (CPR). The percentile is computed against the whole lunar surface.',
      notes:
        'Sentinel-1 and Mini-RF are different radars, so their raw numbers (dB and CPR) cannot be compared with each other. What is compared is the position of each site within its own body.',
      scale: { low: 'smoother than almost everything', high: 'rougher than almost everything' },
    },
    mineralogy: {
      name: 'Mineral composition',
      units: 'felsic–mafic scale (0–1)',
      question: 'What are the rocks made of?',
      measures:
        'The composition of the silicates on a scale from 0 to 1: 0 is felsic (feldspars and quartz, like granite) and 1 is mafic (rich in iron and magnesium, like basalt).',
      why: 'Composition tells which resources exist, how the soil behaves and which process formed the place. Together with slope, it is the heaviest axis.',
      earthSource:
        'MODIS thermal emissivity (MOD21A2 and MYD21A2): the ratio between two infrared bands. It is used instead of ASTER GED AG100, which requires a NASA Earthdata account.',
      moonSource: 'Position of the Christiansen Feature measured by Diviner (LRO): the wavelength, in micrometres, that gives away the kind of silicate.',
      notes:
        'Each instrument is mapped to the 0–1 scale with two anchors on its own body: one clearly felsic place and one clearly mafic place. It is an axis with known limitations: the Earth index responds mostly to quartz and the lunar one also drops over fresh soils.',
      scale: { low: 'felsic', high: 'mafic' },
    },
    albedo: {
      name: 'Albedo and reflectance',
      units: 'fraction (0–1)',
      question: 'How bright or dark is the surface?',
      measures: 'The fraction of sunlight the surface reflects: close to 0 is very dark and close to 1, very bright.',
      why: 'Albedo controls how much the ground heats up and how it looks in images, and gives clues about its composition.',
      earthSource: 'Sentinel-2: broadband albedo computed from five bands (Liang, 2001 formula), without clouds, shadows, water or vegetation.',
      moonSource: 'Diviner (LRO): solar reflectance near noon. At the south pole, where the Sun barely rises, the LOLA laser at 1064 nm is used.',
      notes: 'The tolerance is narrow (0.15) because natural albedo varies little: a small difference already lowers the similarity a lot.',
      scale: { low: 'dark', high: 'bright' },
    },
    thermal: {
      name: 'Day/night thermal amplitude',
      units: 'K',
      question: 'How much does the ground temperature change between day and night?',
      measures: 'The difference between the surface temperature by day and by night, in kelvin. A change of 1 K equals a change of 1 °C.',
      why: 'It sets what equipment and habitats must withstand. With no atmosphere, and a day that lasts 29.5 Earth days, the lunar ground heats up and cools down far more than any desert.',
      earthSource: 'Aqua MODIS (MYD11A2): daytime minus night-time ground temperature, averaged over a year.',
      moonSource: 'Diviner (LRO): maximum minus minimum temperature of the lunar day–night cycle.',
      notes:
        'It is the only axis compared with a logarithmic ratio: what matters is how many times larger one value is than the other. If one is 10 times the other, the similarity is 0. That is why it almost always ends up near 0, and that difference is real.',
      scale: { low: 'changes little', high: 'changes enormously' },
    },
    aridity: {
      name: 'Aridity and vegetation',
      units: 'NDVI (−1 to 1)',
      question: 'How much vegetation covers the place?',
      measures:
        'The amount of vegetation according to the NDVI index, which compares the red and infrared light the ground reflects. Healthy plants give high values; rock and bare soil, close to 0.',
      why: 'There is no life on the Moon, so a good analog has little vegetation. Plants also alter what other axes measure.',
      earthSource: 'Sentinel-2: median NDVI in the dry season (May to August).',
      moonSource: 'It is not measured: it is 0 by definition, because there is no vegetation on the Moon. It is a reference value, not an observation.',
      notes: 'It is one of the lightest axes: almost any desert resembles the Moon in this, so it does little to tell sites apart.',
      scale: { low: 'no vegetation', high: 'more vegetation' },
    },
    ice: {
      name: 'Moisture and ice stability',
      units: 'class (0–3)',
      question: 'Is there water or ice, and can it last?',
      measures:
        'A class from 0 to 3: 0 is dry; 1, ice or moisture in a minor part of the area; 2, persistent moisture or seasonal freezing; 3, stable ice.',
      why: 'The ice at the lunar poles is the resource that most motivates a permanent base: it yields water, oxygen and fuel.',
      earthSource: 'Soil moisture from MERRA-2 (NASA POWER), in cells of about 50 km. It is used instead of SMAP, which requires a NASA Earthdata account.',
      moonSource: 'Diviner (LRO) temperatures: ice is stable only where the maximum temperature stays below about 110 K. Away from the poles there are no such places.',
      notes:
        'If both sites are dry (class 0 and class 0) the similarity comes out as 100, but it only says “both are dry”. That is why it is flagged as “similarity by absence” and the axis weighs less.',
      scale: { low: 'dry', high: 'stable ice' },
    },
    dust: {
      name: 'Dust and fine regolith',
      units: 'fraction of particles < ~63 µm',
      question: 'How much of the soil is fine dust?',
      measures: 'The fraction of the soil made of particles under about 63 micrometres: roughly the width of a hair, or less.',
      why: 'Lunar dust is abrasive, sticks to suits and equipment, and affects anything built with regolith.',
      earthSource: 'SoilGrids 2.0 (ISRIC): silt and clay fraction in the top 5 cm of soil. It is a model, not a direct measurement.',
      moonSource: 'Published grain-size data from the soils brought back by the Apollo missions (Carrier, 2003), supported by Diviner rock abundance.',
      notes:
        'Confidence C: the Earth value is a model that estimates soil even over bare rock, and the lunar one comes from few samples. On Earth dust is moved by wind; on the Moon, by impacts.',
      scale: { low: 'no fine dust', high: 'all fine dust' },
    },
    craters: {
      name: 'Crater morphology',
      units: 'depth/diameter ratio (d/D)',
      question: 'What proportions does the landform have?',
      measures:
        'The proportions of the relief. For a crater, depth divided by diameter (d/D). For a cone or a dome, height divided by diameter (h/D).',
      why: 'The shape of a crater or a volcano tells how it formed and how much it has worn down.',
      earthSource: 'Published dimensions, or dimensions measured on an elevation model.',
      moonSource: 'Published dimensions, or dimensions measured on LROC elevation models with the same rule as on Earth.',
      notes:
        'What is divided depends on the pair: d/D for El Elegante ↔ Linné, h/D of cones for Pinacate ↔ Marius Hills and h/D of domes for Cerro Prieto ↔ Gruithuisen. Two pairs lack this axis because there is no equivalent landform on both sides.',
      scale: { low: 'low and wide', high: 'tall or deep' },
    },
  },

  pairs: {
    elegante_linne: {
      short: 'El Elegante ↔ Linné',
      cratersKind: 'Crater d/D: depth divided by diameter.',
      photos: {
        earth: [
          { alt: 'Stepped walls of a volcanic crater in the desert, with mountains in the background.', caption: 'Pinacate volcanic field (USGS).' },
          { alt: 'Satellite image of the Pinacate lava fields, with several circular craters.', caption: 'Craters in the Pinacate lava fields (Copernicus Sentinel-2).' },
        ],
        moon: [
          { alt: 'A bright, circular, bowl-shaped lunar crater seen from orbit.', caption: 'Linné seen by LRO’s NAC camera (2014).' },
          {
            alt: 'Colour relief map of Linné crater: blue on the floor and red on the rim.',
            caption: 'Colour shaded relief from an LROC topographic model: cool colours are low areas.',
          },
        ],
      },
    },
    pinacate_marius: {
      short: 'Pinacate ↔ Marius Hills',
      cratersKind: 'h/D of volcanic cones: height divided by diameter (median of the detected cones).',
      photos: {
        earth: [
          {
            alt: 'A large dark-walled volcanic crater in the Pinacate reserve, with a cone and ranges in the background.',
            caption: 'El Pinacate Biosphere Reserve, Sonora.',
          },
          { alt: 'Satellite image of the dark Pinacate lava fields, with cones and craters.', caption: 'The Pinacate lava fields from Sentinel-2 (Copernicus).' },
        ],
        moon: [
          { alt: 'Two orbital views of a dark hole in the lunar surface; the right one is an enlargement.', caption: 'The Marius Hills pit seen by LRO.' },
          { alt: 'Close view of a circular pit on the Moon with its floor in shadow.', caption: 'The Marius Hills pit: a possible entrance to a lava tube (LROC NAC).' },
        ],
      },
    },
    cerro_prieto_gruithuisen: {
      short: 'Cerro Prieto ↔ Gruithuisen',
      cratersKind: 'h/D of volcanic domes: height divided by diameter.',
      photos: {
        earth: [
          { alt: 'Old photograph of Cerro Prieto volcano, a low dark hill above a plain.', caption: 'Cerro Prieto in 1959 (U.S. Department of Energy).' },
          { alt: 'Cerro Prieto seen in the distance behind crop fields, with steam from the geothermal field.', caption: 'Cerro Prieto from the northeast, with farmland at its foot.' },
        ],
        moon: [
          { alt: 'Oblique view from orbit of two rounded mountains beside a lunar mare.', caption: 'Gruithuisen Gamma (left) and Delta (right), from Apollo 15.' },
          { alt: 'Overhead view of two lunar volcanic domes beside a dark plain.', caption: 'The Gruithuisen domes seen by LRO.' },
        ],
      },
    },
    laguna_salada_tranquillitatis: {
      short: 'Laguna Salada ↔ Tranquillitatis',
      cratersKind: null,
      photos: {
        earth: [
          {
            alt: 'A very flat desert plain with low scrub and, in the distance, the pale surface of the dry lake.',
            caption: 'North entrance to Laguna Salada, looking south.',
          },
        ],
        moon: [
          {
            alt: 'Orbital view of a lunar plain with small craters; the Apollo 11 site and West crater are labelled.',
            caption: 'Apollo 11 landing site and West crater, seen by LRO (2009).',
          },
        ],
      },
    },
    cucapa_shackleton: {
      short: 'Sierra Cucapá ↔ Shackleton',
      cratersKind: null,
      photos: {
        earth: [
          { alt: 'A stony slope of the range with the Mexicali valley stretching out in the background.', caption: 'The Mexicali valley seen from the Tinaja Cucapah.' },
          { alt: 'A narrow canyon with fractured rock walls and large fallen boulders.', caption: 'Tinaja Cucapah canyon.' },
        ],
        moon: [
          {
            alt: 'Mosaic of Shackleton crater: a circular crater with a lit interior and deep shadows around it.',
            caption: 'Shackleton crater, LROC and ShadowCam mosaic (2023).',
          },
          { alt: 'The rim of Shackleton crater lit by the low Sun, with the interior in shadow.', caption: 'Grazing light on the rim of Shackleton (LROC, 2009).' },
        ],
      },
    },
  },

  backend: {
    untranslatedNote: 'Sources and methods are shown in Spanish, exactly as the backend provides them.',
    pairs: {
      elegante_linne: {
        title: 'El Elegante crater ↔ Linné crater',
        match: 'Two craters of similar scale, with raised rims and basalt outcrops in their walls.',
        hook: 'Divide the depth by the diameter: El Elegante has 244 m and 1600 m. Linné has 520 m and 2230 m. Which one is deeper in proportion to its size?',
        breaks: {
          origen: 'El Elegante formed when magma came into contact with groundwater. Linné is an impact crater.',
          craters: 'El Elegante keeps deposits from an ancient lake. The two published studies also traced the rim and the floor with different methods.',
          thermal: 'Earth’s atmosphere and the length of the lunar day influence the thermal differences.',
        },
        earth: {
          name: 'El Elegante crater',
          region: 'El Pinacate and Gran Desierto de Altar Biosphere Reserve, Sonora, Mexico',
          type: 'Maar (phreatomagmatic volcanic crater)',
          aoiNote: 'Interior + rim of the crater (rim about 800 m from the centre)',
        },
        moon: {
          name: 'Linné crater',
          region: 'Northwest of Mare Serenitatis, Moon',
          type: 'Simple impact crater (Copernican)',
          aoiNote: 'Interior + rim of the crater (rim about 1,115 m from the centre)',
        },
      },
      pinacate_marius: {
        title: 'Pinacate shield ↔ Marius Hills',
        match: 'In both volcanic fields you can study lava flows and openings related to volcanism.',
        hook: 'If you found a hole from orbit, what would you look at to investigate whether it leads to a lava tube?',
        breaks: {
          craters: 'A pit or an opening is qualitative evidence. The crater axis compares the depth/diameter ratio of well-defined features.',
          aridity: 'Earth’s vegetation affects the optical signal. It is best masked out when studying volcanic material.',
        },
        earth: {
          name: 'Pinacate shield',
          region: 'Sonora, Mexico',
          type: 'Basaltic shield volcano',
          aoiNote: 'Centred on the summit of the shield (1198 m in the Copernicus DEM). It includes lava flows and cones; median NDVI 0.10, no water (SCL 6).',
        },
        moon: {
          name: 'Marius Hills',
          region: 'Oceanus Procellarum, Moon',
          type: 'Volcanic field',
          aoiNote: 'Circle centred on the Marius Hills pit.',
        },
      },
      cerro_prieto_gruithuisen: {
        title: 'Cerro Prieto ↔ Gruithuisen domes',
        match: 'Silicic volcanism makes it possible to compare the dacite dome near Mexicali with a volcanic terrain that is rare on the Moon.',
        hook: 'Which spectral signals would you look for to compare the rocks of Cerro Prieto and the lunar domes?',
        breaks: {
          mineralogy:
            'A silicic composition can reflect different processes. The Earth and lunar indicators need to be calibrated before a similarity is calculated.',
          craters: 'The domes have different scales. Their height and width can be studied separately from a crater’s d/D ratio.',
        },
        earth: {
          name: 'Cerro Prieto',
          region: 'Mexicali, Baja California, Mexico',
          type: 'Dacite dome',
          aoiNote:
            'Centroid of the dacite dome (terrain more than 40 m above the ~11 m plain). The foot of the dome is 1.1–1.3 km away; the radius leaves out crops and geothermal evaporation ponds (water < 1%, NDVI > 0.2 in 0.3%).',
        },
        moon: {
          name: 'Gruithuisen domes',
          region: 'Edge of Mare Imbrium, Moon',
          type: 'Silicic volcanic domes',
          aoiNote: 'The published reference is at the Gamma dome.',
        },
      },
      laguna_salada_tranquillitatis: {
        title: 'Laguna Salada ↔ Mare Tranquillitatis',
        match: 'Flat terrain and fine material offer two starting points for comparing the dry playa and the lunar plain.',
        hook: 'How would you identify a flat area from a slope map?',
        breaks: {
          albedo: 'Salts can brighten the playa, while the basalt of the lunar mare usually looks dark.',
          dust: 'At Laguna Salada the wind carries dust. On the Moon other processes are at work, such as impacts.',
          aridity: 'The lake bed can flood. The date of the observation changes which surface is being compared.',
        },
        earth: {
          name: 'Laguna Salada',
          region: 'Baja California, Mexico',
          type: 'Endorheic playa',
          aoiNote:
            'Flattest circle of the playa floor that did not flood in 6 wet scenes (2022–2024): water ≤ 0.1%, NDVI 0.057, mean slope 0.15°. Use scenes from May to August.',
        },
        moon: {
          name: 'Mare Tranquillitatis',
          region: 'Apollo 11 landing site, Moon',
          type: 'Basaltic plain',
          aoiNote: 'Circle around the Apollo 11 lunar module.',
        },
      },
      cucapa_shackleton: {
        title: 'Sierra Cucapá ↔ Rim of Shackleton',
        match: 'Rugged relief helps to study how routes and the choice of terrain change as slopes increase.',
        hook: 'If a vehicle had to travel along the rim, how would you use a slope and shadow map to plan its route?',
        breaks: {
          ice: 'Polar lighting creates areas of persistent shadow. The thermal stability of ice and the detection of ice are different observations.',
          mineralogy: 'The granite and metamorphic rocks of the range have a different history from the materials of the lunar highlands.',
        },
        earth: {
          name: 'Sierra Cucapá',
          region: 'Baja California, Mexico',
          type: 'Rocky mountain range',
          aoiNote: 'A 2.5 km circle with the most slope > 15° in the whole range (94% of the area). NDVI 0.066, no water.',
        },
        moon: {
          name: 'Rim of Shackleton',
          region: 'Lunar south pole',
          type: 'Rim of an impact crater',
          aoiNote:
            'A stretch of the Shackleton rim centred on the crest (1739 m), at the ESA candidate site. Largest radius with ≥ 99% coverage of the NAC DTM ESALL_SR12 (2 m/px). The crater centre (cartographic reference) is at 89.67° S, 129.78° E, about 10.5 km away.',
        },
      },
    },
    sourcePlans: {
      slope: { earth: 'Copernicus DEM GLO-30', moon: 'LOLA or LROC NAC DTM at the same effective scale' },
      roughness: { earth: 'Sentinel-1 GRD IW with a reference population', moon: 'LRO Mini-RF CPR with a reference population' },
      mineralogy: { earth: 'ASTER GED AG100 or Sentinel-2 L2A, with calibration', moon: 'Diviner GDR, Christiansen Feature, with calibration' },
      albedo: { earth: 'Albedo estimated with Sentinel-2 L2A', moon: 'Diviner GDR solar reflectance' },
      thermal: { earth: 'Surface temperature amplitude from Aqua MODIS MYD11A2', moon: 'Surface temperature amplitude from Diviner RCP, GCP or PRP' },
      aridity: { earth: 'Dry-season NDVI from Sentinel-2 L2A', moon: 'Teaching reference for vegetation' },
      ice: { earth: 'SMAP SPL3SMP_E soil moisture', moon: 'Thermal stability from Diviner PRP' },
      dust: { earth: 'Silt and clay fraction from SoilGrids', moon: 'Published grain-size data from lunar samples' },
      craters: { earth: 'Depth and diameter from a DEM or the literature', moon: 'Depth and diameter from LROC NAC DTM or the literature' },
    },
  },
};
