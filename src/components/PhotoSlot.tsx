import { useEffect, useRef, useState } from 'react';
import { gsap, MQ } from '@/lib/gsap';

type Ratio = '4/5' | '1/1' | '16/10' | '3/2';
type Status = 'loading' | 'loaded' | 'failed';

interface PhotoSlotProps {
  src: string;
  alt: string;
  ratio?: Ratio;
  radius?: number;
  className?: string;
  priority?: boolean;
  /** Parallax halus saat scroll. Aktifkan untuk foto hero dan About. */
  parallax?: boolean;
  /** Tunda reveal (detik), mis. 1.4 untuk foto hero agar menunggu IntroLoader. */
  delay?: number;
  /** false = tanpa animasi GSAP (mis. di dalam lightbox). */
  animate?: boolean;
  /** Tahan reveal sampai true (mis. menunggu IntroLoader). */
  when?: boolean;
  /** contain = gambar utuh di dalam slot (sertifikat), tanpa memotong teks. */
  fit?: 'cover' | 'contain';
}

const RATIO_CLASS: Record<Ratio, string> = {
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
  '16/10': 'aspect-[16/10]',
  '3/2': 'aspect-[3/2]',
};

const DIMENSIONS: Record<Ratio, { w: number; h: number }> = {
  '4/5': { w: 960, h: 1200 },
  '1/1': { w: 1000, h: 1000 },
  '16/10': { w: 1600, h: 1000 },
  '3/2': { w: 1500, h: 1000 },
};

/**
 * Foto asli bila file ada; jika tidak, placeholder rapi.
 * Saat masuk viewport foto "terbuka" dengan wipe clip-path, lalu (opsional)
 * bergeser pelan mengikuti scroll.
 */
export default function PhotoSlot({
  src,
  alt,
  ratio = '4/5',
  radius = 28,
  className = '',
  priority = false,
  parallax = false,
  delay = 0,
  animate = true,
  when = true,
  fit = 'cover',
}: PhotoSlotProps) {
  const [status, setStatus] = useState<Status>('loading');
  const wrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dims = DIMENSIONS[ratio];

  // Reset saat src berganti + tangani gambar yang sudah selesai dimuat (cache).
  useEffect(() => {
    setStatus('loading');
    const img = imgRef.current;
    if (img?.complete) setStatus(img.naturalWidth > 0 ? 'loaded' : 'failed');
  }, [src]);

  useEffect(() => {
    if (status !== 'loaded' || !animate || !when) return;
    const wrap = wrapRef.current;
    const mask = maskRef.current;
    const img = imgRef.current;
    if (!wrap || !mask || !img) return;

    const mm = gsap.matchMedia();
    mm.add(
      MQ.motion,
      () => {
        gsap.fromTo(
          mask,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.3,
            ease: 'expo.inOut',
            delay,
            scrollTrigger: { trigger: wrap, start: 'top 90%', once: true },
          },
        );

        if (parallax) {
          gsap.fromTo(
            img,
            { yPercent: -7, scale: 1.16 },
            {
              yPercent: 7,
              scale: 1.16,
              ease: 'none',
              scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        }
      },
      wrap,
    );
    return () => mm.revert();
  }, [status, parallax, delay, animate, when]);

  return (
    <div
      ref={wrapRef}
      className={`relative isolate overflow-hidden bg-[var(--surface)] ${RATIO_CLASS[ratio]} ${className}`}
      style={{ borderRadius: radius }}
    >
      {status !== 'failed' && (
        <div
          ref={maskRef}
          className="absolute inset-0"
          style={animate && !when ? { clipPath: 'inset(100% 0% 0% 0%)' } : undefined}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={dims.w}
            height={dims.h}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchPriority: 'high' as const } : {})}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('failed')}
            className={`h-full w-full transition-opacity duration-500 motion-reduce:transition-none ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0'
            } ${fit === 'contain' ? 'object-contain p-4' : 'object-cover'}`}
          />
        </div>
      )}

      {status === 'failed' && (
        <div
          role="img"
          aria-label={`${alt} (foto belum ditambahkan)`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent 0 14px, color-mix(in srgb, var(--line) 55%, transparent) 14px 15px)',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[color:var(--ink-soft)]"
            aria-hidden="true"
          >
            <path d="M3 8a2 2 0 0 1 2-2h2l1.2-1.6A1 1 0 0 1 9 4h6a1 1 0 0 1 .8.4L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          <p className="text-sm font-medium text-[color:var(--ink)]">Foto segera hadir</p>
          {import.meta.env.DEV && (
            <p className="max-w-[90%] text-xs leading-snug break-all text-[color:var(--ink-soft)]">
              Taruh file di <span className="font-semibold">public/{src.replace(/^\//, '')}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}