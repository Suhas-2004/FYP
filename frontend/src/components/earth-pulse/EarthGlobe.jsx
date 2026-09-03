import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { atmosphereVertexShader, atmosphereFragmentShader } from './Shaders';

export default function EarthGlobe({ earthRef }) {
  const cloudsRef = useRef();

  // Load high-resolution textures from three.js examples repository
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  ]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.025; // Extremely slow cinematic rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.028; // Clouds move slightly faster
    }
  });

  return (
    <group ref={earthRef}>
      {/* 1. Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          metalnessMap={specularMap}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* 2. Clouds Sphere (slightly larger) */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.515, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Outer Atmosphere / Glow (custom shader) */}
      <mesh>
        <sphereGeometry args={[1.7, 64, 64]} />
        <shaderMaterial 
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
        />
      </mesh>
    </group>
  );
}
