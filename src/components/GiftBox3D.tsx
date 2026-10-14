import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const W = 1.6, H = 1.05, D = 1.6, LID_H = 0.28, LID_PAD = 0.08, RIB = 0.2;
const N_PARTICLES = 220;

function Particles({ openedAt }: { openedAt: React.RefObject<number | null> }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(N_PARTICLES * 3);
    const seeds = new Float32Array(N_PARTICLES * 4);
    for (let i = 0; i < N_PARTICLES; i++) {
      seeds[i * 4] = (Math.random() - 0.5) * (W - 0.3); // x origin
      seeds[i * 4 + 1] = (Math.random() - 0.5) * (D - 0.3); // z origin
      seeds[i * 4 + 2] = 0.8 + Math.random() * 1.8; // rise speed
      seeds[i * 4 + 3] = Math.random() * Math.PI * 2; // swirl phase
    }
    return { positions, seeds };
  }, []);
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#f7d985",
        size: 0.055,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame((state) => {
    const start = openedAt.current;
    const pts = ref.current;
    if (start == null) {
      material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.1);
      return;
    }
    const t = state.clock.elapsedTime - start;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < N_PARTICLES; i++) {
      const sp = seeds[i * 4 + 2], ph = seeds[i * 4 + 3];
      const rise = t * sp;
      const r = 0.15 + rise * 0.25;
      arr[i * 3] = seeds[i * 4] * (1 + rise * 0.3) + Math.cos(ph + t * 2) * r * 0.3;
      arr[i * 3 + 1] = H / 2 + rise;
      arr[i * 3 + 2] = seeds[i * 4 + 1] * (1 + rise * 0.3) + Math.sin(ph + t * 2) * r * 0.3;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    material.opacity = t < 0.3 ? t / 0.3 : Math.max(0, 1 - (t - 0.3) / 1.8);
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}

function GiftBox({ onOpened, trigger }: { onOpened: () => void; trigger: number }) {
  const group = useRef<THREE.Group>(null!);
  const lid = useRef<THREE.Group>(null!);
  const innerLight = useRef<THREE.PointLight>(null!);
  const [hovered, setHovered] = useState(false);
  const [opened, setOpened] = useState(false);
  const openedAt = useRef<number | null>(null);

  const mats = useMemo(
    () => ({
      gold: new THREE.MeshStandardMaterial({ color: "#d6a64d", metalness: 1, roughness: 0.3, emissive: "#a77528", emissiveIntensity: 0.04 }),
      lid: new THREE.MeshStandardMaterial({ color: "#c99a43", metalness: 1, roughness: 0.26, emissive: "#a77528", emissiveIntensity: 0.04 }),
      ribbon: new THREE.MeshStandardMaterial({ color: "#f7d985", metalness: 0.85, roughness: 0.16 }),
      inside: new THREE.MeshStandardMaterial({ color: "#0a0806", roughness: 1, emissive: "#f7d985", emissiveIntensity: 0 }),
    }),
    [],
  );

  useEffect(() => () => void (document.body.style.cursor = ""), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    g.position.y = Math.sin(t * 0.9) * 0.1;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.62 + state.pointer.x * 0.45 + Math.sin(t * 0.25) * 0.08, 2.5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.32 - state.pointer.y * 0.18, 2.5, dt);

    const glow = hovered ? 0.32 : 0.04;
    mats.gold.emissiveIntensity = THREE.MathUtils.damp(mats.gold.emissiveIntensity, glow, 4, dt);
    mats.lid.emissiveIntensity = mats.gold.emissiveIntensity;

    lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, opened ? -1.95 : 0, opened ? 3 : 5, dt);
    mats.inside.emissiveIntensity = THREE.MathUtils.damp(mats.inside.emissiveIntensity, opened ? 0.9 : 0, 3, dt);
    innerLight.current.intensity = THREE.MathUtils.damp(innerLight.current.intensity, opened ? 6 : 0, 3, dt);
  });

  const pending = useRef(false);
  const doOpen = () => {
    if (opened) return;
    pending.current = true;
    setOpened(true);
  };
  const open = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    doOpen();
  };
  // Keyboard / external trigger (the accessible "Open the gift" button)
  useEffect(() => {
    if (trigger > 0) doOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // Stamp the open moment on the R3F clock so particles start in sync
  useFrame((state) => {
    if (pending.current) {
      pending.current = false;
      openedAt.current = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    if (!opened) return;
    const toNext = setTimeout(onOpened, 1700);
    const reset = setTimeout(() => {
      setOpened(false);
      openedAt.current = null;
    }, 4200);
    return () => {
      clearTimeout(toNext);
      clearTimeout(reset);
    };
  }, [opened, onOpened]);

  const LW = W + LID_PAD, LD = D + LID_PAD;

  return (
    <group
      ref={group}
      onClick={open}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      {/* Base */}
      <mesh material={mats.gold} castShadow>
        <boxGeometry args={[W, H, D]} />
      </mesh>
      <mesh material={mats.inside} position={[0, H / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.08, D - 0.08]} />
      </mesh>
      <mesh material={mats.ribbon}>
        <boxGeometry args={[RIB, H + 0.004, D + 0.012]} />
      </mesh>
      <mesh material={mats.ribbon}>
        <boxGeometry args={[W + 0.012, H + 0.004, RIB]} />
      </mesh>
      <pointLight ref={innerLight} position={[0, H / 2 + 0.3, 0]} color="#f7d985" intensity={0} distance={3} />

      {/* Lid hinged on the back edge */}
      <group ref={lid} position={[0, H / 2, -LD / 2]}>
        <group position={[0, LID_H / 2, LD / 2]}>
          <mesh material={mats.lid}>
            <boxGeometry args={[LW, LID_H, LD]} />
          </mesh>
          <mesh material={mats.ribbon}>
            <boxGeometry args={[RIB, LID_H + 0.006, LD + 0.012]} />
          </mesh>
          <mesh material={mats.ribbon}>
            <boxGeometry args={[LW + 0.012, LID_H + 0.006, RIB]} />
          </mesh>
          {/* Bow */}
          <mesh material={mats.ribbon} position={[-0.2, LID_H / 2 + 0.12, 0]} rotation={[Math.PI / 2, 0.5, 0]}>
            <torusGeometry args={[0.2, 0.05, 16, 48]} />
          </mesh>
          <mesh material={mats.ribbon} position={[0.2, LID_H / 2 + 0.12, 0]} rotation={[Math.PI / 2, -0.5, 0]}>
            <torusGeometry args={[0.2, 0.05, 16, 48]} />
          </mesh>
          <mesh material={mats.ribbon} position={[0, LID_H / 2 + 0.06, 0]}>
            <sphereGeometry args={[0.09, 24, 24]} />
          </mesh>
        </group>
      </group>

      <Particles openedAt={openedAt} />
    </group>
  );
}

export default function GiftBox3D({ onOpened, trigger = 0 }: { onOpened: () => void; trigger?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pause rendering when the hero is off-screen
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.1, 5.4], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#fff4d6", "#140d02", 0.9]} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} color="#fff1cc" />
        <directionalLight position={[-5, 2, -3]} intensity={1.2} color="#d6a64d" />
        <spotLight position={[0, 6, 2]} angle={0.5} penumbra={1} intensity={30} color="#f7d985" />
        <GiftBox onOpened={onOpened} trigger={trigger} />
      </Canvas>
    </div>
  );
}
