/**
 * Sync ipValue fields in cards.ts with ENGINEER_CATEGORY_IP.
 * Run after changing ipValues.ts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardsPath = path.join(__dirname, "../src/lib/engineer-mode/cards.ts");

const CATEGORY_IP = {
  "SYSTEM OBJECTIVE": 0,
  "DATA COLLECTION": 10,
  "DATA PREPARATION": 10,
  "FEATURE ENGINEERING": 15,
  "MODEL SELECTION": 20,
  "MODEL TRAINING": 15,
  "MODEL EVALUATION": 15,
  DEPLOYMENT: 25,
};

let content = fs.readFileSync(cardsPath, "utf8");
let count = 0;

content = content.replace(
  /"category": "([^"]+)",\s*\n\s*"description": "[^"]*",\s*\n\s*"ipValue": (\d+)/g,
  (match, category, oldIp) => {
    const ip = CATEGORY_IP[category];
    if (ip === undefined) return match;
    if (Number(oldIp) === ip) return match;
    count++;
    return match.replace(`"ipValue": ${oldIp}`, `"ipValue": ${ip}`);
  }
);

fs.writeFileSync(cardsPath, content);
console.log(`Updated ${count} card ipValue fields in cards.ts`);
