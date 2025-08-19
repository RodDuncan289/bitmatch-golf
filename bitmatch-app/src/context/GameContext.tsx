import React, { createContext, useReducer, useContext } from 'react';
import type { Dispatch } from 'react';

// 1. State and Action Types
interface Player {
  name: string;
}

interface Team {
  playerA: Player;
  playerB: Player;
}

interface HoleResult {
  bits: {
    team1: number;
    team2: number;
  };
  matchplay: 'win' | 'loss' | 'draw' | null;
}

interface GameState {
  bitValue: 0.20 | 0.50 | 1.00;
  startingHole: 1 | 10;
  team1: Team;
  team2: Team;
  currentHole: number;
  holes: Record<number, HoleResult>;
  appState: 'setup' | 'playing' | 'summary';
}

type Action =
  | { type: 'START_GAME'; payload: { team1: Team; team2: Team; bitValue: 0.20 | 0.50 | 1.00; startingHole: 1 | 10; } }
  | { type: 'UPDATE_BITS'; payload: { hole: number; team: 'team1' | 'team2'; change: number } }
  | { type: 'UPDATE_MATCHPLAY'; payload: { hole: number; result: 'win' | 'loss' | 'draw' } }
  | { type: 'SET_CURRENT_HOLE'; payload: number }
  | { type: 'END_GAME' }
  | { type: 'NEW_GAME' };

// 2. Initial State
const initialState: GameState = {
  bitValue: 0.20,
  startingHole: 1,
  team1: { playerA: { name: '' }, playerB: { name: '' } },
  team2: { playerA: { name: '' }, playerB: { name: '' } },
  currentHole: 1,
  holes: {},
  appState: 'setup',
};

// Helper function to initialize a hole if it doesn't exist
const ensureHole = (state: GameState, hole: number): GameState => {
  if (!state.holes[hole]) {
    return {
      ...state,
      holes: {
        ...state.holes,
        [hole]: {
          bits: { team1: 0, team2: 0 },
          matchplay: null,
        },
      },
    };
  }
  return state;
};

// 3. Reducer Function
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        ...action.payload,
        appState: 'playing',
        currentHole: action.payload.startingHole,
        holes: {}, // Reset holes
      };
    case 'UPDATE_BITS': {
      const stateWithHole = ensureHole(state, action.payload.hole);
      const newHoles = { ...stateWithHole.holes };
      newHoles[action.payload.hole].bits[action.payload.team] += action.payload.change;
      return { ...stateWithHole, holes: newHoles };
    }
    case 'UPDATE_MATCHPLAY': {
        const stateWithHole = ensureHole(state, action.payload.hole);
        const newHoles = { ...stateWithHole.holes };
        newHoles[action.payload.hole].matchplay = action.payload.result;
        return { ...stateWithHole, holes: newHoles };
    }
    case 'SET_CURRENT_HOLE':
        return { ...state, currentHole: action.payload };
    case 'END_GAME':
        return { ...state, appState: 'summary' };
    case 'NEW_GAME':
        return initialState;
    default:
      return state;
  }
};

// 4. GameContext
interface GameContextProps {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

// 5. GameProvider Component
export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// 6. useGame Hook
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
