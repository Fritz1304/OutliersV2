import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const DRONE_MODEL_PATH = `${import.meta.env.BASE_URL}models/drone.glb`
const PENCIL_MODEL_PATH = `${import.meta.env.BASE_URL}models/apple_pencil.glb`

export default function ServiceModelsPreloader({
  onReady,
}: {
  onReady: () => void
}) {
  useGLTF(DRONE_MODEL_PATH)
  useGLTF(PENCIL_MODEL_PATH)

  const readyNotifiedRef = useRef(false)

  useEffect(() => {
    if (readyNotifiedRef.current) return

    readyNotifiedRef.current = true
    onReady()
  }, [onReady])

  return null
}

useGLTF.preload(DRONE_MODEL_PATH)
useGLTF.preload(PENCIL_MODEL_PATH)
