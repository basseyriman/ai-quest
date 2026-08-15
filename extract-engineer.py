import fitz
import os
import sys

def extract_pdf_images(pdf_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"Opening {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    img_count = 0
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        images = page.get_images(full=True)
        
        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            image_filename = f"card_{page_num}_{img_index}.{image_ext}"
            image_filepath = os.path.join(output_dir, image_filename)
            
            with open(image_filepath, "wb") as f:
                f.write(image_bytes)
                
            print(f"Saved: {image_filepath}")
            img_count += 1
            
    print(f"Extraction complete for {pdf_path}. {img_count} images found.")

if __name__ == "__main__":
    standard_pdf = r"C:\Users\basse\Desktop\AI QUEST\ENGINEER MODE\AI QUEST_ BUILD. TRAIN. DEPLOY_STANDARD_DECK.pdf"
    engineer_pdf = r"C:\Users\basse\Desktop\AI QUEST\ENGINEER MODE\AI QUEST_ BUILD. TRAIN. DEPLOY_ENGINEER_DECK.pdf"
    
    extract_pdf_images(standard_pdf, "public/cards/standard_deck")
    extract_pdf_images(engineer_pdf, "public/cards/engineer_deck")
