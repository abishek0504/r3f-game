import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

// Tree 1 component
export function Tree1({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const group = useRef()
  const { scene } = useGLTF('/models/environment/Tree.glb')

  // Clone the scene to avoid sharing issues
  const clonedScene = scene.clone()

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Tree 2 component
export function Tree2({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const group = useRef()
  const { scene } = useGLTF('/models/environment/Tree-2.glb')

  // Clone the scene to avoid sharing issues
  const clonedScene = scene.clone()

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Tree instance component that selects the appropriate tree type
export function TreeInstance({ type = 'pine', ...props }) {
  switch (type) {
    case 'pine':
      return <Tree1 {...props} />
    case 'oak':
      return <Tree2 {...props} />
    case 'willow':
      return <Tree1 {...props} rotation={[0, Math.PI / 2, 0]} />
    case 'maple':
      return <Tree2 {...props} rotation={[0, Math.PI / 3, 0]} />
    default:
      return <Tree1 {...props} />
  }
}

// Preload models
useGLTF.preload('/models/environment/Tree.glb')
useGLTF.preload('/models/environment/Tree-2.glb')
