import { useGameStore } from '../store/useGameStore';
import { useEffect } from 'react';

export const Interface = () => {
  const phase = useGameStore((state) => state.phase);
  const stage = useGameStore((state) => state.stage);
  const start = useGameStore((state) => state.start);
  const restart = useGameStore((state) => state.restart);
  const nextStage = useGameStore((state) => state.nextStage);
  
  // Handle keyboard controls for game phases
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        if (phase === 'menu') start();
        if (phase === 'level-complete') nextStage();
        if (phase === 'game-over') restart();
      }
      
      if (event.code === 'KeyR') {
        restart();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, start, restart, nextStage]);
  
  return (
    <div className="interface">
      {/* Game title */}
      <div className="title">Duck's Adventure</div>
      
      {/* Stage indicator */}
      <div className="stage">Stage: {stage}</div>
      
      {/* Menu screen */}
      {phase === 'menu' && (
        <div className="menu">
          <h2>Welcome to Duck's Adventure</h2>
          <p>Push crates onto pressure plates to open doors and reach the goal!</p>
          <button onClick={start}>Start Game</button>
        </div>
      )}
      
      {/* Level complete screen */}
      {phase === 'level-complete' && (
        <div className="level-complete">
          <h2>Level Complete!</h2>
          <button onClick={nextStage}>Next Stage</button>
        </div>
      )}
      
      {/* Game over screen */}
      {phase === 'game-over' && (
        <div className="game-over">
          <h2>Game Over</h2>
          <button onClick={restart}>Try Again</button>
        </div>
      )}
      
      {/* Controls help */}
      <div className="controls">
        <p>WASD: Move | R: Restart | Space: Confirm</p>
      </div>
    </div>
  );
};

export default Interface;
