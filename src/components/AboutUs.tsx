export default function AboutUs() {
  const teamImage = {
    src: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=527,fit=crop/YBgbgaENKJcQgKM7/reel1-04-Yyv0vzK10qF4NP6j.jpg",
    width: 375,
    height: 527,
  } as const

  return (
    <section
      id="about"
      className="bg-page reveal-section relative z-10 -mt-10 w-full px-4 pt-20 pb-20 transition-colors duration-300 sm:px-6 md:-mt-14 md:pt-24 md:pb-24"
    >
      <div className="bg-page-fade-top pointer-events-none absolute inset-x-0 top-0 h-24" />
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="group order-2 flex w-full justify-center md:order-1">
            <div className="w-full max-w-[22rem] overflow-hidden rounded-xl shadow-2xl shadow-white/5 transition-all duration-500 group-hover:shadow-white/20 sm:max-w-[26rem] md:max-w-[30rem]">
              <img
                src={teamImage.src}
                alt="Outliers Team"
                width={teamImage.width}
                height={teamImage.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 space-y-5 text-base text-[rgb(240,239,235)] sm:text-lg md:order-2 md:space-y-6">
            <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-[rgb(240,239,235)] md:mb-12 md:text-left md:text-4xl">¿Quiénes Somos?</h2>
            <p className="leading-relaxed">
              Somos aliados creativos de marcas una chimba, que saben lo que valen y quieren dejar huella.
              Si tu marca va con toda, este equipo es para ti.
              Outliers Design nace en el corazón de Casanare con un sueño claro: usar el diseño como herramienta de transformación.
              Somos una agencia de diseño gráfico, branding y marketing con enfoque social, que combina estrategia, tecnología e innovación para crear marcas auténticas.
            </p>
            <div className="flex justify-center md:justify-start">
              <button className="bg-gray-500 px-6 py-3 text-sm font-bold text-black transition-colors duration-300 hover:scale-105 hover:bg-[rgb(224,77,96)] hover:text-white sm:text-base rounded-full transform" onClick={() => window.open("https://wa.me/573142320221?text=Hola,+me+gustar%C3%ADa+saber+m%C3%A1s+sobre+los+servicios+de+Outliers+Design", "_blank")}> Contactanos</button>
            </div>
          </div>
        </div>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="group order-2 flex w-full justify-center md:order-1">
            <div className="w-full max-w-[22rem] overflow-hidden rounded-xl shadow-2xl shadow-white/5 transition-all duration-500 group-hover:shadow-white/20 sm:max-w-[26rem] md:max-w-[30rem]">
              <img
                src={teamImage.src}
                alt="Outliers Team"
                width={teamImage.width}
                height={teamImage.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 space-y-5 text-base text-[rgb(240,239,235)] sm:text-lg md:order-2 md:space-y-6">
            <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-[rgb(240,239,235)] md:mb-12 md:text-left md:text-4xl">¿Quiénes Somos?</h2>
            <p className="leading-relaxed">
              Somos aliados creativos de marcas una chimba, que saben lo que valen y quieren dejar huella.
              Si tu marca va con toda, este equipo es para ti.
              Outliers Design nace en el corazón de Casanare con un sueño claro: usar el diseño como herramienta de transformación.
              Somos una agencia de diseño gráfico, branding y marketing con enfoque social, que combina estrategia, tecnología e innovación para crear marcas auténticas.
            </p>
            <div className="flex justify-center md:justify-start">
              <button className="bg-gray-500 px-6 py-3 text-sm font-bold text-black transition-colors duration-300 hover:scale-105 hover:bg-[rgb(224,77,96)] hover:text-white sm:text-base rounded-full transform" onClick={() => window.open("https://wa.me/573142320221?text=Hola,+me+gustar%C3%ADa+saber+m%C3%A1s+sobre+los+servicios+de+Outliers+Design", "_blank")}> Contactanos</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
