import { EngineerCard } from "@/types/engineer-mode";

/** Full retail box: engineer deck + objective deck + milestone deck */
export const OBJECTIVE_DECK_SIZE = 15;
export const MILESTONE_DECK_SIZE = 15;
export const FULL_GAME_SET_TARGET = 240;
export const RETAIL_ENGINEER_DECK_TARGET =
  FULL_GAME_SET_TARGET - OBJECTIVE_DECK_SIZE - MILESTONE_DECK_SIZE; // 210

/** Common — 4 copies (freed 12 dataset slots reinvested here) */
const COMMON = new Set([
  "Handle Missing Values",
  "Normalize Data",
  "Remove Duplicates",
  "Data Quality Check",
  "Data Transformation",
  "Feature Selection",
  "Feature Scaling",
  "Fine Tuning",
  "Hyperparameter Tuning",
  "Accuracy Evaluation",
  "Cross Validation",
  "FastAPI Deployment",
]);

/** Uncommon — 3 copies by default */
const UNCOMMON = new Set([
  "Class Balancing",
  "Feature Encoding",
  "Outlier Removal",
  "Remove Noise",
  "Feature Creation",
  "Feature Extraction",
  "Aggregated Features",
  "Text Vectorization",
  "Date Feature Expansion",
  "PCA",
  "Logistic Regression",
  "Random Forest",
  "XGBoost",
  "CNN",
  "Transformer",
  "LightGBM",
  "Transfer Learning",
  "Ensemble Learning",
  "Data Augmentation",
  "Precision Evaluation",
  "Recall Evaluation",
  "F1 Score Evaluation",
  "AWS Deployment",
  "Streamlit Deployment",
  "Docker Deployment",
]);

/** Uncommon cards at ×2 */
const UNCOMMON_TWO_COPY = new Set([
  "PCA",
  "Logistic Regression",
  "Date Feature Expansion",
  "Aggregated Features",
  "Text Vectorization",
  "Transfer Learning",
  "Ensemble Learning",
  "Data Augmentation",
  "Precision Evaluation",
  "Recall Evaluation",
  "F1 Score Evaluation",
]);

/** Key models — 4 copies (freed dataset slots reinvested) */
const UNCOMMON_FOUR_COPY = new Set([
  "Random Forest",
  "XGBoost",
  "CNN",
  "Transformer",
  "LightGBM",
  "Docker Deployment",
]);

/** Rare — 2 copies */
const RARE = new Set([
  "Vision Transformer (ViT)",
  "BERT",
  "Reinforcement Learning Agent",
  "LSTM",
  "KNN",
  "Active Learning",
  "Early Stopping",
  "Learning Rate Scheduling",
  "ROC-AUC Evaluation",
  "Confusion Matrix Analysis",
  "Mobile App Deployment",
  "Edge Device Deployment",
  "Flask API Deployment",
]);

/** Popular / objective-matched datasets — 4 copies */
const POPULAR_DATASETS = new Set([
  "Financial Transactions Dataset",
  "User Behaviour Dataset",
  "Customer Reviews Dataset",
  "Social Media Posts Dataset",
  "Medical Records Dataset",
  "Traffic Sensor Dataset",
]);

export type CardRarity = "common" | "uncommon" | "rare" | "popular-dataset" | "dataset";

export function getCardRarity(card: EngineerCard): CardRarity {
  if (COMMON.has(card.name)) return "common";
  if (UNCOMMON.has(card.name)) return "uncommon";
  if (RARE.has(card.name)) return "rare";
  if (card.category === "DATA COLLECTION") {
    return POPULAR_DATASETS.has(card.name) ? "popular-dataset" : "dataset";
  }
  return "rare";
}

export function getCardCopyCount(card: EngineerCard): number {
  if (card.category === "SYSTEM OBJECTIVE") return 0;
  const rarity = getCardRarity(card);
  switch (rarity) {
    case "common":
      return 4;
    case "uncommon":
      if (UNCOMMON_FOUR_COPY.has(card.name)) return 4;
      return UNCOMMON_TWO_COPY.has(card.name) ? 2 : 3;
    case "popular-dataset":
      return 4;
    case "rare":
    case "dataset":
      return 2;
    default:
      return 2;
  }
}

export function expandEngineerDeck(source: EngineerCard[]): EngineerCard[] {
  const expanded: EngineerCard[] = [];

  for (const card of source) {
    if (card.category === "SYSTEM OBJECTIVE") continue;
    const copies = getCardCopyCount(card);
    for (let i = 0; i < copies; i++) {
      expanded.push({
        ...card,
        id: copies === 1 ? card.id : `${card.id}_c${i + 1}`,
      });
    }
  }

  const categoryOrder = [
    "DATA COLLECTION",
    "DATA PREPARATION",
    "FEATURE ENGINEERING",
    "MODEL SELECTION",
    "MODEL TRAINING",
    "MODEL EVALUATION",
    "DEPLOYMENT",
  ];

  return expanded.sort((a, b) => {
    const ai = categoryOrder.indexOf(a.category);
    const bi = categoryOrder.indexOf(b.category);
    if (ai !== bi) return ai - bi;
    if (a.name !== b.name) return a.name.localeCompare(b.name);
    return a.id.localeCompare(b.id);
  });
}

export function getExpandedDeckByCategory(
  retailDeck: EngineerCard[],
  category: string
): EngineerCard[] {
  return retailDeck.filter((c) => c.category === category);
}
