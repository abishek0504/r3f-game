# Recent Changes Summary

## Fixed Crate Alignment with Colliders

1. **Adjusted Crate Model Position**
   - Modified the CrateInstance component to position the crate model at [0, -0.5, 0]
   - This centers the crate model within its collider box
   - Ensures the crate is visually aligned with its physics representation

```jsx
export function CrateInstance({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation}>
      <Crate scale={scale} position={[0, -0.5, 0]} />
    </group>
  )
}
```

2. **Maintained Large Scale Values**
   - Kept all crate scales at over 500 (511.0-511.8) as required
   - This ensures proper visibility of the crates in the scene

## Improved Jumping Logic (Maintained)

1. **Collision-Based Floor Detection**
   - Using isOnFloor state to track when character is on a surface
   - Setting isOnFloor to false immediately after jumping
   - Using onCollisionEnter to set isOnFloor back to true when landing

```jsx
// Jump only when on floor and set isOnFloor to false immediately
if (jump && isOnFloor) {
  rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
  setIsOnFloor(false);
}
```

## Key Insights

1. **Model Positioning Within Colliders**
   - For proper alignment, models often need to be positioned relative to their colliders
   - In this case, moving the crate model down by 0.5 units centers it within its collider
   - This approach maintains the physics behavior while fixing the visual representation

2. **Scale vs. Position**
   - Large scale values (over 500) are needed for proper visibility
   - Position adjustments are needed for proper alignment with colliders
   - These two aspects need to be handled separately
