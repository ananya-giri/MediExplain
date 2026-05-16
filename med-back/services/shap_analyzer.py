import shap
import warnings
from transformers import pipeline

# Suppress warnings
warnings.filterwarnings('ignore')

print("Loading local Transformer model for SHAP analysis...")
# We use a lightweight local model. 
# Negative sentiment acts as a proxy for "clinical abnormality" or "risk".
classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english", return_all_scores=True)

# Initialize SHAP explainer on the pipeline
explainer = shap.Explainer(classifier)

def get_true_shap_keywords(text: str, top_k: int = 3):
    """
    Runs ACTUAL mathematically sound SHAP (SHapley Additive exPlanations)
    using a local Transformer model to calculate marginal feature contributions.
    """
    try:
        # Keep text reasonably short for SHAP computation (first 300 chars usually contains main issues)
        short_text = text[:400] 
        
        # Calculate true SHAP values
        shap_values = explainer([short_text])
        
        # shap_values.values shape: (num_texts, num_tokens, num_classes)
        # We look at index 0 (NEGATIVE class) representing clinical risk/abnormality
        token_values = shap_values.values[0, :, 0]
        tokens = shap_values.data[0]
        
        word_scores = []
        for token, score in zip(tokens, token_values):
            clean_token = token.strip()
            # Filter out subword artifacts and very short words
            if clean_token and not clean_token.startswith("[") and not clean_token.startswith("##"):
                word_scores.append((clean_token, float(score)))
                
        # Sort tokens by how much they pushed the model towards "Negative/Abnormal"
        word_scores.sort(key=lambda x: x[1], reverse=True)
        
        keywords = []
        seen = set()
        for word, score in word_scores:
            word_lower = word.lower()
            # Avoid stop words or tiny tokens
            if word_lower not in seen and len(word_lower) > 3:
                keywords.append(word)
                seen.add(word_lower)
            if len(keywords) >= top_k:
                break
                
        return keywords
    except Exception as e:
        print(f"SHAP Extraction Error: {e}")
        return []
