from PIL import Image
import numpy as np

def inspect():
    img_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\ai_quest_logo_clean.png"
    img = Image.open(img_path)
    arr = np.array(img)
    
    # Let's inspect the average color of each row from y=460 to y=500
    # to find where the dark banner transitions to the blue/cyan circuit background.
    # We scan across the middle part of the banner (x = 300 to 500)
    for y in range(460, 500):
        row_slice = arr[y, 300:500, :3]
        avg_color = row_slice.mean(axis=0)
        print(f"Row y={y} -> Avg RGB={avg_color.astype(int)}")

if __name__ == "__main__":
    inspect()
