import { Environment } from "@react-three/drei";
import { Sky, Preload, PerformanceMonitor } from "@react-three/drei";
import CharacterController from "./CharacterController";
import { World } from "./World";

export const Experience = () => {
  return (
    <>
      {/* PERFORMANCE MONITORING */}
      <PerformanceMonitor
        onDecline={(fps) => {
          console.log('Performance declining, current FPS:', fps);
          // Could automatically reduce quality settings here
        }}
      />

      {/* ENVIRONMENT */}
      <Sky
        distance={300000} /* Reduced distance for better performance */
        sunPosition={[5, 1, 0]}
        inclination={0.6}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={8}
        segments={20} /* Reduced segments for better performance */
      />

      {/* LIGHTS */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
        color={"#ffffff"}
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

      {/* PRELOAD ASSETS */}
      <Preload all />
    </>
  );
};
