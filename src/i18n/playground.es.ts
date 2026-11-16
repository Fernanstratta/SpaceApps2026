import type { AnalogyType, AxisId, AxisNormalization, Confidence, PairId, SimilarityMode, ValueStatus } from '../data/lunarAnalogs';

/**
 * Textos de Terranauta Playground en español.
 *
 * Los DATOS (valores, similitudes, ILS, nombres de sitios, «en qué se
 * parecen», «dónde se rompe») no están aquí: vienen del backend
 * (`data/lunarAnalogs.ts`) y en español se muestran tal cual. Aquí solo va lo
 * que el frontend añade: la interfaz, la explicación didáctica de cada eje y
 * las advertencias de lectura. `axes[id].name` y `axes[id].units` deben ser
 * idénticos a `name_es` y `units` del backend (lo comprueba `verify:data`).
 * `playground.en.ts` tiene la misma forma y, además, la traducción de los
 * textos del backend (`backend`).
 */

export interface AxisText {
  /** Igual a `name_es` del backend. */
  name: string;
  /** Igual a `units` del backend. */
  units: string;
  /** La pregunta que responde el eje, en una línea. */
  question: string;
  measures: string;
  why: string;
  earthSource: string;
  moonSource: string;
  notes: string;
  /** Qué significan los extremos de la escala. */
  scale: { low: string; high: string };
}

export interface PhotoText {
  alt: string;
  caption: string;
}

export interface PairText {
  /** Nombre corto del par (selectores y gráficos). */
  short: string;
  /** Una descripción por foto, en el mismo orden que en el catálogo. */
  photos: { earth: PhotoText[]; moon: PhotoText[] };
  /** Qué proporción compara el eje 9 en este par; `null` si el par no tiene ese eje. */
  cratersKind: string | null;
}

/** Datos que una advertencia puede citar; todos salen del backend ya con formato. */
export interface CaveatContext {
  earth: string;
  moon: string;
  earthRaw: string;
  moonRaw: string;
  similarity: string;
  weight: string;
  completeness: string;
  /** «9» en «unas 9 veces más». */
  times: string;
  /** Resolución en km de la celda más gruesa del eje. */
  cellKm: string;
  /** Resolución en metros a la que se compararon las pendientes. */
  resolutionM: string;
  /** Valor formateado de otro par o lado. */
  value: (pair: PairId, axis: AxisId, body: 'earth' | 'moon') => string;
}

export interface CaveatText {
  title: string;
  text: (c: CaveatContext) => string;
}

export const CAVEAT_IDS = [
  'mineralogyLinne',
  'mineralogyQuartz',
  'mineralogySubstitute',
  'iceSubstitute',
  'iceShackleton',
  'iceAbsence',
  'albedoShackleton',
  'thermalReal',
  'thermalRegional',
  'dustModel',
  'cratersMissing',
  'slopeResolution',
  'aridityReference',
  'roughnessPercentile',
] as const;
export type CaveatId = (typeof CAVEAT_IDS)[number];

export interface SiteTranslation {
  name: string;
  region: string;
  type: string;
  aoiNote: string;
}

/** Traducción de los textos que el backend solo envía en español (`null` en español). */
export interface BackendTranslation {
  /** Aviso de que método y fuente se muestran en el idioma original. */
  untranslatedNote: string;
  pairs: Record<
    PairId,
    {
      title: string;
      match: string;
      hook: string;
      /** Una entrada por cada clave de `breaks_es`. */
      breaks: Record<string, string>;
      earth: SiteTranslation;
      moon: SiteTranslation;
    }
  >;
  sourcePlans: Record<AxisId, { earth: string; moon: string }>;
}

export const playgroundEs = {
  title: 'Terranauta Playground',
  lead: 'Compara lugares de Baja California y Sonora con sitios de la Luna usando el Índice de Similitud Lunar.',
  scope:
    'El equipo se concentró solo en la Luna y solo en sitios de Baja California y Sonora, para que estudiantes de la región relacionen el contenido con lugares que conocen. El ILS no dice que un sitio «es igual» a otro: muestra en qué se parecen, cuánto, con qué datos y dónde se rompe la analogía.',

  filters: {
    panelLabel: 'Filtros y exploración por eje',
    clear: 'Limpiar filtros',
    comparisons: (n: number, total: number) => (n === total ? `${total} comparaciones` : `${n} de ${total} comparaciones`),
    axesLegend: 'Explorar por eje',
    axesHint: 'Elige un eje para verlo en los cinco pares: valor en la Tierra, valor en la Luna y qué tan parecidos son.',
    noAxis: 'Ninguno',
    similarity: 'ILS mínimo',
    similarityValue: (n: number) => (n === 0 ? 'Cualquiera' : `${n} o más`),
    similarityValueText: (n: number) => (n === 0 ? 'Cualquier valor del índice' : `Índice de ${n} o más`),
    similarityScale: ['0', '50', '100'],
    noMatches: 'Ninguna comparación alcanza ese ILS.',
    noMatchesHint: 'Baja el ILS mínimo o limpia los filtros para volver a ver los cinco pares.',
  },
  analogyTypes: {
    'crater-morphology': 'Morfología de cráter',
    'basaltic-volcanism': 'Volcanismo basáltico',
    'silicic-volcanism': 'Volcanismo silícico',
    'landing-terrain': 'Terreno de aterrizaje',
    'risk-counterexample': 'Contraejemplo de riesgo',
  } satisfies Record<AnalogyType, string>,

  mapLabel: 'Mapa interactivo de los sitios terrestres de Terranauta Playground',
  marker: (n: number, name: string) => `Par ${n}: ${name}`,
  mapHint: 'Selecciona un marcador, o usa Tab y Enter. El círculo es el área de análisis de cada sitio.',
  mapLoading: 'Cargando…',
  mapError: 'No se pudo cargar el mapa. El resto del panel sigue disponible.',
  showAll: 'Ver todos los sitios',

  areaPicker: 'Par seleccionado',
  areaPickerHint: 'Haz clic en un número para seleccionar su par.',
  counter: (n: number, total: number) => `${n} de ${total}`,
  viewer: 'Visor del par',
  earthTab: 'Tierra',
  moonTab: 'Luna',
  view3dTab: 'Relieve 3D',
  prevPhoto: 'Foto anterior',
  nextPhoto: 'Foto siguiente',
  photoCounter: (n: number, total: number) => `Foto ${n} de ${total}`,
  photoError: 'No se pudo cargar esta imagen.',
  noPhotos: 'Este sitio todavía no tiene fotos.',
  goToComparison: 'Ver la comparación completa',
  openInPlayground: 'Explorar en Terranauta Playground',

  model3d: {
    label: (name: string) => `Modelo 3D del relieve de ${name}`,
    hint: (widthKm: string, exaggeration: string) =>
      `Relieve real, ${widthKm} × ${widthKm} km, altura exagerada ×${exaggeration}. Arrastra para girar o usa los botones.`,
    sameScale: 'Los dos modelos usan la misma exageración vertical; el ancho de cada ventana se indica debajo.',
    aoi: 'El anillo marca el área de análisis.',
    source: 'Fuente del relieve',
    error: 'No se pudo mostrar el modelo 3D en este navegador. Las fotos siguen disponibles.',
    missing: 'Este sitio no tiene modelo 3D.',
    rotateLeft: 'Girar a la izquierda',
    rotateRight: 'Girar a la derecha',
    slopeToggle: 'Colorear por pendiente',
    slopeLegend: (deg: string) => `Verde: pendiente menor a ${deg}°. Naranja: ${deg}° o más.`,
    slopeNote:
      'El color es ilustrativo: se calcula sobre esta malla gruesa. La fracción oficial del eje de pendiente es la del backend, medida a mayor detalle.',
  },

  ils: {
    name: 'Índice de Similitud Lunar',
    short: 'ILS',
    outOf: 'de 100',
    noData: 'Sin datos comparables',
    completeness: 'Completitud de los datos',
    completenessHint: 'Parte del peso total de los ejes que sí tiene dato comparable en los dos sitios.',
    axesUsed: (n: number, total: number) => `${n} de ${total} ejes`,
    hasPlaceholders: 'Incluye valores provisionales, que quedan fuera del cálculo.',
    disclaimer:
      'El ILS es una herramienta didáctica para comparar terrenos. No mide si un lugar es habitable ni si es seguro para aterrizar, y un valor alto no significa que los dos sitios sean iguales.',
    notRanking: 'El orden entre pares cambia según los ejes que más pesan: no es un ranking científico.',
    generated: (date: string, schema: string) => `Datos generados el ${date} · esquema ${schema}`,
    aria: (value: string, completeness: string) => `Índice de Similitud Lunar: ${value} de 100, con completitud de ${completeness}`,
  },

  sections: {
    comparison: 'Comparación del par',
    sites: 'Los dos sitios',
    relief: 'El relieve en 3D',
    axes: 'Las nueve similitudes',
    table: 'Tierra contra Luna, eje por eje',
    match: 'En qué se parecen',
    hook: 'Pregunta para clase',
    breaks: 'Dónde se rompe la analogía',
    lowAxes: 'Los ejes donde menos se parecen',
    method: 'Cómo se calcula el ILS',
    limitations: 'Limitaciones de los datos',
    sources: 'Fuentes de datos',
    explorer: 'Un eje en los cinco pares',
  },

  site: {
    earth: 'Tierra',
    moon: 'Luna',
    region: 'Región',
    type: 'Tipo',
    coords: 'Coordenadas',
    coordStatus: { reference: 'Coordenada de referencia', provisional: 'Coordenada provisional' },
    coordMethod: 'Cómo se fijó el punto',
    coordSource: 'Fuente de la coordenada',
    area: 'Área de análisis',
    areaCircle: (km: string) => `Círculo de ${km} de radio`,
    facts: 'Datos del sitio',
    factLabels: {
      diameter_m: 'Diámetro',
      depth_m: 'Profundidad',
      age_ka: 'Edad',
      crater_center_lat: 'Latitud del centro del cráter',
      crater_center_lon: 'Longitud del centro del cráter',
      crest_to_center_m: 'De la cresta al centro del cráter',
    } as Record<string, string>,
    meters: (value: string) => `${value} m`,
    thousandYears: (value: string) => `unos ${value} mil años`,
    degrees: (value: string) => `${value}°`,
    dir: { n: 'N', s: 'S', e: 'E', w: 'O' },
    locatorTitle: 'Dónde está en la Luna',
    locatorNear: 'Cara visible de la Luna (esquema, norte arriba).',
    locatorPole: 'Polo sur lunar: queda en el borde inferior del disco.',
    locatorFar: 'Queda del otro lado: no se ve desde la Tierra.',
    locatorAlt: (name: string) => `Esquema de la cara visible de la Luna con la posición de ${name}`,
  },

  chart: {
    title: 'Similitud de cada eje (0 a 100)',
    alt: (pair: string, list: string) => `Gráfico de barras con la similitud de cada eje en ${pair}. ${list}`,
    altItem: (axis: string, value: string) => `${axis}: ${value}`,
    noData: 'Sin dato comparable',
    noDataLong: 'Sin dato comparable: este eje no entra al ILS.',
    weight: (value: string) => `peso ${value}`,
    weightLegend: 'El grosor de cada barra es el peso del eje en el índice.',
    confidenceLegend: 'La letra es la confianza del método (A, B o C).',
    mostAlike: 'Lo más parecido',
    leastAlike: 'Lo menos parecido',
    byAbsence: 'por ausencia',
    scaleTitle: (axis: string) => `Valores de «${axis}» en la Tierra y en la Luna`,
    scaleAlt: (axis: string, list: string) => `Escala del eje ${axis} con el valor de cada sitio. ${list}`,
    scaleItem: (pair: string, earth: string, moon: string, similarity: string) =>
      `${pair}: Tierra ${earth}, Luna ${moon}, similitud ${similarity}`,
    scaleItemMissing: (pair: string) => `${pair}: sin dato comparable`,
    logScale: 'Escala logarítmica: cada marca vale 10 veces la anterior.',
    tolerance: (value: string) => `Tolerancia R = ${value}: con esa diferencia la similitud llega a 0.`,
    toleranceLog: (value: string) => `Tolerancia R = ${value}: si un valor es ${value} veces el otro, la similitud llega a 0.`,
    timesMore: (times: string) => `La Luna oscila unas ${times} veces más.`,
    earthMarker: 'Tierra',
    moonMarker: 'Luna',
  },

  table: {
    caption: 'Valor de cada sitio, origen del dato y similitud de cada eje',
    axis: 'Eje',
    earth: 'Tierra',
    moon: 'Luna',
    similarity: 'Similitud',
    weight: 'Peso',
    confidence: 'Confianza',
    noValue: 'Sin dato',
    noComparable: 'Sin dato comparable',
    plannedSource: 'Fuente prevista',
    raw: 'Valor crudo del instrumento',
    details: 'Fuente y método',
    source: 'Fuente',
    method: 'Método',
    observed: 'Periodo observado',
    resolution: 'Resolución',
    resolutionValue: (meters: string) => `${meters} m`,
    normalization: 'Cómo se convirtió',
    population: 'Población de referencia',
    anchors: (felsic: string, mafic: string) => `Ancla félsica ${felsic} · ancla máfica ${mafic}`,
    openSource: 'Abrir la fuente',
    measures: 'Qué mide',
    why: 'Por qué importa en la Luna',
    howToRead: 'Cómo leerlo',
    caveatBadge: 'Dato con limitaciones conocidas',
    learnMore: 'Aprender este eje en el Portal',
    value: { kelvin: (value: string) => `${value} K`, iceClass: (value: string) => `clase ${value}` },
  },

  statuses: {
    measured: { label: 'Medido', meaning: 'Calculado por el equipo a partir de datos satelitales.' },
    literature: { label: 'Literatura', meaning: 'Tomado de una publicación científica.' },
    reference: { label: 'Referencia', meaning: 'Valor fijo por definición o por convención; no es una observación.' },
    placeholder: { label: 'Provisional', meaning: 'Estimación pendiente de medir. Queda fuera del ILS.' },
  } satisfies Record<ValueStatus, { label: string; meaning: string }>,
  confidence: {
    A: 'Dato satelital directo y comparable entre los dos cuerpos.',
    B: 'Necesita calibración o una población de referencia.',
    C: 'Estimación de contexto: datos modelados, escasos o clases gruesas.',
  } satisfies Record<Confidence, string>,
  confidenceLabel: (level: Confidence) => `Confianza ${level}`,
  modes: { linear: 'Lineal', log_ratio: 'Razón logarítmica' } satisfies Record<SimilarityMode, string>,
  normalizations: {
    physical_units: { label: 'Unidades físicas', meaning: 'El valor se compara tal cual, en sus unidades.' },
    percentile_within_body: {
      label: 'Percentil dentro de cada cuerpo',
      meaning: 'Cada sitio se convierte en su posición (de 0 a 1) frente al resto de su propio cuerpo; se comparan las posiciones.',
    },
    absolute_felsic0_mafic1: {
      label: 'Escala absoluta con anclas',
      meaning: 'Cada instrumento se lleva a una escala de 0 (félsico) a 1 (máfico) con dos lugares de referencia de su propio cuerpo.',
    },
  } satisfies Record<AxisNormalization, { label: string; meaning: string }>,
  absenceFlag: {
    label: 'Similitud por ausencia',
    short: 'Los dos son secos',
  },

  method: {
    intro:
      'Para cada eje el backend toma un valor del sitio terrestre (x_T) y uno del sitio lunar (x_L) y calcula una similitud S de 0 (nada parecidos) a 100 (iguales en ese eje). Esta página solo muestra esos resultados; no los vuelve a calcular.',
    linearTitle: 'Lineal: se usa en ocho ejes',
    linearFormula: 'S = 100 · máx(0, 1 − |x_T − x_L| / R)',
    logTitle: 'Razón logarítmica: solo en la amplitud térmica',
    logFormula: 'S = 100 · máx(0, 1 − |log₁₀(x_T / x_L)| / log₁₀(R))',
    tolerance: 'R es la tolerancia del eje: la diferencia con la que la similitud llega a 0.',
    example: (c: { R: string; earth: string; moon: string; similarity: string }) =>
      `Ejemplo: en el eje de cráteres R = ${c.R}. El Elegante tiene d/D = ${c.earth} y Linné ${c.moon}; la similitud que resulta es ${c.similarity}.`,
    totalTitle: 'El índice total',
    totalFormula: 'ILS = Σ (w · S) / Σ w',
    total: (nominal: string, reduced: string | null) =>
      `w es el peso de cada eje. Solo se suman los ejes que tienen dato comparable en los dos sitios. El peso total de los nueve ejes es ${nominal}${
        reduced ? `, o ${reduced} cuando el eje de hielo baja de peso` : ''
      }.`,
    completeness:
      'La completitud es el peso de los ejes usados entre el peso total. Un par sin un eje comparable tiene una completitud menor a 100 %, y eso se muestra junto al índice.',
    absence: (weight: string | null) =>
      `Similitud por ausencia: si los dos sitios tienen hielo clase 0, la similitud del eje 7 es 100, pero solo significa «los dos son secos».${
        weight ? ` En ese caso el peso del eje baja a ${weight}.` : ''
      }`,
    missing: 'Un eje sin dato comparable no entra al índice. No se cuenta como similitud 0.',
    axesTitle: 'Los nueve ejes',
    axesCaption: 'Modo de comparación, tolerancia, peso nominal y confianza de cada eje',
    mode: 'Modo',
    toleranceShort: 'R',
    statusTitle: 'De dónde viene cada dato',
    confidenceTitle: 'Confianza del método',
    normalizationTitle: 'Cómo se convierten los valores',
  },

  limitations: {
    intro: 'Estas advertencias aplican a varios pares. Las de un eje concreto aparecen junto a ese eje.',
    items: [
      {
        label: 'No es un ranking.',
        text: 'El orden entre pares cambia según los ejes que pesan. No lo leas como una clasificación científica absoluta.',
      },
      {
        label: 'No hay anortosita en la región.',
        text: 'Ningún sitio de Baja California o Sonora tiene la roca clara que forma las tierras altas lunares.',
      },
      {
        label: 'Instrumentos distintos.',
        text: 'Varios ejes usan sensores diferentes en cada cuerpo. Por eso hay calibraciones y percentiles, y por eso esos ejes tienen confianza B o C.',
      },
      {
        label: 'Productos sustitutos.',
        text: 'La mineralogía terrestre usa MODIS MOD21 en lugar de ASTER GED AG100, y la humedad terrestre usa MERRA-2 (NASA POWER) en lugar de SMAP, porque esos productos requieren cuenta de NASA Earthdata.',
      },
      {
        label: 'Escalas regionales.',
        text: 'La temperatura lunar fuera del polo usa celdas de unos 15 km y la humedad terrestre, de unos 50 km: son valores de contexto, más grandes que el área de análisis.',
      },
      {
        label: 'Procesos distintos.',
        text: 'Aunque dos sitios se vean parecidos, en la Tierra actúan el agua, el viento, la vida y la tectónica; en la Luna, los impactos, el vacío y la baja gravedad.',
      },
    ],
  },

  sources: {
    intro: 'Productos y publicaciones de los que salen los valores de este par, tal como los declara el backend.',
    credits: 'Créditos de los datos',
    creditsList:
      'Copernicus DEM GLO-30 · LROC NAC DTM · SLDEM2015 (LOLA + SELENE) · Sentinel-1 RTC y ESA WorldCover (Microsoft Planetary Computer) · LRO Mini-RF · MODIS MOD21A2, MYD11A2 · Sentinel-2 L2A (Earth Search, AWS) · NASA POWER (MERRA-2) · SoilGrids 2.0 (ISRIC) · LRO Diviner (GDR L2, GDR L3, GCP, PCP, PRP) · LRO LOLA (albedo a 1064 nm).',
    literature: 'Literatura principal',
    literatureList:
      'Carrier (2003), granulometría lunar · Paige et al. (2010), trampas frías · Williams et al. (2017, 2019), temperaturas de Diviner · Gawronska et al. (2020) y Haruyama et al. (2013), anortosita en Shackleton · Lemelin et al. (2016), albedo de LOLA · Liang (2001), albedo de banda ancha · Gutmann y Turrin (2006), El Elegante · Martellato et al. (2017), Linné.',
    usedIn: (axes: string) => `Ejes: ${axes}`,
  },

  breakLabels: { origen: 'Origen' } as Record<string, string>,

  caveats: {
    limitation: 'Limitación conocida',
    note: 'Cómo leer este dato',
    items: {
      mineralogyLinne: {
        title: 'Linné parece félsico, pero está en basalto',
        text: (c) =>
          `Linné aparece como félsico (${c.moon}) aunque está en el basalto de un mar lunar. Su Christiansen Feature baja por la eyecta fresca e inmadura del cráter, no por su composición. Por eso este eje da una similitud de ${c.similarity} en este par.`,
      },
      mineralogyQuartz: {
        title: 'El índice terrestre responde sobre todo al cuarzo',
        text: (c) =>
          `El granito de Sierra Cucapá (${c.value('cucapa_shackleton', 'mineralogy', 'earth')}) y la dacita de Cerro Prieto (${c.value(
            'cerro_prieto_gruithuisen',
            'mineralogy',
            'earth',
          )}) quedan cerca del basalto, y las arcillas de Laguna Salada la hacen parecer máfica (${c.value(
            'laguna_salada_tranquillitatis',
            'mineralogy',
            'earth',
          )}).`,
      },
      mineralogySubstitute: {
        title: 'Producto sustituto',
        text: () => 'La mineralogía terrestre usa la emisividad de MODIS MOD21 en lugar de ASTER GED AG100, que requiere cuenta de NASA Earthdata.',
      },
      iceSubstitute: {
        title: 'Producto sustituto y escala regional',
        text: (c) =>
          `La humedad terrestre usa MERRA-2 (NASA POWER) en lugar de SMAP, que requiere cuenta de NASA Earthdata. Sus celdas miden unos ${c.cellKm} km: es un valor regional, mucho más grande que el área de análisis.`,
      },
      iceShackleton: {
        title: 'El borde no tiene hielo en la superficie',
        text: () =>
          'El área de análisis es un tramo del borde del cráter y es clase 1: el hielo solo es estable bajo la superficie (a unos 0.6 m) y en cerca del 10 % del área. El interior del cráter, siempre en sombra, sí sería clase 3.',
      },
      iceAbsence: {
        title: 'Los dos son secos',
        text: (c) =>
          `Los dos sitios son clase 0. La similitud de ${c.similarity} solo significa «los dos son secos»; no es una coincidencia fuerte. Por eso el peso del eje baja a ${c.weight}.`,
      },
      albedoShackleton: {
        title: 'Albedo medido con un láser',
        text: () =>
          'En el polo sur el Sol queda a menos de 2° sobre el horizonte y Diviner no puede medir el albedo. El dato viene del láser de LOLA a 1064 nm, una sola longitud de onda del infrarrojo cercano, y tiende a dar valores más altos que los albedos de banda ancha de los otros sitios.',
      },
      thermalReal: {
        title: 'Una diferencia real, no un error',
        text: (c) =>
          `El sitio lunar oscila ${c.moon} entre el día y la noche y el terrestre, ${c.earth}: unas ${c.times} veces más. La Luna no tiene atmósfera y su día dura 29.5 días terrestres. Que este eje quede cerca de 0 es parte de lo que enseña la comparación.`,
      },
      thermalRegional: {
        title: 'Escala regional',
        text: (c) => `La temperatura lunar viene de una celda de Diviner de unos ${c.cellKm} km: es un valor de contexto regional, más grande que el área de análisis.`,
      },
      dustModel: {
        title: 'El polvo terrestre es un modelo',
        text: () => 'SoilGrids estima el suelo incluso sobre roca desnuda (sierras, coladas de lava): no es una medición directa.',
      },
      cratersMissing: {
        title: 'Sin este eje, por diseño',
        text: (c) =>
          `No hay una forma del relieve equivalente en los dos lados, así que este eje no se compara y no entra al ILS. La completitud de ${c.completeness} de este par es por diseño, no un error.`,
      },
      slopeResolution: {
        title: 'Misma resolución en los dos cuerpos',
        text: (c) => `Los dos sitios se compararon a ${c.resolutionM} m por píxel. Con un modelo de elevación más fino, las pendientes saldrían más fuertes.`,
      },
      aridityReference: {
        title: 'La Luna es 0 por definición',
        text: () => 'El valor lunar no es una observación: se fija en 0 porque en la Luna no hay vegetación.',
      },
      roughnessPercentile: {
        title: 'Se comparan posiciones, no números crudos',
        text: (c) =>
          `El radar terrestre midió ${c.earthRaw} y el lunar, ${c.moonRaw}. Son instrumentos distintos, así que cada valor se convierte en su posición dentro de su propio cuerpo y se comparan las posiciones.`,
      },
    } satisfies Record<CaveatId, CaveatText> as Record<CaveatId, CaveatText>,
  },

  axes: {
    slope: {
      name: 'Pendiente',
      units: 'fracción con pendiente < 10°',
      question: '¿Qué parte del terreno es casi plana?',
      measures:
        'La fracción del área de análisis con pendiente menor a 10°: el terreno donde una nave podría posarse o un vehículo circular sin volcarse. Va de 0 (todo inclinado) a 1 (todo casi plano).',
      why: 'Es el primer criterio para elegir un sitio de alunizaje o de base. El Apolo 11 bajó en Mare Tranquillitatis porque es una planicie.',
      earthSource: 'Copernicus DEM GLO-30, un modelo de elevación con una altura cada 30 m, proyectado a metros.',
      moonSource:
        'Modelos de elevación de la cámara LROC NAC (de 2 a 4 m por píxel) o SLDEM2015 (unos 59 m), llevados a la misma malla que el dato terrestre.',
      notes:
        'La pendiente depende de la escala: un modelo más fino ve pendientes más fuertes. Por eso los dos sitios de un par se comparan siempre a la misma resolución: 30 m en general y 60 m en Laguna Salada ↔ Mare Tranquillitatis.',
      scale: { low: 'todo inclinado', high: 'todo casi plano' },
    },
    roughness: {
      name: 'Rugosidad superficial',
      units: 'percentil (0–1)',
      question: '¿Qué tan rocosa es la superficie comparada con el resto de su mundo?',
      measures:
        'Qué tan irregular es la superficie a escala de decímetros a metros (bloques, lava, escarpes), según cómo regresa la señal del radar. El valor es un percentil de 0 a 1 dentro de su propio cuerpo: 0.9 significa «más rugoso que el 90 % de los lugares comparables».',
      why: 'La rugosidad decide por dónde puede pasar un vehículo y cuánto riesgo corre un módulo al posarse.',
      earthSource:
        'Radar Sentinel-1: se compara la señal que regresa «cruzada» (VH) con la que regresa «igual» (VV), en decibeles. El percentil se calcula frente a las celdas de desierto del noroeste de México.',
      moonSource: 'Radar Mini-RF de la sonda LRO: razón de polarización circular (CPR). El percentil se calcula frente a toda la superficie lunar.',
      notes:
        'Sentinel-1 y Mini-RF son radares distintos, así que sus números crudos (dB y CPR) no se pueden comparar entre sí. Lo que se compara es la posición de cada sitio dentro de su propio cuerpo.',
      scale: { low: 'más liso que casi todo', high: 'más rugoso que casi todo' },
    },
    mineralogy: {
      name: 'Composición mineralógica',
      units: 'escala félsica–máfica (0–1)',
      question: '¿De qué están hechas las rocas?',
      measures:
        'La composición de los silicatos en una escala de 0 a 1: 0 es félsico (feldespatos y cuarzo, como el granito) y 1 es máfico (rico en hierro y magnesio, como el basalto).',
      why: 'La composición indica qué recursos hay, cómo se comporta el suelo y qué proceso formó el lugar. Junto con la pendiente, es el eje que más pesa.',
      earthSource:
        'Emisividad térmica de MODIS (MOD21A2 y MYD21A2): la razón entre dos bandas del infrarrojo. Se usa en lugar de ASTER GED AG100, que requiere cuenta de NASA Earthdata.',
      moonSource: 'Posición de la Christiansen Feature medida por Diviner (LRO): la longitud de onda, en micrómetros, que delata el tipo de silicato.',
      notes:
        'Cada instrumento se lleva a la escala 0–1 con dos anclas de su propio cuerpo: un lugar claramente félsico y otro claramente máfico. Es un eje con limitaciones conocidas: el índice terrestre responde sobre todo al cuarzo y el lunar también baja en suelos frescos.',
      scale: { low: 'félsico', high: 'máfico' },
    },
    albedo: {
      name: 'Albedo y reflectancia',
      units: 'fracción (0–1)',
      question: '¿Qué tan clara u oscura es la superficie?',
      measures: 'La fracción de la luz del Sol que refleja la superficie: cerca de 0 es muy oscura y cerca de 1, muy clara.',
      why: 'El albedo controla cuánto se calienta el suelo y cómo se ve en las imágenes, y da pistas sobre su composición.',
      earthSource: 'Sentinel-2: albedo de banda ancha calculado con cinco bandas (fórmula de Liang, 2001), sin nubes, sombras, agua ni vegetación.',
      moonSource: 'Diviner (LRO): reflectancia solar cerca del mediodía. En el polo sur, donde el Sol casi no sube, se usa el láser de LOLA a 1064 nm.',
      notes: 'La tolerancia es estrecha (0.15) porque el albedo natural cambia poco: una diferencia pequeña ya baja mucho la similitud.',
      scale: { low: 'oscuro', high: 'claro' },
    },
    thermal: {
      name: 'Amplitud térmica día/noche',
      units: 'K',
      question: '¿Cuánto cambia la temperatura del suelo entre el día y la noche?',
      measures:
        'La diferencia entre la temperatura de la superficie en el día y en la noche, en kelvin. Un cambio de 1 K es igual a un cambio de 1 °C.',
      why: 'Define qué deben soportar los equipos y los hábitats. Sin atmósfera, y con un día que dura 29.5 días terrestres, el suelo lunar se calienta y se enfría mucho más que cualquier desierto.',
      earthSource: 'Aqua MODIS (MYD11A2): temperatura del suelo de día menos la de noche, promediada durante un año.',
      moonSource: 'Diviner (LRO): temperatura máxima menos temperatura mínima del ciclo de día y noche lunar.',
      notes:
        'Es el único eje que se compara con una razón logarítmica: importa cuántas veces es mayor un valor que el otro. Si uno es 10 veces el otro, la similitud es 0. Por eso casi siempre queda cerca de 0, y esa diferencia es real.',
      scale: { low: 'cambia poco', high: 'cambia muchísimo' },
    },
    aridity: {
      name: 'Aridez y vegetación',
      units: 'NDVI (−1 a 1)',
      question: '¿Cuánta vegetación cubre el lugar?',
      measures:
        'La cantidad de vegetación según el índice NDVI, que compara la luz roja y la infrarroja que refleja el suelo. Las plantas sanas dan valores altos; la roca y el suelo desnudo, cerca de 0.',
      why: 'En la Luna no hay vida, así que un buen análogo tiene poca vegetación. Las plantas, además, alteran lo que miden otros ejes.',
      earthSource: 'Sentinel-2: mediana del NDVI en la temporada seca (de mayo a agosto).',
      moonSource: 'No se mide: es 0 por definición, porque en la Luna no hay vegetación. Es un valor de referencia, no una observación.',
      notes: 'Es de los ejes que menos pesan: casi cualquier desierto se parece a la Luna en esto, así que ayuda poco a distinguir entre sitios.',
      scale: { low: 'sin vegetación', high: 'más vegetación' },
    },
    ice: {
      name: 'Humedad y estabilidad del hielo',
      units: 'clase (0–3)',
      question: '¿Hay agua o hielo, y puede conservarse?',
      measures:
        'Una clase de 0 a 3: 0 es seco; 1, hielo o humedad en una parte menor del área; 2, humedad persistente o congelamiento estacional; 3, hielo estable.',
      why: 'El hielo de los polos lunares es el recurso que más motiva una base permanente: de él se obtienen agua, oxígeno y combustible.',
      earthSource: 'Humedad del suelo de MERRA-2 (NASA POWER), en celdas de unos 50 km. Se usa en lugar de SMAP, que requiere cuenta de NASA Earthdata.',
      moonSource:
        'Temperaturas de Diviner (LRO): el hielo solo es estable donde la temperatura máxima no pasa de unos 110 K. Fuera de los polos no hay lugares así.',
      notes:
        'Si los dos sitios son secos (clase 0 y clase 0) la similitud sale 100, pero solo dice «los dos son secos». Por eso se marca como «similitud por ausencia» y el eje pesa menos.',
      scale: { low: 'seco', high: 'hielo estable' },
    },
    dust: {
      name: 'Polvo y regolito fino',
      units: 'fracción de partículas < ~63 µm',
      question: '¿Qué parte del suelo es polvo fino?',
      measures: 'La fracción del suelo formada por partículas de menos de unos 63 micrómetros: más o menos el grosor de un cabello, o menos.',
      why: 'El polvo lunar es abrasivo, se pega a trajes y equipos y afecta cualquier construcción hecha con regolito.',
      earthSource: 'SoilGrids 2.0 (ISRIC): fracción de limo y arcilla en los primeros 5 cm del suelo. Es un modelo, no una medición directa.',
      moonSource: 'Granulometría publicada de los suelos que trajeron las misiones Apolo (Carrier, 2003), con apoyo de la abundancia de rocas de Diviner.',
      notes:
        'Confianza C: el dato terrestre es un modelo que estima suelo incluso sobre roca desnuda, y el lunar viene de pocas muestras. En la Tierra el polvo lo mueve el viento; en la Luna, los impactos.',
      scale: { low: 'sin polvo fino', high: 'todo polvo fino' },
    },
    craters: {
      name: 'Morfología de cráteres',
      units: 'razón profundidad/diámetro (d/D)',
      question: '¿Qué proporciones tiene la forma del relieve?',
      measures:
        'Las proporciones del relieve. En un cráter, la profundidad dividida entre el diámetro (d/D). En un cono o un domo, la altura dividida entre el diámetro (h/D).',
      why: 'La forma de un cráter o de un volcán cuenta cómo se formó y cuánto se ha desgastado.',
      earthSource: 'Dimensiones publicadas o medidas sobre un modelo de elevación.',
      moonSource: 'Dimensiones publicadas o medidas sobre los modelos de elevación de LROC, con la misma regla que en la Tierra.',
      notes:
        'Qué se divide depende del par: d/D en El Elegante ↔ Linné, h/D de conos en Pinacate ↔ Marius Hills y h/D de domos en Cerro Prieto ↔ Gruithuisen. Dos pares no tienen este eje porque no hay una forma equivalente en los dos lados.',
      scale: { low: 'forma baja y ancha', high: 'forma alta o profunda' },
    },
  } satisfies Record<AxisId, AxisText>,

  pairs: {
    elegante_linne: {
      short: 'El Elegante ↔ Linné',
      cratersKind: 'd/D de cráteres: profundidad entre diámetro.',
      photos: {
        earth: [
          { alt: 'Paredes escalonadas de un cráter volcánico en el desierto, con montañas al fondo.', caption: 'Campo volcánico del Pinacate (USGS).' },
          {
            alt: 'Imagen de satélite de los campos de lava del Pinacate, con varios cráteres circulares.',
            caption: 'Cráteres en los campos de lava del Pinacate (Copernicus Sentinel-2).',
          },
        ],
        moon: [
          { alt: 'Cráter lunar circular y brillante, en forma de tazón, visto desde la órbita.', caption: 'Linné visto por la cámara NAC de LRO (2014).' },
          {
            alt: 'Mapa de relieve en colores del cráter Linné: azul en el fondo y rojo en el borde.',
            caption: 'Relieve sombreado en colores, de un modelo topográfico de LROC: colores fríos, zonas bajas.',
          },
        ],
      },
    },
    pinacate_marius: {
      short: 'Pinacate ↔ Marius Hills',
      cratersKind: 'h/D de conos volcánicos: altura entre diámetro (mediana de los conos detectados).',
      photos: {
        earth: [
          {
            alt: 'Un gran cráter volcánico de paredes oscuras en la Reserva del Pinacate, con un cono y sierras al fondo.',
            caption: 'Reserva de la Biosfera El Pinacate, Sonora.',
          },
          {
            alt: 'Imagen de satélite de los campos de lava oscuros del Pinacate, con conos y cráteres.',
            caption: 'Los campos de lava del Pinacate desde Sentinel-2 (Copernicus).',
          },
        ],
        moon: [
          { alt: 'Dos vistas orbitales de un agujero oscuro en la superficie lunar; la derecha es una ampliación.', caption: 'El pozo de Marius Hills visto por LRO.' },
          { alt: 'Vista cercana de un pozo circular en la Luna, con el fondo en sombra.', caption: 'El pozo de Marius Hills: posible entrada a un tubo de lava (LROC NAC).' },
        ],
      },
    },
    cerro_prieto_gruithuisen: {
      short: 'Cerro Prieto ↔ Gruithuisen',
      cratersKind: 'h/D de domos volcánicos: altura entre diámetro.',
      photos: {
        earth: [
          { alt: 'Fotografía antigua del volcán Cerro Prieto, un cerro oscuro y bajo sobre una llanura.', caption: 'Cerro Prieto en 1959 (U.S. Department of Energy).' },
          {
            alt: 'El Cerro Prieto visto a lo lejos detrás de campos de cultivo, con vapor del campo geotérmico.',
            caption: 'Cerro Prieto desde el noreste, con campos agrícolas al pie.',
          },
        ],
        moon: [
          {
            alt: 'Vista oblicua desde la órbita de dos montes redondeados junto a un mar lunar.',
            caption: 'Gruithuisen Gamma (izquierda) y Delta (derecha), desde el Apolo 15.',
          },
          { alt: 'Vista cenital de dos domos volcánicos lunares junto a una llanura oscura.', caption: 'Los domos de Gruithuisen vistos por LRO.' },
        ],
      },
    },
    laguna_salada_tranquillitatis: {
      short: 'Laguna Salada ↔ Tranquillitatis',
      cratersKind: null,
      photos: {
        earth: [
          {
            alt: 'Llanura desértica muy plana con matorrales bajos y, al fondo, la superficie clara de la laguna seca.',
            caption: 'Entrada norte a la Laguna Salada, vista hacia el sur.',
          },
        ],
        moon: [
          {
            alt: 'Vista orbital de una planicie lunar con pequeños cráteres; se señalan el sitio del Apolo 11 y el cráter West.',
            caption: 'Sitio de alunizaje del Apolo 11 y cráter West, vistos por LRO (2009).',
          },
        ],
      },
    },
    cucapa_shackleton: {
      short: 'Sierra Cucapá ↔ Shackleton',
      cratersKind: null,
      photos: {
        earth: [
          { alt: 'Ladera pedregosa de la sierra con el valle de Mexicali extendido al fondo.', caption: 'El valle de Mexicali visto desde la Tinaja Cucapah.' },
          { alt: 'Cañón estrecho de paredes de roca fracturada y grandes bloques caídos.', caption: 'Cañón de la Tinaja Cucapah.' },
        ],
        moon: [
          {
            alt: 'Mosaico del cráter Shackleton: un cráter circular con el interior iluminado y sombras profundas alrededor.',
            caption: 'Cráter Shackleton, mosaico de LROC y ShadowCam (2023).',
          },
          { alt: 'El borde del cráter Shackleton iluminado por el Sol rasante, con el interior en sombra.', caption: 'Luz rasante sobre el borde de Shackleton (LROC, 2009).' },
        ],
      },
    },
  } satisfies Record<PairId, PairText>,

  /** En español los textos del backend se muestran tal cual. */
  backend: null as BackendTranslation | null,
};

export type PlaygroundText = typeof playgroundEs;
