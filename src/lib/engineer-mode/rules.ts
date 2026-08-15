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

/** Official v1.0: play in current open stage or advance one stage; no duplicates. */
export function isValidPipelinePlay(
  card: EngineerCard,
  pipeline: EngineerPipeline
): boolean {
  const stageIndex = getPipelineStageIndex(card.category);
  if (stageIndex === -1) return false;
  if (isDuplicateInPipeline(pipeline, card)) return false;

  const head = getPipelineHeadStageIndex(pipeline);
  if (head === -1) return stageIndex === 0;
  return stageIndex === head || stageIndex === head + 1;
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
        tieWinnerIds.push(id);
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
