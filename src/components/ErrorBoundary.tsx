import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const FOCUS =
  'focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--bg,#fff),0_0_0_4px_var(--accent,#3340f5)]';

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Gagal merender halaman:', error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    const detail = import.meta.env.DEV ? this.state.error?.message : null;

    return (
      <div
        role="alert"
        className="flex min-h-screen items-center justify-center bg-[var(--bg,#f2f4f7)] p-6 text-[color:var(--ink,#101828)]"
      >
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Halaman gagal dimuat
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--ink-soft,#475467)]">
            Terjadi kesalahan saat menampilkan portfolio ini. Coba muat ulang halaman. Jika masih
            gagal, hubungi saya lewat email.
          </p>

          {detail && (
            <pre className="mt-5 max-h-40 overflow-auto rounded-2xl border border-[color:var(--line,#d0d5dd)] bg-[var(--surface,#fff)] p-4 text-xs leading-relaxed whitespace-pre-wrap">
              {detail}
            </pre>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={`h-11 rounded-full bg-[var(--accent,#3340f5)] px-6 text-sm font-semibold text-[color:var(--accent-ink,#fff)] ${FOCUS}`}
            >
              Muat ulang
            </button>
            <button
              type="button"
              onClick={this.reset}
              className={`h-11 rounded-full border border-[color:var(--line,#d0d5dd)] px-6 text-sm font-semibold ${FOCUS}`}
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    );
  }
}