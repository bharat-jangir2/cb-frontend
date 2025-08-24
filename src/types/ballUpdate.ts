export interface BallUpdateData {
  updateType: 'start_ball' | 'ball_in_air' | 'runs' | 'boundary' | 'wicket' | 'extra' | 'complete_ball' | 'cancel_ball';
  matchId?: string; // Optional since we add it in the service
  inningsNumber: number;
  overNumber: number;
  ballNumber: number;
  // Player information for the ball
  strikerId?: string;
  nonStrikerId?: string;
  bowlerId?: string;
  ballInAirData?: {
    isInAir: boolean;
    airTime: number;
    trajectory: string;
    speed: number;
    direction: string;
    height: string;
  };
  runEventData?: {
    runs: number;
    runType: string;
    strikerId: string;
  };
  wicketEventData?: {
    wicketType: string;
    dismissedPlayerId: string;
    bowlerId: string;
    fielderId?: string;
    dismissalMethod: string;
  };
  extraEventData?: {
    extraType: string;
    runs: number;
    isByes: boolean;
    isLegByes: boolean;
    isNoBall: boolean;
    isWide: boolean;
  };
  notes?: string;
  updatedBy: string;
}

export interface BallUpdateResponse {
  success: boolean;
  message: string;
  ball?: CurrentBall;
  matchStats?: any;
  playerStats?: any;
}

// Current ball response from API
export interface CurrentBall {
  inningsNumber: number;
  over: number;
  ball: number;
  status: 'PENDING' | 'IN_AIR' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'not_started';
  ballStartedAt?: string;
  ballInAirAt?: string;
  ballConfirmedAt?: string;
  ballCompletedAt?: string;
  ballInAirData?: {
    isInAir: boolean;
    airTime: number;
    trajectory: string;
    speed: number;
    direction: string;
    height: string;
  };
  runs?: number;
  extras?: any;
  wicket?: any;
  commentary?: string;
  confirmationNotes?: string;
  confirmedBy?: string;
  message?: string; // For "not_started" case
}
