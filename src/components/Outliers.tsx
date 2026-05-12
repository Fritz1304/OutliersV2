import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    title: "Quiénes Somos",
    content: "Somos Outliers Design, un estudio creativo dedicado a transformar ideas en identidades de marca poderosas y memorables.",
  },
  {
    title: "Misión",
    content: "Nuestra misión es diseñar marcas auténticas que conecten con la audiencia y crezcan con claridad en el mercado.",
  },
  {
    title: "Visión",
    content: "Ser el referente creativo para empresas que buscan marcas con impacto real y capacidad de evolución.",
  },
  {
    title: "Valores",
    content: "Innovación, integridad y compromiso. Valoramos la creatividad, la honestidad y las relaciones duraderas.",
  },
];

export default function Outliers() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animaciones aesthetic y sincronizadas para cada sección
      gsap.utils.toArray<HTMLElement>(".content-section").forEach((section) => {
        const imageBlock = section.querySelector(".image-block");
        const title = section.querySelector(".section-title");
        const content = section.querySelector(".section-content");
        const accentLine = section.querySelector(".accent-line");

        // Timeline para sincronizar animaciones
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // Animaciones fluidas simples
        tl.fromTo(
          title,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          }
        )
        .fromTo(
          content,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          accentLine,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          imageBlock,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" },
          "-=0.6"
        );

        // Parallax sutil
        if (imageBlock) {
          gsap.to(imageBlock, {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });

      // Hover effects sutiles (opcionales)
      gsap.utils.toArray<HTMLElement>(".image-block").forEach((image) => {
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(image, {
          scale: 1.02,
          duration: 0.4,
          ease: "power2.out",
        });

        image.addEventListener("mouseenter", () => hoverTl.play());
        image.addEventListener("mouseleave", () => hoverTl.reverse());
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-black text-white">
      {/* Content Sections */}
      <div className="space-y-0">
        {sections.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className="content-section flex items-center justify-center px-8 py-12 bg-black"
            >
              <div className={`grid grid-cols-2 gap-12 items-center max-w-6xl mx-auto w-full ${isEven ? "" : ""}`}>
                {isEven ? (
                  <>
                    {/* Texto izquierda */}
                    <div className="text-block">
                      <h2 className="section-title font-bold mb-6 text-[rgb(224,77,96)] text-5xl lg:text-6xl">
                        {section.title}
                      </h2>
                      <p className="section-content leading-relaxed text-[rgb(240,239,235)] text-base lg:text-lg">
                        {section.content}
                      </p>
                      <div className="accent-line mt-6 bg-[rgb(224,77,96)] h-1 w-24" />
                    </div>
                    {/* Imagen derecha */}
                    <div className="image-block">
                      <div className={`w-full rounded-2xl overflow-hidden shadow-2xl ${
                        index === 0 ? "h-80 bg-linear-to-br from-red-600 to-red-900" :
                        "h-80 bg-linear-to-br from-purple-600 to-purple-900"
                      }`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl mb-2">{index === 0 ? "👥" : "🚀"}</div>
                            <p className="text-sm font-semibold text-gray-200">Imagen {index + 1}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Imagen izquierda */}
                    <div className="image-block">
                      <div className={`w-full rounded-2xl overflow-hidden shadow-2xl ${
                        index === 1 ? "h-80 bg-linear-to-br from-blue-600 to-blue-900" :
                        "h-80 bg-linear-to-br from-green-600 to-green-900"
                      }`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-5xl mb-2">{index === 1 ? "🎯" : "💎"}</div>
                            <p className="text-sm font-semibold text-gray-200">Imagen {index + 1}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Texto derecha */}
                    <div className="text-block">
                      <h2 className="section-title font-bold mb-6 text-[rgb(224,77,96)] text-5xl lg:text-6xl">
                        {section.title}
                      </h2>
                      <p className="section-content leading-relaxed text-[rgb(240,239,235)] text-base lg:text-lg">
                        {section.content}
                      </p>
                      <div className="accent-line mt-6 bg-[rgb(224,77,96)] h-1 w-24" />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
