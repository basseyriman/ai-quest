import fitz
import os

pdf_path = "Game design/AI CARD GAME.pdf"
output_dir = "public/cards"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print(f"Opening {pdf_path}...")
doc = fitz.open(pdf_path)

img_count = 0
for page_num in range(len(doc)):
    page = doc.load_page(page_num)
    images = page.get_images(full=True)
    
    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        image_filename = f"extracted_card_{page_num}_{img_index}.{image_ext}"
        image_filepath = os.path.join(output_dir, image_filename)
        
        with open(image_filepath, "wb") as f:
            f.write(image_bytes)
            
        print(f"Saved: {image_filepath}")
        img_count += 1
        
print(f"Extraction complete. {img_count} images found.")
