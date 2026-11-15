import type { AnalogyType, AxisId, EarthState, PairId } from '../data/lunarAnalogs';
import type { Confidence, DataStatus } from '../utils/ils';

/**
 * Textos de Starman Playground en español. El contenido científico viene del
 * documento del equipo «Índice de Similitud Lunar (ILS)» (esquema 1.0.0);
 * aquí no se añade ningún dato que no esté ahí. `playground.en.ts` tiene la
 * misma forma (tipo `PlaygroundText`).
 */

export interface AxisText {
  name: string;
  /** Qué es la métrica (unidad o escala). */
  metric: string;
  measures: string;
  why: string;
  earthSource: string;
  moonSource: string;
  notes: string;
}

export interface SiteText {
  name: string;
  region: string;
  type: string;
  /** Área de análisis, tal como la describe el documento. */
  area: string;
  /** Datos clave; `null` si el documento no da ninguno. */
  keyData: string | null;
  /** Nota junto a las coordenadas (p. ej. «centro del cráter»). */
  coordsNote?: string;
  /** Una descripción por foto, en el mismo orden que en el catálogo. */
  photos: { alt: string; caption: string }[];
}

export interface PairText {
  /** Nombre corto del par (título, filtros y tablas). */
  short: string;
  idea: string;
  earth: SiteText;
  moon: SiteText;
  similar: string;
  question: string;
  breaks: { label: string; text: string }[];
}

export const playgroundEs = {
  title: 'Starman Playground',
  lead: 'Compara lugares de Baja California y Sonora con sitios de la Luna usando el Índice de Similitud Lunar.',
  scope:
    'El equipo se concentró solo en la Luna y solo en sitios de Baja California y Sonora, para que estudiantes de la región relacionen el contenido con lugares que conocen. El ILS no dice que un sitio «es igual» a otro: muestra en qué se parecen, cuánto, con qué datos y dónde se rompe la analogía.',

  filters: {
    title: 'Buscar y filtrar pares',
    search: 'Buscar',
    searchPlaceholder: 'Sitio, región, tipo de roca, eje…',
    clearSearch: 'Borrar búsqueda',
    analogy: 'Tipo de analogía',
    strongAxis: 'Eje fuerte esperado',
    anyAxis: 'Cualquier eje',
    state: 'Estado',
    anyState: 'Baja California y Sonora',
    data: 'Estado de los datos',
    dataOptions: {
      all: 'Todos',
      withIls: 'Con ILS calculado',
      noData: 'Sin datos todavía',
      provisionalValues: 'Con valores provisionales',
      provisionalCoords: 'Con coordenadas provisionales',
    },
    sort: 'Ordenar por',
    sortOptions: { doc: 'Orden del documento', ils: 'ILS (mayor primero)', expected: 'Ranking esperado', name: 'Nombre (A–Z)' },
    clear: 'Limpiar filtros',
    results: (n: number, total: number) => (n === total ? `${total} pares` : `${n} de ${total} pares`),
    empty: 'Ningún par coincide con la búsqueda y los filtros.',
    emptyHint: 'Prueba con otra palabra o limpia los filtros.',
    // Filtros por eje comparativo y por similitud (consola del Playground).
    panelLabel: 'Filtros de comparaciones',
    axesLegend: 'Ejes comparativos',
    axesHint: 'Opcional: elige uno o varios ejes y verás solo las comparaciones asociadas a cualquiera de ellos.',
    allAxes: 'Todos los ejes',
    comparisons: (n: number, total: number) => (n === total ? `${total} comparaciones` : `${n} de ${total} comparaciones`),
    similarity: 'Similitud Tierra–Luna mínima',
    similarityValue: (n: number) => (n === 0 ? 'Cualquiera (0 %)' : `${n} % o más`),
    similarityValueText: (n: number) => (n === 0 ? 'Cualquier similitud, 0 por ciento' : `${n} por ciento o más`),
    similarityScale: ['0 %', '50 %', '100 %'],
    similarityPending:
      'Todavía no hay porcentajes de similitud calculados. El filtro está listo y se aplicará cuando existan datos reales; mientras tanto no oculta ninguna comparación.',
    noMatches: 'Ninguna comparación coincide con los filtros elegidos.',
    noMatchesHint: 'Quita algún eje o limpia los filtros para volver a la vista general.',
  },
  analogyTypes: {
    'crater-morphology': 'Morfología de cráter',
    'basaltic-volcanism': 'Volcanismo basáltico',
    'silicic-volcanism': 'Volcanismo silícico',
    'landing-terrain': 'Terreno de aterrizaje',
    'risk-counterexample': 'Contraejemplo de riesgo',
  } satisfies Record<AnalogyType, string>,
  states: { sonora: 'Sonora', 'baja-california': 'Baja California' } satisfies Record<EarthState, string>,

  mapLabel: 'Mapa interactivo de los sitios terrestres de Starman Playground',
  marker: (n: number, name: string) => `Par ${n}: ${name}`,
  mapHint: 'Selecciona un marcador, o usa Tab y Enter. El círculo es el área de análisis (punteado si es provisional).',
  mapLoading: 'Cargando…',
  mapError: 'No se pudo cargar el mapa. El resto del panel sigue disponible.',
  showAll: 'Ver todos los sitios',

  areaPicker: 'Área seleccionada',
  areaPickerHint: 'Haz clic en un número para seleccionar su área.',
  areaAxes: 'Ejes comparativos',
  counter: (n: number, total: number) => `${n} de ${total}`,
  viewer: 'Visor del par',
  earthTab: 'Tierra',
  moonTab: 'Luna',
  view3dTab: 'Vista 3D',
  prevPhoto: 'Foto anterior',
  nextPhoto: 'Foto siguiente',
  photoCounter: (n: number, total: number) => `Foto ${n} de ${total}`,
  photoError: 'No se pudo cargar esta imagen.',
  noPhotos: 'Este sitio todavía no tiene fotos.',
  photoCredit: 'Foto',
  model3dLabel: (name: string) => `Modelo 3D del relieve de ${name}`,
  model3dHint: 'Relieve real (DEM) de 3 × 3 km, altura exagerada ×2. Arrastra para girar o usa los botones.',
  model3dError: 'No se pudo mostrar el modelo 3D en este navegador. Las fotos siguen disponibles.',
  rotateLeft: 'Girar a la izquierda',
  rotateRight: 'Girar a la derecha',

  ils: {
    name: 'Índice de Similitud Lunar',
    short: 'ILS',
    outOf: 'de 100',
    noData: 'Sin datos',
    partial: 'parcial',
    partialNote: (n: number) =>
      n === 1
        ? 'Por ahora es la similitud de un solo eje; no debe leerse como un índice completo.'
        : `Cubre ${n} de los nueve ejes; es un índice parcial.`,
    noDataNote: 'Todavía no hay ningún eje con datos utilizables en los dos sitios.',
    completeness: 'Completitud de datos',
    completenessHint: 'Fracción del peso total (9.25) cubierta por ejes con datos utilizables.',
    scoredAxes: (n: number, total: number) => `${n} de ${total} ejes con puntuación`,
    hasProvisional: 'Incluye valores provisionales (fuera del cálculo)',
    expectedRank: (rank: number) => `Ranking esperado: ${rank}.º`,
  },
  sections: {
    idea: 'Idea central',
    similar: 'En qué se parecen',
    strong: 'Ejes fuertes esperados',
    question: 'Pregunta para clase',
    breaks: 'Dónde se rompe la analogía',
    sheet: 'Ficha Tierra ↔ Luna',
    axes: 'Los nueve ejes en este par',
    detail: 'Detalle del par',
  },
  sheet: {
    earth: 'Tierra',
    moon: 'Luna',
    site: 'Sitio',
    region: 'Región',
    type: 'Tipo',
    coords: 'Coordenadas',
    area: 'Área de análisis',
    keyData: 'Datos clave',
    provisional: 'provisional',
    none: '—',
    dir: { n: 'N', s: 'S', e: 'E', w: 'O' },
    locatorTitle: 'Dónde está en la Luna',
    locatorNear: 'Cara visible de la Luna (esquema, norte arriba)',
    locatorPole: 'Polo sur lunar: en el borde inferior del disco',
    locatorAlt: (name: string) => `Esquema de la cara visible de la Luna con la posición de ${name}`,
  },
  table: {
    caption: 'Valores, origen y similitud de cada eje',
    axis: 'Eje',
    earth: 'Tierra',
    moon: 'Luna',
    status: 'Origen del dato',
    similarity: 'Similitud',
    weight: 'Peso',
    confidence: 'Confianza',
    noValue: 'Sin dato',
    excluded: 'fuera del ILS',
    byAbsence: 'Similitud por ausencia: ambos secos, el peso baja a 0.5',
    strong: 'Eje fuerte esperado',
    more: 'Qué mide y de dónde salen los datos',
    measures: 'Qué mide',
    why: 'Por qué importa en la Luna',
    earthSource: 'Fuente en la Tierra',
    moonSource: 'Fuente en la Luna',
    notes: 'Consideraciones',
    metric: 'Métrica',
    formula: 'Fórmula',
    tolerance: 'Tolerancia',
    source: 'Fuente',
  },
  statuses: {
    measured: { label: 'Medido', meaning: 'Calculado por el equipo con el pipeline a partir de datos satelitales.' },
    published: { label: 'Publicado', meaning: 'Tomado de una publicación científica, citada en el campo de fuente.' },
    reference: { label: 'Referencia', meaning: 'Valor fijo por definición (por ejemplo, NDVI lunar = 0 porque no hay vegetación).' },
    provisional: { label: 'Provisional', meaning: 'Estimación pendiente de medir. Se muestra con una insignia y queda fuera del cálculo del ILS.' },
  } satisfies Record<DataStatus, { label: string; meaning: string }>,
  confidence: {
    A: 'Productos calibrados y directamente comparables.',
    B: 'Requiere calibración o conversión a percentiles.',
    C: 'Datos modelados, escasos o clasificaciones gruesas.',
  } satisfies Record<Confidence, string>,
  formulas: { linear: 'Lineal', log: 'Razón logarítmica' },

  method: {
    title: 'Cómo se calcula el ILS',
    intro:
      'Para cada eje se obtiene un valor del sitio terrestre (x_T) y uno del sitio lunar (x_L). La similitud S va de 0 (nada parecidos) a 100 (idénticos).',
    linearTitle: 'Lineal, para magnitudes del mismo orden',
    logTitle: 'Razón logarítmica, para magnitudes que difieren por órdenes de magnitud (solo la amplitud térmica)',
    tolerance:
      'R es la tolerancia del eje: la diferencia a partir de la cual la similitud llega a 0. Ejemplo: en el eje de cráteres R = 0.2; El Elegante tiene d/D = 0.153 y Linné 0.233, la diferencia es 0.081 y la similitud resulta 100 · (1 − 0.081/0.2) ≈ 59.7.',
    percentile:
      'Cuando cada cuerpo se mide con un instrumento distinto (como el radar en el eje 2), el valor se convierte primero a percentil dentro de su propio cuerpo y se comparan los percentiles con R = 1.',
    totalTitle: 'Índice total',
    total:
      'w es el peso de cada eje. La suma se hace solo sobre los ejes que tienen datos utilizables en los dos sitios. Los pesos van de 0.5 a 1.5; los ejes más importantes para una base (pendiente y mineralogía) pesan 1.5. El peso total de los nueve ejes es 9.25.',
    statusTitle: 'Calidad y origen de cada dato',
    statusIntro: 'Cada valor lleva un estado que indica de dónde viene. Un valor provisional nunca se presenta como dato real.',
    extrasTitle: 'Además, el resultado incluye',
    completeness:
      'Completitud de datos: la fracción del peso total (9.25) cubierta por ejes con datos utilizables. Un ILS con completitud baja es parcial y se muestra como tal.',
    confidenceTitle: 'Confianza del método',
    absence:
      'Similitud por ausencia: si en el eje de hielo los dos sitios son secos, la similitud es 100 pero no aporta información. En ese caso el peso del eje baja de 1.0 a 0.5 y se marca.',
    axesTitle: 'Resumen de los nueve ejes',
    axesNote:
      'Los ejes 1, 4, 5 y 6 tienen confianza A porque usan productos satelitales calibrados en los dos cuerpos. Los ejes 7 y 8 tienen confianza C: son útiles para la discusión educativa, pero sus datos son gruesos o escasos.',
    calcTitle: 'Calculadora de similitud',
    calcIntro: 'Elige un eje y escribe un valor para cada cuerpo: verás la similitud con la fórmula y la tolerancia de ese eje.',
    calcAxis: 'Eje',
    calcEarth: 'Valor en la Tierra (x_T)',
    calcMoon: 'Valor en la Luna (x_L)',
    calcResult: 'Similitud',
    calcInvalid: 'Escribe dos números válidos (positivos si la fórmula es logarítmica).',
    calcExample: 'Usar el ejemplo: El Elegante y Linné',
  },
  status: {
    title: 'Estado actual de los datos',
    intro: (date: string) =>
      `El pipeline ya está listo para recibir mediciones, pero la mayoría todavía no se han hecho. Así queda el catálogo al ${date}.`,
    pair: 'Par',
    scored: 'Ejes con puntuación',
    completeness: 'Completitud',
    provisional: 'Valores provisionales',
    yes: 'Sí',
    no: 'No',
    ofNine: (n: number, total: number) => `${n} de ${total}`,
    only:
      'El único eje con datos publicados en los dos lados es el de cráteres de El Elegante ↔ Linné (Gutmann y Turrin, 2006; Martellato et al., 2017).',
    rankingTitle: 'Ranking esperado',
    rankingIntro: 'Cuando se completen las mediciones, este es el orden esperado del ILS; sirve para detectar errores en el pipeline.',
    select: 'Ver este par',
  },
  limitations: {
    title: 'Limitaciones generales',
    items: [
      {
        label: 'No hay anortosita en la región.',
        text: 'Ningún sitio de Baja California o Sonora tiene la roca clara que forma las tierras altas lunares. Los pares comparan principalmente basalto (mares lunares) y volcanismo silícico.',
      },
      {
        label: 'La escala importa.',
        text: 'Pendiente, rugosidad y albedo cambian con la resolución del producto. Se compara siempre a la misma resolución efectiva, o se documenta la diferencia.',
      },
      {
        label: 'Instrumentos distintos.',
        text: 'Varios ejes usan sensores diferentes en cada cuerpo. Por eso hay calibraciones y percentiles, y por eso esos ejes tienen confianza B o C.',
      },
      {
        label: 'Procesos distintos.',
        text: 'Aunque dos sitios se vean parecidos, en la Tierra actúan el agua, el viento, la vida y la tectónica; en la Luna, los impactos, el vacío y la baja gravedad.',
      },
      {
        label: 'Áreas de análisis provisionales.',
        text: 'Varias coordenadas y radios son de trabajo y deben confirmarse en LROC QuickMap y con imágenes antes de medir.',
      },
    ],
  },
  sources: {
    title: 'Fuentes de datos',
    intro: 'Productos y publicaciones que usa o usará el pipeline. Todos son de acceso abierto.',
    schema: (version: string) => `Esquema de datos ${version}`,
  },

  axes: {
    slope: {
      name: 'Pendiente y seguridad de aterrizaje',
      metric: 'fracción de píxeles con pendiente < 10°',
      measures:
        'Qué proporción del área de análisis es lo bastante plana para aterrizar o circular. Una pendiente menor a 10° es el umbral de seguridad que se usa como referencia.',
      why: 'Es el criterio número uno para elegir un sitio de base o de alunizaje: el Apolo 11 eligió Mare Tranquillitatis precisamente por ser una planicie.',
      earthSource: 'Copernicus DEM GLO-30, re-proyectado a UTM (metros).',
      moonSource: 'LROC NAC DTM, LOLA o SLDEM2015, re-muestreados a la misma resolución (30 m).',
      notes: 'La pendiente depende de la escala: un DEM más fino da pendientes más altas. Por eso siempre se compara a la misma resolución efectiva.',
    },
    roughness: {
      name: 'Rugosidad superficial (radar)',
      metric: 'percentil dentro de su propio cuerpo (0–1)',
      measures: 'Qué tan rocosa o accidentada es la superficie a escala de centímetros a metros, según cómo rebota la señal de radar.',
      why: 'La rugosidad afecta la movilidad de vehículos, el riesgo para un módulo de aterrizaje y la presencia de rocas sueltas o eyecta fresca.',
      earthSource: 'Sentinel-1 GRD IW: diferencia de retrodispersión CR = σ⁰VH − σ⁰VV (dB).',
      moonSource: 'LRO Mini-RF, razón de polarización circular (CPR) en banda S.',
      notes:
        'Los instrumentos son distintos en cada cuerpo, así que el valor se convierte a percentil dentro de su propia población (desiertos terrestres, superficie lunar) y se comparan los percentiles.',
    },
    mineralogy: {
      name: 'Composición mineralógica',
      metric: 'escala félsico (0) – máfico (1)',
      measures:
        'Si las rocas son máficas (ricas en hierro y magnesio, como el basalto) o félsicas (ricas en sílice y feldespato, como el granito o la dacita).',
      why: 'La composición determina qué recursos hay, cómo se comporta el regolito y qué procesos geológicos formaron el sitio. Es el eje que más pesa junto con la pendiente.',
      earthSource: 'ASTER GED AG100 (índice máfico ε12/ε13) y Sentinel-2 L2A como apoyo (B4/B2 para Fe³⁺; B12/B8A y B3/B4 para Fe²⁺).',
      moonSource: 'Diviner GDR_L3, Christiansen Feature (versión NEN); opcionalmente M³ (banda de absorción de 1 µm).',
      notes:
        'Ambos indicadores se calibran a la misma escala 0–1. A ~1 km/píxel, el Christiansen Feature de Diviner describe el contexto regional, no un cráter de 2 km.',
    },
    albedo: {
      name: 'Albedo y reflectancia óptica',
      metric: 'adimensional (0–1)',
      measures:
        'Qué fracción de la luz solar refleja la superficie. Un valor bajo es una superficie oscura (basalto de los mares lunares, α ≈ 0.07–0.10); uno alto, clara (playa salina, α ≈ 0.30–0.40).',
      why: 'El albedo controla cuánto se calienta la superficie, cómo se ve en imágenes y es un indicador indirecto de composición y madurez del suelo.',
      earthSource:
        'Sentinel-2 L2A, albedo de banda ancha: 0.356·B2 + 0.130·B4 + 0.373·B8 + 0.085·B11 + 0.072·B12 − 0.0018 (coeficientes de Liang, 2001).',
      moonSource: 'Diviner GDR_L2, reflectancia solar 0.3–3 µm cerca del mediodía; como alternativa, LROC WAC a 643 nm.',
      notes:
        'Se enmascaran nubes, sombras y nieve con la capa SCL de Sentinel-2. La tolerancia es estrecha (0.15) porque el rango natural del albedo es pequeño.',
    },
    thermal: {
      name: 'Amplitud térmica día/noche',
      metric: 'kelvin (K)',
      measures: 'La diferencia entre la temperatura de la superficie al mediodía y antes del amanecer.',
      why: 'Define los requisitos térmicos de equipos y hábitats. Sin atmósfera, la Luna tiene oscilaciones de cientos de kelvin; el desierto de Sonora, de unas decenas.',
      earthSource: 'Aqua MODIS MYD11A2 v061: LST_Day − LST_Night (factor de escala 0.02 K). Sentinel-2 no tiene canal térmico.',
      moonSource: 'Diviner RCP (128 píxeles/grado) o GCP: T(≈12:00) − T(≈05:30). En el polo, PRP.',
      notes: 'Como las magnitudes difieren por un orden de magnitud, se comparan con razón logarítmica: si un valor es 10 veces el otro, la similitud es 0.',
    },
    aridity: {
      name: 'Aridez y ausencia biológica',
      metric: 'NDVI (−1 a 1)',
      measures: 'Cuánta vegetación hay, medida con el índice NDVI = (B8 − B4)/(B8 + B4).',
      why: 'La Luna no tiene vida, así que un análogo mejor es el que tiene menos vegetación. La vegetación también contamina las señales ópticas de los demás ejes.',
      earthSource: 'Sentinel-2 L2A, mediana del NDVI del área de análisis en temporada seca.',
      moonSource: 'Valor de referencia por definición: NDVI = 0.',
      notes: 'Tiene el peso más bajo (0.5) porque casi cualquier desierto se parece a la Luna en este eje; no distingue bien entre sitios.',
    },
    volatiles: {
      name: 'Humedad y hielo subsuperficial',
      metric: 'clase 0–3 (0 seco … 3 hielo estable)',
      measures: 'Una clase de 0 a 3 sobre la presencia o estabilidad de agua o hielo en el subsuelo.',
      why: 'El hielo en las trampas frías del polo sur es el principal recurso que motiva una base lunar permanente.',
      earthSource: 'SMAP SPL3SMP_E, humedad del suelo (malla de 9 km).',
      moonSource: 'Diviner PRP: el hielo es térmicamente estable si la temperatura máxima es menor a ~110 K.',
      notes:
        'Si los dos sitios son secos (clase 0 contra 0), la similitud sale 100 pero no dice nada interesante. Por eso el peso baja a 0.5 y se marca como «similitud por ausencia».',
    },
    dust: {
      name: 'Polvo y regolito fino',
      metric: 'fracción de partículas < ~63 µm',
      measures: 'Qué fracción del suelo son partículas finas (limo y arcilla), del tamaño del polvo.',
      why: 'El polvo lunar es abrasivo, se adhiere a trajes y equipos, y afecta la construcción con regolito.',
      earthSource: 'ISRIC SoilGrids (250 m): (limo + arcilla), 0–5 cm de profundidad.',
      moonSource: 'Granulometría publicada de las muestras de suelo del Apolo; Diviner Rock Abundance como contexto.',
      notes:
        'Confianza baja (C): los datos terrestres son modelados y los lunares vienen de pocas muestras. En la Tierra el polvo lo mueve el viento; en la Luna, los impactos y la carga electrostática.',
    },
    craters: {
      name: 'Morfología de cráteres y cavidades',
      metric: 'd/D (adimensional)',
      measures:
        'La razón entre la profundidad y el diámetro de un cráter (d/D). También se registra, de forma cualitativa, la presencia de tubos de lava, pozos o domos.',
      why: 'La forma de un cráter refleja cómo se formó y cuánto se ha erosionado. Los cráteres y tubos de lava son candidatos para refugio de una base.',
      earthSource: 'DEM terrestre medido con crater_dD.py, o dimensiones publicadas.',
      moonSource: 'LROC NAC DTM o SLDEM2015 medidos con crater_dD.py, o dimensiones publicadas.',
      notes:
        'crater_dD.py traza 72 perfiles radiales, toma el punto más alto de cada uno como borde y el mínimo central como fondo. Funciona igual en la Tierra y en la Luna.',
    },
  } satisfies Record<AxisId, AxisText>,

  pairs: {
    'elegante-linne': {
      short: 'El Elegante ↔ Linné',
      idea: 'Dos tazones de escala casi igual con origen opuesto',
      earth: {
        name: 'Cráter El Elegante',
        region: 'Reserva de la Biosfera El Pinacate y Gran Desierto de Altar, Sonora',
        type: 'Maar (cráter volcánico freatomagmático)',
        area: 'Círculo de 1.2 km (interior y borde)',
        keyData: 'D = 1,600 m; d = 244 m; ~32 mil años',
        photos: [
          { alt: 'Paredes escalonadas de un cráter volcánico en el desierto, con montañas al fondo.', caption: 'Campo volcánico del Pinacate (USGS).' },
          {
            alt: 'Imagen de satélite de los campos de lava del Pinacate, con varios cráteres circulares.',
            caption: 'Cráteres en los campos de lava del Pinacate (Copernicus Sentinel-2).',
          },
        ],
      },
      moon: {
        name: 'Cráter Linné',
        region: 'Noroeste de Mare Serenitatis',
        type: 'Cráter de impacto simple (Copernicano)',
        area: 'Círculo de 1.65 km (interior y borde)',
        keyData: 'D = 2,230 m; d = 520 m',
        photos: [
          { alt: 'Cráter lunar circular y brillante, en forma de tazón, visto desde la órbita.', caption: 'Linné visto por la cámara NAC de LRO (2014).' },
          {
            alt: 'Mapa de relieve en colores del cráter Linné: azul en el fondo y rojo en el borde.',
            caption: 'Relieve sombreado en colores, de un modelo topográfico de LROC: colores fríos, zonas bajas.',
          },
        ],
      },
      similar:
        'Es el par con la escala más parecida del proyecto: dos cráteres en forma de tazón, de 1.6 y 2.2 km de diámetro, con bordes elevados y basalto en las paredes.',
      question: 'Calcular d/D en clase: El Elegante da 244/1600 ≈ 0.15 y Linné 520/2230 ≈ 0.23. ¿Por qué el cráter lunar es más hondo en proporción?',
      breaks: [
        {
          label: 'Origen opuesto',
          text: 'El Elegante nació de una explosión de vapor cuando el magma tocó agua subterránea; Linné, del impacto de un meteorito.',
        },
        { label: 'Erosión', text: 'El Elegante tuvo un lago y lleva miles de años de lluvia y viento; Linné conserva su forma porque la Luna no tiene atmósfera.' },
        { label: 'Temperatura', text: 'La amplitud térmica es de ~40 K en Sonora contra ~270 K en la Luna.' },
        { label: 'Gravedad', text: 'Con 1/6 de la gravedad terrestre, la eyecta viaja más lejos y las paredes sostienen otras pendientes.' },
      ],
    },
    'pinacate-marius': {
      short: 'Pinacate ↔ Marius Hills',
      idea: 'Coladas, conos y tubos de lava',
      earth: {
        name: 'Escudo del Pinacate',
        region: 'Sonora',
        type: 'Escudo volcánico basáltico con conos cineríticos, coladas y tubos de lava',
        area: 'Círculo de 5 km (provisional)',
        keyData: 'Más de 400 conos; Patrimonio de la UNESCO desde 2013',
        photos: [
          {
            alt: 'Un gran cráter volcánico de paredes oscuras en la Reserva del Pinacate, con un cono y sierras al fondo.',
            caption: 'Reserva de la Biosfera El Pinacate, Sonora.',
          },
          {
            alt: 'Imagen de satélite de los campos de lava oscuros del Pinacate, con conos y cráteres.',
            caption: 'Los campos de lava del Pinacate desde Sentinel-2 (Copernicus).',
          },
        ],
      },
      moon: {
        name: 'Marius Hills',
        region: 'Oceanus Procellarum',
        type: 'Campo volcánico con domos, conos y un pozo (skylight)',
        area: 'Círculo de 5 km centrado en el pozo',
        keyData: null,
        photos: [
          { alt: 'Dos vistas orbitales de un agujero oscuro en la superficie lunar; la derecha es una ampliación.', caption: 'El pozo de Marius Hills visto por LRO.' },
          { alt: 'Vista cercana de un pozo circular en la Luna, con el fondo en sombra.', caption: 'El pozo de Marius Hills: posible entrada a un tubo de lava (LROC NAC).' },
        ],
      },
      similar:
        'Basalto oscuro contra basalto oscuro: en los dos campos se estudian coladas de lava, conos, domos y aberturas relacionadas con tubos de lava.',
      question:
        'Si encontraras un agujero desde órbita, ¿qué observarías para investigar si conduce a un tubo de lava? Astronautas del Apolo entrenaron en el Pinacate.',
      breaks: [
        {
          label: 'Escala de los tubos',
          text: 'Los del Pinacate son demasiado pequeños para Sentinel-2, así que el eje 9 usa presencia/ausencia según la literatura. Con 1/6 de gravedad, los tubos lunares pueden ser mucho más grandes.',
        },
        { label: 'Vegetación', text: 'Los conos tienen plantas que alteran la señal óptica; hay que enmascararla con NDVI.' },
      ],
    },
    'cerro-prieto-gruithuisen': {
      short: 'Cerro Prieto ↔ Gruithuisen',
      idea: 'Un tipo de volcán raro en la Luna',
      earth: {
        name: 'Cerro Prieto (Wee Ñaay, «Cerro Oscuro» en cucapá)',
        region: 'Campo geotérmico, ~30 km al SSE de Mexicali, Baja California',
        type: 'Domo de dacita',
        area: 'Círculo de 2 km (evita cultivos y lagunas geotérmicas)',
        keyData: '~223 m de altura; ~68 % de SiO₂',
        photos: [
          { alt: 'Fotografía antigua del volcán Cerro Prieto, un cerro oscuro y bajo sobre una llanura.', caption: 'Cerro Prieto en 1959 (U.S. Department of Energy).' },
          {
            alt: 'El Cerro Prieto visto a lo lejos detrás de campos de cultivo, con vapor del campo geotérmico.',
            caption: 'Cerro Prieto desde el noreste, con campos agrícolas al pie.',
          },
        ],
      },
      moon: {
        name: 'Domos de Gruithuisen (referencia en el domo Gamma)',
        region: 'Borde de Mare Imbrium',
        type: 'Domos volcánicos silícicos',
        area: 'Círculo de 2 km',
        keyData: '~20 km cada domo; ricos en torio y pobres en FeO',
        photos: [
          {
            alt: 'Vista oblicua desde la órbita de dos montes redondeados junto a un mar lunar.',
            caption: 'Gruithuisen Gamma (izquierda) y Delta (derecha), desde el Apolo 15.',
          },
          { alt: 'Vista cenital de dos domos volcánicos lunares junto a una llanura oscura.', caption: 'Los domos de Gruithuisen vistos por LRO.' },
        ],
      },
      similar:
        'Volcanismo silícico, el tipo raro en la Luna. Es el par donde mejor se aprovecha el Christiansen Feature de Diviner. La misión Lunar-VISE (CLPS) tiene como destino Gruithuisen Gamma.',
      question:
        '«Tenemos en Mexicali un tipo de volcán que en la Luna es un misterio sin resolver.» ¿Qué señales espectrales buscarías para comparar las dos rocas?',
      breaks: [
        { label: 'Origen del magma', text: 'La Luna no tiene tectónica de placas ni agua, así que su magma silícico se formó de otra manera.' },
        { label: 'Escala', text: '~223 m contra ~20 km. La altura y anchura de los domos se estudian aparte de la razón d/D de un cráter.' },
      ],
    },
    'laguna-salada-tranquillitatis': {
      short: 'Laguna Salada ↔ Tranquillitatis',
      idea: 'Planicies seguras para alunizar',
      earth: {
        name: 'Laguna Salada',
        region: '~30 km al SO de Mexicali, Baja California',
        type: 'Playa endorreica (lago seco)',
        area: 'Círculo de 5 km, en fecha seca',
        keyData: '~10 m bajo el nivel del mar; ~60 × 17 km',
        photos: [
          {
            alt: 'Llanura desértica muy plana con matorrales bajos y, al fondo, la superficie clara de la laguna seca.',
            caption: 'Entrada norte a la Laguna Salada, vista hacia el sur.',
          },
        ],
      },
      moon: {
        name: 'Mare Tranquillitatis, sitio del Apolo 11',
        region: 'Mar lunar ecuatorial',
        type: 'Planicie basáltica',
        area: 'Círculo de 5 km alrededor del módulo lunar',
        keyData: null,
        photos: [
          {
            alt: 'Vista orbital de una planicie lunar con pequeños cráteres; se señalan el sitio del Apolo 11 y el cráter West.',
            caption: 'Sitio de alunizaje del Apolo 11 y cráter West, vistos por LRO (2009).',
          },
        ],
      },
      similar: 'Dos planicies: la laguna es casi toda pendiente < 10° y sin vegetación, igual que la llanura que eligió el Apolo 11 para alunizar.',
      question:
        '«¿Dónde aterrizarías si fueras la NASA?» ¿Cómo identificarías una zona llana a partir de un mapa de pendientes? Las tormentas de polvo de verano sirven para hablar del polvo lunar.',
      breaks: [
        { label: 'Albedo', text: 'Las sales aclaran la playa (α ≈ 0.30–0.40), mientras que el basalto del mar lunar es oscuro (α ≈ 0.07–0.10).' },
        { label: 'Polvo', text: 'En la laguna lo mueve el viento; en la Luna, los impactos y la carga electrostática.' },
        { label: 'Inundaciones', text: 'La laguna a veces se llena de agua, así que la fecha de la observación cambia la superficie que se compara.' },
      ],
    },
    'cucapa-shackleton': {
      short: 'Sierra Cucapá ↔ Shackleton',
      idea: 'Relieve escarpado: dónde no aterrizar',
      earth: {
        name: 'Sierra Cucapá (pico norte: El Centinela, 781 m)',
        region: 'Al SO de Mexicali, Baja California',
        type: 'Sierra de rocas graníticas y metamórficas',
        area: 'Círculo de 5 km (provisional)',
        keyData: 'Zona del sismo El Mayor–Cucapah de 2010',
        photos: [
          { alt: 'Ladera pedregosa de la sierra con el valle de Mexicali extendido al fondo.', caption: 'El valle de Mexicali visto desde la Tinaja Cucapah.' },
          { alt: 'Cañón estrecho de paredes de roca fracturada y grandes bloques caídos.', caption: 'Cañón de la Tinaja Cucapah.' },
        ],
      },
      moon: {
        name: 'Borde de Shackleton',
        region: 'Polo sur lunar',
        type: 'Borde de un cráter de impacto',
        area: 'Hay que elegir un tramo del borde antes de medir',
        keyData: null,
        coordsNote: 'centro del cráter',
        photos: [
          {
            alt: 'Mosaico del cráter Shackleton: un cráter circular con el interior iluminado y sombras profundas alrededor.',
            caption: 'Cráter Shackleton, mosaico de LROC y ShadowCam (2023).',
          },
          { alt: 'El borde del cráter Shackleton iluminado por el Sol rasante, con el interior en sombra.', caption: 'Luz rasante sobre el borde de Shackleton (LROC, 2009).' },
        ],
      },
      similar:
        'Es el contraejemplo de seguridad: «aquí NO aterrizarías». Pendientes > 15°, rugosidad alta y roca clara rica en feldespato. Sirve para estudiar cómo cambian las rutas cuando aumentan las pendientes.',
      question:
        'Se ve todos los días desde Mexicali. Si un vehículo tuviera que recorrer el borde, ¿cómo usarías un mapa de pendientes y sombras para trazar su ruta? El sismo de 2010 lleva a hablar de los sismos lunares que registró el Apolo.',
      breaks: [
        {
          label: 'Iluminación y hielo',
          text: 'El Sol rasante del polo crea sombras permanentes con hielo estable (eje 7: clase 3 en la Luna contra 0 en la sierra, similitud 0).',
        },
        { label: 'Roca', text: 'Granito con cuarzo y rocas metamórficas, no anortosita como en las tierras altas lunares.' },
      ],
    },
  } satisfies Record<PairId, PairText>,
};

export type PlaygroundText = typeof playgroundEs;
