import os
import shutil
from pypdf import PdfReader, PdfWriter

brain_dir = "C:\\Users\\basse\\.gemini\\antigravity\\brain\\c2c29a6a-b14e-4e5c-b8e3-da232e2eeabb"
base_dir = "c:\\Users\\basse\\Documents\\RimanTech\\AI QUEST GAME\\ai-quest"
production_dir = os.path.join(base_dir, "production_artwork")
temp_dir = os.path.join(production_dir, "temp")

templates = {
    "cards": os.path.join(base_dir, "templates", "cards_template.pdf"),
    "box": os.path.join(base_dir, "templates", "box_template.pdf"),
    "rulebook": os.path.join(base_dir, "templates", "rulebook_template.pdf")
}

def merge_single_page(template_path, artwork_path, output_path):
    if not os.path.exists(template_path):
        print(f"Template missing: {template_path}")
        return False
    if not os.path.exists(artwork_path):
        print(f"Artwork missing: {artwork_path}")
        return False
        
    reader_template = PdfReader(template_path)
    reader_artwork = PdfReader(artwork_path)
    writer = PdfWriter()
    
    # Clone page from template to preserve original vector layers and logo
    page_template = reader_template.pages[0]
    page_artwork = reader_artwork.pages[0]
    
    # Overlay artwork on top of template
    page_template.merge_page(page_artwork)
    writer.add_page(page_template)
    
    with open(output_path, "wb") as f:
        writer.write(f)
    print(f"Successfully merged: {os.path.basename(output_path)}")
    return True

def merge_rulebook(template_path, artwork_path, output_path):
    if not os.path.exists(template_path):
        print(f"Template missing: {template_path}")
        return False
    if not os.path.exists(artwork_path):
        print(f"Artwork missing: {artwork_path}")
        return False
        
    reader_template = PdfReader(template_path)
    reader_artwork = PdfReader(artwork_path)
    writer = PdfWriter()
    
    # Page 1: Merge artwork page 1 onto template page 1 (front)
    page1_template = reader_template.pages[0]
    page1_artwork = reader_artwork.pages[0]
    page1_template.merge_page(page1_artwork)
    writer.add_page(page1_template)
    
    # Page 2: Merge artwork page 2 onto template page 2 (back)
    if len(reader_template.pages) > 1 and len(reader_artwork.pages) > 1:
        page2_template = reader_template.pages[1]
        page2_artwork = reader_artwork.pages[1]
        page2_template.merge_page(page2_artwork)
        writer.add_page(page2_template)
    elif len(reader_template.pages) > 1:
        writer.add_page(reader_template.pages[1])
        
    with open(output_path, "wb") as f:
        writer.write(f)
    print(f"Successfully merged rulebook: {os.path.basename(output_path)}")
    return True

def run():
    print("Starting merging of templates and artwork PDFs...")
    
    # 1. Cards Sheets
    for i in range(5):
        temp_art = os.path.join(temp_dir, f"temp_cards_sheet_{i+1}.pdf")
        out_pdf = os.path.join(production_dir, f"01_cards_sheet_{i+1}.pdf" if i == 0 else f"0{i+1}_cards_sheet_{i+1}.pdf")
        merge_single_page(templates["cards"], temp_art, out_pdf)
        
    # 2. Box Sheet
    temp_box = os.path.join(temp_dir, "temp_box_art_sheet.pdf")
    out_box = os.path.join(production_dir, "05_box_art_sheet.pdf")
    merge_single_page(templates["box"], temp_box, out_box)
    
    # 3. Rulebook Sheet
    temp_rulebook = os.path.join(temp_dir, "temp_rulebook_sheet.pdf")
    out_rulebook = os.path.join(production_dir, "06_rulebook_sheet.pdf")
    merge_rulebook(templates["rulebook"], temp_rulebook, out_rulebook)
    
    # 4. Clean up temp directory
    # try:
    #     shutil.rmtree(temp_dir)
    #     print("Cleaned up temporary PDF folder.")
    # except Exception as e:
    #     print(f"Failed to remove temp folder: {e}")
        
    print("All production PDFs successfully updated!")

if __name__ == "__main__":
    run()
