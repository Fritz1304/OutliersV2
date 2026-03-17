import { useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

import particlesVertexShader from "../shaders/particles/vertex.glsl"
import particlesFragmentShader from "../shaders/particles/fragment.glsl"

gsap.registerPlugin(ScrollTrigger)

// ───────────────────────────────────────────────────
// Displacement data (created outside React for purity)
// ───────────────────────────────────────────────────
interface DisplacementData {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  glowImage: HTMLImageElement
  texture: THREE.CanvasTexture
  interactivePlane: THREE.Mesh
  raycaster: THREE.Raycaster
  screenCursor: THREE.Vector2
  canvasCursor: THREE.Vector2
  canvasCursorPrevious: THREE.Vector2
}

function createDisplacement(): DisplacementData {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128

  const context = canvas.getContext("2d")!
  context.fillRect(0, 0, canvas.width, canvas.height)

  const glowImage = new Image()
  glowImage.src = "/particles/glow.png"

  const texture = new THREE.CanvasTexture(canvas)

  const interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide })
  )
  interactivePlane.visible = false

  return {
    canvas,
    context,
    glowImage,
    texture,
    interactivePlane,
    raycaster: new THREE.Raycaster(),
    screenCursor: new THREE.Vector2(9999, 9999),
    canvasCursor: new THREE.Vector2(9999, 9999),
    canvasCursorPrevious: new THREE.Vector2(9999, 9999),
  }
}

// Pre-built geometry (created outside React for purity)
function createParticlesData() {
  const gridSize = 128
  const geo = new THREE.PlaneGeometry(10, 10, gridSize, gridSize)
  geo.setIndex(null)
  geo.deleteAttribute("normal")

  const count = geo.attributes.position.count
  const intensities = new Float32Array(count)
  const angles = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    intensities[i] = Math.random()
    angles[i] = Math.random() * Math.PI * 2
  }

  geo.setAttribute("aIntensity", new THREE.BufferAttribute(intensities, 1))
  geo.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1))

  return geo
}

// Singleton instances (lazy init)
let _displacement: DisplacementData | null = null
let _geometry: THREE.PlaneGeometry | null = null

function getDisplacement(): DisplacementData {
  if (!_displacement) _displacement = createDisplacement()
  return _displacement
}

function getGeometry(): THREE.PlaneGeometry {
  if (!_geometry) _geometry = createParticlesData()
  return _geometry
}

// ───────────────────────────────────────────────────
// Inner R3F scene: Particles + cursor displacement
// ───────────────────────────────────────────────────
function ParticlesScene() {
  const { scene, camera, size } = useThree()
  const displacement = getDisplacement()
  const geometry = getGeometry()

  // Load picture texture
  const pictureTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load("/particles/picture-1.png")
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Shader material
  const shaderMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  if (shaderMaterialRef.current === null) {
    shaderMaterialRef.current = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(
            size.width * Math.min(window.devicePixelRatio, 2),
            size.height * Math.min(window.devicePixelRatio, 2)
          ),
        },
        uPictureTexture: { value: pictureTexture },
        uDisplacementTexture: { value: displacement.texture },
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    })
  }

  const shaderMaterial = shaderMaterialRef.current

  // Add interactive plane to scene
  useEffect(() => {
    scene.add(displacement.interactivePlane)
    return () => {
      scene.remove(displacement.interactivePlane)
    }
  }, [scene, displacement.interactivePlane])

  // Pointer move handler
  useEffect(() => {
    const handler = (event: PointerEvent) => {
      displacement.screenCursor.x =
        (event.clientX / window.innerWidth) * 2 - 1
      displacement.screenCursor.y =
        -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("pointermove", handler)
    return () => window.removeEventListener("pointermove", handler)
  }, [displacement])

  // Update resolution on resize
  useEffect(() => {
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    shaderMaterial.uniforms.uResolution.value.set(
      size.width * pixelRatio,
      size.height * pixelRatio
    )
  }, [size, shaderMaterial])

  // Frame loop — cursor displacement
  useFrame(() => {
    // Raycaster
    displacement.raycaster.setFromCamera(
      displacement.screenCursor,
      camera as unknown as THREE.Camera
    )
    const intersections = displacement.raycaster.intersectObject(
      displacement.interactivePlane as unknown as THREE.Object3D
    )

    if (intersections.length) {
      const uv = intersections[0].uv!
      displacement.canvasCursor.x = uv.x * displacement.canvas.width
      displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height
    }

    // Displacement canvas update
    const ctx = displacement.context

    // Fade out
    ctx.globalCompositeOperation = "source-over"
    ctx.globalAlpha = 0.02
    ctx.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

    // Speed-based alpha
    const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
      displacement.canvasCursor
    )
    displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
    const alpha = Math.min(cursorDistance * 0.05, 1)

    // Draw glow
    const glowSize = displacement.canvas.width * 0.25
    ctx.globalCompositeOperation = "lighten"
    ctx.globalAlpha = alpha
    ctx.drawImage(
      displacement.glowImage,
      displacement.canvasCursor.x - glowSize * 0.5,
      displacement.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    )

    // Update texture
    displacement.texture.needsUpdate = true
  })

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <points geometry={geometry as any} material={shaderMaterial as any} />
  )
}

// ───────────────────────────────────────────────────
// Main exported section component
// ───────────────────────────────────────────────────
export default function ParticlesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current || !textRef.current) return

      const container = containerRef.current
      const text = textRef.current

      gsap.set(text, { opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        },
      })

      // Text fades in
      tl.fromTo(
        text,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 }
      )

      // Hold
      tl.to({}, { duration: 1 })

      // Text fades out
      tl.to(text, { opacity: 0, y: -60, duration: 0.5 })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* 3D Canvas — particles */}
      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, 18], fov: 35 }}
          gl={{ antialias: true }}
          style={{ background: "transparent" }}
        >
          <ParticlesScene />
        </Canvas>
      </div>

      {/* Text overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div
            ref={textRef}
            className="flex flex-col items-center justify-center text-center"
          >
            <h2
              className="text-5xl md:text-8xl font-bold uppercase tracking-tight leading-none text-white"
              style={{ textShadow: "0 0 40px rgba(0, 255, 255, 0.3)" }}
            >
              Experiencias
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #00ffff, #ff00ff, #ff6600)",
                }}
              >
                Digitales
              </span>
            </h2>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-lg font-light">
              Creamos universos interactivos que conectan tu marca con el
              futuro. Cada píxel cuenta una historia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
