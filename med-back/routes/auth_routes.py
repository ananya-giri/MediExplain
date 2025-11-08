from fastapi import APIRouter, HTTPException
from models.user_model import UserSignup, UserLogin
from utils.jwt_handler import create_access_token
from database import users_collection
import bcrypt

router = APIRouter()

@router.post("/signup")
def signup(user: UserSignup):
    # Check if user exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_pw.decode()
    })

    return {"message": "✅ Signup successful, please login"}

@router.post("/login")
def login(user: UserLogin):
    user_in_db = users_collection.find_one({"email": user.email})
    if not user_in_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(user.password.encode(), user_in_db["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": user.email})
    return {"message": "✅ Login success", "token": token, "name": user_in_db["name"]}
