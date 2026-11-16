import type { AxisCurriculumText } from '../types';

/** Eje 2 · Rugosidad superficial. Concepto (primaria) → medición (preparatoria) → análogos (secundaria). */
export const roughnessEs: AxisCurriculumText = {
  student: {
    tagline: 'Liso, rocoso o accidentado',
    overview:
      'Dos lugares pueden ser igual de planos y, aun así, uno estar cubierto de rocas. La rugosidad describe esas irregularidades pequeñas, de decímetros a metros.\n\nVerás cómo un radar desde el espacio distingue lo liso de lo rocoso, por qué no se comparan directamente los números de dos radares distintos y cómo se parecen los campos de lava y las sierras de la región a lugares de la Luna.',
  },
  teacher: {
    tagline: 'Rugosidad: lo que el mapa de pendientes no muestra',
    overview:
      'Se distingue rugosidad de pendiente, se explica cómo el radar responde a superficies rocosas y por qué este eje compara percentiles dentro de cada cuerpo. Se aplica a Cerro Prieto ↔ Gruithuisen, Sierra Cucapá ↔ Shackleton y Pinacate ↔ Marius Hills.',
    objectives: [
      'Distinguir entre la pendiente y la rugosidad de una superficie.',
      'Explicar cómo el radar detecta superficies rocosas.',
      'Justificar por qué se comparan percentiles cuando cada cuerpo se mide con un instrumento distinto.',
    ],
  },
  submodules: {
    concept: {
      summary: 'Qué diferencia hay entre un suelo liso y uno lleno de rocas, aunque los dos sean planos.',
      student: {
        introduction:
          'Pasa la mano por una mesa y luego por un camino de grava. Los dos pueden estar planos, pero se sienten muy distintos. Esa diferencia se llama rugosidad.',
        blocks: [
          {
            id: 'liso-rocoso',
            title: 'Liso o rocoso',
            body: 'Un suelo rugoso tiene piedras, bloques y escalones pequeños. Para un vehículo lunar, una roca del tamaño de una pelota puede ser un obstáculo.\n\nLa Laguna Salada es muy lisa: su fondo es lodo seco. Mare Tranquillitatis también es bastante lisa, pero tiene pequeños cráteres y rocas sueltas.',
            imageId: 'young-jump',
          },
          {
            id: 'radar',
            title: 'Un satélite que «toca» con ondas',
            body: 'Un radar manda ondas desde el espacio y escucha el eco. Si el suelo es liso, el eco se va hacia otro lado, como una pelota que rebota en el piso. Si es rugoso, una parte regresa al satélite.',
            visual: 'radar-scatter',
          },
        ],
        concepts: [
          { term: 'Rugosidad', definition: 'Qué tan irregular es una superficie: piedras, bloques, escalones pequeños.' },
          { term: 'Radar', definition: 'Aparato que manda ondas y escucha su eco para saber cómo es lo que tocan.' },
          { term: 'Eco', definition: 'La parte de la onda que regresa después de chocar con algo.' },
        ],
        earth: 'En la Laguna Salada, el radar casi no recibe eco: es uno de los lugares más lisos de los desiertos del noroeste de México.',
        moon: 'Mare Tranquillitatis es más rugosa que la laguna, pero menos que muchos lugares de la Luna.',
        comparisonLead: 'Mira dónde queda cada sitio: a la izquierda, más liso; a la derecha, más rugoso.',
        facts: [
          'Las ruedas del vehículo lunar del Apolo estaban hechas de malla metálica para pasar sobre rocas y polvo.',
          'El radar funciona de día y de noche, y también con nubes.',
        ],
        activities: [
          {
            title: 'Luz rasante',
            description:
              'En un cuarto oscuro, ilumina con una lámpara desde un lado una hoja lisa y una charola con grava. Dibuja las sombras que ves. ¿Cuál superficie tiene más sombras pequeñas?',
            type: 'observation',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué superficie es más rugosa?',
            options: ['Una mesa', 'Un camino de grava', 'Una hoja de papel'],
            answer: 1,
            explanation: 'La grava tiene muchas piedras pequeñas: es irregular.',
          },
          {
            question: '¿Qué pasa con el eco del radar en un suelo liso?',
            options: ['Casi todo regresa al satélite', 'Se va hacia otro lado y casi nada regresa', 'Se queda pegado al suelo'],
            answer: 1,
            explanation: 'En un suelo liso la onda rebota como en un espejo y se aleja del satélite.',
          },
        ],
        conclusion:
          'Un lugar puede ser plano y rocoso a la vez. Por eso los científicos no solo miran la pendiente: también usan el radar para saber si hay piedras que estorben a un vehículo.',
      },
      teacher: {
        objectives: ['Distinguir un suelo liso de uno rugoso.', 'Explicar de forma sencilla cómo un eco revela la rugosidad.'],
        priorKnowledge: ['Noción de eco (por ejemplo, el sonido en un cañón).', 'Saber qué es un satélite.'],
        materials: ['Lámpara', 'Hoja lisa', 'Charola con grava o arena gruesa', 'Hojas y lápices'],
        explanation:
          'Lo esencial: la rugosidad son irregularidades pequeñas; el radar las detecta porque una superficie rugosa devuelve más eco. Error frecuente: confundir rugosidad con pendiente; un terreno puede ser plano y muy rocoso.',
        steps: [
          { title: 'Tocar texturas', description: 'Los niños tocan una mesa y una charola de grava y describen la diferencia.', minutes: 6 },
          { title: 'El eco', description: 'Explique con la figura cómo rebota la señal del radar.', minutes: 8 },
          { title: 'Luz rasante', description: 'Realicen la actividad de la lámpara y dibujen las sombras.', minutes: 15 },
          { title: 'Laguna y Luna', description: 'Muestre en la escala dónde quedan Laguna Salada y Mare Tranquillitatis.', minutes: 7 },
          { title: 'Cierre', description: 'Comprobación de dos preguntas.', minutes: 4 },
        ],
        discussion: ['¿Por qué un vehículo lunar tendría problemas en un suelo rocoso?', '¿Dónde has visto un suelo muy liso? ¿Y uno muy rugoso?'],
        dataActivity: {
          title: '¿Quién es más liso?',
          description:
            'Con la escala del eje, los niños dicen cuál de los dos sitios queda más a la izquierda (más liso). La Laguna Salada tiene [[earth laguna roughness]] y Mare Tranquillitatis [[moon laguna roughness]].',
          minutes: 8,
        },
        assessment: ['Pedir que dibujen un suelo liso y uno rugoso con el eco del radar.', 'Escuchar si distinguen rugosidad de pendiente.'],
        outcomes: ['El grupo describe la rugosidad con ejemplos.', 'El grupo explica que el radar recibe más eco de un suelo rocoso.'],
        alternative: {
          title: 'Pelota que rebota',
          description: 'Lance una pelota contra el piso liso y contra un tapete o pasto: en el liso rebota lejos; en el irregular cambia de dirección.',
          type: 'demonstration',
          materials: ['Pelota pequeña'],
        },
        siteActivities: ['Observar en fotos la superficie lisa de la Laguna Salada.', 'Comparar con fotos del suelo rocoso de la Sierra Cucapá.'],
      },
    },

    measurement: {
      summary: 'Retrodispersión, polarización y percentiles: cómo se compara la rugosidad con dos radares distintos.',
      student: {
        introduction:
          'Sentinel-1 mira la Tierra y Mini-RF miró la Luna. Los dos son radares, pero usan longitudes de onda, polarizaciones y resoluciones distintas. ¿Cómo se comparan sus números sin hacer trampa? Esta lección trata de esa pregunta de método.',
        blocks: [
          {
            id: 'retrodispersion',
            title: 'Retrodispersión y polarización',
            body: 'Cuando un radar ilumina el suelo, la fracción de energía que regresa se llama retrodispersión. Una superficie rugosa a escala de la longitud de onda la dispersa en muchas direcciones, y además cambia la polarización de la onda.\n\nSentinel-1 (banda C, unos 5.6 cm) compara la señal que regresa con polarización cruzada (VH) contra la que regresa igual (VV). Mini-RF (banda S, unos 12.6 cm) usa la razón de polarización circular (CPR). En los dos, un valor más alto suele indicar más rugosidad a escala de decímetros.',
            visual: 'radar-scatter',
          },
          {
            id: 'percentil',
            title: 'Por qué se comparan percentiles',
            body: 'Un decibel de Sentinel-1 y un CPR de Mini-RF no son la misma magnitud: compararlos directamente no tiene sentido físico. El equipo convierte cada valor en un percentil dentro de su propio cuerpo.\n\nEl Elegante midió [[rawE elegante roughness]], que es el percentil [[earth elegante roughness]] entre los desiertos del noroeste de México. Linné midió [[rawM elegante roughness]], el percentil [[moon elegante roughness]] entre toda la Luna. Lo que se compara son esas posiciones relativas.',
          },
          {
            id: 'limites',
            title: 'Lo que el método no resuelve',
            body: 'Un percentil dice «qué tan rugoso para su mundo», no «qué tan rugoso en metros». Además, los píxeles son muy distintos: 10 m en Sentinel-1 y cerca de 950 m en el producto de Mini-RF usado. Por eso este eje tiene confianza [[conf roughness]]: necesita una población de referencia y no es una medición directa comparable.',
          },
        ],
        concepts: [
          { term: 'Retrodispersión', definition: 'Fracción de la energía del radar que regresa al sensor; se expresa en decibeles (dB).' },
          { term: 'Polarización', definition: 'Orientación con la que vibra la onda. Una superficie rugosa cambia la polarización de la señal reflejada.' },
          { term: 'Razón de polarización circular (CPR)', definition: 'Cociente entre las dos polarizaciones circulares que regresan a Mini-RF; aumenta con la rugosidad y los bloques.' },
          { term: 'Percentil dentro del cuerpo', definition: 'Posición de un valor, de 0 a 1, frente a una población de referencia de su propio cuerpo.' },
        ],
        earth: 'Sentinel-1 RTC, razón VH/VV en dB a 10 m. El Elegante: [[rawE elegante roughness]] (percentil [[earth elegante roughness]]). Pinacate: [[rawE pinacate roughness]] (percentil [[earth pinacate roughness]]).',
        moon: 'LRO Mini-RF, CPR en banda S. Linné: [[rawM elegante roughness]] (percentil [[moon elegante roughness]]). Marius Hills: [[rawM pinacate roughness]] (percentil [[moon pinacate roughness]]).',
        comparisonLead: 'Lee el valor normalizado y abre «Fuente y método» para ver el valor crudo de cada radar y la población de referencia.',
        facts: [
          'Mini-RF voló en la sonda LRO, en órbita lunar desde 2009, y también se usó para buscar hielo en cráteres polares.',
          'La banda C de Sentinel-1 atraviesa nubes, por eso se usa para vigilar inundaciones y deformaciones del terreno.',
          'El Elegante ↔ Linné tiene una similitud de [[s elegante roughness]] en rugosidad, aunque sus valores crudos estén en unidades distintas.',
        ],
        activities: [
          {
            title: 'Percentil en el salón',
            description:
              'Midan la estatura de todo el grupo y conviertan la de cada quien en percentil. Luego hagan lo mismo con otro grupo medido en otra unidad (por ejemplo, en «palmas»). Discutan por qué ahora sí pueden comparar a dos personas de grupos distintos.',
            type: 'calculation',
            minutes: 20,
          },
        ],
        quiz: [
          {
            question: '¿Por qué no se comparan directamente los dB de Sentinel-1 con el CPR de Mini-RF?',
            options: ['Porque miden cosas físicas distintas con instrumentos distintos', 'Porque Mini-RF ya no funciona', 'Porque los dB siempre son negativos', 'Porque la Luna no refleja ondas de radio'],
            answer: 0,
            explanation: 'Distinta longitud de onda, polarización y procesamiento: los números crudos no están en la misma escala.',
          },
          {
            question: 'Un percentil de [[moon pinacate roughness]] en Marius Hills significa que…',
            options: [
              'su rugosidad es de esa cantidad de metros',
              'es más rugoso que esa fracción de los lugares de la Luna',
              'su CPR es igual a ese número',
              'el radar falló en esa fracción de píxeles',
            ],
            answer: 1,
            explanation: 'El percentil es una posición relativa dentro de la población lunar.',
          },
          {
            question: '¿Qué limitación tiene comparar percentiles?',
            options: ['Ninguna', 'No dice qué tan rugoso es en términos absolutos', 'Solo funciona en la Tierra', 'Obliga a usar el mismo radar'],
            answer: 1,
            explanation: 'Un percentil es relativo a su población: dos sitios con el mismo percentil pueden tener rugosidades absolutas distintas.',
          },
          {
            question: '¿Qué indica la confianza [[conf roughness]] de este eje?',
            options: ['Dato satelital directo y comparable', 'Necesita calibración o una población de referencia', 'Es solo una estimación de contexto', 'El dato es inventado'],
            answer: 1,
            explanation: 'B significa que el dato requiere un paso de normalización para poder compararse.',
          },
        ],
        conclusion:
          'Comparar con instrumentos distintos exige transformar los datos con cuidado. El percentil resuelve la diferencia de unidades, pero a cambio solo dice dónde queda cada sitio dentro de su propio mundo. Saber qué pierde un método es tan importante como saber qué gana.',
      },
      teacher: {
        objectives: [
          'Explicar la retrodispersión y el papel de la polarización en la detección de rugosidad.',
          'Justificar la normalización por percentil dentro de cada cuerpo.',
          'Evaluar las limitaciones del método (escala, población de referencia, resolución).',
        ],
        priorKnowledge: ['Ondas electromagnéticas y longitud de onda.', 'Escala logarítmica (decibeles).', 'Percentiles y distribución de datos.'],
        materials: ['Cinta métrica', 'Hojas de cálculo o calculadora', 'Proyector para la figura de radar'],
        explanation:
          'Lo esencial: la rugosidad se infiere del eco del radar y de su polarización; como los instrumentos son distintos, cada sitio se ubica en el percentil de su cuerpo. Error frecuente: creer que el percentil iguala las rugosidades absolutas; solo iguala posiciones relativas.',
        steps: [
          { title: 'Problema de método', description: 'Plantee: «Tengo dos termómetros distintos y no sé convertir uno al otro. ¿Cómo comparo?».', minutes: 6 },
          { title: 'Radar y polarización', description: 'Explique retrodispersión, VH/VV y CPR con la figura.', minutes: 12 },
          { title: 'Percentiles', description: 'Actividad de estaturas en dos unidades.', minutes: 15 },
          { title: 'Datos reales', description: 'Revisen El Elegante ↔ Linné y Pinacate ↔ Marius Hills: valor crudo, percentil y similitud.', minutes: 10 },
          { title: 'Cierre crítico', description: 'Discutan qué pierde el método y respondan la comprobación.', minutes: 7 },
        ],
        discussion: [
          '¿Qué pasaría con el percentil de El Elegante si la población de referencia fueran todos los desiertos del mundo?',
          '¿Por qué la diferencia de resolución (10 m frente a ~950 m) es un problema?',
          '¿Qué dato adicional mejoraría la confianza de este eje?',
        ],
        dataActivity: {
          title: 'Crudo contra normalizado',
          description:
            'Muestre que Pinacate ([[rawE pinacate roughness]]) y Marius Hills ([[rawM pinacate roughness]]) no se pueden restar. Luego usen los percentiles ([[earth pinacate roughness]] y [[moon pinacate roughness]]) y la tolerancia R = [[R roughness]] para explicar por qué la similitud es [[s pinacate roughness]].',
          minutes: 12,
        },
        assessment: [
          'Ensayo breve: ventajas y límites de normalizar por percentil.',
          'Ejercicio: dado un percentil, explicar qué significa y qué no significa.',
        ],
        outcomes: [
          'El grupo explica cómo el radar detecta rugosidad.',
          'El grupo justifica la normalización por percentil.',
          'El grupo identifica al menos dos limitaciones del método.',
        ],
        alternative: {
          title: 'Ranking sin internet',
          description: 'Entregue dos listas de valores (una en dB, otra en CPR) inventadas por el docente como ejemplo didáctico; los alumnos calculan percentiles y comparan posiciones.',
          type: 'exercise',
          materials: ['Listas impresas', 'Calculadora'],
        },
        siteActivities: ['Comparar fotos del campo de lava del Pinacate con las de su fondo de cráter.', 'Discutir qué escala de rugosidad «ve» cada radar.'],
      },
    },

    analogs: {
      summary: 'Domos, sierras y campos de lava: tres pares que se parecen, o no, en rugosidad.',
      student: {
        introduction:
          'Ya sabes que la rugosidad se compara por percentiles. Ahora vas a usarla para comparar tres pares de sitios. Uno se parece muchísimo; los otros dos, bastante menos.',
        blocks: [
          {
            id: 'domos',
            title: 'Cerro Prieto y los domos de Gruithuisen',
            body: 'Cerro Prieto, cerca de Mexicali, es un domo de dacita. Su percentil de rugosidad es [[earth cerro roughness]]. Los domos de Gruithuisen están en el borde de Mare Imbrium y tienen [[moon cerro roughness]].\n\nLa similitud es [[s cerro roughness]]: los dos sitios ocupan casi la misma posición dentro de su mundo.',
            imageId: 'gruithuisen-apollo15',
          },
          {
            id: 'sierra',
            title: 'Sierra Cucapá y el borde de Shackleton',
            body: 'La Sierra Cucapá es rocosa, pero frente a otros desiertos de la región queda en el percentil [[earth cucapa roughness]]. El borde de Shackleton es de los lugares más rugosos de la Luna: [[moon cucapa roughness]].\n\nResultado: similitud de [[s cucapa roughness]]. La sierra es rugosa para la Tierra, pero el borde de Shackleton lo es todavía más para la Luna.',
            visual: 'radar-scatter',
          },
          {
            id: 'lava',
            title: 'El Pinacate y Marius Hills',
            body: 'El Pinacate queda en el percentil [[earth pinacate roughness]] y Marius Hills en [[moon pinacate roughness]]: similitud de [[s pinacate roughness]]. Aunque los dos son campos volcánicos, el área lunar estudiada es más rugosa dentro de la Luna que el escudo del Pinacate dentro de los desiertos de la región.',
          },
        ],
        concepts: [
          { term: 'Domo volcánico', definition: 'Montículo formado por lava espesa que se acumula alrededor de la abertura.' },
          { term: 'Campo volcánico', definition: 'Región con muchos conos, coladas y cráteres de origen volcánico.' },
          { term: 'Posición relativa', definition: 'Dónde queda un sitio frente a los demás de su grupo; es lo que compara el percentil.' },
        ],
        earth: 'Tres sitios de la región: Cerro Prieto ([[earth cerro roughness]]), Sierra Cucapá ([[earth cucapa roughness]]) y El Pinacate ([[earth pinacate roughness]]), en percentil dentro de los desiertos del noroeste de México.',
        moon: 'Tres sitios lunares: Gruithuisen ([[moon cerro roughness]]), el borde de Shackleton ([[moon cucapa roughness]]) y Marius Hills ([[moon pinacate roughness]]), en percentil dentro de toda la Luna.',
        comparisonLead: 'Busca el par con la línea más corta. Después piensa por qué dos lugares «rocosos» pueden quedar lejos en la escala.',
        facts: [
          'Cerro Prieto está junto a uno de los campos geotérmicos más grandes del mundo, que produce electricidad con el calor del subsuelo.',
          'Los domos de Gruithuisen son raros en la Luna: casi todo el volcanismo lunar fue basáltico.',
          'Cerro Prieto ↔ Gruithuisen tiene una exactitud de [[ils cerro]], con [[completeness cerro]] de completitud.',
        ],
        activities: [
          {
            title: 'Rugoso para su mundo',
            description:
              'Escribe en una tarjeta por qué la Sierra Cucapá puede ser «menos rugosa» que el borde de Shackleton en percentil, aunque las dos sean terrenos rocosos. Compara tu respuesta con la de un compañero.',
            type: 'reflection',
            minutes: 12,
          },
        ],
        quiz: [
          {
            question: '¿Qué par se parece más en rugosidad?',
            options: ['Cerro Prieto ↔ Gruithuisen', 'Sierra Cucapá ↔ Shackleton', 'Pinacate ↔ Marius Hills'],
            answer: 0,
            explanation: 'Su similitud es [[s cerro roughness]]: sus percentiles casi coinciden.',
          },
          {
            question: 'El borde de Shackleton tiene percentil [[moon cucapa roughness]]. ¿Qué significa?',
            options: ['Es más liso que casi toda la Luna', 'Es más rugoso que la mayor parte de la Luna', 'Mide esa cantidad de metros de altura'],
            answer: 1,
            explanation: 'Un percentil alto indica que supera en rugosidad a la mayoría de los lugares de su cuerpo.',
          },
          {
            question: '¿Por qué dos sitios rocosos pueden tener baja similitud en este eje?',
            options: [
              'Porque cada uno se compara con su propio mundo y pueden quedar en posiciones distintas',
              'Porque el radar no ve las rocas',
              'Porque la similitud siempre es baja',
            ],
            answer: 0,
            explanation: 'El percentil compara posiciones dentro de cada cuerpo, no las rocas directamente.',
          },
        ],
        conclusion:
          'Parecerse en rugosidad significa ocupar una posición parecida dentro de su propio mundo. Cerro Prieto y Gruithuisen lo logran; la Sierra Cucapá y Shackleton, no tanto. Leer bien qué compara un eje evita conclusiones equivocadas.',
      },
      teacher: {
        objectives: [
          'Interpretar similitudes de rugosidad basadas en percentiles.',
          'Explicar por qué sitios rocosos pueden tener baja similitud.',
          'Relacionar la rugosidad con la elección de rutas y sitios.',
        ],
        priorKnowledge: ['Qué es un percentil.', 'Diferencia entre rugosidad y pendiente.'],
        materials: ['Proyector o tabla impresa', 'Tarjetas de cartulina'],
        explanation:
          'Lo esencial: este eje compara posiciones relativas. Cerro Prieto ↔ Gruithuisen ([[s cerro roughness]]) coinciden; Cucapá ↔ Shackleton ([[s cucapa roughness]]) y Pinacate ↔ Marius Hills ([[s pinacate roughness]]) no. Error frecuente: pensar que «rocoso» en la Tierra equivale a «rocoso» en la Luna.',
        steps: [
          { title: 'Repaso', description: 'Recuerde qué es un percentil dentro de cada cuerpo.', minutes: 5 },
          { title: 'Tres pares', description: 'Presente los tres pares con fotos y percentiles.', minutes: 12 },
          { title: 'Rugoso para su mundo', description: 'Actividad individual y en parejas.', minutes: 12 },
          { title: 'Puesta en común', description: 'Discutan el caso de Shackleton y la Sierra Cucapá.', minutes: 13 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 8 },
        ],
        discussion: [
          '¿Qué ventaja tiene un sitio lunar en un percentil bajo de rugosidad para un vehículo?',
          '¿Cambiaría la comparación si se usara la población de desiertos de todo el mundo?',
          '¿Qué otro eje revisarías para completar la comparación de Cerro Prieto y Gruithuisen?',
        ],
        dataActivity: {
          title: 'Mapa de posiciones',
          description:
            'Dibujen dos reglas de 0 a 1 (Tierra y Luna) y marquen los seis percentiles. Unan con hilo los sitios de cada par y midan cuál hilo queda más inclinado.',
          minutes: 12,
        },
        assessment: ['Revisar la tarjeta «Rugoso para su mundo».', 'Pedir que ordenen los tres pares por similitud y lo justifiquen.'],
        outcomes: ['El grupo interpreta percentiles en contexto.', 'El grupo explica una ruptura de la analogía en rugosidad.'],
        alternative: {
          title: 'Reglas de papel',
          description: 'Sin proyector: entregue dos reglas impresas con los percentiles para que los alumnos unan los pares con líneas.',
          type: 'printable',
          materials: ['Reglas impresas', 'Lápices de colores'],
        },
        siteActivities: ['Observar la textura del domo de Cerro Prieto en una imagen satelital.', 'Comparar las laderas de la Sierra Cucapá con el fondo del valle.'],
      },
    },
  },
};
