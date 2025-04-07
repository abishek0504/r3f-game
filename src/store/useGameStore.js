import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * Game store using Zustand
 * Manages game state including:
 * - Player position and movement
 * - Game phase (menu, playing, game over)
 * - Level/stage information
 * - Game mechanics (crates, pressure plates, doors)
 */
export const useGameStore = create(
  subscribeWithSelector((set, get) => ({
    // Game phase
    phase: 'menu', // 'menu', 'playing', 'game-over', 'level-complete'
    stage: 1, // Current stage/level
    
    // Player state
    playerPosition: [0, 1, 0], // [x, y, z]
    playerRotation: [0, 0, 0], // [x, y, z]
    isMoving: false,
    
    // Game objects
    crates: [
      { id: 'crate-1', position: [3, 0.5, 2], isOnPressurePlate: false },
      { id: 'crate-2', position: [-2, 0.5, 3], isOnPressurePlate: false },
      { id: 'crate-3', position: [4, 0.5, -2], isOnPressurePlate: false },
    ],
    
    // Game mechanics
    pressurePlates: [
      { id: 'plate-1', position: [4, 0.1, 4], isPressed: false, doorId: 'door-1' },
      { id: 'plate-2', position: [-4, 0.1, -4], isPressed: false, doorId: 'door-2' },
    ],
    
    doors: [
      { id: 'door-1', position: [0, 0, 5], isOpen: false },
      { id: 'door-2', position: [5, 0, 0], isOpen: false },
    ],
    
    // Goal/exit
    goal: { position: [8, 0.5, 8], isReached: false },
    
    // Actions
    start: () => set({ phase: 'playing' }),
    
    restart: () => set({
      phase: 'playing',
      playerPosition: [0, 1, 0],
      playerRotation: [0, 0, 0],
      crates: [
        { id: 'crate-1', position: [3, 0.5, 2], isOnPressurePlate: false },
        { id: 'crate-2', position: [-2, 0.5, 3], isOnPressurePlate: false },
        { id: 'crate-3', position: [4, 0.5, -2], isOnPressurePlate: false },
      ],
      pressurePlates: [
        { id: 'plate-1', position: [4, 0.1, 4], isPressed: false, doorId: 'door-1' },
        { id: 'plate-2', position: [-4, 0.1, -4], isPressed: false, doorId: 'door-2' },
      ],
      doors: [
        { id: 'door-1', position: [0, 0, 5], isOpen: false },
        { id: 'door-2', position: [5, 0, 0], isOpen: false },
      ],
      goal: { position: [8, 0.5, 8], isReached: false },
    }),
    
    nextStage: () => set((state) => ({ 
      stage: state.stage + 1,
      phase: 'playing',
      playerPosition: [0, 1, 0],
      playerRotation: [0, 0, 0],
      // Reset other state for the next level
    })),
    
    gameOver: () => set({ phase: 'game-over' }),
    
    completeLevel: () => set({ phase: 'level-complete' }),
    
    // Player movement
    setPlayerPosition: (position) => set({ playerPosition: position }),
    
    setPlayerRotation: (rotation) => set({ playerRotation: rotation }),
    
    setIsMoving: (isMoving) => set({ isMoving }),
    
    // Game mechanics
    updateCratePosition: (id, position) => set((state) => ({
      crates: state.crates.map((crate) => 
        crate.id === id ? { ...crate, position } : crate
      )
    })),
    
    checkPressurePlates: () => {
      const { crates, pressurePlates, doors } = get();
      
      // Create a new array to track updated pressure plates
      const updatedPressurePlates = pressurePlates.map(plate => {
        // Check if any crate is on this pressure plate
        const isPressed = crates.some(crate => {
          const distance = Math.sqrt(
            Math.pow(crate.position[0] - plate.position[0], 2) +
            Math.pow(crate.position[2] - plate.position[2], 2)
          );
          return distance < 1; // If crate is within 1 unit of the plate
        });
        
        return { ...plate, isPressed };
      });
      
      // Create a new array to track updated doors
      const updatedDoors = doors.map(door => {
        // Find the pressure plate that controls this door
        const controlPlate = updatedPressurePlates.find(plate => plate.doorId === door.id);
        // Update door state based on pressure plate
        return { ...door, isOpen: controlPlate ? controlPlate.isPressed : door.isOpen };
      });
      
      // Update the state with the new pressure plates and doors
      set({ 
        pressurePlates: updatedPressurePlates,
        doors: updatedDoors
      });
    },
    
    checkGoal: () => {
      const { playerPosition, goal, phase } = get();
      
      if (phase !== 'playing') return;
      
      const distance = Math.sqrt(
        Math.pow(playerPosition[0] - goal.position[0], 2) +
        Math.pow(playerPosition[2] - goal.position[2], 2)
      );
      
      if (distance < 1.5 && !goal.isReached) {
        set({ 
          goal: { ...goal, isReached: true },
          phase: 'level-complete'
        });
      }
    }
  }))
);

// Export a hook to access specific parts of the store
export const usePlayerPosition = () => useGameStore((state) => state.playerPosition);
export const usePlayerRotation = () => useGameStore((state) => state.playerRotation);
export const useGamePhase = () => useGameStore((state) => state.phase);
export const useCrates = () => useGameStore((state) => state.crates);
export const usePressurePlates = () => useGameStore((state) => state.pressurePlates);
export const useDoors = () => useGameStore((state) => state.doors);
