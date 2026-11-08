import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText, MQ } from '@/lib/gsap';

interface RevealTextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Tunda (detik). Untuk Hero: set sesuai waktu IntroLoader selesai. */
  delay?: number;
  /** Jika diisi, animasi baru jalan saat nilainya true (mis. `ready` dari IntroLoader). */
  when?: boolean;
}

/**
 * Judul terbelah per baris; tiap baris naik dari balik "topeng".
 * Re-split otomatis saat lebar layar berubah (HP diputar, resize),
 * dan menunggu font siap supaya pemotongan baris akurat.
 */
export default function RevealText({
  as: Tag = 'h2',
  children,
  className = '',
  delay = 0,
  when = true,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !when) return;
    let cancelled = false;
    const mm = gsap.matchMedia();

    document.fonts.ready.then(() => {
      if (cancelled) return;
      mm.add(
        MQ.motion,
        () => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) => {
              // Beri ruang untuk huruf berekor (g, y, j) di dalam topeng.
              self.lines.forEach((line: Element) => {
                const mask = line.parentElement;
                if (mask && mask !== el) {
                  mask.style.paddingBottom = '0.14em';
                  mask.style.marginBottom = '-0.14em';
                }
              });
              return gsap.from(self.lines, {
                yPercent: 115,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.09,
                delay,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              });
            },
          });
        },
        el,
      );
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [delay, when]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}