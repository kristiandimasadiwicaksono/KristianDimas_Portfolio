import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, MQ } from '@/lib/gsap';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Jeda antar anak (detik) */
  stagger?: number;
  y?: number;
}

/**
 * Anak-anaknya masuk berurutan saat wrapper terlihat.
 * Tandai elemen tertentu dengan `data-reveal`; bila tidak ada, semua anak langsung dipakai.
 */
export default function Reveal({ children, className = '', stagger = 0.09, y = 32 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(
      MQ.motion,
      () => {
        const marked = el.querySelectorAll('[data-reveal]');
        const targets = marked.length ? marked : el.children;
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
      el,
    );
    return () => mm.revert();
  }, [stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}