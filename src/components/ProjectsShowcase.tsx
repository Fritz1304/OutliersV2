import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PROJECTS = [
  {
    title: "Ruta Nativa",
    category: "Brand System & Retail",
    year: "2026",
    image: `${import.meta.env.BASE_URL}projects/ruta-nativa.svg`,
    accent: "#E79A5C",
    summary:
      "Una identidad pensada para verse premium sin perder arraigo: narrativa visual calida, sistema modular y piezas listas para punto de venta.",
    services: ["Identidad", "Retail", "Launch"],
    deliverables: "Naming, packaging modular y kit de lanzamiento.",
    focus: "Construir una marca cercana, con caracter editorial y lectura inmediata.",
    result:
      "Sistema visual listo para crecer a nuevas lineas sin perder coherencia.",
    metric: "12 piezas clave",
  },
  {
    title: "Lumbre Social",
    category: "Campaign & Motion",
    year: "2025",
    image: `${import.meta.env.BASE_URL}projects/lumbre-social.svg`,
    accent: "#FF8F6D",
    summary:
      "Campana de contenido con tono intenso y visualidad contundente para una marca que necesitaba mas presencia, ritmo y memorabilidad.",
    services: ["Contenido", "Motion", "Social"],
    deliverables: "Campana madre, toolkit social y piezas en movimiento.",
    focus: "Elevar la expresion digital sin depender de plantillas repetidas.",
    result:
      "Una presencia mas clara, mas viva y mas facil de reconocer en cualquier formato.",
    metric: "8 activos hero",
  },
  {
    title: "Orbita Lab",
    category: "Website & UX Story",
    year: "2026",
    image: `${import.meta.env.BASE_URL}projects/orbita-lab.svg`,
    accent: "#7FD7FF",
    summary:
      "Una experiencia web que vende criterio antes que features, con narrativa visual, jerarquia clara y una puesta en escena de producto mucho mas solida.",
    services: ["Web", "UX", "Producto"],
    deliverables: "Direccion visual, arquitectura y landing de conversion.",
    focus:
      "Traducir complejidad tecnica en una experiencia elegante y facil de seguir.",
    result:
      "El sitio pasa de mostrar capacidades a construir confianza en segundos.",
    metric: "4 bloques clave",
  },
  {
    title: "Cosecha Viva",
    category: "Packaging & Launch",
    year: "2024",
    image: `${import.meta.env.BASE_URL}projects/cosecha-viva.svg`,
    accent: "#87A56B",
    summary:
      "Empaque, tono y universo visual para una linea que necesitaba sentirse honesta, fresca y preparada para entrar a nuevos puntos de venta.",
    services: ["Packaging", "Narrativa", "Retail"],
    deliverables:
      "Sistema de empaque, storytelling y piezas para lanzamiento.",
    focus: "Hacer que el producto se vea tan cuidado como se siente en mano.",
    result:
      "Una narrativa de marca que sostiene crecimiento sin sacrificar personalidad.",
    metric: "6 frentes listos",
  },
] as const;

export default function ProjectsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const activateProjectRef = useRef<(index: number) => void>(() => {});

  useGSAP(
    (_, contextSafe) => {
      const safeContext =
        contextSafe ?? (<T extends (...args: never[]) => void>(fn: T) => fn);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray<HTMLElement>("[data-stage-panel]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");
      const fills = gsap.utils.toArray<HTMLElement>("[data-progress-fill]");
      const progressButtons = gsap.utils.toArray<HTMLElement>(
        "[data-progress-button]"
      );
      let activeIndex = 0;

      const setActiveAttributes = (nextIndex: number) => {
        cards.forEach((card, index) => {
          card.dataset.active = index === nextIndex ? "true" : "false";
        });

        progressButtons.forEach((button, index) => {
          button.dataset.active = index === nextIndex ? "true" : "false";
        });
      };

      const activateProject = safeContext((nextIndex: number) => {
        if (nextIndex === activeIndex) return;

        const previousIndex = activeIndex;
        activeIndex = nextIndex;

        setActiveAttributes(nextIndex);

        gsap.to(panels[previousIndex], {
          autoAlpha: 0,
          yPercent: 4,
          scale: 0.985,
          duration: reduceMotion ? 0.01 : 0.36,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });

        gsap.to(panels[nextIndex], {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          duration: reduceMotion ? 0.01 : 0.46,
          ease: "power3.out",
          overwrite: "auto",
          force3D: true,
        });

        gsap.to(fills[previousIndex], {
          scaleX: 0.32,
          opacity: 0.35,
          duration: reduceMotion ? 0.01 : 0.28,
          ease: "power2.out",
          overwrite: "auto",
          transformOrigin: "left center",
        });

        gsap.to(fills[nextIndex], {
          scaleX: 1,
          opacity: 1,
          duration: reduceMotion ? 0.01 : 0.34,
          ease: "power2.out",
          overwrite: "auto",
          transformOrigin: "left center",
        });
      });

      activateProjectRef.current = activateProject;
      setActiveAttributes(0);

      gsap.set(panels, {
        autoAlpha: 0,
        yPercent: 4,
        scale: 0.985,
        force3D: true,
      });

      gsap.set(panels[0], {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
      });

      if (!reduceMotion) {
        gsap.from("[data-project-intro]", {
          y: 20,
          autoAlpha: 0,
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        });

        gsap.from("[data-stage-shell]", {
          x: -20,
          autoAlpha: 0,
          duration: 0.74,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 74%",
            once: true,
          },
        });

        gsap.from("[data-project-card]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.66,
          stagger: 0.08,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: "[data-project-list]",
            start: "top 84%",
            once: true,
          },
        });
      }

      const createCardTriggers = (start: string, end: string) => {
        cards.forEach((card, index) => {
          ScrollTrigger.create({
            trigger: card,
            start,
            end,
            fastScrollEnd: true,
            onEnter: () => activateProject(index),
            onEnterBack: () => activateProject(index),
          });
        });
      };

      mm.add("(min-width: 1024px)", () => {
        createCardTriggers("top 62%", "bottom 38%");
      });

      mm.add("(max-width: 1023px)", () => {
        createCardTriggers("top 76%", "bottom 34%");
      });

      return () => {
        activateProjectRef.current = () => {};
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="bg-page relative overflow-hidden px-4 py-20 text-black transition-colors duration-300 dark:text-black sm:px-6 md:px-8 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent dark:via-white/12" />
        <div className="absolute left-[8%] top-20 h-28 w-28 rounded-full bg-[#ffd8b4]/30 blur-2xl dark:bg-[#ff8f6d]/12" />
        <div className="absolute right-[14%] top-44 h-36 w-36 rounded-full bg-[#c4efff]/26 blur-2xl dark:bg-[#7fd7ff]/10" />
        <div className="absolute bottom-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d7e8c5]/28 blur-2xl dark:bg-[#87a56b]/10" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div className="max-w-3xl">
            <p
              data-project-intro
              className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-black/50 dark:text-black/55"
            >
              Proyectos Seleccionados
            </p>
            <h2
              data-project-intro
              className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl"
            >
              Cuatro historias con una puesta en escena mucho mas ligera.
            </h2>
          </div>

          <div data-project-intro className="max-w-xl lg:justify-self-end">
            <p className="text-base leading-relaxed text-black/65 dark:text-black/70 sm:text-lg">
              Depuramos la experiencia para que el cambio de proyecto no dependa
              de rerenders durante el scroll. Ahora la seccion se mueve casi
              toda con GSAP sobre transform y opacidad.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 xl:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              data-stage-shell
              className="border-surface bg-surface-strong relative min-h-[30rem] overflow-hidden rounded-[2rem] border shadow-[0_20px_48px_rgba(17,17,17,0.08)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.24)] sm:min-h-[34rem]"
            >
              {PROJECTS.map((project, index) => (
                <div
                  key={project.title}
                  data-stage-panel
                  className="absolute inset-0 will-change-transform"
                >
                  <img
                    src={project.image}
                    alt={`Preview visual de ${project.title}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "low"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />

                  <div className="absolute inset-0 flex min-h-[30rem] flex-col justify-between p-5 text-white sm:min-h-[34rem] sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-full border border-white/18 bg-black/18 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white">
                        0{index + 1} / 0{PROJECTS.length}
                      </div>
                      <div className="rounded-full border border-white/18 bg-black/18 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white">
                        {project.metric}
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                          {project.category}
                        </p>
                        <h3 className="text-3xl font-semibold tracking-tight sm:text-[2.65rem]">
                          {project.title}
                        </h3>
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                          {project.summary}
                        </p>
                      </div>

                      <div className="max-w-sm rounded-[1.35rem] border border-white/12 bg-black/18 p-4 sm:p-5">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/65">
                          Resultado
                        </p>
                        <p className="text-sm leading-relaxed text-white/86 sm:text-[0.95rem]">
                          {project.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              {PROJECTS.map((project, index) => (
                <button
                  key={project.title}
                  type="button"
                  data-progress-button
                  data-active={index === 0 ? "true" : "false"}
                  onMouseEnter={() => activateProjectRef.current(index)}
                  onFocus={() => activateProjectRef.current(index)}
                  className="group text-left text-black/50 transition-colors duration-300 data-[active=true]:text-black dark:text-black/55 dark:data-[active=true]:text-black"
                  aria-label={`Ver ${project.title}`}
                >
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.32em]">
                    0{index + 1}
                  </span>
                  <span className="block h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <span
                      data-progress-fill
                      className="block h-full w-full rounded-full bg-black dark:bg-white"
                      style={
                        index === 0
                          ? { transform: "scaleX(1)", opacity: 1 }
                          : { transform: "scaleX(0.32)", opacity: 0.35 }
                      }
                    />
                  </span>
                  <span className="mt-2 line-clamp-2 block text-sm">
                    {project.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div data-project-list className="space-y-4 sm:space-y-5">
            {PROJECTS.map((project, index) => (
              <article
                key={project.title}
                data-project-card
                data-active={index === 0 ? "true" : "false"}
                onMouseEnter={() => activateProjectRef.current(index)}
                onFocus={() => activateProjectRef.current(index)}
                className="border-surface bg-surface relative overflow-hidden rounded-[1.75rem] border p-[1px] shadow-[0_14px_36px_rgba(17,17,17,0.05)] transition-[transform,box-shadow,border-color,background-color] duration-300 will-change-transform data-[active=true]:-translate-y-1 data-[active=true]:border-black/18 data-[active=true]:bg-white/92 data-[active=true]:shadow-[0_20px_54px_rgba(17,17,17,0.1)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.2)] dark:data-[active=true]:border-white/18 dark:data-[active=true]:bg-white/[0.06] dark:data-[active=true]:shadow-[0_20px_54px_rgba(0,0,0,0.3)]"
              >
                <div className="surface-gradient rounded-[1.7rem] p-5 sm:p-6 lg:p-7">
                  <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:gap-7">
                    <div className="flex items-start justify-between gap-4 lg:block">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/42 dark:text-black/48">
                          Proyecto 0{index + 1}
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[2rem]">
                          {project.title}
                        </h3>
                      </div>

                      <div className="hidden flex-wrap gap-2 lg:flex lg:max-w-[13rem]">
                        {project.services.map((service) => (
                          <span
                            key={service}
                            className="surface-chip rounded-full border px-3 py-1 text-[11px] font-medium text-black/68 dark:text-black/75"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="border-surface overflow-hidden rounded-[1.4rem] border lg:hidden">
                        <img
                          src={project.image}
                          alt={`${project.title} cover`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="surface-chip rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/65 dark:text-black/72">
                          {project.category}
                        </span>
                        <span className="rounded-full border border-transparent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/72 dark:text-black/72">
                          {project.year}
                        </span>
                        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-black/65 dark:text-black/68">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: project.accent }}
                          />
                          {project.metric}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:hidden">
                        {project.services.map((service) => (
                          <span
                            key={service}
                            className="surface-chip rounded-full border px-3 py-1 text-[11px] font-medium text-black/68 dark:text-black/75"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      <p className="max-w-2xl text-base leading-relaxed text-black/68 dark:text-black/70 sm:text-[1.02rem]">
                        {project.summary}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="border-surface bg-surface-strong rounded-[1.35rem] border p-4">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/42 dark:text-black/48">
                            Entregables
                          </p>
                          <p className="text-sm leading-relaxed text-black/72 dark:text-black/72">
                            {project.deliverables}
                          </p>
                        </div>

                        <div className="border-surface bg-surface-strong rounded-[1.35rem] border p-4">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/42 dark:text-black/48">
                            Enfoque
                          </p>
                          <p className="text-sm leading-relaxed text-black/72 dark:text-black/72">
                            {project.focus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
