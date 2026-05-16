import re

def extract_medical_entities(text: str):
    """
    Mocked Medical Entity Extractor. 
    Replaces SciSpaCy to save 1GB of RAM for free-tier hosting.
    Uses regex to find capitalized medical-looking terms.
    """
    entities = []
    seen = set()
    
    # Find words with 5+ letters that are capitalized, likely entities in medical text
    matches = re.findall(r'\b[A-Z][a-z]{4,}\b', text)
    
    for match in matches:
        clean_text = match.lower().strip()
        if clean_text not in seen and clean_text not in ['patient', 'doctor', 'report']:
            entities.append({
                "entity": clean_text,
                "mock_code": f"UMLS-{abs(hash(clean_text)) % 10000:04d}"
            })
            seen.add(clean_text)
            
    return entities[:5]
