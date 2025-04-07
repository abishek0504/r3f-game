import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";

// Define keyboard controls map
const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        shadows={{ type: 'PCFShadowMap' }} /* Use PCFShadowMap instead of PCFSoftShadowMap for better performance */
        camera={{ position: [0, 6, 14], fov: 42 }}
        dpr={[0.8, 1.2]} /* Further limit pixel ratio for better performance */
        performance={{ min: 0.6 }} /* Allow more aggressive quality reduction for performance */
      >
        <color attach="background" args={["#87ceeb"]} /> {/* Sky blue background */}
        <Suspense fallback={null}>
          <Physics>
            <Experience />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
