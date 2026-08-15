from PIL import Image

try:
    img = Image.open("public/ai_quest_logo_transparent.png")
    print("Mode:", img.mode)
    print("Size:", img.size)
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        print("Image has transparency channel")
    else:
        print("Image is fully opaque (no transparency)")
    
    # Check average color of corner pixels to see if it's white
    corners = [img.getpixel((0,0)), img.getpixel((img.width-1, 0)), img.getpixel((0, img.height-1)), img.getpixel((img.width-1, img.height-1))]
    print("Corner pixel values:", corners)
except Exception as e:
    print("Error:", e)
