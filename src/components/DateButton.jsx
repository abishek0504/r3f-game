import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Game state management
import { useGameStore } from '../store/useGameStore';

export function DateButton({ position, buttonType = 'yes', height = 0.1, radius = 0.8 }) {
  const buttonRef = useRef();
  const baseRef = useRef();
  const [isPressed, setIsPressed] = useState(false);
  const [overlappingBodies, setOverlappingBodies] = useState(0);
  
  // Get the handleDateResponse function and bothButtonsYes state from the game store
  const handleDateResponse = useGameStore(state => state.handleDateResponse);
  const bothButtonsYes = useGameStore(state => state.dateProposalState.bothButtonsYes);
  
  // If bothButtonsYes is true and this is a 'no' button, treat it as a 'yes' button
  const effectiveButtonType = bothButtonsYes ? 'yes' : buttonType;
  
  // Button colors
  const yesColor = new THREE.Color("#00ff00"); // Green for yes
  const noColor = new THREE.Color("#ff0000"); // Red for no
  const [buttonColor, setButtonColor] = useState(effectiveButtonType === 'yes' ? yesColor : noColor);
  
  // Update button color when bothButtonsYes changes
  React.useEffect(() => {
    setButtonColor(effectiveButtonType === 'yes' ? yesColor : noColor);
  }, [bothButtonsYes, effectiveButtonType]);

  // Check for collisions and update button state
  useFrame(() => {
    if (buttonRef.current) {
      // If something is on the button and it's not already pressed, press it
      if (overlappingBodies > 0 && !isPressed) {
        setIsPressed(true);
        
        // Call the handleDateResponse function with the button type
        handleDateResponse(effectiveButtonType);
        
        // Reset the button after a short delay
        setTimeout(() => {
          setIsPressed(false);
          setOverlappingBodies(0);
        }, 500);
      }
    }
  });

  return (
    <group position={position}>
      {/* Base cylinder */}
      <RigidBody type="fixed" colliders={false} ref={baseRef}>
        <CylinderCollider args={[height-0.05, radius * 1.1]} /> {/* Wider collider at the bottom */}
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[radius, radius * 1.3, height, 32]} /> {/* Wider at the bottom for easier pushing */}
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
        
        {/* Button text */}
        <Text
          position={[0, 0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {effectiveButtonType.toUpperCase()}
        </Text>
      </RigidBody>
    </group>
  );
}
