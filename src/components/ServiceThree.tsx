export default function ServiceThree() {
  const service = {
    title: 'BRAND EXPERIENCE',
    slogan: 'Cada marca es una historia',
    description:
      'Llevamos tu marca a nuevas dimensiones con producciones CGI hiperrealistas y simulaciones de vanguardia.',
    bullets: [
      'Modelado y Texturizado de alta calidad.',
      'Simulaciones dinámicas de fluidos y físicas.',
      'Integración con imagen real y VFX.',
    ],
    notes: ['CGI Hyperreal', 'VFX', 'Simulaciones']
  }

  return (
    <section className="bg-page relative mt-20 w-full overflow-hidden px-4 py-20 text-[rgb(240,239,235)] transition-colors duration-300 sm:px-6 md:mt-0 md:px-8 lg:px-10">
      
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-20 h-40 w-40 rounded-full bg-[#fbbc05]/10 blur-3xl dark:bg-[#fbbc05]/15" />
        <div className="absolute bottom-16 right-[8%] h-48 w-48 rounded-full bg-black/6 blur-3xl dark:bg-black/5" />
      </div>
       <div className="absolute top-10 right-10 z-20">
        <div className="relative bg-[rgb(224,88,108)] px-5 py-2 rounded-xl shadow-lg">
          <p className="text-lg italic tracking-wide text-[rgb(240,239,235)]">
            {service.slogan}
          </p>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[rgb(224,88,108)] rotate-45"></div>
        </div>
    </div>

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] lg:items-center relative z-20">
        
        <div className="service-copy max-w-2xl">
          <h3 className="max-w-xl text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
            {service.title}
          </h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[rgb(240,239,235)] sm:text-lg">
            {service.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {service.notes.map((note) => (
              <span
                key={note}
                className="service-note rounded-full border border-black/10 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(240,239,235)] backdrop-blur-sm dark:border-black/10 dark:bg-white/45"
              >
                {note}
              </span>
            ))}
          </div>
          <ul className="mt-8 space-y-4">
            {service.bullets.map((bullet, bulletIndex) => (
              <li
                key={bullet}
                className="flex items-start gap-4 rounded-[1.5rem] border border-black/8 bg-white/45 px-5 py-4 backdrop-blur-sm dark:border-black/8 dark:bg-white/35"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fbbc05] text-xs font-bold text-white">
                  3.{bulletIndex + 1}
                </span>
                <span className="text-sm leading-relaxed text-[rgb(240,239,235)] sm:text-base">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
