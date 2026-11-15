# Starman — Fase 1 (base funcional)

Plataforma educativa bilingüe (español / inglés) para explorar conceptos astronómicos de la Tierra y la Luna.
**Misión 01** — «¿Dónde probarías un rover antes de enviarlo a la Luna?»: vista de estudiantes y guía docente de 45 min, con datos de elevación reales de la Tierra y la Luna. Ver [docs/mission-rover.md](docs/mission-rover.md).
**Misión 4Kids** — «Lunita necesita un camino» (6–12 años): rompecabezas de un mapa ilustrado y un camino dibujado que Lunita recorre. Ver [docs/mission-lunita.md](docs/mission-lunita.md).
El idioma se elige por la URL (`/es`, `/en`), la elección del usuario, el país o el navegador: ver [docs/i18n.md](docs/i18n.md).
Esta fase entrega la estructura, la navegación, el portal de módulos (cada tema con pestañas Aprender/Enseñar) y la arquitectura de datos.
**No** contiene comparaciones, mediciones, planes de clase ni recomendaciones geográficas: esos campos están en `null` a propósito.

## Requisitos

- Node.js 20.19+ o 22.12+ (requisito de Vite 7)
- npm

## Ejecutar localmente

```bash
npm install
npm run dev          # servidor de desarrollo en http://localhost:5173
npm run build        # verificación de tipos + build de producción en dist/
npm run preview      # sirve el build de producción
npm run typecheck    # solo TypeScript
npm run verify:data  # comprueba datos: campos pendientes en null, submódulos e imágenes válidos
npm run verify:i18n  # comprueba la elección de idioma (MX, US, país desconocido…) y que no falten traducciones
npm run verify:mission # comprueba la Misión 01: DEM contra dimensiones publicadas, fuentes y recorrido
npm run verify:lunita  # comprueba la misión 4Kids: rutas válidas y bloqueadas, corrección, guardado y textos
npm run fetch:terrain  # (opcional, con internet) vuelve a descargar los datos de elevación de la misión
```

> **Despliegue:** la app usa rutas del History API (`/es/portal-educativo/gravity`, `/en/educational-portal/gravity`). En hosting estático configura
> el *fallback* a `index.html` (Netlify `_redirects`, Vercel `rewrites`, etc.). Si se publica en una subruta,
> cambia `base` en `vite.config.ts`.

## Stack

React 19 + TypeScript + Vite. Leaflet/React Leaflet para mapas (se cargan de forma diferida y **solo** cuando
hay ubicaciones reales). Sin backend, sin autenticación, sin APIs externas para el contenido.
El enrutamiento es un router mínimo propio (`src/router/`) sin dependencias; se puede sustituir por React Router
sin cambiar las páginas.

## Estructura

```text
src/
├── components/
│   ├── home/        HeroSection, MoonImage, PortalPreviewSection, AboutSection, ResourcesSection
│   ├── common/      TopicPhoto (foto con respaldo), NullableSection, DataStateMessage, FieldList, TextList, ErrorBoundary, ExternalLink
│   ├── layout/      Layout, PageHeader, SiteFooter, BrandMark
│   ├── navigation/  SiteHeader (menú colapsable en móvil), SectionLink, navItems
│   ├── portal/      TopicRow/SubmoduleList, SubmoduleCard, ImageCredits, TopicIcon, TopicPager
│   ├── modules/     TopicBanner, TopicTabs, StudentModuleView, TeacherModuleView, ComparisonTable, ...
│   ├── resources/   ResourceCategorySection, ResourceCard
│   └── maps/        LocationMap (wrapper null-safe), LeafletMap (lazy), ReferenceLocationCard, LocationDetails
├── i18n/            Bilingüismo: detección de idioma, rutas /es y /en, textos (messages/) y traducción de datos (content/)
├── content/         Colores por tema (topicVisuals.ts) y textos de Sobre Nosotros (about.ts, sin uso actual)
├── context/         ReferenceLocationContext (Mexicali por defecto)
├── data/            topics, submodules, images, studentModules, teacherModules, resources, comparisons, locations
├── hooks/           useReferenceLocation, useDocumentTitle, useSectionNavigation, useActiveSection
├── pages/           HomePage (página única), EducationalPortalPage, SubmodulePage, TopicModulePage, NotFoundPage
├── router/          Router, Link/NavLink, routes
├── styles/          global.css (estilo provisional, todo en variables CSS)
├── types/           Topic, Submodule, Media, StudentModule, TeacherModule, Location, Comparison, Resource
└── utils/           nullable (estados de datos), geo (haversine, formatos), scroll, commons (URLs de imágenes), text (búsqueda sin acentos)
```

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio de página única: portada, ¿Qué es Starman?, Sobre Nosotros (`#sobre-nosotros`) y Recursos (`#recursos`) |
| `/portal-educativo` | Módulos: buscador y una fila por tema con sus submódulos |
| `/portal-educativo/:topicId` | Tema: submódulos y pestañas Aprender / Enseñar (`?vista=ensenar` abre la segunda) |
| `/portal-educativo/:topicId/:submoduleId` | Submódulo: foto, contenido (pendiente) y otros módulos del tema |
| `/sobre-nosotros`, `/recursos` | Direcciones antiguas: redirigen a `/#sobre-nosotros` y `/#recursos` |

### Navegación por secciones

- **Inicio**, **Sobre Nosotros** y **Recursos** son anclas nativas (`/#recursos`) con desplazamiento suave;
  no recargan la página ni acumulan entradas en el historial (se usa `replaceState`). Desde el portal llevan a
  Inicio y abren la sección indicada.
- El desfase del encabezado se controla con `--header-height` y `scroll-padding-top` en `global.css`. El
  encabezado es `position: fixed` (no `sticky`) para que enfocar enlaces con el teclado no desplace la página.
- Tras desplazarse, el foco pasa al título de la sección; la sección visible se marca con
  `aria-current="location"`. Con `prefers-reduced-motion` el salto es inmediato.
- **Portal Educativo** es el botón principal (rectángulo amarillo) y sigue navegando al portal.

### Colores de las secciones

Portada negra (`--color-black`), ¿Qué es Starman? gris azulado claro (`--color-portal-bg`), Sobre Nosotros azul
noche (`--color-about-bg`) y Recursos crema (`--color-resources-bg`). Todos están en `:root` en `global.css`.

### Imagen de la Luna (portada)

La portada usa `public/46124-moon.png`, una foto de la Luna con fondo transparente (348 × 368 px) que se integra
al fondo negro sin recortes y conserva sus proporciones. Se configura en `HERO_MOON_IMAGE` (`src/content/home.ts`):

- **Licencia:** el origen de esta imagen no está documentado. Confirma su licencia antes de publicar; si la
  fuente exige atribución, rellena `credit` y `creditUrl` y el crédito aparecerá bajo la Luna.
- **Resolución:** el ancho en escritorio está limitado a 25rem para que no se vea borrosa; con una versión de
  mayor resolución puedes subir ese límite en `.hero__moon` (`global.css`).
- Si la imagen no carga, se muestra una ilustración simple de la Luna en su lugar.

## Arquitectura de datos

- **Identificadores compartidos** (`src/types/Topic.ts`): `size-scale`, `gravity`, `surface-terrain`,
  `earth-moon-distance`, `temperature`, `impact-craters`, `atmosphere`, `water-ice`. Los módulos usan
  `Record<TopicId, …>`, así que TypeScript falla si falta un tema en estudiante o docente.
- **`null` vs `[]`**: `null` = dato aún no proporcionado (mensaje «Contenido pendiente»); `[]` = dato
  proporcionado sin entradas (mensaje «No hay elementos registrados»). `NullableSection` aplica la regla y solo
  llama al render cuando hay datos, por lo que nunca se dibujan tablas, mapas ni marcadores vacíos o inventados.
- **Comparaciones** viven en `data/comparisons.ts`; **ubicaciones, recomendaciones y excursiones** en
  `data/locations.ts`. Los módulos las referencian, así que el dataset futuro se integra en un solo lugar.
- **Distancias** desde la ubicación de referencia se calculan al renderizar (haversine), no se guardan.
- Las páginas obtienen datos con `getStudentModule()` / `getTeacherModule()` (`data/index.ts`); al migrar a JSON
  solo cambian esas funciones.

### Cómo integrar datos más adelante

1. Reemplaza `null` por arreglos tipados en `comparisons.ts` / `locations.ts` (cada `Measurement` debe tener
   `sourceId` de `resources.ts`).
2. Completa los campos de `studentModules.ts` / `teacherModules.ts`.
3. Actualiza `scripts/verify-data.ts`, que hoy exige `null` en esos campos.

## Portal Educativo

- **Sin selector de modo.** Cada tema tiene dos pestañas: **Aprender** (contenido para estudiantes) y
  **Enseñar** (recursos docentes). Se navegan con flechas, Inicio y Fin; la pestaña elegida queda en la URL.
- **Una fila por tema.** Cada tema es una categoría con su color, su icono y tarjetas de submódulos
  (`data/submodules.ts`). Los títulos de los submódulos son **propuestas** para revisar; su contenido
  (`summary`) sigue en `null`.
- **Buscador** por tema, título o materia, sin distinguir mayúsculas ni acentos.
- **Colores por tema** en `content/topicVisuals.ts` (`color`, `strong` para texto sobre blanco, `soft` para fondos).

### Imágenes reales

16 fotografías de Wikimedia Commons (`data/images.ts`): obras de la NASA y del USGS en dominio público y una con
dedicación CC0. Se cargan directamente desde Commons (miniaturas de 500 y 960 px); los créditos aparecen al pie
del portal y bajo cada foto de encabezado. Si una imagen no carga, se muestra el icono del tema sobre su color.
Para agregar una imagen: copia el nombre exacto del archivo en Commons y la carpeta `x/xy` de su URL
(`upload.wikimedia.org/wikipedia/commons/x/xy/Archivo.jpg`), y confirma que la licencia sea libre.

## Recursos

13 fuentes verificadas de NASA (NSSDCA, JPL Horizons, Moon Trek, NASA Science), Arizona State University (LROC),
USGS (Mapa Geológico Unificado de la Luna, EarthExplorer), PASSC/UNB (Earth Impact Database), INEGI,
OpenStreetMap, Natural Earth y ESA. Cuando la licencia no se confirmó, el campo queda en `null` y la interfaz
pide consultar los términos del sitio de origen.

## Pendiente para siguientes fases

- Sistema de diseño definitivo (sustituir `styles/global.css`).
- Datasets estáticos: comparaciones, información de la Tierra y la Luna, ubicaciones reales.
- Contenido docente: niveles, objetivos, planes de clase, actividades, excursiones, alternativas.
- Interfaz para que el docente cambie la ubicación de referencia (el contexto ya expone `setReferenceLocation`).
- Revisar la [política de uso de teselas de OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/)
  antes de producción con tráfico alto.
#   S p a c e A p p s 2 0 2 6  
 