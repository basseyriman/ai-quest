import os
import collections
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def process_flawless_logo():
    source_path = r"C:\Users\basse\.gemini\antigravity\brain\7df0b398-acd7-41e0-bd53-5220599d7b4f\ai_quest_premium_shield_flawless_frame_1780138690982.png"
    dest_path_1 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/ai_quest_logo_clean.png"
    dest_path_2 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/logo.png"
    dest_path_3 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/ai_quest_logo_clean.png"
    dest_path_4 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/logo.png"
    
    img = Image.open(source_path)
    rgba_img = img.convert("RGBA")
    width, height = rgba_img.size
    
    # ==========================================
    # 1. HEAL CYAN GLOWING CIRCUITS (under right side of banner)
    # ==========================================
    roi_x1, roi_y1 = 580, 630
    roi_x2, roi_y2 = 780, 750
    arr = np.array(rgba_img)
    mask_cyan = (arr[roi_y1:roi_y2, roi_x1:roi_x2, 0] > 100) & \
                (arr[roi_y1:roi_y2, roi_x1:roi_x2, 1] > 200) & \
                (arr[roi_y1:roi_y2, roi_x1:roi_x2, 2] > 200)
    y_idx, x_idx = np.where(mask_cyan)
    points_cyan = [(int(x + roi_x1), int(y + roi_y1)) for x, y in zip(x_idx, y_idx)]
    point_set_cyan = set(points_cyan)
    
    endpoints_cyan = []
    for x, y in points_cyan:
        neighbors = 0
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx == 0 and dy == 0:
                    continue
                if (x + dx, y + dy) in point_set_cyan:
                    neighbors += 1
        if neighbors <= 2:
            endpoints_cyan.append((x, y))
            
    connections_cyan = []
    for i, (x1, y1) in enumerate(endpoints_cyan):
        for j, (x2, y2) in enumerate(endpoints_cyan):
            if i >= j:
                continue
            dist = np.sqrt((x1 - x2)**2 + (y1 - y2)**2)
            if 10 <= dist <= 50:
                steps = int(dist)
                cx = np.linspace(x1, x2, steps)
                cy = np.linspace(y1, y2, steps)
                existing = 0
                for px, py in zip(cx, cy):
                    if (int(px), int(py)) in point_set_cyan:
                        existing += 1
                if existing / steps < 0.4:
                    connections_cyan.append(((x1, y1), (x2, y2), dist))
                    
    connections_cyan.sort(key=lambda x: x[2])
    glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw_glow = ImageDraw.Draw(glow_layer)
    for (x1, y1), (x2, y2), dist in connections_cyan[:2]:
        print(f"Healing cyan gap: {x1},{y1} to {x2},{y2} (dist={dist:.1f})")
        draw_glow.line([(x1, y1), (x2, y2)], fill=(200, 255, 255, 255), width=3)
        draw_glow.line([(x1, y1), (x2, y2)], fill=(0, 240, 255, 200), width=6)
        draw_glow.line([(x1, y1), (x2, y2)], fill=(0, 180, 255, 100), width=10)
    blurred_glow = glow_layer.filter(ImageFilter.GaussianBlur(radius=1.5))
    rgba_img = Image.alpha_composite(rgba_img, blurred_glow)
    
    # ==========================================
    # 2. HEAL DARK BLUE CIRCUIT LINES (under right side of banner)
    # ==========================================
    pixels = rgba_img.load()
    arr = np.array(rgba_img)
    roi_db_x1, roi_db_y1 = 580, 480
    roi_db_x2, roi_db_y2 = 720, 565
    mask_db = (arr[roi_db_y1:roi_db_y2, roi_db_x1:roi_db_x2, 0] >= 10) & (arr[roi_db_y1:roi_db_y2, roi_db_x1:roi_db_x2, 0] <= 90) & \
              (arr[roi_db_y1:roi_db_y2, roi_db_x1:roi_db_x2, 1] >= 20) & (arr[roi_db_y1:roi_db_y2, roi_db_x1:roi_db_x2, 1] <= 130) & \
              (arr[roi_db_y1:roi_db_y2, roi_db_x1:roi_db_x2, 2] >= 60) & (arr[roi_db_y1:roi_db_y2, roi_db_x1:roi_db_x2, 2] <= 190)
    y_idx_db, x_idx_db = np.where(mask_db)
    points_db = [(int(x + roi_db_x1), int(y + roi_db_y1)) for x, y in zip(x_idx_db, y_idx_db)]
    point_set_db = set(points_db)
    
    endpoints_db = []
    for x, y in points_db:
        neighbors = 0
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                if dx == 0 and dy == 0:
                    continue
                if (x + dx, y + dy) in point_set_db:
                    neighbors += 1
        if neighbors <= 2:
            endpoints_db.append((x, y))
            
    connections_db = []
    for i, (x1, y1) in enumerate(endpoints_db):
        for j, (x2, y2) in enumerate(endpoints_db):
            if i >= j:
                continue
            dist = np.sqrt((x1 - x2)**2 + (y1 - y2)**2)
            if 6 <= dist <= 35:
                steps = int(dist)
                cx = np.linspace(x1, x2, steps)
                cy = np.linspace(y1, y2, steps)
                existing = 0
                for px, py in zip(cx, cy):
                    if (int(px), int(py)) in point_set_db:
                        existing += 1
                if existing / steps < 0.4:
                    connections_db.append(((x1, y1), (x2, y2), dist))
                    
    connections_db.sort(key=lambda x: x[2])
    draw = ImageDraw.Draw(rgba_img)
    healed_db = 0
    for (x1, y1), (x2, y2), dist in connections_db:
        if healed_db >= 15:
            break
        print(f"Healing dark blue gap: {x1},{y1} to {x2},{y2} (dist={dist:.1f})")
        draw.line([(x1, y1), (x2, y2)], fill=(25, 60, 95, 255), width=3)
        draw.line([(x1, y1), (x2, y2)], fill=(20, 50, 85, 200), width=5)
        healed_db += 1
        
    # ==========================================
    # 3. TRIM TAGLINE BANNER BOTTOM PROTRUSIONS (x=80 to x=730, y_silver+3)
    # ==========================================
    pixels = rgba_img.load()
    for x in range(80, 730):
        y_silver = -1
        for y in range(430, 455):
            r, g, b, a = pixels[x, y]
            if r > 120 and g > 120 and b > 120 and a > 100:
                y_silver = y
        if y_silver != -1:
            y_banner_end = y_silver + 3
            for y in range(y_banner_end, y_banner_end + 15):
                if y >= height:
                    break
                r, g, b, a = pixels[x, y]
                if r < 48 and g < 55 and b < 75 and a > 100:
                    pixels[x, y] = (7, 22, 45, 255)
                    
    # Smooth banner bottom edge
    for x in range(80, 730):
        y_silver = -1
        for y in range(430, 455):
            r, g, b, a = pixels[x, y]
            if r > 120 and g > 120 and b > 120 and a > 100:
                y_silver = y
        if y_silver != -1:
            y_edge = y_silver + 3
            r0, g0, b0, a0 = pixels[x, y_edge - 1]
            r1, g1, b1, a1 = pixels[x, y_edge]
            r2, g2, b2, a2 = pixels[x, y_edge + 1]
            nr = int(0.25 * r0 + 0.5 * r1 + 0.25 * r2)
            ng = int(0.25 * g0 + 0.5 * g1 + 0.25 * g2)
            nb = int(0.25 * b0 + 0.5 * b1 + 0.25 * b2)
            pixels[x, y_edge] = (nr, ng, nb, a1)
            
    # ==========================================
    # 4. EXTERNAL TRANSPARENCY & EDGE BLENDING
    # ==========================================
    visited_bg = [[False for _ in range(height)] for _ in range(width)]
    queue = collections.deque()
    for x in range(width):
        for y in [0, height - 1]:
            queue.append((x, y))
            visited_bg[x][y] = True
    for y in range(height):
        for x in [0, width - 1]:
            if not visited_bg[x][y]:
                queue.append((x, y))
                visited_bg[x][y] = True
                
    bg_threshold = 45
    bg_pixels = set()
    while queue:
        cx, cy = queue.popleft()
        r, g, b, a = pixels[cx, cy]
        if r < bg_threshold and g < bg_threshold and b < bg_threshold:
            bg_pixels.add((cx, cy))
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if not visited_bg[nx][ny]:
                        visited_bg[nx][ny] = True
                        queue.append((nx, ny))
                        
    for x, y in bg_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
    boundary_pixels = []
    for x in range(width):
        for y in range(height):
            if (x, y) not in bg_pixels:
                is_boundary = False
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if (nx, ny) in bg_pixels:
                            is_boundary = True
                            break
                if is_boundary:
                    boundary_pixels.append((x, y))
                    
    for x, y in boundary_pixels:
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        if brightness < 80:
            alpha = int(255 * (brightness / 80.0))
            pixels[x, y] = (r, g, b, max(0, min(255, alpha)))
            
    # Crop closely
    bbox = rgba_img.getbbox()
    if bbox:
        padding = 15
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(width, bbox[2] + padding)
        bottom = min(height, bbox[3] + padding)
        final_img = rgba_img.crop((left, top, right, bottom))
    else:
        final_img = rgba_img
        
    # Save the resulting perfected logo to all targets
    for path in [dest_path_1, dest_path_2, dest_path_3, dest_path_4]:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        final_img.save(path, "PNG")
        
    print(f"Successfully processed flawless premium shield logo and saved to all targets!")
    print(f"Final high-res size: {final_img.size}")

if __name__ == "__main__":
    process_flawless_logo()
