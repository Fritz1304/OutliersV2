import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let refreshFrame = 0;

    const update = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const initFrame = window.requestAnimationFrame(() => {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    return () => {
      window.cancelAnimationFrame(initFrame);
      window.cancelAnimationFrame(refreshFrame);
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
      lenis?.destroy();
    };
  }, []);

  return null;
}
