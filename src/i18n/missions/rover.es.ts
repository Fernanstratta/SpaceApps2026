import type { MissionSiteId, SourceId } from '../../data/missions/roverMission';

/** Dato breve con su fuente (se muestra con enlace). */
export interface SourcedFact {
  text: string;
  source: SourceId;
}

const siteText = (
  name: string,
  place: string,
  kind: string,
  photoAlt: string,
  facts: SourcedFact[],
): { name: string; place: string; kind: string; photoAlt: string; facts: SourcedFact[] } => ({
  name,
  place,
  kind,
  photoAlt,
  facts,
});

/**
 * Textos de la Misión 01 en español. `rover.en.ts` tiene la misma forma
 * (tipo `RoverMissionText`). Los números de los datos (pendiente, gravedad…)
 * vienen de `data/missions/roverMission.ts`; aquí solo va el texto.
 */
export const roverEs = {
  meta: {
    code: 'Misión 01',
    lab: 'Laboratorio de misiones',
    title: '¿Dónde probarías un rover antes de enviarlo a la Luna?',
    lead: 'Compara dos cráteres de la Tierra con un cráter de la Luna, elige dónde ensayar una maniobra del rover y defiende tu decisión con evidencia.',
    /** Etiqueta de edad (la misma que el público de la guía docente). */
    ages: '12–17 años',
    badges: ['Gratis', 'Sin cuenta', 'Clase de 45 min', 'Datos abiertos de NASA y otras agencias'],
    startCta: 'Iniciar misión',
    teachCta: 'Impartir esta clase',
    studentPageTitle: 'Iniciar misión',
    teacherPageTitle: 'Impartir esta clase',
  },

  challenge: {
    title: 'El reto',
    intro:
      'Un equipo de ingeniería necesita ensayar en la Tierra una maniobra de su rover antes de enviarlo a la Luna. Ustedes deciden dónde.',
    maneuverTitle: 'La maniobra que hay que ensayar',
    maneuver:
      'Bajar por la pared interior de un cráter y volver a subir hasta el borde, como el terreno que encontró el rover lunar del Apolo 16 en el cráter North Ray.',
    roverLimit: (deg: number) =>
      `Dato clave: el rover lunar del Apolo podía subir y bajar pendientes de hasta ${deg}°.`,
    panoramaAlt:
      'Panorama del borde del cráter North Ray tomado por la cámara de televisión del rover lunar del Apolo 16; los astronautas están de pie cerca del borde.',
    panoramaCaption: 'Estación 11 del Apolo 16: el rover junto al borde del cráter North Ray.',
  },

  roles: {
    candidate: 'Candidato en la Tierra',
    reference: 'Referencia lunar',
  },

  sites: {
    'el-elegante': siteText(
      'Cráter El Elegante',
      'Gran Desierto de Altar, Sonora, México',
      'Maar volcánico',
      'Paredes del cráter El Elegante vistas desde el borde: laderas de roca volcánica y fondo plano del desierto.',
      [
        { text: 'Es un maar (cráter de explosión volcánica) de unos 1,6 km de ancho.', source: 'photo-elegante' },
        { text: 'La región sirvió como sitio temprano de entrenamiento para astronautas del programa Apolo en los años 60.', source: 'nasa-eo-pinacate' },
        { text: 'Está rodeado por el Gran Desierto, uno de los campos de dunas más grandes de Norteamérica.', source: 'nasa-eo-pinacate' },
      ],
    ),
    'meteor-crater': siteText(
      'Meteor Crater (cráter Barringer)',
      'Arizona, Estados Unidos',
      'Cráter de impacto',
      'Vista aérea del Meteor Crater: un cráter circular de impacto con borde elevado en una llanura desértica.',
      [
        { text: 'Es el cráter de impacto expuesto mejor conservado de la Tierra.', source: 'usgs-arizona-training' },
        { text: 'Es uno de los sitios del norte de Arizona donde se entrenaron los astronautas del Apolo.', source: 'usgs-arizona-training' },
        { text: 'Se formó por el impacto de un meteorito: se encontraron fragmentos del meteorito Cañón Diablo.', source: 'photo-barringer' },
      ],
    ),
    'north-ray': siteText(
      'Cráter North Ray',
      'Luna · zona de alunizaje del Apolo 16',
      'Cráter de impacto',
      'El cráter North Ray visto desde la órbita por la cámara panorámica del Apolo 16: un cráter circular con bloques en el borde.',
      [
        { text: 'Mide unos 1000–1100 m de diámetro y unos 230 m de profundidad.', source: 'alsj-north-ray' },
        { text: 'Sus paredes internas tienen aproximadamente 30–35° de pendiente.', source: 'alsj-north-ray' },
        { text: 'John Young estacionó el rover cerca del borde. Describió la pendiente como «10 o 15 grados» al principio y luego «25 a 30 grados».', source: 'alsj-north-ray' },
      ],
    ),
  } satisfies Record<MissionSiteId, unknown>,

  steps: {
    labels: ['Reto', 'Bitácora', 'Propuesta', 'Revisión', 'Ficha final'],
    navLabel: 'Pasos de la misión',
    current: (n: number, total: number) => `Paso ${n} de ${total}`,
    back: 'Atrás',
    restart: 'Empezar de nuevo',
    restartConfirm: '¿Borrar todo y empezar de nuevo?',
    restartYes: 'Sí, borrar',
    restartNo: 'Cancelar',
    autosave: 'Se guarda automáticamente en este navegador.',
    errorsTitle: 'Revisen lo siguiente:',
  },

  step1: {
    title: 'Paso 1 · El reto',
    teamLabel: 'Nombre del equipo',
    teamPlaceholder: 'Ej.: Equipo Pinacate',
    chooseLabel: 'Sitio provisional: ¿dónde ensayarían la maniobra?',
    chooseHint: 'Antes de elegir, miren las fotos de los tres sitios en el visor.',
    hypothesisLabel: 'Hipótesis',
    hypothesisHint: 'Ej.: «Creemos que este sitio sirve porque en la foto se ven paredes empinadas como las de North Ray».',
    errorSite: 'Elijan un sitio provisional.',
    errorHypothesis: 'Escriban una hipótesis de al menos 20 caracteres.',
    next: 'Explorar la evidencia',
  },

  step2: {
    title: 'Paso 2 · Bitácora de hallazgos',
    intro:
      'Exploren el visor y registren lo que encuentren. Un hallazgo dice dónde miraron, qué dato leyeron y por qué importa.',
    tasks: [
      'Cambien la vista a «Relieve» y activen la capa de pendiente.',
      'Muevan el cursor del perfil por la pared del cráter y comparen con North Ray.',
      'Pulsen «Registrar hallazgo»: elijan si es un punto, el tramo completo o la foto, y escriban qué observaron y por qué importa.',
      'Registren hallazgos de más de un sitio. También sirven los que contradicen su hipótesis.',
    ],
    tasksLabel: 'Qué hacer',
    errorFinding: 'Registren al menos un hallazgo desde el visor.',
    errorFindingNote: 'Cada hallazgo necesita una nota de al menos 15 caracteres. Completen los que estén incompletos.',
    next: 'Armar la propuesta',
  },

  log: {
    title: 'Bitácora de hallazgos',
    none: 'Todavía no hay hallazgos. Usen «Registrar hallazgo» en el visor.',
    count: (n: number, max: number) => `${n} de ${max} hallazgos`,
    edit: 'Editar nota',
    save: 'Guardar nota',
    cancel: 'Cancelar',
    remove: 'Eliminar',
    removeConfirm: '¿Eliminar este hallazgo?',
    removeYes: 'Sí, eliminar',
    removeNo: 'No',
    noteMissing: 'Falta la nota: ¿qué observaron y por qué importa?',
    noteLabel: 'Nota del hallazgo',
    source: 'Fuente',
  },

  step3: {
    title: 'Paso 3 · Propuesta para revisión',
    intro: 'Preparen la propuesta que va a revisar otro equipo.',
    provisional: (site: string) => `Su elección inicial fue: ${site}.`,
    siteLabel: '¿Qué sitio proponen para ensayar la maniobra?',
    kept: 'Proponen el mismo sitio que eligieron al inicio.',
    changed: 'Proponen un sitio distinto al que eligieron al inicio.',
    citeLabel: 'Hallazgo principal',
    citeHint: 'El hallazgo de la bitácora que mejor respalda su propuesta.',
    explanationLabel: '¿Por qué ese hallazgo respalda su propuesta?',
    explanationHint: 'Ej.: «La pendiente media de la pared es parecida a la de North Ray, así que…».',
    limitationLabel: 'Una limitación de la comparación',
    limitationHint: 'Piensen en la gravedad, la atmósfera, el tipo de suelo o la resolución de los datos.',
    nextDataLabel: 'Dato que les gustaría investigar después',
    nextDataHint: 'Ej.: «Qué tan suelto es el suelo en la pared de cada cráter».',
    errorProposal: 'Elijan el sitio que proponen.',
    errorCite: 'Elijan un hallazgo principal.',
    errorExplanation: 'Expliquen por qué con al menos 30 caracteres.',
    errorLimitation: 'Escriban una limitación (al menos 15 caracteres).',
    errorNextData: 'Escriban qué dato investigarían (al menos 10 caracteres).',
    printTitle: 'Ficha para revisión',
    printHint:
      'Impriman la ficha o guárdenla como PDF y entréguenla al docente: la recibirá otro equipo, que escribirá una objeción en el espacio en blanco.',
    print: 'Imprimir ficha para revisión',
    preview: 'Ver la ficha',
    next: 'Registrar la revisión',
  },

  step4: {
    title: 'Paso 4 · Revisión de otro equipo',
    intro:
      'Cuando les devuelvan la ficha, copien la objeción y decidan qué hacer. No hay una respuesta correcta: lo que cuenta es la evidencia.',
    reviewerLabel: 'Equipo revisor (opcional)',
    objectionLabel: 'Objeción que recibieron',
    objectionHint: 'Cópienla tal como la escribió el otro equipo.',
    decisionLabel: 'Después de la revisión…',
    decisions: {
      keep: 'Mantener mi propuesta',
      change: (site: string) => `Cambiar de sitio (a ${site})`,
      'more-evidence': 'Necesitamos más evidencia',
    },
    decisionHints: {
      keep: 'La objeción no cambia lo que muestran los datos.',
      change: 'La objeción o un hallazgo nuevo favorecen el otro sitio.',
      'more-evidence': 'Con los datos que tienen todavía no pueden decidir.',
    },
    supportLabel: 'Hallazgo que respalda su decisión',
    supportHint: 'Pueden registrar un hallazgo nuevo en el visor para responder a la objeción.',
    reasonLabel: {
      keep: '¿Qué dato respalda mantener su propuesta?',
      change: '¿Qué dato los llevó a cambiar de sitio?',
      'more-evidence': '¿Qué dato hace falta y cómo lo conseguirían?',
    },
    reasonHint: {
      keep: 'Ej.: «Revisamos todo el tramo: la pendiente media de la pared también es parecida a la de North Ray».',
      change: 'Ej.: «En todo el tramo, el otro sitio se parece más a North Ray en…».',
      'more-evidence': 'Ej.: «Necesitamos saber qué tan suelto es el suelo; lo buscaríamos en…».',
    },
    errorObjection: 'Copien la objeción (al menos 15 caracteres).',
    errorDecision: 'Elijan qué hacen después de la revisión.',
    errorDecisionFinding: 'Elijan el hallazgo que respalda su decisión.',
    errorDecisionReason: 'Expliquen su decisión con al menos 30 caracteres.',
    next: 'Ver la ficha final',
  },

  step5: {
    title: 'Paso 5 · Ficha final',
    intro: 'La ficha final reúne su elección inicial, su hallazgo principal, la objeción y su decisión revisada.',
    neutral:
      'Starman no califica qué sitio eligieron: cualquier sitio, o pedir más evidencia, es válido si el argumento se apoya en datos.',
    print: 'Imprimir ficha final',
    preview: 'Ver la ficha',
    ready: 'Imprímanla o guárdenla como PDF desde el diálogo de impresión.',
  },

  viewer: {
    title: 'Visor Tierra–Luna',
    siteTabsLabel: 'Sitio que se muestra en el visor',
    viewLabel: 'Vista',
    photo: 'Foto',
    relief: 'Relieve (datos de elevación)',
    layersLabel: 'Capas',
    slopeLayer: 'Pendiente',
    transectLayer: 'Tramo del rover',
    directionLabel: 'Dirección del tramo',
    westEast: 'Oeste → Este',
    northSouth: 'Norte → Sur',
    photoNote: 'La foto no está orientada ni a escala. Las capas se dibujan sobre el relieve, que sí tiene coordenadas.',
    mapLabel: (site: string) => `Mapa de relieve de ${site}, 3 × 3 km, con el tramo del rover`,
    north: 'N',
    scaleBar: '1 km',
    legendTitle: 'Pendiente',
    legend: {
      gentle: 'menos de 10°',
      moderate: '10–20°',
      steep: '20–25°',
      'over-limit': 'más de 25° (límite del rover)',
    },
    profileTitle: (site: string) => `Perfil del tramo · ${site}`,
    profileDesc: (site: string, direction: string) =>
      `Gráfica de altura contra distancia a lo largo del tramo ${direction} de ${site}. Usen el control deslizante para leer cada punto.`,
    compareMoon: 'Comparar con North Ray (Luna)',
    cursorLabel: 'Posición del cursor en el tramo',
    distance: 'Distancia',
    height: 'Altura sobre el fondo',
    elevation: 'Elevación',
    elevationMoon: 'Elevación (respecto a la esfera lunar de referencia)',
    slope: 'Pendiente del tramo',
    axisDistance: 'Distancia a lo largo del tramo (m)',
    axisHeight: 'Altura sobre el fondo (m)',
    roverLimit: (deg: number) => `Límite del rover lunar: ${deg}°`,
    overLimit: 'más empinado que el límite del rover',
    exaggeration: (x: string) => `Altura exagerada ×${x} · misma escala vertical en los tres sitios`,
    stats: {
      depth: 'Profundidad (desde el borde más bajo)',
      maxSlope: 'Pendiente máxima en la pared',
      meanSlope: 'Pendiente media en la pared',
      rimToRim: 'De borde a borde',
    },
    record: 'Registrar hallazgo',
    recordLimit: (max: number) => `Máximo ${max} hallazgos. Eliminen uno de la bitácora para registrar otro.`,
    form: {
      title: 'Nuevo hallazgo',
      scopeLabel: '¿Qué registran?',
      scope: {
        point: 'Este punto del perfil',
        transect: 'Todo el tramo (estadísticas de la pared)',
        photo: 'Lo que se ve en la foto',
      },
      noteLabel: '¿Qué observaron y por qué importa?',
      noteHint: 'Ej.: «Aquí la pared llega a 43°, más que el límite del rover: habría que bajar por otro lado».',
      refresh: 'Usar la lectura actual del visor',
      save: 'Guardar en la bitácora',
      cancel: 'Descartar',
      errorNote: 'Escriban una nota de al menos 15 caracteres.',
    },
    simulated: 'Dato simulado',
    dataFrom: 'Datos',
    resolution: (m: number) => `resolución original ${m} m`,
    photoCredit: 'Foto',
  },

  finding: {
    where: {
      point: (site: string, direction: string, distance: string) => `${site} · tramo ${direction} · punto a ${distance} m`,
      transect: (site: string, direction: string) => `${site} · tramo ${direction} completo`,
      photo: (site: string) => `${site} · foto del sitio`,
    },
    point: (height: string, slope: string) => `${height} m sobre el fondo · pendiente de ${slope}° en ese segmento`,
    transect: (depth: string, rimToRim: string, max: string, mean: string) =>
      `profundidad de ${depth} m · ${rimToRim} m de borde a borde · pendiente de la pared: máxima ${max}°, media ${mean}°`,
    photo: 'Observación visual de la foto (sin medición)',
    consulted: 'Consultado',
    layers: {
      photo: 'foto',
      profile: 'perfil del terreno',
      slope: 'capa de pendiente',
      compared: 'comparado con North Ray',
    },
  },

  sheet: {
    reviewHeading: 'Ficha para revisión',
    finalHeading: 'Ficha final',
    team: 'Equipo',
    noTeam: 'Sin nombre',
    date: 'Fecha',
    maneuver: 'Maniobra',
    initialChoice: 'Elección inicial',
    proposal: 'Propuesta',
    hypothesis: 'Hipótesis inicial',
    mainFinding: 'Hallazgo principal',
    explanation: 'Por qué respalda la propuesta',
    limitation: 'Limitación de la comparación',
    nextData: 'Próximo dato a investigar',
    reviewBox: 'Para el equipo revisor',
    reviewerTeam: 'Equipo revisor',
    objectionPrompt:
      'Objeción: una pregunta o un dato que ponga a prueba la propuesta. Debe poder comprobarse en el visor.',
    objectionExample: 'Ejemplo: «¿La pendiente que citan corresponde a toda la ruta o solo al punto que marcaron?»',
    objection: 'Objeción recibida',
    revisedDecision: 'Decisión revisada',
    pending: 'Sin sitio por ahora: necesitan más evidencia',
    decisionReason: {
      keep: 'Dato que respalda la decisión',
      change: 'Dato que respalda la decisión',
      'more-evidence': 'Dato que hace falta',
    },
    supportingFinding: 'Hallazgo que la respalda',
    neutral:
      'Starman no califica el sitio elegido. Se valora que la evidencia se pueda localizar, que respalde la decisión y que el equipo reconozca qué falta investigar.',
    reference: 'Referencia lunar',
    sources: 'Fuentes de los datos',
    closing: '¿Qué evidencia nos haría cambiar de opinión?',
  },

  guide: {
    title: 'Guía docente · 45 minutos',
    intro:
      'Guía gratuita para impartir la Misión 01 sin cuenta. Los equipos investigan, comparan evidencia y defienden una decisión propia: no hay una única respuesta correcta.',
    print: 'Imprimir guía',
    openStudent: 'Abrir la vista del estudiante',
    onThisPage: 'En esta guía',
    objectiveTitle: 'Objetivo',
    objective:
      'Que cada equipo elija un lugar de la Tierra para ensayar una maniobra del rover lunar y lo justifique con evidencia topográfica, explicando qué característica del terreno lunar reproduce y qué limitaciones tiene la comparación.',
    audienceTitle: 'Para quién',
    audience: 'Secundaria y bachillerato (12–17 años). Equipos de 3 o 4 estudiantes.',
    materialsTitle: 'Materiales',
    materials: [
      'Un dispositivo con navegador por equipo (computadora, tableta o teléfono); o un proyector para toda la clase.',
      'Conexión a internet para las fotos. Los datos de elevación ya vienen incluidos en la app.',
      'Dos impresiones por equipo, la ficha para revisión y la ficha final (o sus PDF).',
      'Opcional: transportador y papel cuadriculado para dibujar un perfil a mano.',
    ],
    preparationTitle: 'Preparación (10 minutos antes)',
    preparation: [
      'Abran la misión y prueben el visor en el dispositivo que usarán.',
      'Formen los equipos y decidan quién maneja el visor y quién escribe.',
      'Decidan las parejas de equipos que se revisarán entre sí (A↔B, C↔D…).',
      'Lean «Revisión entre equipos» y «Qué dicen los datos» en esta guía.',
      'Si comparten dispositivos, usen «Empezar de nuevo» entre grupos: el avance se guarda en el navegador.',
    ],
    timelineTitle: 'Secuencia de la clase',
    timeline: [
      { time: '0–5 min', title: 'Enganche', text: 'Proyecten el panorama del rover en North Ray y lean el reto en voz alta. Pregunten: «¿Qué tendría que tener un lugar de la Tierra para ensayar esto?».' },
      { time: '5–10 min', title: 'Hipótesis (paso 1)', text: 'Los equipos miran las fotos, eligen un sitio provisional y escriben su hipótesis.' },
      { time: '10–20 min', title: 'Bitácora (paso 2)', text: 'Exploran el visor y registran al menos dos hallazgos con nota: dónde miraron, qué dato leyeron y por qué importa.' },
      { time: '20–26 min', title: 'Propuesta (paso 3)', text: 'Eligen el sitio que proponen, su hallazgo principal, una limitación y el próximo dato. Imprimen la ficha para revisión.' },
      { time: '26–34 min', title: 'Revisión entre equipos', text: 'Intercambian las fichas; cada equipo escribe una objeción comprobable en el visor y la devuelve (ver «Revisión entre equipos»).' },
      { time: '34–41 min', title: 'Decisión revisada (pasos 4 y 5)', text: 'Copian la objeción, deciden mantener, cambiar o pedir más evidencia, y dicen con qué dato. Imprimen la ficha final.' },
      { time: '41–45 min', title: 'Cierre', text: 'Pregunta final para toda la clase (ver abajo).' },
    ],
    questionsTitle: 'Preguntas de discusión',
    questions: [
      '¿Qué parte del perfil de su sitio se parece más a la pared de North Ray? ¿En qué se diferencia?',
      'El ALSJ reporta paredes de 30–35° en North Ray. ¿Coincide con la pendiente máxima del perfil? ¿Qué no puede mostrar un dato con píxeles de 59 m (rocas, escalones, tramos cortos)?',
      'En los tres cráteres hay tramos de más de 25°. ¿Por dónde bajarían y subirían para no pasar el límite del rover?',
      'En la Luna la gravedad es 1/6 de la terrestre. ¿Sería más fácil o más difícil subir la misma pendiente? ¿Qué más cambia con menos peso (por ejemplo, el agarre de las ruedas)?',
      'El Elegante es volcánico y Meteor Crater es de impacto. ¿Importa el origen del cráter si lo que se ensaya es la pendiente?',
      '¿Qué cosa no puede reproducir ningún lugar de la Tierra?',
    ],
    rubricTitle: 'Rúbrica breve',
    rubricNote: 'No se evalúa qué sitio eligieron: mantener, cambiar o pedir más evidencia son decisiones igual de válidas.',
    rubricLevels: ['Inicial', 'En desarrollo', 'Logrado'],
    rubric: [
      {
        criterion: 'La evidencia se puede localizar',
        levels: [
          'No se sabe de dónde sale el dato.',
          'Indica el sitio, pero no el tramo, el punto o la fuente.',
          'Indica sitio, tramo o punto, capa y fuente: otro equipo la encuentra en el visor.',
        ],
      },
      {
        criterion: 'La evidencia respalda la decisión',
        levels: [
          'La decisión no se relaciona con la evidencia.',
          'La evidencia se relaciona con la decisión, pero no alcanza (por ejemplo, un solo punto para hablar de toda la ruta).',
          'La evidencia justifica la decisión revisada, también si la decisión fue pedir más evidencia.',
        ],
      },
      {
        criterion: 'Reconoce qué falta investigar',
        levels: [
          'No menciona qué falta.',
          'Menciona una duda general.',
          'Nombra el dato concreto que falta y cómo lo conseguiría.',
        ],
      },
    ],
    closingTitle: 'Pregunta de cierre',
    closing: '¿Qué evidencia te haría cambiar de opinión?',
    reviewTitle: 'Revisión entre equipos',
    reviewIntro:
      'La revisión se hace en clase, con papel o PDF: no hace falta cuenta ni conectar los dispositivos.',
    reviewSteps: [
      'Al terminar el paso 3, cada equipo imprime su «Ficha para revisión» o la guarda como PDF.',
      'Recojan las fichas y entréguenlas a otro equipo (por ejemplo, A↔B, C↔D). Nadie revisa su propia ficha.',
      'El equipo revisor busca en el visor el hallazgo principal y escribe una sola objeción en el espacio en blanco (5 min).',
      'Devuelvan cada ficha a sus autores. Ellos copian la objeción en el paso 4 y deciden: mantener, cambiar de sitio o pedir más evidencia.',
      'Cada equipo imprime su «Ficha final».',
    ],
    objectionExampleTitle: 'Objeción de ejemplo, comprobable en el visor',
    objectionExample: '¿La pendiente que citan corresponde a toda la ruta o solo al punto que marcaron?',
    objectionCheck:
      'Cómo comprobarla: elijan el mismo sitio y tramo en el visor y comparen la pendiente de ese punto con la «Pendiente media en la pared» y la «Pendiente máxima en la pared». En la bitácora, un hallazgo de tipo «Todo el tramo» responde a esta objeción.',
    objectionMoreTitle: 'Otras objeciones que se pueden comprobar',
    objectionMore: [
      '¿El tramo que citan va en la misma dirección que el de North Ray con el que comparan?',
      '¿El dato viene del relieve (DEM) o solo de lo que se ve en la foto?',
      '¿Qué pasa con la pendiente si el rover baja por el otro lado del cráter?',
    ],
    answersTitle: 'Qué dicen los datos (para el docente)',
    answersIntro:
      'Valores medidos por Starman con los mismos datos que ven los estudiantes, en el tramo oeste–este / norte–sur de cada sitio. Cualquier sitio es una respuesta válida si se justifica con evidencia.',
    answersArguments: [
      'A favor de El Elegante: su profundidad es la más parecida a los ~230 m que reporta el ALSJ para North Ray, y está en México.',
      'A favor de Meteor Crater: es un cráter de impacto, como North Ray, y su ancho de borde a borde es el más parecido.',
      'Dato para discutir: la pared de North Ray es más empinada en promedio que la de los dos sitios terrestres, aunque las pendientes máximas son parecidas.',
      'Límites comunes: la gravedad, la atmósfera, la erosión, la vegetación y el suelo (arena o roca contra regolito lunar). Además, un píxel de 59–90 m no muestra rocas ni escalones.',
    ],
    tableSite: 'Sitio',
    sourcesTitle: 'Fuentes y licencias',
  },

  data: {
    title: 'Sobre los datos',
    verified:
      'Verificados: las elevaciones (DEM), las fotos, las dimensiones de North Ray, el límite de pendiente del rover y la gravedad lunar. Cada dato enlaza a su fuente.',
    computed:
      'Calculados por Starman: la pendiente, el desnivel y la distancia de borde a borde se calculan en el navegador a partir de los DEM, con una malla de 41 × 41 puntos cada 75 m.',
    simulated: 'Datos simulados: ninguno. Esta misión no usa valores inventados.',
    resolutionLimit:
      'Límite importante: los DEM tienen píxeles de 90 m (Tierra) y 59 m (Luna). Promedian el terreno, así que no muestran rocas, escalones ni cambios de pendiente más cortos que eso. Comparen las pendientes calculadas con los 30–35° que reporta el ALSJ para la pared de North Ray.',
    attributionEarth:
      'Contiene datos de Copernicus DEM GLO-90 © DLR e.V. 2010-2014 y © Airbus Defence and Space GmbH 2014-2018, proporcionados en el marco de COPERNICUS por la Unión Europea y la ESA; todos los derechos reservados. Consultados con la API de elevación de Open-Meteo.',
    attributionMoon:
      'SLDEM2015: Barker et al. (2016), Icarus 273, 346–355. Combina LOLA (LRO, NASA) y la Terrain Camera de SELENE/Kaguya (JAXA). Distribuido por USGS Astrogeology.',
    downloaded: (date: string) => `DEM descargados el ${date} con scripts/fetch-mission-terrain.ts.`,
  },

  callout: {
    learn: {
      eyebrow: 'Misión 01',
      text: 'Pon a prueba lo que aprendiste: elige dónde ensayar un rover lunar y defiende tu decisión con datos reales.',
      cta: 'Iniciar misión',
    },
    teach: {
      eyebrow: 'Misión 01 · Clase de 45 min',
      text: 'Guía gratuita e imprimible con tiempos, preguntas de discusión y rúbrica. Sin cuenta.',
      cta: 'Impartir esta clase',
    },
  },
};

export type RoverMissionText = typeof roverEs;
