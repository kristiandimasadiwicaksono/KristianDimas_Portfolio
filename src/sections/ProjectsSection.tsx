import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { gsap, ScrollTrigger, MQ } from '@/lib/gsap';
import RevealText from '@/components/RevealText';
import { asset } from '@/lib/asset';
import { content, type Project } from '@/data/content';

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]';

/* ------------------------------ Modal ------------------------------ */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from('[data-modal-bg]', { autoAlpha: 0, duration: 0.35, ease: 'power2.out' });
      gsap.from(panelRef.current, { y: 48, scale: 0.96, autoAlpha: 0, duration: 0.8, ease: 'expo.out' });
    }, overlayRef.current ?? undefined);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      mm.revert();
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      data-lenis-prevent
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${project.title}`}
      onClick={onClose}
    >
      <div data-modal-bg className="absolute inset-0 bg-black/60" />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-3xl border border-[color:var(--line)] bg-[var(--surface)] p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className={`z-30 absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-sm border border-[color:var(--line)] bg-[var(--surface)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] ${FOCUS}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!project.confidential && project.image && (
          <div className="mb-4 max-h-[44svh] overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color-mix(in_srgb,var(--line)_40%,transparent)] flex items-center justify-center">
            <ProjectImage src={project.image} alt={project.title} fit={project.imageFit} />
          </div>
        )}

        <h3 className="mb-2 pr-12 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)]">
          {project.title}
        </h3>
        <p className="mb-4 text-sm text-[var(--ink-soft)]">
          {project.role}
          {project.year ? ` · ${project.year}` : ''}
        </p>
        <p className="mb-6 text-base leading-relaxed text-[var(--ink-soft)]">{project.summary}</p>

        {project.stack.length > 0 && (
          <p className="mb-6 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--ink-soft)]">
            {project.stack.map((s, idx) => (
              <span key={s}>
                {s}
                {idx < project.stack.length - 1 && <span className="ml-2 text-[var(--line)]">/</span>}
              </span>
            ))}
          </p>
        )}

        <div className="flex flex-wrap gap-5">
          {project.links?.repo && (
            <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className={`rounded-sm text-sm font-semibold text-[color:var(--accent)] hover:underline ${FOCUS}`}>
              GitHub
            </a>
          )}
          {project.links?.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={`rounded-sm text-sm font-semibold text-[color:var(--accent)] hover:underline ${FOCUS}`}>
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Kartu ------------------------------ */

function ProjectImage({ src, alt, fit = 'cover' }: { src?: string; alt: string; fit?: 'cover' | 'contain' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--line)_40%,transparent)] p-4 text-center text-sm text-[var(--ink-soft)]">
        Gambar belum tersedia
      </div>
    );
  }
  return (
    <img
      src={asset(src)}
      alt={alt}
      width={1600}
      height={1000}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none ${
        fit === 'contain' ? 'bg-white object-contain' : 'object-cover group-hover:scale-105'
      }`}
    />
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  if (project.confidential) {
    return (
      <div
        onClick={onClick}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Detail ${project.title}`}
        className={`group flex h-full min-h-[320px] cursor-pointer flex-col rounded-2xl bg-[var(--surface)] p-5 transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--accent)_5%,var(--surface))] md:min-h-[min(420px,58svh)] md:flex-row md:gap-10 md:p-10 ${FOCUS}`}
      >
        <div
          aria-hidden="true"
          className="mb-5 h-20 w-full shrink-0 rounded-lg bg-[color-mix(in_srgb,var(--line)_55%,transparent)] opacity-60 md:mb-0 md:h-auto md:w-[38%]"
        />
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[color:var(--accent)]">Confidential</p>
            <h3 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] md:text-3xl">
              {project.title}
            </h3>
            <p className="mb-4 text-sm text-[var(--ink-soft)]">
              {project.role}
              {project.year ? ` · ${project.year}` : ''}
            </p>
            <p className="max-w-lg text-base leading-relaxed text-[var(--ink-soft)]">{project.summary}</p>
          </div>
          <p className="mt-6 text-xs text-[var(--ink-soft)] opacity-70">
            Dokumentasi visual tidak ditampilkan sesuai ketentuan perusahaan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Detail ${project.title}`}
      className={`group h-full cursor-pointer overflow-hidden rounded-2xl bg-[var(--surface)] transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--accent)_5%,var(--surface))] md:grid md:grid-cols-[1.15fr_0.85fr] ${FOCUS}`}
    >
      <div className="aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[min(420px,58svh)]">
          <ProjectImage src={project.image} alt={project.title} fit={project.imageFit} />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <h3 className="mb-1 font-display text-xl font-extrabold tracking-tight text-[var(--ink)] md:text-3xl">
          {project.title}
        </h3>
        <p className="mb-3 text-sm text-[var(--ink-soft)]">
          {project.role}
          {project.year ? ` · ${project.year}` : ''}
        </p>
        <p className="mb-4 text-base leading-relaxed text-[var(--ink-soft)]">{project.summary}</p>
        {project.stack.length > 0 && (
          <p className="mb-4 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--ink-soft)]">
            {project.stack.map((s, idx) => (
              <span key={s}>
                {s}
                {idx < project.stack.length - 1 && <span className="ml-2 text-[var(--line)]">/</span>}
              </span>
            ))}
          </p>
        )}
        {(project.links?.repo || project.links?.demo) && (
          <div className="flex gap-5">
            {project.links?.repo && (
              <a href={project.links.repo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`rounded-sm text-sm font-semibold text-[color:var(--accent)] hover:underline ${FOCUS}`}>
                GitHub
              </a>
            )}
            {project.links?.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`rounded-sm text-sm font-semibold text-[color:var(--accent)] hover:underline ${FOCUS}`}>
                Demo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Section ------------------------------ */

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const total = content.projects.length;
  const closeModal = useCallback(() => setModalProject(null), []);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;
    const mm = gsap.matchMedia();

    // Desktop & tablet: pin + geser horizontal
    mm.add(
      '(min-width: 768px)',
      () => {
        if (total < 2) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const slides = gsap.utils.toArray<HTMLElement>('[data-project-slide]', section);
        const indexEl = section.querySelector('[data-project-index]');
        const fill = section.querySelector<HTMLElement>('[data-project-progress]');
        const count = slides.length;
        const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin,
            scrub: reduce ? true : 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const pos = self.progress * (count - 1);
              if (indexEl) indexEl.textContent = String(Math.round(pos) + 1).padStart(2, '0');
              if (fill) gsap.set(fill, { scaleX: self.progress });
              if (!reduce) {
                slides.forEach((slide, i) => {
                  gsap.set(slide, { scale: gsap.utils.clamp(0.92, 1, 1 - Math.abs(pos - i) * 0.08) });
                });
              }
            },
          },
        });
      },
      section,
    );

    // HP: kartu bertumpuk, masuk per baris
    mm.add(
      '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      () => {
        const slides = gsap.utils.toArray<HTMLElement>('[data-project-slide]', section);
        gsap.set(slides, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(slides, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.12, overwrite: true }),
        });
      },
      section,
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, [total]);

  return (
    <section id="projects" ref={sectionRef} className="md:pb-26">
      <div
        ref={pinRef}
        className="py-14 md:flex md:h-[100svh] md:flex-col md:overflow-hidden md:bg-[var(--bg)] md:py-0"
      >
        <div className="container-x mb-10 flex items-end justify-between gap-6 md:mb-0 md:shrink-0 md:pt-24">
          <div>
            <RevealText as="h2" className="h-section text-[var(--ink)]">
              Project
            </RevealText>
            <p className="mt-2 hidden text-sm text-[var(--ink-soft)] tabular-nums md:block">
              <span data-project-index>01</span>
              <span className="opacity-50"> / {String(total).padStart(2, '0')}</span>
            </p>
          </div>
          <p className="mb-2 hidden text-sm text-[var(--ink-soft)] md:block">Gulir untuk menggeser</p>
        </div>

        <div className="md:flex md:min-h-0 md:flex-1 md:items-center">
          <div
            ref={trackRef}
            className="mx-auto max-w-[1320px] space-y-6 px-[clamp(1rem,4vw,3rem)] will-change-transform md:mx-0 md:flex md:w-max md:max-w-none md:items-stretch md:gap-8 md:space-y-0"
          >
            {content.projects.map((project) => (
              <div
                key={project.slug}
                data-project-slide
                className="md:w-[min(78vw,1040px)] md:shrink-0 md:origin-center"
              >
                <ProjectCard project={project} onClick={() => setModalProject(project)} />
              </div>
            ))}
          </div>
        </div>

        <div className="container-x hidden shrink-0 pb-8 md:block">
          <div className="h-px w-full bg-[var(--line)]">
            <div data-project-progress className="h-px w-full origin-left scale-x-0 bg-[var(--accent)]" />
          </div>
        </div>
      </div>

      {modalProject && <ProjectModal project={modalProject} onClose={closeModal} />}
    </section>
  );
}