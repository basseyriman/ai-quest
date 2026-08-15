import type { EngineerCard } from "@/types/engineer-mode";
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";

/** Curated cards for the landing page — avoids importing the full deck. */
export const LANDING_SHOWCASE_CARDS: EngineerCard[] = [
  {
    id: "obj_1",
    name: "Fraud Detection System",
    category: "SYSTEM OBJECTIVE",
    description:
      "Build an AI system that detects fraudulent financial transactions and protects assets.",
    ipValue: 0,
  },
  {
    id: "col_3",
    name: "Financial Transactions Dataset",
    category: "DATA COLLECTION",
    description: "Records of financial transactions used to detect spending patterns and fraud.",
    ipValue: ENGINEER_CATEGORY_IP["DATA COLLECTION"],
    synergy: { objective: ["Fraud Detection System"], bonusIP: 5 },
  },
  {
    id: "prep_1",
    name: "Handle Missing Values",
    category: "DATA PREPARATION",
    description: "Fills or removes missing data points to ensure model reliability.",
    ipValue: ENGINEER_CATEGORY_IP["DATA PREPARATION"],
  },
  {
    id: "feat_1",
    name: "Feature Selection",
    category: "FEATURE ENGINEERING",
    description: "Chooses the most important variables that contribute to model performance.",
    ipValue: ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"],
  },
  {
    id: "sel_11",
    name: "BERT",
    category: "MODEL SELECTION",
    description: "A language model designed to understand context and meaning within text.",
    ipValue: ENGINEER_CATEGORY_IP["MODEL SELECTION"],
  },
  {
    id: "dep_1",
    name: "FastAPI Deployment",
    category: "DEPLOYMENT",
    description:
      "Deploys an AI model through a high-performance API for real-time predictions and integration.",
    ipValue: ENGINEER_CATEGORY_IP.DEPLOYMENT,
  },
];

export const LANDING_OBJECTIVE_ICON = "ShieldAlert";

export const LANDING_MILESTONE = {
  id: "ms_1",
  title: "Fraud Ring Uncovered",
  description:
    "Your AI system successfully identified fraudulent activity and protected financial assets.",
  points: "+30 IP",
};
