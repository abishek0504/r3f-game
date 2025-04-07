import React from 'react';
import { Cylinder } from '@react-three/drei';
import { TreeInstance } from './models/SimpleTrees';
import { GrassField } from './models/Grass';
import { CrateInstance } from './models/Crate';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';

// World component to organize all game elements with proper alignment
export function World({ children }) {
  // Get the current state of the canvas if needed
  // const { scene } = useThree();

  // Define the ground level - all objects will be positioned relative to this
  const GROUND_LEVEL = 0;

  // Define the stage radius
  const STAGE_RADIUS = 10;

  return (
    <group>
      {/* Sky is handled in Experience.jsx */}

      {/* WATER PLANE - Reduced size to not obscure the sky */}
      <mesh
        position={[0, GROUND_LEVEL - 1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} /> {/* Reduced from 100x100 to 50x50 */}
        <meshStandardMaterial
          color="#4d80e4"
          metalness={0.2}
          roughness={0.7}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* STAGE */}
      <RigidBody type="fixed" position={[0, GROUND_LEVEL, 0]} colliders={false}>
        <CylinderCollider args={[0.5, STAGE_RADIUS]} />
        <Cylinder scale={[STAGE_RADIUS, 1, STAGE_RADIUS]} receiveShadow>
          <meshStandardMaterial color="#538D4E" />
        </Cylinder>
      </RigidBody>

      {/* CRATES */}
      {/* Single crates */}
      <RigidBody type="dynamic" position={[3, GROUND_LEVEL + 0.5, 2]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.5} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      <RigidBody type="dynamic" position={[-2, GROUND_LEVEL + 0.5, 3]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.2} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      <RigidBody type="dynamic" position={[4, GROUND_LEVEL + 0.5, -2]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.8} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Crate stack 1 */}
      <RigidBody type="dynamic" position={[-4, GROUND_LEVEL + 0.5, -3]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.3} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      <RigidBody type="dynamic" position={[-4, GROUND_LEVEL + 1.5, -3]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.1} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Crate stack 2 */}
      <RigidBody type="dynamic" position={[5, GROUND_LEVEL + 0.5, 5]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.4} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      <RigidBody type="dynamic" position={[5, GROUND_LEVEL + 1.5, 5]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.2} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      <RigidBody type="dynamic" position={[5, GROUND_LEVEL + 2.5, 5]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.0} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      {/* Crate row */}
      <RigidBody type="dynamic" position={[0, GROUND_LEVEL + 0.5, 6]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.3} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      <RigidBody type="dynamic" position={[2, GROUND_LEVEL + 0.5, 6]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.3} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      <RigidBody type="dynamic" position={[-2, GROUND_LEVEL + 0.5, 6]} restitution={0.2} colliders={false}>
        <CrateInstance scale={511.3} />
        <CuboidCollider args={[0.4, 0.4, 0.4]} position={[0, 0, 0]} />
      </RigidBody>

      {/* TREES */}
      <RigidBody type="fixed" position={[-5, GROUND_LEVEL, -5]} colliders={false}>
        <TreeInstance type="pine" scale={2} position={[0, 3, 0]} /> {/* Tree positioned with stump on ground */}
        <CuboidCollider args={[0.5, 1.5, 0.5]} position={[0, 1.5, 0]} /> {/* Collider positioned to properly surround the tree */}
      </RigidBody>

      <RigidBody type="fixed" position={[6, GROUND_LEVEL, 1]} colliders={false}>
        <TreeInstance type="oak" scale={2} position={[0, 3, 0]} /> {/* Tree positioned with stump on ground */}
        <CuboidCollider args={[0.5, 1.5, 0.5]} position={[0, 1.5, 0]} /> {/* Collider positioned to properly surround the tree */}
      </RigidBody>

      <RigidBody type="fixed" position={[7, GROUND_LEVEL, -4]} colliders={false}>
        <TreeInstance type="willow" scale={2} position={[0, 3, 0]} /> {/* Tree positioned with stump on ground */}
        <CuboidCollider args={[0.5, 1.5, 0.5]} position={[0, 1.5, 0]} /> {/* Collider positioned to properly surround the tree */}
      </RigidBody>

      <RigidBody type="fixed" position={[-7, GROUND_LEVEL, 2]} colliders={false}>
        <TreeInstance type="pine" scale={2} position={[0, 3, 0]} rotation={[0, Math.PI / 3, 0]} /> {/* Tree positioned with stump on ground */}
        <CuboidCollider args={[0.5, 1.5, 0.5]} position={[0, 1.5, 0]} /> {/* Collider positioned to properly surround the tree */}
      </RigidBody>

      <RigidBody type="fixed" position={[0, GROUND_LEVEL, -7]} colliders={false}>
        <TreeInstance type="oak" scale={2} position={[0, 3, 0]} rotation={[0, Math.PI / 5, 0]} /> {/* Tree positioned with stump on ground */}
        <CuboidCollider args={[0.5, 1.5, 0.5]} position={[0, 1.5, 0]} /> {/* Collider positioned to properly surround the tree */}
      </RigidBody>

      <RigidBody type="fixed" position={[8, GROUND_LEVEL, 3]} colliders={false}>
        <TreeInstance type="willow" scale={2} position={[0, 3, 0]} rotation={[0, Math.PI / 6, 0]} /> {/* Tree positioned with stump on ground */}
        <CuboidCollider args={[0.5, 1.5, 0.5]} position={[0, 1.5, 0]} /> {/* Collider positioned to properly surround the tree */}
      </RigidBody>

      {/* GRASS */}
      <GrassField patchCount={50} radius={STAGE_RADIUS - 2} scale={1.5} position={[0, GROUND_LEVEL, 0]} />
      <GrassField patchCount={15} radius={3} scale={1.7} position={[2, GROUND_LEVEL, 4]} />
      <GrassField patchCount={12} radius={2.5} scale={1.4} position={[-4, GROUND_LEVEL, 2]} />
      <GrassField patchCount={18} radius={3.2} scale={1.6} position={[3, GROUND_LEVEL, -3]} />
      <GrassField patchCount={10} radius={2} scale={1.8} position={[-3, GROUND_LEVEL, -4]} />

      {/* CHARACTER AND OTHER ELEMENTS */}
      {children}
    </group>
  );
}
