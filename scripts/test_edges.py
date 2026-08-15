import cv2
import numpy as np

def find_all(img_path):
    img = cv2.imread(img_path)
    if img is None: return
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
    dilated = cv2.dilate(edges, kernel, iterations=3)
    
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"Total contours: {len(contours)}")
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        area = w * h
        if area > 10000:
            print(f"Box: x={x}, y={y}, w={w}, h={h}, area={area}")

find_all(r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\engineer_rendered\card_0.png")
