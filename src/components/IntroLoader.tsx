import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function IntroLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayGroupRef = useRef<SVGGElement>(null);
  const whiteLayerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          const entranceTl = gsap.timeline();

          entranceTl
            .from(".outliers-char", {
              opacity: 0,
              y: 40,
              duration: 1,
              stagger: 0.05,
              ease: "power3.out",
            })
            .from(
              ".design-char",
              {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.03,
                ease: "power2.out",
              },
              "-=0.5"
            );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=150%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 3,
            },
          });

          tl.to(overlayGroupRef.current, {
            scale: isDesktop ? 150 : 80,
            ease: "power2.inOut",
            transformOrigin: "50% 45%",
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

    return () => ctx.revert();
  }, []);

  const outliersX = [74, 96, 118, 139, 155, 171, 193, 215];
  const designX = [105, 124, 143, 159, 178, 198];

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

              {"OUTLIERS".split("").map((char, i) => (
                <text
                  key={i}
                  x={outliersX[i]}
                  y="65"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="outliers-char font-bold"
                  fill="black"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "30px",
                  }}
                >
                  {char}
                </text>
              ))}

              {"DESIGN".split("").map((char, i) => (
                <text
                  key={i}
                  x={designX[i]}
                  y="92"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="design-char"
                  fill="black"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    fontSize: "15px",
                  }}
                >
                  {char}
                </text>
              ))}
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
              className="fill-white dark:fill-black transition-colors duration-300"
              mask="url(#textMask)"
            />
          </g>
        </svg>
      </div>

      <div
        ref={whiteLayerRef}
        className="absolute inset-0 z-40 bg-white dark:bg-black transition-colors duration-300"
      />
    </div>
  );
}
