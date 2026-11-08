import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // gratis sejak gsap 3.13

// Daftarkan plugin SEKALI di sini; semua komponen impor dari file ini.
gsap.registerPlugin(ScrollTrigger, SplitText);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

// Address bar mobile yang naik-turun tidak boleh memicu refresh ScrollTrigger.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText };

/** Query dipakai bersama gsap.matchMedia() */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine)',
  desktop: '(min-width: 1024px)',
} as const;