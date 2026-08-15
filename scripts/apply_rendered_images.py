import re
import random
import os

eng_cards_file = r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\src\lib\engineer-mode\cards.ts"
with open(eng_cards_file, 'r', encoding='utf-8') as f:
    eng_lines = f.readlines()

eng_images = [f"/cards/engineer_rendered/card_{i}.png" for i in range(24)]
new_eng_lines = []

for line in eng_lines:
    line = re.sub(r', image: "/cards/engineer_deck/.*?jpeg"', '', line)
    
    if line.strip().startswith("{ id:"):
        img_path = random.choice(eng_images)
        if line.endswith("},\n"):
            line = line.replace("},\n", f', image: "{img_path}" }},\n')
        elif line.endswith("}\n"):
            line = line.replace("}\n", f', image: "{img_path}" }}\n')
    new_eng_lines.append(line)

with open(eng_cards_file, 'w', encoding='utf-8') as f:
    f.writelines(new_eng_lines)

std_cards_file = r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\src\lib\cards.ts"
with open(std_cards_file, 'r', encoding='utf-8') as f:
    std_content = f.read()

std_images = [f"/cards/standard_rendered/card_{i}.png" for i in range(21)]

def replacer(match):
    return f'"image": "{random.choice(std_images)}"'

new_std_content = re.sub(r'"image":\s*"/cards/.*?\.png"', replacer, std_content)

with open(std_cards_file, 'w', encoding='utf-8') as f:
    f.write(new_std_content)

print("Applied rendered full-card images to both decks!")
