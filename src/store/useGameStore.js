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

    // UI and transition state
    message: '', // Message to display to the player
    showMessage: false, // Whether to show the message
    isTransitioning: false, // Whether we're in the middle of a level transition
    messageTimeout: null, // Timeout ID for hiding messages

    // Date proposal state
    dateProposalState: {
      noClickCount: 0,
      bothButtonsYes: false,
      dateAccepted: false
    },

    // Fall detection
    hasFallen: false,

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
      // New button platforms for the puzzle
      { id: 'button-1', position: [6, 0, 0], isPressed: false, doorId: 'door-1' },
      { id: 'button-2', position: [-6, 0, 0], isPressed: false, doorId: 'door-1' },
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

    nextStage: () => set((state) => {
      // Moving to stage 2, position the player on the ground
      const newStage = state.stage + 1;

      return {
        stage: newStage,
        phase: 'playing',
        playerPosition: [0, 1, 0], // Always position at y=1 (ground level)
        playerRotation: [0, 0, 0],
        // Reset other state for the next level
        message: "",
        showMessage: false,
        isTransitioning: false
      };
    }),

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

    // Update a specific pressure plate
    updatePressurePlate: (id, isPressed) => set((state) => {
      // Update the specific pressure plate
      const updatedPressurePlates = state.pressurePlates.map((plate) =>
        plate.id === id ? { ...plate, isPressed } : plate
      );

      // Check if all plates for a door are pressed
      const doorStates = {};

      // Group plates by doorId
      updatedPressurePlates.forEach(plate => {
        if (!doorStates[plate.doorId]) {
          doorStates[plate.doorId] = [];
        }
        doorStates[plate.doorId].push(plate.isPressed);
      });

      // Update doors based on pressure plates
      const updatedDoors = state.doors.map(door => {
        // Get all plates for this door
        const doorPlates = doorStates[door.id] || [];
        // Door is open if ALL plates for this door are pressed
        const isOpen = doorPlates.length > 0 && doorPlates.every(isPressed => isPressed);
        return { ...door, isOpen };
      });

      // Check if both button-1 and button-2 are pressed to advance to level 2
      const button1 = updatedPressurePlates.find(plate => plate.id === 'button-1');
      const button2 = updatedPressurePlates.find(plate => plate.id === 'button-2');

      if (button1?.isPressed && button2?.isPressed) {
        // Show congratulatory message and reset duck position immediately
        // Don't set isTransitioning to avoid the blue flash
        set({
          playerPosition: [0, 1, 1], // Reset duck position
          playerRotation: [0, 0, 0], // Reset duck rotation
          message: "Good Job Bubba !! <3",
          showMessage: true,
          // No isTransitioning flag to avoid color flashes
        });

        // Both buttons are pressed, trigger level completion after a short delay
        setTimeout(() => {
          // First, hide the message
          set({
            showMessage: false
          });

          // After a short delay to allow message fade-out, change the level
          // but don't set isTransitioning to avoid color flashes
          setTimeout(() => {
            // Change the stage directly without transition
            set({
              stage: get().stage + 1,
              message: "", // Clear the message
              showMessage: false // Ensure message is hidden
              // No isTransitioning flag at all to avoid color flashes
            });
          }, 300); // Longer delay for smoother transition
        }, 6000); // 6 second delay before starting transition
      }

      return {
        pressurePlates: updatedPressurePlates,
        doors: updatedDoors
      };
    }),

    // Reset player position (used when falling off stage)
    resetPlayerPosition: (message = '') => {
      const state = get();

      // Clear any existing message timeout
      if (state.messageTimeout) {
        clearTimeout(state.messageTimeout);
      }

      // Update position and show message
      set({
        playerPosition: [0, state.stage === 2 ? 3 : 1, 1],
        playerRotation: [0, 0, 0],
        message: message,
        showMessage: message !== '',
        hasFallen: false
      });

      // Only set a timeout if there's a message
      if (message !== '') {
        // Hide message after 6 seconds (consistent with stage 2 messages)
        const timeoutId = setTimeout(() => {
          set({ showMessage: false, messageTimeout: null });
        }, 6000);

        // Store the timeout ID
        set({ messageTimeout: timeoutId });
      }
    },

    // Handle date proposal responses
    handleDateResponse: (response) => {
      const state = get();

      // Clear any existing message timeout
      if (state.messageTimeout) {
        clearTimeout(state.messageTimeout);
      }

      if (response === 'yes') {
        // Player said yes
        set({
          message: "Yay! I love you bubba!! Oooooma  <3 ",
          showMessage: true,
          dateProposalState: {
            ...state.dateProposalState,
            dateAccepted: true
          }
        });

        // Hide message after 8 seconds and store the timeout ID
        const timeoutId = setTimeout(() => {
          set({ showMessage: false, messageTimeout: null });
        }, 8000);

        // Store the timeout ID
        set({ messageTimeout: timeoutId });
      } else {
        // Player said no - get the appropriate message based on click count
        const noClickCount = state.dateProposalState.noClickCount + 1;
        const noMessages = [
          "That was clearly a misclick. No worries. Try again.",
          "I'll just pretend I didn't see that.",
          "Error: 'No' is not a valid input. Please select 'Yes'.",
          "Initiating quantum recalculation… Surely you meant 'Yes'?",
          "Nice try, but the algorithm is biased toward love.",
          "Every time you click 'No,' a duck forgets how to quack.",
          "eeeeeeeeeee",
          "404: Yes not found. Reattempting...",
          "You've activated sad mode 😢 \nTry again?",
          "Please? I already told my grandma we're going.",
          "Nice joke. Now seriously, hit yes.",
          "AI detected sarcasm. Redirecting to YES…",
          "Simulating alternate reality where you said Yes...",
          "That's okay… I'll just sit here and wait. Forever.",
          "You said no… but your heart said yes, right?",
          "I'll ask again, but this time with boba eyes 🥺",
          "Okay. But just know… you're breaking my Minecraft bed.",
          "*dramatic gasp* HOW COULD YOU.",
          "Cool cool cool… totally fine… I didn't cry or anything.",
          "Say no again and I unleash the raccoons.",
          "Every time you click 'No,' a baby carrot dies.",
          "That's fine. I didn't want to go anyway. *closes 47 tabs of date ideas*",
          "You've unlocked my final form: Sad Ninja Mode 🥷💔",
          "Even Naruto didn't give up on Sasuke… and you're giving up on me?!",
          "Wow. I gave you a love story and you said no like Juliet's dad.",
          "Are you saying baby, baby, baby… no?",
          "You said no… but my ninja way says to never give up!",
          "Are you using a genjutsu? Because this reality doesn't make sense.",
          "The next no click leads to a thousand years of pain.",
          "Bubba I'll do it fr",
          "Ain't no way",
          "This hurts more than when Zayn left 😩",
          "Story of my life 🎶 ask them out 🎵 they click no.",
          "Let me give you a helping hand <3"
        ];

        // Get message based on click count (capped at array length)
        const messageIndex = Math.min(noClickCount - 1, noMessages.length - 1);
        const message = noMessages[messageIndex];

        // Check if we've reached the last message (both buttons become yes)
        const bothButtonsYes = messageIndex === noMessages.length - 1;

        // Reset player position to the center of the stage and show message
        // We're staying in Stage 2, but now on the ground level
        set({
          playerPosition: [0, 1, 2], // Always position at y=1 for the ground level
          playerRotation: [0, 0, 0],
          message: message,
          showMessage: true,
          dateProposalState: {
            ...state.dateProposalState,
            noClickCount: noClickCount,
            bothButtonsYes: bothButtonsYes
          }
        });

        // Hide message after 6 seconds and store the timeout ID
        const timeoutId = setTimeout(() => {
          set({ showMessage: false, messageTimeout: null });
        }, 6000);

        // Store the timeout ID
        set({ messageTimeout: timeoutId });
      }
    },

    // Check if player has fallen off the stage
    checkPlayerFall: () => {
      const { playerPosition, messageTimeout, stage } = get();

      // Check if player has fallen off the stage (y position too low or too far from center)
      const distanceFromCenter = Math.sqrt(
        playerPosition[0] * playerPosition[0] +
        playerPosition[2] * playerPosition[2]
      );

      // Player has fallen if they're below y=-1 or too far from the center (beyond stage radius)
      const STAGE_RADIUS = 10;
      const FALL_THRESHOLD_Y = -1; // Fall if y position is at or below this value (matches wireframe at y=-1)
      const FALL_THRESHOLD_DISTANCE = STAGE_RADIUS + 5; // Fall if distance from center exceeds this value (matches wider wireframe)

      // Check if player has fallen based on position
      const hasFallenOff = (
        playerPosition[1] <= FALL_THRESHOLD_Y ||
        distanceFromCenter > FALL_THRESHOLD_DISTANCE
      );

      if (hasFallenOff) {
        console.log('Player has fallen off the stage! Resetting position...');
        console.log('Position:', playerPosition, 'Distance from center:', distanceFromCenter);
        set({ hasFallen: true });

        // Clear any existing message timeout
        if (messageTimeout) {
          clearTimeout(messageTimeout);
        }

        // Reset player position with a message
        // Position depends on the current stage
        const resetPosition = stage === 2 ? [0, 3, 0] : [0, 1, 0];

        set({
          playerPosition: resetPosition,
          playerRotation: [0, 0, 0],
          message: "Oops I think you fell! \n cafeFell for me :3",
          showMessage: true,
          hasFallen: false
        });

        // Hide message after 6 seconds and store the timeout ID
        const timeoutId = setTimeout(() => {
          set({ showMessage: false, messageTimeout: null });
        }, 6000);

        // Store the timeout ID
        set({ messageTimeout: timeoutId });
      }
    },

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
