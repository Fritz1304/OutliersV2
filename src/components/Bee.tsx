import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group } from 'three'

const BEE_MODEL_PATH = `${import.meta.env.BASE_URL}models/minecraft_bee.glb`

export default function Bee() {

    const beeModel = useGLTF(BEE_MODEL_PATH)
    const animations = useAnimations(beeModel.animations, beeModel.scene)

    const groupRef = useRef<Group>(null)

    // offsets únicos por abeja
    const timeOffset = useRef(Math.random() * 100)
    const orbitOffset = useRef(Math.random() * Math.PI * 2)
    const speed = useRef(0.5 + Math.random() * 0.5)
    const radiusBase = useRef(1.2 + Math.random() * 0.8)

    useEffect(() =>
    {
        const action = animations.actions["Take 001"]
        if (!action) return

        action.reset().fadeIn(0.5).play()

        return () =>
        {
            action.fadeOut(0.5)
        }

    }, [animations.actions])


    useFrame((state) => {

        if (!groupRef.current) return

        const time = state.clock.elapsedTime * speed.current + timeOffset.current

        const angle = time * 0.7 + orbitOffset.current

        const radius = radiusBase.current + Math.sin(time * 1.8) * 0.25

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        const offsetX = Math.sin(time * 3.5) * 0.2
        const y = 1 + Math.sin(time * 2.2) * 0.25

        groupRef.current.position.set(
            x + offsetX,
            y,
            z
        )

        const lookAt = new THREE.Vector3(
            Math.cos(angle + 0.1) * radius,
            y,
            Math.sin(angle + 0.1) * radius
        )

        groupRef.current.lookAt(lookAt)

    })

    return (
        <group ref={groupRef}>
            <primitive
                object={beeModel.scene}
                scale={3}
            />
        </group>
    )
}

useGLTF.preload(BEE_MODEL_PATH)
