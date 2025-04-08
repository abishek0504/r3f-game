import React, { useEffect, useState, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';

export function LevelMessage() {
  const message = useGameStore(state => state.message);
  const showMessage = useGameStore(state => state.showMessage);
  const stage = useGameStore(state => state.stage);
  const [opacity, setOpacity] = useState(0);
  const textRef = useRef();
  const groupRef = useRef();

  // Animation values
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (showMessage) {
      // Fade in and scale up immediately
      setOpacity(1);
      setScale(1);
    } else {
      // Always fade out when not showing
      setOpacity(0);
      setScale(0);
    }
  }, [showMessage]);

  // Bouncing animation
  useFrame((state) => {
    if (textRef.current && showMessage) {
      // Gentle floating motion
      const t = state.clock.getElapsedTime();
      textRef.current.position.y = Math.sin(t * 2) * 0.1;

      // Gentle rotation
      textRef.current.rotation.z = Math.sin(t * 1.5) * 0.05;

      // Pulsing scale
      const pulse = 1 + Math.sin(t * 3) * 0.05;
      textRef.current.scale.set(pulse, pulse, pulse);
    }

    if (groupRef.current && showMessage) {
      // Rotate the hearts around the text
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  // Only show for Stage 1 and when the message should be shown
  if (stage !== 1 || !showMessage) return null;

  // Create heart particles
  const hearts = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 1.2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const scale = 0.1 + Math.random() * 0.1;

    hearts.push(
      <mesh key={i} position={[x, y, 0]} scale={scale}>
        {heartGeometry()}
        <meshBasicMaterial color="#ff69b4" />
      </mesh>
    );
  }

  return (
    <>
      {/* Message with animation */}
      {showMessage && (
        <group position={[0, 2.5, -1.5]} scale={scale}>
          {/* Rotating hearts */}
          <group ref={groupRef}>
            {hearts}
          </group>

          {/* Main text */}
          <group ref={textRef}>
            <Text
              position={[0, 0, 0]}
              fontSize={0.5}
              color="#ff69b4" // Hot pink color
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#ffffff"
              opacity={opacity}
              font={undefined} // Use default font
            >
              {message}
            </Text>
          </group>
        </group>
      )}
    </>
  );
}

// Simple heart geometry - using a sphere for simplicity and reliability
function heartGeometry() {
  return <sphereGeometry args={[1, 8, 8]} />;
}
