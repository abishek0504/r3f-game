import { Sky } from "@react-three/drei";
import CharacterController from "./CharacterController";
import { World } from "./World";

export const Experience = () => {
  return (
    <>
      {/* ENVIRONMENT */}
      <Sky
        distance={450000}
        sunPosition={[5, 1, 0]}
        inclination={0.6}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={8}
      />

      {/* LIGHTS */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* WORLD - Contains all game elements with proper alignment */}
      <World>
        {/* CHARACTER */}
        <CharacterController />
      </World>
    </>
  );
};
