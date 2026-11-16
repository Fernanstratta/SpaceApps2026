import type { AxisCurriculumText } from '../types';

/** Eje 7 · Humedad y estabilidad del hielo. Concepto (primaria) → medición (preparatoria) → análogos (preparatoria). */
export const iceEs: AxisCurriculumText = {
  student: {
    tagline: '¿Hay agua en la Luna?',
    overview:
      'En la Tierra el agua está en todas partes. En la Luna casi no hay, pero en los polos podría haber hielo escondido en cráteres que nunca ven el Sol. Ese hielo es uno de los recursos más importantes para una base lunar.\n\nAprenderás a distinguir hielo en la superficie, hielo bajo la superficie y regiones en sombra permanente, y por qué dos lugares «secos» no se parecen tanto como indica un 100.',
  },
  teacher: {
    tagline: 'Hielo: clases gruesas, sustitutos de datos y la trampa de la similitud por ausencia',
    overview:
      'Se presentan las cuatro clases del eje (0 a 3), la estabilidad del hielo según la temperatura máxima y el caso del borde de Shackleton ([[moon cucapa ice]], hielo solo bajo la superficie en una parte del área). Se discute la «similitud por ausencia» de Laguna Salada ↔ Tranquillitatis. Confianza [[conf ice]]: clases gruesas y productos sustitutos.',
    objectives: [
      'Distinguir hielo superficial, hielo subsuperficial y regiones en sombra permanente.',
      'Explicar la estabilidad térmica del hielo y el umbral de unos 110 K.',
      'Interpretar críticamente la «similitud por ausencia».',
    ],
  },
  submodules: {
    concept: {
      summary: 'Por qué el hielo puede durar en los cráteres oscuros del polo lunar y no en el desierto.',
      student: {
        introduction:
          'Si dejas un hielo al Sol, se derrite en minutos. En la Luna, el Sol calienta tanto que el hielo desaparecería. Pero en el polo sur hay cráteres tan profundos que su fondo nunca recibe luz. Ahí el hielo puede durar miles de millones de años.',
        blocks: [
          {
            id: 'sombra',
            title: 'Cráteres siempre en sombra',
            body: 'En el polo sur lunar el Sol se ve siempre bajito, en el horizonte. El borde de un cráter recibe luz, pero el fondo queda en sombra para siempre. Ahí hace tanto frío que el hielo no se escapa.\n\nEl borde iluminado de Shackleton solo guarda un poco de hielo bajo el suelo. El interior oscuro podría tener mucho más.',
            visual: 'ice-section',
          },
          {
            id: 'cucapa',
            title: 'Un desierto seco',
            body: 'La Sierra Cucapá es muy seca: su clase de hielo y humedad es [[earth cucapa ice]]. El borde de Shackleton tiene [[moon cucapa ice]]: hay un poco de hielo, pero escondido bajo la superficie y solo en una parte del área.',
            imageId: 'shackleton-lroc',
          },
        ],
        concepts: [
          { term: 'Hielo', definition: 'Agua congelada. En la Luna puede durar solo donde hace muchísimo frío.' },
          { term: 'Sombra permanente', definition: 'Lugar que nunca recibe luz directa del Sol.' },
          { term: 'Polo', definition: 'El extremo norte o sur de un mundo, donde el Sol se ve siempre bajo.' },
        ],
        earth: 'La Sierra Cucapá es un desierto: [[earth cucapa ice]]. Casi nunca hay agua en su suelo.',
        moon: 'El borde de Shackleton es [[moon cucapa ice]]: tiene un poco de hielo bajo la superficie. ¡Pero no hay hielo encima del suelo!',
        comparisonLead: 'Mira las dos marcas: van de 0 (seco) a 3 (hielo estable). ¿Cuál tiene más hielo?',
        facts: [
          'El hielo de los polos lunares podría convertirse en agua para beber, oxígeno para respirar y combustible para cohetes.',
          'El cráter Shackleton mide unos 21 km de ancho; su fondo nunca ha recibido luz directa del Sol.',
        ],
        activities: [
          {
            title: 'Hielo en la sombra',
            description:
              'Pon un hielo al Sol y otro dentro de una caja cerrada a la sombra. Revisa cada 5 minutos. ¿Cuál dura más? La caja es como un cráter en sombra.',
            type: 'observation',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Dónde puede durar el hielo en la Luna?',
            options: ['En lugares siempre iluminados', 'En cráteres que nunca reciben luz del Sol', 'En los mares lunares'],
            answer: 1,
            explanation: 'En la sombra permanente hace tanto frío que el hielo se conserva.',
          },
          {
            question: '¿El borde de Shackleton tiene hielo sobre el suelo?',
            options: ['Sí, mucho', 'No; solo un poco bajo la superficie', 'No se sabe nada'],
            answer: 1,
            explanation: 'Es clase [[moon cucapa ice]]: el hielo está bajo la superficie y en una parte del área.',
          },
        ],
        conclusion:
          'El hielo lunar está escondido en los lugares más fríos y oscuros. La Sierra Cucapá es seca y el borde de Shackleton tiene un poco de hielo bajo el suelo. Por eso no son iguales en este eje.',
      },
      teacher: {
        objectives: ['Explicar por qué el hielo dura en la sombra.', 'Distinguir entre el borde iluminado y el interior oscuro de un cráter polar.'],
        priorKnowledge: ['El hielo se derrite con el calor.', 'La Luna no tiene aire ni lluvia.'],
        materials: ['Dos cubos de hielo', 'Una caja de cartón', 'Platos', 'Reloj'],
        explanation:
          'Lo esencial: el hielo lunar es estable solo donde hace muchísimo frío, como el fondo de cráteres polares en sombra permanente. El borde de Shackleton es [[moon cucapa ice]]: hielo bajo la superficie en una parte del área, no hielo superficial. Error frecuente: decir que el borde «tiene hielo»; el hielo estable está en el interior.',
        steps: [
          { title: 'Hielo al Sol', description: 'Pregunte qué le pasa a un hielo al Sol y monten el experimento.', minutes: 6 },
          { title: 'El polo lunar', description: 'Explique con la figura el Sol rasante y la sombra permanente.', minutes: 10 },
          { title: 'Observación', description: 'Revisen los hielos cada 5 minutos y registren.', minutes: 12 },
          { title: 'Cucapá y Shackleton', description: 'Comparen las clases [[earth cucapa ice]] y [[moon cucapa ice]].', minutes: 8 },
          { title: 'Cierre', description: 'Comprobación de dos preguntas.', minutes: 4 },
        ],
        discussion: ['¿Para qué serviría el hielo a los astronautas?', '¿Por qué no hay hielo en la Sierra Cucapá?'],
        dataActivity: {
          title: 'Escalera del hielo',
          description: 'Dibuje una escalera de 4 escalones (clases 0 a 3). Los niños colocan la Sierra Cucapá ([[earth cucapa ice]]) y el borde de Shackleton ([[moon cucapa ice]]).',
          minutes: 6,
        },
        assessment: ['Escuchar si explican por qué el hielo dura en la sombra.', 'Revisar que no digan que el borde tiene hielo sobre el suelo.'],
        outcomes: ['El grupo relaciona frío y sombra con hielo estable.', 'El grupo distingue el borde del interior del cráter.'],
        alternative: {
          title: 'Linterna y vaso',
          description: 'Con una linterna rasante sobre un vaso, muestre que el fondo queda en sombra aunque el borde se ilumine.',
          type: 'demonstration',
          materials: ['Linterna', 'Vaso o taza'],
        },
        siteActivities: ['Observar dónde queda sombra todo el día en el patio.', 'Comparar fotos de Shackleton con su borde iluminado y su interior oscuro.'],
      },
    },

    measurement: {
      summary: 'Clases de hielo, estabilidad térmica y productos sustitutos: cómo se construye un eje de confianza [[conf ice]].',
      student: {
        introduction:
          'Detectar hielo y saber si puede durar son dos preguntas distintas. Este eje usa la segunda: si las condiciones permiten que el agua o el hielo se conserven. En la Tierra se usa la humedad del suelo; en la Luna, las temperaturas máximas. Las dos se reducen a una clase de 0 a 3.',
        blocks: [
          {
            id: 'clases',
            title: 'Cuatro clases',
            body: 'Clase 0: seco. Clase 1: hielo o humedad en una fracción menor del área. Clase 2: humedad persistente o congelamiento estacional. Clase 3: hielo estable.\n\nEs una escala gruesa: resume situaciones muy distintas en cuatro valores. Por eso la tolerancia es R = [[R ice]], toda la escala.',
            visual: 'ice-section',
          },
          {
            id: 'luna',
            title: 'En la Luna: estabilidad térmica',
            body: 'El hielo en el vacío es estable donde la temperatura máxima no pasa de unos 110 K. Diviner mapeó las temperaturas de los polos y, con modelos térmicos (Paige et al., 2010), se calcula a qué profundidad se mantiene ese frío.\n\nEn el borde de Shackleton la superficie se calienta demasiado, pero a unos 0.6 m de profundidad el hielo sería estable en cerca del 10 % del área. Por eso es clase [[moon cucapa ice]]. El interior, siempre en sombra, sería clase 3.',
          },
          {
            id: 'tierra',
            title: 'En la Tierra: un producto sustituto',
            body: 'El producto previsto era SMAP, que mide la humedad del suelo con un radiómetro de microondas, pero requiere cuenta de NASA Earthdata. Se usa MERRA-2 (NASA POWER), un reanálisis con celdas de unos 50 km: un valor regional, mucho más grande que el área de análisis.\n\nLa Sierra Cucapá y la Laguna Salada dan clase [[earth cucapa ice]] y [[earth laguna ice]].',
          },
          {
            id: 'ausencia',
            title: 'Detección no es estabilidad',
            body: 'Que el hielo pueda ser estable no prueba que esté ahí. La detección usa otros datos: neutrones (LEND, Lunar Prospector), espectros, radar. El eje solo mide si el lugar permite conservar hielo. Esa distinción también la marca el backend como ruptura de la analogía en Cucapá ↔ Shackleton.',
          },
        ],
        concepts: [
          { term: 'Estabilidad térmica del hielo', definition: 'Condición en la que el hielo no se sublima en escalas de tiempo geológicas; en la Luna, temperatura máxima ≲ 110 K.' },
          { term: 'Región en sombra permanente (PSR)', definition: 'Zona polar que nunca recibe luz solar directa; puede ser trampa fría de volátiles.' },
          { term: 'Hielo subsuperficial', definition: 'Hielo estable bajo una capa de regolito que lo aísla del calor de la superficie.' },
          { term: 'Reanálisis', definition: 'Conjunto de datos que combina observaciones y un modelo para estimar variables en celdas regulares.' },
        ],
        earth: 'MERRA-2 (NASA POWER), humedad del suelo en celdas de unos 50 km, sustituto de SMAP. Sierra Cucapá: [[earth cucapa ice]]; Laguna Salada: [[earth laguna ice]].',
        moon: 'Diviner + modelo térmico. Borde de Shackleton: [[moon cucapa ice]] (hielo estable a ~0.6 m en ~10 % del área). Mare Tranquillitatis: [[moon laguna ice]], valor de referencia fuera de los polos.',
        comparisonLead: 'Compara los dos pares: uno tiene clases distintas y el otro clases iguales. Revisa la insignia «Similitud por ausencia».',
        facts: [
          'En 2009, la misión LCROSS impactó el cráter Cabeus, cerca del polo sur, y detectó agua en la nube de material levantada.',
          'Algunos cráteres polares superan en frío a la superficie de Plutón.',
          'Este eje tiene confianza [[conf ice]]: clases gruesas y productos de escala regional.',
        ],
        activities: [
          {
            title: '¿Detectar o conservar?',
            description:
              'Haz una tabla con dos columnas: «evidencia de que el hielo puede conservarse» y «evidencia de que el hielo está presente». Clasifica: temperatura máxima, neutrones, radar, espectros, sombra permanente. Justifica cada caso.',
            type: 'reflection',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué mide este eje en la Luna?',
            options: ['Si hay hielo detectado', 'Si las condiciones térmicas permiten conservar hielo', 'La cantidad exacta de agua', 'La humedad del aire'],
            answer: 1,
            explanation: 'Es un eje de estabilidad; la detección usa otros instrumentos.',
          },
          {
            question: '¿Por qué el borde de Shackleton es clase [[moon cucapa ice]] y no 3?',
            options: [
              'Porque la superficie del borde se calienta y el hielo solo sería estable bajo ella en una parte del área',
              'Porque no tiene sombra',
              'Porque es un sitio terrestre',
              'Porque el dato es provisional',
            ],
            answer: 0,
            explanation: 'Hielo estable a ~0.6 m en ~10 % del área: clase [[moon cucapa ice]]. El interior sí sería clase 3.',
          },
          {
            question: '¿Qué limitación tiene el dato terrestre?',
            options: ['Es inventado', 'Viene de un producto sustituto con celdas de ~50 km', 'Se midió con Diviner', 'Tiene resolución de 1 m'],
            answer: 1,
            explanation: 'MERRA-2 reemplaza a SMAP y da un valor regional.',
          },
          {
            question: 'Si dos sitios son clase 0, ¿qué significa su similitud de [[s laguna ice]]?',
            options: ['Que los dos tienen mucho hielo', 'Que los dos son secos, nada más', 'Que son idénticos', 'Que el eje pesa más'],
            answer: 1,
            explanation: 'Es «similitud por ausencia»: coinciden en no tener; por eso el peso baja.',
          },
        ],
        conclusion:
          'El eje del hielo resume mucha física en cuatro clases y usa productos de escala regional. Por eso su confianza es C. Leerlo bien exige distinguir entre conservar y detectar, y entre parecerse por tener y parecerse por no tener.',
      },
      teacher: {
        objectives: [
          'Explicar el criterio de estabilidad térmica del hielo lunar.',
          'Distinguir estabilidad, detección, hielo superficial y subsuperficial.',
          'Evaluar los efectos de la escala y del producto sustituto.',
        ],
        priorKnowledge: ['Cambios de estado y sublimación.', 'Temperatura en kelvin.', 'Resolución espacial.'],
        materials: ['Proyector', 'Hojas de trabajo'],
        explanation:
          'Lo esencial: la clase lunar sale de la estabilidad térmica (Tmax ≲ 110 K, Paige et al., 2010); el borde de Shackleton es clase [[moon cucapa ice]]. La clase terrestre sale de MERRA-2. Error frecuente: confundir estabilidad con detección, y leer «similitud por ausencia» como coincidencia positiva.',
        steps: [
          { title: 'Dos preguntas', description: '«¿Hay hielo?» frente a «¿Puede haber hielo?». Pida ejemplos de cada una.', minutes: 6 },
          { title: 'Clases y estabilidad', description: 'Explique la escala 0–3 y el umbral térmico con la figura.', minutes: 12 },
          { title: '¿Detectar o conservar?', description: 'Actividad de clasificación de evidencias.', minutes: 15 },
          { title: 'Datos reales', description: 'Comparen Cucapá ↔ Shackleton y Laguna Salada ↔ Tranquillitatis, con sus advertencias.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de cuatro preguntas.', minutes: 7 },
        ],
        discussion: [
          '¿Qué información se pierde al resumir la humedad en cuatro clases?',
          '¿Cómo cambiaría el dato terrestre si se pudiera usar SMAP?',
          '¿Debería un índice dar similitud 100 a dos sitios secos? ¿Qué alternativa propondrías?',
        ],
        dataActivity: {
          title: 'Peso y ausencia',
          description:
            'Comparen la ficha del eje en los dos pares: Cucapá ↔ Shackleton (similitud [[s cucapa ice]], peso [[w cucapa ice]]) y Laguna Salada ↔ Tranquillitatis (similitud [[s laguna ice]], con la insignia de ausencia). Expliquen por qué el backend baja el peso en el segundo caso.',
          minutes: 10,
        },
        assessment: ['Revisar la tabla de evidencias.', 'Argumento escrito sobre la similitud por ausencia.'],
        outcomes: [
          'El grupo explica la estabilidad térmica del hielo.',
          'El grupo distingue detección y estabilidad.',
          'El grupo interpreta la similitud por ausencia.',
        ],
        alternative: {
          title: 'Tarjetas de evidencia',
          description: 'Imprima tarjetas con tipos de evidencia; los equipos las clasifican en «estabilidad» o «detección».',
          type: 'printable',
          materials: ['Tarjetas impresas'],
        },
        siteActivities: ['Discutir dónde se acumula humedad en la sierra después de una lluvia.', 'Comparar el tamaño de una celda de 50 km con el área de análisis en un mapa.'],
      },
    },

    analogs: {
      summary: 'Seco contra helado: Cucapá ↔ Shackleton y la trampa de la similitud por ausencia.',
      student: {
        introduction:
          'En este eje solo dos pares merecen análisis. Uno compara un desierto con el borde de un cráter polar; el otro, dos lugares secos. Los números engañan si no se leen con cuidado.',
        blocks: [
          {
            id: 'contraste',
            title: 'Cucapá ↔ Shackleton: el contraste',
            body: 'La Sierra Cucapá es clase [[earth cucapa ice]] y el borde de Shackleton clase [[moon cucapa ice]]. Con R = [[R ice]], la similitud que da el backend es [[s cucapa ice]] y el eje entra con su peso completo, [[w cucapa ice]].\n\nEl backend advierte: la iluminación polar crea sombras persistentes, y la estabilidad térmica del hielo y su detección son observaciones distintas.',
            visual: 'ice-section',
          },
          {
            id: 'ausencia',
            title: 'Laguna Salada ↔ Tranquillitatis: los dos secos',
            body: 'La Laguna Salada y Mare Tranquillitatis son clase 0. La similitud sale [[s laguna ice]], pero no significa una coincidencia fuerte: los dos sitios coinciden en no tener hielo.\n\nPor eso el backend marca «similitud por ausencia» y baja el peso del eje a [[w laguna ice]] en ese par, de modo que cuente menos en la exactitud. Pasa lo mismo en los otros tres pares que no son polares.',
            visualPair: 'laguna_salada_tranquillitatis',
          },
          {
            id: 'rupturas',
            title: 'Dónde se rompe la analogía',
            body: 'Ningún sitio de la región tiene hielo estable: el análogo terrestre del hielo lunar habría que buscarlo en regiones polares de la Tierra, con procesos muy distintos. El valor terrestre, además, viene de celdas de unos 50 km.\n\nLa lección clave: un [[s laguna ice]] puede ser menos informativo que un [[s cucapa ice]].',
          },
        ],
        concepts: [
          { term: 'Similitud por ausencia', definition: 'Similitud alta porque los dos sitios carecen de la propiedad; el backend la marca y le baja el peso.' },
          { term: 'Peso ajustado', definition: 'Cambio de peso que aplica el backend a un eje en un par concreto; aquí, de [[weight ice]] a [[w laguna ice]].' },
          { term: 'Trampa fría', definition: 'Región tan fría que atrapa moléculas volátiles, como el agua, por tiempos muy largos.' },
          { term: 'Información de un dato', definition: 'Cuánto distingue un valor entre posibilidades; coincidir en «nada» distingue poco.' },
        ],
        earth: 'Dos sitios secos de la región: la Sierra Cucapá ([[earth cucapa ice]]) y la Laguna Salada ([[earth laguna ice]]), con humedad de MERRA-2 en celdas de ~50 km.',
        moon: 'El borde de Shackleton ([[moon cucapa ice]], hielo solo bajo la superficie en una parte del área) y Mare Tranquillitatis ([[moon laguna ice]], fuera de los polos).',
        comparisonLead: 'Revisa la ficha de cada par: el peso del eje no es igual en los dos. ¿Por qué?',
        facts: [
          'El borde de Shackleton está entre los sitios candidatos para las próximas misiones tripuladas por su luz casi constante y la cercanía de zonas en sombra.',
          'Laguna Salada ↔ Tranquillitatis tiene una exactitud de [[ils laguna]]; sin el ajuste de peso, el «[[s laguna ice]]» del hielo la inflaría.',
          'El agua de la Luna podría venir de cometas, asteroides y del viento solar, a lo largo de miles de millones de años.',
        ],
        activities: [
          {
            title: 'Rediseña el eje',
            description:
              'Propón una forma alternativa de tratar dos sitios secos en un índice de similitud. Compara tu propuesta con la del backend (similitud [[s laguna ice]] con peso [[w laguna ice]]) y discute ventajas y desventajas.',
            type: 'reflection',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Por qué el borde de Shackleton no es clase 3?',
            options: ['Porque su superficie se calienta y el hielo solo sería estable bajo ella en una parte del área', 'Porque está en la Tierra', 'Porque no tiene sombra cerca', 'Porque es de basalto'],
            answer: 0,
            explanation: 'Es [[moon cucapa ice]]; la clase 3 corresponde al interior en sombra permanente.',
          },
          {
            question: '¿Qué significa el [[s laguna ice]] de Laguna Salada ↔ Tranquillitatis en este eje?',
            options: ['Que los dos tienen hielo estable', 'Que los dos son secos', 'Que son idénticos', 'Que es un error'],
            answer: 1,
            explanation: 'Es similitud por ausencia.',
          },
          {
            question: '¿Por qué el backend baja el peso del eje cuando hay similitud por ausencia?',
            options: ['Para que coincidir en «no tener» cuente menos en la exactitud', 'Para que la exactitud sea 100', 'Porque falta el dato', 'Porque es un eje lunar'],
            answer: 0,
            explanation: 'Coincidir en ausencia da poca información sobre el parecido real.',
          },
          {
            question: '¿Qué es correcto sobre la estabilidad y la detección del hielo?',
            options: ['Son lo mismo', 'La estabilidad dice si puede conservarse; la detección, si está', 'Solo la detección importa', 'Ninguna se puede medir'],
            answer: 1,
            explanation: 'Son observaciones distintas, como advierte el backend.',
          },
        ],
        conclusion:
          'En el eje del hielo, los números necesitan contexto: un [[s cucapa ice]] compara una sierra seca con un borde polar que guarda algo de hielo bajo el suelo; un [[s laguna ice]] solo dice que dos lugares son secos. El método de la exactitud reconoce esa diferencia, y la interpretación también debe hacerlo.',
      },
      teacher: {
        objectives: [
          'Analizar la similitud de hielo en un par polar y en uno ecuatorial.',
          'Explicar y evaluar el ajuste de peso por ausencia.',
          'Formular una crítica fundamentada a un método de comparación.',
        ],
        priorKnowledge: ['Clases del eje y estabilidad térmica.', 'Promedio ponderado.'],
        materials: ['Proyector', 'Hojas de trabajo para el rediseño del eje'],
        explanation:
          'Lo esencial: Cucapá ↔ Shackleton ([[s cucapa ice]]) compara [[earth cucapa ice]] con [[moon cucapa ice]] y entra con peso completo; Laguna Salada ↔ Tranquillitatis ([[s laguna ice]]) es similitud por ausencia con peso reducido. Error frecuente: decir que el borde de Shackleton tiene hielo superficial.',
        steps: [
          { title: 'Dos números', description: 'Muestre [[s cucapa ice]] y [[s laguna ice]] sin contexto y pregunte cuál indica más parecido.', minutes: 6 },
          { title: 'Los dos pares', description: 'Analicen los valores, clases y pesos del eje en cada par.', minutes: 12 },
          { title: 'Rediseña el eje', description: 'Los equipos proponen alternativas.', minutes: 15 },
          { title: 'Debate', description: 'Comparen las propuestas con el método del backend.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de cuatro preguntas.', minutes: 7 },
        ],
        discussion: [
          '¿Qué sitio de la Tierra sería mejor análogo del hielo lunar? ¿Qué se perdería?',
          '¿Es justo que dos sitios secos tengan similitud 100?',
          '¿Cómo comunicarías a un público general que el borde de Shackleton no tiene hielo superficial?',
        ],
        dataActivity: {
          title: 'Quitar y poner un eje',
          description:
            'Con la gráfica de barras de Laguna Salada ↔ Tranquillitatis, identifiquen la barra con trama (por ausencia) y su grosor. Discutan qué pasaría con la exactitud ([[ils laguna]]) si ese eje pesara [[weight ice]] en lugar de [[w laguna ice]]; no se trata de recalcular la exactitud, sino de razonar su efecto.',
          minutes: 10,
        },
        assessment: ['Revisar la propuesta de rediseño: ¿argumenta con información y peso?', 'Ensayo breve: «Un 100 que dice poco».'],
        outcomes: [
          'El grupo explica la clase del borde de Shackleton.',
          'El grupo evalúa la similitud por ausencia.',
          'El grupo propone y critica una alternativa metodológica.',
        ],
        alternative: {
          title: 'Balanza de pesos',
          description: 'Con una balanza y monedas, represente la exactitud como promedio ponderado; quite peso al eje de hielo y observe el efecto.',
          type: 'physical-model',
          materials: ['Balanza escolar o regla con fulcro', 'Monedas'],
        },
        siteActivities: ['Comparar la humedad del suelo de la Laguna Salada antes y después de una lluvia (fotos o noticias).', 'Ubicar en el mapa la escala de una celda de 50 km.'],
      },
    },
  },
};
