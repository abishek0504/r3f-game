import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export function Goal() {
  const goalRef = useRef();
  const goal = useGameStore((state) => state.goal);
  
  // Animation parameters
  const hoverSpeed = 0.5;
  const rotationSpeed = 0.5;
  
  // Animate the goal
  useFrame(({ clock }) => {
    if (goalRef.current) {
      const time = clock.getElapsedTime();
      
      // Hover animation
      goalRef.current.position.y = goal.position[1] + Math.sin(time * hoverSpeed) * 0.3;
      
      // Rotation animation
      goalRef.current.rotation.y = time * rotationSpeed;
    }
  });
  
  return (
    <group position={goal.position}>
      {/* Base platform */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Goal object (animated) */}
      <group ref={goalRef} position={[0, 0.5, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Particles around the goal */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 1.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh key={i} position={[x, 0, z]} castShadow>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default Goal;
