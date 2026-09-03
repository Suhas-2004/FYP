import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import EarthGlobe from './EarthGlobe';
import AmbientParticles from './AmbientParticles';
import PulseRings from './PulseRings';

export default function EarthScene({ pulseActive, earthGroupRef }) {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-[#02040A]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
      >
        <color attach="background" args={['#02040A']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.02} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={2} 
          color="#ffffff" 
        />
        {/* Subtle rim light */}
        <directionalLight 
          position={[-5, 3, -5]} 
          intensity={0.5} 
          color="#4fc3f7" 
        />

        {/* Global wrapper for scroll animations */}
        <group ref={earthGroupRef}>
          <Suspense fallback={null}>
            <EarthGlobe earthRef={useRef()} />
            <PulseRings pulseActive={pulseActive} />
            <AmbientParticles count={1500} />
          </Suspense>
        </group>

        {/* Post Processing: Bloom for the pulse/glow effects */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={1.5} 
            radius={0.8} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
