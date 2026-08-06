import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/**
 * Jersey3DViewer — Renders the 3D jersey model in a React Three Fiber canvas.
 *
 * Props:
 * @param {string}  modelPath  — path to the GLTF file (default: /models/jersey/scene.gltf)
 * @param {string}  teamColor  — hex color for accent lighting (default: #d4af37 gold)
 * @param {string}  teamName   — team name to display below
 * @param {number}  height     — canvas height in px (default: 500)
 * @param {boolean} autoRotate — auto-rotate on load (default: true)
 */

function JerseyModel({ modelPath, teamColor }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  // Slow auto-rotate
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  // Clone and center the scene
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
    }
  }, [scene]);

  return (
    <group ref={modelRef}>
      <primitive
        object={scene}
        scale={4.5}
        position={[0, -0.3, 0]}
      />
    </group>
  );
}

function SceneLighting({ teamColor }) {
  return (
    <>
      {/* Key light from top-front */}
      <directionalLight
        position={[2, 4, 3]}
        intensity={1.8}
        color="#ffffff"
        castShadow
      />
      {/* Fill light */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.6}
        color="#b0b0b0"
      />
      {/* Accent light in team color */}
      <pointLight
        position={[0, 1, 3]}
        intensity={1.2}
        color={teamColor}
        distance={8}
      />
      {/* Rim light from behind */}
      <pointLight
        position={[0, 2, -3]}
        intensity={0.8}
        color={teamColor}
        distance={6}
      />
      {/* Subtle ambient */}
      <ambientLight intensity={0.3} />
    </>
  );
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        <p className="text-text-muted text-xs uppercase tracking-wider">Loading 3D Model…</p>
      </div>
    </div>
  );
}

export default function Jersey3DViewer({
  modelPath = '/models/jersey/scene.gltf',
  teamColor = '#d4af37',
  teamName = '',
  teamLabel = 'HPL SEASON 3',
  height = 500,
  className = '',
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload the model
  useEffect(() => {
    useGLTF.preload(modelPath);
  }, [modelPath]);

  return (
    <motion.div
      className={`relative w-full ${className}`}
      style={{ height }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle, ${teamColor}12 0%, transparent 70%)`,
        }}
      />

      {/* Gold ring accent behind the model */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 pointer-events-none z-0">
        <div
          className="w-[200px] sm:w-[300px] md:w-[380px] h-[60px] sm:h-[80px] md:h-[100px] rounded-[50%] border border-gold/20"
          style={{
            boxShadow: `0 0 30px ${teamColor}15, 0 0 60px ${teamColor}08`,
            transform: 'rotateX(75deg)',
          }}
        />
      </div>

      {/* 3D Canvas */}
      <div className="relative z-10 w-full h-full">
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas
            camera={{
              position: [0, 0.5, 2.5],
              fov: 35,
              near: 0.1,
              far: 100,
            }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
            dpr={[1, 2]}
            onCreated={() => setIsLoaded(true)}
          >
            <color attach="background" args={['#0a0a0a']} />

            <SceneLighting teamColor={teamColor} />

            <JerseyModel
              modelPath={modelPath}
              teamColor={teamColor}
            />

            {/* Contact shadow underneath */}
            <ContactShadows
              position={[0, -1.1, 0]}
              opacity={0.4}
              scale={4}
              blur={2.5}
              far={3}
              color={teamColor}
            />

            {/* User orbit controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              dampingFactor={0.05}
              rotateSpeed={0.5}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Interaction hint */}
      {isLoaded && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/20">
            <path d="M5 9l3-3 3 3" />
            <path d="M13 15l3 3 3-3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-[10px] text-white/20 uppercase tracking-widest">
            Drag to rotate
          </span>
        </motion.div>
      )}

      {/* Team name label below */}
      {teamName && (
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center z-20"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-lg sm:text-xl font-bold tracking-[0.12em] text-white uppercase"
            style={{ fontFamily: '"Anton", sans-serif' }}
          >
            {teamName}
          </p>
          <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mt-0.5">
            {teamLabel}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
