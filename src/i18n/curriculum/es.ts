import type { CurriculumText } from './types';

/**
 * Textos pedagógicos de los nueve ejes (español). Ver `types.ts`: el contenido
 * científico viene de `i18n/playground.es.ts`; aquí solo el encuadre didáctico.
 */
export const curriculumEs: CurriculumText = {
  axes: {
    slope: {
      student: {
        tagline: '¿Dónde es seguro aterrizar?',
        overview:
          'Una nave o un vehículo necesitan terreno casi plano: en una ladera pueden volcarse o resbalar. En este eje aprenderás qué es la pendiente y cómo se mide desde el espacio con modelos de elevación.\n\nDespués lo aplicarás a dos pares reales: una playa seca de Baja California que se parece a la planicie donde alunizó el Apolo 11, y una sierra que sirve de ejemplo de dónde no aterrizar.',
      },
      teacher: {
        tagline: 'Pendiente: el primer criterio para elegir un sitio de aterrizaje',
        overview:
          'El módulo lleva al grupo del concepto de pendiente a su medición con modelos digitales de elevación, y termina con dos pares: Laguna Salada ↔ Mare Tranquillitatis (terreno seguro) y Sierra Cucapá ↔ borde de Shackleton (contraejemplo de riesgo).',
        objectives: [
          'Definir la pendiente y relacionarla con la seguridad de un aterrizaje.',
          'Explicar cómo se obtiene la pendiente a partir de un modelo de elevación y por qué depende de la escala.',
          'Comparar un sitio de Baja California con uno lunar usando el criterio de pendiente.',
        ],
      },
      concept: {
        introduction:
          'Imagina que tienes que estacionar una nave en un lugar que nadie ha pisado. Lo primero que necesitas saber es si el suelo está plano o inclinado. A esa inclinación se le llama pendiente.',
        concepts: [
          { term: 'Pendiente', definition: 'Inclinación del terreno respecto a la horizontal; se expresa en grados.' },
          {
            term: 'Modelo digital de elevación (DEM)',
            definition: 'Mapa en el que cada píxel guarda la altura del terreno; a partir de él se calcula la pendiente.',
          },
          {
            term: 'Umbral de seguridad',
            definition: 'Valor de pendiente por debajo del cual una zona se considera segura para aterrizar; en este eje se usa 10°.',
          },
        ],
        activity: {
          title: 'Rampas de cartón',
          description:
            'Inclina una tabla o un cartón a distintos ángulos y coloca encima un carrito de juguete. Observa a partir de qué inclinación empieza a rodar o a volcarse y explica qué le pasaría a un módulo de aterrizaje.',
          type: 'model',
        },
        discussion: ['¿Por qué el Apolo 11 eligió una planicie para alunizar?', '¿Qué riesgos tiene aterrizar en una ladera?'],
      },
    },
    roughness: {
      student: {
        tagline: 'Liso, rocoso o accidentado',
        overview:
          'Dos terrenos pueden ser igual de planos y, aun así, uno estar cubierto de rocas sueltas. La rugosidad describe esas irregularidades pequeñas, de centímetros a metros.\n\nVerás cómo la señal de radar que rebota en la superficie revela la rugosidad, y compararás campos de lava y sierras de la región con sitios de la Luna.',
      },
      teacher: {
        tagline: 'Rugosidad: lo que el mapa de pendientes no muestra',
        overview:
          'Se distingue rugosidad de pendiente, se explica de forma cualitativa cómo el radar detecta superficies rocosas y por qué se comparan percentiles cuando los instrumentos son distintos. Se aplica a Pinacate ↔ Marius Hills y Sierra Cucapá ↔ Shackleton.',
        objectives: [
          'Distinguir entre la pendiente y la rugosidad de una superficie.',
          'Explicar de forma cualitativa cómo el radar detecta superficies rocosas.',
          'Justificar por qué se comparan percentiles cuando cada cuerpo se mide con un instrumento distinto.',
        ],
      },
      concept: {
        introduction:
          'Si pasas la mano por una mesa y luego por un camino de grava, notas la diferencia aunque los dos estén planos. Esa diferencia es la rugosidad.',
        concepts: [
          {
            term: 'Rugosidad',
            definition: 'Irregularidades de una superficie a escala pequeña (de centímetros a metros), como rocas y bloques sueltos.',
          },
          {
            term: 'Radar',
            definition: 'Instrumento que envía ondas de radio y mide la señal que regresa; una superficie rugosa dispersa más esa señal.',
          },
          {
            term: 'Percentil',
            definition: 'Posición de un valor dentro de su grupo, de 0 a 1: un percentil de 0.9 significa que el valor supera al 90 % del grupo.',
          },
        ],
        activity: {
          title: 'Luz rasante',
          description:
            'Ilumina con una lámpara, desde un lado, una hoja lisa y una charola con grava. Compara las sombras y relaciona lo que ves con la forma en que una superficie rugosa dispersa la señal del radar.',
          type: 'observation',
        },
        discussion: [
          '¿Por qué un vehículo puede tener problemas en un terreno plano pero rocoso?',
          '¿Qué ventaja tiene comparar percentiles en lugar de valores directos?',
        ],
      },
    },
    mineralogy: {
      student: {
        tagline: 'Rocas oscuras, rocas claras',
        overview:
          'Las rocas guardan la historia de cómo se formó un lugar. Aprenderás la diferencia entre rocas máficas, como el basalto oscuro de los mares lunares, y félsicas, ricas en sílice.\n\nTambién verás cómo los satélites reconocen la composición sin tocar el suelo y por qué Baja California y Sonora tienen volcanes que ayudan a entender la Luna.',
      },
      teacher: {
        tagline: 'Composición: el eje que más pesa junto con la pendiente',
        overview:
          'Se trabaja la escala félsico–máfico, la lectura de la composición con sensores desde órbita y su aplicación a tres pares: El Elegante ↔ Linné, Pinacate ↔ Marius Hills y Cerro Prieto ↔ Gruithuisen.',
        objectives: [
          'Clasificar rocas como máficas o félsicas según su composición.',
          'Explicar que la composición puede estimarse desde el espacio con sensores.',
          'Relacionar la composición con los recursos y la historia geológica de un sitio.',
        ],
      },
      concept: {
        introduction:
          'No todas las rocas son iguales: unas son oscuras y pesadas; otras, claras y ricas en sílice. Saber de qué está hecha una roca nos dice cómo se formó y qué recursos puede ofrecer.',
        concepts: [
          { term: 'Roca máfica', definition: 'Roca rica en hierro y magnesio, generalmente oscura; el basalto es el ejemplo más común.' },
          { term: 'Roca félsica', definition: 'Roca rica en sílice y feldespato, generalmente clara; el granito y la dacita son ejemplos.' },
          {
            term: 'Anortosita',
            definition: 'Roca clara, rica en feldespato, que forma las tierras altas de la Luna; no hay en Baja California ni en Sonora.',
          },
        ],
        activity: {
          title: 'Ordena tus rocas',
          description:
            'Reúne rocas de tu entorno o fotografías de rocas y ordénalas de la más clara a la más oscura. Investiga cuáles podrían ser basalto y explica en qué se parecen a los mares lunares.',
          type: 'observation',
        },
        discussion: [
          '¿Por qué los mares lunares se ven oscuros desde la Tierra?',
          '¿Qué nos dice la composición de las rocas sobre los recursos que podría usar una base?',
        ],
      },
    },
    albedo: {
      student: {
        tagline: '¿Cuánta luz refleja el suelo?',
        overview:
          'Desde la Tierra vemos la Luna con manchas claras y oscuras: es el albedo, la fracción de la luz que refleja cada superficie. Aprenderás qué es y cómo se calcula con imágenes de satélite.\n\nDespués verás por qué una playa salina brillante y un mar lunar oscuro pueden parecerse en otros ejes aunque su albedo sea muy distinto.',
      },
      teacher: {
        tagline: 'Albedo: luz, temperatura y composición',
        overview:
          'Se define el albedo como la fracción de luz reflejada (de 0 a 1), se relaciona con el calentamiento de la superficie y con la composición, y se analizan los pares donde coincide y donde no, como Laguna Salada ↔ Mare Tranquillitatis.',
        objectives: [
          'Definir el albedo como la fracción de luz solar que refleja una superficie.',
          'Relacionar el albedo con el calentamiento de una superficie.',
          'Reconocer cuándo dos sitios se parecen en un eje pero no en el albedo.',
        ],
      },
      concept: {
        introduction:
          'Una camiseta blanca y una negra no se calientan igual al sol. La diferencia está en cuánta luz refleja cada una: eso es el albedo.',
        concepts: [
          { term: 'Albedo', definition: 'Fracción de la luz solar que refleja una superficie; va de 0 (nada) a 1 (toda).' },
          { term: 'Reflectancia', definition: 'Proporción de luz que refleja una superficie en un color o banda específica.' },
          { term: 'Banda espectral', definition: 'Intervalo de colores o longitudes de onda que registra un sensor de satélite.' },
        ],
        activity: {
          title: 'Blanco contra negro',
          description:
            'Pon al sol dos vasos con agua, uno envuelto en papel blanco y otro en papel negro. Después de un rato compara su temperatura (al tacto o con un termómetro) y relaciona el resultado con el albedo.',
          type: 'observation',
        },
        discussion: [
          '¿Por qué una superficie oscura se calienta más que una clara bajo el mismo Sol?',
          '¿Puede un sitio ser un buen análogo lunar aunque tenga un albedo distinto?',
        ],
      },
    },
    thermal: {
      student: {
        tagline: 'Días ardientes, noches heladas',
        overview:
          'En el desierto de Sonora el día es caluroso y la noche fresca, pero en la Luna la diferencia es mucho mayor porque no hay una atmósfera que guarde el calor.\n\nAprenderás qué es la amplitud térmica, cómo se mide desde la órbita y por qué este eje se compara con una razón y no con una resta.',
      },
      teacher: {
        tagline: 'Amplitud térmica: el papel de la atmósfera',
        overview:
          'El módulo conecta la amplitud térmica con la atmósfera, presenta su medición con MODIS en la Tierra y Diviner en la Luna, y usa el par El Elegante ↔ Linné, cuyos valores de este eje todavía son estimaciones provisionales.',
        objectives: [
          'Definir la amplitud térmica como la diferencia de temperatura entre el día y la noche.',
          'Explicar el papel de la atmósfera en la temperatura de una superficie.',
          'Justificar por qué este eje se compara con una razón logarítmica.',
        ],
      },
      concept: {
        introduction:
          'Después de un día de sol, una piedra sigue tibia al anochecer y se enfría poco a poco. En la Luna, sin aire ni nubes, ese enfriamiento es mucho más extremo.',
        concepts: [
          { term: 'Amplitud térmica', definition: 'Diferencia entre la temperatura de la superficie al mediodía y antes del amanecer.' },
          { term: 'Kelvin (K)', definition: 'Unidad de temperatura usada en ciencia; un cambio de 1 K equivale a un cambio de 1 °C.' },
          {
            term: 'Atmósfera',
            definition: 'Capa de gases que rodea a un planeta y reparte el calor; la Luna no tiene una atmósfera que lo haga.',
          },
        ],
        activity: {
          title: 'Diario de temperaturas',
          description:
            'Mide la temperatura de una piedra o del patio al mediodía y al día siguiente temprano. Calcula la diferencia y discute qué pasaría si no hubiera atmósfera.',
          type: 'observation',
        },
        discussion: [
          '¿Qué pasaría con la temperatura de la Tierra si no tuviera atmósfera?',
          '¿Qué necesitaría un hábitat lunar para soportar esos cambios de temperatura?',
        ],
      },
    },
    aridity: {
      student: {
        tagline: 'Un mundo sin vida',
        overview:
          'La Luna no tiene plantas, agua líquida ni vida. Por eso, en la Tierra los mejores análogos son los lugares más secos y con menos vegetación.\n\nAprenderás a medir la vegetación desde el espacio con el índice NDVI y por qué este eje distingue poco entre desiertos.',
      },
      teacher: {
        tagline: 'Aridez: medir la vegetación con NDVI',
        overview:
          'Se presenta el NDVI como medida de la vegetación, el valor de referencia lunar (NDVI = 0) y por qué el eje tiene el peso más bajo del índice, con el caso de Laguna Salada ↔ Mare Tranquillitatis.',
        objectives: [
          'Explicar por qué la ausencia de vida es una característica de la Luna.',
          'Interpretar el NDVI como medida de la cantidad de vegetación.',
          'Argumentar por qué este eje distingue poco entre sitios desérticos.',
        ],
      },
      concept: {
        introduction:
          'Desde la Luna, la Tierra se ve azul, blanca, verde y café. La Luna, en cambio, es gris: no hay plantas que pinten su superficie.',
        concepts: [
          { term: 'Aridez', definition: 'Falta de agua en un lugar, que limita la vegetación y la vida.' },
          {
            term: 'NDVI',
            definition: 'Índice de vegetación que se calcula con la luz roja y la infrarroja que reflejan las plantas; va de −1 a 1.',
          },
          { term: 'Infrarrojo cercano', definition: 'Luz invisible para nosotros que las plantas sanas reflejan con mucha intensidad.' },
        ],
        activity: {
          title: 'Mapa verde',
          description:
            'Busca una imagen de satélite de tu ciudad o de la región. Marca las zonas con vegetación y las zonas desérticas y explica cuáles se parecerían más a la Luna.',
          type: 'exploration',
        },
        discussion: [
          '¿Por qué la vegetación puede confundir las mediciones de otros ejes?',
          '¿Por qué casi cualquier desierto se parece a la Luna en este eje?',
        ],
      },
    },
    volatiles: {
      student: {
        tagline: 'Agua escondida',
        overview:
          'En la Tierra el agua está en ríos, mares, glaciares y en el suelo. En la Luna solo puede conservarse como hielo en lugares muy fríos, dentro de cráteres polares que nunca reciben luz.\n\nAprenderás cómo se busca el agua desde el espacio y por qué los sitios de la región son secos, mientras que en el polo sur lunar puede haber hielo estable.',
      },
      teacher: {
        tagline: 'Hielo subsuperficial: el recurso que motiva una base lunar',
        overview:
          'Se trabajan las clases de humedad (de 0, seco, a 3, hielo estable), la idea de trampa fría y la «similitud por ausencia», con el contraste Sierra Cucapá ↔ Shackleton.',
        objectives: [
          'Describir dónde se encuentra el agua en la Tierra y dónde puede haber hielo en la Luna.',
          'Explicar qué es una trampa fría y por qué conserva el hielo.',
          'Reconocer que dos sitios secos se parecen sin aportar información («similitud por ausencia»).',
        ],
      },
      concept: {
        introduction:
          'El agua es lo más valioso para una base lunar: se puede beber, separar para obtener oxígeno o usar para fabricar combustible. ¿Dónde podríamos encontrarla?',
        concepts: [
          {
            term: 'Volátil',
            definition: 'Sustancia que pasa con facilidad a gas, como el agua; en la Luna solo se conserva congelada en lugares muy fríos.',
          },
          {
            term: 'Trampa fría',
            definition: 'Zona en sombra permanente, dentro de cráteres polares, tan fría que el hielo puede durar.',
          },
          { term: 'Humedad del suelo', definition: 'Cantidad de agua que contiene el suelo; en la Tierra se mide desde satélites.' },
        ],
        activity: {
          title: 'Hielo a la sombra',
          description:
            'Coloca dos cubos de hielo iguales, uno al sol y otro en un lugar siempre a la sombra. Compara cuánto tardan en derretirse y relaciónalo con los cráteres del polo sur lunar.',
          type: 'observation',
        },
        discussion: [
          '¿Por qué el hielo lunar se busca en los polos y no en el ecuador?',
          '¿Qué significa que dos sitios secos sean «similares por ausencia»?',
        ],
      },
    },
    dust: {
      student: {
        tagline: 'Polvo que se pega a todo',
        overview:
          'Las huellas del Apolo siguen marcadas en el polvo lunar, un suelo de granos muy finos. Aprenderás qué es el regolito y cómo se mide la fracción de polvo fino de un suelo.\n\nDespués compararás el polvo de la Laguna Salada con el de la Luna: en qué se parecen y qué los mueve en cada lugar.',
      },
      teacher: {
        tagline: 'Regolito fino: un eje útil para la discusión',
        overview:
          'Se definen el regolito y la fracción fina, se presentan sus fuentes (modelos de suelo en la Tierra y muestras del Apolo en la Luna) y se discute por qué el eje tiene confianza baja, con el caso de Laguna Salada ↔ Mare Tranquillitatis.',
        objectives: [
          'Definir el regolito y la fracción fina de un suelo.',
          'Explicar por qué el polvo lunar es un riesgo para trajes y equipos.',
          'Comparar qué mueve el polvo en la Tierra y en la Luna.',
        ],
      },
      concept: {
        introduction:
          'Cuando los astronautas caminaron en la Luna, el polvo se les pegaba a los trajes y se metía en los equipos. Ese polvo forma parte del regolito.',
        concepts: [
          { term: 'Regolito', definition: 'Capa de fragmentos de roca y polvo suelto que cubre la superficie de la Luna.' },
          {
            term: 'Fracción fina',
            definition: 'Parte del suelo formada por partículas muy pequeñas (limo y arcilla), del tamaño del polvo.',
          },
          {
            term: 'Carga electrostática',
            definition: 'Electricidad acumulada en las partículas, que hace que el polvo lunar se adhiera a las superficies.',
          },
        ],
        activity: {
          title: 'Tamiza tu suelo',
          description:
            'Pasa una muestra de tierra por coladores de distintos tamaños y separa la arena del polvo fino. Compara cuánto hay de cada uno y relaciona el resultado con el regolito lunar.',
          type: 'model',
        },
        discussion: ['¿Por qué el polvo lunar es tan abrasivo?', '¿Qué mueve el polvo en un desierto y qué lo mueve en la Luna?'],
      },
    },
    craters: {
      student: {
        tagline: 'La forma cuenta una historia',
        overview:
          'La Luna está cubierta de cráteres, y en Sonora hay cráteres volcánicos de tamaño parecido al de algunos lunares. Aprenderás cómo se forma un cráter y cómo se mide su forma con la razón profundidad/diámetro.\n\nDespués verás por qué El Elegante y Linné se parecen tanto aunque tienen un origen opuesto.',
      },
      teacher: {
        tagline: 'Morfología de cráteres: medir d/D',
        overview:
          'Se comparan cráteres de impacto y volcánicos, se calcula la razón d/D con dimensiones publicadas y se aplica a El Elegante ↔ Linné (el único par con datos publicados en los dos sitios), Pinacate ↔ Marius Hills y Cerro Prieto ↔ Gruithuisen.',
        objectives: [
          'Distinguir un cráter de impacto de uno volcánico.',
          'Calcular la razón profundidad/diámetro (d/D) de un cráter.',
          'Explicar por qué los cráteres se conservan mejor en la Luna que en la Tierra.',
        ],
      },
      concept: {
        introduction:
          'Si dejas caer una piedra en arena, se forma un hueco con el borde levantado. Muchos cráteres de la Luna se formaron de manera parecida, pero por meteoritos que viajaban muy rápido.',
        concepts: [
          { term: 'Cráter de impacto', definition: 'Depresión que se forma cuando un meteorito choca contra la superficie.' },
          {
            term: 'Maar',
            definition: 'Cráter volcánico que se forma cuando el magma toca agua subterránea y provoca una explosión de vapor.',
          },
          {
            term: 'Razón d/D',
            definition: 'Profundidad de un cráter dividida entre su diámetro; indica qué tan hondo es en proporción a su tamaño.',
          },
        ],
        activity: {
          title: 'Cráteres en la charola',
          description:
            'Llena una charola con harina y cúbrela con una capa delgada de cocoa. Deja caer canicas desde distintas alturas, mide el diámetro y la profundidad de cada cráter y calcula su razón d/D.',
          type: 'model',
        },
        discussion: ['¿Por qué la Luna conserva más cráteres que la Tierra?', '¿Cómo puede un cráter volcánico parecerse a uno de impacto?'],
      },
    },
  },

  templates: {
    blocks: {
      measures: '¿Qué mide este eje?',
      why: '¿Por qué importa en la Luna?',
      earth: 'Cómo se mide en la Tierra',
      moon: 'Cómo se mide en la Luna',
      notes: 'Precauciones al comparar',
      breaks: 'Dónde se rompe la analogía:',
    },
    concept: {
      facts: (n, total, pairs) => [
        `Este es el eje ${n} de los ${total} que usa el Índice de Similitud Lunar para comparar la Tierra y la Luna.`,
        pairs === 1
          ? 'Un par de sitios de Baja California y Sonora con la Luna se estudia en este eje (lo verás en el tercer submódulo).'
          : `${pairs} pares de sitios de Baja California y Sonora con la Luna se estudian en este eje (los verás en el tercer submódulo).`,
      ],
      conclusion: (axis) =>
        `Ya sabes qué describe el eje «${axis}» y por qué importa para explorar la Luna. En el siguiente submódulo verás cómo se mide en cada cuerpo.`,
      objectives: (axis, terms) => [
        `Explicar con sus palabras qué mide el eje «${axis}».`,
        'Argumentar por qué este eje es importante para explorar la Luna.',
        `Usar correctamente los términos: ${terms}.`,
      ],
      assessment: [
        'Pedir a cada estudiante que explique con sus palabras qué mide el eje y que dé un ejemplo.',
        'Revisar el registro y las conclusiones de la actividad.',
      ],
      outcomes: (axis) => [
        `El grupo describe qué mide el eje «${axis}» con ejemplos de la Tierra y de la Luna.`,
        'El grupo relaciona el eje con al menos un reto de la exploración lunar.',
      ],
    },
    measurement: {
      introduction: (axis) =>
        `Para comparar la Tierra y la Luna en el eje «${axis}» hace falta un valor para cada sitio. En cada cuerpo se usan instrumentos y datos distintos, así que primero hay que entender de dónde sale cada valor y cómo se comparan.`,
      metric: 'Métrica del eje',
      formulas: {
        linear: {
          term: 'Comparación lineal',
          definition:
            'Se calcula la diferencia entre el valor de la Tierra y el de la Luna: la similitud baja de 100 a 0 conforme esa diferencia se acerca a la tolerancia del eje.',
        },
        log: {
          term: 'Razón logarítmica',
          definition:
            'Se compara cuántas veces es mayor un valor que el otro, porque las magnitudes difieren por órdenes de magnitud: si uno es 10 veces el otro, la similitud es 0.',
        },
      },
      tolerance: {
        term: 'Tolerancia (R)',
        definition: (value) => `Diferencia a partir de la cual la similitud llega a 0. En este eje, R = ${value}.`,
      },
      confidence: {
        term: (level) => `Confianza ${level}`,
        definition: (meaning) => meaning,
      },
      facts: {
        weight: (weight, total) => `En el Índice de Similitud Lunar este eje pesa ${weight}, de un peso total de ${total}.`,
        absence: (weight) =>
          `Si los dos sitios son secos, la similitud sale 100 pero no aporta información; en ese caso el peso del eje baja a ${weight}.`,
      },
      activity: (axis) => ({
        title: 'Tabla de instrumentos',
        description: `Haz una tabla con dos columnas, Tierra y Luna, y anota qué instrumento o dato se usa en cada cuerpo para el eje «${axis}». Después explica con tus palabras por qué no se usa el mismo en los dos.`,
      }),
      conclusion:
        'Ahora sabes de dónde salen los datos de este eje y qué precauciones hay que tener al compararlos. En el siguiente submódulo los aplicarás a sitios reales de Baja California y Sonora.',
      objectives: (axis, metric) => [
        `Identificar qué dato o instrumento se usa en la Tierra y en la Luna para el eje «${axis}».`,
        `Interpretar la métrica del eje: ${metric}.`,
        'Explicar por qué hay que cuidar la escala y la calibración al comparar datos de dos cuerpos.',
      ],
      discussion: (level) => [
        '¿Por qué no se puede usar el mismo instrumento en la Tierra y en la Luna?',
        `¿Qué significa que este eje tenga confianza ${level}? ¿Qué tan seguros podemos estar de una comparación?`,
      ],
      assessment: [
        'Revisar la tabla de instrumentos de cada equipo.',
        'Pedir a cada equipo que explique una precaución que hay que tener al comparar los datos.',
      ],
      outcomes: (level) => [
        'El grupo distingue las fuentes de datos que se usan en cada cuerpo.',
        `El grupo explica qué implica la confianza ${level} del eje para interpretar una comparación.`,
      ],
    },
    analogs: {
      introduction: (axis, n) =>
        `Ahora toca aplicar el eje «${axis}» a sitios reales. ${
          n === 1
            ? 'Este par de Baja California y Sonora con la Luna se estudia en este eje: verás'
            : `Estos ${n} pares de Baja California y Sonora con la Luna se estudian en este eje: en cada uno verás`
        } en qué se parecen los sitios y dónde se rompe la analogía.`,
      none: (axis) => `Todavía no hay pares de sitios asociados al eje «${axis}».`,
      concepts: [
        {
          term: 'Análogo terrestre',
          definition: 'Lugar de la Tierra que se parece a uno de otro cuerpo en algunas características y sirve para estudiarlo o entrenar.',
        },
        { term: 'Eje fuerte esperado', definition: 'Eje en el que se espera que un par de sitios muestre mayor similitud.' },
        {
          term: 'Ruptura de la analogía',
          definition: 'Diferencia importante entre los dos sitios que limita lo que se puede concluir al compararlos.',
        },
      ],
      facts: {
        strong: (pair, axis) => `En el par ${pair}, «${axis}» es un eje fuerte esperado.`,
        published: (pair, earth, moon) => `${pair}: valores publicados en los dos sitios — Tierra ${earth}, Luna ${moon}.`,
        provisional: (pair, earth, moon) =>
          `${pair}: solo hay estimaciones provisionales (Tierra ${earth}, Luna ${moon}); quedan fuera del índice hasta que se midan.`,
      },
      questionTitle: (pair) => `Pregunta: ${pair}`,
      playground: (axis) => ({
        title: 'Explora en Starman Playground',
        description: `Abre Starman Playground, filtra por el eje «${axis}» y compara las fotos y la ficha de los sitios de este submódulo.`,
      }),
      conclusion: (axis) =>
        `Con estos pares viste que el eje «${axis}» ayuda a comparar la Tierra y la Luna, pero ninguna analogía es perfecta: siempre hay que revisar dónde se rompe.`,
      explanation: (axis) => `Presentar cada par desde el eje «${axis}»: qué tienen en común los dos sitios y qué diferencias limitan la comparación.`,
      discussion: (axis) => [
        `¿En cuál de los pares se parecen más los sitios en el eje «${axis}»? ¿Por qué?`,
        '¿Qué diferencia entre la Tierra y la Luna explica cada ruptura de la analogía?',
        '¿Qué datos harían falta para confirmar la comparación?',
      ],
      objectives: [
        'Aplicar el eje a pares reales de sitios de Baja California y Sonora con la Luna.',
        'Identificar en qué se parecen los sitios y dónde se rompe la analogía.',
        'Formular preguntas de investigación a partir de un par de sitios.',
      ],
      assessment: [
        'Pedir a cada equipo una ficha de un par: en qué se parecen los sitios y dónde se rompe la analogía.',
        'Valorar la calidad de las respuestas a la pregunta de cada par.',
      ],
      outcomes: [
        'El grupo compara un sitio de la región con uno lunar usando el eje.',
        'El grupo reconoce al menos una limitación de cada analogía.',
      ],
    },
    teacherPlayground: (axis, stage) => ({
      title: 'Exploración guiada en Starman Playground',
      description:
        stage === 'analogs'
          ? `Proyecta Starman Playground, activa el filtro «${axis}» y recorre con el grupo los pares asociados: selecciona cada área con su número y comenten en qué se parecen los sitios.`
          : `Al cerrar la sesión, proyecta Starman Playground con el filtro «${axis}» activo para mostrar qué sitios de la región se estudiarán en este eje.`,
    }),
  },
};
