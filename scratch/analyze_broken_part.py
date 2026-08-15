from PIL import Image
import numpy as np

def analyze():
    # Load the flawless source image (uncropped 1024x1024)
    img_path = r"C:\Users\basse\.gemini\antigravity\brain\7df0b398-acd7-41e0-bd53-5220599d7b4f\ai_quest_premium_shield_unbroken_circuits_1780138112019.png"
    img = Image.open(img_path)
    
    # We want to look at the region under the banner on the right side
    # The banner is roughly in the middle vertical. Let's crop x from 550 to 750, y from 600 to 750
    crop_area = img.crop((550, 600, 750, 750))
    crop_area.save("c:/Users/basse/Documents/RimanTech/AIQuestLogo/crop_test.png")
    print("Crop saved to AIQuestLogo/crop_test.png for inspection.")

if __name__ == "__main__":
    analyze()
