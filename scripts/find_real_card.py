import cv2
import numpy as np

def find_actual_card(img_path):
    img = cv2.imread(img_path)
    if img is None: return
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Anything that is not pure white (255) is the card
    _, thresh = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if contours:
        # Find the bounding box of ALL contours combined
        x_min, y_min = float('inf'), float('inf')
        x_max, y_max = 0, 0
        
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            # filter out tiny noise
            if w*h < 100: continue
            
            x_min = min(x_min, x)
            y_min = min(y_min, y)
            x_max = max(x_max, x + w)
            y_max = max(y_max, y + h)
            
        print(f"Actual card bounds: x={x_min}, y={y_min}, w={x_max - x_min}, h={y_max - y_min}")

find_actual_card(r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\engineer_rendered\card_0.png")
