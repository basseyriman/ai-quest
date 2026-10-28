import os
import qrcode
from PIL import Image, ImageDraw

base_dir = r"c:\Users\basse\Documents\RimanTech\AI QUEST GAME\ai-quest"
pub_dir = os.path.join(base_dir, "public")

target_url = "https://www.aiquestgame.com/"

qr = qrcode.QRCode(
    version=4,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=28,
    border=2,
)
qr.add_data(target_url)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="#030712", back_color="white").convert("RGBA")
w, h = qr_img.size

# Center logo badge (24% of QR size so ERROR_CORRECT_H scans 100% instantly)
logo_path = os.path.join(pub_dir, "logo.png")
if os.path.exists(logo_path):
    badge_size = int(w * 0.24)
    bx = (w - badge_size) // 2
    by = (h - badge_size) // 2

    draw = ImageDraw.Draw(qr_img)
    draw.rounded_rectangle(
        [bx - 8, by - 8, bx + badge_size + 8, by + badge_size + 8],
        radius=24,
        fill=(255, 255, 255, 255),
        outline=(6, 182, 212, 255),
        width=4,
    )

    logo = Image.open(logo_path).convert("RGBA")
    lw = badge_size - 16
    lh = int(logo.height * (lw / logo.width))
    logo_resized = logo.resize((lw, lh), Image.Resampling.LANCZOS)
    lx = (w - lw) // 2
    ly = (h - lh) // 2
    qr_img.paste(logo_resized, (lx, ly), logo_resized)

out_path = os.path.join(pub_dir, "website_qr_branded.png")
qr_img.save(out_path, "PNG")
print("Generated website_qr_branded.png for:", target_url, "at:", out_path)
