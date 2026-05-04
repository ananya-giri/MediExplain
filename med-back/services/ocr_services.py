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
        
        # 2. Adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # 3. Deskewing (simple implementation)
        coords = np.column_stack(np.where(thresh > 0))
        if len(coords) > 0:
            angle = cv2.minAreaRect(coords)[-1]
            if angle < -45:
                angle = -(90 + angle)
            else:
                angle = -angle
            
            (h, w) = thresh.shape[:2]
            center = (w // 2, h // 2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            deskewed = cv2.warpAffine(thresh, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
            return deskewed
        return thresh
    except Exception as e:
        print(f"Preprocessing Warning: {e}")
        return np.array(image.convert('L')) # Fallback to simple grayscale

def extract_text_from_file(file_bytes: bytes, content_type: str) -> str:
    extracted_text = ""
    
    try:
        if content_type == "application/pdf":
            try:
                # Note: requires poppler installed on the system
                images = convert_from_bytes(file_bytes)
                for img in images:
                    processed_img = preprocess_image(img)
                    extracted_text += pytesseract.image_to_string(processed_img) + "\n"
            except Exception as e:
                if "poppler" in str(e).lower():
                    return "ERROR: Poppler is not installed. PDF processing requires Poppler on the system PATH."
                return f"ERROR: PDF Processing Error: {str(e)}"
        else:
            # Process as image
            image = Image.open(io.BytesIO(file_bytes))
            processed_img = preprocess_image(image)
            extracted_text = pytesseract.image_to_string(processed_img)
            
    except Exception as e:
        if "tesseract" in str(e).lower():
            return "ERROR: Tesseract OCR not found. Please install Tesseract-OCR and add it to your system PATH."
        return f"ERROR: {str(e)}"
        
    if not extracted_text.strip():
        return "ERROR: No text could be extracted. The image might be too blurry or contain no readable text."
        
    return extracted_text
