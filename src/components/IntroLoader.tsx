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
      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        // --- ENTRANCE ANIMATION ---
        const entranceTl = gsap.timeline();
        
        entranceTl.from(".outliers-char", {
          y: i => i % 2 === 0 ? -100 : 100,
          x: i => i % 2 === 0 ? -50 : 50,
          opacity: 0,
          rotation: 45,
          scale: 0.5,
          duration: 1.2,
          stagger: 0.05,
          ease: "back.out(1.7)"
        })
        .from(".design-char", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          stagger: 0.03,
          ease: "power2.out"
        }, "-=0.5");

        // --- SCROLL ANIMATION ---
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%", 
            pin: true,
            scrub: 1, 
          },
        });

        // 1. Zoom the Masked Overlay
        tl.to(overlayGroupRef.current, {
          scale: isDesktop ? 150 : 80, // Smaller zoom needed for mobile screen ratio
          ease: "power2.inOut", 
          transformOrigin: "50% 45%", 
        })
        
        // 2. Fade out the White Layer
        .to(whiteLayerRef.current, {
          opacity: 0,
          ease: "power1.inOut", 
        }, "-=25%");
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- PAINT SPLASH COLORS ---
  const splashColors = ["#E04D60", "#4DE0D1", "#D14DE0", "#E0D14D", "#4D5DE0"];

  const handleMouseEnter = (i: number) => {
    // Letter Animation: Pop and rotate
    gsap.to(`.outliers-char-${i}`, { 
      scale: 1.3, 
      rotation: i % 2 === 0 ? 12 : -12,
      duration: 0.4, 
      ease: "back.out(3)" 
    });

    // Paint Splashes
    const splashes = document.querySelectorAll(`.splash-${i}`);
    splashes.forEach((splash, index) => {
      gsap.fromTo(splash, 
        { 
          scale: 0, 
          opacity: 0, 
          x: 0, 
          y: 0,
          rotation: 0
        },
        { 
          scale: Math.random() * 1.5 + 0.5, 
          opacity: 0.7, 
          x: (Math.random() - 0.5) * 40, 
          y: (Math.random() - 0.5) * 40,
          rotation: Math.random() * 360,
          duration: 0.6, 
          delay: index * 0.05,
          ease: "expo.out",
          fill: splashColors[Math.floor(Math.random() * splashColors.length)]
        }
      );
    });
  };

  const handleMouseLeave = (i: number) => {
    gsap.to(`.outliers-char-${i}`, { 
      scale: 1, 
      rotation: 0,
      duration: 0.4, 
      ease: "power2.inOut" 
    });
    
    // Fade out splashes
    gsap.to(`.splash-${i}`, { 
      opacity: 0, 
      scale: 0,
      duration: 0.4, 
      ease: "power2.in" 
    });
  };

  // --- PERFECT KERNING DATA ---
  const outliersX = [74, 96, 118, 139, 155, 171, 193, 215];
  const designX = [105, 124, 143, 159, 178, 198];

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      
      {/* 
        LAYER 3: TOP (Black Overlay with Cutout Text) 
      */}
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        {/* 
          Using responsive viewBox or conditional sizing to ensure text fits 
        */}
        <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="textMask">
              <rect x="0" y="0" width="300" height="150" fill="white" />
              
              <g className="text-hole">
                {/* Individual letters for "OUTLIERS" - Perfectly Kerning-Aware */}
                {"OUTLIERS".split("").map((char, i) => (
                  <text
                    key={`outliers-mask-${i}`}
                    x={outliersX[i]}
                    y="65"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`outliers-char outliers-char-${i} font-bold`}
                    fill="black"
                    style={{ fontFamily: "var(--font-outfit)", fontSize: "30px", transformOrigin: "center" }}
                  >
                    {char}
                  </text>
                ))}

                {/* Individual letters for "DESIGN" - Perfectly Kerning-Aware */}
                {"DESIGN".split("").map((char, i) => (
                  <text
                    key={`design-${i}`}
                    x={designX[i]}
                    y="92"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="design-char"
                    fontWeight="normal"
                    fill="black"
                    style={{ fontFamily: "var(--font-outfit)", fontSize: "15px" }}
                  >
                    {char}
                  </text>
                ))}
              </g>
            </mask>
          </defs>

          {/* Group that handles the zooming animation */}
          <g ref={overlayGroupRef}>
            <rect x="-50%" y="-50%" width="200%" height="200%" className="fill-black dark:fill-white transition-colors duration-300" />
            
            {/* Paint Splash Blobs */}
            <g className="splashes">
              {"OUTLIERS".split("").map((_, i) => (
                <g key={`splats-${i}`}>
                   {[0, 1, 2, 3].map(splatIndex => (
                     <path 
                       key={`splat-${i}-${splatIndex}`}
                       className={`splash-${i} pointer-events-none`}
                       d="M0-4.7c-0.3-0.1-0.6-0.1-0.9,0c-0.6,0.2-1.2,0.6-1.5,1.1C-2.7-3.1-3-2.6-3.2-2.1c-0.2,0.5-0.1,1.1,0.2,1.5 c0.3,0.4,0.7,0.7,1.2,0.8c0.8,0.2,1.6,0,2.3-0.4c0.5-0.3,1.1-0.5,1.7-0.5c0.6,0,1.2,0.1,1.7,0.4c0.7,0.4,1.5,0.6,2.3,0.4 c0.5-0.1,0.9-0.4,1.2-0.8c0.3-0.4,0.4-1,0.2-1.5c-0.2-0.5-0.5-1-0.8-1.5c-0.3-0.5-0.9-0.9-1.5-1.1c-0.3-0.1-0.6-0.1-0.9,0 C1.1-4.7,0.6-4.7,0-4.7z"
                       fill="#E04D60"
                       opacity="0"
                       style={{ transformOrigin: "center", transform: `translate(${outliersX[i]}px, 65px)` }}
                     />
                   ))}
                </g>
              ))}
            </g>

            <rect 
              x="-50%" y="-50%" width="200%" height="200%" 
              className="fill-white dark:fill-black transition-colors duration-300"
              mask="url(#textMask)" 
            />

            {/* Invisible interaction layer - Perfectly Aligned with Kerning */}
            <g className="interaction-layer">
              {"OUTLIERS".split("").map((_, i) => (
                <rect 
                  key={`interact-${i}`}
                  x={outliersX[i] - 12} y="45" width="24" height="40" 
                  fill="transparent"
                  style={{ pointerEvents: "all", cursor: "pointer" }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                />
              ))}
            </g>
          </g>
        </svg>
      </div>

      {/* 
        LAYER 2: MIDDLE (Background) 
      */}
      <div 
        ref={whiteLayerRef} 
        className="absolute inset-0 z-40 bg-white dark:bg-black transition-colors duration-300">
      </div>
    </div>
  );
}
