import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REMOVE = new Set([
  "Banking Records Dataset",
  "Customer Behaviour Dataset",
  "Sales History Dataset",
  "Environmental Sensor Dataset",
  "Smart Meter Dataset",
  "Voice Recordings Dataset",
  "Customer Service Calls Dataset",
  "Product Knowledge Base Dataset",
  "Security Event Dataset",
  "CCTV Dataset",
  "Camera Traffic Dataset",
  "Job Application Dataset",
]);

const cardsPath = path.join(__dirname, "../src/lib/engineer-mode/cards.ts");
let src = fs.readFileSync(cardsPath, "utf8");
const match = src.match(/const ENGINEER_CARDS_RAW: EngineerCard\[\] = (\[[\s\S]*?\n\]);/);
if (!match) throw new Error("Could not parse ENGINEER_CARDS_RAW");

const raw = JSON.parse(match[1]);
const filtered = raw.filter((c) => !REMOVE.has(c.name));
if (raw.length - filtered.length !== 12) {
  throw new Error(`Expected to remove 12, removed ${raw.length - filtered.length}`);
}

const newBlock =
  "const ENGINEER_CARDS_RAW: EngineerCard[] = " + JSON.stringify(filtered, null, 4) + ";";
src = src.replace(match[0], newBlock);
fs.writeFileSync(cardsPath, src);
console.log(`Removed 12 datasets. Cards: ${raw.length} -> ${filtered.length}`);
