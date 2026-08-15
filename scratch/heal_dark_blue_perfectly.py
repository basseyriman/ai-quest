import os
import collections
import numpy as np
from PIL import Image, ImageDraw

def heal_dark_blue():
    source_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\ai_quest_logo_clean.png"
    dest_path_1 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/ai_quest_logo_clean.png"
    dest_path_2 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/logo.png"
    dest_path_3 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/ai_quest_logo_clean.png"
    dest_path_4 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/logo.png"
    
    img = Image.open(source_path)
    rgba_img = img.convert("RGBA")
    width, height = rgba_img.size
    
    # We focus specifically on the right side under "DEPLOY"
    # In the 814x769 image, this region is x in [580, 720], y in [480, 565]
    roi_x1, roi_y1 = 580, 480
    roi_x2, roi_y2 = 720, 565
    
    arr = np.array(rgba_img)
    
    # We select dark blue pixels inside this right-side ROI
    mask = (arr[roi_y1:roi_y2, roi_x1:roi_x2, 0] >= 10) & (arr[roi_y1:roi_y2, roi_x1:roi_x2, 0] <= 90) & \
           (arr[roi_y1:roi_y2, roi_x1:roi_x2, 1] >= 20) & (arr[roi_y1:roi_y2, roi_x1:roi_x2, 1] <= 130) & \
           (arr[roi_y1:roi_y2, roi_x1:roi_x2, 2] >= 60) & (arr[roi_y1:roi_y2, roi_x1:roi_x2, 2] <= 190)
           
    y_idx, x_idx = np.where(mask)
    points = [(int(x + roi_x1), int(y + roi_y1)) for x, y in zip(x_idx, y_idx)]
    print(f"Detected {len(points)} right-side dark blue pixels in ROI.")
    
    point_set = set(points)
    endpoints = []
    for x, y in points:
        neighbors = 0
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx == 0 and dy == 0:
                    continue
                if (x + dx, y + dy) in point_set:
                    neighbors += 1
        if neighbors <= 2:
            endpoints.append((x, y))
            
    print(f"Detected {len(endpoints)} potential right-side endpoints.")
    
    # Find disconnected endpoint pairs close to each other
    connections = []
    for i, (x1, y1) in enumerate(endpoints):
        for j, (x2, y2) in enumerate(endpoints):
            if i >= j:
                continue
            dist = np.sqrt((x1 - x2)**2 + (y1 - y2)**2)
            if 6 <= dist <= 35:
                steps = int(dist)
                cx = np.linspace(x1, x2, steps)
                cy = np.linspace(y1, y2, steps)
                existing_blue = 0
                for px, py in zip(cx, cy):
                    if (int(px), int(py)) in point_set:
                        existing_blue += 1
                if existing_blue / steps < 0.4:
                    connections.append(((x1, y1), (x2, y2), dist))
                    
    connections.sort(key=lambda x: x[2])
    print(f"Found {len(connections)} disconnected right-side dark blue endpoint pairs.")
    
    # Draw all the healing lines to bridge any gaps in the right-side area
    draw = ImageDraw.Draw(rgba_img)
    
    # Heal the top 15 gaps found on the right side
    healed_count = 0
    for (x1, y1), (x2, y2), dist in connections:
        if healed_count >= 15:
            break
        print(f"Healing right-side dark blue gap between {x1},{y1} and {x2},{y2} (dist={dist:.1f})")
        # Draw smooth matching lines using a clean rich dark blue/navy matching the unlit circuit traces
        draw.line([(x1, y1), (x2, y2)], fill=(25, 60, 95, 255), width=3)
        draw.line([(x1, y1), (x2, y2)], fill=(20, 50, 85, 200), width=5)
        healed_count += 1
        
    # Save the resulting doubly-healed transparent image to all targets
    for path in [dest_path_1, dest_path_2, dest_path_3, dest_path_4]:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        rgba_img.save(path, "PNG")
        
    print(f"Successfully healed right-side dark blue broken part and saved to all targets!")
    print(f"Final high-res size: {rgba_img.size}")

if __name__ == "__main__":
    heal_dark_blue()
