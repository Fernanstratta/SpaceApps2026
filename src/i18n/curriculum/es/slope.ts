import type { AxisCurriculumText } from '../types';

/** Eje 1 · Pendiente. Concepto (primaria) → medición (secundaria) → análogos (secundaria). */
export const slopeEs: AxisCurriculumText = {
  student: {
    tagline: '¿Dónde es seguro aterrizar?',
    overview:
      'Una nave o un vehículo necesitan un suelo casi plano: en una ladera pueden resbalar o volcarse. En este tema aprenderás qué es la pendiente, cómo se mide desde el espacio y por qué la Laguna Salada se parece al lugar donde alunizó el Apolo 11.\n\nTambién verás un contraejemplo: la Sierra Cucapá y el borde del cráter Shackleton, dos lugares donde aterrizar es mucho más difícil.',
  },
  teacher: {
    tagline: 'Pendiente: el primer criterio para elegir un sitio de aterrizaje',
    overview:
      'Tres sesiones que van del concepto de pendiente a su medición con modelos digitales de elevación y a su uso para comparar sitios. Se trabaja con Laguna Salada ↔ Mare Tranquillitatis (terreno seguro), El Elegante ↔ Linné (interior de un cráter) y Sierra Cucapá ↔ borde de Shackleton (terreno de riesgo).',
    objectives: [
      'Definir la pendiente y relacionarla con la seguridad de un aterrizaje.',
      'Explicar cómo se calcula la pendiente a partir de un modelo de elevación y por qué depende de la resolución.',
      'Comparar sitios de Baja California y Sonora con sitios lunares usando la fracción de terreno casi plano.',
    ],
  },
  submodules: {
    concept: {
      summary: 'Qué es la pendiente y por qué una nave necesita un suelo casi plano.',
      student: {
        introduction:
          'Imagina que manejas una nave hacia un lugar que nadie ha pisado. Antes de bajar, necesitas saber algo muy importante: ¿el suelo está plano o inclinado? A esa inclinación se le llama pendiente.',
        blocks: [
          {
            id: 'que-es',
            title: '¿Qué es la pendiente?',
            body: 'La pendiente dice qué tan inclinado está el suelo. Se mide en grados: 0° es completamente plano y entre más grados, más empinado.\n\nMueve la rampa de abajo. Con menos de 10°, una nave puede posarse sin problema. Con más, podría resbalar o volcarse.',
            visual: 'slope-ramp',
          },
          {
            id: 'laguna',
            title: 'Un lugar muy plano en Baja California',
            body: 'La Laguna Salada es el fondo de un lago seco, cerca de Mexicali. Desde el espacio se ve como una gran mancha clara y lisa.\n\nEn la Luna, el Apolo 11 bajó en Mare Tranquillitatis, una planicie enorme. Los cuadros de abajo muestran cuánta parte de cada lugar es casi plana.',
            visual: 'slope-waffle',
          },
        ],
        concepts: [
          { term: 'Pendiente', definition: 'Qué tan inclinado está el suelo. Se mide en grados (°).' },
          { term: 'Casi plano', definition: 'Suelo con menos de 10° de pendiente: ahí una nave puede posarse.' },
          { term: 'Planicie', definition: 'Terreno grande y plano, como el fondo de un lago seco o un mar lunar.' },
        ],
        earth: 'La Laguna Salada es una playa seca. [[pct earth laguna slope]] de su área de análisis es casi plana.',
        moon: 'Mare Tranquillitatis es una planicie de lava antigua, donde alunizó el Apolo 11. [[pct moon laguna slope]] de su área es casi plana.',
        comparisonLead: 'Mira las dos marcas de la escala: si quedan muy juntas, los dos lugares son igual de planos.',
        facts: [
          'El Apolo 11 alunizó en Mare Tranquillitatis en julio de 1969. Se eligió porque era plano y con pocas rocas.',
          'Una rampa para sillas de ruedas tiene menos de 5°. Una de 10° ya se siente empinada al subirla caminando.',
        ],
        activities: [
          {
            title: 'Rampas de cartón',
            description:
              'Pon un carrito de juguete sobre un cartón. Levanta un lado poco a poco con libros. ¿A partir de qué altura rueda o se voltea? Dibuja tu rampa y escribe si una nave podría aterrizar ahí.',
            type: 'model',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué terreno es mejor para que aterrice una nave?',
            options: ['Una ladera empinada', 'Un suelo casi plano', 'Un campo lleno de rocas grandes'],
            answer: 1,
            explanation: 'En un suelo casi plano la nave no resbala ni se voltea.',
          },
          {
            question: 'La Laguna Salada tiene [[pct earth laguna slope]] de su área casi plana. ¿Qué quiere decir?',
            options: ['Que casi todo es plano', 'Que casi todo está inclinado', 'Que no se pudo medir'],
            answer: 0,
            explanation: 'Un valor cercano a 100 % significa que casi todo el lugar tiene menos de 10° de pendiente.',
          },
        ],
        conclusion:
          'La pendiente nos dice si un lugar es seguro para aterrizar. La Laguna Salada y Mare Tranquillitatis son casi planas, por eso se parecen mucho en este eje. Pero ojo: parecerse en la pendiente no significa que sean iguales en todo.',
      },
      teacher: {
        objectives: [
          'Reconocer la pendiente como la inclinación del suelo.',
          'Relacionar una pendiente pequeña con un aterrizaje seguro.',
          'Leer en una escala sencilla si dos lugares son igual de planos.',
        ],
        priorKnowledge: ['Saber que la Luna es un lugar que visitaron astronautas.', 'Distinguir entre algo plano y algo inclinado.'],
        materials: ['Cartón rígido o tabla', 'Carrito de juguete', 'Libros o bloques', 'Hojas y colores'],
        explanation:
          'Lo esencial: la pendiente es la inclinación del suelo y se mide en grados. El eje cuenta qué parte del terreno tiene menos de 10° (la «fracción casi plana»). Error frecuente: pensar que un lugar «alto» es un lugar inclinado; una meseta puede estar alta y ser plana.',
        steps: [
          { title: 'Pregunta inicial', description: 'Pregunte: «Si fueras piloto, ¿dónde bajarías tu nave?». Anote las ideas en el pizarrón.', minutes: 5 },
          { title: 'La rampa', description: 'Use la figura de la rampa o un cartón para mostrar qué pasa al aumentar los grados.', minutes: 8 },
          { title: 'Rampas de cartón', description: 'En equipos, hagan la actividad del carrito y registren la altura a la que rueda.', minutes: 15 },
          {
            title: 'Dos lugares planos',
            description: 'Muestre los cuadros de Laguna Salada y Mare Tranquillitatis: [[pct earth laguna slope]] y [[pct moon laguna slope]] casi planos.',
            minutes: 8,
          },
          { title: 'Cierre', description: 'Respondan juntos la comprobación de dos preguntas.', minutes: 4 },
        ],
        discussion: ['¿Por qué el Apolo 11 eligió una planicie para alunizar?', '¿Qué le pasaría a una nave en una ladera?', '¿Conoces algún lugar muy plano cerca de tu casa?'],
        dataActivity: {
          title: 'Colorea los cuadros',
          description:
            'Entregue una cuadrícula de 10 × 10 por lugar. Los niños colorean de verde un cuadro por cada 1 % de terreno casi plano: [[pct earth laguna slope]] en Laguna Salada y [[pct moon laguna slope]] en Mare Tranquillitatis.',
          minutes: 10,
        },
        assessment: [
          'Observar si cada niño explica con sus palabras qué es la pendiente.',
          'Revisar el dibujo de la rampa: ¿indica si una nave podría aterrizar?',
        ],
        outcomes: ['El grupo explica qué es la pendiente con un ejemplo.', 'El grupo reconoce que la Laguna Salada y el sitio del Apolo 11 son casi planos.'],
        alternative: {
          title: 'Rampa con el cuerpo',
          description: 'Sin materiales: los niños inclinan el brazo como una rampa y un compañero desliza una goma. Comparan «poco inclinado» y «muy inclinado».',
          type: 'demonstration',
          materials: ['Una goma o tapa de botella'],
        },
        siteActivities: ['Buscar en un mapa satelital la mancha clara y lisa de la laguna.', 'Comparar fotos de la laguna con fotos del sitio del Apolo 11.'],
      },
    },

    measurement: {
      summary: 'Cómo se calcula la pendiente con modelos de elevación y por qué importa la resolución.',
      student: {
        introduction:
          'Nadie va a la Luna con un transportador para medir cada ladera. Entonces, ¿cómo sabemos qué tan inclinado es un lugar? La respuesta está en los modelos digitales de elevación: mapas donde cada punto guarda su altura.',
        blocks: [
          {
            id: 'dem',
            title: 'Un mapa de alturas',
            body: 'Un modelo digital de elevación (DEM) divide el terreno en una cuadrícula. Cada cuadro, o píxel, guarda la altura de ese lugar. En la Tierra se usa Copernicus DEM, con un dato cada 30 m. En la Luna se usan los modelos de la cámara LROC NAC y SLDEM2015.\n\nLa pendiente sale de comparar la altura de cada píxel con la de sus vecinos: si cambia mucho en poca distancia, el terreno está inclinado. Gira el modelo de El Elegante para ver un DEM real en 3D.',
            visual: 'terrain-3d',
          },
          {
            id: 'fraccion',
            title: 'De pendientes a una sola cifra',
            body: 'Con la pendiente de cada píxel, el equipo cuenta cuántos tienen menos de 10°. Esa fracción, de 0 a 1, es el valor del eje: 1 significa que todo es casi plano y 0 que todo está inclinado.\n\nEn El Elegante el valor es [[earth elegante slope]], porque el área incluye las paredes del cráter. En Linné es [[moon elegante slope]]: sus paredes son más empinadas en proporción.',
            visual: 'slope-waffle',
          },
          {
            id: 'escala',
            title: 'La misma resolución en los dos cuerpos',
            body: 'La pendiente depende del tamaño del píxel: un mapa muy detallado «ve» escalones y rocas, y da pendientes más fuertes que uno grueso. Por eso los dos sitios de un par siempre se comparan con la misma resolución: 30 m en casi todos los pares y 60 m en Laguna Salada ↔ Mare Tranquillitatis.',
          },
        ],
        concepts: [
          { term: 'Modelo digital de elevación (DEM)', definition: 'Cuadrícula en la que cada píxel guarda la altura del terreno.' },
          { term: 'Resolución', definition: 'Tamaño del terreno que representa cada píxel; con 30 m, cada píxel cubre un cuadro de 30 × 30 m.' },
          { term: 'Fracción casi plana (f_safe)', definition: 'Parte del área con pendiente menor a 10°; va de 0 a 1.' },
          { term: 'Tolerancia R', definition: 'Diferencia con la que la similitud del eje llega a 0. En pendiente es [[R slope]].' },
        ],
        earth: 'Se usa Copernicus DEM GLO-30, un modelo de elevación global hecho con radar desde satélite. El Elegante tiene una fracción casi plana de [[earth elegante slope]].',
        moon: 'Se usan los modelos de LROC NAC (2 a 4 m por píxel) o SLDEM2015 (unos 59 m), llevados a la misma malla que el dato terrestre. Linné tiene [[moon elegante slope]].',
        comparisonLead: 'Compara la longitud de cada línea: entre más corta, más parecidos son los sitios. La regla «R» muestra la diferencia con la que la similitud llega a 0.',
        facts: [
          'El modelo Copernicus DEM se hizo con los satélites de radar TanDEM-X, que volaron en formación para medir alturas.',
          'La cámara LROC NAC puede distinguir objetos de menos de un metro: en sus imágenes se ven las huellas del Apolo.',
          'Una similitud de [[s laguna slope]] en Laguna Salada ↔ Tranquillitatis es la más alta del eje de pendiente en los cinco pares.',
        ],
        activities: [
          {
            title: 'Tu propio mapa de alturas',
            description:
              'Haz una montaña con plastilina sobre una cuadrícula de 1 cm. Mide con una regla la altura en cada cruce y escríbela. Marca los cuadros donde la altura cambia más de 2 mm entre vecinos: esos son los «empinados».',
            type: 'model',
            minutes: 20,
          },
        ],
        quiz: [
          {
            question: '¿Qué guarda cada píxel de un modelo digital de elevación?',
            options: ['Su color', 'Su altura', 'Su temperatura', 'Su composición'],
            answer: 1,
            explanation: 'Un DEM es un mapa de alturas; la pendiente se calcula comparando alturas vecinas.',
          },
          {
            question: '¿Por qué los dos sitios de un par se comparan con la misma resolución?',
            options: [
              'Porque así los mapas pesan menos',
              'Porque la pendiente medida cambia con el tamaño del píxel',
              'Porque la Luna no tiene mapas detallados',
            ],
            answer: 1,
            explanation: 'Un píxel más pequeño ve escalones que uno grande no ve; usar la misma resolución hace justa la comparación.',
          },
          {
            question: 'El Elegante tiene una fracción casi plana de [[earth elegante slope]] y Linné de [[moon elegante slope]]. ¿Cuál tiene más terreno inclinado?',
            options: ['El Elegante', 'Linné', 'Los dos igual'],
            answer: 1,
            explanation: 'Una fracción casi plana menor significa más terreno con 10° o más.',
          },
        ],
        conclusion:
          'La pendiente se mide con mapas de alturas tomados desde satélites. Para comparar dos sitios con justicia, hay que usar la misma resolución en los dos. Ese cuidado es parte del método científico: medir igual para comparar igual.',
      },
      teacher: {
        objectives: [
          'Describir qué es un modelo digital de elevación y qué representa cada píxel.',
          'Explicar cómo se obtiene la fracción de terreno casi plano a partir de la pendiente de cada píxel.',
          'Justificar por qué la resolución debe ser la misma en los dos sitios.',
        ],
        priorKnowledge: ['Concepto de pendiente y grados.', 'Leer coordenadas en una cuadrícula.', 'Fracciones y porcentajes.'],
        materials: ['Plastilina', 'Hojas cuadriculadas de 1 cm', 'Reglas', 'Proyector para el modelo 3D (opcional)'],
        explanation:
          'Lo esencial: la pendiente de un píxel se calcula con la diferencia de altura entre vecinos dividida entre la distancia. El eje resume el área como la fracción de píxeles con menos de 10°. Error frecuente: comparar números de mapas con resolución distinta; un DEM más fino siempre da pendientes más fuertes.',
        steps: [
          { title: 'Problema', description: 'Plantee: «¿Cómo medirías la inclinación de un cráter sin ir ahí?». Recoja propuestas.', minutes: 5 },
          { title: 'El DEM', description: 'Muestre el modelo 3D de El Elegante y explique la cuadrícula de alturas.', minutes: 10 },
          { title: 'Mapa de plastilina', description: 'Los equipos hacen la actividad de la cuadrícula y marcan los cuadros empinados.', minutes: 18 },
          {
            title: 'Leer los datos',
            description: 'Comparen El Elegante ([[earth elegante slope]]) con Linné ([[moon elegante slope]]) y Laguna Salada con Tranquillitatis en la escala.',
            minutes: 10,
          },
          { title: 'Cierre', description: 'Comprobación de tres preguntas y discusión sobre la resolución.', minutes: 7 },
        ],
        discussion: [
          '¿Qué pasaría si midiéramos la Luna con píxeles de 2 m y la Tierra con píxeles de 30 m?',
          '¿Por qué el área de El Elegante tiene menos terreno plano que la Laguna Salada?',
          '¿Qué otras decisiones de método podrían cambiar el resultado?',
        ],
        dataActivity: {
          title: 'Del dato a la similitud',
          description:
            'Con la escala del eje, pida que midan la distancia entre las marcas de El Elegante y Linné y la comparen con la regla R ([[R slope]]). La similitud que calculó el backend es [[s elegante slope]]: ¿coincide con lo que esperaban al ver la escala?',
          minutes: 10,
        },
        assessment: [
          'Pedir que expliquen por escrito cómo se pasa de un mapa de alturas a una fracción casi plana.',
          'Valorar si identifican la resolución como condición para comparar.',
        ],
        outcomes: [
          'El grupo describe un DEM como una cuadrícula de alturas.',
          'El grupo explica que la fracción casi plana resume la pendiente de toda el área.',
          'El grupo reconoce que la resolución afecta la pendiente medida.',
        ],
        alternative: {
          title: 'Cuadrícula en papel',
          description: 'Sin plastilina: entregue un mapa de curvas de nivel impreso. Los equipos marcan los cuadros donde las curvas están muy juntas (terreno empinado).',
          type: 'printable',
          materials: ['Mapa topográfico impreso', 'Colores'],
        },
        siteActivities: ['Comparar la pendiente de las paredes de El Elegante con la de su fondo.', 'Ubicar en el mapa el área de análisis de cada sitio.'],
      },
    },

    analogs: {
      summary: 'Laguna Salada, Sierra Cucapá y El Pinacate frente a tres sitios lunares: dónde sí y dónde no aterrizar.',
      student: {
        introduction:
          'Ya sabes medir la pendiente. Ahora toca usarla como lo haría una agencia espacial: comparar sitios y decidir cuáles son seguros. Vas a revisar tres pares de lugares de Baja California y Sonora con la Luna.',
        blocks: [
          {
            id: 'seguro',
            title: 'Un análogo de aterrizaje: Laguna Salada',
            body: 'La Laguna Salada tiene una fracción casi plana de [[earth laguna slope]] y Mare Tranquillitatis de [[moon laguna slope]]. Su similitud en este eje es [[s laguna slope]], la más alta de los cinco pares.\n\nPor eso la laguna sirve para practicar la búsqueda de terreno llano. Pero recuerda: la laguna puede inundarse y su suelo tiene sales; la planicie lunar es basalto.',
            imageId: 'apollo11-lro',
          },
          {
            id: 'riesgo',
            title: 'Un contraejemplo: Sierra Cucapá y Shackleton',
            body: 'En la Sierra Cucapá casi nada es plano: [[earth cucapa slope]]. En el borde de Shackleton, en el polo sur lunar, la fracción es [[moon cucapa slope]]. Los dos son terrenos difíciles.\n\nAquí la similitud de [[s cucapa slope]] dice que los dos sitios son parecidos porque los dos son peligrosos, no porque sean buenos para aterrizar.',
            visual: 'slope-waffle',
          },
          {
            id: 'volcan',
            title: 'Cuando la analogía no funciona: El Pinacate',
            body: 'El escudo volcánico del Pinacate tiene conos y coladas: [[earth pinacate slope]]. Marius Hills, en la Luna, es mucho más plano en el área estudiada: [[moon pinacate slope]]. La similitud es solo [[s pinacate slope]].\n\nEste par se parece en otras cosas, como la composición de las rocas, pero no en la pendiente. Una buena comparación muestra los dos lados.',
            imageId: 'marius-pit',
          },
        ],
        concepts: [
          { term: 'Análogo terrestre', definition: 'Lugar de la Tierra que se parece a otro de la Luna en algunas características, y sirve para estudiar o practicar.' },
          { term: 'Contraejemplo', definition: 'Caso que muestra dónde falla una idea; aquí, un par que se parece por ser difícil, no por ser seguro.' },
          { term: 'Similitud S', definition: 'Número de 0 a 100 que calcula el backend: qué tan parecidos son los dos sitios en un eje.' },
        ],
        earth: 'Tres lugares de la región: una playa seca ([[earth laguna slope]]), una sierra rocosa ([[earth cucapa slope]]) y un escudo volcánico ([[earth pinacate slope]]).',
        moon: 'Tres lugares lunares: la planicie del Apolo 11 ([[moon laguna slope]]), el borde de Shackleton ([[moon cucapa slope]]) y Marius Hills ([[moon pinacate slope]]).',
        comparisonLead: 'Ordena los pares de la línea más corta a la más larga. ¿Cuál se parece más en pendiente? ¿Cuál menos?',
        facts: [
          'El borde de Shackleton es candidato para futuras misiones porque recibe luz del Sol casi todo el tiempo, aunque su terreno es accidentado.',
          'En 2010, el sismo El Mayor–Cucapah, de magnitud 7.2, se originó en esta región: la sierra está junto a fallas activas.',
          'En El Pinacate entrenaron astronautas del programa Apolo para reconocer terrenos volcánicos.',
        ],
        activities: [
          {
            title: 'Comité de aterrizaje',
            description:
              'En equipos, elijan uno de los tres sitios lunares para aterrizar. Justifiquen con el valor de pendiente y digan qué otro dato revisarían antes de decidir.',
            type: 'reflection',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué par tiene la mayor similitud en pendiente?',
            options: ['Laguna Salada ↔ Tranquillitatis', 'Sierra Cucapá ↔ Shackleton', 'Pinacate ↔ Marius Hills'],
            answer: 0,
            explanation: 'Su similitud es [[s laguna slope]]: los dos sitios son casi completamente planos.',
          },
          {
            question: 'Sierra Cucapá ↔ Shackleton tiene una similitud de [[s cucapa slope]]. ¿Qué significa?',
            options: ['Que los dos son buenos para aterrizar', 'Que los dos tienen poco terreno plano', 'Que la Sierra Cucapá está en la Luna'],
            answer: 1,
            explanation: 'Se parecen porque los dos son accidentados: es un contraejemplo de riesgo.',
          },
          {
            question: '¿Por qué Pinacate ↔ Marius Hills tiene baja similitud en pendiente?',
            options: [
              'Porque los dos sitios son igual de planos',
              'Porque el Pinacate tiene mucho más terreno inclinado que el área de Marius Hills',
              'Porque no hay datos',
            ],
            answer: 1,
            explanation: 'Pinacate tiene [[earth pinacate slope]] y Marius Hills [[moon pinacate slope]]: una diferencia grande.',
          },
        ],
        conclusion:
          'Un valor alto de similitud no siempre significa «buen lugar». Hay que leer qué se está comparando: dos sitios pueden parecerse porque los dos son planos o porque los dos son peligrosos. Y un par puede parecerse en un eje y no en otro.',
      },
      teacher: {
        objectives: [
          'Interpretar la similitud del eje de pendiente en tres pares reales.',
          'Distinguir entre una similitud que indica terreno seguro y una que indica riesgo compartido.',
          'Reconocer que un par puede parecerse en unos ejes y no en otros.',
        ],
        priorKnowledge: ['Concepto de pendiente y fracción casi plana.', 'Leer una escala con dos marcas.'],
        materials: ['Proyector o copias de la tabla de datos', 'Fichas para el comité de aterrizaje'],
        explanation:
          'Lo esencial: la similitud mide qué tan cerca están los dos valores, no si el terreno es bueno. Laguna Salada ↔ Tranquillitatis ([[s laguna slope]]) se parece por ser plano; Cucapá ↔ Shackleton ([[s cucapa slope]]) por ser accidentado. Error frecuente: leer la similitud como «calificación» de un sitio.',
        steps: [
          { title: 'Recordatorio', description: 'Repase qué es la fracción casi plana con la escala del eje.', minutes: 5 },
          { title: 'Tres pares', description: 'Presente los tres pares con sus valores y fotos.', minutes: 12 },
          { title: 'Comité de aterrizaje', description: 'Los equipos eligen un sitio lunar y lo justifican.', minutes: 15 },
          { title: 'Puesta en común', description: 'Cada equipo presenta; discutan el contraejemplo de Cucapá ↔ Shackleton.', minutes: 12 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 6 },
        ],
        discussion: [
          '¿Una similitud alta siempre significa que un sitio es bueno para aterrizar?',
          '¿Qué otros ejes revisarías antes de elegir el borde de Shackleton?',
          '¿Por qué conviene estudiar un contraejemplo?',
        ],
        dataActivity: {
          title: 'Ordenar los pares',
          description:
            'Con la tabla impresa, los equipos ordenan los tres pares por similitud ([[s laguna slope]], [[s cucapa slope]] y [[s pinacate slope]]) y escriben una frase sobre qué tienen en común los dos sitios de cada par.',
          minutes: 10,
        },
        assessment: ['Revisar la justificación del comité: ¿usa el valor de pendiente y menciona otro dato?', 'Pedir un ejemplo de similitud alta que no signifique «sitio seguro».'],
        outcomes: ['El grupo interpreta la similitud como cercanía entre valores.', 'El grupo explica el contraejemplo de riesgo.'],
        alternative: {
          title: 'Tarjetas de sitios',
          description: 'Imprima una tarjeta por sitio con su foto y su valor de pendiente. Los equipos forman los pares y los ordenan por parecido.',
          type: 'printable',
          materials: ['Tarjetas impresas', 'Tijeras'],
        },
        siteActivities: ['Comparar la textura de la laguna con la de la sierra en una imagen satelital.', 'Identificar en el mapa por qué la sierra es un mal lugar para aterrizar.'],
      },
    },
  },
};
