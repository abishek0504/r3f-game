# Recent Changes Summary

## Fixed Crate Visibility

1. **Corrected Crate Scales**
   - Fixed incorrect scale values (511.x) to proper values (1.0-1.8)
   - Added receiveShadow property to crate meshes for better visual appearance
   - Maintained the same positioning at GROUND_LEVEL + 0.5, + 1.5, + 2.5

```jsx
// Example of fixed crate scale
<RigidBody type="dynamic" position={[5, GROUND_LEVEL + 0.5, 5]} restitution={0.2}>
  <CrateInstance scale={1.4} /> // Fixed from 511.4
</RigidBody>
```

2. **Enhanced Crate Component**
   - Added receiveShadow property to crate meshes
   - This ensures crates properly receive shadows from other objects

```jsx
<mesh geometry={nodes.Crate_1.geometry} material={materials.DarkWood} castShadow receiveShadow />
<mesh geometry={nodes.Crate_2.geometry} material={materials.Wood} castShadow receiveShadow />
```

## Improved Jumping Logic

1. **Added Collision-Based Floor Detection**
   - Replaced velocity-based floor detection with collision events
   - Added isOnFloor state to track when character is on a surface
   - Set isOnFloor to false immediately after jumping

```jsx
// State for floor detection
const [isOnFloor, setIsOnFloor] = useState(false);

// Collision handlers
onCollisionEnter={() => {
  // When collision occurs, set isOnFloor to true
  setIsOnFloor(true);
}}

// Jump only when on floor and set isOnFloor to false immediately
if (jump && isOnFloor) {
  rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
  setIsOnFloor(false);
}
```

2. **Benefits of the New Approach**
   - More reliable jumping (only when actually on a surface)
   - Prevents "air jumping" or double jumping unless specifically allowed
   - Better physics interaction with the environment
   - Allows for more complex gameplay mechanics in the future

## Code Cleanup

1. **Removed Unused Variables**
   - Commented out unused useThree import and scene variable
   - Improved code readability and reduced potential errors

2. **Added Proper Comments**
   - Documented the collision-based floor detection approach
   - Explained the purpose of setting isOnFloor to false after jumping
