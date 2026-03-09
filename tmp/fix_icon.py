from PIL import Image, ImageChops

def make_icon(input_path, output_path):
    # Brand yellow color
    YELLOW = (255, 217, 0)
    
    # Open logo
    logo = Image.open(input_path).convert("RGBA")
    
    # Trim white/transparent edges
    bg = Image.new(logo.mode, logo.size, (255, 255, 255, 255))
    diff = ImageChops.difference(logo, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    
    # Create square background
    w, h = logo.size
    side = int(max(w, h) * 1.6) # Add padding
    icon = Image.new("RGB", (side, side), YELLOW)
    
    # Paste logo in center
    # Handle transparency if any
    pos = ((side - w) // 2, (side - h) // 2)
    
    # Create a mask for pasting
    # If it's black on white, we want to paste the black parts
    # We'll treat anything dark as part of the logo
    logo_data = logo.getdata()
    new_logo_data = []
    for item in logo_data:
        # If it's white or transparent-ish, make it yellow/transparent
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            new_logo_data.append((YELLOW[0], YELLOW[1], YELLOW[2], 0))
        else:
            new_logo_data.append(item)
    logo.putdata(new_logo_data)
    
    icon.paste(logo, pos, logo)
    
    # Resize to standard PWA sizes
    icon.resize((512, 512), Image.Resampling.LANCZOS).save(output_path)
    print(f"Icon saved to {output_path}")

if __name__ == "__main__":
    make_icon("public/assets/images/logo_movvi.png", "public/assets/images/logo_movvi_icon.png")
