import { useLayoutEffect, useRef } from 'react';
import { gsap, SplitText } from '@/lib/gsap';

interface IntroLoaderProps {
  /** Dipanggil saat tirai mulai naik: jalankan animasi masuk Hero di sini. */
  onReveal?: () => void;
  /** Dipanggil setelah semua selesai: aman untuk melepas komponen ini. */
  onComplete: () => void;
}

const SEEN_KEY = 'intro-seen';

export default function IntroLoader({ onReveal, onComplete }: IntroLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cb = useRef({ onReveal, onComplete });
  cb.current = { onReveal, onComplete };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      /* storage diblokir: abaikan */
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Kunjungan ulang di sesi yang sama atau reduced-motion: langsung lewati.
    if (seen || reduce) {
      cb.current.onReveal?.();
      cb.current.onComplete();
      return;
    }

    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const split = SplitText.create('[data-intro-word]', { type: 'chars', mask: 'chars' });
      const num = root.querySelector<HTMLElement>('[data-intro-num]');
      const counter = { v: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          try {
            sessionStorage.setItem(SEEN_KEY, '1');
          } catch {
            /* abaikan */
          }
          cb.current.onComplete();
        },
      });

      tl.from(split.chars, { yPercent: 115, duration: 1, ease: 'expo.out', stagger: 0.07 }, 0.1)
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (num) num.textContent = String(Math.round(counter.v)).padStart(3, '0');
            },
          },
          0,
        )
        .to('[data-intro-bar]', { scaleX: 1, duration: 1.9, ease: 'power2.inOut' }, 0)
        // keluar: huruf naik ke atas, penghitung memudar
        .to(split.chars, { yPercent: -115, duration: 0.7, ease: 'power3.in', stagger: 0.04 }, '+=0.2')
        .to('[data-intro-meta]', { autoAlpha: 0, duration: 0.4 }, '<')
        // tirai terangkat, Hero mulai masuk di waktu yang sama
        .add(() => cb.current.onReveal?.(), '>-0.15')
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '<');
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Memuat portfolio"
      className="fixed inset-0 z-[100] flex h-[100dvh] flex-col justify-between bg-[var(--accent)] px-[clamp(1rem,4vw,3rem)] pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[color:var(--accent-ink)]"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <p data-intro-meta className="text-sm font-medium opacity-80">
        Portfolio
      </p>

      <p
        data-intro-word
        aria-hidden="true"
        className="font-display text-[clamp(5rem,26vw,18rem)] leading-[1.1] font-extrabold tracking-[-0.05em] select-none"
      >
        KDAW
      </p>

      <div data-intro-meta className="flex items-end gap-6">
        <span data-intro-num className="font-display text-5xl leading-none font-extrabold tabular-nums">
          000
        </span>
        <div className="mb-2 h-px flex-1 bg-current/25">
          <div data-intro-bar className="h-full origin-left scale-x-0 bg-current" />
        </div>
      </div>
    </div>
  );
}