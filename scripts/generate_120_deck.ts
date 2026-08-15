import fs from 'fs';
import path from 'path';
import { ENGINEER_CARDS } from '../src/lib/engineer-mode/cards.ts';

const uniqueCards = [...ENGINEER_CARDS];
const dataSources = uniqueCards.filter(c => c.category === "DATA SOURCE");
const dataCleaning = uniqueCards.filter(c => c.category === "DATA CLEANING");
const coreModels = uniqueCards.filter(c => c.name === "Random Forest" || c.name === "Logistic Regression");

const duplicates = [
    ...dataSources,
    ...dataCleaning,
    ...coreModels
].map((c, i) => ({ ...c, id: `${c.id}_copy_${i}` }));

const fullDeck = [...uniqueCards, ...duplicates].slice(0, 120);

// Assign the exact image paths
const finalDeck = fullDeck.map((card, i) => ({
    ...card,
    image: `/cards/engineer_cards/eng_${i}.png`
}));

// Now generate the new cards.ts file
let fileContent = `import { EngineerCard } from "@/types/engineer-mode";

export const ENGINEER_CARDS: EngineerCard[] = ${JSON.stringify(finalDeck, null, 4)};

export const getInitialDeck = () => {
    // Just return a shuffled copy of the 120 cards!
    return [...ENGINEER_CARDS].sort(() => Math.random() - 0.5);
};
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/engineer-mode/cards.ts'), fileContent, 'utf-8');
console.log("Successfully generated src/lib/engineer-mode/cards.ts with 120 mapped cards!");
