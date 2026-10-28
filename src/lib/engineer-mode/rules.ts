import {
  EngineerCard,
  EngineerGameState,
  EngineerPipeline,
} from "@/types/engineer-mode";
import { ENGINEER_CATEGORY_IP } from "./ipValues";

export const PIPELINE_STAGES = [
  { category: "DATA COLLECTION", slotKey: "dataCollection", label: "Data Collection" },
  { category: "DATA PREPARATION", slotKey: "dataPreparation", label: "Data Preparation" },
  { category: "FEATURE ENGINEERING", slotKey: "featureEngineering", label: "Feature Engineering" },
  { category: "MODEL SELECTION", slotKey: "modelSelection", label: "Model Selection" },
  { category: "MODEL TRAINING", slotKey: "modelTraining", label: "Model Training" },
  { category: "MODEL EVALUATION", slotKey: "modelEvaluation", label: "Model Evaluation" },
  { category: "DEPLOYMENT", slotKey: "deployment", label: "Deployment" },
] as const;

export type PipelineCategory = (typeof PIPELINE_STAGES)[number]["category"];
export type PipelineSlotKey = (typeof PIPELINE_STAGES)[number]["slotKey"];

export const PIPELINE_CATEGORIES = PIPELINE_STAGES.map((s) => s.category);
export const PIPELINE_SLOT_KEYS = PIPELINE_STAGES.map((s) => s.slotKey);

/** Tie-break priority — highest stage card in hand wins (Official Rules v1.0). */
export const TIE_BREAK_STAGE_INDICES = [
  6, 5, 4, 3, 2, 1, 0,
] as const;

/**
 * Domain compatibility map for each of the 15 System Objectives.
 * Ensures that Data Collection datasets and Model Selection architectures
 * are logically and scientifically valid for the active System Objective.
 */
export const OBJECTIVE_COMPATIBILITY_MAP: Record<
  string,
  {
    datasets: string[];
    models: string[];
    disallowFeatures?: string[];
  }
> = {
  "Fraud Detection System": {
    datasets: [
      "Financial Transactions Dataset",
      "Credit History Dataset",
      "E-Commerce Purchases Dataset",
      "User Behaviour Dataset",
      "Cybersecurity Logs Dataset",
    ],
    models: [
      "XGBoost",
      "LightGBM",
      "Random Forest",
      "Logistic Regression",
      "KNN",
    ],
  },
  "Recommendation Engine": {
    datasets: [
      "User Behaviour Dataset",
      "E-Commerce Purchases Dataset",
      "Customer Reviews Dataset",
      "Social Media Posts Dataset",
    ],
    models: [
      "KNN",
      "Random Forest",
      "LightGBM",
      "XGBoost",
      "Transformer",
    ],
  },
  "Healthcare Diagnosis AI": {
    datasets: [
      "MRI Dataset",
      "Medical Records Dataset",
      "Genomic Dataset",
      "Camera Image Dataset",
    ],
    models: [
      "CNN",
      "Vision Transformer (ViT)",
      "Random Forest",
      "XGBoost",
      "Logistic Regression",
    ],
  },
  "Autonomous Navigation System": {
    datasets: [
      "Camera Image Dataset",
      "LiDAR Dataset",
      "GPS Dataset",
      "Video Frame Dataset",
      "Traffic Sensor Dataset",
      "IoT Sensor Dataset",
      "Satellite Imagery Dataset",
    ],
    models: [
      "CNN",
      "Vision Transformer (ViT)",
      "Reinforcement Learning Agent",
      "LSTM",
    ],
    disallowFeatures: ["Text Vectorization"],
  },
  "Climate Forecasting Model": {
    datasets: [
      "Climate Records Dataset",
      "Satellite Imagery Dataset",
      "IoT Sensor Dataset",
      "Energy Consumption Dataset",
    ],
    models: [
      "LSTM",
      "Random Forest",
      "XGBoost",
      "LightGBM",
      "CNN",
    ],
    disallowFeatures: ["Text Vectorization"],
  },
  "Social Media Moderation AI": {
    datasets: [
      "Social Media Posts Dataset",
      "Text Corpus Dataset",
      "Customer Reviews Dataset",
      "Video Frame Dataset",
      "Camera Image Dataset",
      "User Behaviour Dataset",
    ],
    models: [
      "BERT",
      "Transformer",
      "CNN",
      "Vision Transformer (ViT)",
      "Logistic Regression",
    ],
  },
  "Credit Risk Assessment AI": {
    datasets: [
      "Credit History Dataset",
      "Financial Transactions Dataset",
      "E-Commerce Purchases Dataset",
      "User Behaviour Dataset",
    ],
    models: [
      "Logistic Regression",
      "XGBoost",
      "Random Forest",
      "LightGBM",
    ],
  },
  "Voice Assistant AI": {
    datasets: [
      "Speech Corpus Dataset",
      "Text Corpus Dataset",
      "Customer Support Conversations Dataset",
    ],
    models: [
      "Transformer",
      "BERT",
      "LSTM",
    ],
  },
  "Cybersecurity Threat Detection": {
    datasets: [
      "Cybersecurity Logs Dataset",
      "Network Traffic Dataset",
      "User Behaviour Dataset",
      "Financial Transactions Dataset",
    ],
    models: [
      "XGBoost",
      "Random Forest",
      "LightGBM",
      "LSTM",
      "Logistic Regression",
    ],
  },
  "Smart Energy Optimization System": {
    datasets: [
      "Energy Consumption Dataset",
      "IoT Sensor Dataset",
      "Climate Records Dataset",
    ],
    models: [
      "Reinforcement Learning Agent",
      "LSTM",
      "XGBoost",
      "LightGBM",
      "Random Forest",
    ],
    disallowFeatures: ["Text Vectorization"],
  },
  "E-Commerce Pricing AI": {
    datasets: [
      "E-Commerce Purchases Dataset",
      "User Behaviour Dataset",
      "Customer Reviews Dataset",
      "Financial Transactions Dataset",
    ],
    models: [
      "Random Forest",
      "LightGBM",
      "XGBoost",
      "Logistic Regression",
      "LSTM",
      "Reinforcement Learning Agent",
    ],
  },
  "Facial Recognition System": {
    datasets: [
      "Facial Image Dataset",
      "Camera Image Dataset",
      "Video Frame Dataset",
    ],
    models: [
      "CNN",
      "Vision Transformer (ViT)",
    ],
    disallowFeatures: ["Text Vectorization"],
  },
  "Customer Support Chatbot": {
    datasets: [
      "Customer Support Conversations Dataset",
      "Support Tickets Dataset",
      "Text Corpus Dataset",
      "Customer Reviews Dataset",
      "Speech Corpus Dataset",
    ],
    models: [
      "Transformer",
      "BERT",
      "Logistic Regression",
      "LSTM",
    ],
  },
  "Traffic Flow Prediction System": {
    datasets: [
      "Traffic Sensor Dataset",
      "GPS Dataset",
      "Camera Image Dataset",
      "Video Frame Dataset",
      "IoT Sensor Dataset",
      "LiDAR Dataset",
    ],
    models: [
      "LSTM",
      "XGBoost",
      "LightGBM",
      "Random Forest",
      "CNN",
    ],
    disallowFeatures: ["Text Vectorization"],
  },
  "AI-Powered Recruitment System": {
    datasets: [
      "Candidate CV Dataset",
      "Interview Feedback Dataset",
      "Text Corpus Dataset",
    ],
    models: [
      "Random Forest",
      "BERT",
      "Transformer",
      "Logistic Regression",
      "XGBoost",
      "KNN",
    ],
  },
};

export function getObjectiveCompatibility(objectiveName?: string | null) {
  if (!objectiveName) return null;
  return OBJECTIVE_COMPATIBILITY_MAP[objectiveName] || null;
}

/**
 * Checks whether an EngineerCard is logically/domain-compatible with the active System Objective.
 */
export function isCardCompatibleWithObjective(
  card: EngineerCard,
  objective?: EngineerCard | null
): boolean {
  if (!objective) return true;
  const rules = OBJECTIVE_COMPATIBILITY_MAP[objective.name];
  if (!rules) return true;

  if (card.category === "DATA COLLECTION") {
    return rules.datasets.includes(card.name);
  }

  if (card.category === "MODEL SELECTION") {
    return rules.models.includes(card.name);
  }

  if (card.category === "FEATURE ENGINEERING" && rules.disallowFeatures) {
    return !rules.disallowFeatures.includes(card.name);
  }

  return true;
}

export function createEmptyPipeline(): EngineerPipeline {
  return {
    objective: null,
    dataCollection: [],
    dataPreparation: [],
    featureEngineering: [],
    modelSelection: [],
    modelTraining: [],
    modelEvaluation: [],
    deployment: [],
  };
}

export function categoryToSlotKey(category: string): PipelineSlotKey | null {
  const stage = PIPELINE_STAGES.find((s) => s.category === category);
  return stage?.slotKey ?? null;
}

export function slotKeyToCategory(slotKey: PipelineSlotKey): PipelineCategory {
  return PIPELINE_STAGES.find((s) => s.slotKey === slotKey)!.category;
}

export function getPipelineStageIndex(category: string): number {
  return PIPELINE_CATEGORIES.indexOf(category as PipelineCategory);
}

export function getAllPipelineCards(pipeline: EngineerPipeline): EngineerCard[] {
  const cards: EngineerCard[] = [];
  if (pipeline.objective) cards.push(pipeline.objective);
  for (const key of PIPELINE_SLOT_KEYS) {
    cards.push(...pipeline[key]);
  }
  return cards;
}

/** Highest stage index that has at least one card, or -1 if empty. */
export function getPipelineHeadStageIndex(pipeline: EngineerPipeline): number {
  for (let i = PIPELINE_SLOT_KEYS.length - 1; i >= 0; i--) {
    if (pipeline[PIPELINE_SLOT_KEYS[i]].length > 0) return i;
  }
  return -1;
}

export function isDuplicateInPipeline(
  pipeline: EngineerPipeline,
  card: EngineerCard
): boolean {
  return getAllPipelineCards(pipeline).some((c) => c.name === card.name);
}

/**
 * Checks whether a card belongs to the current open stage or advances one sequential stage.
 */
export function isStageProgressionValid(
  card: EngineerCard,
  pipeline: EngineerPipeline
): boolean {
  const stageIndex = getPipelineStageIndex(card.category);
  if (stageIndex === -1) return false;
  const head = getPipelineHeadStageIndex(pipeline);
  if (head === -1) return stageIndex === 0;
  return stageIndex === head || stageIndex === head + 1;
}

/**
 * Official v1.0:
 * 1. Must be in current open stage or advance one stage
 * 2. Must not be a duplicate card already in the pipeline
 * 3. Must be domain-compatible with the active System Objective (e.g. E-Commerce Pricing AI requires E-Commerce / User / Review / Financial datasets, not Medical or Traffic datasets!)
 */
export function isValidPipelinePlay(
  card: EngineerCard,
  pipeline: EngineerPipeline
): boolean {
  const stageIndex = getPipelineStageIndex(card.category);
  if (stageIndex === -1) return false;
  if (isDuplicateInPipeline(pipeline, card)) return false;
  if (!isStageProgressionValid(card, pipeline)) return false;
  if (!isCardCompatibleWithObjective(card, pipeline.objective)) return false;
  return true;
}

export function isDeploymentComplete(pipeline: EngineerPipeline): boolean {
  return pipeline.deployment.length > 0;
}

export function getTrackerPosition(ip: number): number {
  if (ip <= 100) return ip;
  return ip % 100;
}

export function advanceActivePlayer(gameState: EngineerGameState): EngineerGameState {
  const playerIds = Object.keys(gameState.players);
  if (playerIds.length === 0) return gameState;

  let currentIndex = playerIds.indexOf(gameState.activePlayerId);
  let attempts = 0;

  while (attempts < playerIds.length) {
    currentIndex = (currentIndex + 1) % playerIds.length;
    const nextId = playerIds[currentIndex];
    const next = gameState.players[nextId];

    if (next.skipNextTurn) {
      next.skipNextTurn = false;
      gameState.logs.push(`⏭️ ${next.name} skips a turn (failed challenge).`);
      attempts++;
      continue;
    }

    gameState.activePlayerId = nextId;
    break;
  }

  return gameState;
}

function getHandTieBreakScore(hand: EngineerCard[]): number {
  let best = -1;
  for (const card of hand) {
    const idx = getPipelineStageIndex(card.category);
    if (idx > best) best = idx;
  }
  return best;
}

export function resolveWinner(gameState: EngineerGameState): EngineerGameState {
  if (gameState.winner) return gameState;
  if (!isDeploymentComplete(gameState.sharedPipeline)) return gameState;

  const contenders = Object.entries(gameState.players);
  let bestIp = -1;
  let bestIds: string[] = [];

  for (const [id, player] of contenders) {
    if (player.ip > bestIp) {
      bestIp = player.ip;
      bestIds = [id];
    } else if (player.ip === bestIp) {
      bestIds.push(id);
    }
  }

  if (bestIds.length === 1) {
    gameState.winner = bestIds[0];
  } else {
    let bestTieScore = -1;
    let tieWinnerIds: string[] = [];

    for (const id of bestIds) {
      const score = getHandTieBreakScore(gameState.players[id].hand);
      if (score > bestTieScore) {
        bestTieScore = score;
        tieWinnerIds = [id];
      } else if (score === bestTieScore) {
        tieWinnerIds = [id];
      }
    }

    gameState.winner = tieWinnerIds[0];
  }

  const winner = gameState.players[gameState.winner!];
  if (winner) {
    const alreadyLogged = gameState.logs.some((l) => l.includes("ACHIEVED SINGULARITY"));
    if (!alreadyLogged) {
      gameState.logs.push(
        `🏆 ${winner.name} wins with ${winner.ip} IP after Deployment!`
      );
    }
  }

  return gameState;
}

export function integratePipelineCard(
  gameState: EngineerGameState,
  playerId: string,
  card: EngineerCard,
  slotKey: PipelineSlotKey
): EngineerGameState {
  const pipeline = gameState.sharedPipeline;
  const stack = pipeline[slotKey];
  const isFirstDeployment =
    slotKey === "deployment" && stack.length === 0;

  stack.push(card);

  const player = gameState.players[playerId];
  if (player) {
    player.ip += card.ipValue || 0;
  }

  if (isFirstDeployment) {
    if (
      player &&
      gameState.pairedMilestone &&
      !gameState.milestoneUnlocked
    ) {
      gameState.milestoneUnlocked = true;
      gameState.sharedMilestone = gameState.pairedMilestone;
      player.ip += ENGINEER_CATEGORY_IP.MILESTONE;
      gameState.logs.push(
        `🎯 Milestone unlocked: ${gameState.pairedMilestone.name} (+${ENGINEER_CATEGORY_IP.MILESTONE} IP for ${player.name}).`
      );
    }
    gameState.logs.push("🚀 Deployment complete — calculating final scores…");
    resolveWinner(gameState);
  }

  return gameState;
}

export function assignWinnerIfNeeded(gameState: EngineerGameState): EngineerGameState {
  return resolveWinner(gameState);
}
