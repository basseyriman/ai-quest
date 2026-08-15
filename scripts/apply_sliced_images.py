import re
import os

eng_cards_file = r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\src\lib\engineer-mode\cards.ts"
with open(eng_cards_file, 'r', encoding='utf-8') as f:
    eng_lines = f.readlines()

eng_images = [f"/cards/engineer_sliced/eng_{i}.png" for i in range(207)]
new_eng_lines = []
eng_img_idx = 0

for line in eng_lines:
    line = re.sub(r', image: "/cards/.*?\.png"', '', line)
    
    if line.strip().startswith("{ id:"):
        img_path = eng_images[eng_img_idx % len(eng_images)]
        eng_img_idx += 1
        
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

std_images = [f"/cards/standard_sliced/std_{i}.png" for i in range(180)]
std_img_idx = 0

def replacer(match):
    global std_img_idx
    img = std_images[std_img_idx % len(std_images)]
    std_img_idx += 1
    return f'"image": "{img}"'

new_std_content = re.sub(r'"image":\s*"/cards/.*?\.png"', replacer, std_content)

with open(std_cards_file, 'w', encoding='utf-8') as f:
    f.write(new_std_content)

print("Applied perfectly sliced individual card images to both decks!")
