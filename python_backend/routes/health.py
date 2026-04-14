from fastapi import APIRouter, HTTPException, Depends
from ..database import get_db
from ..schemas import HealthMetricUpdate
from ..auth_utils import get_current_user
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter()

@router.get("/{date}")
async def get_health_data(date: str, user_info=Depends(get_current_user)):
    db = get_db()
    data = await db.health_data.find_one({"userId": user_info["id"], "date": date})
    if not data:
        data = {
            "userId": user_info["id"],
            "date": date,
            "waterIntake": 0,
            "caloriesConsumed": 0,
            "medicineAdherence": []
        }
        await db.health_data.insert_one(data.copy())
    
    if "_id" in data:
        data["_id"] = str(data["_id"])
    return data

@router.put("/metrics")
async def update_metrics(update: HealthMetricUpdate, user_info=Depends(get_current_user)):
    db = get_db()
    
    update_data = {k: v for k, v in update.dict().items() if v is not None and k != "date"}
    
    result = await db.health_data.update_one(
        {"userId": user_info["id"], "date": update.date},
        {"$set": update_data},
        upsert=True
    )
    
    updated_data = await db.health_data.find_one({"userId": user_info["id"], "date": update.date})
    updated_data["_id"] = str(updated_data["_id"])
    return updated_data

@router.get("/history/weekly")
async def get_weekly_history(user_info=Depends(get_current_user)):
    db = get_db()
    # Simple strategy: get last 7 entries (could be improved by date range)
    cursor = db.health_data.find({"userId": user_info["id"]}).sort("date", -1).limit(7)
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return history[::-1] # Return in chronological order
