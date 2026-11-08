import { useEffect, useRef } from 'react';
import { gsap, MQ } from '@/lib/gsap';
import SectionHead from '@/components/SectionHead';
import { content } from '@/data/content';

interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  period?: string;
  gpa?: string;
  summary?: string;
  points?: readonly string[];
  stack?: readonly string[];
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = content;

  const eduEntry: TimelineEntry = {
    id: 'education',
    title: t.education.degree,
    subtitle: t.education.institution,
    period: t.education.year,
    gpa: t.education.gpa,
    points: t.education.points,
  };

  const expEntries: TimelineEntry[] = t.experience.map((exp) => ({
    id: exp.id,
    title: exp.role,
    subtitle: exp.company,
    period: exp.period,
    summary: exp.summary,
    points: exp.points,
    stack: exp.stack,
  }));

  const orgEntries: TimelineEntry[] = t.organizations.map((org) => ({
    id: org.id,
    title: org.title,
    subtitle: '',
    period: org.period,
    points: org.points,
  }));

  const groups = [
    { label: 'Pendidikan', items: [eduEntry] },
    ...(expEntries.length > 0 ? [{ label: 'Pengalaman Kerja', items: expEntries }] : []),
    ...(orgEntries.length > 0 ? [{ label: 'Kegiatan & Organisasi', items: orgEntries }] : []),
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(
      MQ.motion,
      () => {
        el.querySelectorAll<HTMLElement>('[data-group]').forEach((group) => {
          const spine = group.querySelector<HTMLElement>('[data-spine]');
          if (spine) {
            gsap.fromTo(
              spine,
              { scaleY: 0, transformOrigin: 'top' },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: group,
                  start: 'top 75%',
                  // ponytail: 80px mengikuti gap space-y-24 (96px) — spine grup sebelumnya penuh sebelum grup berikutnya masuk viewport
                  end: 'bottom bottom-=80px',
                  scrub: 0.5,
                },
              },
            );
          }
        });

        gsap.from('[data-card]', {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-entries]', start: 'top 75%', once: true },
        });
      },
      el,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-y relative bg-[var(--bg)] text-[var(--ink)]"
    >
      <div className="container-x">
        <SectionHead
          title="Pengalaman & pendidikan"
        />

        <div data-entries className="space-y-16 lg:space-y-24">
          {groups.map((group) => (
            <div
              key={group.label}
              data-group
              className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:gap-16"
            >
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
                  {group.label}
                </h3>
              </div>

              <div className="relative pl-6 lg:pl-10">
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 left-0 w-px bg-[var(--line)]"
                />
                <div
                  aria-hidden="true"
                  data-spine
                  className="absolute top-0 bottom-0 left-0 z-10 w-px origin-top bg-[var(--accent)]"
                />

                <div className="space-y-10 lg:space-y-14">
                  {group.items.map((entry) => (
                    <article key={entry.id} data-card className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute top-2 -left-6 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--accent)] lg:-left-10"
                      />

                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h4 className="font-display text-xl font-bold tracking-tight text-[var(--ink)] lg:text-2xl">
                          {entry.title}
                        </h4>
                        {entry.period && (
                          <span className="text-xs tracking-[0.12em] uppercase tabular-nums text-[var(--ink-soft)]">
                            {entry.period}
                          </span>
                        )}
                      </div>

                      {entry.subtitle && (
                        <p className="mt-0.5 text-base font-medium text-[var(--ink-soft)]">
                          {entry.subtitle}
                        </p>
                      )}

                      {entry.gpa && (
                        <p className="mt-2 inline-block text-sm text-[var(--ink-soft)]">
                          IPK <span className="font-semibold text-[var(--ink)]">{entry.gpa}</span>
                        </p>
                      )}

                      {entry.summary && (
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
                          {entry.summary}
                        </p>
                      )}

                      {entry.points && entry.points.length > 0 && (
                        <ul className="mt-3.5 max-w-2xl space-y-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                          {entry.points.map((p, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span
                                aria-hidden="true"
                                className="mt-2 h-1 w-1 shrink-0 bg-[var(--accent)]"
                              />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {entry.stack && entry.stack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--ink-soft)]">
                          {entry.stack.map((s, idx) => (
                            <span key={s}>
                              {s}
                              {idx < entry.stack!.length - 1 && <span className="ml-2 text-[var(--line)]">/</span>}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
