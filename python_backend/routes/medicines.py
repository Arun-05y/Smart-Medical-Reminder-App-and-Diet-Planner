from fastapi import APIRouter, HTTPException, Depends
from ..database import get_db
from ..schemas import MedicineCreate
from ..auth_utils import get_current_user
from bson import ObjectId
from typing import List

router = APIRouter()

@router.get("/")
async def get_medicines(user_info=Depends(get_current_user)):
    db = get_db()
    cursor = db.medicines.find({"userId": user_info["id"]})
    medicines = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        medicines.append(doc)
    return medicines

@router.post("/")
async def add_medicine(med: MedicineCreate, user_info=Depends(get_current_user)):
    db = get_db()
    med_dict = med.dict()
    med_dict["userId"] = user_info["id"]
    result = await db.medicines.insert_one(med_dict)
    med_dict["_id"] = str(result.inserted_id)
    return med_dict

@router.delete("/{med_id}")
async def delete_medicine(med_id: str, user_info=Depends(get_current_user)):
    db = get_db()
    result = await db.medicines.delete_one({"_id": ObjectId(med_id), "userId": user_info["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return {"message": "Medicine deleted"}
