import type { AxisCurriculumText } from '../types';

/** Eje 3 · Composición mineralógica. Concepto (secundaria) → medición (preparatoria) → análogos (preparatoria). */
export const mineralogyEs: AxisCurriculumText = {
  student: {
    tagline: 'Rocas oscuras, rocas claras',
    overview:
      'Las rocas guardan la historia de cómo se formó un lugar. Aprenderás la diferencia entre rocas félsicas, claras y ricas en sílice, y máficas, oscuras y ricas en hierro y magnesio, como el basalto de los mares lunares.\n\nTambién verás cómo los satélites estiman la composición sin tocar el suelo, y por qué este eje tiene limitaciones conocidas que conviene entender antes de sacar conclusiones.',
  },
  teacher: {
    tagline: 'Composición: el eje que más pesa junto con la pendiente',
    overview:
      'Se trabaja la escala félsico–máfico, la estimación de la composición con emisividad térmica desde órbita y su aplicación a Pinacate ↔ Marius Hills, Cerro Prieto ↔ Gruithuisen y El Elegante ↔ Linné. Es un eje con artefactos documentados: el módulo los usa como caso de pensamiento crítico.',
    objectives: [
      'Clasificar rocas como félsicas o máficas según su composición.',
      'Explicar cómo se estima la composición con sensores infrarrojos desde órbita.',
      'Analizar cómo los artefactos de medición pueden producir similitudes engañosas.',
    ],
  },
  submodules: {
    concept: {
      summary: 'Félsico o máfico: qué nos dice el color y la composición de una roca volcánica.',
      student: {
        introduction:
          'Si miras la Luna llena verás manchas oscuras y zonas claras. Las manchas oscuras son basalto, una roca volcánica. Las zonas claras son otra roca, la anortosita. Esa diferencia de color revela una diferencia de composición.',
        blocks: [
          {
            id: 'escala',
            title: 'De félsico a máfico',
            body: 'Los geólogos ordenan las rocas volcánicas según su composición. Las félsicas, como el granito o la dacita, tienen mucha sílice y feldespato, y suelen ser claras. Las máficas, como el basalto, tienen más hierro y magnesio, y suelen ser oscuras.\n\nEste eje usa una escala de 0 (félsico) a 1 (máfico).',
            visual: 'felsic-mafic',
          },
          {
            id: 'pinacate',
            title: 'El Pinacate: basalto en Sonora',
            body: 'El escudo del Pinacate se formó con muchas erupciones de lava basáltica. Su valor en la escala es [[earth pinacate mineralogy]]: máfico. Marius Hills, en Oceanus Procellarum, también es un campo volcánico basáltico: [[moon pinacate mineralogy]].\n\nLa similitud es [[s pinacate mineralogy]], una de las más altas de este eje.',
            imageId: 'genesis-rock',
          },
          {
            id: 'tierras-altas',
            title: 'Lo que no hay en la región',
            body: 'Las tierras altas lunares están hechas de anortosita, una roca clara formada cuando la Luna era joven y estaba cubierta por un océano de magma. En Baja California y Sonora no hay afloramientos de anortosita, así que ningún par de la región representa las tierras altas.',
          },
        ],
        concepts: [
          { term: 'Roca félsica', definition: 'Roca rica en sílice y feldespato, generalmente clara; por ejemplo, el granito y la dacita.' },
          { term: 'Roca máfica', definition: 'Roca rica en hierro y magnesio, generalmente oscura; el basalto es el ejemplo más común.' },
          { term: 'Basalto', definition: 'Roca volcánica oscura que forma los mares lunares y muchos campos volcánicos de la Tierra.' },
          { term: 'Anortosita', definition: 'Roca clara rica en feldespato que forma las tierras altas de la Luna.' },
        ],
        earth: 'El Pinacate es un escudo de lava basáltica en Sonora. En la escala félsica–máfica tiene [[earth pinacate mineralogy]].',
        moon: 'Marius Hills es un grupo de domos y conos volcánicos sobre basaltos de Oceanus Procellarum. Tiene [[moon pinacate mineralogy]].',
        comparisonLead: 'Las dos marcas quedan del lado máfico de la escala: los dos sitios son basálticos.',
        facts: [
          'Las rocas que trajo el Apolo 15 incluyen la «roca Génesis», un trozo de anortosita de más de 4 000 millones de años.',
          'Los mares lunares se ven oscuros a simple vista desde la Tierra porque son basalto.',
          'Junto con la pendiente, este eje tiene el peso más alto en la exactitud: [[weight mineralogy]].',
        ],
        activities: [
          {
            title: 'Ordena tus rocas',
            description:
              'Reúne rocas de tu entorno o fotografías de rocas. Ordénalas de la más clara a la más oscura. Investiga cuáles podrían ser basalto y explica en qué se parecen a los mares lunares.',
            type: 'observation',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué tipo de roca forma los mares oscuros de la Luna?',
            options: ['Granito', 'Basalto', 'Anortosita'],
            answer: 1,
            explanation: 'Los mares lunares son coladas de basalto, una roca máfica y oscura.',
          },
          {
            question: 'En la escala de este eje, ¿qué significa un valor cercano a 1?',
            options: ['Roca muy félsica', 'Roca muy máfica', 'Que no hay datos'],
            answer: 1,
            explanation: '0 es félsico y 1 es máfico.',
          },
          {
            question: '¿Por qué ningún par de la región representa las tierras altas lunares?',
            options: ['Porque en la región no hay anortosita', 'Porque las tierras altas son de basalto', 'Porque no se pueden fotografiar'],
            answer: 0,
            explanation: 'Las tierras altas son de anortosita, una roca que no aflora en Baja California ni en Sonora.',
          },
        ],
        conclusion:
          'La composición de las rocas cuenta la historia volcánica de un lugar. El Pinacate y Marius Hills son basálticos, y por eso se parecen en este eje. Pero no todo en la Luna tiene equivalente en nuestra región: las tierras altas son un ejemplo.',
      },
      teacher: {
        objectives: [
          'Distinguir rocas félsicas y máficas por su composición y color.',
          'Ubicar sitios reales en la escala félsica–máfica.',
          'Reconocer que la región no tiene análogo de las tierras altas lunares.',
        ],
        priorKnowledge: ['Qué es un volcán y qué es la lava.', 'Noción de mineral y de roca.'],
        materials: ['Muestras o fotografías de basalto, granito y piedra pómez', 'Lupa', 'Hojas de registro'],
        explanation:
          'Lo esencial: la composición de los silicatos va de félsica a máfica; el color es una pista, no una prueba. El Pinacate y Marius Hills quedan del lado máfico. Error frecuente: concluir la composición solo por el color; una roca félsica puede verse oscura si está alterada o húmeda.',
        steps: [
          { title: 'Luna llena', description: 'Proyecte una foto de la Luna llena y pregunte por qué hay manchas oscuras y claras.', minutes: 6 },
          { title: 'La escala', description: 'Explique félsico y máfico con la figura y con muestras.', minutes: 12 },
          { title: 'Ordena tus rocas', description: 'Los equipos ordenan y describen sus muestras o fotos.', minutes: 15 },
          { title: 'Pinacate y Marius Hills', description: 'Ubiquen [[earth pinacate mineralogy]] y [[moon pinacate mineralogy]] en la escala.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación y conclusión sobre las tierras altas.', minutes: 7 },
        ],
        discussion: [
          '¿Por qué el color no basta para saber la composición de una roca?',
          '¿Qué ventaja tiene estudiar basaltos del Pinacate para entender los mares lunares?',
          '¿Qué sitio de la Tierra buscarías para estudiar anortosita?',
        ],
        dataActivity: {
          title: 'Ubicar en la escala',
          description: 'Con una regla de 0 a 1 en el pizarrón, los alumnos colocan El Pinacate ([[earth pinacate mineralogy]]) y Marius Hills ([[moon pinacate mineralogy]]) y estiman qué tan cerca quedan.',
          minutes: 8,
        },
        assessment: ['Clasificar cuatro fotografías de rocas como félsicas o máficas y justificar.', 'Explicar por escrito por qué el Pinacate es un buen análogo de un campo volcánico lunar.'],
        outcomes: ['El grupo distingue rocas félsicas y máficas.', 'El grupo ubica dos sitios reales en la escala.', 'El grupo reconoce un límite de la analogía regional.'],
        alternative: {
          title: 'Tarjetas de rocas',
          description: 'Sin muestras: imprima fotos de basalto, granito, dacita y anortosita con su composición; los alumnos las ordenan en la escala.',
          type: 'printable',
          materials: ['Tarjetas impresas'],
        },
        siteActivities: ['Observar el color oscuro de las coladas del Pinacate en fotos satelitales.', 'Comparar con la superficie más clara de la Sierra Cucapá (granito).'],
      },
    },

    measurement: {
      summary: 'Emisividad, Christiansen Feature y anclas: cómo se lleva la composición a una escala común, y dónde falla.',
      student: {
        introduction:
          'Ningún satélite toma muestras de roca. Para estimar la composición se mide cómo emite cada superficie en el infrarrojo térmico. En la Tierra se usa MODIS; en la Luna, Diviner. Llevar dos instrumentos distintos a una misma escala exige anclas, y esas anclas tienen consecuencias.',
        blocks: [
          {
            id: 'tierra',
            title: 'En la Tierra: emisividad de MODIS',
            body: 'Los silicatos emiten distinto según su composición. MODIS mide la emisividad en varias bandas; el equipo usa la razón entre la banda 29 (cerca de 8.5 µm) y la 31 (cerca de 11 µm). En El Pinacate esa razón es [[rawE pinacate mineralogy]].\n\nEl producto previsto era ASTER GED AG100, pero requiere cuenta de NASA Earthdata; MODIS MOD21 es el sustituto declarado en la fuente del dato.',
          },
          {
            id: 'luna',
            title: 'En la Luna: la Christiansen Feature',
            body: 'Diviner mide la posición de la Christiansen Feature: la longitud de onda, alrededor de 8 µm, donde la emisividad del suelo es máxima. Los materiales félsicos la tienen en longitudes más cortas y los máficos en más largas. En Marius Hills está en [[rawM pinacate mineralogy]].',
          },
          {
            id: 'anclas',
            title: 'Anclas: dos instrumentos, una escala',
            body: 'Cada instrumento se convierte a la escala 0–1 con dos lugares de referencia de su propio cuerpo: un ancla claramente félsica (0) y una claramente máfica (1). Así El Pinacate queda en [[earth pinacate mineralogy]] y Marius Hills en [[moon pinacate mineralogy]].\n\nLa escala es absoluta en sus extremos, pero lo que hay entre las anclas depende de qué tan bien responde cada indicador a la composición real.',
            visual: 'felsic-mafic',
          },
          {
            id: 'artefactos',
            title: 'Dos artefactos conocidos',
            body: 'Linné aparece como félsico ([[moon elegante mineralogy]]) aunque está sobre el basalto de Mare Serenitatis. Su Christiansen Feature ([[rawM elegante mineralogy]]) baja porque la eyecta del cráter es fresca e inmadura, no por su composición. Por eso El Elegante ↔ Linné da [[s elegante mineralogy]] en este eje.\n\nEn la Tierra, el índice responde sobre todo al cuarzo: el granito y la dacita quedan cerca del basalto y las arcillas pueden parecer máficas. Por eso el eje tiene confianza [[conf mineralogy]] y una insignia de «dato con limitaciones conocidas».',
          },
        ],
        concepts: [
          { term: 'Emisividad', definition: 'Eficiencia con la que una superficie emite radiación térmica en una longitud de onda, comparada con un cuerpo negro.' },
          { term: 'Christiansen Feature (CF)', definition: 'Longitud de onda donde la emisividad de un silicato es máxima; su posición depende de la composición.' },
          { term: 'Anclas de calibración', definition: 'Sitios de referencia félsico y máfico que fijan el 0 y el 1 de la escala para cada instrumento.' },
          { term: 'Artefacto', definition: 'Resultado de la medición que no refleja la propiedad que se quiere medir, sino otro efecto.' },
        ],
        earth: 'MODIS MOD21A2/MYD21A2, razón de emisividad ε29/ε31. Pinacate: [[rawE pinacate mineralogy]] → [[earth pinacate mineralogy]]. El Elegante: [[rawE elegante mineralogy]] → [[earth elegante mineralogy]].',
        moon: 'Diviner, posición de la Christiansen Feature. Marius Hills: [[rawM pinacate mineralogy]] → [[moon pinacate mineralogy]]. Linné: [[rawM elegante mineralogy]] → [[moon elegante mineralogy]].',
        comparisonLead: 'Abre «Fuente y método» en cada par: verás el valor crudo, las anclas y las advertencias. Compara un par con similitud alta y otro con similitud 0.',
        facts: [
          'Diviner es el radiómetro de la sonda LRO; mide la temperatura y la emisión térmica de la Luna en nueve canales.',
          'La «inmadurez» de un suelo lunar indica que lleva poco tiempo expuesto al espacio: el viento solar y los micrometeoritos aún no lo han oscurecido.',
          'El peso de este eje es [[weight mineralogy]]: un artefacto aquí mueve mucho la exactitud.',
        ],
        activities: [
          {
            title: 'Anclas en el aula',
            description:
              'Elijan dos objetos de referencia (uno muy claro y uno muy oscuro) y asígnenles 0 y 1. Ubiquen otros objetos entre ellos con un medidor de luz del celular. Luego cambien las anclas y observen cómo cambian los valores de los mismos objetos.',
            type: 'calculation',
            minutes: 18,
          },
        ],
        quiz: [
          {
            question: '¿Qué mide Diviner para estimar la composición lunar?',
            options: ['El color visible', 'La posición de la Christiansen Feature', 'La gravedad', 'La rugosidad'],
            answer: 1,
            explanation: 'La CF se desplaza según la composición de los silicatos.',
          },
          {
            question: '¿Por qué Linné aparece como félsico?',
            options: [
              'Porque está hecho de granito',
              'Porque su eyecta fresca e inmadura desplaza la Christiansen Feature',
              'Porque Diviner no lo observó',
              'Porque está en las tierras altas',
            ],
            answer: 1,
            explanation: 'Es un artefacto de madurez del suelo, no de composición: Linné está sobre basalto.',
          },
          {
            question: '¿Qué función cumplen las anclas de calibración?',
            options: ['Fijar el 0 y el 1 de la escala para cada instrumento', 'Medir la temperatura', 'Corregir las nubes', 'Elegir el área de análisis'],
            answer: 0,
            explanation: 'Con dos referencias por cuerpo, cada indicador se lleva a la misma escala 0–1.',
          },
          {
            question: 'El Elegante ↔ Linné da [[s elegante mineralogy]] en mineralogía. ¿Qué conclusión es correcta?',
            options: [
              'Los dos sitios tienen composiciones opuestas',
              'La similitud está afectada por un artefacto conocido y no debe leerse como diferencia real de composición',
              'El backend calculó mal la exactitud',
              'El Elegante no es basáltico',
            ],
            answer: 1,
            explanation: 'Los dos tienen basalto; la diferencia viene del efecto de la eyecta fresca de Linné.',
          },
        ],
        conclusion:
          'Llevar dos instrumentos a una escala común es posible, pero cada paso agrega supuestos. Este eje muestra que un número puede ser correcto como medición y engañoso como interpretación. Revisar el método y las advertencias es parte de leer bien los datos.',
      },
      teacher: {
        objectives: [
          'Explicar la emisividad térmica y la Christiansen Feature como indicadores de composición.',
          'Describir la calibración con anclas y sus supuestos.',
          'Analizar dos artefactos documentados y su efecto en la similitud.',
        ],
        priorKnowledge: ['Espectro electromagnético e infrarrojo.', 'Concepto de calibración.', 'Escala félsico–máfico.'],
        materials: ['Celulares con app de luxómetro (opcional)', 'Objetos claros y oscuros', 'Proyector'],
        explanation:
          'Lo esencial: la composición se infiere de la emisión térmica; cada instrumento se calibra con anclas propias. Dos artefactos (inmadurez de Linné y sensibilidad al cuarzo en la Tierra) hacen que este eje tenga limitaciones conocidas. Error frecuente: tratar la similitud como una medida directa de composición.',
        steps: [
          { title: 'Pregunta', description: '¿Cómo sabría la composición de una roca a 400 000 km sin tocarla?', minutes: 5 },
          { title: 'Dos instrumentos', description: 'Explique MODIS (ε29/ε31) y Diviner (CF) con los valores crudos del par Pinacate ↔ Marius Hills.', minutes: 12 },
          { title: 'Anclas en el aula', description: 'Actividad práctica de calibración con dos referencias.', minutes: 15 },
          { title: 'Artefactos', description: 'Analicen El Elegante ↔ Linné ([[s elegante mineralogy]]) y la advertencia del cuarzo.', minutes: 12 },
          { title: 'Cierre', description: 'Comprobación de cuatro preguntas.', minutes: 6 },
        ],
        discussion: [
          '¿Qué cambiaría si se usara ASTER GED en lugar de MODIS?',
          '¿Cómo podría corregirse el efecto de la eyecta fresca de Linné?',
          '¿Un valor con «limitaciones conocidas» debe quitarse del cálculo de la exactitud o mostrarse con su advertencia?',
        ],
        dataActivity: {
          title: 'Crudo, anclas y escala',
          description:
            'Con «Fuente y método» abierto, los equipos registran para Pinacate y para Linné el valor crudo, las anclas y el valor normalizado. Expliquen por qué Pinacate ↔ Marius Hills da [[s pinacate mineralogy]] y El Elegante ↔ Linné [[s elegante mineralogy]].',
          minutes: 12,
        },
        assessment: [
          'Informe breve: describir un artefacto y proponer cómo detectarlo.',
          'Pregunta abierta: ¿qué significa la confianza B en este eje?',
        ],
        outcomes: [
          'El grupo explica la base física de la medición.',
          'El grupo describe la calibración con anclas.',
          'El grupo identifica y explica un artefacto de medición.',
        ],
        alternative: {
          title: 'Escala de grises',
          description: 'Sin celulares: use una tira de grises impresa como escala y dos anclas; los alumnos ubican muestras de papel de colores y discuten cómo cambian al cambiar las anclas.',
          type: 'experiment',
          materials: ['Tira de grises impresa', 'Papeles de colores'],
        },
        siteActivities: ['Comparar coladas recientes y antiguas del Pinacate en fotos: el intemperismo cambia la superficie.', 'Discutir qué ancla terrestre usarías para un sitio félsico.'],
      },
    },

    analogs: {
      summary: 'Pinacate, Cerro Prieto y El Elegante: un acierto, un caso dudoso y un artefacto.',
      student: {
        introduction:
          'Tres pares, tres historias. Uno se parece de verdad en composición; otro parece distinto por cómo responde el instrumento; y otro da una similitud de cero por un artefacto. Tu tarea es distinguir cuál es cuál con los datos y las advertencias.',
        blocks: [
          {
            id: 'acierto',
            title: 'Un acierto: Pinacate ↔ Marius Hills',
            body: 'Los dos son campos volcánicos basálticos. El Pinacate tiene [[earth pinacate mineralogy]] y Marius Hills [[moon pinacate mineralogy]]: similitud de [[s pinacate mineralogy]]. Aquí la geología y la medición coinciden.',
            visual: 'felsic-mafic',
          },
          {
            id: 'dudoso',
            title: 'Un caso dudoso: Cerro Prieto ↔ Gruithuisen',
            body: 'Los dos son domos de lava viscosa y rica en sílice. Uno esperaría que quedaran juntos en la escala. Sin embargo, Cerro Prieto aparece en [[earth cerro mineralogy]] y Gruithuisen en [[moon cerro mineralogy]]: similitud de [[s cerro mineralogy]].\n\nEl índice terrestre responde sobre todo al cuarzo; una dacita con poco cuarzo libre queda cerca del basalto. El propio backend advierte que hace falta calibrar mejor los indicadores antes de comparar el volcanismo silícico.',
            imageId: 'gruithuisen-apollo15',
          },
          {
            id: 'artefacto',
            title: 'Un artefacto: El Elegante ↔ Linné',
            body: 'El Elegante es máfico ([[earth elegante mineralogy]]) y Linné aparece félsico ([[moon elegante mineralogy]]). La similitud es [[s elegante mineralogy]]. Pero Linné está sobre basalto: su valor bajo viene de la eyecta fresca del cráter.\n\nCon un peso de [[weight mineralogy]], este artefacto baja la exactitud del par, que queda en [[ils elegante]]. Leer la exactitud sin la advertencia llevaría a una conclusión falsa.',
            imageId: 'linne-lro',
          },
        ],
        concepts: [
          { term: 'Volcanismo silícico', definition: 'Erupciones de lava rica en sílice, viscosa, que forma domos empinados.' },
          { term: 'Eyecta', definition: 'Material lanzado por un impacto que cubre el cráter y sus alrededores.' },
          { term: 'Validez', definition: 'Grado en que una medición representa de verdad la propiedad que se quiere medir.' },
          { term: 'Peso del eje', definition: 'Cuánto cuenta un eje en el promedio de la exactitud; mineralogía pesa [[weight mineralogy]].' },
        ],
        earth: 'Tres sitios: el escudo basáltico del Pinacate ([[earth pinacate mineralogy]]), el domo de dacita de Cerro Prieto ([[earth cerro mineralogy]]) y el maar de El Elegante ([[earth elegante mineralogy]]).',
        moon: 'Tres sitios: Marius Hills ([[moon pinacate mineralogy]]), los domos de Gruithuisen ([[moon cerro mineralogy]]) y el cráter Linné ([[moon elegante mineralogy]]).',
        comparisonLead: 'Revisa las advertencias de cada par antes de interpretar su similitud. ¿Cuál de las tres similitudes refleja mejor la geología?',
        facts: [
          'Los domos de Gruithuisen son uno de los pocos lugares de la Luna con volcanismo silícico, y por eso son objetivo de futuras misiones.',
          'El Elegante se formó hace unos [[fact elegante earth age_ka]] mil años, cuando el magma encontró agua subterránea.',
          'Pinacate ↔ Marius Hills tiene una exactitud de [[ils pinacate]]; El Elegante ↔ Linné, de [[ils elegante]].',
        ],
        activities: [
          {
            title: 'Juicio de evidencia',
            description:
              'Para cada par, clasifica la similitud en «refleja la geología», «dudosa» o «artefacto». Escribe qué dato o advertencia usaste para decidir y qué medición adicional pedirías.',
            type: 'reflection',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿En qué par la similitud de composición refleja mejor la geología?',
            options: ['Pinacate ↔ Marius Hills', 'Cerro Prieto ↔ Gruithuisen', 'El Elegante ↔ Linné', 'En ninguno'],
            answer: 0,
            explanation: 'Los dos son basálticos y la medición lo confirma: [[s pinacate mineralogy]].',
          },
          {
            question: '¿Por qué la dacita de Cerro Prieto queda cerca del lado máfico?',
            options: ['Porque es basalto', 'Porque el índice terrestre responde sobre todo al cuarzo', 'Porque Diviner la midió', 'Porque está húmeda'],
            answer: 1,
            explanation: 'Una roca silícica con poco cuarzo libre puede parecer máfica con ese índice.',
          },
          {
            question: '¿Cómo afecta el artefacto de Linné a la exactitud del par?',
            options: ['No la afecta', 'La baja, porque el eje de mineralogía pesa [[weight mineralogy]]', 'La sube', 'Hace que el par no tenga exactitud'],
            answer: 1,
            explanation: 'Una similitud de [[s elegante mineralogy]] en un eje de peso alto reduce el promedio ponderado.',
          },
          {
            question: '¿Qué hace un buen análisis ante un dato con limitaciones conocidas?',
            options: ['Lo oculta', 'Lo cambia por otro valor', 'Lo muestra con su advertencia y lo interpreta con cuidado', 'Lo cuenta como 0'],
            answer: 2,
            explanation: 'El backend conserva el dato y documenta la limitación; la interpretación debe tomarla en cuenta.',
          },
        ],
        conclusion:
          'Un índice resume, pero no explica. En mineralogía, la misma operación da un acierto, un caso dudoso y un artefacto. La diferencia está en la geología de cada sitio y en las limitaciones de cada instrumento, y solo se ve si se leen las advertencias.',
      },
      teacher: {
        objectives: [
          'Evaluar la validez de la similitud de composición en tres pares.',
          'Explicar el efecto de un artefacto en un eje de peso alto sobre la exactitud.',
          'Argumentar con evidencia y advertencias del backend.',
        ],
        priorKnowledge: ['Escala félsico–máfico.', 'Funcionamiento de MODIS y Diviner (submódulo anterior).', 'Promedio ponderado.'],
        materials: ['Proyector', 'Hoja de «juicio de evidencia»'],
        explanation:
          'Lo esencial: Pinacate ↔ Marius Hills ([[s pinacate mineralogy]]) es una coincidencia real; Cerro Prieto ↔ Gruithuisen ([[s cerro mineralogy]]) es dudosa por la respuesta al cuarzo; El Elegante ↔ Linné ([[s elegante mineralogy]]) es un artefacto. Error frecuente: «corregir» el dato a mano; el dato se conserva y se interpreta con su advertencia.',
        steps: [
          { title: 'Planteamiento', description: 'Presente las tres similitudes sin contexto y pida predicciones.', minutes: 6 },
          { title: 'Contexto geológico', description: 'Describa cada par: basalto, dacita y maar contra cráter de impacto.', minutes: 12 },
          { title: 'Juicio de evidencia', description: 'Los equipos clasifican cada similitud y la justifican.', minutes: 15 },
          { title: 'Efecto en la exactitud', description: 'Analicen cómo el peso del eje ([[weight mineralogy]]) traslada el artefacto a la exactitud.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de cuatro preguntas.', minutes: 7 },
        ],
        discussion: [
          '¿Debería un índice excluir un eje con un artefacto conocido? ¿Qué se gana y qué se pierde?',
          '¿Qué medición adicional ayudaría a comparar mejor Cerro Prieto y Gruithuisen?',
          '¿Cómo comunicarías a un público general que un dato es correcto pero engañoso?',
        ],
        dataActivity: {
          title: 'Peso y artefacto',
          description:
            'Con la gráfica de barras de El Elegante ↔ Linné, identifiquen el eje con barra en 0 y su grosor (peso). Expliquen con palabras por qué ese eje influye más en la exactitud ([[ils elegante]]) que, por ejemplo, la aridez, que pesa [[weight aridity]].',
          minutes: 12,
        },
        assessment: [
          'Revisar la hoja de juicio de evidencia: ¿cita valores y advertencias?',
          'Ensayo corto: «Un número correcto puede ser engañoso». Use un ejemplo del eje.',
        ],
        outcomes: [
          'El grupo distingue coincidencia real, caso dudoso y artefacto.',
          'El grupo explica el efecto del peso de un eje en la exactitud.',
          'El grupo argumenta con evidencia y limitaciones.',
        ],
        alternative: {
          title: 'Debate con tarjetas',
          description: 'Imprima las tres similitudes y sus advertencias en tarjetas; dos equipos debaten si cada una debe usarse para comparar los sitios.',
          type: 'exercise',
          materials: ['Tarjetas impresas'],
        },
        siteActivities: ['Observar las paredes de El Elegante, donde afloran capas de basalto.', 'Comparar el color del domo de Cerro Prieto con el de las coladas del Pinacate.'],
      },
    },
  },
};
