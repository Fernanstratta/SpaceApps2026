import type { AxisCurriculumText } from '../types';

/** Eje 4 · Albedo y reflectancia. Concepto (primaria) → medición (secundaria) → análogos (secundaria). */
export const albedoEs: AxisCurriculumText = {
  student: {
    tagline: '¿Cuánta luz refleja el suelo?',
    overview:
      'Desde la Tierra vemos la Luna con manchas claras y oscuras. Esa diferencia se llama albedo: la fracción de la luz del Sol que refleja cada superficie.\n\nAprenderás qué es, cómo se calcula con satélites y por qué una playa salina brillante y un mar lunar oscuro pueden parecerse en otras cosas aunque su albedo sea muy distinto.',
  },
  teacher: {
    tagline: 'Albedo: luz, temperatura y composición',
    overview:
      'Se presenta el albedo como fracción de luz reflejada, su medición con Sentinel-2 y Diviner (y con el láser de LOLA en el polo), y su aplicación a El Elegante ↔ Linné, Pinacate ↔ Marius Hills y Laguna Salada ↔ Tranquillitatis. La tolerancia del eje es estrecha, lo que hace que diferencias pequeñas pesen mucho.',
    objectives: [
      'Definir el albedo como la fracción de luz reflejada.',
      'Explicar cómo se mide con satélites y por qué el polo lunar requiere otro instrumento.',
      'Interpretar similitudes con una tolerancia estrecha.',
    ],
  },
  submodules: {
    concept: {
      summary: 'Por qué unas superficies se ven claras y otras oscuras, en la Tierra y en la Luna.',
      student: {
        introduction:
          'En un día soleado, una playera blanca se siente más fresca que una negra. La blanca refleja más luz; la negra la absorbe. A esa capacidad de reflejar la luz se le llama albedo.',
        blocks: [
          {
            id: 'que-es',
            title: 'Reflejar o absorber',
            body: 'El albedo va de 0 a 1. Una superficie con albedo 0 no refleja nada y se ve negra. Una con albedo 1 lo refleja todo y se ve blanca. La nieve fresca está cerca de 1; el asfalto, cerca de 0.',
            imageId: 'blue-marble',
          },
          {
            id: 'laguna',
            title: 'Una laguna clara y un mar oscuro',
            body: 'La Laguna Salada se ve clara porque su suelo tiene sales y lodo seco. Mare Tranquillitatis se ve oscuro porque es basalto. Mira los cuadros: el tono es aproximado, pero el número es el dato real.',
            visual: 'albedo-swatches',
          },
        ],
        concepts: [
          { term: 'Albedo', definition: 'Qué parte de la luz del Sol refleja una superficie. Va de 0 (nada) a 1 (toda).' },
          { term: 'Reflejar', definition: 'Hacer que la luz rebote. Lo claro refleja más.' },
          { term: 'Absorber', definition: 'Quedarse con la luz y calentarse. Lo oscuro absorbe más.' },
        ],
        earth: 'La Laguna Salada refleja [[pct earth laguna albedo]] de la luz que recibe: es de los sitios más claros del proyecto.',
        moon: 'Mare Tranquillitatis refleja solo [[pct moon laguna albedo]]: el basalto es oscuro.',
        comparisonLead: 'Mira qué tan lejos quedan las dos marcas. En este eje, poca distancia ya hace una gran diferencia.',
        facts: [
          'La Luna parece brillante en el cielo de noche, pero en realidad es tan oscura como el asfalto viejo.',
          'La nieve fresca refleja casi toda la luz; por eso deslumbra tanto en un día soleado.',
        ],
        activities: [
          {
            title: 'Termómetros al Sol',
            description:
              'Pon dos vasos con agua al Sol: uno envuelto en papel blanco y otro en papel negro. Después de 15 minutos, toca el agua o mide con un termómetro. ¿Cuál se calentó más? ¿Por qué?',
            type: 'observation',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué superficie tiene más albedo?',
            options: ['Nieve fresca', 'Asfalto', 'Basalto'],
            answer: 0,
            explanation: 'La nieve fresca refleja casi toda la luz que recibe.',
          },
          {
            question: '¿Por qué Mare Tranquillitatis se ve oscuro?',
            options: ['Porque es de noche', 'Porque es basalto, una roca oscura', 'Porque está mojado'],
            answer: 1,
            explanation: 'El basalto absorbe la mayor parte de la luz.',
          },
        ],
        conclusion:
          'El albedo nos dice si un suelo es claro u oscuro. La Laguna Salada y Mare Tranquillitatis son muy diferentes en este eje, aunque sean parecidos en lo plano. Un análogo casi nunca se parece en todo.',
      },
      teacher: {
        objectives: ['Definir el albedo con un ejemplo cotidiano.', 'Relacionar el color de una superficie con cuánta luz refleja y cuánto se calienta.'],
        priorKnowledge: ['Saber que el Sol da luz y calor.', 'Distinguir colores claros y oscuros.'],
        materials: ['Dos vasos iguales con agua', 'Papel blanco y papel negro', 'Termómetro (opcional)', 'Cinta adhesiva'],
        explanation:
          'Lo esencial: el albedo es la fracción de luz reflejada; lo claro refleja más y se calienta menos. Error frecuente: creer que la Luna es blanca porque se ve brillante; en realidad su albedo es bajo y brilla por contraste con el cielo negro.',
        steps: [
          { title: 'Playeras', description: 'Pregunte qué playera es más fresca al Sol: blanca o negra.', minutes: 5 },
          { title: 'El albedo', description: 'Explique la escala de 0 a 1 con ejemplos: nieve, pasto, asfalto.', minutes: 8 },
          { title: 'Termómetros al Sol', description: 'Monten el experimento de los vasos; mientras esperan, vean los cuadros de color.', minutes: 15 },
          { title: 'Laguna y Luna', description: 'Comparen el albedo de los dos sitios en la escala.', minutes: 8 },
          { title: 'Cierre', description: 'Revisen los vasos y respondan la comprobación.', minutes: 4 },
        ],
        discussion: ['¿Por qué la Luna parece blanca si es oscura?', '¿Qué superficie de tu escuela crees que tiene más albedo?'],
        dataActivity: {
          title: 'Ordenar de claro a oscuro',
          description: 'Muestre los dos cuadros del eje y pida que ordenen: Laguna Salada ([[earth laguna albedo]]) y Mare Tranquillitatis ([[moon laguna albedo]]).',
          minutes: 6,
        },
        assessment: ['Explicar con sus palabras el resultado de los vasos.', 'Dibujar un lugar con mucho albedo y uno con poco.'],
        outcomes: ['El grupo define el albedo con un ejemplo.', 'El grupo relaciona lo oscuro con más calentamiento.'],
        alternative: {
          title: 'Hojas al Sol',
          description: 'Si no hay vasos: dejen una hoja blanca y una negra al Sol y tóquenlas con la mano después de 10 minutos.',
          type: 'experiment',
          materials: ['Hoja blanca', 'Hoja negra'],
        },
        siteActivities: ['Buscar en un mapa satelital la mancha clara de la Laguna Salada.', 'Comparar su tono con el de la sierra que la rodea.'],
      },
    },

    measurement: {
      summary: 'Albedo de banda ancha con Sentinel-2 y Diviner, y por qué el polo lunar se mide con un láser.',
      student: {
        introduction:
          'Para medir el albedo hay que saber cuánta luz llega y cuánta se refleja, en muchas longitudes de onda. Los satélites lo hacen con bandas de color. Pero en el polo sur lunar el Sol casi no sube, y ahí se necesita otro truco.',
        blocks: [
          {
            id: 'banda-ancha',
            title: 'Albedo de banda ancha',
            body: 'Sentinel-2 mide la reflectancia en varias bandas, del azul al infrarrojo de onda corta. El equipo combina cinco de ellas con la fórmula de Liang (2001) para obtener un albedo de «banda ancha»: lo que reflejaría la superficie de toda la luz solar.\n\nAntes de promediar, se quitan nubes, sombras, agua y vegetación. En El Elegante el resultado es [[earth elegante albedo]].',
            visual: 'albedo-swatches',
          },
          {
            id: 'luna',
            title: 'En la Luna: Diviner y LOLA',
            body: 'En la mayor parte de la Luna, Diviner mide la reflectancia solar cerca del mediodía. Linné tiene [[moon elegante albedo]].\n\nEn el polo sur el Sol queda a menos de 2° sobre el horizonte, así que Diviner no puede medir el albedo. Para el borde de Shackleton se usa el láser del altímetro LOLA, a 1064 nm: una sola longitud de onda del infrarrojo cercano. Da [[moon cucapa albedo]], y suele dar valores más altos que los de banda ancha.',
          },
          {
            id: 'tolerancia',
            title: 'Una tolerancia estrecha',
            body: 'En este eje R = [[R albedo]]: si dos albedos difieren en esa cantidad, la similitud es 0. Es estrecha porque el albedo natural varía poco. El Elegante ↔ Linné tiene [[s elegante albedo]]; Sierra Cucapá ↔ Shackleton, [[s cucapa albedo]].',
          },
        ],
        concepts: [
          { term: 'Reflectancia', definition: 'Fracción de la luz reflejada en una banda o longitud de onda concreta.' },
          { term: 'Albedo de banda ancha', definition: 'Reflectancia combinada de todo el espectro solar, calculada a partir de varias bandas.' },
          { term: 'Altímetro láser (LOLA)', definition: 'Instrumento que mide la altura del terreno con pulsos láser; la intensidad del eco da una reflectancia a 1064 nm.' },
          { term: 'Tolerancia R', definition: 'Diferencia con la que la similitud llega a 0; en albedo es [[R albedo]].' },
        ],
        earth: 'Sentinel-2 L2A, albedo de banda ancha (Liang, 2001). El Elegante: [[earth elegante albedo]]. Sierra Cucapá: [[earth cucapa albedo]].',
        moon: 'Diviner (LRO) en Linné: [[moon elegante albedo]]. LOLA a 1064 nm en el borde de Shackleton: [[moon cucapa albedo]].',
        comparisonLead: 'Fíjate en la regla R: es muy corta. ¿Cuál de los dos pares tiene una línea más larga que la regla?',
        facts: [
          'LOLA mide la altura con un pulso láser 28 veces por segundo; con millones de pulsos se hizo el mapa topográfico más detallado de la Luna.',
          'El albedo de la Tierra completa es de alrededor de 0.3, sobre todo por las nubes y el hielo.',
          'Las sombras del polo sur lunar son tan largas que algunos cráteres nunca reciben luz directa del Sol.',
        ],
        activities: [
          {
            title: 'Medidor de albedo casero',
            description:
              'Con la app de luxómetro de un celular, mide la luz que llega (apuntando al cielo) y la que refleja una superficie (apuntando al piso a 30 cm). Divide reflejada entre recibida. Compara papel blanco, tierra, pasto y asfalto.',
            type: 'calculation',
            minutes: 18,
          },
        ],
        quiz: [
          {
            question: '¿Por qué el albedo del borde de Shackleton se mide con LOLA y no con Diviner?',
            options: ['Porque Diviner está apagado', 'Porque en el polo el Sol está muy bajo y Diviner no puede medirlo', 'Porque LOLA mide la temperatura', 'Porque es más barato'],
            answer: 1,
            explanation: 'Con el Sol a menos de 2° sobre el horizonte no hay iluminación suficiente para el método de Diviner.',
          },
          {
            question: '¿Qué significa que la tolerancia R del albedo sea [[R albedo]]?',
            options: ['Que diferencias pequeñas ya bajan mucho la similitud', 'Que el albedo siempre es 0.15', 'Que el eje pesa poco', 'Que el dato es provisional'],
            answer: 0,
            explanation: 'Con esa diferencia la similitud llega a 0; diferencias menores la reducen proporcionalmente.',
          },
          {
            question: '¿Qué se quita antes de calcular el albedo con Sentinel-2?',
            options: ['Nubes, sombras, agua y vegetación', 'Las rocas', 'Los cráteres', 'Nada'],
            answer: 0,
            explanation: 'Así el valor describe el suelo y no lo que está encima.',
          },
        ],
        conclusion:
          'Medir el albedo parece sencillo, pero depende de la luz disponible y del instrumento. En el polo sur lunar se usa un láser de una sola longitud de onda, y eso hay que tenerlo en cuenta al comparar.',
      },
      teacher: {
        objectives: [
          'Explicar el albedo de banda ancha y cómo se obtiene de varias bandas.',
          'Justificar el uso de LOLA en el polo sur y su limitación.',
          'Interpretar la tolerancia estrecha del eje.',
        ],
        priorKnowledge: ['Albedo como fracción de luz reflejada.', 'Espectro visible e infrarrojo.', 'División y porcentajes.'],
        materials: ['Celulares con app de luxómetro', 'Papel blanco y negro', 'Calculadoras'],
        explanation:
          'Lo esencial: el albedo de banda ancha combina bandas con pesos; en el polo se usa una reflectancia láser a 1064 nm, que no es equivalente. La tolerancia de [[R albedo]] hace que la similitud baje rápido. Error frecuente: comparar el valor de LOLA como si fuera de banda ancha.',
        steps: [
          { title: 'Pregunta', description: '¿Cómo medirías cuánta luz refleja un suelo desde el espacio?', minutes: 5 },
          { title: 'Bandas y banda ancha', description: 'Explique Sentinel-2 y la combinación de bandas.', minutes: 10 },
          { title: 'Medidor casero', description: 'Los equipos miden y calculan el albedo de cuatro superficies.', minutes: 18 },
          { title: 'El polo sur', description: 'Compare El Elegante ↔ Linné con Cucapá ↔ Shackleton y la advertencia de LOLA.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 7 },
        ],
        discussion: [
          '¿Qué error introduce comparar un albedo de banda ancha con uno de una sola longitud de onda?',
          '¿Por qué conviene quitar la vegetación antes de calcular el albedo?',
          '¿Cambiaría el resultado de tu medidor casero a otra hora del día?',
        ],
        dataActivity: {
          title: 'Diferencia contra tolerancia',
          description:
            'Los equipos restan los albedos de cada par y comparan la diferencia con R = [[R albedo]]. Expliquen por qué El Elegante ↔ Linné da [[s elegante albedo]] y Cucapá ↔ Shackleton [[s cucapa albedo]].',
          minutes: 10,
        },
        assessment: ['Revisar los cálculos del medidor casero.', 'Pregunta escrita: ¿qué limitación tiene el albedo de Shackleton?'],
        outcomes: ['El grupo explica el albedo de banda ancha.', 'El grupo identifica la limitación del dato de LOLA.', 'El grupo relaciona tolerancia y similitud.'],
        alternative: {
          title: 'Escala de grises impresa',
          description: 'Sin celulares: comparen papeles de colores con una tira de grises impresa y estimen su albedo aproximado.',
          type: 'printable',
          materials: ['Tira de grises', 'Papeles de colores'],
        },
        siteActivities: ['Comparar el tono de la Sierra Cucapá y el de la Laguna Salada en una imagen satelital.', 'Discutir qué cambia en las fotos al amanecer y al mediodía.'],
      },
    },

    analogs: {
      summary: 'Tres pares en el eje del albedo: un buen parecido, uno a medias y una gran diferencia.',
      student: {
        introduction:
          'El albedo cuenta mucho sobre el suelo: su composición, su edad y cuánto se calienta. Vas a comparar tres pares y descubrir por qué uno se parece bastante, otro a medias y otro nada.',
        blocks: [
          {
            id: 'parecidos',
            title: 'El Elegante y Linné: casi igual de oscuros',
            body: 'El fondo y las paredes de El Elegante tienen [[earth elegante albedo]]; Linné, [[moon elegante albedo]]. La similitud es [[s elegante albedo]]: los dos son superficies oscuras con basalto.',
            visual: 'albedo-swatches',
          },
          {
            id: 'medias',
            title: 'El Pinacate y Marius Hills: a medias',
            body: 'Las coladas del Pinacate tienen [[earth pinacate albedo]] y Marius Hills [[moon pinacate albedo]]. Los dos son basálticos, pero el suelo lunar es todavía más oscuro: la similitud baja a [[s pinacate albedo]].\n\nEn la Luna, el viento solar y los micrometeoritos oscurecen el suelo con el tiempo. En la Tierra, el polvo y la vegetación lo aclaran.',
          },
          {
            id: 'diferentes',
            title: 'Laguna Salada y Tranquillitatis: opuestos',
            body: 'La playa salina refleja [[earth laguna albedo]] y el mar lunar [[moon laguna albedo]]. La similitud es [[s laguna albedo]]. Las sales aclaran la laguna; el basalto oscurece el mar.\n\nEste par es el que más se parece en pendiente y el que menos en albedo.',
            imageId: 'apollo11-lro',
          },
        ],
        concepts: [
          { term: 'Intemperismo espacial', definition: 'Cambio que sufre el suelo lunar por el viento solar y los micrometeoritos; con el tiempo lo oscurece.' },
          { term: 'Playa salina', definition: 'Fondo de un lago seco cubierto de sales y lodo; suele ser muy claro.' },
          { term: 'Similitud S', definition: 'Valor de 0 a 100 que calcula el backend; aquí, qué tan cerca están los dos albedos.' },
        ],
        earth: 'Tres sitios de la región: El Elegante ([[earth elegante albedo]]), El Pinacate ([[earth pinacate albedo]]) y la Laguna Salada ([[earth laguna albedo]]).',
        moon: 'Tres sitios lunares: Linné ([[moon elegante albedo]]), Marius Hills ([[moon pinacate albedo]]) y Mare Tranquillitatis ([[moon laguna albedo]]).',
        comparisonLead: 'Busca el par con la línea más larga. ¿Qué tiene ese sitio terrestre que lo hace tan claro?',
        facts: [
          'Los cráteres jóvenes de la Luna, como Tycho, se ven brillantes porque su material no ha tenido tiempo de oscurecerse.',
          'Laguna Salada ↔ Tranquillitatis tiene la exactitud más alta de los cinco pares ([[ils laguna]]) a pesar de su similitud de [[s laguna albedo]] en albedo.',
          'Un suelo oscuro absorbe más luz y se calienta más: el albedo también influye en la temperatura.',
        ],
        activities: [
          {
            title: 'Explica la diferencia',
            description:
              'Elige uno de los tres pares y escribe dos razones por las que los sitios se parecen o se diferencian en albedo. Usa al menos una palabra nueva de esta lección.',
            type: 'reflection',
            minutes: 12,
          },
        ],
        quiz: [
          {
            question: '¿Qué par se parece más en albedo?',
            options: ['El Elegante ↔ Linné', 'Pinacate ↔ Marius Hills', 'Laguna Salada ↔ Tranquillitatis'],
            answer: 0,
            explanation: 'Su similitud es [[s elegante albedo]].',
          },
          {
            question: '¿Por qué la Laguna Salada es tan clara?',
            options: ['Por las sales y el lodo seco', 'Por el basalto', 'Porque está en la sombra'],
            answer: 0,
            explanation: 'Las sales reflejan mucha luz.',
          },
          {
            question: 'Laguna Salada ↔ Tranquillitatis tiene la exactitud más alta pero similitud [[s laguna albedo]] en albedo. ¿Qué nos enseña?',
            options: ['Que la exactitud está mal', 'Que un par puede parecerse en unos ejes y no en otros', 'Que el albedo no importa'],
            answer: 1,
            explanation: 'La exactitud es un promedio: un eje muy distinto no impide que el par se parezca en otros.',
          },
        ],
        conclusion:
          'El albedo depende de la composición del suelo y de los procesos que lo cambian. Al comparar sitios, conviene preguntarse no solo «¿se parecen?», sino «¿por qué sí o por qué no?».',
      },
      teacher: {
        objectives: [
          'Interpretar la similitud de albedo en tres pares.',
          'Explicar procesos que aclaran u oscurecen una superficie.',
          'Relacionar un eje bajo con una exactitud alta mediante el promedio ponderado.',
        ],
        priorKnowledge: ['Albedo y su escala.', 'Idea de promedio.'],
        materials: ['Proyector o tabla impresa', 'Hojas de trabajo'],
        explanation:
          'Lo esencial: El Elegante ↔ Linné ([[s elegante albedo]]) se parecen; Pinacate ↔ Marius Hills ([[s pinacate albedo]]) a medias; Laguna Salada ↔ Tranquillitatis ([[s laguna albedo]]) son opuestos. Error frecuente: pensar que un eje en 0 invalida un análogo.',
        steps: [
          { title: 'Repaso', description: 'Recuerde la escala de albedo con los cuadros de color.', minutes: 5 },
          { title: 'Tres pares', description: 'Presente los pares con sus valores y fotos.', minutes: 13 },
          { title: 'Explica la diferencia', description: 'Actividad escrita individual.', minutes: 12 },
          { title: 'Puesta en común', description: 'Discutan por qué el par con mayor exactitud tiene el albedo más distinto.', minutes: 12 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 8 },
        ],
        discussion: [
          '¿Qué procesos oscurecen el suelo lunar y cuáles aclaran el terrestre?',
          '¿Usarías la Laguna Salada para probar una cámara que deba ver suelo oscuro? ¿Por qué?',
          '¿Qué otro eje se relaciona con el albedo?',
        ],
        dataActivity: {
          title: 'Cuadros de gris',
          description: 'Los equipos pintan seis cuadros con tonos de gris aproximados a los seis valores de albedo y los ordenan. Luego comparan su orden con la escala del eje.',
          minutes: 10,
        },
        assessment: ['Revisar la explicación escrita: ¿da dos razones y usa vocabulario nuevo?', 'Pedir que expliquen con un ejemplo cómo un eje bajo no impide una exactitud alta.'],
        outcomes: ['El grupo interpreta la similitud de albedo.', 'El grupo explica procesos que cambian el albedo.'],
        alternative: {
          title: 'Tarjetas de tonos',
          description: 'Imprima seis tarjetas con el nombre y el valor de cada sitio; los alumnos las ordenan de oscuro a claro.',
          type: 'printable',
          materials: ['Tarjetas impresas'],
        },
        siteActivities: ['Comparar el tono de las coladas recientes y antiguas del Pinacate.', 'Observar la costra de sal de la Laguna Salada en fotos.'],
      },
    },
  },
};
