import { OBJECTIVE_DECK, PLAYABLE_ENGINEER_CARDS } from "../src/lib/engineer-mode/cards.ts";

const datasets = PLAYABLE_ENGINEER_CARDS.filter((c) => c.category === "DATA COLLECTION");
const objectiveNames = OBJECTIVE_DECK.map((o) => o.name);

console.log("Dataset count:", datasets.length);
console.log("Objective count:", objectiveNames.length);
console.log("");

let allOk = true;

for (const obj of OBJECTIVE_DECK) {
  const matches = datasets.filter((d) => d.synergy?.objective?.includes(obj.name));
  const status = matches.length > 0 ? "OK" : "MISSING";
  if (matches.length === 0) allOk = false;
  console.log(`${status}  ${obj.name}`);
  matches.forEach((d) => console.log(`      -> ${d.name}`));
  console.log("");
}

const badSynergy = datasets.filter((d) => {
  if (!d.synergy?.objective?.length) return true;
  return d.synergy.objective.some((name) => !objectiveNames.includes(name));
});

const orphans = objectiveNames.filter(
  (name) => !datasets.some((d) => d.synergy?.objective?.includes(name))
);

console.log("--- Issues ---");
if (badSynergy.length) {
  allOk = false;
  console.log("Datasets with invalid objective refs:");
  badSynergy.forEach((d) => console.log(" ", d.name, "->", d.synergy?.objective));
}
if (orphans.length) {
  allOk = false;
  console.log("Objectives with NO dataset:", orphans.join(", "));
}
if (!badSynergy.length && !orphans.length) {
  console.log("None — all objectives covered, all synergy refs valid.");
}

console.log("\nDatasets without synergy:", datasets.filter((d) => !d.synergy?.objective?.length).map((d) => d.name).join(", ") || "none");

process.exit(allOk ? 0 : 1);
