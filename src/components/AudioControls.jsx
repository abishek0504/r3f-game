import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import catCafeMusic from '../assets/cat cafe.mp3';

export function AudioControls() {
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sound = useRef(null);
  const audioContext = useRef(null);
  
  // Handle any user interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        
        // Resume AudioContext if it exists
        if (audioContext.current && audioContext.current.state === 'suspended') {
          audioContext.current.resume().then(() => {
            console.log('AudioContext resumed successfully');
          });
        }
      }
    };
    
    // Listen for various user interactions
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);
  
  // Handle keyboard events for muting/unmuting
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'm' || event.key === 'M') {
        setIsMuted(prev => {
          const newMuted = !prev;
          
          // Update audio volume based on mute state
          if (sound.current) {
            sound.current.setVolume(newMuted ? 0 : 0.5);
          }
          
          console.log(newMuted ? 'Music muted' : 'Music unmuted');
          return newMuted;
        });
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Load audio only once
  useEffect(() => {
    // Only set up audio once
    if (sound.current) return;
    
    // Create an audio listener
    const listener = new THREE.AudioListener();
    
    // Store the AudioContext for later use
    audioContext.current = listener.context;
    
    // Create a global audio source
    const audio = new THREE.Audio(listener);
    sound.current = audio;
    
    // Load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    
    audioLoader.load(
      catCafeMusic,
      (buffer) => {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(isMuted ? 0 : 0.5);
        
        // Only auto-play if user has interacted with the page
        if (hasInteracted) {
          audio.play();
        } else {
          console.log('Music loaded. Waiting for user interaction to play...');
        }
        
        console.log('Background music ready. Press M to mute/unmute.');
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (err) => {
        console.error('An error occurred while loading audio:', err);
      }
    );
    
    // Clean up
    return () => {
      if (sound.current) {
        sound.current.stop();
        if (sound.current.disconnect) {
          sound.current.disconnect();
        }
      }
    };
  }, []); // Only run once
  
  // Play music when user interacts with the page
  useEffect(() => {
    if (hasInteracted && sound.current) {
      // Try to play the sound only if it's not already playing
      try {
        if (!sound.current.isPlaying) {
          sound.current.play();
          console.log('Music started after user interaction');
        }
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  }, [hasInteracted]);
  
  // Update volume when mute state changes
  useEffect(() => {
    if (sound.current) {
      sound.current.setVolume(isMuted ? 0 : 0.5);
    }
  }, [isMuted]);
  
  return (
    <div className="audio-controls" style={{
      position: 'fixed',
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
    }}>
      {!hasInteracted ? '🎵 Click anywhere to start music' :
        isMuted ? '🔇 Muted (Press M to unmute)' : '🔊 Music On (Press M to mute)'}
    </div>
  );
}
