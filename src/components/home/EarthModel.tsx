import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme, type ResolvedTheme } from '../../context/ThemeContext';
import { useMessages } from '../../i18n/I18nContext';

/**
 * Cuerpos que se alternan sobre la misma esfera, en este orden. Las texturas
 * se sirven desde `public/textures/`. Si una imagen no carga, ese cuerpo se
 * salta en lugar de mostrar una esfera negra.
 */
const PLANETS = [
  { name: 'Tierra', surface: '/earthmap1k.jpg', cityLights: true },
  { name: 'Luna', surface: '/moonmap4k.jpg', cityLights: false },
  { name: 'Marte', surface: '/marsmap.png', cityLights: false },
];

/** Luces nocturnas de las ciudades; solo se muestran sobre la Tierra. */
const CITY_LIGHTS_TEXTURE = '/textures/03_earthlights1k.jpg';

/** Tiempo que se muestra cada cuerpo y duración del fundido entre uno y otro. */
const PLANET_DURATION_MS = 3000;
const FADE_MS = 700;

/** Brillo: sube o baja estos valores para aclarar u oscurecer el planeta. */
const SUN_INTENSITY = 2;
/**
 * Luz ambiente según el tema: sobre fondo negro el lado nocturno puede ser
 * oscuro; sobre fondo claro se aclara para que no parezca una mancha.
 */
const AMBIENT_INTENSITY: Record<ResolvedTheme, number> = { dark: 0.3, light: 0.95 };

/** Diámetro del planeta como fracción de la altura del hero (1 = toda la altura). */
const EARTH_SIZE = 1.3;

/**
 * Distancia del centro del planeta al borde derecho del hero, en alturas del
 * hero. 0 = centro justo en el borde (se ve la mitad); 0.5 = planeta completo
 * pegado al borde; valores intermedios lo cortan más o menos.
 */
const EARTH_CENTER_FROM_RIGHT = 0.3;

const CAMERA_FOV = 45;

/**
 * Hover sobre el planeta (solo con mouse y sin «reducir movimiento»):
 *  - Al entrar se encoge, se acerca un poco al centro y gira cada vez más
 *    rápido; al terminar de encogerse recupera su velocidad habitual.
 *  - Al salir vuelve a su lugar con un pequeño rebote.
 */
const HOVER = {
  /** Tamaño al encogerse (1 = tamaño normal). */
  scale: 0.66,
  /** Posición del centro, en alturas del hero desde el borde derecho, al encogerse. */
  centerFromRight: 0.48,
  /** Duración de cada animación (ms). */
  enterMs: 950,
  leaveMs: 850,
  /** Cuántas veces más rápido gira en el punto más veloz de cada animación. */
  enterSpin: 9,
  leaveSpin: 3,
};

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/** Sale con un pequeño rebote al llegar (sobrepasa y se asienta). */
const easeOutBack = (t: number) => {
  const c1 = 1.6;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Hero Earth. Esfera 3D hecha con three: icosaedro con el mapa de la
 * superficie, una capa aditiva con las luces nocturnas y la inclinación axial
 * de 23.4°. Cada cierto tiempo cambia de textura: Tierra, Luna y Marte. El canvas es transparente y cubre todo el hero; el planeta se
 * coloca a la derecha desplazando la vista de la cámara, así que solo lo
 * recortan los bordes del propio hero. Si WebGL no está disponible se muestra una Tierra dibujada.
 */
export function EarthModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { theme } = useTheme();
  const { HOME } = useMessages();
  const themeRef = useRef(theme);
  const ambientRef = useRef<THREE.AmbientLight | null>(null);

  // Ajusta la luz ambiente al cambiar de tema sin recrear la escena.
  useEffect(() => {
    themeRef.current = theme;
    if (ambientRef.current) ambientRef.current.intensity = AMBIENT_INTENSITY[theme];
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
    // Distancia a la que la esfera (radio 1) mide EARTH_SIZE de la altura
    const halfFov = THREE.MathUtils.degToRad(CAMERA_FOV / 2);
    camera.position.z = 1 / Math.sin(Math.atan(EARTH_SIZE * Math.tan(halfFov)));

    // Grupo con la inclinación axial de la Tierra
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);

    const loader = new THREE.TextureLoader();
    // Se cargan todas las texturas desde el inicio para que el cambio sea inmediato
    const planets = PLANETS.map((planet) => {
      const status = { loaded: false };
      const map = loader.load(planet.surface, () => {
        status.loaded = true;
      });
      map.colorSpace = THREE.SRGBColorSpace;
      return { ...planet, map, status };
    });
    const lightsMap = loader.load(CITY_LIGHTS_TEXTURE);
    lightsMap.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.IcosahedronGeometry(1, 12);
    // Transparente para que el cambio de cuerpo se funda con el fondo (claro u oscuro), no a negro.
    const surfaceMat = new THREE.MeshStandardMaterial({ map: planets[0]?.map ?? null, transparent: true });
    const lightsMat = new THREE.MeshBasicMaterial({
      map: lightsMap,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const earthMesh = new THREE.Mesh(geometry, surfaceMat);
    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(earthMesh, lightsMesh);

    const sunLight = new THREE.DirectionalLight(0xffffff, SUN_INTENSITY);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);
    // Luz pareja para que el lado en sombra no quede negro
    const ambient = new THREE.AmbientLight(0xffffff, AMBIENT_INTENSITY[themeRef.current]);
    ambientRef.current = ambient;
    scene.add(ambient);

    // Progreso del hover: 0 = en su lugar, 1 = encogido y más al centro.
    let hoverProgress = 0;

    // Desplaza la vista para que el centro del planeta caiga cerca del borde
    // derecho. Al mover la vista (y no el planeta) sigue viéndose redondo.
    const placeCamera = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      const centerX = w - lerp(EARTH_CENTER_FROM_RIGHT, HOVER.centerFromRight, hoverProgress) * h;
      camera.setViewOffset(w, h, w / 2 - centerX, 0, w, h);
      camera.updateProjectionMatrix();
    };

    // El canvas sigue el tamaño del contenedor
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      placeCamera();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    // Sin giro para quien pide menos movimiento
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- Hover sobre el planeta ----
    // El canvas no recibe el puntero (el texto del hero va encima), así que se
    // escucha en el hero y se comprueba si el puntero cae dentro del círculo.
    const hoverEnabled = !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const hoverArea = container.closest('.hero') ?? container.parentElement;
    let hovered = false;
    let anim: { from: number; to: number; start: number; duration: number; enter: boolean } | null = null;

    /** ¿Está el punto dentro del planeta en (centro desde la derecha, escala)? */
    const insidePlanet = (x: number, y: number, fromRight: number, scale: number) => {
      const rect = container.getBoundingClientRect();
      const h = rect.height;
      const cx = rect.right - fromRight * h;
      const cy = rect.top + h / 2;
      const r = ((EARTH_SIZE * h) / 2) * scale;
      return Math.hypot(x - cx, y - cy) <= r;
    };

    const setHovered = (next: boolean) => {
      if (next === hovered) return;
      hovered = next;
      const to = next ? 1 : 0;
      const full = next ? HOVER.enterMs : HOVER.leaveMs;
      // Si se interrumpe a medias, la animación sigue desde donde va.
      anim = { from: hoverProgress, to, start: performance.now(), duration: Math.max(200, full * Math.abs(to - hoverProgress)), enter: next };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const { clientX: x, clientY: y } = event;
      // Cuenta tanto el planeta en su lugar como el encogido: así no parpadea
      // cuando el puntero queda en el borde mientras se encoge.
      const inside =
        insidePlanet(x, y, EARTH_CENTER_FROM_RIGHT, 1) ||
        insidePlanet(x, y, lerp(EARTH_CENTER_FROM_RIGHT, HOVER.centerFromRight, hoverProgress), lerp(1, HOVER.scale, hoverProgress));
      setHovered(inside);
    };
    const onPointerLeave = () => setHovered(false);
    if (hoverEnabled && hoverArea) {
      hoverArea.addEventListener('pointermove', onPointerMove as EventListener);
      hoverArea.addEventListener('pointerleave', onPointerLeave);
    }

    /** Avanza la animación del hover; devuelve cuántas veces más rápido debe girar. */
    const updateHover = () => {
      if (!anim) return 1;
      const t = Math.min(1, (performance.now() - anim.start) / anim.duration);
      const eased = anim.enter ? easeInOutCubic(t) : easeOutBack(t);
      hoverProgress = lerp(anim.from, anim.to, eased);
      earthGroup.scale.setScalar(lerp(1, HOVER.scale, hoverProgress));
      placeCamera();
      // Acelera y vuelve a su velocidad habitual justo al terminar.
      const boost = (anim.enter ? HOVER.enterSpin : HOVER.leaveSpin) - 1;
      const spin = 1 + boost * Math.sin(Math.PI * t);
      if (t >= 1) anim = null;
      return spin;
    };

    // Cambio de cuerpo: la esfera se funde a negro, cambia de textura y vuelve
    let current = 0;
    let shownAt = performance.now();
    const updatePlanet = () => {
      const elapsed = performance.now() - shownAt;
      if (elapsed >= PLANET_DURATION_MS + FADE_MS) {
        // Siguiente cuerpo cuya textura ya cargó (si no hay otro, se queda igual)
        for (let step = 1; step <= planets.length; step += 1) {
          const next = (current + step) % planets.length;
          if (planets[next]?.status.loaded) {
            current = next;
            break;
          }
        }
        const planet = planets[current];
        if (planet) {
          surfaceMat.map = planet.map;
          lightsMesh.visible = planet.cityLights;
        }
        shownAt = performance.now();
        return;
      }
      const fadeIn = Math.min(1, elapsed / FADE_MS);
      const fadeOut = Math.min(1, (PLANET_DURATION_MS + FADE_MS - elapsed) / FADE_MS);
      const brightness = Math.min(fadeIn, fadeOut);
      surfaceMat.opacity = brightness;
      lightsMat.opacity = brightness;
    };

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      updatePlanet();
      const spin = updateHover();
      if (!reduceMotion) {
        earthMesh.rotation.y += 0.002 * spin;
        lightsMesh.rotation.y += 0.002 * spin;
        earthGroup.rotation.y += 0.002 * spin;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      hoverArea?.removeEventListener('pointermove', onPointerMove as EventListener);
      hoverArea?.removeEventListener('pointerleave', onPointerLeave);
      geometry.dispose();
      surfaceMat.dispose();
      lightsMat.dispose();
      planets.forEach((planet) => planet.map.dispose());
      lightsMap.dispose();
      renderer.dispose();
      ambientRef.current = null;
      renderer.domElement.remove();
    };
  }, []);

  return (
    <figure className="hero__earth">
      {failed ? (
        <EarthFallback />
      ) : (
        <div ref={containerRef} className="hero__earth-canvas" role="img" aria-label={HOME.earthAlt} />
      )}
    </figure>
  );
}

function EarthFallback() {
  const { HOME } = useMessages();
  return (
    <svg
      className="hero__earth-canvas"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMaxYMid meet"
      role="img"
      aria-label={HOME.earthFallbackAlt}
    >
      <circle cx="100" cy="100" r="96" fill="#1f4e8c" />
      <path d="M58 52c18-10 40-6 46 8s-10 22-6 36-14 26-28 18-26-48-12-62z" fill="#3f8f5a" />
      <path d="M124 104c14-6 30 2 32 16s-8 30-20 32-22-12-22-26 2-18 10-22z" fill="#3f8f5a" />
      <path d="M132 44c10-2 20 4 20 12s-10 12-18 10-10-20-2-22z" fill="#3f8f5a" />
    </svg>
  );
}