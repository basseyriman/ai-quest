/** Official IP values per engineer deck category */
export const ENGINEER_CATEGORY_IP = {
  "SYSTEM OBJECTIVE": 0,
  "DATA COLLECTION": 10,
  "DATA PREPARATION": 10,
  "FEATURE ENGINEERING": 15,
  "MODEL SELECTION": 20,
  "MODEL TRAINING": 15,
  "MODEL EVALUATION": 15,
  DEPLOYMENT: 25,
  MILESTONE: 30,
} as const;

export type EngineerCategoryIpKey = keyof typeof ENGINEER_CATEGORY_IP;

export function applyEngineerCategoryIp<T extends { category: string; ipValue: number }>(
  card: T
): T {
  const ip = ENGINEER_CATEGORY_IP[card.category as EngineerCategoryIpKey];
  if (ip !== undefined) {
    return { ...card, ipValue: ip };
  }
  return card;
}

export function applyEngineerCategoryIpToDeck<T extends { category: string; ipValue: number }>(
  cards: T[]
): T[] {
  return cards.map(applyEngineerCategoryIp);
}
