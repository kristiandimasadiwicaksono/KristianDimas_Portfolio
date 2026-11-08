import type { ReactNode } from 'react';
import RevealText from '@/components/RevealText';

interface SectionHeadProps {
  title: ReactNode;
}

export default function SectionHead({ title }: SectionHeadProps) {
  return (
    <div className="mb-12 md:mb-20">
      <span aria-hidden="true" className="mb-8 block h-px w-full bg-[var(--line)]" />
      <RevealText as="h2" className="h-section text-[var(--ink)]">
        {title}
      </RevealText>
    </div>
  );
}
