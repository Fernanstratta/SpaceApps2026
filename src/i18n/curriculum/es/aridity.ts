import type { AxisCurriculumText } from '../types';

/** Eje 6 · Aridez y vegetación. Concepto (primaria) → medición (secundaria) → análogos (secundaria). */
export const aridityEs: AxisCurriculumText = {
  student: {
    tagline: 'Un mundo sin plantas',
    overview:
      'La Luna no tiene plantas, ni agua líquida, ni vida. Por eso los mejores análogos terrestres son lugares muy secos, con poca vegetación. Verás cómo se mide la vegetación desde el espacio con el índice NDVI y por qué casi cualquier desierto se parece a la Luna en este eje.',
  },
  teacher: {
    tagline: 'Aridez: el eje donde casi todos los desiertos se parecen a la Luna',
    overview:
      'Se presenta el NDVI como medida de vegetación, su cálculo con Sentinel-2 y el valor lunar de referencia (0 por definición). Se aplica a Laguna Salada ↔ Tranquillitatis, El Elegante ↔ Linné y Pinacate ↔ Marius Hills. Es un eje de peso bajo porque ayuda poco a distinguir entre desiertos.',
    objectives: [
      'Explicar qué mide el NDVI y por qué la vegetación cambia la luz reflejada.',
      'Distinguir un valor medido de un valor de referencia.',
      'Interpretar por qué este eje pesa poco en el ILS.',
    ],
  },
  submodules: {
    concept: {
      summary: 'La Tierra vista desde la Luna: un planeta con vida junto a un mundo seco.',
      student: {
        introduction:
          'En 1968, los astronautas del Apolo 8 tomaron una foto famosa: la Tierra saliendo sobre el horizonte de la Luna. La Tierra se ve azul, blanca y con manchas de color. La Luna, gris. Esa foto muestra una gran diferencia: la Tierra tiene vida y la Luna no.',
        blocks: [
          {
            id: 'salida',
            title: 'Un planeta vivo y un mundo seco',
            body: 'En la Tierra hay bosques, selvas, pastizales y desiertos. En la Luna no hay plantas en ningún lugar.\n\nPor eso, para parecerse a la Luna, un lugar de la Tierra debe tener muy pocas plantas. Los desiertos de Baja California y Sonora son buenos candidatos.',
            imageId: 'earthrise',
          },
          {
            id: 'laguna',
            title: '¿Cuántas plantas hay?',
            body: 'Los satélites miden las plantas con un número llamado NDVI. Cerca de 0 significa roca o tierra sin plantas. Más alto significa más plantas verdes.\n\nLa Laguna Salada tiene [[earth laguna aridity]]: casi nada de plantas. La Luna tiene 0 porque no tiene vegetación.',
            visual: 'ndvi-bands',
          },
        ],
        concepts: [
          { term: 'Vegetación', definition: 'Las plantas que cubren un lugar: árboles, arbustos, pasto.' },
          { term: 'Árido', definition: 'Muy seco, con poca agua y pocas plantas.' },
          { term: 'NDVI', definition: 'Número que dicen los satélites para saber cuántas plantas verdes hay.' },
        ],
        earth: 'La Laguna Salada casi no tiene plantas: su NDVI es [[earth laguna aridity]].',
        moon: 'En la Luna no hay plantas. Su valor se fija en 0: no se mide, se sabe.',
        comparisonLead: 'Las dos marcas quedan muy cerca del 0. En este eje, la laguna se parece mucho a la Luna.',
        facts: [
          'La foto «Salida de la Tierra» la tomó el astronauta William Anders en la Nochebuena de 1968.',
          'Las plantas sanas reflejan mucha luz infrarroja, que nuestros ojos no pueden ver, pero los satélites sí.',
        ],
        activities: [
          {
            title: 'Detective de plantas',
            description:
              'Sal al patio y elige un cuadro de 1 × 1 m. Dibuja qué parte tiene plantas y qué parte es tierra o piso. ¿Tu cuadro se parece más a un bosque o a la Laguna Salada?',
            type: 'observation',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué lugar se parece más a la Luna en este eje?',
            options: ['Una selva', 'Un desierto con pocas plantas', 'Un jardín'],
            answer: 1,
            explanation: 'En la Luna no hay plantas; un desierto casi no tiene.',
          },
          {
            question: '¿Por qué el valor de la Luna es 0?',
            options: ['Porque en la Luna no hay plantas', 'Porque el satélite no la vio', 'Porque es de noche'],
            answer: 0,
            explanation: 'Es un valor de referencia: se fija en 0 porque no hay vegetación.',
          },
        ],
        conclusion:
          'Los desiertos se parecen a la Luna porque tienen muy pocas plantas. Pero recuerda: un desierto sigue teniendo vida, aire y agua de vez en cuando. La Luna no.',
      },
      teacher: {
        objectives: ['Reconocer la ausencia de vegetación como rasgo lunar.', 'Relacionar los desiertos con buenos análogos de aridez.'],
        priorKnowledge: ['Saber qué es una planta y qué necesita para vivir.', 'Haber visto fotos de la Luna.'],
        materials: ['Cuerda o gis para marcar 1 × 1 m', 'Hojas y colores', 'Foto «Salida de la Tierra» proyectada'],
        explanation:
          'Lo esencial: la Luna no tiene vegetación; el NDVI mide plantas verdes y es cercano a 0 en desiertos. El valor lunar es de referencia (se fija en 0), no una observación. Error frecuente: pensar que «árido» significa «sin vida»; los desiertos tienen vida adaptada.',
        steps: [
          { title: 'Salida de la Tierra', description: 'Proyecte la foto y pregunte qué colores tiene la Tierra y cuáles la Luna.', minutes: 6 },
          { title: 'Desiertos', description: 'Explique por qué los desiertos se parecen a la Luna en este eje.', minutes: 7 },
          { title: 'Detective de plantas', description: 'Actividad en el patio.', minutes: 15 },
          { title: 'El NDVI', description: 'Muestre la escala del NDVI con la Laguna Salada y la Luna.', minutes: 8 },
          { title: 'Cierre', description: 'Comprobación de dos preguntas.', minutes: 4 },
        ],
        discussion: ['¿Por qué en el desierto hay pocas plantas?', '¿Qué animales y plantas viven en los desiertos de Baja California?'],
        dataActivity: {
          title: 'Escala de plantas',
          description: 'En el pizarrón, dibuje una línea de −1 a 1 con «agua», «sin plantas» y «muchas plantas». Los niños colocan la Laguna Salada ([[earth laguna aridity]]) y la Luna (0).',
          minutes: 8,
        },
        assessment: ['Revisar el dibujo del cuadro del patio.', 'Pedir que expliquen por qué un desierto se parece a la Luna en este eje.'],
        outcomes: ['El grupo explica que la Luna no tiene plantas.', 'El grupo identifica un desierto como análogo de aridez.'],
        alternative: {
          title: 'Fotos de paisajes',
          description: 'Si no se puede salir: ordenen fotos de paisajes (selva, pastizal, desierto, Luna) de más plantas a menos plantas.',
          type: 'printable',
          materials: ['Fotos impresas'],
        },
        siteActivities: ['Observar en fotos la vegetación dispersa alrededor de la Laguna Salada.', 'Comparar con fotos de la superficie lunar.'],
      },
    },

    measurement: {
      summary: 'Rojo e infrarrojo: cómo se calcula el NDVI y por qué la fecha de la imagen importa.',
      student: {
        introduction:
          'Las plantas tienen una forma especial de reflejar la luz: absorben mucha luz roja para hacer fotosíntesis y reflejan mucha luz infrarroja. Con esa diferencia, los satélites calculan cuánta vegetación hay sin visitar el lugar.',
        blocks: [
          {
            id: 'formula',
            title: 'La fórmula del NDVI',
            body: 'El NDVI se calcula así: NDVI = (IR − R) / (IR + R), donde IR es la reflectancia en el infrarrojo cercano y R en el rojo. El resultado va de −1 a 1.\n\nEl agua suele dar valores negativos; la roca y el suelo desnudo, entre 0 y 0.2; el matorral, entre 0.2 y 0.5; y la vegetación densa, más.',
            visual: 'ndvi-bands',
          },
          {
            id: 'temporada',
            title: 'La temporada seca',
            body: 'El NDVI cambia con las estaciones: después de las lluvias hay más verde. Por eso el equipo usa la mediana de las imágenes de Sentinel-2 de mayo a agosto, la temporada seca.\n\nAsí, la Laguna Salada da [[earth laguna aridity]] y El Pinacate [[earth pinacate aridity]]. El Pinacate tiene más matorral entre las coladas.',
          },
          {
            id: 'referencia',
            title: 'Un valor que no se mide',
            body: 'En la Luna no se calcula el NDVI: se fija en 0 porque no hay vegetación. Por eso su estado es «referencia», no «medido».\n\nEste eje pesa [[weight aridity]], de los más bajos del índice: casi cualquier desierto se parece a la Luna en esto, así que ayuda poco a distinguir entre sitios.',
          },
        ],
        concepts: [
          { term: 'Reflectancia', definition: 'Fracción de la luz que refleja una superficie en una banda.' },
          { term: 'Infrarrojo cercano', definition: 'Luz un poco más allá del rojo, invisible para nosotros; las hojas sanas la reflejan mucho.' },
          { term: 'Mediana', definition: 'Valor central de un conjunto ordenado; resiste mejor a datos extremos que el promedio.' },
          { term: 'Valor de referencia', definition: 'Valor fijado por definición o convención, no observado.' },
        ],
        earth: 'Sentinel-2 L2A, mediana del NDVI de mayo a agosto. Laguna Salada: [[earth laguna aridity]]; El Pinacate: [[earth pinacate aridity]].',
        moon: 'Sin medición: 0 por definición. Mare Tranquillitatis y Marius Hills tienen el mismo valor de referencia.',
        comparisonLead: 'Fíjate en las insignias: los valores terrestres son «Medido» y los lunares «Referencia». ¿Por qué importa esa diferencia?',
        facts: [
          'Sentinel-2 pasa sobre el mismo lugar cada pocos días, así que hay muchas imágenes para escoger fechas sin nubes.',
          'La clorofila absorbe la luz roja y la azul; por eso vemos las hojas verdes.',
          'La tolerancia del eje es R = [[R aridity]]: una diferencia de esa cantidad en el NDVI lleva la similitud a 0.',
        ],
        activities: [
          {
            title: 'Calcula un NDVI',
            description:
              'Con estos datos de ejemplo, calcula el NDVI: un bosque con IR = 0.50 y R = 0.06; un suelo con IR = 0.30 y R = 0.25. ¿Cuál es cuál? Luego ubica la Laguna Salada en tu escala.',
            type: 'calculation',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué luz reflejan mucho las plantas sanas?',
            options: ['La roja', 'La infrarroja cercana', 'La ultravioleta'],
            answer: 1,
            explanation: 'Las hojas reflejan mucho infrarrojo cercano y absorben el rojo.',
          },
          {
            question: '¿Por qué se usan imágenes de mayo a agosto?',
            options: ['Porque es la temporada seca y el NDVI cambia con las lluvias', 'Porque es cuando hay más nubes', 'Porque el satélite solo funciona en verano'],
            answer: 0,
            explanation: 'Así se compara el estado seco del lugar, sin el verde de las lluvias.',
          },
          {
            question: '¿Qué significa que el valor lunar sea de «referencia»?',
            options: ['Que se midió con un satélite', 'Que se fijó en 0 por definición', 'Que es provisional'],
            answer: 1,
            explanation: 'No hay vegetación en la Luna; no hace falta medirla.',
          },
        ],
        conclusion:
          'El NDVI convierte una diferencia de luz en una medida de vegetación. Saber de dónde viene cada valor, medido o de referencia, es necesario para interpretarlo bien.',
      },
      teacher: {
        objectives: [
          'Explicar el principio físico del NDVI.',
          'Calcular un NDVI con datos de ejemplo.',
          'Distinguir valores medidos y de referencia.',
        ],
        priorKnowledge: ['Fotosíntesis básica.', 'Espectro de la luz.', 'Fracciones y números negativos.'],
        materials: ['Calculadora', 'Hojas de trabajo', 'Celofán rojo (opcional)'],
        explanation:
          'Lo esencial: NDVI = (IR − R)/(IR + R); el valor lunar es de referencia. Se usa la temporada seca para evitar el verde estacional. Error frecuente: interpretar el 0 lunar como una medición; es una convención documentada.',
        steps: [
          { title: 'Pregunta', description: '¿Por qué las hojas se ven verdes?', minutes: 5 },
          { title: 'Rojo e infrarrojo', description: 'Explique la reflectancia de las hojas y la fórmula del NDVI.', minutes: 12 },
          { title: 'Calcula un NDVI', description: 'Actividad con datos de ejemplo.', minutes: 15 },
          { title: 'Datos reales', description: 'Ubiquen Laguna Salada y El Pinacate en la escala y revisen las insignias de estado.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 8 },
        ],
        discussion: [
          '¿Qué pasaría con el NDVI de la Laguna Salada después de una inundación?',
          '¿Por qué la mediana es mejor que el promedio para este eje?',
          '¿Qué otras convenciones o valores de referencia conoces en ciencia?',
        ],
        dataActivity: {
          title: 'Insignias de estado',
          description:
            'En la tabla del eje, los equipos identifican qué valores son «Medido» y cuáles «Referencia», y explican cómo afecta eso a la confianza en la similitud de Laguna Salada ↔ Tranquillitatis ([[s laguna aridity]]).',
          minutes: 10,
        },
        assessment: ['Revisar el cálculo del NDVI.', 'Pregunta escrita: diferencia entre un valor medido y uno de referencia.'],
        outcomes: ['El grupo calcula e interpreta un NDVI.', 'El grupo distingue valores medidos y de referencia.'],
        alternative: {
          title: 'Filtro rojo',
          description: 'Miren hojas y piedras a través de celofán rojo y comparen cuánto «brillan»; relacione con la absorción del rojo.',
          type: 'demonstration',
          materials: ['Celofán rojo', 'Hojas y piedras'],
        },
        siteActivities: ['Comparar fotos de la laguna en temporada de lluvias y en temporada seca.', 'Identificar dónde crece matorral entre las coladas del Pinacate.'],
      },
    },

    analogs: {
      summary: 'Laguna Salada, El Elegante y El Pinacate: tres desiertos que se parecen a la Luna en aridez, con matices.',
      student: {
        introduction:
          'En este eje los tres sitios de la región se parecen bastante a la Luna, porque los tres son muy secos. Pero no todos por igual, y cada uno tiene una advertencia diferente.',
        blocks: [
          {
            id: 'tres',
            title: 'Tres desiertos, tres valores',
            body: 'La Laguna Salada tiene [[earth laguna aridity]] (similitud [[s laguna aridity]]), El Elegante [[earth elegante aridity]] ([[s elegante aridity]]) y El Pinacate [[earth pinacate aridity]] ([[s pinacate aridity]]). Entre más cerca del 0, más se parece a la Luna en este eje.',
            visual: 'ndvi-bands',
          },
          {
            id: 'advertencias',
            title: 'Lo que cambia la lectura',
            body: 'La Laguna Salada puede inundarse: la fecha de la imagen cambia qué superficie se ve. Por eso se usan imágenes de la temporada seca.\n\nEn El Pinacate, la vegetación entre las coladas afecta la señal óptica. Para estudiar el material volcánico conviene enmascararla, es decir, quitarla del análisis.',
            imageId: 'mexico-from-iss',
          },
          {
            id: 'peso',
            title: 'Un eje que pesa poco',
            body: 'Como casi todos los desiertos se parecen a la Luna en aridez, este eje pesa [[weight aridity]]. Ayuda a descartar lugares con mucha vegetación, pero no a elegir entre desiertos.',
          },
        ],
        concepts: [
          { term: 'Máscara', definition: 'Parte de una imagen que se quita del análisis, como la vegetación o el agua.' },
          { term: 'Inundación estacional', definition: 'Agua que cubre un lugar solo en cierta época del año.' },
          { term: 'Peso del eje', definition: 'Cuánto cuenta un eje en el ILS; aridez pesa [[weight aridity]].' },
        ],
        earth: 'Tres sitios secos: Laguna Salada ([[earth laguna aridity]]), El Elegante ([[earth elegante aridity]]) y El Pinacate ([[earth pinacate aridity]]).',
        moon: 'Los tres sitios lunares tienen 0, el valor de referencia de un mundo sin vegetación.',
        comparisonLead: 'Las tres marcas lunares están en 0. Compara qué tan cerca quedan las terrestres.',
        facts: [
          'La Laguna Salada se ha llenado de agua en años de lluvias fuertes o crecidas del río Colorado.',
          'En El Pinacate viven plantas adaptadas a la sequía, como la gobernadora, la choya y el sahuaro.',
          'Laguna Salada ↔ Tranquillitatis tiene la similitud de aridez más alta de los tres pares: [[s laguna aridity]].',
        ],
        activities: [
          {
            title: 'El sitio más lunar',
            description:
              'Ordena los tres sitios terrestres de más a menos parecido a la Luna en aridez. Luego escribe una advertencia que debería tener en cuenta un científico que use cada uno.',
            type: 'reflection',
            minutes: 12,
          },
        ],
        quiz: [
          {
            question: '¿Qué sitio terrestre se parece más a la Luna en aridez?',
            options: ['La Laguna Salada', 'El Elegante', 'El Pinacate'],
            answer: 0,
            explanation: 'Su NDVI es [[earth laguna aridity]], el más cercano a 0.',
          },
          {
            question: '¿Por qué conviene usar imágenes de la temporada seca en la Laguna Salada?',
            options: ['Porque la laguna puede inundarse', 'Porque hay más plantas', 'Porque es más bonita'],
            answer: 0,
            explanation: 'Con agua, la superficie que se mide es distinta.',
          },
          {
            question: '¿Por qué este eje pesa poco en el ILS?',
            options: ['Porque casi todos los desiertos se parecen a la Luna en esto', 'Porque no hay datos', 'Porque la Luna tiene plantas'],
            answer: 0,
            explanation: 'Ayuda poco a distinguir entre sitios áridos.',
          },
        ],
        conclusion:
          'La aridez es una condición necesaria para un análogo lunar, pero no suficiente. Un desierto se parece a la Luna en que no tiene casi plantas; para saber si se parece en más, hay que revisar los demás ejes.',
      },
      teacher: {
        objectives: [
          'Comparar la aridez de tres sitios con su valor lunar de referencia.',
          'Identificar advertencias de lectura en cada sitio.',
          'Explicar el peso bajo del eje.',
        ],
        priorKnowledge: ['NDVI y su escala.', 'Valores medidos y de referencia.'],
        materials: ['Proyector o tabla impresa'],
        explanation:
          'Lo esencial: los tres sitios son áridos; la Laguna Salada es la más cercana a 0. Cada sitio tiene una advertencia (inundación, vegetación entre coladas). Error frecuente: tomar la aridez como prueba de que un sitio es buen análogo en todo.',
        steps: [
          { title: 'Repaso', description: 'Recuerde la escala del NDVI.', minutes: 5 },
          { title: 'Tres sitios', description: 'Presente los valores y las fotos.', minutes: 12 },
          { title: 'El sitio más lunar', description: 'Actividad individual.', minutes: 12 },
          { title: 'Advertencias', description: 'Discutan las rupturas de la analogía que da el backend.', minutes: 13 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 8 },
        ],
        discussion: [
          '¿Basta con ser un desierto para ser un buen análogo lunar?',
          '¿Qué otros ejes revisarías para comparar estos tres sitios?',
          '¿Cómo cambiaría la similitud si se usaran imágenes de la temporada de lluvias?',
        ],
        dataActivity: {
          title: 'Distancia al cero',
          description: 'En la escala del NDVI, los equipos miden la distancia de cada sitio a 0 y la comparan con la tolerancia R = [[R aridity]] para explicar sus similitudes.',
          minutes: 10,
        },
        assessment: ['Revisar el orden y las advertencias de la actividad.', 'Pedir un argumento sobre por qué el eje pesa poco.'],
        outcomes: ['El grupo compara aridez con un valor de referencia.', 'El grupo identifica advertencias de cada sitio.'],
        alternative: {
          title: 'Escala en el piso',
          description: 'Marque con cinta una escala de −1 a 1 en el piso; tres alumnos se paran en el valor de cada sitio y uno en el 0 de la Luna.',
          type: 'physical-model',
          materials: ['Cinta adhesiva', 'Tarjetas con los nombres'],
        },
        siteActivities: ['Identificar plantas del desierto en fotos del Pinacate.', 'Buscar en noticias o fotos cuándo se ha inundado la Laguna Salada.'],
      },
    },
  },
};
