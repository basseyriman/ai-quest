from PIL import Image, ImageDraw, ImageFont
import os

def create_grid():
    img_path = r"C:\Users\basse\.gemini\antigravity\brain\7df0b398-acd7-41e0-bd53-5220599d7b4f\ai_quest_premium_shield_unbroken_circuits_1780138112019.png"
    img = Image.open(img_path)
    
    # Crop the exact region: x from 600 to 800, y from 630 to 750 (under right side of banner)
    crop_x1, crop_y1 = 600, 630
    crop_x2, crop_y2 = 800, 750
    crop_area = img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    
    # Create a draw object to overlay a coordinate grid
    draw_img = crop_area.copy()
    draw = ImageDraw.Draw(draw_img)
    
    width, height = draw_img.size
    
    # Draw grid lines and write coordinates
    # Every 10 pixels, draw a faint gray line
    # Every 50 pixels, draw a prominent line and write the absolute coordinate
    for x in range(0, width, 10):
        color = (128, 128, 128, 100) if x % 50 == 0 else (64, 64, 64, 50)
        draw.line([(x, 0), (x, height)], fill=color)
        if x % 50 == 0:
            draw.text((x + 2, 2), str(crop_x1 + x), fill=(255, 255, 255, 255))
            
    for y in range(0, height, 10):
        color = (128, 128, 128, 100) if y % 50 == 0 else (64, 64, 64, 50)
        draw.line([(0, y), (width, y)], fill=color)
        if y % 50 == 0:
            draw.text((2, y + 2), str(crop_y1 + y), fill=(255, 255, 255, 255))
            
    dest_path = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/crop_grid.png"
    draw_img.save(dest_path)
    print(f"Coordinate grid image saved to {dest_path}!")

if __name__ == "__main__":
    create_grid()
