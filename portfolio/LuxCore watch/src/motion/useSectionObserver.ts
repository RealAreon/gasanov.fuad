import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const LIGHT_THEME_SECTIONS = new Set(['clients', 'journal']);

/**
 * Watches every [data-section] element and keeps the store's activeSection
 * and theme in sync with whichever section currently dominates the viewport.
 */
export const useSectionObserver = (scope?: string): void => {
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    if (sections.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.section;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId) {
          setActiveSection(bestId);
          setTheme(LIGHT_THEME_SECTIONS.has(bestId) ? 'light' : 'dark');
        }
      },
      { threshold: [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1] },
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, [setActiveSection, setTheme, scope]);
};
