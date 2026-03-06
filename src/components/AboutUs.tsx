export default function AboutUs() {
    return (
<section id="about" className="reveal-section w-full pt-12 pb-24 px-4 bg-white dark:bg-black mt-8 md:-mt-[40vh] relative z-10 transition-colors duration-300">
    <div className="max-w-5xl mx-auto">
       
        <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="w-full flex justify-center group">
                <img
                    src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=527,fit=crop/YBgbgaENKJcQgKM7/reel1-04-Yyv0vzK10qF4NP6j.jpg"
                    alt="Outliers Team"
                    className="w-full max-w-[375px] h-auto object-cover rounded-xl shadow-2xl shadow-white/5 group-hover:shadow-white/20 transition-all duration-500"
                />
            </div>
            <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight text-gray-800 dark:text-gray-400">¿Quiénes Somos?</h2>
                <p>
                    Somos aliados creativos de marcas una chimba, que saben lo que valen y quieren dejar huella.
                    Si tu marca va con toda, este equipo es para ti.
                    Outliers Design nace en el corazón de Casanare con un sueño claro: usar el diseño como herramienta de transformación.
                    Somos una agencia de diseño gráfico, branding y marketing con enfoque social, que combina estrategia, tecnología e innovación para crear marcas auténticas.
                </p>
                <div className="flex justify-center">
                    <button className=" bg-gray-500 text-black px-6 py-3 rounded-full font-bold hover:bg-[rgb(224,77,96)] hover:text-white transition-colors duration-300 transform hover:scale-105" onClick={() => window.open("https://wa.me/573142320221?text=Hola,+me+gustar%C3%ADa+saber+m%C3%A1s+sobre+los+servicios+de+Outliers+Design", "_blank")}> Contactanos</button>
                </div>
            </div>
           
        </div>
    </div>
</section>
    )
}
