import fitz
import os

def render_pdf_pages_to_images(pdf_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"Rendering {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        # Render at 300 DPI for high quality
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        
        image_filepath = os.path.join(output_dir, f"card_{page_num}.png")
        pix.save(image_filepath)
        print(f"Saved: {image_filepath}")
            
    print(f"Rendering complete for {pdf_path}. {len(doc)} pages rendered.")

if __name__ == "__main__":
    standard_pdf = r"C:\Users\basse\Desktop\AI QUEST\ENGINEER MODE\AI QUEST_ BUILD. TRAIN. DEPLOY_STANDARD_DECK.pdf"
    engineer_pdf = r"C:\Users\basse\Desktop\AI QUEST\ENGINEER MODE\AI QUEST_ BUILD. TRAIN. DEPLOY_ENGINEER_DECK.pdf"
    
    render_pdf_pages_to_images(standard_pdf, "public/cards/standard_rendered")
    render_pdf_pages_to_images(engineer_pdf, "public/cards/engineer_rendered")
