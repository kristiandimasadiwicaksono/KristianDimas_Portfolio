import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type MutableRefObject } from 'react';
import { gsap, ScrollTrigger, MQ } from '@/lib/gsap';
import PhotoSlot from '@/components/PhotoSlot';
import { asset } from '@/lib/asset';
import { content } from '@/data/content';

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]';

interface HeroSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lenisRef: MutableRefObject<any>;
  /** true saat tirai IntroLoader mulai naik */
  ready: boolean;
}

/** Nama raksasa dua baris: tinta di belakang foto, putih di dalam foto (dipotong bingkai). */
function NameBlock({ lines, tone }: { lines: string[][]; tone: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 left-1/2 flex h-full w-screen -translate-x-1/2 -translate-y-1/2 flex-col justify-between px-[clamp(1rem,4vw,3rem)] font-funnel text-[clamp(1.3rem,8vw,7rem)] leading-[0.85] font-black tracking-[-0.05em] uppercase select-none ${tone}`}
    >
      {lines.map((line, li) => (
        <span key={li} data-line={li + 1} className={`flex gap-[0.22em] ${li ? 'self-end' : 'self-start'}`}>
          {line.map((word, i) => (
            <span key={`${word}-${i}`} className="-mx-[0.08em] -mb-[0.08em] block overflow-hidden px-[0.08em] pb-[0.08em]">
              <span data-hero-word className="block">{word}</span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

const META = 'text-[0.7rem] tracking-[0.18em] text-[var(--ink-soft)] uppercase';

const linkCls = `group relative inline-flex items-baseline gap-2 border-b border-[color:var(--ink)] pb-1 text-sm font-semibold text-[color:var(--ink)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] motion-reduce:transition-none max-sm:after:absolute max-sm:after:-inset-x-2 max-sm:after:-inset-y-3 max-sm:after:content-[''] md:text-lg ${FOCUS}`;

function useWibClock() {
  const fmt = () =>
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':');
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function HeroSection({ lenisRef, ready }: HeroSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const time = useWibClock();
  const t = content;

  const words = t.fullName.split(' ');
  const mid = Math.ceil(words.length / 2);
  const lines = [words.slice(0, mid), words.slice(mid)];

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(
      MQ.motion,
      () => {
        const all = gsap.utils.toArray<HTMLElement>('[data-hero-word]');
        const perLayer = all.length / 2;

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
        tl.from(all, { yPercent: 115, duration: 1.3, delay: (i: number) => (i % perLayer) * 0.1 })
          .from('[data-photo-tint]', { autoAlpha: 0, duration: 1 }, 0.5)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 18, duration: 1, stagger: 0.08 }, 0.9);
        tlRef.current = tl;

        const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-line="1"]', { xPercent: -2.5, ease: 'none', scrollTrigger: st });
        gsap.to('[data-line="2"]', { xPercent: 2.5, ease: 'none', scrollTrigger: st });

        return () => {
          tlRef.current = null;
        };
      },
      el,
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (ready) tlRef.current?.play();
  }, [ready]);

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const toProjects = (e: MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('projects');
    if (!target) return;
    const lenis = lenisRef.current;
    if (lenis?.scrollTo) lenis.scrollTo(target, { duration: 1.8, force: true });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-x-clip pt-20 pb-16 md:pt-28 md:pb-24"
    >
      <h1 className="sr-only">{t.fullName}</h1>

      {/* Meta paling minimal: pendidikan + IPK + waktu */}
      <div className="container-x mb-8 flex items-center justify-between gap-4 md:mb-14">
        <p data-hero-fade className={META}>
          {t.education.degree} · {t.education.institution}
        </p>
        <p data-hero-fade className={`${META} tabular-nums`}>
          {time} WIB
        </p>
      </div>

      <div className="relative flex justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundImage: `url(${asset('images/profile.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            filter: 'saturate(1.2)',
            opacity: 0.35,
            maskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, #000 25%, transparent 75%)',
          }}
        />

        <NameBlock lines={lines} tone="z-0 text-[var(--ink)]" />

        <div
          className="relative z-10 w-[clamp(15rem,min(32vw,48svh),28rem)]"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)',
            maskComposite: 'intersect',
          }}
        >
          <PhotoSlot
            src={asset('images/profile.jpg')}
            alt={t.fullName}
            ratio="4/5"
            radius={32}
            priority
            when={ready}
            delay={0.15}
            className="w-full"
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
            <div
              data-photo-tint
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgb(0 0 0 / 0.5), transparent 32%, transparent 68%, rgb(0 0 0 / 0.5))',
              }}
            />
            <NameBlock lines={lines} tone="text-white" />
          </div>
        </div>
      </div>

      <div data-hero-fade className="container-x mt-16 flex flex-col items-center gap-5 md:mt-24 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="w-full text-center font-funnel text-[clamp(1.2rem,5vw,1.5rem)] leading-[1.08] tracking-[-0.025em] text-[var(--ink)] md:w-auto md:text-left md:text-[clamp(1.75rem,3.4vw,2.9rem)]">
          <span className="font-light">Web developer</span>
          <span className="font-light"> &amp; </span>
          <span className="font-bold">UI/UX designer</span>
        </p>
        <a href="#projects" onClick={toProjects} className={linkCls}>
          Lihat karya
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </a>
      </div>
    </section>
  );
}
