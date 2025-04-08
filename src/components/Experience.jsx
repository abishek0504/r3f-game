import { Environment } from "@react-three/drei";
import { Preload, PerformanceMonitor } from "@react-three/drei";
import CharacterController from "./CharacterController";
import { World } from "./World";
import { LevelMessage } from "./LevelMessage";
import { useGameStore } from "../store/useGameStore";
import { SimplePreloader } from "./SimplePreloader";
import * as THREE from "three";


export const Experience = () => {
  // Get the current stage
  const stage = useGameStore(state => state.stage);

  // No opacity transitions to avoid flashes

  return (
    <group>
      {/* No opacity transitions to avoid flashes */}
      {/* PERFORMANCE MONITORING */}
      <PerformanceMonitor
        onDecline={(fps) => {
          console.log('Performance declining, current FPS:', fps);
          // Could automatically reduce quality settings here
        }}
      />

      {/* ENVIRONMENT */}
      {/* Always render the Sky component */}
      {/* Fixed color sky to match #A5D8FF */}
      <color attach="background" args={["#A5D8FF"]} />

      {/* Create a large sphere to simulate the sky with exact color */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[5000, 32, 32]} attach="geometry" />
        <meshBasicMaterial
          color="#A5D8FF"
          side={THREE.BackSide}
          fog={false}
          toneMapped={false}
          attach="material"
        />
      </mesh>

      {/* LIGHTS */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
        color={"#A5D8FF"} /* Very light blue color */
        shadow-mapSize={[512, 512]} /* Reduced for better performance */
        shadow-camera-far={25} /* Reduced for better performance */
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
        shadow-radius={3} /* Increased blur for better performance */
        shadow-normalBias={0.05}
      />

      {/* WORLD - Contains all game elements with proper alignment */}
      <World>
        {/* CHARACTER */}
        <CharacterController />
      </World>

      {/* LEVEL MESSAGE - Only for Stage 1 */}
      {stage === 1 && <LevelMessage />}

      {/* PRELOAD ASSETS */}
      <Preload all />

      {/* PRELOADER - Handles loading screen */}
      <SimplePreloader />
    </group>
  );
};
