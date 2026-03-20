import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import vertexShader from '../shaders/particles/vertex.glsl?raw';
import fragmentShader from '../shaders/particles/fragment.glsl?raw';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 70000;
const HOVER_ACTIVE_FROM_X = 0.12;
const TEXT_FADE_RANGE = 0.23;
const MORPH_WINDOW_START = 0.18;
const MORPH_WINDOW_END = 0.78;
const MODEL_PATHS = {
  drone: `${import.meta.env.BASE_URL}models/drone.glb`,
  pencil: `${import.meta.env.BASE_URL}models/apple_pencil.glb`,
} as const;

const COPY_BLOCKS = [
  {
    title: 'Drone',
    body: 'El dron ya aparece construido en la derecha mientras el primer mensaje queda estable en la izquierda.',
  },
  {
    title: 'Pencil Morph',
    body: 'Durante el scroll horizontal las particulas fluyen y reorganizan la silueta hasta formar el nuevo objeto.',
  },
  {
    title: 'Drone Return',
    body: 'La nube vuelve a compactarse en el dron para dejar lista la seccion para futuros modelos.',
  },
] as const;

type ModelKey = keyof typeof MODEL_PATHS;

type SamplePoint = {
  position: THREE.Vector3;
  color: THREE.Color;
};

type ModelCloud = {
  points: SamplePoint[];
};

type ParticleData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  randoms: Float32Array;
  targetPositions: Float32Array[];
  targetColors: Float32Array[];
};

type HoverState = {
  active: boolean;
  x: number;
  y: number;
};

type TextureSamplerData = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
};

type MorphState = {
  fromIndex: number;
  toIndex: number;
  mix: number;
  fluid: number;
};

type TargetConfig = {
  modelKey: ModelKey;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
};

type HoverBounds = {
  xRange: [number, number];
  yRange: [number, number];
};

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const getTextVisibility = (index: number, progress: number) => {
  const segmentCount = Math.max(COPY_BLOCKS.length - 1, 1);
  const center = index / segmentCount;
  const visibility = clamp01(1 - Math.abs(progress - center) / TEXT_FADE_RANGE);
  return smoothstep(visibility);
};

const getTargets = (isMobile: boolean): TargetConfig[] =>
  isMobile
    ? [
        {
          modelKey: 'drone',
          position: new THREE.Vector3(2.15, -0.95, 0),
          rotation: new THREE.Euler(-0.06, 0.35, 0.02),
          scale: 3.35,
        },
        {
          modelKey: 'pencil',
          position: new THREE.Vector3(2.05, -1.1, 0.05),
          rotation: new THREE.Euler(0.18, -1.08, 0.92),
          scale: 4.05,
        },
        {
          modelKey: 'drone',
          position: new THREE.Vector3(2.2, -0.92, -0.05),
          rotation: new THREE.Euler(0.03, 3.96, -0.08),
          scale: 3.25,
        },
      ]
    : [
        {
          modelKey: 'drone',
          position: new THREE.Vector3(5.2, 0.24, 0),
          rotation: new THREE.Euler(-0.08, 0.5, 0.03),
          scale: 4.65,
        },
        {
          modelKey: 'pencil',
          position: new THREE.Vector3(5.05, 0.02, 0.05),
          rotation: new THREE.Euler(0.18, -1.08, 0.92),
          scale: 5.7,
        },
        {
          modelKey: 'drone',
          position: new THREE.Vector3(5.28, 0.18, -0.06),
          rotation: new THREE.Euler(0.04, 3.96, -0.08),
          scale: 4.5,
        },
      ];

const getHoverBounds = (isMobile: boolean): HoverBounds =>
  isMobile
    ? {
        xRange: [0.65, 3.7],
        yRange: [-3.1, 1.4],
      }
    : {
        xRange: [3.1, 7.35],
        yRange: [-2.6, 2.6],
      };

const getMorphState = (progress: number, targetCount: number): MorphState => {
  const segmentCount = targetCount - 1;
  if (segmentCount <= 0) {
    return { fromIndex: 0, toIndex: 0, mix: 0, fluid: 0 };
  }

  if (progress >= 1) {
    return {
      fromIndex: targetCount - 1,
      toIndex: targetCount - 1,
      mix: 0,
      fluid: 0,
    };
  }

  const scaledProgress = clamp01(progress) * segmentCount;
  const segmentIndex = Math.min(Math.floor(scaledProgress), segmentCount - 1);
  const localProgress = scaledProgress - segmentIndex;

  if (localProgress <= MORPH_WINDOW_START) {
    return {
      fromIndex: segmentIndex,
      toIndex: segmentIndex,
      mix: 0,
      fluid: 0,
    };
  }

  if (localProgress >= MORPH_WINDOW_END) {
    return {
      fromIndex: segmentIndex + 1,
      toIndex: segmentIndex + 1,
      mix: 0,
      fluid: 0,
    };
  }

  const normalized = clamp01(
    (localProgress - MORPH_WINDOW_START) / (MORPH_WINDOW_END - MORPH_WINDOW_START)
  );
  const mix = smoothstep(normalized);

  return {
    fromIndex: segmentIndex,
    toIndex: segmentIndex + 1,
    mix,
    fluid: Math.sin(normalized * Math.PI),
  };
};

const createTextureSampler = (texture?: THREE.Texture | null): TextureSamplerData | null => {
  const image = texture?.image as
    | (CanvasImageSource & {
        width?: number;
        height?: number;
        videoWidth?: number;
        videoHeight?: number;
        naturalWidth?: number;
        naturalHeight?: number;
      })
    | undefined;
  if (!image) return null;

  const width = image.width ?? image.videoWidth ?? image.naturalWidth;
  const height = image.height ?? image.videoHeight ?? image.naturalHeight;
  if (!width || !height) return null;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);

  return {
    context,
    width,
    height,
  };
};

const getTextureColorAtUv = (textureSampler: TextureSamplerData, uv: THREE.Vector2) => {
  const wrappedU = THREE.MathUtils.euclideanModulo(uv.x, 1);
  const wrappedV = THREE.MathUtils.euclideanModulo(uv.y, 1);
  const x = Math.min(textureSampler.width - 1, Math.floor(wrappedU * textureSampler.width));
  const y = Math.min(
    textureSampler.height - 1,
    Math.floor((1 - wrappedV) * textureSampler.height)
  );
  const pixel = textureSampler.context.getImageData(x, y, 1, 1).data;

  return new THREE.Color(pixel[0] / 255, pixel[1] / 255, pixel[2] / 255).convertSRGBToLinear();
};

const sampleModelCloud = (sourceScene: THREE.Object3D): ModelCloud => {
  const scene = clone(sourceScene);
  scene.updateMatrixWorld(true);

  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshes.push(child as THREE.Mesh);
    }
  });

  if (meshes.length === 0) {
    throw new Error('No meshes were found in model.');
  }

  const weightedMeshes = meshes.map((mesh) => {
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox ?? new THREE.Box3();
    const size = new THREE.Vector3();
    box.getSize(size);
    const weight = Math.max(size.x * size.y * size.z, 0.001);
    return { mesh, weight };
  });

  const totalWeight = weightedMeshes.reduce((sum, entry) => sum + entry.weight, 0);
  const samplers = weightedMeshes.map((entry) => ({
    mesh: entry.mesh,
    sampler: new MeshSurfaceSampler(entry.mesh).build(),
    count: Math.max(1, Math.round((entry.weight / totalWeight) * PARTICLE_COUNT)),
  }));

  const sampledPoints: SamplePoint[] = [];
  const tempPosition = new THREE.Vector3();
  const tempNormal = new THREE.Vector3();
  const tempColor = new THREE.Color();
  const tempUv = new THREE.Vector2();

  samplers.forEach(({ mesh, sampler, count }) => {
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const baseColor =
      material && 'color' in material
        ? ((material.color as THREE.Color) ?? new THREE.Color('#ffffff'))
        : new THREE.Color('#ffffff');
    const textureSampler =
      material && 'map' in material
        ? createTextureSampler((material.map as THREE.Texture | null | undefined) ?? null)
        : null;
    const hasVertexColors = !!mesh.geometry.getAttribute('color');

    for (let i = 0; i < count && sampledPoints.length < PARTICLE_COUNT; i += 1) {
      sampler.sample(tempPosition, tempNormal, tempColor, tempUv);
      mesh.localToWorld(tempPosition);

      const sampledColor = hasVertexColors ? tempColor.clone() : baseColor.clone();
      if (textureSampler) {
        sampledColor.multiply(getTextureColorAtUv(textureSampler, tempUv));
      }

      sampledPoints.push({
        position: tempPosition.clone(),
        color: sampledColor,
      });
    }
  });

  while (sampledPoints.length < PARTICLE_COUNT) {
    const fallback = sampledPoints[sampledPoints.length % sampledPoints.length];
    sampledPoints.push({
      position: fallback.position.clone(),
      color: fallback.color.clone(),
    });
  }

  const bounds = new THREE.Box3();
  sampledPoints.forEach((point) => bounds.expandByPoint(point.position));
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const normalizeScale = 1 / Math.max(size.x, size.y, size.z, 0.001);

  return {
    points: sampledPoints
      .slice(0, PARTICLE_COUNT)
      .map((point) => ({
        position: point.position.clone().sub(center).multiplyScalar(normalizeScale),
        color: point.color.clone(),
      }))
      .sort((a, b) => {
        if (a.position.z !== b.position.z) return a.position.z - b.position.z;
        if (a.position.y !== b.position.y) return a.position.y - b.position.y;
        return a.position.x - b.position.x;
      }),
  };
};

const buildParticleData = (
  modelScenes: Record<ModelKey, THREE.Object3D>,
  targets: TargetConfig[]
): ParticleData => {
  const modelClouds = {
    drone: sampleModelCloud(modelScenes.drone),
    pencil: sampleModelCloud(modelScenes.pencil),
  } satisfies Record<ModelKey, ModelCloud>;

  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const randoms = new Float32Array(PARTICLE_COUNT * 3);
  const targetPositions = targets.map(() => new Float32Array(PARTICLE_COUNT * 3));
  const targetColors = targets.map(() => new Float32Array(PARTICLE_COUNT * 3));

  targets.forEach((target, targetIndex) => {
    const cloud = modelClouds[target.modelKey];
    const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(target.rotation);
    const scaleMatrix = new THREE.Matrix4().makeScale(target.scale, target.scale, target.scale);
    const translationMatrix = new THREE.Matrix4().makeTranslation(
      target.position.x,
      target.position.y,
      target.position.z
    );
    const transformMatrix = new THREE.Matrix4()
      .multiplyMatrices(translationMatrix, rotationMatrix)
      .multiply(scaleMatrix);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      const point = cloud.points[i % cloud.points.length];
      const transformedPoint = point.position.clone().applyMatrix4(transformMatrix);

      targetPositions[targetIndex][i3] = transformedPoint.x;
      targetPositions[targetIndex][i3 + 1] = transformedPoint.y;
      targetPositions[targetIndex][i3 + 2] = transformedPoint.z;
      targetColors[targetIndex][i3] = point.color.r;
      targetColors[targetIndex][i3 + 1] = point.color.g;
      targetColors[targetIndex][i3 + 2] = point.color.b;
    }
  });

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const i3 = i * 3;

    positions[i3] = targetPositions[0][i3];
    positions[i3 + 1] = targetPositions[0][i3 + 1];
    positions[i3 + 2] = targetPositions[0][i3 + 2];

    colors[i3] = targetColors[0][i3];
    colors[i3 + 1] = targetColors[0][i3 + 1];
    colors[i3 + 2] = targetColors[0][i3 + 2];

    sizes[i] = 0.9 + Math.random() * 1.05;
    randoms[i3] = Math.random() * 2 - 1;
    randoms[i3 + 1] = Math.random() * 2 - 1;
    randoms[i3 + 2] = Math.random() * 2 - 1;
  }

  return {
    positions,
    colors,
    sizes,
    randoms,
    targetPositions,
    targetColors,
  };
};

const Particles = ({
  scrollProgressRef,
  hoverRef,
  modelScenes,
  targets,
  hoverBounds,
}: {
  scrollProgressRef: RefObject<number>;
  hoverRef: RefObject<HoverState>;
  modelScenes: Record<ModelKey, THREE.Object3D>;
  targets: TargetConfig[];
  hoverBounds: HoverBounds;
}) => {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particleDataRef = useRef<ParticleData | null>(null);
  const hoverPointRef = useRef(new THREE.Vector2(999, 999));
  const hoverStrengthRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);

  useEffect(() => {
    const data = buildParticleData(modelScenes, targets);
    particleDataRef.current = data;

    geometry.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(data.randoms, 3));
    setIsReady(true);

    return () => {
      geometry.dispose();
    };
  }, [geometry, modelScenes, targets]);

  const uniforms = useMemo(
    () => ({
      uResolution: new THREE.Uniform(
        new THREE.Vector2(
          size.width * window.devicePixelRatio,
          size.height * window.devicePixelRatio
        )
      ),
    }),
    [size]
  );

  useFrame((_, delta) => {
    if (!isReady || !particleDataRef.current) return;

    const progress = clamp01(scrollProgressRef.current);
    const hover = hoverRef.current;
    const hoverShouldBeActive = hover.active && hover.x > HOVER_ACTIVE_FROM_X;
    const hoverTargetX = hoverShouldBeActive
      ? THREE.MathUtils.clamp(
          THREE.MathUtils.mapLinear(
            hover.x,
            HOVER_ACTIVE_FROM_X,
            1,
            hoverBounds.xRange[0],
            hoverBounds.xRange[1]
          ),
          hoverBounds.xRange[0],
          hoverBounds.xRange[1]
        )
      : 999;
    const hoverTargetY = hoverShouldBeActive
      ? THREE.MathUtils.clamp(
          THREE.MathUtils.mapLinear(
            hover.y,
            -1,
            1,
            hoverBounds.yRange[0],
            hoverBounds.yRange[1]
          ),
          hoverBounds.yRange[0],
          hoverBounds.yRange[1]
        )
      : 999;

    hoverPointRef.current.x = THREE.MathUtils.damp(
      hoverPointRef.current.x,
      hoverTargetX,
      8,
      delta
    );
    hoverPointRef.current.y = THREE.MathUtils.damp(
      hoverPointRef.current.y,
      hoverTargetY,
      8,
      delta
    );
    hoverStrengthRef.current = THREE.MathUtils.damp(
      hoverStrengthRef.current,
      hoverShouldBeActive ? 1 : 0,
      9,
      delta
    );

    const { fromIndex, toIndex, mix, fluid } = getMorphState(progress, targets.length);
    const targetPositions = particleDataRef.current.targetPositions;
    const targetColors = particleDataRef.current.targetColors;
    const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute;
    const randomAttribute = geometry.getAttribute('aRandom') as THREE.BufferAttribute;
    const flowPhase = progress * Math.PI * 4.2;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const i3 = i * 3;
      const randomX = randomAttribute.array[i3];
      const randomY = randomAttribute.array[i3 + 1];
      const randomZ = randomAttribute.array[i3 + 2];

      const baseX = THREE.MathUtils.lerp(
        targetPositions[fromIndex][i3],
        targetPositions[toIndex][i3],
        mix
      );
      const baseY = THREE.MathUtils.lerp(
        targetPositions[fromIndex][i3 + 1],
        targetPositions[toIndex][i3 + 1],
        mix
      );
      const baseZ = THREE.MathUtils.lerp(
        targetPositions[fromIndex][i3 + 2],
        targetPositions[toIndex][i3 + 2],
        mix
      );

      const streamX =
        ((0.5 - mix) * 1.15 +
          Math.sin(flowPhase + baseY * 1.2 + randomZ * 3.2) * 0.18 +
          Math.cos(flowPhase * 0.6 + baseZ * 1.8 + randomX * 2.5) * 0.12) *
        fluid;
      const streamY =
        (Math.cos(flowPhase * 0.9 + baseX * 0.8 + randomY * 2.4) * 0.18 +
          Math.sin(flowPhase * 0.55 + baseZ * 1.6 + randomX * 1.8) * 0.08) *
        fluid;
      const streamZ =
        (Math.sin(flowPhase * 0.7 + baseX * 0.55 + randomZ * 3.5) * 0.14 +
          randomY * 0.04) *
        fluid;

      let hoverX = 0;
      let hoverY = 0;
      let hoverZ = 0;

      if (hoverStrengthRef.current > 0.001) {
        const dx = baseX - hoverPointRef.current.x;
        const dy = baseY - hoverPointRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 0.95) * hoverStrengthRef.current;
        const hoverStrength = influence * influence * 0.16;
        const angle = Math.atan2(dy, dx);

        hoverX = Math.cos(angle) * hoverStrength;
        hoverY = Math.sin(angle) * hoverStrength;
        hoverZ = influence * 0.05;
      }

      positionAttribute.array[i3] = baseX + streamX + hoverX;
      positionAttribute.array[i3 + 1] = baseY + streamY + hoverY;
      positionAttribute.array[i3 + 2] = baseZ + streamZ + hoverZ;

      colorAttribute.array[i3] = THREE.MathUtils.lerp(
        targetColors[fromIndex][i3],
        targetColors[toIndex][i3],
        mix
      );
      colorAttribute.array[i3 + 1] = THREE.MathUtils.lerp(
        targetColors[fromIndex][i3 + 1],
        targetColors[toIndex][i3 + 1],
        mix
      );
      colorAttribute.array[i3 + 2] = THREE.MathUtils.lerp(
        targetColors[fromIndex][i3 + 2],
        targetColors[toIndex][i3 + 2],
        mix
      );
    }

    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(
        size.width * window.devicePixelRatio,
        size.height * window.devicePixelRatio
      );
    }
  });

  if (!isReady) return null;

  return (
    <points>
      <primitive object={geometry} attach="geometry" />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        vertexColors
      />
    </points>
  );
};

export default function ParticlesHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const hoverRef = useRef<HoverState>({ active: false, x: 999, y: 999 });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const drone = useGLTF(MODEL_PATHS.drone);
  const pencil = useGLTF(MODEL_PATHS.pencil);

  const modelScenes = useMemo(
    () =>
      ({
        drone: drone.scene,
        pencil: pencil.scene,
      }) satisfies Record<ModelKey, THREE.Object3D>,
    [drone.scene, pencil.scene]
  );

  const targets = useMemo(() => getTargets(isMobile), [isMobile]);
  const hoverBounds = useMemo(() => getHoverBounds(isMobile), [isMobile]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const syncIsMobile = () => setIsMobile(mediaQuery.matches);

    syncIsMobile();
    mediaQuery.addEventListener('change', syncIsMobile);

    return () => {
      mediaQuery.removeEventListener('change', syncIsMobile);
    };
  }, []);

  useGSAP(
    () => {
      const container = containerRef.current;
      const wrapper = scrollWrapperRef.current;
      if (!container || !wrapper) return;

      const totalPanels = COPY_BLOCKS.length;
      const copyBlocks = gsap.utils.toArray<HTMLElement>('.particles-copy', container);

      const applyCopyStyles = (progress: number) => {
        copyBlocks.forEach((copyBlock, index) => {
          const visibility = getTextVisibility(index, progress);
          gsap.set(copyBlock, {
            opacity: visibility,
            y: (1 - visibility) * 24,
            filter: `blur(${(1 - visibility) * 10}px)`,
          });
        });
      };

      applyCopyStyles(0);

      gsap.to(wrapper, {
        xPercent: -100 * (totalPanels - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          end: () => `+=${wrapper.scrollWidth - window.innerWidth}`,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
            applyCopyStyles(self.progress);
          },
        },
      });
    },
    { scope: containerRef }
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = (0.5 - (event.clientY - bounds.top) / bounds.height) * 2;

    hoverRef.current = {
      active: true,
      x,
      y,
    };
  };

  const handlePointerLeave = () => {
    hoverRef.current = {
      active: false,
      x: 999,
      y: 999,
    };
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-white text-black transition-colors duration-300 dark:bg-neutral-950 dark:text-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: isMobile ? [0, 0, 14] : [0, 0, 18], fov: isMobile ? 40 : 35 }}
          dpr={[1, 2]}
        >
          <Particles
            scrollProgressRef={scrollProgressRef}
            hoverRef={hoverRef}
            modelScenes={modelScenes}
            targets={targets}
            hoverBounds={hoverBounds}
          />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-start px-5 pt-24 sm:px-8 md:items-center md:px-24 md:pt-0">
        <div className="relative h-[230px] w-full max-w-sm sm:h-[250px] sm:max-w-md md:h-[320px] md:max-w-xl">
          {COPY_BLOCKS.map((copyBlock) => (
            <div
              key={copyBlock.title}
              className="particles-copy absolute inset-0 flex flex-col justify-center"
              style={{ opacity: 0 }}
            >
              <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight sm:text-4xl md:mb-5 md:text-7xl">
                {copyBlock.title}
              </h2>
              <p className="max-w-sm text-base font-light leading-relaxed text-gray-600 sm:max-w-md sm:text-lg dark:text-gray-400 md:max-w-lg md:text-xl">
                {copyBlock.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={scrollWrapperRef}
        aria-hidden="true"
        className="absolute inset-0 z-0 flex h-full"
        style={{ width: `${COPY_BLOCKS.length * 100}vw` }}
      >
        {COPY_BLOCKS.map((copyBlock) => (
          <div key={copyBlock.title} className="horizontal-panel h-full w-screen shrink-0" />
        ))}
      </div>
    </section>
  );
}

useGLTF.preload(MODEL_PATHS.drone);
useGLTF.preload(MODEL_PATHS.pencil);
