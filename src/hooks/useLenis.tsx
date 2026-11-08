import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useLenis() {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lenis: any;
    (async () => {
      const lenisModule = await import('lenis');
      lenis = new lenisModule.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      lenisRef.current = lenis;
    })();

    return () => {
      if (lenis) {
        lenis.destroy?.();
        gsap.ticker.remove(lenis.raf);
      }
      ScrollTrigger.getAll()?.forEach(st => st.kill());
    };
  }, []);

  return lenisRef;
}
