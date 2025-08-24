import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface BallUpdateState {
  currentBall: any;
  ballStatus: string;
  matchStats: any;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

interface BallUpdateContextType extends BallUpdateState {
  dispatch: React.Dispatch<any>;
  actions: typeof BALL_ACTIONS;
}

const BallUpdateContext = createContext<BallUpdateContextType | undefined>(undefined);

// Action types
export const BALL_ACTIONS = {
  SET_CURRENT_BALL: 'SET_CURRENT_BALL',
  UPDATE_BALL_STATUS: 'UPDATE_BALL_STATUS',
  UPDATE_MATCH_STATS: 'UPDATE_MATCH_STATS',
  RESET_BALL: 'RESET_BALL',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState: BallUpdateState = {
  currentBall: null,
  ballStatus: 'idle', // idle, pending, in_air, confirmed, completed, cancelled
  matchStats: null,
  loading: false,
  error: null,
  lastUpdate: null
};

// Reducer
function ballUpdateReducer(state: BallUpdateState, action: any): BallUpdateState {
  switch (action.type) {
    case BALL_ACTIONS.SET_CURRENT_BALL:
      return {
        ...state,
        currentBall: action.payload,
        ballStatus: action.payload?.ballStatus || 'idle'
      };
    
    case BALL_ACTIONS.UPDATE_BALL_STATUS:
      return {
        ...state,
        ballStatus: action.payload.status,
        currentBall: action.payload.ball
      };
    
    case BALL_ACTIONS.UPDATE_MATCH_STATS:
      return {
        ...state,
        matchStats: action.payload,
        lastUpdate: new Date()
      };
    
    case BALL_ACTIONS.RESET_BALL:
      return {
        ...state,
        currentBall: null,
        ballStatus: 'idle'
      };
    
    case BALL_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case BALL_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
}

// Provider component
export function BallUpdateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ballUpdateReducer, initialState);

  const value: BallUpdateContextType = {
    ...state,
    dispatch,
    actions: BALL_ACTIONS
  };

  return (
    <BallUpdateContext.Provider value={value}>
      {children}
    </BallUpdateContext.Provider>
  );
}

// Custom hook
export function useBallUpdate() {
  const context = useContext(BallUpdateContext);
  if (!context) {
    throw new Error('useBallUpdate must be used within a BallUpdateProvider');
  }
  return context;
}
