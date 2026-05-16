def get_true_shap_keywords(text: str):
    """
    Mocked SHAP analyzer. Since we are running on a free tier with 512MB RAM,
    we have removed the heavy PyTorch and SHAP libraries.
    This just returns some dummy keywords or relies on the LLM's own explanation.
    """
    words = text.split()
    # Just return a couple of words to mock SHAP feature attribution
    return [w for w in words if len(w) > 5][:2]
