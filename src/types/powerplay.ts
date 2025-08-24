export enum PowerPlayType {
  MANDATORY = "mandatory",
  BATTING = "batting", 
  BOWLING = "bowling"
}

export enum PowerPlayStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed"
}

export interface PowerPlay {
  _id?: string;
  type: PowerPlayType;
  status: PowerPlayStatus;
  startOver: number;
  endOver: number;
  maxFieldersOutside: number;
  description?: string;
  isMandatory: boolean;
  isActive: boolean;
  currentOver: number;
  innings: number;
  completedAt?: Date;
  notes?: string;
  stats: {
    runsScored: number;
    wicketsLost: number;
    oversCompleted: number;
    runRate: number;
    boundaries: number;
    sixes: number;
  };
}

export interface CurrentPowerPlay {
  isActive: boolean;
  currentPowerPlayIndex: number;
  type?: string;
  startOver?: number;
  endOver?: number;
  maxFieldersOutside: number;
}

export interface PowerplayData {
  type: PowerPlayType;
  status: PowerPlayStatus;
  startOver: number;
  endOver: number;
  innings: number;
  maxFieldersOutside?: number;
  description?: string;
  isMandatory?: boolean;
}

export interface PowerplayUpdateData {
  status?: PowerPlayStatus;
  currentOver?: number;
  isActive?: boolean;
  completedAt?: string;
  notes?: string;
}
