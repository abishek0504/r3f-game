import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export function PressurePlate({ id, position, isPressed }) {
  const plateRef = useRef();
  
  // Animation parameters
  const targetY = isPressed ? 0.05 : 0.1;
  const animationSpeed = 0.2;
  
  // Animate the pressure plate
  useFrame(() => {
    if (plateRef.current) {
      const currentY = plateRef.current.position.y;
      const newY = THREE.MathUtils.lerp(currentY, targetY, animationSpeed);
      plateRef.current.position.y = newY;
    }
  });
  
  return (
    <group position={position}>
      {/* Base (fixed) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* Pressure plate (animated) */}
      <mesh ref={plateRef} position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={isPressed ? "#ff0000" : "#888888"} />
      </mesh>
    </group>
  );
}

export function PressurePlates() {
  const pressurePlates = useGameStore((state) => state.pressurePlates);
  const checkPressurePlates = useGameStore((state) => state.checkPressurePlates);
  
  // Check pressure plates on each frame
  useEffect(() => {
    const interval = setInterval(() => {
      checkPressurePlates();
    }, 100);
    
    return () => clearInterval(interval);
  }, [checkPressurePlates]);
  
  return (
    <group>
      {pressurePlates.map((plate) => (
        <RigidBody key={plate.id} type="fixed" position={[0, 0, 0]} colliders="cuboid">
          <PressurePlate
            id={plate.id}
            position={plate.position}
            isPressed={plate.isPressed}
          />
        </RigidBody>
      ))}
    </group>
  );
}

export default PressurePlates;
