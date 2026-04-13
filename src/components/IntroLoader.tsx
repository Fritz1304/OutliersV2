import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Cambia estas rutas cuando tengas una version negra y otra blanca del logo.
const INTRO_LOGO_LIGHT = `${import.meta.env.BASE_URL}images/Logov2.png`;
const INTRO_LOGO_DARK = `${import.meta.env.BASE_URL}images/white.png`;

interface IntroLoaderProps {
  onIntroReady?: () => void;
}

export default function IntroLoader({ onIntroReady }: IntroLoaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayGroupRef = useRef<SVGGElement>(null);
  const whiteLayerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGImageElement>(null);
  const readyNotifiedRef = useRef(false);
  const INTRO_SCROLL_LENGTH = 90;
  const introLogoSrc = isDarkMode ? INTRO_LOGO_DARK : INTRO_LOGO_LIGHT;

  useEffect(() => {
    const html = document.documentElement;
    const syncTheme = () => {
      setIsDarkMode(html.classList.contains("dark"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      gsap.set(logoRef.current, {
        autoAlpha: 0,
        scale: 0.92,
        transformOrigin: "50% 50%",
        willChange: "transform, opacity",
      });
      gsap.set(overlayGroupRef.current, {
        transformOrigin: "50% 45%",
        willChange: "transform",
      });
      gsap.set(whiteLayerRef.current, {
        willChange: "opacity",
      });

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          const entranceTl = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
            onComplete: () => {
              if (!readyNotifiedRef.current) {
                readyNotifiedRef.current = true;
                onIntroReady?.();
              }
            },
          });

          entranceTl.to(logoRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
            clearProps: "transform,willChange",
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: `+=${INTRO_SCROLL_LENGTH}%`,
              pin: true,
              pinSpacing: false,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 3,
            },
          });

          tl.to(overlayGroupRef.current, {
            scale: isDesktop ? 150 : 80,
            ease: "power2.inOut",
            force3D: true,
          }).to(
            whiteLayerRef.current,
            {
              opacity: 0,
              ease: "power1.inOut",
            },
            "-=25%"
          );
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [onIntroReady]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 300 150"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id="textMask">
              <rect x="0" y="0" width="300" height="150" fill="white" />
              <image
                ref={logoRef}
                href={introLogoSrc}
                x="55"
                y="30"
                width="180"
                height="90"
                preserveAspectRatio="xMidYMid meet"
                style={{ filter: isDarkMode ? "invert(1)" : "none" }}
              />
            </mask>
          </defs>

          <g ref={overlayGroupRef}>
            <rect
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              className="fill-black dark:fill-white transition-colors duration-300"
            />

            <rect
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              fill="var(--page-bg)"
              mask="url(#textMask)"
            />
          </g>
        </svg>
      </div>

      <div
        ref={whiteLayerRef}
        className="absolute inset-0 z-40 relative-bg"
        style={{ backgroundColor: "var(--page-bg)" }}
      />
    </div>
  );
}
