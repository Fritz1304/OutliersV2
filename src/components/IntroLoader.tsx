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

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      
      {/* 
        LAYER 3: TOP (Black Overlay with Cutout Text) 
      */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* 
          Using responsive viewBox or conditional sizing to ensure text fits 
        */}
        <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="textMask">
              <rect x="0" y="0" width="300" height="150" fill="white" />
              
              <g className="text-hole">
                {/* Responsive font size and positioning via classes or inline */}
                <text 
                  x="150" 
                  y="65" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-[30px] md:text-[30px] font-bold"
                  letterSpacing="3" 
                  fill="black"
                  style={{ fontFamily: "var(--font-outfit)", fontSize: "30px" }}
                >
                  <tspan fill="black">OUTLIERS</tspan>
                </text>

                <text 
                  x="150" 
                  y="92" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-[14px] md:text-[16px]"
                  fontWeight="normal" 
                  letterSpacing="4" 
                  fill="black"
                  style={{ fontFamily: "var(--font-outfit)", fontSize: "15px" }}
                >
                  DESIGN
                </text>
              </g>
            </mask>
          </defs>

          {/* Group that handles the zooming animation */}
          <g ref={overlayGroupRef}>
            {/* The base layer showing through the text holes: Background colors */}
            {/* Black base for OUTLI & DESIGN in Light mode, White base in Dark Mode */}
            <rect x="-50%" y="-50%" width="200%" height="200%" className="fill-black dark:fill-white transition-colors duration-300" />
            
            {/* Red block strictly corresponding to the ERS position.
                Since "OUTLIERS" has textAnchor="middle" at x=150, 
                "ERS" starts around x=180 with this font size */}
            <rect x="170" y="45" width="60" height="30" fill="#E04D60" />

            {/* The main cover that has holes punched out by the mask. White on Light mode, Black on Dark mode. */}
            <rect 
              x="-50%" y="-50%" width="200%" height="200%" 
              className="fill-white dark:fill-black transition-colors duration-300"
              mask="url(#textMask)" 
            />
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
