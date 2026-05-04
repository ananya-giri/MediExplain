from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://user:123@cluster0.bwbgvha.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URI)
db = client["mediexplain_db"]  # database name
users_collection = db["users"]
chat_history_collection = db["chat_history"]
biometrics_history_collection = db["biometrics_history"]
prescriptions_collection = db["prescriptions"]
