from fastapi import FastAPI, HTTPException
from PIL import Image
import requests
from io import BytesIO
import base64

app = FastAPI()

SIZES = {
    "small": (200, 200),
    "medium": (500, 500),
    "large": (1000, 1000),
}

# Download image
def download_image(url: str):
    r = requests.get(url)
    r.raise_for_status()
    return Image.open(BytesIO(r.content))

# Ensure RGB mode
def convert_mode(img: Image.Image):
    if img.mode in ("RGBA", "P"):
        return img.convert("RGB")
    return img

# Resize
def create_variants(img: Image.Image):
    results = {}

    for key, size in SIZES.items():
        temp = img.copy()
        temp.thumbnail(size)
        results[key] = temp

    return results

# Convert image to base64
def to_base64(img: Image.Image):
    buffer = BytesIO()
    img.save(buffer, format="WEBP", quality=80)
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode()

@app.post("/process-image")
def process(data: dict):
    try:
        image_url = data.get("imageUrl")

        if not image_url:
            raise HTTPException(status_code=400, detail="imageUrl required")

        # Download
        img = download_image(image_url)
        img = convert_mode(img)

        # Create variants
        variants = create_variants(img)

        # Encode
        return {
            "status": "done",
            "variants": {
                "small": to_base64(variants["small"]),
                "medium": to_base64(variants["medium"]),
                "large": to_base64(variants["large"]),
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))