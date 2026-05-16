from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client["mediexplain_db"]  # database name
users_collection = db["users"]
chat_history_collection = db["chat_history"]
biometrics_history_collection = db["biometrics_history"]
prescriptions_collection = db["prescriptions"]
reports_history_collection = db["reports_history"]
