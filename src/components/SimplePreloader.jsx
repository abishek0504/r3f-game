import React, { useEffect } from 'react';
import { useProgress } from '@react-three/drei';

// A simpler, more efficient preloader component
export function SimplePreloader() {
  const { active, progress } = useProgress();
  
  // Hide the HTML loading screen when the 3D scene is ready
  useEffect(() => {
    if (!active && progress === 100) {
      // Find the loading screen element
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        // Fade out and remove
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
    }
  }, [active, progress]);
  
  // This component doesn't render anything in the React tree
  return null;
}

export default SimplePreloader;
