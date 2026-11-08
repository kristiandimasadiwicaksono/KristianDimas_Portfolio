import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, MQ } from '@/lib/gsap';
import PhotoSlot from '@/components/PhotoSlot';
import SectionHead from '@/components/SectionHead';
import { asset } from '@/lib/asset';
import { content, type Certificate } from '@/data/content';

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]';

interface LightboxProps {
  cert: Certificate;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function CertificateLightbox({ cert, index, total, onClose, onPrev, onNext }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const prevSlug = useRef(cert.slug);
  const closingRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  // Tutup dengan animasi keluar; langsung tutup bila user prefers-reduced-motion.
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    closingRef.current = true;
    gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.28, ease: 'power2.in' });
    gsap.to(panelRef.current, {
      y: 24,
      scale: 0.97,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: onClose,
    });
  }, [onClose]);

  // Buka: fade latar + panel naik. Tutup: fokus dikembalikan ke kartu pembuka.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from(overlayRef.current, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' });
      gsap.from(panelRef.current, { y: 50, scale: 0.95, duration: 0.8, ease: 'expo.out' });
    });

    return () => {
      document.body.style.overflow = '';
      mm.revert();
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  // Ganti sertifikat: isi panel masuk halus
  useEffect(() => {
    if (prevSlug.current === cert.slug) return;
    prevSlug.current = cert.slug;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      bodyRef.current,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' },
    );
  }, [cert.slug]);

  // Keyboard: Esc tutup, panah navigasi, Tab terjebak di dalam dialog (focus trap)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        requestClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        onPrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        onNext();
        return;
      }
      if (e.key === 'Tab') {
        const root = panelRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !root.contains(active)) {
            e.preventDefault();
            last.focus({ preventScroll: true });
          }
        } else if (active === last || !root.contains(active)) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [requestClose, onPrev, onNext]);

  // Swipe kiri/kanan di gambar untuk pindah sertifikat (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  const ghostPill = `inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 motion-reduce:transition-none ${FOCUS}`;

  const navBtn = `inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 motion-reduce:transition-none ${FOCUS}`;

  return (
    <div
      ref={overlayRef}
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-lightbox-title"
    >
      <div
        ref={panelRef}
        className="relative my-auto w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={bodyRef}>
          <div ref={imageRef} className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <button
              ref={closeRef}
              type="button"
              onClick={requestClose}
              aria-label="Tutup"
              className={`absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/80 motion-reduce:transition-none ${FOCUS}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <PhotoSlot
              src={asset(cert.image)}
              alt={cert.title}
              ratio="3/2"
              radius={16}
              priority
              animate={false}
              fit="contain"
              className="w-full shadow-2xl"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
            <div className="min-w-0">
              <h3 id="cert-lightbox-title" className="font-display text-xl font-extrabold tracking-tight text-white">
                {cert.title}
              </h3>
              <p className="mt-1 text-sm text-white/70">
                {cert.issuer}
                {cert.year ? ` · ${cert.year}` : ''}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className={ghostPill}>
                  Verifikasi
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </a>
              )}
              {cert.pdf && (
                <a href={asset(cert.pdf)} target="_blank" rel="noopener noreferrer" className={ghostPill}>
                  Lihat PDF
                </a>
              )}
            </div>
          </div>
        </div>

        {total > 1 && (
          <div className="mt-7 flex items-center justify-between gap-3">
            <button type="button" onClick={onPrev} aria-label="Sertifikat sebelumnya" className={navBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Sebelumnya
            </button>

            <p className="text-sm font-semibold tabular-nums text-white/60" aria-hidden="true">
              {index + 1} / {total}
            </p>

            <button type="button" onClick={onNext} aria-label="Sertifikat berikutnya" className={navBtn}>
              Berikutnya
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Pengumuman untuk pembaca layar saat navigasi antar sertifikat */}
        <p aria-live="polite" className="sr-only">
          {`Sertifikat ${index + 1} dari ${total}: ${cert.title}`}
        </p>
      </div>
    </div>
  );
}

export default function CertificatesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const certs = content.certificates;
  const count = certs.length;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevCert = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + count) % count)),
    [count],
  );
  const nextCert = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % count)),
    [count],
  );

  // Kartu masuk per baris (batch), bukan satu-satu
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || count === 0) return;
    const mm = gsap.matchMedia();

    mm.add(
      MQ.motion,
      () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-cert-card]', el);
        gsap.set(cards, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.12,
              overwrite: true,
            }),
        });
      },
      el,
    );

    return () => mm.revert();
  }, [count]);

  return (
    <section id="certificates" ref={sectionRef} className="section-y">
      <div className="container-x">
        <SectionHead title="Sertifikat" />

        {count === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--line)] p-10 text-center text-sm text-[var(--ink-soft)]">
            Belum ada sertifikat untuk ditampilkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {certs.map((cert, i) => (
              <button
                key={cert.slug}
                data-cert-card
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-haspopup="dialog"
                aria-label={`Buka sertifikat ${cert.title}`}
                className={`group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-left transition-[border-color,box-shadow,background-color] duration-300 hover:border-[color:var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_5%,var(--surface))] hover:shadow-lg motion-reduce:transition-none ${FOCUS}`}
              >
                <div className="relative overflow-hidden">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none">
                    <PhotoSlot
                      src={asset(cert.image)}
                      alt={cert.title}
                      ratio="3/2"
                      radius={0}
                      animate={false}
                      fit="contain"
                      className="w-full"
                    />
                  </div>

                  {/* Hint visual: ikon + muncul saat hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                  >
                    <span className="grid h-11 w-11 scale-75 place-items-center rounded-full bg-white/95 text-[color:var(--ink)] shadow-lg transition-transform duration-300 group-hover:scale-100 motion-reduce:transition-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </span>
                </div>

                <div className="p-5">
                  {cert.category && (
                    <p className="mb-2 inline-flex rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--accent)]">
                      {cert.category}
                    </p>
                  )}
                  <h3 className="font-display text-lg font-extrabold tracking-tight text-[var(--ink)] transition-colors group-hover:text-[color:var(--accent)]">
                    {cert.title}
                  </h3>
                  <div className="mt-1.5 flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm text-[var(--ink-soft)]">{cert.issuer}</p>
                    {cert.year && (
                      <p className="shrink-0 text-xs font-semibold tabular-nums text-[var(--ink-soft)]">
                        {cert.year}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <CertificateLightbox
          cert={certs[lightboxIndex]}
          index={lightboxIndex}
          total={count}
          onClose={closeLightbox}
          onPrev={prevCert}
          onNext={nextCert}
        />
      )}
    </section>
  );
}