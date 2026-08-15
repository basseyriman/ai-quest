import cv2
import numpy as np

def analyze_grid(img_path):
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    
    # Clear crop marks (ignore margins of 60 pixels)
    thresh[0:60, :] = 0
    thresh[-60:, :] = 0
    thresh[:, 0:60] = 0
    thresh[:, -60:] = 0
    
    row_sums = np.sum(thresh, axis=1)
    col_sums = np.sum(thresh, axis=0)
    
    # Find contiguous blocks of rows > 0 (the cards)
    row_blocks = []
    in_block = False
    start = 0
    for i, val in enumerate(row_sums):
        if val > 1000 and not in_block:
            start = i
            in_block = True
        elif val <= 1000 and in_block:
            row_blocks.append((start, i))
            in_block = False
    if in_block: row_blocks.append((start, len(row_sums)))
            
    col_blocks = []
    in_block = False
    start = 0
    for i, val in enumerate(col_sums):
        if val > 1000 and not in_block:
            start = i
            in_block = True
        elif val <= 1000 and in_block:
            col_blocks.append((start, i))
            in_block = False
    if in_block: col_blocks.append((start, len(col_sums)))

    print(f"Row blocks (Y ranges): {row_blocks}")
    print(f"Col blocks (X ranges): {col_blocks}")

analyze_grid(r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\engineer_rendered\card_0.png")
