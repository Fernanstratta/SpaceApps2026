import type { AxisCurriculumText } from '../types';

/** Eje 9 · Morfología de cráteres. Concepto (primaria) → medición (secundaria) → análogos (preparatoria). */
export const cratersEs: AxisCurriculumText = {
  student: {
    tagline: 'La forma cuenta la historia',
    overview:
      'Un cráter puede formarse por el choque de un meteorito o por una explosión volcánica. Su forma, qué tan profundo es comparado con su ancho, guarda pistas de su origen y de su edad.\n\nAprenderás cómo se forman los cráteres, cómo se mide su forma con una sola proporción, y por qué El Elegante, en Sonora, y Linné, en la Luna, se parecen aunque tengan orígenes muy distintos.',
  },
  teacher: {
    tagline: 'Morfología: comparar proporciones, no tamaños',
    overview:
      'Se presenta la razón profundidad/diámetro (d/D) de cráteres y su análogo altura/diámetro (h/D) en conos y domos. Se aplica a los cinco pares: tres con este eje (El Elegante ↔ Linné, Pinacate ↔ Marius Hills, Cerro Prieto ↔ Gruithuisen) y dos que no lo tienen por diseño.',
    objectives: [
      'Describir la formación de cráteres de impacto y de cráteres volcánicos.',
      'Calcular e interpretar la razón d/D o h/D.',
      'Explicar por qué un eje puede no tener dato comparable por diseño.',
    ],
  },
  submodules: {
    concept: {
      summary: 'Cráteres de impacto y cráteres volcánicos: dos formas de hacer un hoyo en el suelo.',
      student: {
        introduction:
          'Si dejas caer una canica en un plato con harina, se forma un hoyo redondo con el borde levantado. Así se forman muchos cráteres en la Luna. Pero en Sonora hay cráteres que no hizo ningún meteorito.',
        blocks: [
          {
            id: 'impacto',
            title: 'Dos maneras de hacer un cráter',
            body: 'Un cráter de impacto se forma cuando una roca del espacio choca a gran velocidad contra el suelo. Así se formó Linné, en la Luna.\n\nUn maar se forma cuando el magma caliente toca agua bajo tierra: el agua se vuelve vapor de golpe y explota. Así se formó El Elegante, en Sonora.',
            imageId: 'barringer',
          },
          {
            id: 'forma',
            title: 'Profundo o ancho',
            body: 'El Elegante tiene [[fact elegante earth depth_m]] m de profundidad y [[fact elegante earth diameter_m]] m de ancho. Linné tiene [[fact elegante moon depth_m]] m de profundidad y [[fact elegante moon diameter_m]] m de ancho.\n\nSi los dibujamos del mismo ancho, ¿cuál se ve más hondo? Mira los perfiles.',
            visual: 'crater-profile',
          },
          {
            id: 'relieve',
            title: 'El Elegante en 3D',
            body: 'Este modelo se hizo con datos reales de altura tomados desde el espacio. Gíralo para ver el borde y el fondo del cráter.',
            visual: 'terrain-3d',
          },
        ],
        concepts: [
          { term: 'Cráter', definition: 'Hoyo redondo en el suelo con el borde levantado.' },
          { term: 'Cráter de impacto', definition: 'Cráter que hizo una roca del espacio al chocar.' },
          { term: 'Maar', definition: 'Cráter volcánico que se forma cuando el magma toca agua y explota.' },
        ],
        earth: 'El Elegante es un maar de Sonora: mide [[fact elegante earth diameter_m]] m de ancho y [[fact elegante earth depth_m]] m de profundidad.',
        moon: 'Linné es un cráter de impacto joven de la Luna: mide [[fact elegante moon diameter_m]] m de ancho y [[fact elegante moon depth_m]] m de profundidad.',
        comparisonLead: 'Las marcas de la escala muestran la profundidad dividida entre el ancho. Entre más a la derecha, más hondo en proporción.',
        facts: [
          'El cráter Barringer, en Arizona, lo hizo un meteorito hace unos 50 000 años.',
          'En el siglo XIX, un astrónomo dijo que Linné había desaparecido; en realidad, los telescopios de la época no lo veían bien.',
        ],
        activities: [
          {
            title: 'Cráteres en harina',
            description:
              'Llena una charola con harina y espolvorea encima un poco de cacao. Deja caer canicas desde distintas alturas. Mide el ancho y la profundidad de cada cráter. ¿Cambia la forma si la canica cae desde más alto?',
            type: 'model',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Cómo se formó El Elegante?',
            options: ['Por el choque de un meteorito', 'Por una explosión cuando el magma tocó agua', 'Por un río'],
            answer: 1,
            explanation: 'Es un maar: el agua se volvió vapor de golpe.',
          },
          {
            question: '¿Cómo se formó Linné?',
            options: ['Por el choque de una roca del espacio', 'Por un volcán', 'Por el viento'],
            answer: 0,
            explanation: 'Linné es un cráter de impacto.',
          },
        ],
        conclusion:
          'Dos cráteres pueden verse parecidos aunque se formaran de maneras muy distintas. Por eso, al comparar, los científicos miran su forma y también su historia.',
      },
      teacher: {
        objectives: ['Distinguir cráteres de impacto y volcánicos.', 'Comparar la forma de dos cráteres dibujados al mismo ancho.'],
        priorKnowledge: ['Saber qué es un volcán.', 'Medir con regla en centímetros.'],
        materials: ['Charola', 'Harina', 'Cacao en polvo', 'Canicas', 'Regla', 'Periódico para cubrir la mesa'],
        explanation:
          'Lo esencial: los cráteres de impacto los hace una roca del espacio; los maares, una explosión de vapor al contacto del magma con agua. El Elegante y Linné se parecen en forma, pero no en origen. Error frecuente: pensar que todos los cráteres son de meteoritos.',
        steps: [
          { title: 'Foto del Barringer', description: 'Pregunte cómo creen que se hizo el cráter.', minutes: 5 },
          { title: 'Dos orígenes', description: 'Explique impacto y maar con El Elegante y Linné.', minutes: 8 },
          { title: 'Cráteres en harina', description: 'Actividad con canicas y medición.', minutes: 15 },
          { title: 'Perfiles y 3D', description: 'Muestre los perfiles al mismo ancho y el modelo 3D de El Elegante.', minutes: 8 },
          { title: 'Cierre', description: 'Comprobación de dos preguntas.', minutes: 4 },
        ],
        discussion: ['¿Qué es más hondo en proporción: El Elegante o Linné?', '¿Por qué la Luna tiene muchos más cráteres que la Tierra?'],
        dataActivity: {
          title: 'Dibujar a escala',
          description:
            'Dibujen los dos cráteres con el mismo ancho de 10 cm. ¿Qué profundidad le toca a cada uno? (El Elegante: [[fact elegante earth depth_m]] de [[fact elegante earth diameter_m]]; Linné: [[fact elegante moon depth_m]] de [[fact elegante moon diameter_m]]). Pueden ayudarse con la calculadora o con el docente.',
          minutes: 10,
        },
        assessment: ['Revisar las mediciones de la actividad de harina.', 'Pedir que expliquen con un dibujo los dos orígenes.'],
        outcomes: ['El grupo distingue dos orígenes de cráteres.', 'El grupo compara formas dibujadas al mismo ancho.'],
        alternative: {
          title: 'Plastilina',
          description: 'Sin harina: los niños modelan en plastilina un cráter ancho y poco profundo y otro hondo, y los comparan con los perfiles.',
          type: 'physical-model',
          materials: ['Plastilina'],
        },
        siteActivities: ['Observar fotos del borde de El Elegante y su fondo plano.', 'Comparar con la foto de Linné desde la órbita.'],
      },
    },

    measurement: {
      summary: 'La razón profundidad/diámetro y su versión para conos y domos: medir la forma con un número.',
      student: {
        introduction:
          'Para comparar cráteres de tamaños distintos no sirve comparar sus metros: un cráter de 2 km y otro de 20 km nunca coincidirían. En cambio, se comparan sus proporciones. Una sola división basta para describir su forma.',
        blocks: [
          {
            id: 'dD',
            title: 'La razón d/D',
            body: 'La razón d/D es la profundidad dividida entre el diámetro. El Elegante: [[fact elegante earth depth_m]] / [[fact elegante earth diameter_m]] = [[earth elegante craters]]. Linné: [[fact elegante moon depth_m]] / [[fact elegante moon diameter_m]] = [[moon elegante craters]].\n\nLos cráteres de impacto simples, como Linné, suelen tener d/D cercano a 0.2. El Elegante es menos profundo en proporción: conserva sedimentos de un antiguo lago en su fondo.',
            visual: 'crater-profile',
          },
          {
            id: 'hD',
            title: 'Para conos y domos: h/D',
            body: 'Un domo no es un hoyo, es un montículo. Su versión de la razón es h/D: la altura dividida entre el diámetro de la base. Cerro Prieto tiene [[earth cerro craters]] y los domos de Gruithuisen [[moon cerro craters]].\n\nEl backend usa el mismo eje para las dos formas, pero el método de cada valor dice cuál se usó.',
            visual: 'crater-profile',
            visualPair: 'cerro_prieto_gruithuisen',
          },
          {
            id: 'metodo',
            title: 'Cómo se mide',
            body: 'Los valores salen de dimensiones publicadas o de modelos de elevación: en la Tierra, Copernicus DEM; en la Luna, los modelos de LROC. Trazar dónde empieza el borde y dónde está el fondo es una decisión de método: los dos estudios publicados de El Elegante y Linné lo hicieron de forma distinta. Por eso el eje tiene confianza [[conf craters]].',
          },
        ],
        concepts: [
          { term: 'Razón d/D', definition: 'Profundidad dividida entre diámetro de un cráter; describe su forma sin importar su tamaño.' },
          { term: 'Razón h/D', definition: 'Altura dividida entre diámetro de la base de un cono o un domo.' },
          { term: 'Cráter simple', definition: 'Cráter pequeño en forma de tazón, sin picos ni terrazas en su interior.' },
          { term: 'Proporción', definition: 'Relación entre dos medidas que no cambia si se agranda o se reduce el objeto.' },
        ],
        earth: 'El Elegante: d/D = [[earth elegante craters]] (dimensiones publicadas). Cerro Prieto: h/D = [[earth cerro craters]] (medido sobre Copernicus DEM).',
        moon: 'Linné: d/D = [[moon elegante craters]] (dimensiones publicadas). Domos de Gruithuisen: h/D = [[moon cerro craters]] (medido sobre modelos lunares).',
        comparisonLead: 'Observa que los domos quedan a la izquierda de la escala: son formas bajas y anchas. Compara con los cráteres.',
        facts: [
          'Tycho, un cráter lunar de unos 85 km, es un cráter complejo: tiene un pico central y terrazas en sus paredes.',
          'Con el tiempo, los cráteres se rellenan y su d/D baja: la forma también indica la edad.',
          'La tolerancia del eje es R = [[R craters]]: una diferencia de esa cantidad en la razón lleva la similitud a 0.',
        ],
        activities: [
          {
            title: 'Calcula d/D',
            description:
              'Con las medidas de tus cráteres de harina (o con las de El Elegante y Linné), calcula d/D. ¿Qué pasa con d/D si duplicas el tamaño del cráter pero mantienes su forma?',
            type: 'calculation',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Por qué se compara d/D y no la profundidad en metros?',
            options: ['Porque describe la forma sin depender del tamaño', 'Porque los metros no existen en la Luna', 'Porque es más grande'],
            answer: 0,
            explanation: 'Una proporción permite comparar cráteres de tamaños distintos.',
          },
          {
            question: '¿Qué razón se usa para un domo?',
            options: ['d/D', 'h/D', 'NDVI'],
            answer: 1,
            explanation: 'En formas positivas se usa altura entre diámetro.',
          },
          {
            question: '¿Por qué El Elegante tiene un d/D menor que Linné?',
            options: ['Porque su fondo conserva sedimentos de un antiguo lago', 'Porque es más grande', 'Porque está en la Luna'],
            answer: 0,
            explanation: 'El relleno reduce la profundidad aparente del cráter.',
          },
        ],
        conclusion:
          'Una proporción convierte una forma en un número comparable. Pero cada número depende de cómo se trazó el borde y el fondo, y de si el cráter se ha rellenado. Medir la forma también es interpretar.',
      },
      teacher: {
        objectives: [
          'Calcular d/D y h/D con datos reales.',
          'Explicar por qué una proporción permite comparar tamaños distintos.',
          'Reconocer las decisiones de método al medir un cráter.',
        ],
        priorKnowledge: ['División y decimales.', 'Concepto de proporción.', 'Formación de cráteres (submódulo anterior).'],
        materials: ['Calculadora', 'Regla', 'Medidas de los cráteres de harina (si se hicieron)'],
        explanation:
          'Lo esencial: d/D describe la forma de un cráter y h/D la de un cono o domo. El Elegante ([[earth elegante craters]]) es menos profundo en proporción que Linné ([[moon elegante craters]]) por su relleno lacustre. Error frecuente: comparar diámetros o profundidades absolutos.',
        steps: [
          { title: 'Problema', description: '¿Cómo compararías un cráter de 2 km con uno de 20 km?', minutes: 5 },
          { title: 'd/D', description: 'Calculen juntos la razón de El Elegante y de Linné.', minutes: 12 },
          { title: 'Calcula d/D', description: 'Actividad con sus propias medidas.', minutes: 15 },
          { title: 'h/D y método', description: 'Presente Cerro Prieto ↔ Gruithuisen y las decisiones de medición.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 8 },
        ],
        discussion: [
          '¿Cómo cambia d/D con el tiempo en un cráter?',
          '¿Por qué conviene usar la misma regla para trazar el borde en la Tierra y en la Luna?',
          '¿Es justo comparar un domo con un cráter en el mismo eje?',
        ],
        dataActivity: {
          title: 'Similitud de la forma',
          description:
            'Con la escala del eje, los equipos comparan la distancia entre El Elegante y Linné y entre Cerro Prieto y Gruithuisen con la regla R = [[R craters]]. Las similitudes del backend son [[s elegante craters]] y [[s cerro craters]].',
          minutes: 10,
        },
        assessment: ['Revisar los cálculos de d/D.', 'Pregunta escrita: ¿qué indica un d/D bajo?'],
        outcomes: ['El grupo calcula proporciones de forma.', 'El grupo explica el efecto del relleno y del método.'],
        alternative: {
          title: 'Perfiles en papel',
          description: 'Entregue perfiles impresos de cráteres de distinto tamaño y misma forma; los alumnos miden y comprueban que d/D se mantiene.',
          type: 'printable',
          materials: ['Perfiles impresos', 'Regla'],
        },
        siteActivities: ['Observar en el modelo 3D de El Elegante dónde empieza el borde.', 'Comparar el perfil de Cerro Prieto con el de un cerro cercano.'],
      },
    },

    analogs: {
      summary: 'Cinco pares, tres con este eje: proporciones parecidas, orígenes distintos y dos huecos por diseño.',
      student: {
        introduction:
          'Este es el único eje cuya métrica cambia según el par: d/D en cráteres, h/D en conos y domos, y ningún valor cuando no hay una forma equivalente en los dos lados. Vamos a revisar los cinco pares con ojo crítico.',
        blocks: [
          {
            id: 'tres',
            title: 'Tres pares con forma comparable',
            body: 'El Elegante ↔ Linné (d/D): [[earth elegante craters]] y [[moon elegante craters]], similitud [[s elegante craters]]. Pinacate ↔ Marius Hills (h/D de conos, mediana de los conos detectados): [[earth pinacate craters]] y [[moon pinacate craters]], similitud [[s pinacate craters]]. Cerro Prieto ↔ Gruithuisen (h/D de domos): [[earth cerro craters]] y [[moon cerro craters]], similitud [[s cerro craters]].',
            visual: 'crater-profile',
          },
          {
            id: 'origen',
            title: 'Misma proporción, otro origen',
            body: 'El Elegante es un maar: se formó cuando el magma encontró agua subterránea. Linné es un cráter de impacto. Que sus formas se parezcan no dice que se formaran igual.\n\nAdemás, El Elegante conserva depósitos de un antiguo lago, y los dos estudios publicados trazaron el borde y el fondo con métodos distintos. El backend lo señala como ruptura de la analogía.',
            imageId: 'linne-lro',
          },
          {
            id: 'huecos',
            title: 'Dos pares sin este eje, a propósito',
            body: 'Laguna Salada ↔ Tranquillitatis es una playa contra un mar lunar; Sierra Cucapá ↔ Shackleton, una sierra contra el borde de un cráter. En ninguno hay una forma del relieve equivalente en los dos lados.\n\nEl eje queda «sin dato comparable» y no entra al ILS: no es un 0. Por eso esos pares tienen completitud de [[completeness laguna]] y [[completeness cucapa]], por diseño y no por error.',
          },
          {
            id: 'pozo',
            title: 'Lo cualitativo no entra',
            body: 'Marius Hills tiene un pozo que podría ser la entrada a un tubo de lava. Es una observación muy importante, pero cualitativa: el eje compara proporciones de rasgos definidos, no la presencia de aberturas. Para estudiarla hacen falta otras observaciones.',
            imageId: 'marius-pit',
          },
        ],
        concepts: [
          { term: 'Convergencia de forma', definition: 'Cuando procesos distintos producen formas parecidas.' },
          { term: 'Eje no disponible', definition: 'Eje sin dato comparable en un par; no entra al ILS y no se cuenta como 0.' },
          { term: 'Completitud', definition: 'Parte del peso total de los ejes que sí tiene dato comparable en un par.' },
          { term: 'Tubo de lava', definition: 'Túnel que deja la lava al vaciarse; en la Luna podría proteger de la radiación y la temperatura.' },
        ],
        earth: 'Formas de la región: el maar de El Elegante, los conos del Pinacate y el domo de Cerro Prieto. La Laguna Salada y la Sierra Cucapá no tienen una forma equivalente en su par.',
        moon: 'Formas lunares: el cráter Linné, los conos de Marius Hills y los domos de Gruithuisen. Mare Tranquillitatis y el borde de Shackleton no tienen este eje en su par.',
        comparisonLead: 'La escala muestra cinco filas: tres con marcas y dos rayadas. Explica por qué las rayadas no son similitud 0.',
        facts: [
          'El pozo de Marius Hills lo descubrió en 2009 la sonda japonesa Kaguya (SELENE).',
          'El Elegante es uno de los maares más grandes y mejor conservados de la Reserva de la Biosfera El Pinacate y Gran Desierto de Altar.',
          'Cerro Prieto ↔ Gruithuisen tiene la similitud de forma más alta de los tres pares con este eje: [[s cerro craters]].',
        ],
        activities: [
          {
            title: 'Defiende o critica',
            description:
              'Elige uno de los tres pares con este eje. Escribe un párrafo que defienda la analogía con la proporción y otro que la critique con el origen, el método o el relleno. Termina con una pregunta de investigación.',
            type: 'reflection',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Por qué Laguna Salada ↔ Tranquillitatis no tiene valor en este eje?',
            options: ['Porque no hay una forma del relieve equivalente en los dos lados', 'Porque el satélite falló', 'Porque su similitud es 0', 'Porque es provisional'],
            answer: 0,
            explanation: 'Es una decisión de diseño: el eje no aplica y no entra al ILS.',
          },
          {
            question: '¿Qué significa que un eje esté «sin dato comparable»?',
            options: ['Que vale 0', 'Que no entra al cálculo del ILS y baja la completitud', 'Que vale 100', 'Que se estima'],
            answer: 1,
            explanation: 'Un faltante nunca se convierte en 0.',
          },
          {
            question: '¿Qué conclusión es correcta sobre El Elegante y Linné?',
            options: [
              'Se formaron igual porque su forma se parece',
              'Sus proporciones se parecen, pero uno es un maar y otro un cráter de impacto',
              'Linné es un maar',
              'El Elegante está en la Luna',
            ],
            answer: 1,
            explanation: 'La forma puede converger aunque el origen sea distinto.',
          },
          {
            question: '¿Por qué el pozo de Marius Hills no entra en este eje?',
            options: ['Porque es una observación cualitativa, no una proporción de un rasgo definido', 'Porque no existe', 'Porque está en la Tierra', 'Porque su d/D es 0'],
            answer: 0,
            explanation: 'El backend lo indica como ruptura de la analogía en ese par.',
          },
        ],
        conclusion:
          'La morfología muestra dos lecciones de método: formas parecidas pueden tener orígenes distintos, y un eje puede no aplicar a un par. Ninguna de las dos se resuelve con un número; se resuelve leyendo los datos con su contexto.',
      },
      teacher: {
        objectives: [
          'Evaluar la similitud de forma en tres pares y la ausencia del eje en dos.',
          'Distinguir convergencia de forma y origen común.',
          'Explicar la completitud como consecuencia de un diseño metodológico.',
        ],
        priorKnowledge: ['Razones d/D y h/D.', 'Completitud e ILS.', 'Orígenes de cráteres.'],
        materials: ['Proyector', 'Hojas de argumentación'],
        explanation:
          'Lo esencial: tres pares comparan proporciones ([[s elegante craters]], [[s pinacate craters]], [[s cerro craters]]); dos no tienen el eje por diseño y su completitud baja ([[completeness laguna]], [[completeness cucapa]]). Error frecuente: interpretar el eje faltante como similitud 0 o como error de datos.',
        steps: [
          { title: 'Cinco filas', description: 'Muestre la escala con los cinco pares y pida que expliquen las filas rayadas.', minutes: 6 },
          { title: 'Tres pares', description: 'Analicen valores, métodos (d/D o h/D) y similitudes.', minutes: 12 },
          { title: 'Defiende o critica', description: 'Actividad de argumentación.', minutes: 15 },
          { title: 'Completitud', description: 'Relacione el eje faltante con la completitud del ILS.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de cuatro preguntas.', minutes: 7 },
        ],
        discussion: [
          '¿Debería el ILS penalizar a los pares sin este eje? ¿Por qué el backend no lo hace?',
          '¿Qué otra métrica permitiría comparar una sierra con el borde de un cráter?',
          '¿Cómo comunicarías una observación cualitativa, como el pozo de Marius Hills, junto a un índice numérico?',
        ],
        dataActivity: {
          title: 'Completitud por diseño',
          description:
            'Con las tarjetas de los cinco pares, los equipos anotan el ILS y la completitud de cada uno ([[ils laguna]] con [[completeness laguna]]; [[ils cucapa]] con [[completeness cucapa]]; los otros tres con 100 %). Discutan por qué el orden entre pares no es un ranking científico.',
          minutes: 10,
        },
        assessment: ['Revisar los párrafos de «Defiende o critica»: ¿usan datos y una ruptura del backend?', 'Pregunta escrita sobre la diferencia entre 0 y «sin dato comparable».'],
        outcomes: [
          'El grupo evalúa la similitud de forma.',
          'El grupo distingue forma y origen.',
          'El grupo explica la completitud por diseño.',
        ],
        alternative: {
          title: 'Mesa de tarjetas',
          description: 'Sin proyector: imprima una tarjeta por par con su eje 9 (o «sin dato comparable»); los equipos las clasifican y argumentan.',
          type: 'printable',
          materials: ['Tarjetas impresas'],
        },
        siteActivities: ['Observar la forma de los conos del Pinacate en una imagen satelital.', 'Comparar el perfil del domo de Cerro Prieto con su llanura.'],
      },
    },
  },
};
