import SectionHead from '@/components/SectionHead';
import Reveal from '@/components/Reveal';
import { content } from '@/data/content';
import LOGO_MAP from '@/data/logos';

const TECH_KEYS = ['frontend', 'backend', 'database', 'tools'] as const;

const GROUP_ROW =
  'grid gap-x-10 gap-y-5 md:grid-cols-[160px_minmax(0,1fr)]';
const GROUP_LABEL =
  'font-display text-sm font-semibold text-[var(--ink)] md:pt-0.5';

const OPENCODE_LOGO = LOGO_MAP.OpenCode;

export default function SkillsSection() {
  const { skills, aiWorkflow } = content;

  return (
    <section id="skills" className="section-y border-b border-[var(--line)]">
      <div className="container-x">
        <SectionHead title="Keahlian & Perangkat" />

        {/* Hard skill */}
        <Reveal stagger={0.045} y={14}>
          <div className={GROUP_ROW}>
            <h3 data-reveal className={GROUP_LABEL}>Hard skill</h3>
            <div className="grid grid-cols-2 gap-x-5 gap-y-6 lg:grid-cols-4">
              {TECH_KEYS.map((key) => (
                <div key={key} className="min-w-0">
                  <h4 data-reveal className="text-sm font-semibold text-[var(--ink-soft)]">
                    {skills[key].label}
                  </h4>
                  <ul className="mt-3 flex flex-col gap-3">
                    {skills[key].items.map((tool) => (
                      <li key={tool.name} data-reveal className="min-w-0">
                        <details className="group/skill">
                          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-[var(--ink)] transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] motion-reduce:transition-none">
                            {LOGO_MAP[tool.name] && (
                              <img
                                src={LOGO_MAP[tool.name]}
                                alt=""
                                loading="lazy"
                                className="h-6 w-auto max-w-8 object-contain"
                              />
                            )}
                            <span className="min-w-0">{tool.name}</span>
                            <span
                              aria-hidden="true"
                              className="ml-auto text-xs text-[var(--ink-soft)] transition-transform group-open/skill:rotate-45 motion-reduce:transition-none"
                            >
                              +
                            </span>
                          </summary>
                          <p className="ml-8 mt-2 max-w-[32ch] text-xs leading-relaxed text-[var(--ink-soft)]">
                            {tool.context}
                          </p>
                        </details>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Soft skill */}
        <Reveal stagger={0.06} y={12}>
          <div className={`mt-12 ${GROUP_ROW}`}>
            <h3 data-reveal className={GROUP_LABEL}>Soft skill</h3>
            <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
              {skills.soft.items.map((item) => (
                <li key={item.name} data-reveal className="text-base font-semibold text-[var(--ink)]">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* AI */}
        <Reveal stagger={0.07} y={16}>
          <div className={`mt-12 ${GROUP_ROW}`}>
            <div className="flex items-center gap-4 md:block">
              <div
                data-reveal
                className="flex h-16 w-40 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-white p-3"
              >
                <img
                  src={OPENCODE_LOGO}
                  alt="OpenCode"
                  loading="lazy"
                  className="h-auto w-full max-w-36 object-contain brightness-0"
                />
              </div>
              <div className="md:mt-4">
                <h3 data-reveal className={GROUP_LABEL}>AI workflow</h3>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">AI coding assistant</p>
              </div>
            </div>

            <div>
              <p data-reveal className="max-w-[65ch] text-base leading-relaxed text-[var(--ink)] [text-wrap:pretty]">
                {aiWorkflow.lead}
              </p>
              <ol className="mt-6 grid gap-y-5 md:grid-cols-3 md:gap-x-8">
                {aiWorkflow.points.map((pt, index) => (
                  <li key={pt.title} data-reveal className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3">
                    <span aria-hidden="true" className="pt-0.5 text-lg font-semibold tabular-nums text-[var(--accent)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--ink)]">{pt.title}</h4>
                      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-[var(--ink-soft)] [text-wrap:pretty]">
                        {pt.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
