# Misión 4Kids — «Lunita necesita un camino» (6–12 años)

Segunda misión del Laboratorio de misiones. En el Portal Educativo aparece **justo debajo** de la Misión 01
(12–17 años), con el distintivo **4Kids**, la etiqueta **6–12 años** y el botón **Jugar misión**.

- Ruta: `/es/portal-educativo/mision/lunita` · `/en/educational-portal/mission/lunita`
- Sin cuentas ni servidor: el avance (incluida la ruta dibujada) se guarda en `localStorage`
  (`starman-mission-lunita-v1`) y sobrevive a una recarga.
- **Todo es ilustrativo.** El mapa terrestre, el campo de rocas y el terreno lunar son dibujos.
  La interfaz lo marca con la etiqueta «Mapa ilustrativo».

## Flujo (una instrucción por pantalla)

1. **Mira** el terreno lunar. Lunita muestra un camino hacia un cráter y señala las rocas que debe rodear.
   El reto, en una frase: «Antes de ir a la Luna, encontremos un lugar en la Tierra para practicar».
2. **Arma** el mapa terrestre, de tres piezas: bosque y lago, campo de rocas volcánicas, playa y mar.
   - Se arma arrastrando (mouse o dedo), tocando una pieza y luego un espacio, o con teclado (Enter en la pieza, Enter en el espacio).
   - Una pieza mal colocada no se queda y Lunita da una pista.
   - Con el mapa completo, señalan qué parte se parece a la Luna; si eligen otra, reciben una pista amable. Después eligen por qué serviría (rocas, cráteres, sin plantas, seco).
3. **Dibuja** el camino desde Lunita hasta la bandera. Hay tres formas:
   - a mano alzada;
   - marcando puntos con toques;
   - con teclado: flechas para mover la mira y Enter para marcar.

   Los botones son «Deshacer» (quita el último trazo), «Borrar ruta» y «Mover a Lunita».
4. **Prueba y corrige.** Lunita se anima sobre el trazo.
   - Si cruza una roca, se detiene antes de ella, la roca se marca y aparece la pista «Hay una roca aquí. ¿Por dónde podrías rodearla?».
   - Se corrige en el mismo lienzo, sin rehacer el rompecabezas: con «Deshacer», siguiendo el dibujo o con «Seguir desde aquí», que recorta la ruta donde se detuvo.
   - Vale **cualquier** ruta que llegue a la meta sin tocar rocas: por arriba, por abajo o en zigzag.
5. **Cuenta.** Señalan qué parte les ayudó y completan «Este lugar sirve para practicar porque…».
   - **6–8 años:** pueden marcar «Lo dije en voz alta».
   - **9–12 años:** escriben, y tienen un reto opcional: «Si Lunita necesitara practicar una subida, ¿qué buscarías en otro lugar?».

## Archivos

| Qué | Dónde |
| --- | --- |
| Geometría, rocas, rutas de ejemplo y lógica de choque (pura) | `src/data/missions/lunitaMission.ts` |
| Avance guardado | `src/hooks/useLunitaProgress.ts` |
| Ilustraciones SVG (Lunita, mapa, Luna, campo) | `src/components/lunita/LunitaArt.tsx` |
| Rompecabezas | `src/components/lunita/MapPuzzle.tsx` |
| Lienzo del camino y animación | `src/components/lunita/PathCanvas.tsx` |
| Página | `src/pages/LunitaMissionPage.tsx` |
| Entrada en el Portal | `src/components/mission/LunitaFeature.tsx` |
| Textos ES / EN | `src/i18n/missions/lunita.es.ts`, `lunita.en.ts` |
| Estilos | `src/styles/lunita.css` |
| Verificación | `npm run verify:lunita` |

Para mover rocas o cambiar el campo, edita `ROCKS` y `SAMPLE_ROUTES`. Después ejecuta `npm run verify:lunita`, que comprueba que:

- la línea recta siga bloqueada;
- haya al menos dos rutas válidas.
