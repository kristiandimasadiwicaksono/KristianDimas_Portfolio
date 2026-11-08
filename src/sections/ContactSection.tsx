import { useEffect, useRef, useState, type SVGProps } from 'react';
import { content } from '@/data/content';
import CVButton from '@/components/CVButton';

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]';

/* Ikon inline — ringan, tanpa dependensi eksternal */

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function IconCopy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function IconArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const t = content;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(t.contact.email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = t.contact.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2400);
  };

  const channels = [
    {
      label: 'LinkedIn',
      detail: t.contact.linkedin.replace('https://', ''),
      href: t.contact.linkedin,
      external: true,
    },
    {
      label: 'GitHub',
      detail: t.contact.github.replace('https://', ''),
      href: t.contact.github,
      external: true,
    },
    ...(t.contact.whatsapp
      ? [{ label: 'WhatsApp', detail: t.contact.phone, href: t.contact.whatsapp, external: true }]
      : []),
  ];

  return (
    <section
      id="contact"
      aria-label="Informasi kontak dan saluran komunikasi"
      className="section-y relative overflow-hidden bg-[var(--bg)]"
    >
      {/* Kilau aksen halus di latar — hapus div ini bila terasa terlalu ramai */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-12%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_65%)] blur-3xl"
      />

      <div className="container-x relative">
        {/* Kepala section */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="h-contact mt-6 text-[var(--ink)]">
              Mari bekerja bersama
              <span aria-hidden="true" className="text-[var(--accent)]">
                .
              </span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-relaxed text-[var(--ink-soft)] lg:col-span-5 lg:justify-self-end lg:pb-2">
            Terbuka untuk proyek baru, integrasi sistem, atau kolaborasi teknis.
          </p>
        </div>

        {/* Email — aksi utama */}
        <div className="mt-12 border-t border-[var(--line)] pt-8 md:mt-16">
          <p className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
            <IconMail className="h-4 w-4" />
            Kirim email
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={`mailto:${t.contact.email}`}
              className={`max-w-full break-words bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-no-repeat font-display text-[clamp(1.05rem,4.9vw,3rem)] leading-[1.1] tracking-tight text-[var(--ink)] [background-position:0_calc(100%_-_0.15em)] [transition:background-size_.35s_ease,color_.2s_ease] hover:bg-[length:100%_2px] hover:text-[var(--accent)] motion-reduce:transition-none ${FOCUS}`}
            >
              {t.contact.email}
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={
                copied ? 'Alamat email tersalin ke clipboard' : 'Salin alamat email ke clipboard'
              }
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all motion-reduce:transition-none ${
                copied
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              } ${FOCUS}`}
            >
              {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
              {copied ? 'Tersalin' : 'Salin'}
            </button>
          </div>

          <p aria-live="polite" className="sr-only">
            {copied ? 'Email berhasil disalin ke clipboard.' : ''}
          </p>
        </div>

        {/* Saluran lain — kartu interaktif */}
        <ul
          aria-label="Saluran komunikasi lainnya"
          className={`mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 ${
            channels.length >= 3 ? 'lg:grid-cols-3' : ''
          }`}
        >
          {channels.map((ch) => (
            <li key={ch.label}>
              <a
                href={ch.href}
                target={ch.external ? '_blank' : undefined}
                rel={ch.external ? 'noopener noreferrer' : undefined}
                className={`group flex h-full flex-col justify-between gap-5 rounded-2xl border border-[var(--line)] p-5 transition-all hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] motion-reduce:transition-none ${FOCUS}`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                    {ch.label}
                  </span>
                  <IconArrowUpRight className="h-4 w-4 shrink-0 text-[var(--ink-soft)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)] motion-reduce:transition-none" />
                </span>
                <span className="break-words text-sm font-semibold text-[var(--ink)] sm:text-base">
                  {ch.detail}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* CTA unduh CV */}
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[var(--line)] p-6 sm:flex-row sm:items-center sm:p-7 md:mt-12">
          <div>
            <p className="font-display text-lg tracking-tight text-[var(--ink)]">
              Butuh ringkasan lengkap?
            </p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">Unduh CV terbaru dalam satu klik.</p>
          </div>
          <CVButton size="sm" variant="primary" className="md:h-[52px] md:px-7 md:text-base" />
        </div>
      </div>
    </section>
  );
}