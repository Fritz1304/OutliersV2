import { PresentationControls,Environment, Float, Html, useGLTF } from '@react-three/drei'

const OBJECT_SCALE = 0.5
const screenConfig = {
  position: [-0.6, 1.5, -0.69] as [number, number, number],
  rotation: [-1.6, 0, 0] as [number, number, number],
  distanceFactor: 1.17,
}

export default function TabletScene() {
  const tablet = useGLTF(`${import.meta.env.BASE_URL}models/Ipad.glb`)

  return (
    <>
      <color args={['rgb(138, 153, 157)']} attach="background" />

      <Environment preset="city" />

      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        damping={0.1}
        snap
      >
        <Float rotationIntensity={0.2}>
          <primitive
            object={tablet.scene}
            scale={OBJECT_SCALE}
            position={[0.5, -0.2, 0]}
            rotation-x={-1.6}
            rotation-z={-0.5}
          >
            <Html
              transform
              scale={OBJECT_SCALE}
              wrapperClass="htmlScreen"
              distanceFactor={screenConfig.distanceFactor}
              position={screenConfig.position}
              rotation={screenConfig.rotation}
            >
              {/* <iframe
                src={`${import.meta.env.BASE_URL}OU.pdf`}
                title="Portfolio tablet preview"
                style={{
                  width: '1930px',
                  height: '2520px',
                  border: 0,
                  borderRadius: '20px',
                  background: '#000000',
                }} */}
              {/* <iframe /> */}
            </Html>
          </primitive>

        </Float>
      </PresentationControls>
    </>
  )
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/Ipad.glb`)
