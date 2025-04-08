import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { CharacterWithPhysics } from './models/Character';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

export function CharacterController() {
  const characterRef = useRef();
  const rigidBodyRef = useRef();
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());
  const [isOnFloor, setIsOnFloor] = useState(false);
  const [hasFallen, setHasFallen] = useState(false);

  // Get player position and game state from game store
  const playerPosition = useGameStore(state => state.playerPosition);
  const playerRotation = useGameStore(state => state.playerRotation);
  const showMessage = useGameStore(state => state.showMessage);
  const stage = useGameStore(state => state.stage);
  const resetPlayerPosition = useGameStore(state => state.resetPlayerPosition);

  // We'll use velocity checks for floor detection

  // Get keyboard controls
  const [, getKeys] = useKeyboardControls();

  // Character movement parameters
  const ROTATION_SPEED = 5;
  const JUMP_FORCE = stage === 2 ? 1.5 : 2.5; // Reduced jump force in stage 2 for better control on floating platform
  const MAX_VELOCITY = stage === 2 ? 2 : 3; // Reduced max velocity in stage 2 for better control

  // We'll use a simple velocity check for floor detection

  // Use effect to initialize
  useEffect(() => {
    // Set initial state to false
    setIsOnFloor(false);
  }, []);

  // Effect to update character position when playerPosition changes
  useEffect(() => {
    if (rigidBodyRef.current && showMessage) {
      // Reset position when message is shown
      rigidBodyRef.current.setTranslation(
        { x: playerPosition[0], y: playerPosition[1], z: playerPosition[2] },
        true
      );

      // Reset rotation when message is shown
      rigidBodyRef.current.setRotation(
        { x: playerRotation[0], y: playerRotation[1], z: playerRotation[2], w: 1 },
        true
      );

      // Reset velocity
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [playerPosition, playerRotation, showMessage]);

  // Function to check if character is on floor using velocity
  const checkIfOnFloor = () => {
    if (!rigidBodyRef.current) return false;

    // Get the character's current velocity
    const velocity = rigidBodyRef.current.linvel();

    // If the vertical velocity is very small, we're probably on the floor
    return Math.abs(velocity.y) < 0.1;
  };

  useFrame((state, delta) => {
    // Get keyboard inputs
    const { forward, backward, leftward, rightward, jump } = getKeys();

    if (!rigidBodyRef.current) return;

    // Get current velocity
    const velocity = rigidBodyRef.current.linvel();

    // Calculate movement direction
    const impulse = { x: 0, y: 0, z: 0 };

    // Apply movement forces
    const moveStrength = 12 * delta; // Reduced from 20 to slow down the duck

    if (forward) {
      impulse.z -= moveStrength;
    }

    if (backward) {
      impulse.z += moveStrength;
    }

    if (leftward) {
      impulse.x -= moveStrength;
    }

    if (rightward) {
      impulse.x += moveStrength;
    }

    // Apply impulse to rigid body
    rigidBodyRef.current.applyImpulse(impulse, true);

    // Apply max velocity constraint
    const currentVel = rigidBodyRef.current.linvel();
    if (Math.sqrt(currentVel.x * currentVel.x + currentVel.z * currentVel.z) > MAX_VELOCITY) {
      // Normalize the horizontal velocity and scale to max velocity
      const horizontalSpeed = Math.sqrt(currentVel.x * currentVel.x + currentVel.z * currentVel.z);
      const scale = MAX_VELOCITY / horizontalSpeed;

      // Set the new velocity with the same y component
      rigidBodyRef.current.setLinvel(
        { x: currentVel.x * scale, y: currentVel.y, z: currentVel.z * scale },
        true
      );
    }

    // Check if character is on floor using velocity
    const onFloor = checkIfOnFloor();

    // Update isOnFloor state if it changed
    if (onFloor !== isOnFloor) {
      setIsOnFloor(onFloor);
    }

    // Handle jumping - only when on floor
    // console.log('Jump key:', jump, 'isOnFloor:', isOnFloor, 'onFloor:', onFloor);
    if (jump && onFloor) {
      // Apply jump force
      console.log('Jumping!');
      setIsOnFloor(false); // Set to false immediately after jumping
      rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
    }

    // Character rotation based on movement
    if (characterRef.current) {
      // Only rotate if we're moving
      if (Math.abs(impulse.x) > 0 || Math.abs(impulse.z) > 0) {
        const angle = Math.atan2(impulse.x, impulse.z);

        // Calculate the shortest rotation path
        let targetRotation = angle;

        // Get current rotation and normalize to 0-2PI range
        let currentRotation = characterRef.current.rotation.y;
        currentRotation = currentRotation % (Math.PI * 2);
        if (currentRotation < 0) currentRotation += Math.PI * 2;

        // Calculate difference between target and current rotation
        let rotationDiff = targetRotation - currentRotation;

        // Adjust for shortest path
        if (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
        if (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

        // Smoothly rotate the character using the shortest path
        characterRef.current.rotation.y = THREE.MathUtils.lerp(
          currentRotation,
          currentRotation + rotationDiff,
          delta * ROTATION_SPEED
        );
      }

      // Add a wobble effect when moving
      if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.z) > 0.1) {
        const time = state.clock.getElapsedTime();
        characterRef.current.rotation.x = Math.sin(time * 10) * 0.1;
      } else {
        // Reset wobble when not moving
        characterRef.current.rotation.x = THREE.MathUtils.lerp(
          characterRef.current.rotation.x,
          0,
          delta * 5
        );
      }
    }

    // Camera follow - adjust for stage 2 to better show the floating platform
    const characterPosition = rigidBodyRef.current.translation();

    // Check if player has fallen off the stage
    const STAGE_RADIUS = 10;
    const FALL_THRESHOLD_Y = -1; // Fall if y position is at or below this value (matches wireframe at y=-1)
    const FALL_THRESHOLD_DISTANCE = STAGE_RADIUS + 5; // Fall if distance from center exceeds this value

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(
      characterPosition.x * characterPosition.x +
      characterPosition.z * characterPosition.z
    );

    // Check if player has fallen
    const hasFallenOff = (
      characterPosition.y <= FALL_THRESHOLD_Y ||
      distanceFromCenter > FALL_THRESHOLD_DISTANCE
    );

    if (hasFallenOff && !hasFallen) {
      console.log('Player has fallen off the stage! Resetting position...');
      console.log('Position:', characterPosition, 'Distance from center:', distanceFromCenter);

      // Set the fallen state to prevent continuous resets
      setHasFallen(true);

      // Reset player position with a message
      resetPlayerPosition("Oops I think you fell! Fell for me :3");

      // Reset the fallen state after a delay
      setTimeout(() => {
        setHasFallen(false);
      }, 2000);
    }

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(new THREE.Vector3(characterPosition.x, characterPosition.y, characterPosition.z));
    cameraPosition.z += 10; // Increased distance for zoomed out view
    cameraPosition.y += stage === 2 ? 4.5 : 3.5; // Adjusted camera height for zoomed out view

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(new THREE.Vector3(characterPosition.x, characterPosition.y, characterPosition.z));
    cameraTarget.y += 0.5;

    // Smooth camera movement
    smoothedCameraPosition.lerp(cameraPosition, delta * 5);
    smoothedCameraTarget.lerp(cameraTarget, delta * 5);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 0.5, 0]} // Positioned at y=0.5 to be on top of the ground level
      enabledRotations={[false, false, false]}
      linearDamping={4}
      angularDamping={1}
      restitution={0.2}
      // Using velocity checks for floor detection instead of collision events
    >
      <CylinderCollider args={[0.5, 0.3]} position={[0, 0.5, 0]} /> {/* Positioned to match the duck's height */}
      <group ref={characterRef}>
        <CharacterWithPhysics scale={2} /> {/* Character model at origin */}
      </group>
    </RigidBody>
  );
}

export default CharacterController;
