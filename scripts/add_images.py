import re
import random

cards_file = r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\src\lib\engineer-mode\cards.ts"
with open(cards_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
engineer_images = [
    "card_0_0.jpeg", "card_1_0.jpeg", "card_3_0.jpeg", "card_4_0.jpeg",
    "card_5_0.jpeg", "card_6_0.jpeg", "card_7_0.jpeg", "card_8_0.jpeg",
    "card_9_0.jpeg", "card_10_0.jpeg", "card_11_0.jpeg", "card_12_0.jpeg",
    "card_13_0.jpeg", "card_14_0.jpeg", "card_15_0.jpeg", "card_16_0.jpeg",
    "card_17_0.jpeg", "card_18_0.jpeg", "card_19_0.jpeg", "card_20_0.jpeg",
    "card_21_0.jpeg", "card_22_0.jpeg"
]

for line in lines:
    if line.strip().startswith("{ id:"):
        # Select a random image
        img = random.choice(engineer_images)
        img_path = f"/cards/engineer_deck/{img}"
        
        # Replace the last '}' or '},' with the image property
        if line.endswith("},\n"):
            line = line.replace("},\n", f', image: "{img_path}" }},\n')
        elif line.endswith("}\n"):
            line = line.replace("}\n", f', image: "{img_path}" }}\n')
        elif line.endswith("};"):
            pass
    new_lines.append(line)

with open(cards_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Updated cards.ts with images!")
