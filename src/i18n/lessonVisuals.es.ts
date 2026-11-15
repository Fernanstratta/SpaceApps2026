/**
 * Textos de las figuras de las lecciones (`components/lesson`). Los valores
 * que aparecen en las figuras vienen del backend; aquí solo van las
 * etiquetas, las explicaciones y los textos alternativos.
 */
export const lessonVisualsEs = {
  figure: 'Figura',
  illustrative: 'Esquema ilustrativo: no está a escala.',
  fromBackend: 'Valores del backend.',
  noComparable: 'Sin dato comparable',

  slopeRamp: {
    title: 'Inclina el terreno',
    label: 'Inclinación del terreno',
    value: (deg: string) => `${deg}°`,
    safe: 'Casi plano: un módulo puede posarse.',
    risky: 'Demasiado inclinado: el módulo podría resbalar o volcarse.',
    threshold: (deg: string) => `El eje de pendiente cuenta como «casi plano» todo lo que tenga menos de ${deg}°.`,
    alt: (deg: string, safe: boolean) =>
      `Rampa inclinada ${deg}° con un módulo de aterrizaje encima. ${safe ? 'Es terreno casi plano.' : 'Es terreno demasiado inclinado.'}`,
  },

  slopeWaffle: {
    title: 'Cuánto terreno es casi plano',
    cell: 'Cada cuadro es 1 % del área de análisis.',
    flat: 'Pendiente menor a 10°',
    steep: '10° o más',
    share: (percent: string) => `${percent} casi plano`,
    alt: (site: string, percent: string) => `${site}: ${percent} del área tiene pendiente menor a 10°.`,
  },

  radar: {
    title: 'Cómo «ve» el radar la rugosidad',
    smooth: 'Superficie lisa',
    smoothText: 'La señal rebota como en un espejo y casi nada regresa al satélite.',
    rough: 'Superficie rugosa',
    roughText: 'Las rocas dispersan la señal en todas direcciones y una parte regresa.',
    alt: 'Dos superficies reciben la señal de un radar. En la lisa, la señal se aleja; en la rugosa, regresa en parte al satélite.',
    rulersTitle: 'La posición de cada sitio dentro de su propio mundo',
    earthRuler: 'Entre los desiertos del noroeste de México',
    moonRuler: 'Entre todos los lugares de la Luna',
    smoother: 'más liso',
    rougher: 'más rugoso',
    percentile: (site: string, value: string) => `${site}: percentil ${value}`,
    raw: (value: string) => `crudo ${value}`,
  },

  felsicMafic: {
    title: 'De félsico a máfico',
    felsic: 'Félsico',
    felsicRocks: 'granito, dacita: claros, ricos en sílice',
    mafic: 'Máfico',
    maficRocks: 'basalto: oscuro, rico en hierro y magnesio',
    caveat: 'Dato con limitaciones conocidas',
    alt: (list: string) => `Escala de composición de 0 (félsico) a 1 (máfico). ${list}`,
    item: (site: string, value: string) => `${site}: ${value}`,
  },

  albedo: {
    title: 'Qué tan claro es cada suelo',
    tone: 'El tono de cada cuadro es aproximado; el número es el dato.',
    scale: 'De 0 (negro, no refleja nada) a 1 (blanco, lo refleja todo)',
    alt: (site: string, value: string) => `${site}: albedo ${value}`,
    reflects: (percent: string) => `refleja ${percent}`,
  },

  thermal: {
    title: 'Cuánto cambia la temperatura entre el día y la noche',
    linear: 'Escala normal',
    log: 'Escala logarítmica',
    scaleLabel: 'Tipo de escala',
    linearHint: 'En escala normal, la diferencia se ve tal como es.',
    logHint: 'En escala logarítmica cada marca vale 10 veces la anterior: así se calcula este eje.',
    times: (times: string) => `≈ ${times} veces más`,
    alt: (list: string) => `Barras de la amplitud térmica de cada sitio. ${list}`,
    item: (site: string, value: string) => `${site}: ${value}`,
  },

  ndvi: {
    title: 'Qué dice el NDVI',
    water: 'Agua',
    bare: 'Roca y suelo desnudo',
    shrub: 'Matorral',
    forest: 'Vegetación densa',
    moon: 'La Luna se fija en 0 por definición',
    alt: (list: string) => `Escala del NDVI de −1 a 1 con los sitios marcados. ${list}`,
    item: (site: string, value: string) => `${site}: ${value}`,
  },

  ice: {
    title: 'Dónde puede conservarse el hielo',
    classes: ['Clase 0: seco', 'Clase 1: hielo en una parte menor', 'Clase 2: humedad persistente', 'Clase 3: hielo estable'],
    desert: 'Desierto terrestre',
    rim: 'Borde iluminado',
    shadow: 'Interior en sombra permanente',
    subsurface: 'Hielo bajo la superficie',
    sun: 'Sol rasante',
    alt: 'Corte de un cráter polar lunar junto a un suelo de desierto. El desierto es seco; en el borde iluminado del cráter el hielo solo se conserva bajo la superficie en una parte del área; el interior, siempre en sombra, puede tener hielo estable.',
    valueOf: (site: string, value: string) => `${site}: ${value}`,
    notSurface: 'El borde no tiene hielo en la superficie.',
  },

  grains: {
    title: 'Tamaños de partícula',
    clay: 'Arcilla',
    silt: 'Limo',
    sand: 'Arena',
    gravel: 'Grava',
    hair: 'Un cabello mide unos 70 µm',
    limit: 'Límite del polvo fino: ~63 µm',
    fineShare: 'Fracción de polvo fino en cada sitio',
    alt: (list: string) => `Fracción de partículas menores a 63 micrómetros en cada sitio. ${list}`,
    item: (site: string, value: string) => `${site}: ${value}`,
  },

  crater: {
    title: 'La forma del relieve, a la misma escala',
    note: 'Cada perfil se dibuja con el mismo ancho: así se comparan las proporciones, no el tamaño.',
    depth: 'profundidad',
    height: 'altura',
    diameter: 'diámetro',
    ratio: (kind: string, value: string) => `${kind} = ${value}`,
    alt: (list: string) => `Perfiles del relieve dibujados con el mismo ancho. ${list}`,
    item: (site: string, value: string) => `${site}: ${value}`,
    realSize: 'Tamaño real',
    meters: (depth: string, diameter: string) => `${depth} m de profundidad · ${diameter} m de diámetro`,
  },

  terrain: {
    title: 'El relieve real de El Elegante',
    only: 'Por ahora solo hay modelo de elevación para El Elegante. Los demás sitios se ven en fotos y en los perfiles.',
  },
};

export type LessonVisualsText = typeof lessonVisualsEs;
