import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function PulseRings({ pulseActive }) {
  const ringsRef = useRef([]);
  
  // Three subtle expanding rings
  const rings = [
    { scale: 1, opacity: 0, delay: 0 },
    { scale: 1, opacity: 0, delay: 0.4 },
    { scale: 1, opacity: 0, delay: 0.8 },
  ];

  useFrame((state, delta) => {
    if (!pulseActive) return;
    
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      
      const config = rings[i];
      // Increment pseudo-time for this ring
      config.delay -= delta;
      
      if (config.delay <= 0) {
        // Expand ring
        config.scale += delta * 1.5;
        // Fade out as it expands
        config.opacity = Math.max(0, 1 - (config.scale - 1) / 3);
        
        // Reset ring if it gets too large
        if (config.scale > 4) {
          config.scale = 1;
          config.delay = 2; // time between pulses
        }
        
        ring.scale.set(config.scale, config.scale, config.scale);
        ring.material.opacity = config.opacity * 0.5; // subtle glow
      }
    });
  });

  return (
    <group>
      {rings.map((_, i) => (
        <mesh 
          key={i} 
          ref={el => ringsRef.current[i] = el}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.5, 1.52, 64]} />
          <meshBasicMaterial 
            color="#4fc3f7" 
            transparent 
            opacity={0} 
            side={THREE.DoubleSide} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
