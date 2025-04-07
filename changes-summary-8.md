# Recent Changes Summary

## Improved Floor Detection for Jumping

1. **Implemented Stage-Specific Collision Detection**
   - Modified collision handlers to specifically check for the stage
   - Uses the y-position of the collided object to identify the stage (y ≈ 0)
   - This ensures the character can only jump when standing on the stage, not when colliding with crates

```jsx
onCollisionEnter={(e) => {
  // Check if the collision is with the floor (y position near 0)
  const otherBody = e.other;
  const otherPosition = otherBody.translation();
  
  // If the other body is at y=0 (approximately), it's the stage
  if (Math.abs(otherPosition.y) < 0.1) {
    setIsOnFloor(true);
  }
}}
onCollisionExit={(e) => {
  // Check if the collision that ended was with the floor
  const otherBody = e.other;
  const otherPosition = otherBody.translation();
  
  // If the other body is at y=0 (approximately), it was the stage
  if (Math.abs(otherPosition.y) < 0.1) {
    setIsOnFloor(false);
  }
}}
```

2. **Simplified Jump Logic**
   - Uses the isOnFloor state directly for jump control
   - Sets isOnFloor to false immediately after jumping to prevent double jumps
   - Relies on collision events to set isOnFloor back to true when landing on the stage

```jsx
// Handle jumping - only when on floor
if (jump && isOnFloor) {
  // Apply jump force
  setIsOnFloor(false); // Set to false immediately after jumping
  rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
}
```

## Key Benefits

1. **More Precise Jump Control**
   - Character can only jump when standing on the stage
   - Collisions with crates no longer trigger the "on floor" state
   - Prevents unintended jumps when bumping into objects

2. **Simple and Reliable Approach**
   - Uses the physics engine's built-in collision detection
   - Identifies the stage by its y-position (y ≈ 0)
   - This approach is both simple and effective for this specific game setup
