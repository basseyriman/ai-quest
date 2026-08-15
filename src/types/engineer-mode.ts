export type EngineerCardCategory =
  | "SYSTEM OBJECTIVE"
  | "DATA COLLECTION"
  | "DATA PREPARATION"
  | "DATA SOURCE"
  | "DATA CLEANING"
  | "EXPLORATORY ANALYSIS"
  | "FEATURE ENGINEERING"
  | "MODEL SELECTION"
  | "MODEL TRAINING"
  | "MODEL EVALUATION"
  | "MODEL"
  | "VALIDATION"
  | "DEPLOYMENT"
  | "MONITORING"
  | "CHALLENGE"
  | "LOGIC"
  | "ETHICS"
  | "MILESTONE";

export interface EngineerCard {
  id: string;
  name: string;
  category: EngineerCardCategory;
  description: string;
  ipValue: number;
  image?: string;
  synergy?: {
    objective?: string[]; // E.g. ['Fraud Detection System']
    bonusIP: number;
  };
  effect?: string;
}

export interface EngineerPipeline {
  objective: EngineerCard | null;
  dataCollection: EngineerCard[];
  dataPreparation: EngineerCard[];
  featureEngineering: EngineerCard[];
  modelSelection: EngineerCard[];
  modelTraining: EngineerCard[];
  modelEvaluation: EngineerCard[];
  deployment: EngineerCard[];
}

export interface EngineerPlayer {
  id: string;
  name: string;
  ip: number;
  hand: EngineerCard[];
  pipeline: EngineerPipeline;
  isBot?: boolean;
  skipNextTurn?: boolean;
}

export type EngineerGamePhase = "SETUP" | "DRAW" | "PLAY" | "BUILD" | "END";

export interface PendingPlay {
  card: EngineerCard;
  playerId: string;
  slotKey: string;
  timestamp: number;
  isValidSequence: boolean;
}

export interface ScienceMove {
  id: string;
  cardName: string;
  category: string;
  playerName: string;
  isValid: boolean;
  timestamp: number;
}

export interface EngineerGameState {
  id: string; // Room ID
  players: Record<string, EngineerPlayer>; // Mapped by socket id
  activePlayerId: string;
  phase: EngineerGamePhase;
  sharedObjective: EngineerCard | null;
  /** Paired at objective draw; stays locked until Deployment. */
  pairedMilestone: EngineerCard | null;
  milestoneUnlocked: boolean;
  /** Set when Deployment unlocks the paired milestone (+30 IP). */
  sharedMilestone: EngineerCard | null;
  sharedPipeline: EngineerPipeline;
  pendingPlay: PendingPlay | null;
  deck: EngineerCard[];
  objectiveDeck: EngineerCard[];
  milestoneDeck: EngineerCard[];
  discardPile: EngineerCard[];
  communityPool: (EngineerCard | null)[];
  turnActionCount: number;
  winner: string | null;
  logs: string[];
  history?: ScienceMove[];
}

/** @deprecated Official Rules v1.0 — no fixed IP target; highest IP after Deployment wins. */
export const WINNING_SCORE = 100;
