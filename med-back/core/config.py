from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # You can later restrict this to frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
