import type { MouseEvent, MutableRefObject } from 'react';
import { content } from '@/data/content';

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]';

interface FooterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lenisRef: MutableRefObject<any>;
}

export default function Footer({ lenisRef }: FooterProps) {
  const toTop = (e: MouseEvent) => {
    e.preventDefault();
    const lenis = lenisRef.current;
    if (lenis?.scrollTo) lenis.scrollTo(0, { duration: 2, force: true });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--line)] py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="container-x">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-[var(--ink-soft)] sm:text-left">
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-semibold text-[var(--ink)]">{content.fullName}</span>
          </p>
          <a
            href="#hero"
            onClick={toTop}
            className={`relative rounded-sm text-sm font-semibold text-[color:var(--ink-soft)] transition-colors hover:text-[color:var(--accent)] max-sm:inline-flex max-sm:min-h-[44px] max-sm:items-center ${FOCUS}`}
          >
            Kembali ke atas
          </a>
        </div>
      </div>
    </footer>
  );
}