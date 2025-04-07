import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, useRapier } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import { CharacterWithPhysics } from './models/Character';
import * as THREE from 'three';

export function Player() {
  const playerRef = useRef();
  const characterRef = useRef();
  
  // Game state from Zustand store
  const playerPosition = useGameStore((state) => state.playerPosition);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const playerRotation = useGameStore((state) => state.playerRotation);
  const setPlayerRotation = useGameStore((state) => state.setPlayerRotation);
  const isMoving = useGameStore((state) => state.isMoving);
  const setIsMoving = useGameStore((state) => state.setIsMoving);
  const phase = useGameStore((state) => state.phase);
  const checkGoal = useGameStore((state) => state.checkGoal);
  
  // Keyboard controls
  const [, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  
  // Movement parameters
  const MOVE_SPEED = 5;
  const direction = new THREE.Vector3();
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const rotation = new THREE.Vector3();
  
  // Handle player movement
  useFrame((state, delta) => {
    if (phase !== 'playing') return;
    
    const { forward, backward, leftward, rightward } = getKeys();
    
    // Movement direction
    frontVector.set(0, 0, backward - forward);
    sideVector.set(leftward - rightward, 0, 0);
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(state.camera.rotation);
    direction.y = 0; // Keep movement on the xz plane
    
    // Apply movement to the rigid body
    if (playerRef.current) {
      // Get current velocity
      const velocity = playerRef.current.linvel();
      
      // Apply movement force
      playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
      
      // Update player position in the store
      const position = playerRef.current.translation();
      setPlayerPosition([position.x, position.y, position.z]);
      
      // Update player rotation based on movement direction
      if (direction.length() > 0.1) {
        rotation.set(0, Math.atan2(direction.x, direction.z), 0);
        setPlayerRotation([0, rotation.y, 0]);
        setIsMoving(true);
      } else {
        setIsMoving(false);
      }
      
      // Check if player has reached the goal
      checkGoal();
    }
    
    // Character wobble animation when moving
    if (characterRef.current && isMoving) {
      const time = state.clock.getElapsedTime();
      characterRef.current.rotation.x = Math.sin(time * 10) * 0.1;
    }
  });
  
  return (
    <RigidBody
      ref={playerRef}
      colliders="hull"
      position={playerPosition}
      enabledRotations={[false, false, false]}
      linearDamping={12}
      angularDamping={0.5}
      restitution={0.2}
    >
      <group ref={characterRef} rotation={playerRotation}>
        <CharacterWithPhysics scale={2} />
      </group>
    </RigidBody>
  );
}

export default Player;
