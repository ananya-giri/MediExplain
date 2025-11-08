from pymongo import MongoClient

MONGO_URI = "mongodb+srv://user:123@cluster0.bwbgvha.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["mediexplain_db"]  # database name
users_collection = db["users"]
