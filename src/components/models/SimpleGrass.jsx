import React, { useMemo } from 'react';
import * as THREE from 'three';

// Create a simple grass blade using basic geometry
export function GrassBlade({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = '#4a8c2e' }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Create a component for a grass patch with multiple blades
export function GrassPatch({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 0.5 }) {
  // Create a memoized array of grass blades
  const blades = useMemo(() => {
    const result = [];
    const bladeCount = 5; // Reduced from original for better performance
    
    for (let i = 0; i < bladeCount; i++) {
      // Create random positions within a small radius
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 0.2;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const rotationY = Math.random() * Math.PI * 2;
      const height = 0.2 + Math.random() * 0.3;
      
      // Slightly different shades of green
      const hue = 100 + Math.random() * 20;
      const saturation = 50 + Math.random() * 30;
      const lightness = 30 + Math.random() * 20;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      result.push(
        <GrassBlade
          key={i}
          position={[x, 0, z]}
          rotation={[0, rotationY, 0]}
          scale={[1, height, 1]}
          color={color}
        />
      );
    }
    
    return result;
  }, []);
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {blades}
    </group>
  );
}

// Create a component for a grass field with multiple patches
export function GrassField({ patchCount = 10, radius = 5, scale = 1, position = [0, 0, 0] }) {
  // Create a memoized array of grass patches
  const patches = useMemo(() => {
    const result = [];
    
    for (let i = 0; i < patchCount; i++) {
      // Create random positions within the radius
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const rotationY = Math.random() * Math.PI * 2;
      // Random scale between 0.3 and 0.7, multiplied by the overall scale parameter
      const patchScale = (0.3 + Math.random() * 0.4) * scale;
      
      result.push(
        <GrassPatch
          key={i}
          position={[x, 0, z]}
          rotation={[0, rotationY, 0]}
          scale={patchScale}
        />
      );
    }
    
    return result;
  }, [patchCount, radius, scale]);
  
  return <group position={position}>{patches}</group>;
}
