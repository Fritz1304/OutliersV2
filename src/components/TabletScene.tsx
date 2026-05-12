import {
  Environment,
  Float,
  Html,
  PresentationControls,
  useGLTF,
} from "@react-three/drei"

import { useThree } from "@react-three/fiber"

export default function TabletScene() {
  const tablet = useGLTF(
    `${import.meta.env.BASE_URL}models/Ipad.glb`
  )

  const { viewport } = useThree()

  /*
    Responsive REAL:
    escalamos TODO el mundo 3D,
    NO el iframe.
  */
  const scale =
    viewport.width < 8
      ? 0.28
      : viewport.width < 12
      ? 0.38
      : 0.5

  return (
    <>
      <color attach="background" args={["#8a999d"]} />

      <Environment preset="city" />

      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        damping={0.1}
        snap
      >
        <Float rotationIntensity={0.15}>
          {/* 
            IMPORTANTE:
            TODA la rotación va aquí.
            Html y modelo comparten coordenadas.
          */}
          <group
            scale={scale}
            position={[0.5, -0.2, 0]}
            rotation={[-1.6, 0, -0.5]}
          >
            {/* MODELO */}
            <primitive object={tablet.scene} />

            {/* PANTALLA */}
            <Html
              transform
              distanceFactor={3}
              /*
                AJUSTA SOLO ESTO
                si quieres mover la pantalla
              */
              position={[0, 1.94, 1]}
              rotation={[Math.PI / 2, 0, 0]}
              style={{
                width: "720px",
                height: "460px",
                pointerEvents: "auto",
              }}
            >
              <div
                style={{
                  width: "740px",
                  height: "900px",
                  overflow: "hidden",
                  borderRadius: "32px"
                }}
              >
                <iframe
                  src="https://bruno-simon.com/html/"
                  title="Tablet Screen"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                    background: "white",
                  }}
                />
              </div>
            </Html>
          </group>
        </Float>
      </PresentationControls>
    </>
  )
}

useGLTF.preload(
  `${import.meta.env.BASE_URL}models/Ipad.glb`
)