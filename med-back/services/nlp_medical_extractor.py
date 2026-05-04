import spacy
import warnings

warnings.filterwarnings('ignore')

# Load the SciSpaCy model for medical entity extraction
try:
    nlp_sci = spacy.load("en_core_sci_sm")
except Exception as e:
    print("SciSpacy model not found. Falling back to default.")
    nlp_sci = None

def extract_medical_entities(text: str):
    """
    Extracts structured medical entities (Diseases, Chemicals, Symptoms) 
    using SciSpaCy NLP pipeline.
    """
    if not nlp_sci:
        return []
        
    try:
        # Keep text length manageable
        doc = nlp_sci(text[:2000])
        entities = []
        seen = set()
        
        for ent in doc.ents:
            clean_text = ent.text.lower().strip()
            # Filter out generic short words
            if len(clean_text) > 3 and clean_text not in seen:
                entities.append({
                    "entity": clean_text,
                    # Mock mapping to an ICD/UMLS code format for demonstration
                    "mock_code": f"UMLS-{abs(hash(clean_text)) % 10000:04d}"
                })
                seen.add(clean_text)
                
        # Return top 5 entities to keep the UI clean
        return entities[:5]
    except Exception as e:
        print(f"Entity Extraction Error: {e}")
        return []
