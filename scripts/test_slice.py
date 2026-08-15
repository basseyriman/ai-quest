import cv2
import numpy as np
import os
import glob

def slice_with_contours(img_path, output_dir, prefix):
    img = cv2.imread(img_path)
    if img is None: return 0
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    _, thresh = cv2.threshold(gray, 245, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    h, w = img.shape[:2]
    min_area = 50000 
    
    boxes = [cv2.boundingRect(c) for c in contours]
    boxes = [b for b in boxes if b[2]*b[3] > min_area]
    
    boxes.sort(key=lambda b: (b[1] // 150, b[0]))
    
    count = 0
    for x, y, cw, ch in boxes:
        card_img = img[y:y+ch, x:x+cw]
        out_path = os.path.join(output_dir, f"{prefix}_{count}.png")
        cv2.imwrite(out_path, card_img)
        count += 1
        
    return count

os.makedirs("public/cards/sliced", exist_ok=True)
res = slice_with_contours(r"public\cards\engineer_rendered\card_0.png", r"public\cards\sliced", "test")
print(f"Cards found: {res}")
