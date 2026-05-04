import pytesseract
from PIL import Image
import io
import cv2
import numpy as np
from pdf2image import convert_from_bytes

def preprocess_image(image: Image.Image) -> np.ndarray:
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

def extract_text_from_file(file_bytes: bytes, content_type: str) -> str:
    extracted_text = ""
    
    if content_type == "application/pdf":
        try:
            # Note: requires poppler installed on the system
            images = convert_from_bytes(file_bytes)
            for img in images:
                processed_img = preprocess_image(img)
                extracted_text += pytesseract.image_to_string(processed_img) + "\n"
        except Exception as e:
            extracted_text = f"PDF Processing Error: {str(e)}"
    else:
        # Process as image
        image = Image.open(io.BytesIO(file_bytes))
        processed_img = preprocess_image(image)
        extracted_text = pytesseract.image_to_string(processed_img)
        
    return extracted_text
