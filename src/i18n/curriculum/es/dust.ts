import type { AxisCurriculumText } from '../types';

/** Eje 8 · Polvo y regolito fino. Concepto (primaria) → medición (secundaria) → análogos (secundaria). */
export const dustEs: AxisCurriculumText = {
  student: {
    tagline: 'Un polvo que se pega a todo',
    overview:
      'Las huellas de los astronautas en la Luna se conservan porque el suelo lunar es un polvo muy fino. Ese polvo, llamado regolito, raspa, se pega a los trajes y se mete en los equipos.\n\nAprenderás qué tan fino es, cómo se estima cuánto polvo fino tiene un suelo de la Tierra y de la Luna, y por qué el viento y los impactos crean polvos parecidos pero de historias muy distintas.',
  },
  teacher: {
    tagline: 'Polvo: parecidos en cantidad, distintos en origen',
    overview:
      'Se presenta el regolito, la fracción de partículas menores a ~63 µm y sus fuentes de datos: SoilGrids (un modelo) en la Tierra y la granulometría de las muestras Apolo en la Luna. Se aplica a Laguna Salada ↔ Tranquillitatis, Sierra Cucapá ↔ Shackleton y Pinacate ↔ Marius Hills. Es el eje con similitudes más altas, y también uno de confianza baja.',
    objectives: [
      'Describir el regolito lunar y la fracción de polvo fino.',
      'Distinguir un dato modelado de una medición directa.',
      'Explicar por qué una similitud alta no implica el mismo proceso de formación.',
    ],
  },
  submodules: {
    concept: {
      summary: 'Qué es el regolito lunar y por qué las huellas del Apolo siguen ahí.',
      student: {
        introduction:
          'En 1969, Buzz Aldrin pisó la Luna y tomó una foto de su huella. Esa huella sigue ahí: en la Luna no hay viento ni lluvia que la borre. El suelo donde quedó marcada es un polvo muy fino.',
        blocks: [
          {
            id: 'huella',
            title: 'Una huella que dura',
            body: 'El suelo lunar se llama regolito. Se formó durante miles de millones de años por impactos de meteoritos que rompieron las rocas en pedacitos cada vez más pequeños.\n\nUna buena parte de esos pedacitos son tan finos como la harina.',
            imageId: 'bootprint',
          },
          {
            id: 'laguna',
            title: 'Polvo en la Laguna Salada',
            body: 'En la Laguna Salada también hay mucho polvo fino: el viento lo levanta en tolvaneras. Su fracción de polvo fino es [[earth laguna dust]] y la de Mare Tranquillitatis, [[moon laguna dust]]. ¡Casi iguales!',
            visual: 'grain-sizes',
          },
        ],
        concepts: [
          { term: 'Regolito', definition: 'Capa de polvo y fragmentos de roca que cubre la Luna.' },
          { term: 'Polvo fino', definition: 'Partículas más delgadas que un cabello, de menos de unos 63 micrómetros.' },
          { term: 'Micrómetro (µm)', definition: 'Una milésima de milímetro.' },
        ],
        earth: 'El suelo de la Laguna Salada tiene [[pct earth laguna dust]] de polvo fino. El viento lo mueve.',
        moon: 'El regolito de Mare Tranquillitatis tiene [[pct moon laguna dust]] de polvo fino. Lo formaron los impactos.',
        comparisonLead: 'Las dos marcas casi se tocan: en cantidad de polvo fino, estos dos lugares son muy parecidos.',
        facts: [
          'El polvo lunar se pegaba tanto a los trajes que los astronautas lo llevaban a la nave, y decían que olía a pólvora quemada.',
          'Un cabello humano mide unos 70 micrómetros de grosor.',
        ],
        activities: [
          {
            title: 'Huellas en harina',
            description:
              'Llena una charola con harina y otra con arena. Haz una huella con tu dedo en cada una. ¿En cuál se ve más clara la huella? ¿Por qué?',
            type: 'model',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Por qué siguen ahí las huellas de los astronautas en la Luna?',
            options: ['Porque no hay viento ni lluvia que las borre', 'Porque las pintaron', 'Porque la Luna es de hielo'],
            answer: 0,
            explanation: 'Sin viento ni lluvia, nada mueve el polvo.',
          },
          {
            question: '¿Qué formó el polvo lunar?',
            options: ['El viento', 'Los impactos de meteoritos', 'Los ríos'],
            answer: 1,
            explanation: 'En la Luna los impactos rompieron las rocas durante miles de millones de años.',
          },
        ],
        conclusion:
          'La Laguna Salada y Mare Tranquillitatis tienen casi la misma cantidad de polvo fino. Pero el de la laguna lo hizo el viento y el de la Luna los impactos. Se parecen en el resultado, no en la historia.',
      },
      teacher: {
        objectives: ['Describir el regolito lunar como un polvo fino.', 'Relacionar la ausencia de viento con huellas que perduran.'],
        priorKnowledge: ['Saber que los astronautas caminaron en la Luna.', 'Diferenciar arena y polvo.'],
        materials: ['Dos charolas', 'Harina', 'Arena', 'Lupa'],
        explanation:
          'Lo esencial: el regolito es polvo y fragmentos producidos por impactos; una gran parte es más fina que ~63 µm. La Laguna Salada tiene una fracción similar, pero hecha por el viento. Error frecuente: pensar que el polvo lunar es como la arena de playa; es mucho más fino y anguloso.',
        steps: [
          { title: 'La huella', description: 'Muestre la foto de la huella de Aldrin y pregunte por qué sigue ahí.', minutes: 5 },
          { title: 'Regolito', description: 'Explique cómo los impactos hicieron el polvo lunar.', minutes: 8 },
          { title: 'Huellas en harina', description: 'Actividad con las dos charolas y la lupa.', minutes: 15 },
          { title: 'Laguna y Luna', description: 'Comparen las fracciones de polvo fino en la escala.', minutes: 8 },
          { title: 'Cierre', description: 'Comprobación de dos preguntas.', minutes: 4 },
        ],
        discussion: ['¿Qué problemas podría causar el polvo a un astronauta?', '¿Has visto una tolvanera? ¿Qué mueve el polvo en la Tierra?'],
        dataActivity: {
          title: 'Cuadros de polvo',
          description: 'En una cuadrícula de 10 × 10, los niños colorean un cuadro por cada 1 % de polvo fino: [[pct earth laguna dust]] en la Laguna Salada y [[pct moon laguna dust]] en Mare Tranquillitatis.',
          minutes: 8,
        },
        assessment: ['Explicar con sus palabras por qué la huella en harina se ve mejor.', 'Dibujar la huella lunar y escribir qué la conserva.'],
        outcomes: ['El grupo describe el regolito.', 'El grupo explica por qué las huellas lunares duran.'],
        alternative: {
          title: 'Polvo de gis',
          description: 'Sin harina: froten gises sobre una hoja y comparen el polvo con granos de arena o azúcar.',
          type: 'experiment',
          materials: ['Gises', 'Hoja', 'Azúcar o arena'],
        },
        siteActivities: ['Observar el suelo del patio con lupa y separar «fino» de «grueso».', 'Buscar fotos de tolvaneras en el valle de Mexicali.'],
      },
    },

    measurement: {
      summary: 'Granulometría, modelos de suelo y muestras del Apolo: cómo se estima la fracción de polvo fino.',
      student: {
        introduction:
          'Para saber cuánto polvo fino tiene un suelo, lo ideal es tomar una muestra, tamizarla y pesar cada tamaño. En la Luna se hizo con las muestras que trajeron las misiones Apolo. En la Tierra, el equipo usa un modelo global de suelos. Son dos formas muy distintas de llegar a un número.',
        blocks: [
          {
            id: 'granulometria',
            title: 'Granulometría: separar por tamaños',
            body: 'La granulometría ordena las partículas por tamaño: arcilla (menos de 2 µm), limo (de 2 a 63 µm), arena (de 63 µm a 2 mm) y grava. Este eje cuenta la fracción menor a ~63 µm, es decir, limo y arcilla.',
            visual: 'grain-sizes',
          },
          {
            id: 'tierra',
            title: 'En la Tierra: SoilGrids, un modelo',
            body: 'SoilGrids 2.0 (ISRIC) estima la textura del suelo en todo el mundo a partir de miles de perfiles y de variables ambientales, con píxeles de 250 m. El eje usa los primeros 5 cm.\n\nEs un modelo, no una medición: estima suelo incluso sobre roca desnuda, como las sierras o las coladas de lava. En la Sierra Cucapá da [[earth cucapa dust]], aunque buena parte del área sea roca.',
          },
          {
            id: 'luna',
            title: 'En la Luna: las muestras del Apolo',
            body: 'La granulometría lunar viene de las muestras de las misiones Apolo, recopiladas por Carrier (2003), con apoyo de la abundancia de rocas de Diviner. Mare Tranquillitatis tiene [[moon laguna dust]] y el borde de Shackleton [[moon cucapa dust]].\n\nPor eso el eje tiene confianza [[conf dust]]: un lado es un modelo y el otro viene de pocas muestras.',
          },
        ],
        concepts: [
          { term: 'Granulometría', definition: 'Medición de la distribución de tamaños de las partículas de un suelo.' },
          { term: 'Limo y arcilla', definition: 'Partículas de menos de 63 µm y de menos de 2 µm; juntas forman la fracción fina.' },
          { term: 'Modelo de suelo', definition: 'Estimación estadística de propiedades del suelo en lugares sin muestreo directo.' },
          { term: 'Confianza C', definition: 'Estimación de contexto: datos modelados, escasos o clases gruesas.' },
        ],
        earth: 'SoilGrids 2.0, limo + arcilla en 0–5 cm, píxeles de 250 m. Laguna Salada: [[earth laguna dust]]; Sierra Cucapá: [[earth cucapa dust]].',
        moon: 'Granulometría de las muestras Apolo (Carrier, 2003). Mare Tranquillitatis: [[moon laguna dust]]; borde de Shackleton: [[moon cucapa dust]].',
        comparisonLead: 'Revisa la insignia de cada lado: «Medido» en la Tierra (de un modelo) y «Literatura» en la Luna. ¿Qué tan confiable te parece cada uno?',
        facts: [
          'Las misiones Apolo trajeron a la Tierra unos 382 kg de rocas y suelo lunar.',
          'El polvo lunar es anguloso porque no hay agua ni viento que redondee los granos.',
          'La tolerancia de este eje es R = [[R dust]]: toda la escala de 0 a 1.',
        ],
        activities: [
          {
            title: 'Tamiza un suelo',
            description:
              'Pasa una muestra de tierra por coladores de distinta abertura (uno grueso y uno de tela fina). Pesa o compara el volumen de cada parte. Estima qué fracción es «fina» y compárala con los valores del eje.',
            type: 'calculation',
            minutes: 20,
          },
        ],
        quiz: [
          {
            question: '¿Qué partículas cuenta este eje como «polvo fino»?',
            options: ['Grava', 'Arena', 'Limo y arcilla, de menos de ~63 µm', 'Rocas'],
            answer: 2,
            explanation: 'La fracción fina es la menor a unos 63 micrómetros.',
          },
          {
            question: '¿Qué limitación tiene el dato terrestre de SoilGrids?',
            options: ['Es un modelo que estima suelo incluso sobre roca desnuda', 'Se midió con Diviner', 'Solo existe para la Luna'],
            answer: 0,
            explanation: 'Por eso en la Sierra Cucapá da un valor de suelo aunque haya mucha roca.',
          },
          {
            question: '¿De dónde viene la granulometría lunar?',
            options: ['De un modelo de la NASA', 'De las muestras de las misiones Apolo', 'De fotos'],
            answer: 1,
            explanation: 'Carrier (2003) reúne los análisis de las muestras Apolo.',
          },
        ],
        conclusion:
          'Un número puede venir de una medición, de un modelo o de una publicación. Este eje combina un modelo terrestre y datos de muestras lunares; por eso su confianza es baja, aunque sus similitudes sean altas.',
      },
      teacher: {
        objectives: [
          'Explicar la granulometría y la fracción fina.',
          'Distinguir un dato modelado de uno medido o publicado.',
          'Relacionar la fuente del dato con la confianza del eje.',
        ],
        priorKnowledge: ['Unidades de longitud y prefijos (mili, micro).', 'Fracciones y porcentajes.'],
        materials: ['Muestras de tierra', 'Coladores grueso y fino', 'Báscula de cocina o vasos medidores', 'Periódico'],
        explanation:
          'Lo esencial: la fracción fina es limo + arcilla (< ~63 µm). En la Tierra viene de SoilGrids (modelo, 250 m) y en la Luna de las muestras Apolo. Error frecuente: tomar el valor de SoilGrids como medición sobre el terreno; en la sierra estima un suelo que en buena parte no existe.',
        steps: [
          { title: 'Pregunta', description: '¿Cómo sabrías cuánto polvo fino tiene un suelo?', minutes: 5 },
          { title: 'Tamaños', description: 'Explique la escala granulométrica con la figura.', minutes: 10 },
          { title: 'Tamiza un suelo', description: 'Actividad práctica en equipos.', minutes: 18 },
          { title: 'Fuentes', description: 'Compare SoilGrids y las muestras Apolo; revisen las insignias de estado.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 7 },
        ],
        discussion: [
          '¿Qué significa que un dato sea «medido» si viene de un modelo?',
          '¿Por qué las muestras Apolo no representan toda la Luna?',
          '¿Qué medición mejoraría el dato de la Sierra Cucapá?',
        ],
        dataActivity: {
          title: 'Fuente y confianza',
          description:
            'Con «Fuente y método» abierto, los equipos anotan la fuente de cada lado para Laguna Salada ↔ Tranquillitatis y Cucapá ↔ Shackleton, y discuten por qué similitudes de [[s laguna dust]] y [[s cucapa dust]] tienen confianza [[conf dust]].',
          minutes: 10,
        },
        assessment: ['Revisar el registro de la actividad de tamizado.', 'Pregunta abierta: ¿por qué una similitud alta puede ser poco confiable?'],
        outcomes: ['El grupo explica la granulometría.', 'El grupo distingue modelo, medición y literatura.'],
        alternative: {
          title: 'Sedimentación en frasco',
          description: 'Agiten tierra con agua en un frasco y dejen reposar: se forman capas de arena, limo y arcilla. Estimen el grosor de cada capa.',
          type: 'experiment',
          materials: ['Frasco con tapa', 'Tierra', 'Agua', 'Regla'],
        },
        siteActivities: ['Tomar una muestra de suelo de la escuela para tamizarla.', 'Comparar el suelo de un jardín con el de un terreno baldío.'],
      },
    },

    analogs: {
      summary: 'Laguna, sierra y volcán: el eje con similitudes más altas y por qué conviene desconfiar un poco.',
      student: {
        introduction:
          'En el eje del polvo, los tres pares tienen similitudes altas. ¿Significa que los suelos de la región son como el regolito lunar? No del todo. Vamos a ver qué coincide y qué no.',
        blocks: [
          {
            id: 'tres',
            title: 'Tres pares muy parecidos',
            body: 'Laguna Salada ↔ Tranquillitatis: [[earth laguna dust]] y [[moon laguna dust]], similitud [[s laguna dust]]. Sierra Cucapá ↔ Shackleton: [[earth cucapa dust]] y [[moon cucapa dust]], similitud [[s cucapa dust]]. Pinacate ↔ Marius Hills: [[earth pinacate dust]] y [[moon pinacate dust]], similitud [[s pinacate dust]].',
            visual: 'grain-sizes',
          },
          {
            id: 'origen',
            title: 'Mismo tamaño, distinta historia',
            body: 'En la Laguna Salada el viento transporta y deposita el polvo; también hay arcillas que dejó el agua. En la Luna, el regolito lo hicieron los impactos y es anguloso y vidrioso.\n\nEl backend lo dice como ruptura de la analogía: en Laguna Salada el viento transporta polvo; en la Luna intervienen otros procesos, como los impactos.',
            imageId: 'aldrin',
          },
          {
            id: 'sierra',
            title: 'El caso de la sierra',
            body: 'La Sierra Cucapá tiene la similitud más alta, [[s cucapa dust]]. Pero su valor viene de SoilGrids, que estima suelo incluso sobre roca desnuda. En la sierra real, mucha superficie es roca.\n\nUna similitud alta con datos de confianza [[conf dust]] es una pista, no una conclusión.',
          },
        ],
        concepts: [
          { term: 'Proceso de formación', definition: 'Lo que creó un material: viento, agua, impactos, volcanes.' },
          { term: 'Regolito anguloso', definition: 'Granos con bordes afilados porque nada los ha redondeado.' },
          { term: 'Pista frente a conclusión', definition: 'Un dato que sugiere algo no basta para afirmarlo sin otras pruebas.' },
        ],
        earth: 'Tres suelos de la región, según SoilGrids: Laguna Salada ([[earth laguna dust]]), Sierra Cucapá ([[earth cucapa dust]]) y El Pinacate ([[earth pinacate dust]]).',
        moon: 'Tres regolitos lunares, según la literatura: Mare Tranquillitatis ([[moon laguna dust]]), borde de Shackleton ([[moon cucapa dust]]) y Marius Hills ([[moon pinacate dust]]).',
        comparisonLead: 'Todas las líneas son cortas. Ahora piensa: ¿qué tan confiable es cada lado?',
        facts: [
          'Los ingenieros que preparan misiones lunares fabrican «simulantes» de regolito con rocas volcánicas molidas.',
          'El polvo lunar puede cargarse eléctricamente con la luz del Sol y flotar un poco sobre la superficie.',
          'Este eje pesa [[weight dust]] en la exactitud: menos que la pendiente o la composición.',
        ],
        activities: [
          {
            title: '¿Simulante de regolito?',
            description:
              'Imagina que tienes que elegir un suelo de la región para probar un vehículo lunar. ¿Cuál de los tres sitios elegirías? Da una razón a favor y una en contra usando los datos y las advertencias.',
            type: 'reflection',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué par tiene la similitud más alta en polvo?',
            options: ['Laguna Salada ↔ Tranquillitatis', 'Sierra Cucapá ↔ Shackleton', 'Pinacate ↔ Marius Hills'],
            answer: 1,
            explanation: 'Su similitud es [[s cucapa dust]].',
          },
          {
            question: '¿Por qué hay que tener cuidado con el valor de la Sierra Cucapá?',
            options: ['Porque viene de un modelo que estima suelo sobre roca desnuda', 'Porque es lunar', 'Porque no tiene fuente'],
            answer: 0,
            explanation: 'SoilGrids no es una medición directa en la sierra.',
          },
          {
            question: '¿Qué diferencia hay entre el polvo de la laguna y el lunar?',
            options: ['Ninguna', 'El de la laguna lo mueve el viento; el lunar lo hicieron los impactos', 'El lunar es más grueso'],
            answer: 1,
            explanation: 'Pueden parecerse en tamaño, pero no en su origen.',
          },
        ],
        conclusion:
          'El polvo es el eje donde la región más se parece a la Luna en números. Pero el origen del polvo y la calidad de los datos importan. Un buen científico pregunta «¿de dónde viene este número?» antes de celebrar una similitud alta.',
      },
      teacher: {
        objectives: [
          'Interpretar similitudes altas con confianza baja.',
          'Distinguir el tamaño de partícula de su proceso de formación.',
          'Argumentar el uso de un suelo regional como simulante.',
        ],
        priorKnowledge: ['Fracción fina y granulometría.', 'Diferencia entre modelo y medición.'],
        materials: ['Proyector o tabla impresa', 'Fichas de argumentación'],
        explanation:
          'Lo esencial: los tres pares tienen similitudes altas ([[s laguna dust]], [[s cucapa dust]], [[s pinacate dust]]), pero la confianza es [[conf dust]] y los procesos son distintos. Error frecuente: concluir que el suelo de la región «es regolito lunar».',
        steps: [
          { title: 'Repaso', description: 'Recuerde la escala de tamaños y las fuentes de datos.', minutes: 5 },
          { title: 'Tres pares', description: 'Presente los valores y fotos.', minutes: 12 },
          { title: '¿Simulante de regolito?', description: 'Actividad de argumentación.', minutes: 15 },
          { title: 'Puesta en común', description: 'Discutan el caso de la sierra y el origen del polvo.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 8 },
        ],
        discussion: [
          '¿Una similitud alta con confianza baja vale más o menos que una similitud media con confianza alta?',
          '¿Qué propiedades del regolito no captura este eje?',
          '¿Cómo comprobarías en campo el dato de la Sierra Cucapá?',
        ],
        dataActivity: {
          title: 'Similitud y confianza',
          description: 'Los equipos hacen una tabla con la similitud y la confianza de cada par en este eje y en el de pendiente (confianza [[conf slope]]). Discutan cuál comparación es más sólida.',
          minutes: 10,
        },
        assessment: ['Revisar las fichas: ¿dan una razón a favor y una en contra con datos?', 'Pregunta abierta sobre tamaño frente a origen.'],
        outcomes: ['El grupo interpreta similitudes con su confianza.', 'El grupo distingue tamaño y proceso de formación.'],
        alternative: {
          title: 'Comparación con lupa',
          description: 'Comparen con lupa arena de río (redondeada) y polvo de roca molida (anguloso); relacione con el regolito.',
          type: 'experiment',
          materials: ['Arena de río', 'Roca molida o gis triturado', 'Lupa'],
        },
        siteActivities: ['Recoger polvo depositado por el viento en una ventana y observarlo con lupa.', 'Comparar el suelo de la laguna con el de la sierra en fotos.'],
      },
    },
  },
};
