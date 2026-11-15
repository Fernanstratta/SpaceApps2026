# Misión 01 — ¿Dónde probarías un rover antes de enviarlo a la Luna?

Primera misión del laboratorio de misiones de Starman. Un equipo elige un sitio de la Tierra para ensayar una
maniobra del rover lunar (bajar por la pared interior de un cráter y volver a subir al borde) y defiende la
decisión con evidencia topográfica.

| Vista | Ruta (ES / EN) | Archivo |
| --- | --- | --- |
| Estudiantes · «Iniciar misión» | `/es/portal-educativo/mision/rover-lunar/iniciar` · `/en/educational-portal/mission/lunar-rover/start` | `src/pages/MissionStudentPage.tsx` |
| Docentes · «Impartir esta clase» | `/es/portal-educativo/mision/rover-lunar/clase` · `/en/educational-portal/mission/lunar-rover/teach` | `src/pages/MissionTeacherPage.tsx` |

Se entra desde la misión destacada del Portal Educativo y desde las pestañas Aprender / Enseñar de los ejes
*Pendiente y seguridad de aterrizaje* y *Morfología de cráteres y cavidades*.

## Recorrido del estudiante (5 pasos)

1. **Reto:** sitio provisional e hipótesis.
2. **Bitácora de hallazgos:** desde el visor, «Registrar hallazgo» guarda un *punto* del perfil, el *tramo completo*
   (estadísticas de la pared) o la *foto*, con la capa consultada, la fuente y una nota del equipo. Los hallazgos se
   editan y se eliminan. El borrador también se guarda en el navegador.
3. **Propuesta:** sitio, hallazgo principal, explicación, limitación y próximo dato. Se imprime la **ficha para
   revisión**, que trae un espacio en blanco para la objeción de otro equipo.
4. **Revisión:** el equipo copia la objeción que recibió y elige «Mantener mi propuesta», «Cambiar de sitio» o
   «Necesitamos más evidencia». Debe explicar qué dato respalda su decisión o qué dato hace falta.
5. **Ficha final:** elección inicial, hallazgo principal, objeción y decisión revisada. La app **no califica** el
   sitio: cualquier decisión vale si está respaldada por datos.

Todo vive en `localStorage` (`starman-mission-rover-v2`; el formato anterior se migra solo). No hay cuentas ni
sincronización: las fichas se intercambian impresas o en PDF. Si una fuente se marca como `simulated` en
`MISSION_SOURCES`, la etiqueta «dato simulado» aparece en el visor, la bitácora y la ficha.

## Sitios

| Sitio | Papel | Centro (fondo del cráter en el DEM) |
| --- | --- | --- |
| Cráter El Elegante, Gran Desierto de Altar (Sonora) | Candidato | 31.84535, −113.38971 |
| Meteor Crater / cráter Barringer (Arizona) | Candidato | 35.02807, −111.02115 |
| Cráter North Ray, Apolo 16 (Luna) | Referencia lunar | −8.81258, 15.48751 |

## Datos verificados

| Dato | Valor usado | Fuente |
| --- | --- | --- |
| Elevación de la Tierra | Malla de 41 × 41 puntos cada 75 m | Copernicus DEM GLO-90 (ESA/UE, [doi:10.5270/ESA-c5d3d65](https://doi.org/10.5270/ESA-c5d3d65)) mediante la [API de elevación de Open-Meteo](https://open-meteo.com/en/docs/elevation-api) |
| Elevación de la Luna | Malla de 41 × 41 puntos cada 75 m | [SLDEM2015 (LOLA + Kaguya TC, 59 m)](https://astrogeology.usgs.gov/search/map/moon_lro_lola_selene_kaguya_tc_dem_merge_60n60s_59m), USGS Astrogeology; Barker et al. (2016), *Icarus* 273 |
| North Ray: 1000–1100 m de diámetro, ~230 m de profundidad, paredes de ~30–35°, rover estacionado junto al borde | Texto y comparación | [Apollo 16 Lunar Surface Journal, estación 11](https://www.apollojournals.org/alsj/a16/a16.sta11.html) |
| El rover sube y baja pendientes de 25° y se estaciona en 35° | Límite de 25° en el visor | [NASA SP-4214, cap. 13-3](https://www.nasa.gov/wp-content/uploads/static/history/SP-4214/ch13-3.html) |
| Masa del rover 210 kg, altura libre 36 cm | Guía | [NSSDC — Apollo LRV](https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html) |
| Gravedad: 1,62 m/s² (Luna) y 9,80 m/s² (Tierra) | Preguntas de discusión | [NSSDC — Moon Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html) |
| El Elegante es un maar de ~1,6 km | Ficha del sitio | Descripción de la foto de R. Waitt (USGS) en [Commons](https://commons.wikimedia.org/wiki/File:Pinacate_volcanic_field.jpg) |
| El Pinacate fue un sitio temprano de entrenamiento Apolo; el Gran Desierto es uno de los mayores campos de dunas de Norteamérica | Ficha del sitio | [NASA Earth Observatory / Gateway to Astronaut Photography](https://eol.jsc.nasa.gov/Collections/EarthObservatory/articles/PinacatesBiosphereReservehtm.htm) |
| Meteor Crater es el cráter de impacto expuesto mejor conservado y fue sitio de entrenamiento de astronautas | Ficha del sitio | [USGS, Vaughan et al. (2019)](https://www.usgs.gov/publications/walk-footsteps-apollo-astronauts-a-field-guide-northern-arizona-astronaut-training) |
| Fotos | — | Wikimedia Commons: USGS (dominio público) y NASA (CC0). Autor y licencia en `MISSION_SOURCES` |

**Control de calidad.** `npm run verify:mission` comprueba que el DEM reproduce las dimensiones publicadas:

| Sitio | Ancho medido / publicado | Profundidad medida / publicada |
| --- | --- | --- |
| El Elegante | 1500–1650 m / ~1,6 km | 219–226 m / 244–250 m |
| Meteor Crater | 1125 m / ~1,2 km | 152–153 m / ~170 m |
| North Ray (norte–sur) | 1050 m / 1000–1100 m | 228 m / ~230 m |

## Valores calculados (no son datos de origen)

Los calcula `src/utils/terrain.ts` en el navegador a partir de los DEM: la pendiente de cada celda y de cada
segmento del tramo, el relieve sombreado, los bordes del cráter, la profundidad y la distancia de borde a borde.

## Datos simulados

**Ninguno.** Si en una futura misión faltara un dato, se marcaría en pantalla como «dato simulado» y se indicaría
aquí qué fuente lo sustituiría.

## Limitaciones que la misión hace explícitas

- Los DEM tienen píxeles de 90 m (Tierra) y 59 m (Luna), así que no muestran rocas ni escalones.
- Los cráteres de la Tierra tienen atmósfera, erosión y vegetación, y suelo de arena o roca en lugar de regolito.
- En la Luna, la gravedad es 1/6 de la terrestre.

## Regenerar los datos

```bash
npm run fetch:terrain   # descarga las mallas y reescribe src/data/missions/rover-terrain.generated.json
npm run verify:mission  # comprueba que siguen coincidiendo con las dimensiones publicadas
```

El DEM lunar se lee del GeoTIFF de 22 GB de USGS mediante peticiones HTTP por rangos; no hace falta descargarlo.
Open-Meteo limita las peticiones gratuitas, así que el script espera y reintenta cuando recibe un 429.

## Para el backend

- El avance del equipo vive en `localStorage` (`src/hooks/useMissionProgress.ts`). Para guardarlo en el servidor
  o compartirlo con el docente, basta con sincronizar ese hook.
- Los sitios y fuentes están en `src/data/missions/roverMission.ts` y los textos en `src/i18n/missions/`. Una
  nueva misión puede seguir la misma forma.
