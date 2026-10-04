"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export type LightingMode = "morning" | "golden" | "twilight";

type BookTextures = {
  cover: THREE.CanvasTexture;
  page: THREE.CanvasTexture;
  endpaper: THREE.CanvasTexture;
  edge: THREE.CanvasTexture;
};

function canvasSurface(width: number, height: number, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas textures unavailable");
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { context, texture };
}

function drawPhoto(
  context: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceWidth = Math.min(photo.width, photo.height * (width / height));
  const sourceHeight = sourceWidth / (width / height);
  context.drawImage(
    photo,
    (photo.width - sourceWidth) / 2,
    (photo.height - sourceHeight) / 2,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

/** Self-hosted artwork, with an illustrated plate while the photograph loads. */
function useBookTextures(cinematic: boolean) {
  const [textures, setTextures] = useState<BookTextures>();

  useEffect(() => {
    const cover = canvasSurface(1024, 1365, cinematic ? "#512e37" : "#f3ecdf");
    const ctx = cover.context;
    ctx.fillStyle = cinematic
      ? "rgba(248, 235, 210, .04)"
      : "rgba(110, 83, 53, .035)";
    for (let x = 0; x < 1024; x += 4) ctx.fillRect(x, 0, 1, 1365);
    for (let y = 0; y < 1365; y += 4) ctx.fillRect(0, y, 1024, 1);
    ctx.strokeStyle = cinematic ? "#c6a475" : "#b58a6d";
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 50, 908, 1265);
    ctx.strokeStyle = cinematic
      ? "rgba(198, 164, 117, .4)"
      : "rgba(181, 138, 109, .4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(70, 62, 884, 1241);
    ctx.textAlign = "center";
    ctx.fillStyle = cinematic ? "#dfc79f" : "#7c5c49";
    ctx.font = "26px Georgia, serif";
    ctx.fillText("M E M O R A", 512, 160);
    ctx.fillStyle = cinematic ? "#f6ecdd" : "#4a3528";
    ctx.font = "92px Georgia, serif";
    ctx.fillText("the days", 512, 320);
    ctx.font = "italic 102px Georgia, serif";
    ctx.fillText("between.", 512, 424);

    // A quiet horizon remains visible if the photograph cannot be loaded.
    const horizon = ctx.createLinearGradient(0, 490, 0, 990);
    horizon.addColorStop(0, "#d6e0de");
    horizon.addColorStop(0.5, "#acc1bd");
    horizon.addColorStop(0.51, "#739a99");
    horizon.addColorStop(1, "#e5d2b0");
    ctx.fillStyle = horizon;
    ctx.fillRect(142, 490, 740, 500);
    ctx.fillStyle = cinematic ? "#dfc79f" : "#7c5c49";
    ctx.font = "23px Georgia, serif";
    ctx.fillText("OUR SUMMER · VOLUME 01", 512, 1170);
    ctx.font = "34px Georgia, serif";
    ctx.fillText("2026", 512, 1245);

    const page = canvasSurface(768, 1024, "#faf6ef");
    const pg = page.context;
    pg.textAlign = "center";
    pg.fillStyle = "#9b4932";
    pg.font = "17px Georgia, serif";
    pg.fillText("CHAPTER 01 · JUNE 14, 2026", 384, 108);
    pg.fillStyle = "#e7dac4";
    pg.fillRect(76, 161, 616, 394);
    pg.fillStyle = "#302d27";
    pg.font = "48px Georgia, serif";
    pg.fillText("The long way home.", 384, 654);
    pg.fillStyle = "#625e54";
    pg.font = "italic 25px Georgia, serif";
    pg.fillText("We missed the turn", 384, 737);
    pg.fillText("and found our favourite place.", 384, 777);
    pg.fillStyle = "#7c5c49";
    pg.font = "15px Georgia, serif";
    pg.fillText("WITH THE PEOPLE WHO FEEL LIKE HOME", 384, 878);
    pg.strokeStyle = "#d9cdb9";
    pg.beginPath();
    pg.moveTo(76, 938);
    pg.lineTo(692, 938);
    pg.stroke();
    pg.font = "14px Georgia, serif";
    pg.fillText(
      "M E M O R A                                      01",
      384,
      974,
    );

    const endpaper = canvasSurface(512, 682, "#ede3d1");
    const ep = endpaper.context;
    ep.strokeStyle = "#c9b79d";
    ep.strokeRect(38, 40, 436, 602);
    ep.textAlign = "center";
    ep.fillStyle = "#9b4932";
    ep.font = "italic 42px Georgia, serif";
    ep.fillText("We were here.", 256, 315);
    ep.font = "14px Georgia, serif";
    ep.fillStyle = "#7c5c49";
    ep.fillText("AND THAT WAS EVERYTHING.", 256, 370);

    const edge = canvasSurface(256, 256, "#e9dfc9");
    const eg = edge.context;
    for (let x = 0; x < 256; x += 5) {
      eg.fillStyle = x % 10 === 0 ? "#d6c9b1" : "#f7f0df";
      eg.fillRect(x, 0, 1, 256);
    }

    const nextTextures = {
      cover: cover.texture,
      page: page.texture,
      endpaper: endpaper.texture,
      edge: edge.texture,
    };
    const task = window.setTimeout(() => setTextures(nextTextures), 0);
    const coverPhoto = new window.Image();
    const pagePhoto = new window.Image();
    coverPhoto.onload = () => {
      drawPhoto(ctx, coverPhoto, 142, 490, 740, 500);
      ctx.strokeStyle = cinematic ? "#c6a475" : "#f3ecdf";
      ctx.lineWidth = 4;
      ctx.strokeRect(142, 490, 740, 500);
      cover.texture.needsUpdate = true;
    };
    pagePhoto.onload = () => {
      drawPhoto(pg, pagePhoto, 76, 161, 616, 394);
      page.texture.needsUpdate = true;
    };
    coverPhoto.src = "/images/coast.jpg";
    pagePhoto.src = cinematic ? "/images/coast.jpg" : "/images/mountains.jpg";

    return () => {
      window.clearTimeout(task);
      coverPhoto.onload = null;
      pagePhoto.onload = null;
      Object.values(nextTextures).forEach((texture) => texture.dispose());
    };
  }, [cinematic]);

  return textures;
}

function SunlitDust({
  lightingMode = "golden",
}: {
  lightingMode?: LightingMode;
}) {
  const mesh = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const points = new Float32Array(36 * 3);
    for (let i = 0; i < points.length; i++) {
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      points[i] = (seed - Math.floor(seed) - 0.5) * 7;
    }
    return points;
  });

  const dustColor =
    lightingMode === "morning"
      ? "#f0ece1"
      : lightingMode === "twilight"
        ? "#c8bce0"
        : "#dcb888";

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const step = Math.min(delta, 0.05);
    const points = mesh.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 1; i < points.length; i += 3) {
      points[i] += step * 0.075;
      if (points[i] > 3.5) points[i] = -3.5;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={lightingMode === "golden" ? 0.026 : 0.022}
        color={dustColor}
        transparent
        opacity={lightingMode === "golden" ? 0.38 : 0.28}
        depthWrite={false}
      />
    </points>
  );
}

function MemoryBook({
  onReady,
  isOpen,
  cinematic,
  progressRef,
}: {
  onReady: () => void;
  isOpen: boolean;
  cinematic: boolean;
  progressRef?: RefObject<number>;
}) {
  const book = useRef<THREE.Group>(null);
  const coverHinge = useRef<THREE.Group>(null);
  const textures = useBookTextures(cinematic);
  const gyroRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (textures) onReady();
  }, [textures, onReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const clampedGamma = Math.max(-45, Math.min(45, e.gamma));
        const clampedBeta = Math.max(0, Math.min(90, e.beta));
        gyroRef.current = {
          x: (clampedGamma / 45) * 0.35,
          y: ((clampedBeta - 45) / 45) * 0.25,
        };
      }
    };
    window.addEventListener("deviceorientation", handleOrientation, {
      passive: true,
    });
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  useFrame((state, delta) => {
    if (!book.current || !coverHinge.current) return;
    const step = Math.min(delta, 0.05);
    const scroll = Math.min(
      window.scrollY / Math.max(window.innerHeight, 1),
      1,
    );
    const progress = THREE.MathUtils.clamp(progressRef?.current ?? 0, 0, 1);
    const opening = cinematic
      ? THREE.MathUtils.smoothstep(progress, 0.18, 0.4)
      : isOpen
        ? 1
        : Math.min(scroll * 0.3, 0.25);
    const frontal = cinematic
      ? THREE.MathUtils.smoothstep(progress, 0, 0.3)
      : 0;
    const damp = THREE.MathUtils.damp;
    const poseRate = cinematic ? 8 : 3;
    const hingeRate = cinematic ? 10 : 4;
    // The open spread stays inside narrow viewports instead of clipping its cover.
    const spreadScale = Math.min(
      1,
      state.size.width / Math.max(state.size.height, 1) / 1.04,
    );
    const scale = damp(
      book.current.scale.x,
      1 - opening * (1 - spreadScale),
      cinematic ? 8 : 4,
      step,
    );
    book.current.scale.setScalar(scale);
    book.current.position.x = damp(
      book.current.position.x,
      opening * 0.72,
      cinematic ? 8 : 4,
      step,
    );
    book.current.position.y = damp(
      book.current.position.y,
      Math.sin(state.clock.elapsedTime * 0.6) *
        0.055 *
        (cinematic ? 1 - frontal : 1),
      poseRate,
      step,
    );
    const pointerX = state.pointer.x + gyroRef.current.x;
    const pointerY = state.pointer.y - gyroRef.current.y;
    book.current.rotation.x = damp(
      book.current.rotation.x,
      cinematic
        ? (0.12 - pointerY * 0.035) * (1 - frontal)
        : 0.08 - pointerY * 0.06,
      poseRate,
      step,
    );
    book.current.rotation.y = damp(
      book.current.rotation.y,
      cinematic
        ? (-0.46 + pointerX * 0.055) * (1 - frontal)
        : -0.29 + pointerX * 0.14 + opening * 0.16,
      poseRate,
      step,
    );
    book.current.rotation.z = damp(
      book.current.rotation.z,
      cinematic ? -0.065 * (1 - frontal) : -0.045 + opening * 0.025,
      poseRate,
      step,
    );
    coverHinge.current.rotation.y = damp(
      coverHinge.current.rotation.y,
      -opening * (cinematic ? 2.55 : 2.12),
      hingeRate,
      step,
    );
  });

  return (
    <group
      ref={book}
      rotation={cinematic ? [0.12, -0.46, -0.065] : [0.08, -0.29, -0.045]}
    >
      <RoundedBox
        args={[3.18, 4.24, 0.075]}
        radius={0.025}
        smoothness={2}
        position={[0, 0, -0.18]}
      >
        <meshStandardMaterial
          color={cinematic ? "#512e37" : "#9b4932"}
          roughness={0.88}
        />
      </RoundedBox>
      <mesh position={[-1.57, 0, 0]}>
        <cylinderGeometry
          args={[0.22, 0.22, 4.24, 16, 1, false, Math.PI * 0.5, Math.PI]}
        />
        <meshStandardMaterial
          color={cinematic ? "#452330" : "#9b4932"}
          roughness={0.84}
        />
      </mesh>
      {[-1.5, 1.5].map((y) => (
        <mesh key={y} position={[-1.745, y, 0]}>
          <boxGeometry args={[0.012, 0.026, 0.3]} />
          <meshStandardMaterial
            color="#c9a475"
            metalness={0.35}
            roughness={0.45}
          />
        </mesh>
      ))}
      <mesh position={[0.02, 0, -0.015]}>
        <boxGeometry args={[3.04, 4.08, 0.28]} />
        <meshStandardMaterial color="#f6efe1" roughness={0.96} />
      </mesh>
      {textures && (
        <>
          <mesh position={[1.542, 0, -0.015]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.28, 4.08]} />
            <meshStandardMaterial map={textures.edge} roughness={0.96} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[0.02, side * 2.042, -0.015]}
              rotation={[(-side * Math.PI) / 2, 0, Math.PI / 2]}
            >
              <planeGeometry args={[0.28, 3.04]} />
              <meshStandardMaterial map={textures.edge} roughness={0.96} />
            </mesh>
          ))}
          <mesh position={[0.02, 0, 0.127]}>
            <planeGeometry args={[3.02, 4.06]} />
            <meshStandardMaterial map={textures.page} roughness={0.94} />
          </mesh>
        </>
      )}
      {/* Hinge at the spine: the board and both artwork faces turn together. */}
      <group ref={coverHinge} position={[-1.58, 0, 0.165]}>
        <group position={[1.58, 0, 0]}>
          <RoundedBox args={[3.18, 4.24, 0.075]} radius={0.025} smoothness={2}>
            <meshStandardMaterial
              color={cinematic ? "#512e37" : "#eee3cf"}
              roughness={0.88}
            />
          </RoundedBox>
          {textures && (
            <>
              <mesh position={[0, 0, 0.04]}>
                <planeGeometry args={[3.14, 4.2]} />
                <meshStandardMaterial map={textures.cover} roughness={0.88} />
              </mesh>
              <mesh position={[0, 0, -0.04]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[3.14, 4.2]} />
                <meshStandardMaterial
                  map={textures.endpaper}
                  roughness={0.95}
                />
              </mesh>
            </>
          )}
        </group>
      </group>
    </group>
  );
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", handleLoss);
    return () =>
      gl.domElement.removeEventListener("webglcontextlost", handleLoss);
  }, [gl, onFailure]);
  return null;
}

function LightingRig({ mode }: { mode: LightingMode }) {
  const configs = {
    morning: {
      ambient: { color: "#f4f8ff", intensity: 1.18 },
      key: {
        color: "#fffced",
        intensity: 2.1,
        pos: [4, 7, 6] as [number, number, number],
      },
      rim: {
        color: "#cadbe8",
        intensity: 1.25,
        pos: [-5, 3, -2] as [number, number, number],
      },
      fill: {
        color: "#f0f4f8",
        intensity: 0.5,
        pos: [0, -4, 3] as [number, number, number],
      },
    },
    golden: {
      ambient: { color: "#fff4e6", intensity: 1.28 },
      key: {
        color: "#ffedd0",
        intensity: 2.4,
        pos: [4, 5, 7] as [number, number, number],
      },
      rim: {
        color: "#e88258",
        intensity: 1.5,
        pos: [-5.5, 2, -2] as [number, number, number],
      },
      fill: {
        color: "#f4ebdd",
        intensity: 0.55,
        pos: [0, -4, 3] as [number, number, number],
      },
    },
    twilight: {
      ambient: { color: "#ece8f4", intensity: 0.95 },
      key: {
        color: "#ffcaa0",
        intensity: 1.85,
        pos: [3.5, 4, 6] as [number, number, number],
      },
      rim: {
        color: "#8da5d8",
        intensity: 1.4,
        pos: [-5, 2, -2] as [number, number, number],
      },
      fill: {
        color: "#453b52",
        intensity: 0.45,
        pos: [0, -4, 3] as [number, number, number],
      },
    },
  };

  const current = configs[mode] || configs.golden;

  return (
    <>
      <ambientLight
        intensity={current.ambient.intensity}
        color={current.ambient.color}
      />
      <directionalLight
        position={current.key.pos}
        intensity={current.key.intensity}
        color={current.key.color}
      />
      <directionalLight
        position={current.rim.pos}
        intensity={current.rim.intensity}
        color={current.rim.color}
      />
      <directionalLight
        position={current.fill.pos}
        intensity={current.fill.intensity}
        color={current.fill.color}
      />
    </>
  );
}

export default function BookScene({
  onReady,
  onFailure,
  isOpen = false,
  active = true,
  cinematic = false,
  lightingMode = "golden",
  progressRef,
}: {
  onReady: () => void;
  onFailure: () => void;
  isOpen?: boolean;
  active?: boolean;
  cinematic?: boolean;
  lightingMode?: LightingMode;
  progressRef?: RefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 8.8], fov: 35 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ContextGuard onFailure={onFailure} />
      <LightingRig mode={lightingMode} />
      {!cinematic && <SunlitDust lightingMode={lightingMode} />}
      <MemoryBook
        onReady={onReady}
        isOpen={isOpen}
        cinematic={cinematic}
        progressRef={progressRef}
      />
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.24}
        scale={9}
        blur={2.5}
        far={4}
        frames={1}
        resolution={256}
      />
    </Canvas>
  );
}
