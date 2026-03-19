import { useRef, useState, useMemo } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import vertexShader from '../shaders/particles/vertex.glsl?raw';
import fragmentShader from '../shaders/particles/fragment.glsl?raw';

gsap.registerPlugin(ScrollTrigger);

const Particles = ({ scrollProgressRef }: { scrollProgressRef: RefObject<number> }) => {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Custom hook pattern to update from GSAP Context (via window event for simplification with ScrollTrigger or passing a ref)
  useFrame(() => {
     if (materialRef.current) {
        materialRef.current.uniforms.uScrollProgress.value = scrollProgressRef.current;
        materialRef.current.uniforms.uResolution.value.set(size.width * window.devicePixelRatio, size.height * window.devicePixelRatio);
     }
  });

  // Create Displacement Canvas Hook Structure using useMemo to avoid pure React linter errors
  const displacement = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d')!;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const glowImage = new Image();
    glowImage.src = import.meta.env.BASE_URL + 'particles/glow.png'; // Must be in public/particles/
    
    const texture = new THREE.CanvasTexture(canvas);
    
    return { 
      canvas, 
      context, 
      glowImage, 
      texture, 
      cursor: new THREE.Vector2(9999, 9999), 
      previousCursor: new THREE.Vector2(9999, 9999) 
    };
  }, []);

  const [geometryInfo] = useState(() => {
    const geometry = new THREE.PlaneGeometry(10, 10, 150, 150);
    geometry.setIndex(null);
    geometry.deleteAttribute('normal');
    
    const count = geometry.attributes.position.count;
    const intensitiesArray = new Float32Array(count);
    const anglesArray = new Float32Array(count);
    
    for(let i = 0; i < count; i++) {
        intensitiesArray[i] = Math.random();
        anglesArray[i] = Math.random() * Math.PI * 2;
    }
    
    geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1));
    geometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1));
    
    return geometry;
  }); // using useState to avoid React strict mode useMemo Math.random warning

  const uniforms = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const pictureTexture = textureLoader.load(import.meta.env.BASE_URL + 'particles/LogoOutliers.jpg');
    
    return {
        uResolution: new THREE.Uniform(new THREE.Vector2(size.width * window.devicePixelRatio, size.height * window.devicePixelRatio)),
        uPictureTexture: new THREE.Uniform(pictureTexture),
        uDisplacementTexture: new THREE.Uniform(displacement.texture),
        uScrollProgress: new THREE.Uniform(0)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  useFrame(() => {
    // Update Displacement Canvas continuously fade out
    displacement.context.globalCompositeOperation = 'source-over';
    displacement.context.globalAlpha = 0.02;
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

    const cursorDistance = displacement.previousCursor.distanceTo(displacement.cursor);
    displacement.previousCursor.copy(displacement.cursor);
    const alpha = Math.min(cursorDistance * 0.05, 1);
    
    const glowSize = displacement.canvas.width * 0.25;
    displacement.context.globalCompositeOperation = 'lighten';
    displacement.context.globalAlpha = alpha;
    
    if (displacement.glowImage.complete) {
        displacement.context.drawImage(
            displacement.glowImage,
            displacement.cursor.x - glowSize * 0.5,
            displacement.cursor.y - glowSize * 0.5,
            glowSize,
            glowSize
        );
    }
    
      displacement.texture.needsUpdate = true;
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
     if (e.uv && displacement) {
         displacement.cursor.x = e.uv.x * displacement.canvas.width;
         displacement.cursor.y = (1 - e.uv.y) * displacement.canvas.height;
     }
  };

  return (
    <>
      <points>
        <primitive object={geometryInfo} attach="geometry" />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {/* Interactive invisible plane to capture raycast UV */}
      <mesh visible={false} onPointerMove={handlePointerMove}>
         <planeGeometry args={[10, 10]} />
      </mesh>
    </>
  );
};

export default function ParticlesHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useGSAP(() => {
    const container = containerRef.current;
    const wrapper = scrollWrapperRef.current;
    if (!container || !wrapper) return;

    // Calculate how far to translate wrapper horizontally based on its children
    const totalPanels = wrapper.querySelectorAll('.horizontal-panel').length;
    
    gsap.to(wrapper, {
      xPercent: -100 * (totalPanels - 1) / totalPanels,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        // The total scroll distance is essentially panelCount * windowHeight
        end: () => `+=${window.innerWidth * totalPanels}`,
        onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
        }
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#181818] overflow-hidden">
      
      {/* 3D Canvas Background fixed behind the horizontal panels */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 18], fov: 35 }}>
           <Particles scrollProgressRef={scrollProgressRef} />
        </Canvas>
      </div>

      {/* Horizontal Scrolling Content Wrapper */}
      <div 
         ref={scrollWrapperRef} 
         className="absolute inset-0 z-10 flex h-full pointer-events-none" 
         style={{ width: '300vw' }} // 3 panels = 300vw
      >
        {/* Panel 1 */}
        <div className="horizontal-panel w-screen h-full flex items-center justify-start px-12 md:px-24">
            <div className="text-white max-w-lg pointer-events-auto">
               <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6 mt-32 md:mt-0">Descubre</h2>
               <p className="text-xl text-gray-400 font-light mix-blend-difference">
                 Explora nuevas perspectivas a medida que las partículas se unen para revelar una visión innovadora. Desliza hacia abajo para descubrir más.
               </p>
            </div>
        </div>

        {/* Panel 2 */}
        <div className="horizontal-panel w-screen h-full flex items-center justify-center px-12 md:px-24">
            <div className="text-white max-w-lg text-center pointer-events-auto">
               <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">Creatividad</h2>
               <p className="text-xl text-gray-400 font-light mix-blend-difference">
                 Transformamos ideas en experiencias inmersivas que dejan una marca duradera en la mente de tus usuarios.
               </p>
            </div>
        </div>

        {/* Panel 3 */}
        <div className="horizontal-panel w-screen h-full flex items-center justify-end px-12 md:px-24">
            <div className="text-white max-w-lg text-right pointer-events-auto">
               <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">Impacto</h2>
               <p className="text-xl text-gray-400 font-light mix-blend-difference">
                 Cada partícula cuenta una historia. Conecta con tu audiencia de una forma dinámica, moderna y cautivadora.
               </p>
            </div>
        </div>

      </div>
      
    </section>
  );
}
