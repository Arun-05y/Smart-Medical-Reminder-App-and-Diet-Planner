from fastapi import APIRouter, HTTPException, Depends, Body
from ..database import get_db
from ..schemas import UserRegister, UserLogin, UserProfile, EmergencyContact
from ..auth_utils import get_password_hash, verify_password, create_access_token, get_current_user
from bson import ObjectId

router = APIRouter()

@router.post("/register")
async def register(user: UserRegister):
    db = get_db()
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["profile"] = UserProfile().dict()
    user_dict["emergencyContact"] = EmergencyContact().dict()
    
    result = await db.users.insert_one(user_dict)
    token = create_access_token({"id": str(result.inserted_id)})
    return {"token": token, "user": {"id": str(result.inserted_id), "name": user.name, "email": user.email}}

@router.post("/login")
async def login(credentials: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token({"id": str(user["_id"])})
    return {"token": token, "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}}

@router.get("/me")
async def get_me(user_info=Depends(get_current_user)):
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_info["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["id"] = str(user.pop("_id"))
    user.pop("password")
    return user

@router.put("/profile")
async def update_profile(
    data: dict = Body(...), 
    user_info=Depends(get_current_user)
):
    db = get_db()
    update_data = {}
    
    if "profile" in data:
        update_data["profile"] = data["profile"]
    if "emergencyContact" in data:
        update_data["emergencyContact"] = data["emergencyContact"]
        
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
        
    await db.users.update_one(
        {"_id": ObjectId(user_info["id"])},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": ObjectId(user_info["id"])})
    updated_user["id"] = str(updated_user.pop("_id"))
    updated_user.pop("password")
    return updated_user
