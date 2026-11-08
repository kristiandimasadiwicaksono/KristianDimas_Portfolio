import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Navbar from '@/components/Navbar';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import SkillsSection from '@/sections/SkillsSection';
import ExperienceSection from '@/sections/ExperienceSection';
import ProjectsSection from '@/sections/ProjectsSection';
import CertificatesSection from '@/sections/CertificatesSection';
import ContactSection from '@/sections/ContactSection';
import Footer from '@/sections/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import IntroLoader from '@/components/IntroLoader';
import Background from '@/components/Background';

export default function App() {
  const lenisRef = useSmoothScroll();
  const [ready, setReady] = useState(false); // tirai mulai naik -> Hero boleh masuk
  const [showIntro, setShowIntro] = useState(true);

  // Setelah intro selesai, hitung ulang posisi semua ScrollTrigger.
  useEffect(() => {
    if (!showIntro) ScrollTrigger.refresh();
  }, [showIntro]);

  return (
    <ErrorBoundary>
      <div className="relative isolate min-h-screen bg-[var(--bg)] text-[var(--ink)] transition-colors duration-300">
        {showIntro && (
          <IntroLoader onReveal={() => setReady(true)} onComplete={() => setShowIntro(false)} />
        )}
        <Background />
        <Navbar lenisRef={lenisRef} />
        <main id="main">
          <HeroSection lenisRef={lenisRef} ready={ready} />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <CertificatesSection />
          <ContactSection />
        </main>
        <Footer lenisRef={lenisRef} />
      </div>
    </ErrorBoundary>
  );
}