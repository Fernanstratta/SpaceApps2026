import { useEffect } from 'react';
import { AboutSection } from '../components/home/AboutSection';
import { HeroSection } from '../components/home/HeroSection';
import { PortalPreviewSection } from '../components/home/PortalPreviewSection';
import { ResourcesSection } from '../components/home/ResourcesSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { readHashId, scrollToSection } from '../utils/scroll';

/**
 * Single-page Inicio: hero, "¿Qué es Starman?", Sobre Nosotros and Recursos,
 * stacked vertically. The header navigation scrolls between sections.
 */
export function HomePage() {
  useDocumentTitle(null);

  // Arriving with a hash (e.g. /#recursos from the portal or an old link):
  // jump to that section once it has rendered.
  useEffect(() => {
    const id = readHashId();
    if (!id) return undefined;
    const frame = window.requestAnimationFrame(() => {
      scrollToSection(id, { smooth: false });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <HeroSection />
      <PortalPreviewSection />
      <AboutSection />
      <ResourcesSection />
    </>
  );
}
