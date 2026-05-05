import FlowerComponent from "./FlowerComponent"
// import TabletScene from "./TabletScene"
import MacbookScene from "./MacbookScene"
import { Canvas } from "@react-three/fiber"

export default function PortFolio() {
    return (
        <section className="bg-page relative flex min-h-screen w-full items-center overflow-hidden px-4 py-20 text-[rgb(240,239,235)] transition-colors duration-300 sm:px-6 md:px-8">
            <div className="relative z-10 mx-auto grid w-full max-w-9xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div className="space-y-5">
                    <FlowerComponent />
                    <h2 className="text-4xl font-semibold tracking-tight text-[rgb(240,239,235)] sm:text-5xl md:text-6xl">
                        PortFolio
                    </h2>
                    <p className="max-w-md text-base leading-relaxed text-[rgb(240,239,235)]/80 sm:text-lg">
                        Probando la escena del tablet dentro de un canvas aislado para mantener estable la animacion del drone.
                    </p>
                </div>
            </div>

         <div className="canvas-container relative h-[800px] w-full overflow-hidden rounded-lg border border-white/10 bg-black/20 sm:h-[850px] lg:h-[900px]">
                     <Canvas
                        className="r3f"
                        camera={ {
                            fov: 45,
                            near: 0.1,
                            far: 2000,
                            position: [ -3, 1.5, 4 ]
                        } }
                    >
                        <MacbookScene />
                    </Canvas>
        </div>
        </section>
    )
}
