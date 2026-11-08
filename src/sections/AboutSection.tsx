import PhotoSlot from '@/components/PhotoSlot';
import RevealText from '@/components/RevealText';
import { asset } from '@/lib/asset';
import { content } from '@/data/content';

export default function AboutSection() {
  const t = content;

  return (
    <section id="about" className="section-y">
      <div className="container-x grid grid-cols-1 items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div className="relative z-10 mx-auto w-full max-w-[14rem] md:mx-0 md:max-w-xs">
          <PhotoSlot
            src={asset('images/Kristian_Dimas.jpeg')}
            alt={`Foto ${t.fullName}`}
            ratio="4/5"
            radius={4}
            className="w-full"
          />
        </div>

        <div>
          <RevealText
            as="p"
            className="max-w-2xl text-justify font-display text-[clamp(1rem,1.7vw,1.5rem)] leading-[1.6] font-semibold tracking-[-0.01em] text-[var(--ink)]"
          >
            {t.about}
          </RevealText>

          <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-[var(--line)] pt-6 sm:mt-12 sm:grid-cols-3">
            {[
              ['Domisili', t.location],
              ['Status', t.availability],
              ['Pendidikan', `${t.education.degree} · ${t.education.gpa}`],
            ].map(([term, desc]) => (
              <div key={term}>
                <dt className="text-xs tracking-[0.14em] uppercase text-[var(--ink-soft)]">{term}</dt>
                <dd className="mt-1 text-sm text-[var(--ink)]">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
