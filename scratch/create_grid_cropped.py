from PIL import Image, ImageDraw
import os

def create_grid_cropped():
    img_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\ai_quest_logo_clean.png"
    img = Image.open(img_path)
    
    # We want to crop the area on the right side of the banner
    # In the 814x769 image, the banner right side under DEPLOY is roughly x around 550 to 700, y around 480 to 600
    width, height = img.size
    crop_x1, crop_y1 = 500, 430
    crop_x2, crop_y2 = 700, 580
    crop_area = img.crop((crop_x1, crop_y1, crop_x2, crop_y2))
    
    draw_img = crop_area.copy()
    draw = ImageDraw.Draw(draw_img)
    
    w, h = draw_img.size
    for x in range(0, w, 10):
        color = (128, 128, 128, 100) if x % 50 == 0 else (64, 64, 64, 50)
        draw.line([(x, 0), (x, h)], fill=color)
        if x % 50 == 0:
            draw.text((x + 2, 2), str(crop_x1 + x), fill=(255, 255, 255, 255))
            
    for y in range(0, h, 10):
        color = (128, 128, 128, 100) if y % 50 == 0 else (64, 64, 64, 50)
        draw.line([(0, y), (w, y)], fill=color)
        if y % 50 == 0:
            draw.text((2, y + 2), str(crop_y1 + y), fill=(255, 255, 255, 255))
            
    dest_path = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/crop_grid_clean.png"
    draw_img.save(dest_path)
    print(f"Coordinate grid image saved to {dest_path}!")

if __name__ == "__main__":
    create_grid_cropped()
