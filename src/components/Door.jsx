import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export function Door({ id, position, isOpen }) {
  const doorRef = useRef();
  
  // Animation parameters
  const targetY = isOpen ? 3 : 0;
  const animationSpeed = 0.05;
  
  // Animate the door
  useFrame(() => {
    if (doorRef.current) {
      const currentY = doorRef.current.position.y;
      const newY = THREE.MathUtils.lerp(currentY, targetY, animationSpeed);
      doorRef.current.position.y = newY;
    }
  });
  
  return (
    <group position={position}>
      {/* Door frame */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 3, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Door (animated) */}
      <mesh ref={doorRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 2, 0.2]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </group>
  );
}

export function Doors() {
  const doors = useGameStore((state) => state.doors);
  
  return (
    <group>
      {doors.map((door) => (
        <RigidBody key={door.id} type="kinematicPosition" position={[0, 0, 0]}>
          <Door
            id={door.id}
            position={door.position}
            isOpen={door.isOpen}
          />
        </RigidBody>
      ))}
    </group>
  );
}

export default Doors;
