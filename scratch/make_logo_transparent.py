import os
import collections
from PIL import Image, ImageFilter

def process_logo():
    source_path = r"C:\Users\basse\.gemini\antigravity\brain\7df0b398-acd7-41e0-bd53-5220599d7b4f\ai_quest_logo_hd_1780103312970.png"
    dest_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\ai_quest_logo_hd_transparent.png"
    
    img = Image.open(source_path)
    rgba_img = img.convert("RGBA")
    width, height = rgba_img.size
    pixels = rgba_img.load()
    
    # 1. Flood-fill from corners to identify the external black background
    visited = [[False for _ in range(height)] for _ in range(width)]
    queue = collections.deque()
    
    # Seed from all four borders
    for x in range(width):
        for y in [0, height - 1]:
            queue.append((x, y))
            visited[x][y] = True
    for y in range(height):
        for x in [0, width - 1]:
            if not visited[x][y]:
                queue.append((x, y))
                visited[x][y] = True
                
    # We define background black as RGB values below a threshold
    # Since the background is solid flat black, it will be close to (0, 0, 0)
    bg_threshold = 45
    
    bg_pixels = set()
    
    while queue:
        cx, cy = queue.popleft()
        r, g, b, a = pixels[cx, cy]
        
        # If it is dark enough to be background
        if r < bg_threshold and g < bg_threshold and b < bg_threshold:
            bg_pixels.add((cx, cy))
            
            # Explore neighbors
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if not visited[nx][ny]:
                        visited[nx][ny] = True
                        queue.append((nx, ny))
                        
    # 2. Make identified background pixels transparent
    for x, y in bg_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
    # 3. Smooth the edges (anti-aliasing / feathering)
    # We find boundary pixels (non-transparent pixels that have a transparent neighbor)
    # and smoothly blend their alpha based on their brightness.
    boundary_pixels = []
    for x in range(width):
        for y in range(height):
            if (x, y) not in bg_pixels:
                # Check neighbors
                is_boundary = False
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if (nx, ny) in bg_pixels:
                            is_boundary = True
                            break
                if is_boundary:
                    boundary_pixels.append((x, y))
                    
    # Smooth blend boundary pixels: if a boundary pixel is very dark, make it semi-transparent
    for x, y in boundary_pixels:
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        # If it's dark, reduce alpha proportionally to smooth out the transition
        if brightness < 80:
            alpha = int(255 * (brightness / 80.0))
            pixels[x, y] = (r, g, b, max(0, min(255, alpha)))
            
    # 4. Crop the image to its bounding box plus padding
    bbox = rgba_img.getbbox()
    if bbox:
        padding = 15
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(width, bbox[2] + padding)
        bottom = min(height, bbox[3] + padding)
        
        cropped_img = rgba_img.crop((left, top, right, bottom))
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        cropped_img.save(dest_path, "PNG")
        print(f"Saved perfectly transparent high-resolution logo to {dest_path}")
        print(f"New size: {cropped_img.size}")
    else:
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        rgba_img.save(dest_path, "PNG")
        print(f"Saved transparent logo without cropping to {dest_path}")

if __name__ == "__main__":
    process_logo()
