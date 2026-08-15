const fs = require('fs');
const path = require('path');

const publicCardsDir = path.join(__dirname, '../public/cards');
const outputFile = path.join(__dirname, '../src/lib/cards.ts');

const CATEGORY_MAP = {
    'DATA CARDS': 'DATA',
    'ALGORITHM CARDS': 'ALGORITHM',
    'UPGRADE CARDS': 'UPGRADE',
    'CHALLENGE CARDS': 'CHALLENGE',
    'ETHICS CARDS': 'ETHICS',
    'EVENTS CARDS': 'EVENT',
    'MILESTONE CARDS': 'MILESTONE',
    'SYSTEM OBJECTIVE': 'SYSTEM_OBJECTIVE'
};

function generateCards() {
    console.log('Scanning directories in:', publicCardsDir);
    const categories = fs.readdirSync(publicCardsDir).filter(f => fs.statSync(path.join(publicCardsDir, f)).isDirectory());

    let allCards = [];
    let idCounter = 1;

    for (const categoryFolder of categories) {
        const type = CATEGORY_MAP[categoryFolder];
        if (!type) continue; // Skip unknown folders

        const catPath = path.join(publicCardsDir, categoryFolder);
        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

        for (const file of files) {
            const id = `${type.toLowerCase().substring(0, 3)}-${idCounter++}`;
            // Extract a readable name from the filename for MVP (can be refined later if text extraction is perfectly mapped)
            // For now, these are beautiful cards, the visual is most important. 
            // We'll give generic descriptive names based on category, they will see the real card text on the image.

            const card = {
                id: id,
                name: `${type} Card #${idCounter - 1}`, // Placeholder name, actual image has text
                type: type,
                description: `A premium ${type.toLowerCase()} card for your AI Quest.`,
                points: type === 'DATA' ? 5 : type === 'ALGORITHM' ? 10 : type === 'MILESTONE' ? 20 : 0, // Default scores based on prompt MVP
                image: `/cards/${categoryFolder}/${file}`
            };
            allCards.push(card);
        }
    }

    console.log(`Found ${allCards.length} cards.`);

    const tsContent = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
import { Card, CardType } from '../types';

export const CARD_DATABASE: Card[] = ${JSON.stringify(allCards, null, 4)};

export function generateDeck(): Card[] {
    const deck: Card[] = [];
    // Include all 100+ unique physical cards exactly once for a true deck experience
    deck.push(...CARD_DATABASE);
    return shuffle(deck);
}

function shuffle(array: Card[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}
`;

    fs.writeFileSync(outputFile, tsContent);
    console.log(`Successfully generated ${outputFile}`);
}

generateCards();
