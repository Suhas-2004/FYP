import * as THREE from 'three';

export const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    // Calculate the fresnel effect based on viewing angle
    float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
    gl_FragColor = vec4(0.1, 0.5, 1.0, 1.0) * intensity;
  }
`;

export const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const earthFragmentShader = `
  uniform sampler2D globeTexture;
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vec3 color = texture2D(globeTexture, vUv).rgb;
    // Add subtle rim light
    float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.1, 0.5, 1.0) * pow(intensity, 1.5);
    gl_FragColor = vec4(color + atmosphere, 1.0);
  }
`;
