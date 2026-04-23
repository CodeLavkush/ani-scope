from fastapi import FastAPI, HTTPException
from PIL import Image
import requests
from io import BytesIO
import os
import uuid
import pillow_avif

app = FastAPI()

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Sizes
SIZES = {
    "small": (200, 200),
    "medium": (500, 500),
    "large": (1000, 1000),
}


# Download image
def download_image(url):
    r = requests.get(url)
    r.raise_for_status()
    return Image.open(BytesIO(r.content))


# Fix image mode (important)
def convert_mode(img: Image.Image):
    if img.mode in ("P", "RGBA"):
        return img.convert("RGBA")  # keep transparency
    return img.convert("RGB")


# Save as WebP (or AVIF)
def save_variant(img: Image.Image, name: str, fmt="WEBP"):
    img = convert_mode(img)

    ext = fmt.lower()
    filename = f"{uuid.uuid4()}_{name}.{ext}"
    path = os.path.join(OUTPUT_DIR, filename)

    if fmt == "WEBP":
        img.save(path, "WEBP", quality=80, method=6)

    elif fmt == "AVIF":
        # ⚠️ requires pillow-avif-plugin
        img.save(path, "AVIF", quality=50)

    else:
        raise ValueError("Unsupported format")

    return os.path.abspath(path)


# Create variants
def create_variants(img: Image.Image, fmt="WEBP"):
    results = {}

    for key, size in SIZES.items():
        temp = img.copy()
        temp.thumbnail(size)  # keeps aspect ratio
        results[key] = save_variant(temp, key, fmt)

    return results


# API
@app.post("/process-image")
def process(data: dict):
    try:
        image_url = data.get("imageUrl")

        if not image_url:
            raise HTTPException(400, "imageUrl required")

        # Download
        img = download_image(image_url)

        # Convert → variants
        variants = create_variants(img, fmt="WEBP")

        return {
            "status": "done",
            "variants": variants
        }

    except Exception as e:
        raise HTTPException(500, str(e))