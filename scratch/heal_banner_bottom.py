import os
import numpy as np
from PIL import Image, ImageFilter

def heal_banner():
    source_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\ai_quest_logo_clean.png"
    dest_path_1 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/ai_quest_logo_clean.png"
    dest_path_2 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/logo.png"
    dest_path_3 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/ai_quest_logo_clean.png"
    dest_path_4 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/logo.png"
    
    img = Image.open(source_path)
    rgba_img = img.convert("RGBA")
    width, height = rgba_img.size
    pixels = rgba_img.load()
    
    # The banner spans horizontally from x=80 to x=730 in the 814x769 image.
    # The vertical range of the tagline banner bottom edge is roughly y in [430, 460].
    # Let's write an adaptive algorithm for each column x:
    for x in range(80, 730):
        # 1. Find the bottom-most pixel of the horizontal silver trim of the banner in this column.
        # The silver trim has bright pixels (R > 130, G > 130, B > 130).
        # We search from y=430 downwards to y=455.
        y_silver = -1
        for y in range(430, 455):
            r, g, b, a = pixels[x, y]
            # Check for silver color
            if r > 120 and g > 120 and b > 120 and a > 100:
                y_silver = y
                
        if y_silver != -1:
            # The straight bottom edge of the banner ends exactly 3 pixels below the silver trim
            y_banner_end = y_silver + 3
            
            # 2. Any pixel below y_banner_end that is dark navy/black (the jagged protrusions)
            # must be replaced by the clean dark blue background of the shield.
            # We scan from y_banner_end to y_banner_end + 15.
            for y in range(y_banner_end, y_banner_end + 15):
                if y >= height:
                    break
                r, g, b, a = pixels[x, y]
                
                # If it's a dark banner-like pixel (R < 50, G < 60, B < 80)
                # and NOT transparent (a > 100), then it's a jagged protrusion!
                if r < 48 and g < 55 and b < 75 and a > 100:
                    # Replace it with the rich dark navy background color of the shield
                    # We can use a smooth blend of the clean background color (7, 22, 45, 255)
                    # and the neighboring pixels to make the transition perfectly smooth.
                    pixels[x, y] = (7, 22, 45, 255)
                    
    # 3. Soften the edge transition using a subtle local horizontal blur only on the boundary pixels
    # to ensure the banner's bottom border is perfectly smooth, sharp, and anti-aliased.
    # We do this by averaging the color of the banner bottom edge with the background below it.
    for x in range(80, 730):
        y_silver = -1
        for y in range(430, 455):
            r, g, b, a = pixels[x, y]
            if r > 120 and g > 120 and b > 120 and a > 100:
                y_silver = y
        if y_silver != -1:
            y_edge = y_silver + 3
            # We average the pixel exactly at y_edge with its neighbors to create smooth antialiasing
            r0, g0, b0, a0 = pixels[x, y_edge - 1]
            r1, g1, b1, a1 = pixels[x, y_edge]
            r2, g2, b2, a2 = pixels[x, y_edge + 1]
            
            # Smooth blend
            nr = int(0.25 * r0 + 0.5 * r1 + 0.25 * r2)
            ng = int(0.25 * g0 + 0.5 * g1 + 0.25 * g2)
            nb = int(0.25 * b0 + 0.5 * b1 + 0.25 * b2)
            pixels[x, y_edge] = (nr, ng, nb, a1)
            
    # Save the resulting perfected logo to all targets
    for path in [dest_path_1, dest_path_2, dest_path_3, dest_path_4]:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        rgba_img.save(path, "PNG")
        
    print(f"Successfully healed horizontal banner's bottom border and saved to all targets!")
    print(f"Final high-res size: {rgba_img.size}")

if __name__ == "__main__":
    heal_banner()
