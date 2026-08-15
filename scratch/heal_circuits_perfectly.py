import os
import collections
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def auto_heal():
    source_path = r"C:\Users\basse\.gemini\antigravity\brain\7df0b398-acd7-41e0-bd53-5220599d7b4f\ai_quest_premium_shield_unbroken_circuits_1780138112019.png"
    dest_path_1 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/ai_quest_logo_clean.png"
    dest_path_2 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/logo.png"
    dest_path_3 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/ai_quest_logo_clean.png"
    dest_path_4 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/logo.png"
    
    img = Image.open(source_path)
    rgba_img = img.convert("RGBA")
    width, height = rgba_img.size
    
    # 1. Let's create a mask of cyan glowing pixels in the bottom-right region (under the banner)
    # The region of interest is x in [580, 780], y in [630, 750] (absolute coordinates in the 1024x1024 image)
    roi_x1, roi_y1 = 580, 630
    roi_x2, roi_y2 = 780, 750
    
    # Load pixels
    arr = np.array(rgba_img)
    
    # Let's search for the cyan glowing pixels inside the ROI
    # Cyan glow pixels have high green and blue, and moderate/high red due to glowing center
    # Let's define the glowing core: R > 120, G > 220, B > 220
    mask = (arr[roi_y1:roi_y2, roi_x1:roi_x2, 0] > 100) & \
           (arr[roi_y1:roi_y2, roi_x1:roi_x2, 1] > 200) & \
           (arr[roi_y1:roi_y2, roi_x1:roi_x2, 2] > 200)
           
    y_idx, x_idx = np.where(mask)
    
    # Map back to absolute coordinates
    points = [(int(x + roi_x1), int(y + roi_y1)) for x, y in zip(x_idx, y_idx)]
    print(f"Detected {len(points)} glowing cyan pixels in ROI.")
    
    # 2. Find endpoints of the lines inside the ROI
    # An endpoint in a pixel set is a pixel that has very few neighbors in the set
    # Let's find pixels in the set that have at most 1 neighbor in a 3x3 neighborhood
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
        # If it has 1 or 2 neighbors (ends of a line/stroke)
        if neighbors <= 2:
            endpoints.append((x, y))
            
    print(f"Detected {len(endpoints)} potential endpoints.")
    
    # 3. Let's find pairs of endpoints that are disconnected but close to each other (distance between 10 and 45 pixels)
    connections = []
    visited_pairs = set()
    for i, (x1, y1) in enumerate(endpoints):
        for j, (x2, y2) in enumerate(endpoints):
            if i >= j:
                continue
            dist = np.sqrt((x1 - x2)**2 + (y1 - y2)**2)
            if 10 <= dist <= 50:
                # Check if there is already a line between them
                # (if the straight line between them has very few cyan pixels, it means they are disconnected!)
                steps = int(dist)
                cx = np.linspace(x1, x2, steps)
                cy = np.linspace(y1, y2, steps)
                existing_cyan = 0
                for px, py in zip(cx, cy):
                    if (int(px), int(py)) in point_set:
                        existing_cyan += 1
                # If less than 40% of the line has existing cyan, they are disconnected!
                if existing_cyan / steps < 0.4:
                    connections.append(((x1, y1), (x2, y2), dist))
                    
    # Sort connections by distance and select the closest one to heal
    connections.sort(key=lambda x: x[2])
    print(f"Found {len(connections)} disconnected endpoint pairs.")
    
    # 4. Draw the healing line
    # We will draw a glowing cyan line on a separate layer, then composite it
    glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow_layer)
    
    for (x1, y1), (x2, y2), dist in connections[:2]:  # Heal the top 2 disconnected gaps
        print(f"Healing gap between {x1},{y1} and {x2},{y2} (dist={dist:.1f})")
        # Draw the glowing core (pure white-cyan, thin)
        draw.line([(x1, y1), (x2, y2)], fill=(200, 255, 255, 255), width=3)
        # Draw the main glow (cyan, thicker)
        draw.line([(x1, y1), (x2, y2)], fill=(0, 240, 255, 200), width=6)
        # Draw the outer glow (deep cyan, thickest)
        draw.line([(x1, y1), (x2, y2)], fill=(0, 180, 255, 100), width=10)
        
    # Apply a slight Gaussian blur to the glow layer to make it look completely natural and glowing!
    blurred_glow = glow_layer.filter(ImageFilter.GaussianBlur(radius=1.5))
    
    # Composite the glow layer onto the original image
    final_rgba = Image.alpha_composite(rgba_img, blurred_glow)
    
    # 5. Make external background transparent (same BFS as before to keep everything consistent)
    pixels = final_rgba.load()
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
        
    # Smooth outer edges
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
    bbox = final_rgba.getbbox()
    if bbox:
        padding = 15
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(width, bbox[2] + padding)
        bottom = min(height, bbox[3] + padding)
        cropped_img = final_rgba.crop((left, top, right, bottom))
    else:
        cropped_img = final_rgba
        
    # Save the resulting image to all targets
    for path in [dest_path_1, dest_path_2, dest_path_3, dest_path_4]:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        cropped_img.save(path, "PNG")
        
    print(f"Successfully healed and saved to all targets!")
    print(f"New high-res size: {cropped_img.size}")

if __name__ == "__main__":
    auto_heal()
