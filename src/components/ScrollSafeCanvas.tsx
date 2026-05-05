import { Canvas } from "@react-three/fiber"
import { useEffect, type ComponentProps, type ReactNode } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type CanvasProps = ComponentProps<typeof Canvas>

type ScrollSafeCanvasProps = Omit<CanvasProps, "children" | "onCreated" | "style"> & {
  children: ReactNode
  onCreated?: CanvasProps["onCreated"]
  style?: CanvasProps["style"]
}

function refreshScrollTrigger() {
  window.requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })
}

export default function ScrollSafeCanvas({
  children,
  onCreated,
  style,
  ...canvasProps
}: ScrollSafeCanvasProps) {
  useEffect(() => {
    refreshScrollTrigger()
  }, [])

  return (
    <Canvas
      {...canvasProps}
      style={{ touchAction: "pan-y", ...style }}
      onCreated={(state) => {
        onCreated?.(state)
        refreshScrollTrigger()
      }}
    >
      {children}
    </Canvas>
  )
}
