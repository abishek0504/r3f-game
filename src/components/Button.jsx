import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import * as THREE from 'three';

// Game state management
import { useGameStore } from '../store/useGameStore';

export function Button({ position, height = 0.2, radius = 0.5, buttonId, requiredHeight = 0.5 }) {
  const buttonRef = useRef();
  const baseRef = useRef();
  const [isPressed, setIsPressed] = useState(false);
  const [overlappingBodies, setOverlappingBodies] = useState(0);

  // Get the updatePressurePlate function from the game store
  const updatePressurePlate = useGameStore(state => state.updatePressurePlate);

  // Button colors
  const inactiveColor = new THREE.Color("#ff0000");
  const activeColor = new THREE.Color("#00ff00");
  const [buttonColor, setButtonColor] = useState(inactiveColor);

  // Check for collisions and update button state
  useFrame(() => {
    if (buttonRef.current) {
      // If something is on the button and it's not already pressed, press it
      if (overlappingBodies > 0 && !isPressed) {
        setIsPressed(true);
        setButtonColor(activeColor);
        updatePressurePlate(buttonId, true);
      }
      // If nothing is on the button and it's pressed, release it
      else if (overlappingBodies === 0 && isPressed) {
        setIsPressed(false);
        setButtonColor(inactiveColor);
        updatePressurePlate(buttonId, false);
      }
    }
  });

  return (
    <group position={position}>
      {/* Base cylinder */}
      <RigidBody type="fixed" colliders={false} ref={baseRef}>
        <CylinderCollider args={[height, radius]} />
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[radius, radius, height, 32]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      </RigidBody>

      {/* Button top - this will detect when objects are on it */}
      <RigidBody
        type="fixed"
        position={[0, height + 0.05, 0]}
        colliders={false}
        ref={buttonRef}
        sensor
        onIntersectionEnter={() => {
          setOverlappingBodies(prev => prev + 1);
        }}
        onIntersectionExit={() => {
          setOverlappingBodies(prev => Math.max(0, prev - 1));
        }}
      >
        <CylinderCollider args={[0.1, radius - 0.1]} />
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[radius - 0.1, radius - 0.1, 0.1, 32]} />
          <meshStandardMaterial color={buttonColor} />
        </mesh>
      </RigidBody>
    </group>
  );
}

export function ButtonPlatform({ position, height, radius = 1, buttonId, requiredHeight = 0.5 }) {
  return (
    <group position={position}>
      {/* Platform cylinder */}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[height, radius]} />
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[radius, radius, height * 2, 32]} />
          <meshStandardMaterial color="#777777" />
        </mesh>
      </RigidBody>

      {/* Button on top */}
      <Button
        position={[0, height, 0]}
        buttonId={buttonId}
        requiredHeight={requiredHeight}
      />
    </group>
  );
}
