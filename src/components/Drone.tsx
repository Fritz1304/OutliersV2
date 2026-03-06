import { useRef, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import { Group } from "three"

interface DroneProps {
  scale?: number
}

export default function Drone({ scale = 0.5 }: DroneProps) {

  const droneRef = useRef<Group>(null)

  // 1. Extraemos las 'animations' junto con la escena
  const { scene, animations } = useGLTF("/models/drone.glb")

  // 2. Usamos el hook useAnimations para controlar esas animaciones
  // @ts-expect-error - There is a slight type mismatch between three and @types/three minor versions
  const { actions } = useAnimations(animations, droneRef)

  useEffect(() => {
    // 3. Iterar y reproducir todas las acciones/animaciones que vienen en el archivo
    if (actions) {
      Object.keys(actions).forEach((key) => {
        actions[key]?.play()
      })
    }
  }, [actions])

  return (
    <primitive
      ref={droneRef}
      object={scene}
      scale={scale}
      position={[0, 0, 0]}
    />
  )
}