import os
import glob
from PIL import Image

def slice_sheets(input_dir, output_dir, prefix):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    sheets = glob.glob(os.path.join(input_dir, "*.png"))
    count = 0
    
    for sheet_path in sheets:
        img = Image.open(sheet_path)
        w, h = img.size
        
        card_w = w / 3.0
        card_h = h / 3.0
        
        for row in range(3):
            for col in range(3):
                left = int(col * card_w)
                top = int(row * card_h)
                right = int((col + 1) * card_w)
                bottom = int((row + 1) * card_h)
                
                card_img = img.crop((left, top, right, bottom))
                
                # Very simple heuristic to skip pure white cards if any
                extrema = card_img.convert("L").getextrema()
                if extrema == (255, 255):
                    continue
                
                out_path = os.path.join(output_dir, f"{prefix}_{count}.png")
                card_img.save(out_path)
                count += 1
                
    print(f"Sliced {len(sheets)} sheets into {count} individual cards for {prefix}.")

if __name__ == "__main__":
    slice_sheets("public/cards/standard_rendered", "public/cards/standard_sliced", "std")
    slice_sheets("public/cards/engineer_rendered", "public/cards/engineer_sliced", "eng")
