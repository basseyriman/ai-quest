from PIL import Image
import numpy as np

def find_dark_blue():
    img_path = r"c:\Users\basse\Documents\RimanTech\AIQuestLogo\ai_quest_logo_clean.png"
    img = Image.open(img_path)
    arr = np.array(img)
    
    # Define ROI
    roi_x1, roi_y1 = 550, 480
    roi_x2, roi_y2 = 680, 560
    
    # We want to find the dark blue trace pixels
    # Dark blue trace color: R between 10 and 60, G between 20 and 110, B between 80 and 180
    mask = (arr[roi_y1:roi_y2, roi_x1:roi_x2, 0] >= 10) & (arr[roi_y1:roi_y2, roi_x1:roi_x2, 0] <= 60) & \
           (arr[roi_y1:roi_y2, roi_x1:roi_x2, 1] >= 20) & (arr[roi_y1:roi_y2, roi_x1:roi_x2, 1] <= 110) & \
           (arr[roi_y1:roi_y2, roi_x1:roi_x2, 2] >= 80) & (arr[roi_y1:roi_y2, roi_x1:roi_x2, 2] <= 180)
           
    y_coords, x_coords = np.where(mask)
    print(f"Found {len(x_coords)} dark blue pixels in ROI.")
    if len(x_coords) > 0:
        print("Min X:", x_coords.min() + roi_x1, "Max X:", x_coords.max() + roi_x1)
        print("Min Y:", y_coords.min() + roi_y1, "Max Y:", y_coords.max() + roi_y1)
        
        # Let's print some coordinates to see the path of the lines
        for i in range(0, len(x_coords), max(1, len(x_coords) // 20)):
            px = x_coords[i] + roi_x1
            py = y_coords[i] + roi_y1
            print(f"Pixel at absolute x={px}, y={py} -> RGB={arr[py, px, :3]}")

if __name__ == "__main__":
    find_dark_blue()
