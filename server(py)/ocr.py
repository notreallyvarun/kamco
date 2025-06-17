from PIL import Image
import pytesseract
import io

def extract_text_from_image(image_bytes: bytes) -> str:
    try:
        print("Opening image with PIL...")
        image = Image.open(io.BytesIO(image_bytes))  # Fixed: now properly uses image_bytes
        print(f"Image mode: {image.mode}, Size: {image.size}")
        
        print("Running pytesseract OCR...")
        text = pytesseract.image_to_string(image)
        extracted_text = text.strip()
        
        print(f"OCR completed. Text length: {len(extracted_text)} characters")
        return extracted_text
        
    except Exception as e:
        print(f"OCR failed with error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return ""