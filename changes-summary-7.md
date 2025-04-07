# Recent Changes Summary

## Improved Floor Detection for Jumping

1. **Implemented Ray Casting for Floor Detection**
   - Replaced collision-based floor detection with ray casting
   - Added `useRapier` hook to access the physics world and ray casting functionality
   - Created a `checkIfOnFloor()` function that casts a ray downward from the character
   - This ensures the character can only jump when standing on the floor, not when colliding with crates

```jsx
// Function to check if character is on floor using ray casting
const checkIfOnFloor = () => {
  if (!rigidBodyRef.current) return false;
  
  // Get the character's current position
  const characterPosition = rigidBodyRef.current.translation();
  
  // Create a ray from the character position downward
  const rayOrigin = { x: characterPosition.x, y: characterPosition.y, z: characterPosition.z };
  const rayDirection = { x: 0, y: -1, z: 0 }; // Downward direction
  
  // Create the ray
  const ray = new rapier.Ray(rayOrigin, rayDirection);
  
  // Cast the ray and check for intersection with the floor
  const hit = world.castRay(ray, 0.6, true); // 0.6 is the max distance
  
  // If we hit something and it's close enough, we're on the floor
  if (hit && hit.toi < 0.6) {
    return true;
  }
  
  return false;
};
```

2. **Continuous Floor Detection in Game Loop**
   - Added floor detection check in the `useFrame` function
   - Updates the `isOnFloor` state only when the floor status changes
   - Uses the ray casting result directly for jump logic
   - Removed the collision event handlers that were previously used

```jsx
// Check if character is on floor using ray casting
const onFloor = checkIfOnFloor();

// Update isOnFloor state if it changed
if (onFloor !== isOnFloor) {
  setIsOnFloor(onFloor);
}

// Handle jumping - only when on floor
if (jump && onFloor) {
  // Apply jump force
  setIsOnFloor(false); // Set to false immediately after jumping
  rigidBodyRef.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
}
```

## Key Benefits

1. **More Precise Jump Control**
   - Character can only jump when standing on the floor
   - Collisions with crates no longer trigger the "on floor" state
   - Prevents unintended jumps when bumping into objects

2. **Better Physics Interaction**
   - Ray casting provides a more reliable way to detect the floor
   - The 0.6 unit distance threshold can be adjusted for different character sizes
   - This approach is commonly used in professional game development
