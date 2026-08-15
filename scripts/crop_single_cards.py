import os
import glob
from PIL import Image

def crop_single(input_dir, output_dir, prefix):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    sheets = glob.glob(os.path.join(input_dir, "*.png"))
    count = 0
    
    # The A4 page is 1190 x 1684. The actual card is one giant card in the middle!
    left = 55
    top = 135
    right = 1135
    bottom = 1625
    
    for sheet_path in sheets:
        img = Image.open(sheet_path)
        card_img = img.crop((left, top, right, bottom))
        
        # Resize to an optimized web resolution while keeping the perfect aspect ratio
        card_img = card_img.resize((450, 630), Image.Resampling.LANCZOS)
        
        out_path = os.path.join(output_dir, f"{prefix}_{count}.png")
        card_img.save(out_path)
        count += 1
        
    print(f"Successfully cropped {count} full cards for {prefix}.")

if __name__ == "__main__":
    crop_single(r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\standard_rendered", r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\standard_final", "std")
    crop_single(r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\engineer_rendered", r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public\cards\engineer_final", "eng")
