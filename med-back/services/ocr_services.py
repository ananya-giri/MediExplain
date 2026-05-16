import pytesseract
from PIL import Image
import io
import cv2
import numpy as np
import os
from pdf2image import convert_from_bytes

# Optional: Point to Tesseract executable if not in PATH
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image: Image.Image) -> np.ndarray:
    try:
        # Convert PIL Image to OpenCV format
        img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # 1. Grayscale conversion
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        
        # 2. Resize to 2x for better OCR accuracy on small text
        gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        
        # 3. Simple thresholding (Otsu) - better than adaptive for clean reports
        # If the image is a photo, adaptive is better, but Otsu is safer to avoid noise.
        # We will just apply a slight blur and adaptive threshold.
        blur = cv2.GaussianBlur(gray, (5,5), 0)
        thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        
        # Skipping the flawed deskewing logic as it distorts images with white backgrounds
        return thresh
    except Exception as e:
        print(f"Preprocessing Warning: {e}")
        return np.array(image.convert('L'))

def extract_text_from_file(file_bytes: bytes, content_type: str) -> str:
    extracted_text = ""
    
    try:
        if content_type == "application/pdf":
            try:
                # Note: requires poppler installed on the system
                images = convert_from_bytes(file_bytes)
                for img in images:
                    processed_img = preprocess_image(img)
                    extracted_text += pytesseract.image_to_string(processed_img, config='--oem 3 --psm 6') + "\n"
            except Exception as e:
                if "poppler" in str(e).lower():
                    return "ERROR: Poppler is not installed. PDF processing requires Poppler on the system PATH."
                return f"ERROR: PDF Processing Error: {str(e)}"
        else:
            # Process as image
            image = Image.open(io.BytesIO(file_bytes))
            processed_img = preprocess_image(image)
            extracted_text = pytesseract.image_to_string(processed_img, config='--oem 3 --psm 6')
            
    except Exception as e:
        if "tesseract" in str(e).lower():
            return "ERROR: Tesseract OCR not found. Please install Tesseract-OCR and add it to your system PATH."
        return f"ERROR: {str(e)}"
        
    if not extracted_text.strip():
        return "ERROR: No text could be extracted. The image might be too blurry or contain no readable text."
        
    return extracted_text
