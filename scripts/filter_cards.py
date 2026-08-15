import os
import glob
import cv2
import numpy as np
from collections import defaultdict

def filter_backs_and_blanks(directory):
    files = glob.glob(os.path.join(directory, "*.png"))
    
    # We will use histogram or average color of the center region
    groups = defaultdict(list)
    
    for f in files:
        img = cv2.imread(f)
        if img is None: continue
        
        # Resize to very small to capture the general "look" (ignoring text differences)
        # But wait, different card fronts might have the same background!
        # If we resize to 32x32, we capture some text layout.
        # But card backs are EXACTLY identical.
        # Card fronts are mostly unique.
        
        # Let's use structural similarity or exact hash of a resized 8x8 image
        small = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (16, 16))
        
        # Simple perceptual hash (average hash)
        avg = small.mean()
        phash = "".join(['1' if p > avg else '0' for p in small.flatten()])
        groups[phash].append(f)
        
    print(f"Total unique perceptual hashes in {directory}: {len(groups)}")
    
    deleted_count = 0
    valid_count = 0
    
    for phash, file_list in groups.items():
        if len(file_list) >= 8:
            # If a card appears 8 or more times identically, it is almost certainly a card back or blank slot!
            print(f"Identified {len(file_list)} identical cards -> DELETING (likely back/blank)")
            for f in file_list:
                os.remove(f)
                deleted_count += 1
        else:
            valid_count += len(file_list)
            
    print(f"Finished {directory}. Deleted {deleted_count}. Kept {valid_count} unique card fronts.")

if __name__ == "__main__":
    filter_backs_and_blanks(r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\standard_sliced")
    filter_backs_and_blanks(r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\engineer_sliced")
