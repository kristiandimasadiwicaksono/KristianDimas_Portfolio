import { useEffect, useState } from 'react';

const CV_URL = `${import.meta.env.BASE_URL}cv/Kristian Dimas Adi Wicaksono-resume.pdf`;

/**
 * Cek keberadaan CV satu kali saja untuk semua tombol di halaman.
 * Catatan: dev server Vite (dan banyak hosting SPA) mengembalikan index.html
 * dengan status 200 untuk file yang tidak ada, jadi status OK saja tidak cukup.
 * Kita juga memastikan tipe kontennya bukan HTML.
 */
let cvCheck: Promise<boolean> | null = null;
function checkCv(): Promise<boolean> {
  if (!cvCheck) {
    cvCheck = fetch(CV_URL, { method: 'HEAD' })
      .then((res) => res.ok && !(res.headers.get('content-type') ?? '').includes('text/html'))
      .catch(() => false);
  }
  return cvCheck;
}

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]';

const SIZES = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-[52px] px-7 text-base',
} as const;

const VARIANTS = {
  primary:
    'border border-transparent bg-[color:var(--accent)] text-[color:var(--accent-ink)] hover:bg-[color:var(--accent-2)]',
  secondary:
    'border border-[color:var(--line)] bg-transparent text-[color:var(--ink)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]',
} as const;

interface CVButtonProps {
  className?: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  onMissingCv?: (missing: boolean) => void;
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function CVButton({
  className = '',
  variant = 'primary',
  size = 'md',
  onMissingCv,
}: CVButtonProps) {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let alive = true;
    checkCv().then((exists) => {
      if (!alive) return;
      setMissing(!exists);
      onMissingCv?.(!exists);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = `group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-300 motion-reduce:transition-none ${FOCUS}`;

  if (missing) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="Berkas CV belum ditambahkan"
        className={`${base} ${SIZES[size]} cursor-not-allowed border border-dashed border-[color:var(--line)] text-[color:var(--ink-soft)] ${className}`}
      >
        CV segera tersedia
      </button>
    );
  }

  const v = VARIANTS[variant];

  return (
    <a
      href={CV_URL}
      download="Kristian Dimas Adi Wicaksono-resume.pdf"
      className={`${base} ${SIZES[size]} ${v} hover:-translate-y-0.5 hover:shadow-[0_8px_22px_color-mix(in_srgb,var(--accent)_24%,transparent)] active:translate-y-0 active:shadow-none ${className}`}
      aria-label="Unduh CV dalam format PDF"
    >
      <DownloadIcon />
      <span>Unduh CV</span>
    </a>
  );
}