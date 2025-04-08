import React from 'react';
import { Html } from '@react-three/drei';

export function MuteIndicator({ isMuted, hasInteracted = true }) {
  return (
    <Html
      position={[0, 0, 0]}
      wrapperClass="mute-indicator"
      prepend
      fullscreen
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1000,
      }}
    >
      {!hasInteracted ? '🎵 Click anywhere to start music' :
        isMuted ? '🔇 Muted (Press M to unmute)' : '🔊 Music On (Press M to mute)'}
    </Html>
  );
}
