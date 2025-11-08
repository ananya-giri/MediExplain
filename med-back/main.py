from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import setup_cors
from routes import ocr_routes, ai_routes, chat_routes  # ✅ added chat_routes
from routes.auth_routes import router as auth_router 

app = FastAPI(title="MediExplain API", version="1.0")

# Setup CORS
setup_cors(app)

# ✅ Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict later to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routes
app.include_router(auth_router, prefix="/api", tags=["Auth"])
app.include_router(ocr_routes.router, prefix="/api", tags=["OCR"])
app.include_router(ai_routes.router, prefix="/api", tags=["AI"])
app.include_router(chat_routes.router, prefix="/api", tags=["Chat"])  # ✅ added

@app.get("/")
def home():
    return {"message": "MediExplain API running 🚀"}
