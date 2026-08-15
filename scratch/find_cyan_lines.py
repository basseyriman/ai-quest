from PIL import Image
import numpy as np

def find_cyan():
    img_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\crop_test.png"
    img = Image.open(img_path)
    arr = np.array(img)
    
    # Cyan is high in G and B, and relatively lower in R, or high in all but very high in G and B.
    # Let's search for pixels where G > 180, B > 180 and R < 180
    mask = (arr[:, :, 1] > 180) & (arr[:, :, 2] > 180) & (arr[:, :, 0] < 200)
    y_coords, x_coords = np.where(mask)
    
    print(f"Found {len(x_coords)} cyan-ish pixels in crop_test.png.")
    if len(x_coords) > 0:
        print("Min X:", x_coords.min(), "Max X:", x_coords.max())
        print("Min Y:", y_coords.min(), "Max Y:", y_coords.max())
        
        # Let's print some coordinates to see the path of the lines
        for i in range(0, len(x_coords), max(1, len(x_coords) // 20)):
            print(f"Pixel at crop-relative x={x_coords[i]}, y={y_coords[i]} -> RGB={arr[y_coords[i], x_coords[i], :3]}")

if __name__ == "__main__":
    find_cyan()
