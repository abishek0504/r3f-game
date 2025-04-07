# React Three Fiber Game Project Documentation

## Project Setup

1. **Created a new Vite project with React template**
   ```bash
   npm create vite@latest r3f-game -- --template react
   ```

2. **Installed dependencies**
   ```bash
   npm install three @react-three/fiber @react-three/drei
   npm install @react-three/rapier
   npm install zustand
   ```

## Tools and Utilities

### npx gltfjsx

The `gltfjsx` tool is used to automatically generate React components from GLB/GLTF files. It creates components that use the `useGLTF` hook from drei to load 3D models.

**Usage:**
```bash
npx gltfjsx path/to/model.glb -o output/Component.jsx -r public
```

**Parameters:**
- Path to the model file
- `-o`: Output file path
- `-r`: Root directory for the model path in the component

**Example:**
```bash
npx gltfjsx public/models/environment/crate.glb -o src/components/models/Crate.jsx -r public
```

This generates a React component that loads the model with the correct path reference.

## Troubleshooting

### Fixed Issues

1. **Missing imports in Experience.jsx**
   - Error: `Uncaught ReferenceError: RigidBody is not defined`
   - Solution: Added missing imports from @react-three/rapier
   ```jsx
   import { RigidBody, CylinderCollider } from "@react-three/rapier";
   ```
   - When using components from external libraries, always make sure to import them properly

2. **Deprecated parameters warning**
   - Warning: `using deprecated parameters for the initialization function; pass a single object instead`
   - This is related to Three.js and how parameters are passed to certain functions
   - This is usually a minor warning and doesn't affect functionality

## Project Structure

- `/src` - Contains React components and main application code
- `/public` - Static assets
- `/models` - 3D models for the game (in parent directory)
  - `/models/characters` - Character models (character.glb)
  - `/models/environment` - Environment models (Tree Assets.glb, crate.glb, grass.glb)

## Game State Management

### Zustand Store
- Created a game state store using Zustand in `src/store/useGameStore.js`
- Manages game state including:
  - Game phase (menu, playing, game over, level complete)
  - Player position and movement
  - Crates positions and states
  - Pressure plates and doors mechanics
  - Goal/exit state
- Provides actions for game logic:
  - Starting and restarting the game
  - Moving to the next stage
  - Updating player position
  - Checking pressure plates and doors
  - Checking if the player has reached the goal

### Game Mechanics

#### Character Controller
- Implemented in `src/components/CharacterController.jsx`
- Uses keyboard controls (WASD/Arrow keys) for movement
- Physics-based movement with RigidBody and CylinderCollider
- Features:
  - Maximum velocity constraint (MAX_VELOCITY = 3) to limit character speed
  - Normalizes horizontal velocity when it exceeds the maximum
  - Reduced movement speed for better control (moveStrength reduced from 20 to 12)
  - Cylindrical collider that better matches the duck's shape
  - Proper isOnFloor check using ray casting for jump control
  - Shortest path rotation calculation for smooth character turning
  - Wobble animation when moving for visual feedback
  - Jump functionality with Space key (only when on the ground)
  - Camera follow with smooth transitions
  - Linear damping for realistic movement
  - Proper collision detection with other objects

#### Pressure Plates and Doors
- Pressure plates (`src/components/PressurePlate.jsx`) detect when crates are placed on them
- Doors (`src/components/Door.jsx`) open when their corresponding pressure plates are activated
- Animated transitions for both pressure plates and doors

#### Crates
- Implemented in `src/components/Crates.jsx`
- Physics-based objects that can be pushed by the player
- Used to activate pressure plates

#### Goal/Exit
- Implemented in `src/components/Goal.jsx`
- Animated with hover and rotation effects
- Detects when the player reaches it to complete the level

### User Interface
- Implemented in `src/components/Interface.jsx`
- Shows game title and current stage
- Displays different screens based on game phase:
  - Menu screen with instructions
  - Level complete screen
  - Game over screen
- Shows controls help at the bottom of the screen

## Current Implementation

### App.jsx
- Sets up the Canvas with a camera
- Wraps the Experience component in Physics and Suspense
- Sets a light blue background color

### Experience.jsx
- Implements OrbitControls for camera manipulation
- Sets up enhanced lighting with proper shadow parameters
  - Ambient light with 0.6 intensity
  - Directional light with shadow casting and configured shadow camera
- Uses the World component to organize all game elements

### World.jsx
- New component that organizes all game elements with proper alignment
- Defines a consistent ground level (GROUND_LEVEL = 0) for all elements
- Creates a larger cylindrical stage (radius 10) with physics
  - Uses a natural green color (#538D4E) for the ground
  - Positioned at ground level (y=0)
  - Properly configured collider
- Places multiple crates as dynamic objects
  - Single crates with different positions and scales for variety (scales: 1.2-1.8)
  - Crate stacks (2-3 crates high) for vertical gameplay elements
  - Crate row (3 crates in a line) as a barrier/puzzle element
  - All positioned at appropriate heights (GROUND_LEVEL + 0.5, + 1.5, + 2.5)
  - All have restitution property for bouncy physics
  - Can be pushed and interacted with by the character
- Distributes multiple trees around the stage
  - Uses TreeInstance component with type parameter to select different tree types (pine, oak, willow)
  - Removed MapleTree as it was just a rectangle and not an actual tree
  - Various scales (5.6-7.2) and positions for a natural look
  - All tree RigidBodies positioned at GROUND_LEVEL (y=0)
  - Trees have position=[0, 0, 0] within their RigidBody to place them on top of the stage
  - Custom cuboid colliders (args=[0.5, 1.5, 0.5]) positioned at y=1.5 to properly surround the trees
  - Using simple geometric shapes (cones, spheres, cylinders) for tree models for better visibility and alignment
  - Added rotation variations to create a more natural forest appearance
  - Multiple trees for a denser environment
- Creates a natural grass environment
  - Enhanced GrassField component to accept position parameter for better placement
  - Modified GrassField to place grass patches at y=0.5 (on top of the ground level)
  - Uses multiple GrassField instances with different parameters for more variety and density
  - Main GrassField with 50 patches covering most of the stage area
  - Additional smaller GrassFields (10-18 patches each) in specific areas for more density
  - Various scales (1.4-1.8) for natural appearance
  - Removed colliders from grass to allow the character to move through it seamlessly
- Accepts children (like the character controller) for flexibility

### Model Components

#### Character.jsx
- Generated using npx gltfjsx
- Loads the character.glb model (duck character)
- Includes CharacterWithPhysics component for easy placement
- Used in Experience.jsx with physics (RigidBody with hull collider)
- Fixed scaling issue by setting mesh scale to 100 and component scale to 2
- Positioned higher (y=1) to be clearly visible on the stage

#### Crate.jsx
- Generated using npx gltfjsx
- Loads the crate.glb model
- Includes CrateInstance component for easy placement
- Used in Experience.jsx as dynamic objects (dynamic RigidBody)
- Multiple crates with different scales (0.4-0.6) placed around the scene

#### Tree.jsx
- Generated using npx gltfjsx
- Loads the Tree Assets.glb model
- Properly separated into individual tree components:
  - PineTree: Extracted specific mesh nodes for pine trees
  - OakTree: Extracted specific mesh nodes for oak trees
  - MapleTree: Extracted specific mesh nodes for maple trees
  - WillowTree: Extracted specific mesh nodes for willow trees
- Each tree type can be placed individually with custom position, rotation, and scale
- Used in Experience.jsx as static objects (fixed RigidBody)
- Multiple trees of different types placed around the scene with varied scales (2.8-3.6)
- Added rotation variations to create a more natural forest look

#### Grass.jsx
- Generated using npx gltfjsx
- Loads the grass.glb model
- Includes GrassPatch component for individual grass placement
- Includes GrassField component that generates multiple grass patches randomly
- Used in Experience.jsx to create a natural-looking environment
- GrassField generates 30 random grass patches within the ground radius

## Game Implementation Guide

### Loading Models

To load GLB models in React Three Fiber:

```jsx
import { useGLTF } from "@react-three/drei";

export function ModelComponent() {
  const { nodes, materials } = useGLTF("/models/path-to-model.glb");

  return (
    <group>
      <mesh
        geometry={nodes.MeshName.geometry}
        material={materials.MaterialName}
        position={[x, y, z]}
        scale={[sx, sy, sz]}
      />
    </group>
  );
}

// Preload the model
useGLTF.preload("/models/path-to-model.glb");
```

### Physics Implementation

For physics with React Three Fiber, use @react-three/rapier:

```jsx
import { Physics, RigidBody } from "@react-three/rapier";

export function PhysicsScene() {
  return (
    <Physics>
      {/* Static ground */}
      <RigidBody type="fixed">
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>

      {/* Dynamic object */}
      <RigidBody position={[0, 2, 0]}>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
    </Physics>
  );
}
```

### Character Controls

Basic character movement with keyboard controls:

```jsx
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";

export function Character() {
  const characterRef = useRef();
  const [, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();

    // Movement logic here
    if (forward) {
      // Move character forward
    }
    // Handle other directions
  });

  return (
    <RigidBody ref={characterRef} position={[0, 1, 0]}>
      {/* Character mesh */}
    </RigidBody>
  );
}
```

### Game Mechanics Implementation

#### Pressure Plates and Doors

```jsx
import { useState, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";

export function PressurePlate({ position, onActivate, onDeactivate }) {
  const [isPressed, setIsPressed] = useState(false);

  // Collision detection logic

  useEffect(() => {
    if (isPressed) {
      onActivate();
    } else {
      onDeactivate();
    }
  }, [isPressed, onActivate, onDeactivate]);

  return (
    <RigidBody type="fixed" position={position}>
      <mesh position={[0, isPressed ? 0.05 : 0.1, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color={isPressed ? "red" : "gray"} />
      </mesh>
    </RigidBody>
  );
}

export function Door({ position, isOpen }) {
  return (
    <RigidBody type="kinematicPosition" position={position}>
      <mesh position={[0, isOpen ? 2 : 0, 0]}>
        <boxGeometry args={[1, 2, 0.2]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </RigidBody>
  );
}
```

#### Crate Pushing Mechanics

```jsx
// In your Experience component
const [cratePosition, setCratePosition] = useState([0, 0.5, 0]);

// Detect collisions between character and crate
// Update crate position based on character movement
```

### Shaders and Visual Effects

For low-poly aesthetic with shaders:

```jsx
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

// Create custom shader material
const LowPolyMaterial = shaderMaterial(
  // Uniforms
  {
    time: 0,
    color: new THREE.Color(0.2, 0.8, 0.5)
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec3 color;
    uniform float time;

    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Register the material
extend({ LowPolyMaterial });

// Use in component
function Scene() {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    materialRef.current.time = clock.getElapsedTime();
  });

  return (
    <mesh>
      <boxGeometry />
      <lowPolyMaterial ref={materialRef} color="green" />
    </mesh>
  );
}
```

## Running the Project

- Development: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Additional Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Rapier (Physics)](https://github.com/pmndrs/react-three-rapier)
