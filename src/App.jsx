import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import { AudioControls } from "./components/AudioControls";

// Define keyboard controls map
const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
];

function App() {
  // Create a wrapper component to use hooks
  function AppContent() {
    // Fixed background color - no transitions to avoid flashes
    const bgColor = "#A5D8FF"; // Very light blue background

    return (
      <>
        {/* Audio controls overlay */}
        <AudioControls />

        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows={{ type: 'PCFShadowMap' }} /* Use PCFShadowMap instead of PCFSoftShadowMap for better performance */
            camera={{ position: [0, 4.5, 16], fov: 40 }}
            dpr={[0.8, 1.2]} /* Further limit pixel ratio for better performance */
            performance={{ min: 0.6 }} /* Allow more aggressive quality reduction for performance */
          >
            <color attach="background" args={[bgColor]} /> {/* Dynamic background color */}
            <Suspense fallback={null}>
              <Physics>
                <Experience />
              </Physics>
            </Suspense>
          </Canvas>
        </KeyboardControls>
      </>
    );
  }

  // Render the AppContent component
  return <AppContent />;
}

export default App;
