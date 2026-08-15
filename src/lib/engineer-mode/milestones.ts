import { EngineerCard } from "@/types/engineer-mode";
import { ENGINEER_CATEGORY_IP } from "./ipValues";

const MILESTONE_REWARD_IP = ENGINEER_CATEGORY_IP.MILESTONE;

/** 15-card Milestone deck — pairs with System Objective deck */
const MILESTONE_CARDS_RAW: EngineerCard[] = [
    {
        id: "ms_1",
        name: "Fraud Ring Uncovered",
        category: "MILESTONE",
        description: "Your AI system successfully identified fraudulent activity and protected financial assets.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Fraud Detection System"], bonusIP: 0 },
    },
    {
        id: "ms_2",
        name: "Personalization Champion",
        category: "MILESTONE",
        description: "Your AI delivered highly relevant recommendations and improved user engagement.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Recommendation Engine"], bonusIP: 0 },
    },
    {
        id: "ms_3",
        name: "Early Disease Detection",
        category: "MILESTONE",
        description: "Your AI assisted clinicians in identifying diseases earlier and more accurately.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Healthcare Diagnosis AI"], bonusIP: 0 },
    },
    {
        id: "ms_4",
        name: "Autonomous Vehicle Deployed",
        category: "MILESTONE",
        description: "Your navigation system successfully operated without human intervention.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Autonomous Navigation System"], bonusIP: 0 },
    },
    {
        id: "ms_5",
        name: "Climate Insight Achieved",
        category: "MILESTONE",
        description: "Your forecasting model provided valuable environmental predictions.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Climate Forecasting Model"], bonusIP: 0 },
    },
    {
        id: "ms_6",
        name: "Safe Community Created",
        category: "MILESTONE",
        description: "Your AI successfully reduced harmful content and improved platform safety.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Social Media Moderation AI"], bonusIP: 0 },
    },
    {
        id: "ms_7",
        name: "Credit Decision Optimized",
        category: "MILESTONE",
        description: "Your AI improved lending decisions and reduced financial risk.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Credit Risk Assessment AI"], bonusIP: 0 },
    },
    {
        id: "ms_8",
        name: "Conversational AI Deployed",
        category: "MILESTONE",
        description: "Your intelligent voice assistant successfully interacted with users.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Voice Assistant AI"], bonusIP: 0 },
    },
    {
        id: "ms_9",
        name: "Threat Neutralized",
        category: "MILESTONE",
        description: "Your AI detected and prevented critical cyber attacks.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Cybersecurity Threat Detection"], bonusIP: 0 },
    },
    {
        id: "ms_10",
        name: "Energy Efficiency Achieved",
        category: "MILESTONE",
        description: "Your AI reduced energy consumption and improved sustainability.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Smart Energy Optimization System"], bonusIP: 0 },
    },
    {
        id: "ms_11",
        name: "Dynamic Pricing Success",
        category: "MILESTONE",
        description: "Your pricing model optimized revenue and customer demand.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["E-Commerce Pricing AI"], bonusIP: 0 },
    },
    {
        id: "ms_12",
        name: "Identity Verified",
        category: "MILESTONE",
        description: "Your AI successfully identified and verified individuals.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Facial Recognition System"], bonusIP: 0 },
    },
    {
        id: "ms_13",
        name: "24/7 AI Support Live",
        category: "MILESTONE",
        description: "Your chatbot successfully automated customer assistance.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Customer Support Chatbot"], bonusIP: 0 },
    },
    {
        id: "ms_14",
        name: "Congestion Reduced",
        category: "MILESTONE",
        description: "Your AI improved traffic management and reduced delays.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["Traffic Flow Prediction System"], bonusIP: 0 },
    },
    {
        id: "ms_15",
        name: "Talent Match Achieved",
        category: "MILESTONE",
        description: "Your AI successfully matched candidates with suitable opportunities.",
        ipValue: MILESTONE_REWARD_IP,
        synergy: { objective: ["AI-Powered Recruitment System"], bonusIP: 0 },
    },
];

export const MILESTONE_CARDS: EngineerCard[] = MILESTONE_CARDS_RAW;

export function getMilestoneForObjective(objectiveName: string): EngineerCard | null {
  return (
    MILESTONE_CARDS.find((ms) =>
      ms.synergy?.objective?.includes(objectiveName)
    ) ?? null
  );
}

export { ENGINEER_CATEGORY_IP } from "./ipValues";
