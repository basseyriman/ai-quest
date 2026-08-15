from PIL import Image
import collections

def process():
    # Source image: white background logo with 43px dark sidebar on the left and tiny dark border on the right
    source_path = "C:/Users/basse/.gemini/antigravity/brain/cb29d6da-a1c0-4fdf-b333-e3e9cfc41260/media__1780100920343.png"
    img = Image.open(source_path)
    
    # 1. High-precision crop:
    # - Left edge at 43px to discard the dark sidebar
    # - Right edge at 302px (logo ends at 296px, so we keep a safe 6px white margin and exclude the right dark border entirely)
    cropped_logo = img.crop((43, 0, 302, img.height))
    
    # Convert to RGBA
    rgba_img = cropped_logo.convert("RGBA")
    width, height = rgba_img.size
    pixels = rgba_img.load()
    
    # 2. BFS flood-fill from corners to find ONLY the external background
    visited = [[False for _ in range(height)] for _ in range(width)]
    queue = collections.deque()
    
    # Seed BFS from all borders of the cropped image
    for x in range(width):
        for y in [0, height - 1]:
            queue.append((x, y))
            visited[x][y] = True
    for y in range(height):
        for x in [0, width - 1]:
            if not visited[x][y]:
                queue.append((x, y))
                visited[x][y] = True
                
    # Threshold for background white pixels
    bg_threshold = 240
    
    while queue:
        cx, cy = queue.popleft()
        r, g, b, a = pixels[cx, cy]
        
        # If it's a flat white background pixel
        if r >= bg_threshold and g >= bg_threshold and b >= bg_threshold:
            # Make the external background completely transparent
            pixels[cx, cy] = (r, g, b, 0)
            
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if not visited[nx][ny]:
                        visited[nx][ny] = True
                        queue.append((nx, ny))
        else:
            # Smooth blend on the very outer border edge
            avg = (r + g + b) / 3.0
            if avg >= bg_threshold:
                alpha = int(255 * (255.0 - avg) / (255.0 - bg_threshold))
                pixels[cx, cy] = (r, g, b, max(0, min(255, alpha)))

    # 3. Process the inner shield area (unvisited pixels)
    # Convert the inner white banner to a premium dark navy,
    # and invert the dark navy text "BUILD. TRAIN. DEPLOY." to a crisp white!
    for x in range(width):
        for y in range(height):
            if not visited[x][y]:
                r, g, b, a = pixels[x, y]
                
                # Check if it's the inner white banner behind "AI QUEST"
                if r >= 200 and g >= 200 and b >= 200:
                    # Convert to premium rich dark navy (matching the dark box background style)
                    pixels[x, y] = (7, 22, 45, 255)
                # Check if it's the dark text "BUILD. TRAIN. DEPLOY." (navy/black)
                elif r < 60 and g < 60 and b < 60 and a > 0:
                    # Invert to crisp premium white text
                    pixels[x, y] = (255, 255, 255, 255)

    # 4. Safe trim (padding of 10px) to preserve all glowing edges perfectly
    bbox = rgba_img.getbbox()
    if bbox:
        padding = 10
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(width, bbox[2] + padding)
        bottom = min(height, bbox[3] + padding)
        
        final_img = rgba_img.crop((left, top, right, bottom))
        final_img.save("public/ai_quest_logo_clean.png", "PNG")
        print(f"Premium box-matching logo saved cleanly. Bbox: {left}, {top}, {right}, {bottom}")
    else:
        rgba_img.save("public/ai_quest_logo_clean.png", "PNG")
        print("Premium box-matching logo saved without cropping.")

if __name__ == "__main__":
    process()
