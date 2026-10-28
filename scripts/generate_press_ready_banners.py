import os
import gc
from PIL import Image
import fitz

pub_dir = r'c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest\public'
master_png = os.path.join(pub_dir, 'rollup_banner_luxury_master.png')

def create_press_ready_banner(trim_w_mm, trim_h_mm, out_filename):
    gc.collect()
    bleed_mm = 3.0
    slug_mm = 5.0
    
    total_w_mm = trim_w_mm + 2 * (bleed_mm + slug_mm)
    total_h_mm = trim_h_mm + 2 * (bleed_mm + slug_mm)
    
    pt_per_mm = 72.0 / 25.4
    page_w_pt = total_w_mm * pt_per_mm
    page_h_pt = total_h_mm * pt_per_mm
    
    trim_w_pt = trim_w_mm * pt_per_mm
    trim_h_pt = trim_h_mm * pt_per_mm
    bleed_pt = bleed_mm * pt_per_mm
    slug_pt = slug_mm * pt_per_mm
    
    offset_x = slug_pt + bleed_pt
    offset_y = slug_pt + bleed_pt
    
    bleed_box_w_pt = trim_w_pt + 2 * bleed_pt
    bleed_box_h_pt = trim_h_pt + 2 * bleed_pt
    
    # For 850mm width, create a lossless PNG padded with matching deep midnight background
    temp_png_path = None
    if trim_w_mm == 850:
        temp_png_path = os.path.join(pub_dir, 'temp_lossless_850.png')
        with Image.open(master_png) as im_raw:
            im_adapted = Image.new('RGBA', (1700, 4000), (3, 7, 18, 255))
            # Match vertical gradient on the 50px left/right bleed strips
            for y in range(4000):
                px = im_raw.getpixel((0, y))
                for x in range(50):
                    im_adapted.putpixel((x, y), px)
                    im_adapted.putpixel((1650 + x, y), px)
            im_adapted.paste(im_raw, (50, 0))
            im_adapted.save(temp_png_path, 'PNG')
            del im_adapted
        gc.collect()
        img_to_embed = temp_png_path
    else:
        img_to_embed = master_png
    
    # Create PDF with PyMuPDF embedding lossless PNG (zero smoky CMYK JPEG wash!)
    doc = fitz.open()
    page = doc.new_page(width=page_w_pt, height=page_h_pt)
    
    # Fill full page slug area with white so black crop marks outside the 3mm bleed are 100% visible
    bleed_rect = fitz.Rect(slug_pt, slug_pt, slug_pt + bleed_box_w_pt, slug_pt + bleed_box_h_pt)
    trim_rect = fitz.Rect(offset_x, offset_y, offset_x + trim_w_pt, offset_y + trim_h_pt)
    page.set_bleedbox(bleed_rect)
    page.set_trimbox(trim_rect)
    page.insert_image(bleed_rect, filename=img_to_embed)
    
    # Professional Printer Trim / Crop Marks (outside the 3mm bleed box in the 5mm slug margin)
    mark_len = 4.0 * pt_per_mm
    mark_gap = 3.2 * pt_per_mm  # Starts just outside the 3mm bleed box
    
    x0, x1 = offset_x, offset_x + trim_w_pt
    y0, y1 = offset_y, offset_y + trim_h_pt
    
    shape = page.new_shape()
    # Top-Left
    shape.draw_line(fitz.Point(x0, y0 - mark_gap), fitz.Point(x0, y0 - mark_gap - mark_len))
    shape.draw_line(fitz.Point(x0 - mark_gap, y0), fitz.Point(x0 - mark_gap - mark_len, y0))
    # Top-Right
    shape.draw_line(fitz.Point(x1, y0 - mark_gap), fitz.Point(x1, y0 - mark_gap - mark_len))
    shape.draw_line(fitz.Point(x1 + mark_gap, y0), fitz.Point(x1 + mark_gap + mark_len, y0))
    # Bottom-Left
    shape.draw_line(fitz.Point(x0, y1 + mark_gap), fitz.Point(x0, y1 + mark_gap + mark_len))
    shape.draw_line(fitz.Point(x0 - mark_gap, y1), fitz.Point(x0 - mark_gap - mark_len, y1))
    # Bottom-Right
    shape.draw_line(fitz.Point(x1, y1 + mark_gap), fitz.Point(x1, y1 + mark_gap + mark_len))
    shape.draw_line(fitz.Point(x1 + mark_gap, y1), fitz.Point(x1 + mark_gap + mark_len, y1))
    
    shape.finish(color=(0, 0, 0), width=0.75)
    shape.commit()
    
    out_path = os.path.join(pub_dir, out_filename)
    doc.save(out_path)
    doc.close()
    
    if temp_png_path and os.path.exists(temp_png_path):
        os.remove(temp_png_path)
        
    print(f'Successfully generated {out_filename}')
    return out_path

create_press_ready_banner(800, 2000, 'AI_Quest_Rollup_Banner_800x2000_PressReady_Bleed_CMYK.pdf')
create_press_ready_banner(850, 2000, 'AI_Quest_Rollup_Banner_850x2000_PressReady_Bleed_CMYK.pdf')
