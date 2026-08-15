from PIL import Image

def inspect():
    img_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\ai_quest_logo_clean.png"
    img = Image.open(img_path)
    pixels = img.load()
    
    # We scan x=400 from y=300 to y=600
    for y in range(300, 600):
        r, g, b, a = pixels[400, y]
        # Let's print only when colors change significantly, or print every 5 pixels
        if y % 5 == 0:
            print(f"y={y} -> RGB=({r}, {g}, {b}, {a})")

if __name__ == "__main__":
    inspect()
