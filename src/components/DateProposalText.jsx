import React from 'react';
import { Text } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore';

export function DateProposalText({ position = [0, 2.5, -1] }) {
  // Get message and showMessage from the game store
  const message = useGameStore(state => state.message);
  const showMessage = useGameStore(state => state.showMessage);
  const stage = useGameStore(state => state.stage);

  // Only show this component for Stage 2
  if (stage !== 2) return null;

  // If there's a message to show, display it instead of the default text
  const displayText = showMessage ? message : "Will you go on a date with me?";

  // Always use pink color for text
  const textColor = "#ff69b4";

  // Make the text a bit larger for messages
  const fontSize = showMessage ? 0.6 : 0.5;

  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={textColor}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#000000"
      maxWidth={6}
      textAlign="center"
    >
      {displayText}
    </Text>
  );
}
