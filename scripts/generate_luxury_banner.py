import os
import math
import gc
from PIL import Image, ImageDraw, ImageFont, ImageFilter

gc.collect()

base_dir = os.path.abspath('ai-quest')
pub_dir = os.path.join(base_dir, 'public')

width, height = 1600, 4000  # 1:2.5 ratio matching 800mm x 2000mm

win_fonts = os.environ.get('WINDIR', 'C:\\Windows') + '\\Fonts'

# Fonts
font_kicker = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 28)
font_title1 = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 40)
font_pill = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 38)
font_ribbon = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 24)

font_sec_title = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 40)
font_sec_sub = ImageFont.truetype(os.path.join(win_fonts, 'segoeui.ttf'), 26)

font_card_num = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 40)
font_card_title = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 34)
font_card_desc = ImageFont.truetype(os.path.join(win_fonts, 'segoeui.ttf'), 25)

font_spec_val = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 32)
font_spec_sub = ImageFont.truetype(os.path.join(win_fonts, 'segoeui.ttf'), 23)

font_cta_gold = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 30)
font_cta_head = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 46)
font_cta_sub = ImageFont.truetype(os.path.join(win_fonts, 'segoeui.ttf'), 26)
font_cta_url = ImageFont.truetype(os.path.join(win_fonts, 'bahnschrift.ttf'), 54)
font_credit = ImageFont.truetype(os.path.join(win_fonts, 'segoeui.ttf'), 24)

# ==========================================
# 1. BASE CANVAS & DEEP LUXURY CYBER GRADIENT
# ==========================================
img = Image.new('RGB', (width, height), (3, 7, 18))
draw = ImageDraw.Draw(img, 'RGBA')

# Rich vertical midnight cyber-navy gradient (no smoky haze, ultra-deep blacks & blues)
for y in range(height):
    ratio = y / height
    if ratio < 0.45:
        t = ratio / 0.45
        r = int(3 + t * 5)
        g = int(7 + t * 11)
        b = int(18 + t * 22)
    else:
        t = (ratio - 0.45) / 0.55
        r = int(8 - t * 6)
        g = int(18 - t * 13)
        b = int(40 - t * 26)
    draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

# Subtle architectural tech grid in background
for x in range(80, width, 80):
    draw.line([(x, 0), (x, height)], fill=(14, 165, 233, 7), width=1)
for y in range(80, height, 80):
    draw.line([(0, y), (width, y)], fill=(14, 165, 233, 7), width=1)

# Smooth Radial Spotlights (fading smoothly to 0 at outer edge -> ZERO hard oval rings!)
glow_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_layer)

def add_smooth_spotlight(cx, cy, rx, ry, color, max_alpha):
    steps = 40
    for step in range(steps, 0, -1):
        # At step=steps (outer edge), t=0 -> alpha=0. At step=1 (center), t~1 -> alpha=max_alpha.
        t = 1.0 - ((step - 1) / float(steps))
        alpha = int(max_alpha * (t ** 2.2))
        cur_rx = int(rx * (step / float(steps)))
        cur_ry = int(ry * (step / float(steps)))
        glow_draw.ellipse(
            [cx - cur_rx, cy - cur_ry, cx + cur_rx, cy + cur_ry],
            fill=(color[0], color[1], color[2], alpha)
        )

# Gentle deep cyan/blue illumination behind Logo, Hero 3D Box, and CTA
add_smooth_spotlight(width // 2, 350, 560, 290, (14, 165, 233), 26)
add_smooth_spotlight(width // 2, 1340, 720, 520, (6, 182, 212), 34)
add_smooth_spotlight(width // 2, 3215, 680, 360, (14, 116, 144), 24)

img.paste(glow_layer, (0, 0), glow_layer)
del glow_layer
del glow_draw
gc.collect()
draw = ImageDraw.Draw(img, 'RGBA')

# Cyber Exhibition Frame
frame_margin = 35
safe_bottom = 320  # 160mm safe clearance at bottom for roller cassette
draw.rounded_rectangle(
    [frame_margin, 40, width - frame_margin, height - safe_bottom],
    radius=32,
    outline=(6, 182, 212, 115),
    width=3
)
# Inner accent hairline
draw.rounded_rectangle(
    [frame_margin + 8, 48, width - frame_margin - 8, height - safe_bottom - 8],
    radius=26,
    outline=(14, 165, 233, 45),
    width=1
)

# Corner cyber accents
for (cx, cy) in [(frame_margin, 40), (width - frame_margin, 40), (frame_margin, height - safe_bottom), (width - frame_margin, height - safe_bottom)]:
    draw.ellipse([cx - 9, cy - 9, cx + 9, cy + 9], fill=(34, 211, 238, 255))
    draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=(255, 255, 255, 255))

# ==========================================
# 2. TOP HEADER & LOGO (y: 68 to 815)
# ==========================================
kicker = "RIMANSTECH INDUSTRIES PRESENTS"
k_bbox = font_kicker.getbbox(kicker)
draw.text(((width - (k_bbox[2] - k_bbox[0])) // 2 - k_bbox[0], 68), kicker, font=font_kicker, fill=(148, 163, 184, 255))

# Logo (sized & positioned so shield tip has 40px clean clearance above Title 1!)
logo_path = os.path.join(pub_dir, 'logo.png')
if os.path.exists(logo_path):
    logo_img = Image.open(logo_path).convert('RGBA')
    logo_w = 485
    logo_h = int(logo_img.height * (logo_w / logo_img.width))  # ~481px (y: 112 to 593)
    logo_resized = logo_img.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    img.paste(logo_resized, ((width - logo_w) // 2, 112), logo_resized)
    del logo_img
    del logo_resized
    gc.collect()

# Title 1: Category Tagline (at y=634, 41px below logo shield tip!)
title1 = "THE MACHINE LEARNING STRATEGY CARD GAME"
t1_bbox = font_title1.getbbox(title1)
draw.text(((width - (t1_bbox[2] - t1_bbox[0])) // 2 - t1_bbox[0], 634), title1, font=font_title1, fill=(56, 189, 248, 255))

# Title 2: Prominent Glowing Action Pill Badge
pill_txt = "BUILD  ·  TRAIN  ·  DEPLOY"
p_bbox = font_pill.getbbox(pill_txt)
p_txt_w = p_bbox[2] - p_bbox[0]
p_txt_h = p_bbox[3] - p_bbox[1]
pill_w = p_txt_w + 110
pill_h = 72
pill_x = (width - pill_w) // 2
pill_y = 704

# Glowing Pill Badge
draw.rounded_rectangle(
    [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
    radius=36,
    fill=(10, 30, 68, 245),
    outline=(34, 211, 238, 255),
    width=3
)
draw.text(
    (pill_x + (pill_w - p_txt_w) // 2 - p_bbox[0], pill_y + (pill_h - p_txt_h) // 2 - p_bbox[1]),
    pill_txt,
    font=font_pill,
    fill=(255, 255, 255, 255)
)

# Cyber divider line (giving 60px breathing room to the 3D box top)
divider_y = 815
draw.line([(width // 2 - 360, divider_y), (width // 2 + 360, divider_y)], fill=(6, 182, 212, 160), width=3)
draw.ellipse([width // 2 - 6, divider_y - 6, width // 2 + 6, divider_y + 6], fill=(34, 211, 238, 255))

# ==========================================
# 3. HERO SHOWCASE: 3D BOX & REFINED CARD FAN (y: 875 to 1900)
# ==========================================

def render_floating_card(card_path, target_w, target_h, angle):
    if not os.path.exists(card_path):
        return None
    card_raw = Image.open(card_path).convert('RGBA')
    resized = card_raw.resize((target_w, target_h), Image.Resampling.LANCZOS)
    del card_raw
    
    pad = 40
    card_canvas = Image.new('RGBA', (target_w + pad * 2, target_h + pad * 2), (0, 0, 0, 0))
    
    # Layer 1: Tight ambient depth shadow
    shadow1 = Image.new('RGBA', (target_w + pad * 2, target_h + pad * 2), (0, 0, 0, 0))
    s1_draw = ImageDraw.Draw(shadow1)
    s1_draw.rounded_rectangle(
        [pad - 2, pad + 4, pad + target_w + 2, pad + target_h + 8],
        radius=18,
        fill=(0, 0, 0, 145)
    )
    shadow1 = shadow1.filter(ImageFilter.GaussianBlur(8))
    card_canvas = Image.alpha_composite(card_canvas, shadow1)
    del shadow1

    # Layer 2: Soft atmospheric separation blur
    shadow2 = Image.new('RGBA', (target_w + pad * 2, target_h + pad * 2), (0, 0, 0, 0))
    s2_draw = ImageDraw.Draw(shadow2)
    s2_draw.rounded_rectangle(
        [pad - 6, pad + 6, pad + target_w + 6, pad + target_h + 12],
        radius=20,
        fill=(0, 0, 0, 95)
    )
    shadow2 = shadow2.filter(ImageFilter.GaussianBlur(16))
    card_canvas = Image.alpha_composite(card_canvas, shadow2)
    del shadow2
    
    # Outer thin cyber glow border
    card_border = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(card_border)
    b_draw.rounded_rectangle([0, 0, target_w - 1, target_h - 1], radius=16, outline=(34, 211, 238, 150), width=2)
    resized = Image.alpha_composite(resized, card_border)
    del card_border
    
    card_canvas.paste(resized, (pad, pad), resized)
    del resized
    
    rotated = card_canvas.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    del card_canvas
    return rotated

# 4 Official Cards from 16TH_AI_QUEST (symmetrical 45px buffer inside cyber frame)
official_ext_dir = os.path.join(pub_dir, 'official_cards', 'extracted')
cards_config = [
    # 1. Back Left: Data Preparation Card (+15 deg)
    (os.path.join(official_ext_dir, 'official_card_prep_class_balancing.png'), 285, 395, 15, 35, 1015),
    # 2. Back Right: Deployment Card (-15 deg)
    (os.path.join(official_ext_dir, 'official_card_deploy_aws.png'), 285, 395, -15, 1085, 1015),
    # 3. Front Left Hero: Data Collection Card (+8 deg)
    (os.path.join(official_ext_dir, 'official_card_data_camera.png'), 320, 440, 8, 105, 1055),
    # 4. Front Right Hero: System Objective Card (-8 deg)
    (os.path.join(official_ext_dir, 'official_card_objective_healthcare.png'), 320, 440, -8, 1015, 1055),
]

for full_cpath, cw, ch, ang, cx, cy in cards_config:
    rendered = render_floating_card(full_cpath, cw, ch, ang)
    if rendered:
        img.paste(rendered, (cx, cy), rendered)
        del rendered
        gc.collect()

# Hero Pedestal Underglow (Perspective Floor Ellipse — smooth fade to 0 at outer edge!)
ped_w, ped_h = 1300, 260
pedestal_layer = Image.new('RGBA', (ped_w, ped_h), (0, 0, 0, 0))
ped_draw = ImageDraw.Draw(pedestal_layer)
ped_cx, ped_cy = ped_w // 2, ped_h // 2
for step in range(30, 0, -1):
    t = 1.0 - ((step - 1) / 30.0)
    p_alpha = int(80 * (t ** 1.8))
    rx = int(600 * (step / 30.0))
    ry = int(95 * (step / 30.0))
    ped_draw.ellipse([ped_cx - rx, ped_cy - ry, ped_cx + rx, ped_cy + ry], fill=(6, 182, 212, p_alpha))

# Cyan grid lines on floor for futuristic stage
for gx in range(ped_cx - 450, ped_cx + 460, 90):
    ped_draw.line([(gx, ped_cy - 25), (ped_cx + int((gx - ped_cx) * 1.5), ped_cy + 65)], fill=(34, 211, 238, 42), width=2)
for gy in range(ped_cy - 15, ped_cy + 75, 25):
    hw = int(360 + (gy - ped_cy) * 4)
    ped_draw.line([(ped_cx - hw, gy), (ped_cx + hw, gy)], fill=(34, 211, 238, 32), width=2)

img.paste(pedestal_layer, ((width - ped_w) // 2, 1750 - ped_cy), pedestal_layer)
del pedestal_layer
del ped_draw
gc.collect()
draw = ImageDraw.Draw(img, 'RGBA')

# 3D Box Mockup (Centered at box_y = 875)
box_path = os.path.join(pub_dir, 'ai_quest_box_3d.png')
if os.path.exists(box_path):
    box_img = Image.open(box_path).convert('RGBA')
    box_w = 600
    box_h = int(box_img.height * (box_w / box_img.width))  # ~874
    box_resized = box_img.resize((box_w, box_h), Image.Resampling.LANCZOS)
    del box_img
    box_x = (width - box_w) // 2
    box_y = 875
    img.paste(box_resized, (box_x, box_y), box_resized)
    del box_resized
    gc.collect()

# Component Specification Ribbon (Positioned with clean breathing room below pedestal)
ribbon_y = 1830
ribbon_w = 1200
ribbon_h = 66
ribbon_x = (width - ribbon_w) // 2

draw.rounded_rectangle(
    [ribbon_x, ribbon_y, ribbon_x + ribbon_w, ribbon_y + ribbon_h],
    radius=33,
    fill=(11, 28, 60, 245),
    outline=(6, 182, 212, 255),
    width=2
)
rib_txt = "PREMIER COLLECTOR'S EDITION  ·  240 LINEN-FINISH CARDS  ·  COMPLETE ML PIPELINE"
r_bbox = font_ribbon.getbbox(rib_txt)
r_tw = r_bbox[2] - r_bbox[0]
r_th = r_bbox[3] - r_bbox[1]
draw.text(
    (ribbon_x + (ribbon_w - r_tw) // 2 - r_bbox[0], ribbon_y + (ribbon_h - r_th) // 2 - r_bbox[1]),
    rib_txt,
    font=font_ribbon,
    fill=(56, 189, 248, 255)
)

# ==========================================
# 4. 3-PILLAR LUXURY SHOWCASE (y: 1970 to 2676)
# ==========================================
sec_title = "ENGINEERED FOR GAMERS & MACHINE LEARNING PIONEERS"
st_bbox = font_sec_title.getbbox(sec_title)
draw.text(((width - (st_bbox[2] - st_bbox[0])) // 2 - st_bbox[0], 1970), sec_title, font=font_sec_title, fill=(255, 255, 255, 255))

sec_sub = "Demystifying artificial intelligence into tense, high-stakes tabletop strategy"
ss_bbox = font_sec_sub.getbbox(sec_sub)
draw.text(((width - (ss_bbox[2] - ss_bbox[0])) // 2 - ss_bbox[0], 2028), sec_sub, font=font_sec_sub, fill=(148, 163, 184, 255))

features = [
    {
        "num": "01",
        "title": "MASTER REAL-WORLD AI · NO CODING REQUIRED",
        "desc_lines": [
            "Experience the authentic machine learning lifecycle from data collection to live deployment.",
            "Build complete AI systems in an intuitive, fast-paced tabletop strategy card game."
        ],
        "col": (56, 189, 248)  # Electric Cyan
    },
    {
        "num": "02",
        "title": "HIGH-STAKES RIVALRY & \"CHALLENGE!\" AUDITS",
        "desc_lines": [
            "Outsmart your rivals in a shared pipeline. Catch opponents cutting corners or pushing",
            "flawed architectures, and trigger game-changing 'CHALLENGE!' validation audits."
        ],
        "col": (250, 204, 21)  # Vibrant Amber
    },
    {
        "num": "03",
        "title": "CRAFTED FOR BOARD GAMERS & TECH ENTHUSIASTS",
        "desc_lines": [
            "Engineered for 2–8 players or solo play online vs AI. Fast to learn in 5 minutes,",
            "yet deeply strategic for data & AI professionals, students, and tabletop veterans alike."
        ],
        "col": (74, 222, 128)  # Emerald Green
    }
]

feat_y = 2095
feat_w = 1420
feat_h = 175
feat_gap = 28
feat_x = (width - feat_w) // 2

for idx, feat in enumerate(features):
    cur_y = feat_y + idx * (feat_h + feat_gap)
    # Glassmorphic Box
    draw.rounded_rectangle(
        [feat_x, cur_y, feat_x + feat_w, cur_y + feat_h],
        radius=22,
        fill=(8, 24, 52, 230),
        outline=(feat["col"][0], feat["col"][1], feat["col"][2], 175),
        width=2
    )
    # Accent badge on left
    badge_size = 96
    bx = feat_x + 32
    by = cur_y + (feat_h - badge_size) // 2
    draw.rounded_rectangle(
        [bx, by, bx + badge_size, by + badge_size],
        radius=20,
        fill=(12, 34, 74, 255),
        outline=(feat["col"][0], feat["col"][1], feat["col"][2], 255),
        width=2
    )
    n_bbox = font_card_num.getbbox(feat["num"])
    n_tw = n_bbox[2] - n_bbox[0]
    n_th = n_bbox[3] - n_bbox[1]
    draw.text(
        (bx + (badge_size - n_tw) // 2 - n_bbox[0], by + (badge_size - n_th) // 2 - n_bbox[1]),
        feat["num"],
        font=font_card_num,
        fill=feat["col"]
    )
    
    # Title
    draw.text((feat_x + 160, cur_y + 28), feat["title"], font=font_card_title, fill=(255, 255, 255, 255))
    
    # Description lines
    for li, dline in enumerate(feat["desc_lines"]):
        draw.text((feat_x + 160, cur_y + 80 + li * 36), dline, font=font_card_desc, fill=(218, 226, 236, 255))

# ==========================================
# 5. SPECS BAR (y: 2740 to 2836)
# ==========================================
specs = [
    ("2–8 PLAYERS", "Competitive & Solo"),
    ("45–60 MINS", "Fast Strategic Turns"),
    ("AGES 14+", "Gamers & Engineers"),
    ("240 CARDS", "Linen Air-Cushion Set")
]

sp_w = 332
sp_h = 96
sp_gap = 30
sp_start_x = (width - (4 * sp_w + 3 * sp_gap)) // 2
sp_y = 2740

for j, (sp_title, sp_sub) in enumerate(specs):
    cur_sp_x = sp_start_x + j * (sp_w + sp_gap)
    draw.rounded_rectangle(
        [cur_sp_x, sp_y, cur_sp_x + sp_w, sp_y + sp_h],
        radius=20,
        fill=(10, 27, 58, 240),
        outline=(6, 182, 212, 185),
        width=2
    )
    v_bbox = font_spec_val.getbbox(sp_title)
    draw.text(
        (cur_sp_x + (sp_w - (v_bbox[2] - v_bbox[0])) // 2 - v_bbox[0], sp_y + 18),
        sp_title,
        font=font_spec_val,
        fill=(255, 255, 255, 255)
    )
    
    s_bbox = font_spec_sub.getbbox(sp_sub)
    draw.text(
        (cur_sp_x + (sp_w - (s_bbox[2] - s_bbox[0])) // 2 - s_bbox[0], sp_y + 54),
        sp_sub,
        font=font_spec_sub,
        fill=(148, 163, 184, 255)
    )

# ==========================================
# 6. CALL TO ACTION & QR CODE (y: 2900 to 3530)
# ==========================================
cta_y = 2900
cta_w = 1420
cta_h = 630
cta_x = (width - cta_w) // 2

# Glassmorphic Luxury CTA Enclosure
draw.rounded_rectangle(
    [cta_x, cta_y, cta_x + cta_w, cta_y + cta_h],
    radius=32,
    fill=(8, 24, 54, 245),
    outline=(6, 182, 212, 255),
    width=3
)
# Inner accent border
draw.rounded_rectangle(
    [cta_x + 8, cta_y + 8, cta_x + cta_w - 8, cta_y + cta_h - 8],
    radius=24,
    outline=(14, 165, 233, 65),
    width=1
)

# Branded QR Code (Extra large 430 x 430 px — Official Website https://www.aiquestgame.com/)
qr_path = os.path.join(pub_dir, 'website_qr_branded.png')
if not os.path.exists(qr_path):
    qr_path = os.path.join(pub_dir, 'feedback_qr_branded.png')
if os.path.exists(qr_path):
    qr_img = Image.open(qr_path).convert('RGBA')
    qr_size = 430
    qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    del qr_img
    
    # Glowing White card behind QR
    qr_pad = 22
    qx = cta_x + 55
    qy = cta_y + (cta_h - qr_size) // 2
    draw.rounded_rectangle(
        [qx - qr_pad, qy - qr_pad, qx + qr_size + qr_pad, qy + qr_size + qr_pad],
        radius=28,
        fill=(255, 255, 255, 255),
        outline=(34, 211, 238, 255),
        width=3
    )
    img.paste(qr_resized, (qx, qy), qr_resized)
    del qr_resized
    gc.collect()

# CTA Text Area (optically balanced with the 474px white QR enclosure)
tx_cta = cta_x + 545
draw.text((tx_cta, cta_y + 88), "KICKSTARTER CAMPAIGN & LIVE WEB DEMO", font=font_cta_gold, fill=(250, 204, 21, 255))
draw.text((tx_cta, cta_y + 140), "SCAN TO PLAY & JOIN THE MISSION", font=font_cta_head, fill=(255, 255, 255, 255))

draw.text((tx_cta, cta_y + 225), "Scan with your phone to test the live web edition, explore", font=font_cta_sub, fill=(226, 232, 240, 255))
draw.text((tx_cta, cta_y + 268), "official pipeline rules, and claim exclusive Day-1 Backer perks.", font=font_cta_sub, fill=(226, 232, 240, 255))

draw.text((tx_cta, cta_y + 360), "WWW.AIQUESTGAME.COM", font=font_cta_url, fill=(34, 211, 238, 255))
draw.text((tx_cta, cta_y + 472), "RimansTech Industries  ·  London, UK  ·  CloudM Rooftop Showcase", font=font_credit, fill=(148, 163, 184, 255))

# Output Files (100% opaque RGB so no alpha transparency ever leaks white from PDF page)
master_png = os.path.join(pub_dir, 'rollup_banner_luxury_master.png')
img.save(master_png, 'PNG')
print('SUCCESS! Wrote Luxury Master PNG to:', master_png)

# Web Preview PNGs (800x2000)
preview_png = os.path.join(pub_dir, 'rollup_banner_luxury_preview.png')
preview_png2 = os.path.join(pub_dir, 'ai_quest_rollup_banner_800x2000_preview.png')
img_prev = img.resize((800, 2000), Image.Resampling.BILINEAR)
img_prev.save(preview_png, 'PNG')
img_prev.save(preview_png2, 'PNG')
del img_prev
del img
gc.collect()
print('SUCCESS! Wrote Luxury Preview PNGs to:', preview_png)

# PDF (Exact 800mm x 2000mm MediaBox)
pdf_path = os.path.join(pub_dir, 'AI_Quest_Rollup_Banner_Luxury_800x2000.pdf')
import fitz
doc_pdf = fitz.open()
w_pt = 800 * 72 / 25.4
h_pt = 2000 * 72 / 25.4
p_pdf = doc_pdf.new_page(width=w_pt, height=h_pt)
p_pdf.insert_image(p_pdf.rect, filename=master_png)
doc_pdf.save(pdf_path)
doc_pdf.close()
print('SUCCESS! Wrote exact 800mm x 2000mm Luxury PDF to:', pdf_path)
