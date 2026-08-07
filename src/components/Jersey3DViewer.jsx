import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/**
 * Jersey3DViewer — compact 3D jersey model viewer.
 * Designed to sit inside a section, not dominate it.
 */

function JerseyModel({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  const centered = useRef(false);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.4;
    }
  });

  useEffect(() => {
    if (scene && !centered.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      centered.current = true;
    }
  }, [scene]);

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={2.8} position={[0, -0.2, 0]} />
    </group>
  );
}

function LoadingDot() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );
}

export default function Jersey3DViewer({
  modelPath = '/models/jersey/scene.gltf',
  teamColor = '#d4af37',
  height = 280,
  className = '',
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    useGLTF.preload(modelPath);
  }, [modelPath]);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle glow behind */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${teamColor}10 0%, transparent 70%)`,
        }}
      />

      <Suspense fallback={<LoadingDot />}>
        <Canvas
          camera={{ position: [0, 0.3, 3.8], fov: 28, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          dpr={[1, 1.5]}
          onCreated={() => setLoaded(true)}
        >
          <color attach="background" args={['#0a0a0a']} />

          <directionalLight position={[2, 3, 3]} intensity={1.6} color="#ffffff" />
          <directionalLight position={[-2, 1, -2]} intensity={0.5} color="#999" />
          <pointLight position={[0, 0.5, 2.5]} intensity={0.8} color={teamColor} distance={6} />
          <pointLight position={[0, 1.5, -2]} intensity={0.5} color={teamColor} distance={5} />
          <ambientLight intensity={0.35} />

          <JerseyModel modelPath={modelPath} />

          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.3}
            scale={3}
            blur={2}
            far={2}
            color={teamColor}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            rotateSpeed={0.4}
          />
        </Canvas>
      </Suspense>

      {/* Drag hint */}
      {loaded && (
        <motion.p
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-white/15 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Drag to rotate
        </motion.p>
      )}
    </motion.div>
  );
}
