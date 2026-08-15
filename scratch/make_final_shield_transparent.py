import os
import collections
from PIL import Image

def process():
    source_path = r"C:\Users\basse\.gemini\antigravity\brain\7df0b398-acd7-41e0-bd53-5220599d7b4f\ai_quest_premium_shield_unbroken_circuits_1780138112019.png"
    dest_path_1 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/ai_quest_logo_clean.png"
    dest_path_2 = "c:/Users/basse/Documents/RimanTech/AI QUEST GAME/ai-quest/public/logo.png"
    dest_path_3 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/ai_quest_logo_clean.png"
    dest_path_4 = "c:/Users/basse/Documents/RimanTech/AIQuestLogo/logo.png"
    
    img = Image.open(source_path)
    rgba_img = img.convert("RGBA")
    width, height = rgba_img.size
    pixels = rgba_img.load()
    
    # 1. BFS flood-fill from corners to find ONLY the external black background
    visited = [[False for _ in range(height)] for _ in range(width)]
    queue = collections.deque()
    
    # Seed BFS from all borders of the image
    for x in range(width):
        for y in [0, height - 1]:
            queue.append((x, y))
            visited[x][y] = True
    for y in range(height):
        for x in [0, width - 1]:
            if not visited[x][y]:
                queue.append((x, y))
                visited[x][y] = True
                
    # Since background is flat black, we look for pixels with low RGB values (below 45)
    bg_threshold = 45
    bg_pixels = set()
    
    while queue:
        cx, cy = queue.popleft()
        r, g, b, a = pixels[cx, cy]
        
        # If it's a black background pixel
        if r < bg_threshold and g < bg_threshold and b < bg_threshold:
            bg_pixels.add((cx, cy))
            
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if not visited[nx][ny]:
                        visited[nx][ny] = True
                        queue.append((nx, ny))
                        
    # 2. Make ONLY the external background transparent
    for x, y in bg_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
    # 3. Smooth the outer border transition to prevent any jagged edges or black halos
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
                    
    # Smooth blend outer edge pixels
    for x, y in boundary_pixels:
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3.0
        # If the outer edge pixel is very dark, make it semi-transparent to blend smoothly
        if brightness < 80:
            alpha = int(255 * (brightness / 80.0))
            pixels[x, y] = (r, g, b, max(0, min(255, alpha)))
            
    # 4. Crop the image closely with a 15px padding
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
        
    # Save the resulting image to all targets
    for path in [dest_path_1, dest_path_2, dest_path_3, dest_path_4]:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        final_img.save(path, "PNG")
        
    print(f"Successfully processed final unbroken premium shield logo and saved to all targets!")
    print(f"New high-res size: {final_img.size}")

if __name__ == "__main__":
    process()
