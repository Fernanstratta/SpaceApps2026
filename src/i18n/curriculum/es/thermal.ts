import type { AxisCurriculumText } from '../types';

/** Eje 5 · Amplitud térmica día/noche. Concepto (primaria) → medición (preparatoria) → análogos (secundaria). */
export const thermalEs: AxisCurriculumText = {
  student: {
    tagline: 'Del calor del día al frío de la noche',
    overview:
      'En el desierto de Sonora hace calor de día y fresco de noche. En la Luna, esa diferencia es muchísimo mayor. En este tema verás cuánto cambia la temperatura del suelo entre el día y la noche, cómo se mide desde el espacio y por qué este es el eje donde la Tierra y la Luna menos se parecen.',
  },
  teacher: {
    tagline: 'Amplitud térmica: una diferencia real que hay que explicar, no esconder',
    overview:
      'Se trabaja la amplitud térmica como diferencia día–noche, su medición con MODIS y Diviner, y su comparación con una razón logarítmica. La similitud casi siempre es cercana a 0, y eso es un resultado físico: la Luna no tiene atmósfera y su día dura 29.5 días terrestres.',
    objectives: [
      'Definir la amplitud térmica y relacionarla con la atmósfera y la duración del día.',
      'Explicar por qué este eje se compara con una razón logarítmica.',
      'Interpretar una similitud cercana a 0 como evidencia de una diferencia real.',
    ],
  },
  submodules: {
    concept: {
      summary: 'Por qué en la Luna el suelo pasa de muy caliente a muy frío, y en el desierto no tanto.',
      student: {
        introduction:
          'Si caminas descalzo en la arena del desierto al mediodía, te quema. En la noche, la misma arena está fresca. En la Luna pasa lo mismo, pero muchísimo más fuerte.',
        blocks: [
          {
            id: 'que-es',
            title: 'Día y noche',
            body: 'La amplitud térmica es la diferencia entre la temperatura del suelo en el día y en la noche. En El Elegante, en Sonora, cambia [[earth elegante thermal]]. En el cráter Linné, en la Luna, cambia [[moon elegante thermal]]: unas [[times elegante thermal]] veces más.',
            visual: 'thermal-bars',
          },
          {
            id: 'por-que',
            title: '¿Por qué tanta diferencia?',
            body: 'La Tierra tiene atmósfera: el aire funciona como una cobija que guarda el calor de noche. La Luna no tiene aire.\n\nAdemás, un día en la Luna dura casi un mes: unas dos semanas de sol y dos de noche. El suelo tiene mucho tiempo para calentarse y para enfriarse.',
            imageId: 'diviner-south-pole',
          },
        ],
        concepts: [
          { term: 'Temperatura', definition: 'Qué tan caliente o frío está algo.' },
          { term: 'Amplitud térmica', definition: 'Cuánto cambia la temperatura entre el día y la noche.' },
          { term: 'Atmósfera', definition: 'La capa de aire que rodea la Tierra. La Luna casi no tiene.' },
        ],
        earth: 'En El Elegante, el suelo cambia [[earth elegante thermal]] entre el día y la noche. Un kelvin (K) es lo mismo que un grado Celsius de diferencia.',
        moon: 'En Linné, el suelo cambia [[moon elegante thermal]]. Es como pasar de un horno a un congelador muy potente.',
        comparisonLead: 'Mira las barras: la de la Luna es muchísimo más larga. Esa diferencia es real.',
        facts: [
          'Un día lunar, de un amanecer al siguiente, dura unos 29.5 días de la Tierra.',
          'Los trajes de los astronautas del Apolo tenían muchas capas para protegerlos del calor y del frío.',
        ],
        activities: [
          {
            title: 'La cobija de la Tierra',
            description:
              'Pon dos vasos con agua tibia: uno tapado con una toalla y otro destapado. Después de 15 minutos, toca el agua. ¿Cuál se enfrió más? La toalla es como la atmósfera.',
            type: 'model',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Dónde cambia más la temperatura entre el día y la noche?',
            options: ['En el desierto de Sonora', 'En la Luna', 'Igual en los dos'],
            answer: 1,
            explanation: 'En Linné cambia [[moon elegante thermal]] y en El Elegante [[earth elegante thermal]].',
          },
          {
            question: '¿Qué ayuda a que la Tierra no se enfríe tanto de noche?',
            options: ['La atmósfera', 'La Luna', 'Las rocas'],
            answer: 0,
            explanation: 'El aire guarda parte del calor, como una cobija.',
          },
        ],
        conclusion:
          'En este eje la Tierra y la Luna son muy distintas, y eso está bien: también aprendemos de las diferencias. Por eso los equipos que van a la Luna deben aguantar calor y frío extremos.',
      },
      teacher: {
        objectives: ['Definir la amplitud térmica con un ejemplo del desierto.', 'Relacionar la atmósfera con temperaturas más estables.'],
        priorKnowledge: ['Noción de temperatura caliente y fría.', 'Saber que la Luna no tiene aire para respirar.'],
        materials: ['Dos vasos con agua tibia', 'Una toalla', 'Termómetro (opcional)'],
        explanation:
          'Lo esencial: la amplitud térmica es la diferencia día–noche; la Luna la tiene mucho mayor porque no tiene atmósfera y su día dura casi un mes. Error frecuente: decir que la Luna «es fría»; de día su suelo se calienta mucho más que el desierto.',
        steps: [
          { title: 'Arena caliente', description: 'Pregunte quién ha pisado arena muy caliente y cómo se siente de noche.', minutes: 5 },
          { title: 'Las barras', description: 'Muestre la figura de barras con El Elegante y Linné.', minutes: 8 },
          { title: 'La cobija de la Tierra', description: 'Monten el experimento de los vasos.', minutes: 15 },
          { title: '¿Por qué?', description: 'Expliquen el papel de la atmósfera y del día lunar largo.', minutes: 8 },
          { title: 'Cierre', description: 'Revisen los vasos y respondan la comprobación.', minutes: 4 },
        ],
        discussion: ['¿Qué necesitaría un robot para trabajar en la Luna de día y de noche?', '¿En qué época del año cambia más la temperatura en tu ciudad?'],
        dataActivity: {
          title: 'Cuántas veces más',
          description: 'Dibujen una barra de 3 cm para El Elegante ([[earth elegante thermal]]). ¿Qué tan larga sería la de Linné ([[moon elegante thermal]])? Es unas [[times elegante thermal]] veces más larga.',
          minutes: 8,
        },
        assessment: ['Explicar con sus palabras el experimento de la toalla.', 'Dibujar un día y una noche en la Luna con un termómetro.'],
        outcomes: ['El grupo explica qué es la amplitud térmica.', 'El grupo relaciona la atmósfera con temperaturas más estables.'],
        alternative: {
          title: 'Manos al Sol',
          description: 'Sin vasos: los niños ponen una mano al Sol y otra a la sombra, y comparan. Luego explique que la Luna no tiene «sombra de aire».',
          type: 'demonstration',
          materials: [],
        },
        siteActivities: ['Medir la temperatura del suelo del patio a mediodía y al salir de clase.', 'Comparar con la temperatura del aire a la misma hora.'],
      },
    },

    measurement: {
      summary: 'Temperaturas desde órbita, escala logarítmica y celdas regionales: cómo se mide y compara la amplitud térmica.',
      student: {
        introduction:
          'Medir la temperatura del suelo desde un satélite requiere sensores infrarrojos y muchas observaciones de día y de noche. Comparar la Tierra con la Luna requiere, además, decidir cómo medir una diferencia tan grande. Esta lección trata de esas dos decisiones.',
        blocks: [
          {
            id: 'sensores',
            title: 'MODIS y Diviner',
            body: 'En la Tierra, Aqua MODIS (MYD11A2) estima la temperatura de la superficie a partir de su emisión infrarroja, con pasadas cerca de la 1:30 de la tarde y de la madrugada. El valor del eje es la temperatura de día menos la de noche, promediada un año: en El Elegante, [[earth elegante thermal]].\n\nEn la Luna, Diviner registra la temperatura a lo largo del ciclo lunar. El valor es la máxima menos la mínima: en Linné, [[moon elegante thermal]].',
            visual: 'thermal-bars',
          },
          {
            id: 'log',
            title: '¿Por qué una razón logarítmica?',
            body: 'Este es el único eje que no compara la diferencia de valores, sino cuántas veces es mayor uno que otro. La similitud es S = 100 · máx(0, 1 − |log₁₀(x_T/x_L)| / log₁₀(R)), con R = [[R thermal]]: si un valor es 10 veces el otro, la similitud es 0.\n\nLinné oscila unas [[times elegante thermal]] veces más que El Elegante, y la similitud que calcula el backend es [[s elegante thermal]]. Usa el botón de escala logarítmica para ver por qué.',
          },
          {
            id: 'polo',
            title: 'El polo sur y la escala regional',
            body: 'En el borde de Shackleton el Sol nunca sube mucho: la amplitud es solo [[moon cucapa thermal]], frente a [[earth cucapa thermal]] en la Sierra Cucapá. La similitud sube a [[s cucapa thermal]].\n\nOjo con la escala: la temperatura lunar fuera del polo viene de celdas de Diviner de unos 15 km, más grandes que el área de análisis. En Shackleton se usa un producto polar más fino. Son valores de contexto, no de cada roca.',
          },
        ],
        concepts: [
          { term: 'Temperatura de brillo', definition: 'Temperatura que se deduce de la radiación infrarroja que emite una superficie.' },
          { term: 'Escala logarítmica', definition: 'Escala en la que cada marca vale 10 veces la anterior; sirve para comparar proporciones.' },
          { term: 'Razón', definition: 'Cociente entre dos valores; dice cuántas veces es uno mayor que el otro.' },
          { term: 'Celda regional', definition: 'Píxel grande que promedia un área mayor que el sitio estudiado; da un valor de contexto.' },
        ],
        earth: 'Aqua MODIS MYD11A2, día menos noche, promedio anual, píxeles de 1 km. El Elegante: [[earth elegante thermal]]; Sierra Cucapá: [[earth cucapa thermal]].',
        moon: 'LRO Diviner, máxima menos mínima del ciclo lunar. Linné: [[moon elegante thermal]] (celda de unos 15 km); borde de Shackleton: [[moon cucapa thermal]].',
        comparisonLead: 'La escala del eje es logarítmica. Compara cuántas «décadas» separan cada par y relaciónalo con su similitud.',
        facts: [
          'Diviner ha medido algunas de las temperaturas más bajas del sistema solar, en cráteres polares que nunca reciben luz del Sol.',
          'Un kelvin de diferencia es igual a un grado Celsius de diferencia; solo cambia el punto de partida de la escala.',
          'El eje térmico tiene confianza [[conf thermal]]: los dos datos son satelitales directos, aunque de escalas distintas.',
        ],
        activities: [
          {
            title: 'Lineal contra logarítmica',
            description:
              'Grafica los cuatro valores de amplitud (dos pares) en una escala lineal y en papel semilogarítmico. ¿En cuál se ve mejor qué tan distinta es la Luna? ¿En cuál se ve mejor la diferencia entre Linné y Shackleton?',
            type: 'calculation',
            minutes: 18,
          },
        ],
        quiz: [
          {
            question: '¿Por qué este eje usa una razón logarítmica?',
            options: [
              'Porque importa cuántas veces es mayor un valor que el otro',
              'Porque los datos son negativos',
              'Porque la Luna no tiene temperatura',
              'Porque así la similitud siempre es 100',
            ],
            answer: 0,
            explanation: 'Con valores que difieren en un orden de magnitud, la proporción es más informativa que la resta.',
          },
          {
            question: 'Con R = [[R thermal]], ¿cuándo es 0 la similitud?',
            options: ['Cuando un valor es 10 veces o más el otro', 'Cuando los dos valores son iguales', 'Cuando la diferencia es de 10 K', 'Nunca'],
            answer: 0,
            explanation: '|log₁₀(10)| / log₁₀(10) = 1, y 1 − 1 = 0.',
          },
          {
            question: '¿Por qué el borde de Shackleton tiene menos amplitud que Linné?',
            options: ['Porque tiene atmósfera', 'Porque el Sol siempre está muy bajo en el polo', 'Porque está en la Tierra', 'Porque es más rugoso'],
            answer: 1,
            explanation: 'Con el Sol rasante, el suelo nunca se calienta tanto como en el ecuador lunar.',
          },
          {
            question: '¿Qué limitación tiene el valor lunar de Linné?',
            options: ['Es inventado', 'Viene de una celda de unos 15 km, mayor que el área de análisis', 'No tiene fuente', 'Es provisional'],
            answer: 1,
            explanation: 'Es un valor regional de contexto, no de cada punto del cráter.',
          },
        ],
        conclusion:
          'Elegir cómo comparar es una decisión científica. La razón logarítmica muestra con claridad que la Luna oscila un orden de magnitud más que la Tierra. Que la similitud sea casi 0 no es un error: es la conclusión correcta del método.',
      },
      teacher: {
        objectives: [
          'Describir la medición de la temperatura superficial con MODIS y Diviner.',
          'Calcular e interpretar una similitud de razón logarítmica.',
          'Evaluar el efecto de las celdas regionales en la comparación.',
        ],
        priorKnowledge: ['Logaritmos base 10.', 'Radiación infrarroja y temperatura.', 'Escalas lineal y logarítmica.'],
        materials: ['Papel milimétrico y semilogarítmico', 'Calculadora científica', 'Proyector'],
        explanation:
          'Lo esencial: la amplitud se compara con una razón logarítmica de tolerancia [[R thermal]]; un factor 10 lleva la similitud a 0. El Elegante ↔ Linné ([[s elegante thermal]]) y Cucapá ↔ Shackleton ([[s cucapa thermal]]) ilustran el ecuador y el polo. Error frecuente: interpretar la similitud cercana a 0 como dato defectuoso.',
        steps: [
          { title: 'Problema', description: '¿Cómo compararías 30 K con 280 K de forma justa: con una resta o con una razón?', minutes: 6 },
          { title: 'Sensores', description: 'Explique MODIS y Diviner y el valor de cada sitio.', minutes: 10 },
          { title: 'Lineal contra logarítmica', description: 'Los alumnos grafican y comparan las dos escalas.', minutes: 15 },
          { title: 'Fórmula', description: 'Calculen la razón y su logaritmo para los dos pares y comparen con la similitud del backend.', minutes: 12 },
          { title: 'Cierre', description: 'Discutan la escala regional y respondan la comprobación.', minutes: 7 },
        ],
        discussion: [
          '¿Qué ventajas y desventajas tiene la razón logarítmica frente a la diferencia simple?',
          '¿Cómo cambiaría el valor de Linné si Diviner tuviera celdas de 1 km?',
          '¿Por qué conviene mostrar un eje que siempre da casi 0?',
        ],
        dataActivity: {
          title: 'Verificar con la fórmula',
          description:
            'Con calculadora, obtengan |log₁₀(x_T/x_L)| para El Elegante ↔ Linné y para Cucapá ↔ Shackleton, divídanlo entre log₁₀([[R thermal]]) y comparen con las similitudes del backend ([[s elegante thermal]] y [[s cucapa thermal]]). El objetivo es entender la fórmula, no reemplazar el valor del backend.',
          minutes: 12,
        },
        assessment: ['Resolver un ejercicio de similitud logarítmica con valores dados.', 'Ensayo breve: ¿por qué la similitud térmica casi 0 es un resultado y no un error?'],
        outcomes: [
          'El grupo explica cómo se mide la amplitud térmica.',
          'El grupo interpreta una similitud logarítmica.',
          'El grupo identifica la limitación de la escala regional.',
        ],
        alternative: {
          title: 'Escalas impresas',
          description: 'Sin papel semilogarítmico: imprima una regla logarítmica de 10 a 1000 y los alumnos marcan los cuatro valores.',
          type: 'printable',
          materials: ['Regla logarítmica impresa', 'Colores'],
        },
        siteActivities: ['Registrar la temperatura del suelo de un patio en la mañana y en la tarde.', 'Comparar suelo oscuro y suelo claro a la misma hora.'],
      },
    },

    analogs: {
      summary: 'Tres pares en el eje térmico: dos lejanísimos y uno, en el polo, un poco menos.',
      student: {
        introduction:
          'En casi todos los pares, este es el eje donde la Tierra y la Luna menos se parecen. Pero hay una excepción interesante en el polo sur lunar. Vamos a ver los tres casos.',
        blocks: [
          {
            id: 'ecuador',
            title: 'Dos cráteres y dos campos volcánicos',
            body: 'El Elegante oscila [[earth elegante thermal]] y Linné [[moon elegante thermal]]: similitud de [[s elegante thermal]]. El Pinacate oscila [[earth pinacate thermal]] y Marius Hills [[moon pinacate thermal]]: similitud de [[s pinacate thermal]].\n\nEn los dos casos la Luna cambia alrededor de 10 veces más. Con esa diferencia, la similitud llega prácticamente a 0.',
            visual: 'thermal-bars',
          },
          {
            id: 'polo',
            title: 'El polo sur: la excepción',
            body: 'En el borde de Shackleton el Sol siempre está bajo, como en un atardecer que nunca termina. Su amplitud es [[moon cucapa thermal]], y la de la Sierra Cucapá, [[earth cucapa thermal]]. La similitud sube a [[s cucapa thermal]].\n\nSigue siendo baja, pero muestra que la latitud importa tanto como la atmósfera.',
            visual: 'thermal-bars',
            visualPair: 'cucapa_shackleton',
          },
          {
            id: 'lectura',
            title: 'Cómo leer un eje que casi siempre da 0',
            body: 'Que un eje dé 0 no significa que el análogo no sirva. Significa que, para estudiar temperaturas, la Tierra no reproduce la Luna. Para estudiar rocas o relieve, sí puede servir. La exactitud reúne todos los ejes, y este eje recuerda que ningún análogo es completo.',
          },
        ],
        concepts: [
          { term: 'Latitud', definition: 'Qué tan al norte o al sur está un lugar. En los polos el Sol se ve siempre bajo.' },
          { term: 'Sol rasante', definition: 'Luz del Sol que llega casi horizontal; calienta poco el suelo.' },
          { term: 'Análogo parcial', definition: 'Sitio que se parece en algunos ejes y no en otros.' },
        ],
        earth: 'Tres sitios de la región: El Elegante ([[earth elegante thermal]]), El Pinacate ([[earth pinacate thermal]]) y la Sierra Cucapá ([[earth cucapa thermal]]).',
        moon: 'Tres sitios lunares: Linné ([[moon elegante thermal]]), Marius Hills ([[moon pinacate thermal]]) y el borde de Shackleton ([[moon cucapa thermal]]).',
        comparisonLead: 'En la escala logarítmica, ¿qué par tiene la línea más corta? ¿Por qué ese par es diferente a los otros dos?',
        facts: [
          'El borde de Shackleton recibe luz del Sol una gran parte del tiempo, por eso es atractivo para instalar paneles solares.',
          'En el ecuador lunar el suelo supera de día la temperatura a la que hierve el agua en la Tierra.',
          'La Sierra Cucapá tiene la amplitud térmica más baja de los sitios terrestres del proyecto: [[earth cucapa thermal]].',
        ],
        activities: [
          {
            title: 'Diseña un hábitat',
            description:
              'Elige uno de los tres sitios lunares y escribe dos características que debería tener un hábitat para soportar su amplitud térmica. ¿Cambiarían tus ideas si eligieras Shackleton?',
            type: 'reflection',
            minutes: 15,
          },
        ],
        quiz: [
          {
            question: '¿Qué par tiene la mayor similitud térmica?',
            options: ['El Elegante ↔ Linné', 'Pinacate ↔ Marius Hills', 'Sierra Cucapá ↔ Shackleton'],
            answer: 2,
            explanation: 'Su similitud es [[s cucapa thermal]], porque en el polo lunar la amplitud es menor.',
          },
          {
            question: '¿Por qué la similitud térmica casi siempre está cerca de 0?',
            options: ['Porque la Luna oscila unas 10 veces más que la Tierra', 'Porque el satélite falló', 'Porque los sitios no son volcánicos'],
            answer: 0,
            explanation: 'Con un factor de 10, la razón logarítmica lleva la similitud a 0.',
          },
          {
            question: '¿Qué significa que un eje dé 0 en un par?',
            options: ['Que el par no sirve para nada', 'Que en ese aspecto los sitios son muy distintos, aunque se parezcan en otros', 'Que faltan datos'],
            answer: 1,
            explanation: 'Un eje bajo no invalida el análogo: muestra dónde se rompe la analogía.',
          },
        ],
        conclusion:
          'La temperatura es el recordatorio más claro de que la Tierra no es la Luna. Al estudiar análogos, conviene saber para qué sirven y para qué no.',
      },
      teacher: {
        objectives: [
          'Interpretar la similitud térmica de tres pares.',
          'Explicar el efecto de la latitud en la amplitud lunar.',
          'Usar un eje de similitud baja para discutir los límites de los análogos.',
        ],
        priorKnowledge: ['Amplitud térmica y atmósfera.', 'Escala logarítmica básica.'],
        materials: ['Proyector', 'Hojas de trabajo para el hábitat'],
        explanation:
          'Lo esencial: El Elegante ↔ Linné ([[s elegante thermal]]) y Pinacate ↔ Marius Hills ([[s pinacate thermal]]) quedan cerca de 0; Cucapá ↔ Shackleton ([[s cucapa thermal]]) sube por la iluminación polar. Error frecuente: concluir que los análogos «no sirven» porque este eje es bajo.',
        steps: [
          { title: 'Repaso', description: 'Recuerde por qué la Luna oscila más.', minutes: 5 },
          { title: 'Tres pares', description: 'Presente las barras de los tres pares.', minutes: 12 },
          { title: 'Diseña un hábitat', description: 'Actividad en equipos.', minutes: 15 },
          { title: 'La excepción polar', description: 'Discutan el caso de Shackleton y la latitud.', minutes: 10 },
          { title: 'Cierre', description: 'Comprobación de tres preguntas.', minutes: 8 },
        ],
        discussion: [
          '¿Por qué un eje que casi siempre da 0 sigue siendo útil?',
          '¿Qué ventaja tiene el polo sur para una base lunar desde el punto de vista térmico?',
          '¿Qué lugar de la Tierra tendría una amplitud térmica más parecida a la lunar?',
        ],
        dataActivity: {
          title: 'Ordenar por similitud',
          description: 'Los equipos ordenan los tres pares por similitud térmica y explican por qué Shackleton queda primero, aunque su similitud sea [[s cucapa thermal]].',
          minutes: 10,
        },
        assessment: ['Revisar el diseño del hábitat: ¿responde a la amplitud del sitio elegido?', 'Explicar por escrito la excepción polar.'],
        outcomes: ['El grupo interpreta similitudes térmicas bajas.', 'El grupo relaciona la latitud con la amplitud lunar.'],
        alternative: {
          title: 'Lámpara y globo',
          description: 'Ilumine un globo con una lámpara: el ecuador recibe luz directa y los polos luz rasante. Relacione con Linné y Shackleton.',
          type: 'demonstration',
          materials: ['Globo o pelota', 'Lámpara'],
        },
        siteActivities: ['Comparar la sombra de un objeto a mediodía y al atardecer: la luz rasante calienta menos.', 'Registrar la temperatura de una ladera al sol y otra a la sombra.'],
      },
    },
  },
};
