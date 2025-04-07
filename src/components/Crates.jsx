import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';
import { CrateInstance } from './models/Crate';

export function Crate({ id, position }) {
  const crateRef = useRef();
  const updateCratePosition = useGameStore((state) => state.updateCratePosition);
  
  // Update crate position in the store when it moves
  useFrame(() => {
    if (crateRef.current) {
      const pos = crateRef.current.translation();
      updateCratePosition(id, [pos.x, pos.y, pos.z]);
    }
  });
  
  return (
    <RigidBody
      ref={crateRef}
      type="dynamic"
      position={position}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      colliders="cuboid"
    >
      <CrateInstance scale={0.5} />
    </RigidBody>
  );
}

export function Crates() {
  const crates = useGameStore((state) => state.crates);
  
  return (
    <group>
      {crates.map((crate) => (
        <Crate
          key={crate.id}
          id={crate.id}
          position={crate.position}
        />
      ))}
    </group>
  );
}

export default Crates;
