import { useCallback, useEffect, useRef, useState, type MouseEvent, type MutableRefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { content } from '@/data/content';
import CVButton from '@/components/CVButton';

const LINKS = [
  { id: 'about', label: 'Tentang' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'experience', label: 'Pengalaman' },
  { id: 'projects', label: 'Project' },
  { id: 'certificates', label: 'Sertifikat' },
  { id: 'contact', label: 'Kontak' },
] as const;

const OBSERVED_IDS = ['hero', ...LINKS.map((l) => l.id)];

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface NavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lenisRef: MutableRefObject<any>;
}

export default function Navbar({ lenisRef }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const mountedRef = useRef(false);

  /* Entrance: header meluncur turun sekali saat halaman siap */
  useEffect(() => {
    const header = headerRef.current;
    if (!header || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      header,
      { yPercent: -100 },
      { yPercent: 0, duration: 1, ease: 'expo.out', delay: 0.2 },
    );
    return () => {
      tween.kill();
      gsap.set(header, { yPercent: 0 });
    };
  }, []);

  /* Header selalu tampil (sticky). Scroll hanya mengubah latarnya. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Tandai section yang sedang tampil */
  useEffect(() => {
    const els = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Garis penanda aktif yang meluncur antar link (desktop) */
  const moveIndicator = useCallback((animate: boolean) => {
    const list = listRef.current;
    const ind = indicatorRef.current;
    if (!list || !ind) return;
    const link = list.querySelector<HTMLElement>('a[aria-current="location"]');
    const dur = animate && !prefersReducedMotion() ? 0.6 : 0;
    if (!link) {
      gsap.to(ind, { opacity: 0, duration: dur ? 0.3 : 0, overwrite: 'auto' });
      return;
    }
    gsap.to(ind, {
      x: link.offsetLeft,
      width: link.offsetWidth,
      opacity: 1,
      duration: dur,
      ease: 'expo.out',
      overwrite: 'auto',
    });
  }, []);

  useEffect(() => {
    moveIndicator(true);
  }, [active, moveIndicator]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => moveIndicator(false));
    ro.observe(list);
    return () => ro.disconnect();
  }, [moveIndicator]);

  /* Tutup menu mobile bila layar melebar */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Animasi buka/tutup menu mobile */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const items = overlay.querySelectorAll('[data-menu-item]');
    const fades = overlay.querySelectorAll('[data-menu-fade]');
    const dur = prefersReducedMotion() ? 0 : 1;
    const lenis = lenisRef.current;

    const lock = () => {
      lenis?.stop?.();
      document.body.style.overflow = 'hidden';
    };
    const unlock = () => {
      lenis?.start?.();
      document.body.style.overflow = '';
    };

    gsap.killTweensOf([overlay, items, fades]);

    if (open) {
      overlay.removeAttribute('inert');
      overlay.setAttribute('aria-hidden', 'false');
      lock();
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.fromTo(
        overlay,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.7 * dur, ease: 'expo.inOut' },
      );
      gsap.fromTo(
        items,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9 * dur, ease: 'expo.out', stagger: 0.06 * dur, delay: 0.3 * dur },
      );
      gsap.fromTo(
        fades,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7 * dur, ease: 'power3.out', delay: 0.6 * dur },
      );
      const firstLink = overlay.querySelector<HTMLElement>('a, button');
      window.setTimeout(() => firstLink?.focus({ preventScroll: true }), 400 * dur);
    } else {
      overlay.setAttribute('inert', '');
      overlay.setAttribute('aria-hidden', 'true');
      if (!mountedRef.current) {
        gsap.set(overlay, { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' });
      } else {
        unlock();
        gsap.to(overlay, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.5 * dur,
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.set(overlay, { autoAlpha: 0 });
          },
        });
      }
    }
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Pastikan scroll dilepas saat komponen dilepas */
  useEffect(
    () => () => {
      document.body.style.overflow = '';
      lenisRef.current?.start?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* Kunci fokus di dalam menu mobile + Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const overlay = overlayRef.current;
      if (!overlay || !btnRef.current) return;
      const list = [btnRef.current, ...Array.from(overlay.querySelectorAll<HTMLElement>('a, button'))];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const goTo = (e: MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    const wasOpen = open;
    setOpen(false);
    if (!el) return;

    window.setTimeout(
      () => {
        const lenis = lenisRef.current;
        if (lenis?.scrollTo) {
          lenis.scrollTo(el, { offset: id === 'hero' ? 0 : -72, duration: 1.6, force: true });
        } else {
          el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        }
        history.replaceState(null, '', id === 'hero' ? window.location.pathname : `#${id}`);
      },
      wasOpen ? 350 : 0,
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-300 motion-reduce:transition-none ${
          scrolled && !open
            ? 'border-b border-[color:var(--line)] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)]'
            : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Navigasi utama"
          className="container-x flex h-16 items-center justify-between gap-6 lg:h-20"
        >
          <a
            href="#hero"
            onClick={(e) => goTo(e, 'hero')}
            aria-label={`${content.fullName}, kembali ke atas`}
            className={`font-display max-sm:inline-flex max-sm:min-h-[44px] max-sm:items-center text-xl font-black tracking-tight text-[color:var(--ink)] transition-colors hover:text-[color:var(--accent)] motion-reduce:transition-none ${FOCUS} rounded-none`}
          >
            {content.name}
          </a>

          <ul ref={listRef} className="relative hidden items-center gap-8 lg:flex">
            {LINKS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => goTo(e, id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`inline-block py-2 text-[0.95rem] font-medium transition-colors motion-reduce:transition-none ${FOCUS} rounded-none hover:text-[color:var(--accent)] ${
                      isActive ? 'text-[color:var(--accent)]' : 'text-[color:var(--ink)]'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-none bg-[var(--accent)]"
              style={{ width: 0, opacity: 0 }}
            />
          </ul>

          <div className="flex items-center gap-3">
            <span className="max-sm:hidden">
              <CVButton size="sm" variant="primary" />
            </span>
            <button
              ref={btnRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              className={`group flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full transition-[background-color,transform] hover:scale-105 hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] active:scale-95 motion-reduce:transition-none lg:hidden ${FOCUS}`}
            >
              <span
                className={`block h-0.5 w-5 bg-[var(--ink)] transition-[background-color,transform] duration-300 group-hover:bg-[var(--accent)] motion-reduce:transition-none ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--ink)] transition-[background-color,opacity] duration-200 group-hover:bg-[var(--accent)] motion-reduce:transition-none ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-[var(--ink)] transition-[background-color,transform] duration-300 group-hover:bg-[var(--accent)] motion-reduce:transition-none ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay menu mobile: di luar <header> agar tidak ikut ter-transform */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        aria-hidden="true"
        data-lenis-prevent
        style={{ visibility: 'hidden' }}
        className="fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-y-auto overscroll-contain bg-[var(--bg)] px-[clamp(1rem,4vw,3rem)] pt-[calc(6rem+env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <ul className="flex flex-col">
          {LINKS.map(({ id, label }) => (
            <li key={id} className="overflow-hidden">
              <a
                data-menu-item
                href={`#${id}`}
                onClick={(e) => goTo(e, id)}
                aria-current={active === id ? 'location' : undefined}
                className={`block py-1 font-display text-[clamp(1.75rem,8vw,2.5rem)] leading-[1.2] font-extrabold tracking-tight transition-colors motion-reduce:transition-none ${FOCUS} rounded-none ${
                  active === id
                    ? 'text-[color:var(--accent)]'
                    : 'text-[color:var(--ink)] active:text-[color:var(--accent)]'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div data-menu-fade className="mt-auto flex flex-col gap-5 pt-10">
          <CVButton variant="primary" className="w-full sm:w-auto" />
          <a
            href={`mailto:${content.contact.email}`}
            className={`w-fit text-sm text-[color:var(--ink-soft)] underline-offset-4 hover:text-[color:var(--accent)] hover:underline ${FOCUS} rounded-none`}
          >
            {content.contact.email}
          </a>
        </div>
      </div>
    </>
  );
}