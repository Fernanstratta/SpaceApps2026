import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getMissionSite, type MissionSiteId } from '../../data/missions/roverMission';
import { getSiteTerrain } from '../mission/missionTerrain';

/** Altura exagerada para que el relieve se aprecie (se indica en el texto de ayuda). */
const EXAGGERATION = 2;
const ROTATE_STEP = Math.PI / 8;

/**
 * Modelo 3D del relieve a partir del DEM real del sitio (malla de 41 × 41
 * puntos cada 75 m, la misma que usa la Misión 01). Se gira arrastrando
 * (OrbitControls) o con los botones; con «reducir movimiento» no gira solo.
 */
export default function Terrain3D({
  siteId,
  label,
  hint,
  rotateLeftLabel,
  rotateRightLabel,
  errorText,
}: {
  siteId: MissionSiteId;
  label: string;
  hint: string;
  rotateLeftLabel: string;
  rotateRightLabel: string;
  errorText: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
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
    host.appendChild(renderer.domElement);

    // Malla del terreno: 1 unidad = 1 celda (75 m); altura en las mismas unidades.
    const site = getMissionSite(siteId);
    const { size, step, elevations } = site.grid;
    const { shade } = getSiteTerrain(siteId);
    const min = Math.min(...elevations);
    const geometry = new THREE.PlaneGeometry(size - 1, size - 1, size - 1, size - 1);
    geometry.rotateX(-Math.PI / 2);
    const position = geometry.getAttribute('position');
    const colors = new Float32Array(position.count * 3);
    const tint = site.body === 'earth' ? [0.86, 0.74, 0.58] : [0.78, 0.78, 0.8];
    for (let i = 0; i < position.count; i += 1) {
      // PlaneGeometry recorre filas de norte a sur y columnas de oeste a este, igual que el DEM.
      const height = (((elevations[i] ?? min) - min) / step) * EXAGGERATION;
      position.setY(i, height);
      const light = 0.45 + 0.55 * (shade[i] ?? 0.5);
      colors[i * 3] = (tint[0] ?? 0.8) * light;
      colors[i * 3 + 1] = (tint[1] ?? 0.8) * light;
      colors[i * 3 + 2] = (tint[2] ?? 0.8) * light;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
    const mesh = new THREE.Mesh(geometry, material);
    const group = new THREE.Group();
    group.add(mesh);
    groupRef.current = group;

    const scene = new THREE.Scene();
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(-30, 40, -20);
    scene.add(sun);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);
    camera.position.set(0, 34, 48);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 30;
    controls.maxDistance = 110;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.target.set(0, 4, 0);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.6;
    // Al tocar el modelo deja de girar solo.
    const stopAuto = () => {
      controls.autoRotate = false;
    };
    renderer.domElement.addEventListener('pointerdown', stopAuto);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('pointerdown', stopAuto);
      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      groupRef.current = null;
    };
  }, [siteId]);

  const rotate = (direction: 1 | -1) => {
    const group = groupRef.current;
    if (group) group.rotation.y += direction * ROTATE_STEP;
  };

  if (failed) {
    return (
      <p className="pg-state" role="status">
        {errorText}
      </p>
    );
  }

  return (
    <div className="pg-3d">
      <div ref={hostRef} className="pg-3d__canvas" role="img" aria-label={label} />
      <div className="pg-3d__bar">
        <p className="pg-3d__hint">{hint}</p>
        <div className="pg-3d__buttons">
          <button type="button" className="pg-icon-button" onClick={() => rotate(-1)} aria-label={rotateLeftLabel}>
            <span aria-hidden="true">↺</span>
          </button>
          <button type="button" className="pg-icon-button" onClick={() => rotate(1)} aria-label={rotateRightLabel}>
            <span aria-hidden="true">↻</span>
          </button>
        </div>
      </div>
    </div>
  );
}
