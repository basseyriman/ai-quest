const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

const cardsDir = path.join(__dirname, '../public/cards');
const outputFile = path.join(__dirname, '../src/lib/cards.ts');

const cardDatabase = [];

async function extractTextFromImage(imagePath) {
    try {
        console.log(`Scanning: ${path.basename(imagePath)}...`);
        const result = await Tesseract.recognize(imagePath, 'eng', { logger: m => { } });
        return result.data.text;
    } catch (err) {
        console.error(`Failed to OCR ${imagePath}`, err);
        return "";
    }
}

function parseCardData(text, type, imgPath) {
    let points = 10; // Default
    let cost = 0;

    // Look for numbers like +10, -5, 20 IP
    const pointMatch = text.match(/([+-]?\d+)\s*(?:IP|POINTS|INNOVATION)?/i);
    if (pointMatch && pointMatch[1]) {
        points = parseInt(pointMatch[1].replace('+', ''), 10);
    }

    // Try to extract a clean sentence or two for the description (filter out ALL CAPS noise or single words)
    let description = "A premium architecture sequence.";
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);

    const validLines = lines.filter(l => l.match(/[a-z]/) && !l.includes('AI QUEST')); // Needs lowercase to not be a header
    if (validLines.length > 0) {
        description = validLines.slice(0, 2).join(' ');
    }

    // Fallback names based on type
    const nameMatch = path.basename(imgPath).replace('.png', '').replace('.jpg', '');

    return {
        id: `card-${Math.random().toString(36).substring(2, 9)}`,
        name: `${type} - ${nameMatch}`,
        type: type,
        description: description,
        points: points,
        image: `/cards/${type} CARDS/${path.basename(imgPath)}`
    };
}

async function runOcr() {
    console.log("Initializing Local Tesseract OCR Engine...");

    const categories = fs.readdirSync(cardsDir).filter(f => fs.statSync(path.join(cardsDir, f)).isDirectory());

    for (const category of categories) {
        const type = category.replace(' CARDS', '').trim();
        const categoryPath = path.join(cardsDir, category);
        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

        for (const file of files) {
            const filePath = path.join(categoryPath, file);
            const rawText = await extractTextFromImage(filePath);
            const parsedCard = parseCardData(rawText, type, filePath);
            cardDatabase.push(parsedCard);
            console.log(`Extracted: ${parsedCard.name} -> ${parsedCard.points} IP | Desc: ${parsedCard.description.substring(0, 30)}...`);
        }
    }

    console.log("OCR Complete. Compiling to TypeScript...");

    const tsContent = `// AUTO-GENERATED FILE. OCR EXTRACTED FROM PREMIUM ASSETS.
import { Card, CardType } from '../types';

export const CARD_DATABASE: Card[] = ${JSON.stringify(cardDatabase, null, 4)};

export const generateDeck = (): Card[] => {
    // Return a shuffled copy of the deck
    const deck = [...CARD_DATABASE];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};
`;

    fs.writeFileSync(outputFile, tsContent);
    console.log(`Successfully rewrote ${outputFile} with OCR extracted data!`);
}

runOcr().catch(console.error);
