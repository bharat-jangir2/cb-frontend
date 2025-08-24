export enum BallStatus {
  PENDING = "pending",           // Ball not yet started
  IN_AIR = "in_air",            // Ball is in play (being bowled)
  CONFIRMED = "confirmed",       // Ball result confirmed
  COMPLETED = "completed"        // Ball fully processed
}

export enum BallType {
  NORMAL = "normal",
  WIDE = "wide",
  NO_BALL = "no_ball",
  BYE = "bye",
  LEG_BYE = "leg_bye",
  DEAD_BALL = "dead_ball"
}

export enum BallResult {
  DOT_BALL = "dot_ball",
  SINGLE = "single",
  DOUBLE = "double",
  TRIPLE = "triple",
  FOUR = "four",
  SIX = "six",
  WICKET = "wicket",
  RUN_OUT = "run_out",
  STUMPED = "stumped",
  LBW = "lbw",
  BOWLED = "bowled",
  CAUGHT = "caught",
  HIT_WICKET = "hit_wicket",
  OBSTRUCTING_FIELD = "obstructing_field",
  HANDLED_BALL = "handled_ball",
  HIT_BALL_TWICE = "hit_ball_twice",
  TIMED_OUT = "timed_out",
  RETIRED_OUT = "retired_out",
  RETIRED_HURT = "retired_hurt"
}

export interface BallUpdate {
  _id?: string;
  matchId: string;
  inningsNumber: number;
  overNumber: number;
  ballNumber: number;           // Ball within the over (1-6)
  ballIndex: number;            // Global ball index
  
  // Ball Status
  status: BallStatus;
  ballType: BallType;
  result?: BallResult;
  
  // Timing
  startTime?: Date;
  endTime?: Date;
  duration?: number;            // Duration in milliseconds
  
  // Runs and Extras
  runsScored: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalties: number;
  };
  
  // Wicket Details
  wicket?: {
    type: BallResult;
    batsmanId: string;
    bowlerId?: string;
    fielderId?: string;
    dismissalDescription?: string;
  };
  
  // Player Actions
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  
  // Ball Details
  deliveryType?: string;        // Fast, spin, etc.
  shotType?: string;           // Defensive, drive, pull, etc.
  fieldingPosition?: string;   // Where the ball went
  
  // Commentary
  commentary?: string;
  highlights?: string[];
  
  // Powerplay
  isPowerplay: boolean;
  powerplayType?: string;
  
  // Validation
  isConfirmed: boolean;
  confirmedBy?: string;        // User ID who confirmed
  confirmedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface BallInProgress {
  matchId: string;
  inningsNumber: number;
  overNumber: number;
  ballNumber: number;
  status: BallStatus;
  startTime: Date;
  currentBatsmen: {
    striker: string;
    nonStriker: string;
  };
  currentBowler: string;
  isPowerplay: boolean;
}

export interface BallConfirmation {
  ballId: string;
  result: BallResult;
  runsScored: number;
  extras?: {
    wides?: number;
    noBalls?: number;
    byes?: number;
    legByes?: number;
    penalties?: number;
  };
  wicket?: {
    type: BallResult;
    batsmanId: string;
    bowlerId?: string;
    fielderId?: string;
    dismissalDescription?: string;
  };
  commentary?: string;
  confirmedBy: string;
}

export interface OverSummary {
  overNumber: number;
  balls: BallUpdate[];
  totalRuns: number;
  totalWickets: number;
  totalExtras: number;
  runRate: number;
  isComplete: boolean;
}
