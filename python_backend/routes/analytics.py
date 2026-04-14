from fastapi import APIRouter, Depends
from ..database import get_db
from ..auth_utils import get_current_user
import pandas as pd
from typing import List

router = APIRouter()

@router.get("/insights")
async def get_health_insights(user_info=Depends(get_current_user)):
    db = get_db()
    cursor = db.health_data.find({"userId": user_info["id"]}).sort("date", -1).limit(30)
    data = await cursor.to_list(length=30)
    
    if not data:
        return {"message": "Not enough data for analysis", "stats": {}}

    # Convert to Pandas DataFrame
    df = pd.DataFrame(data)
    
    # Advanced Calculations
    analysis = {
        "avg_water": float(df["waterIntake"].mean()),
        "max_calories": int(df["caloriesConsumed"].max()),
        "total_days_tracked": len(df),
        "consistency_score": (len(df[df["waterIntake"] > 2000]) / len(df)) * 100 if len(df) > 0 else 0,
        "trends": {
            "water_increasing": df["waterIntake"].iloc[0] > df["waterIntake"].mean(),
            "calorie_stability": float(df["caloriesConsumed"].std()) < 200
        }
    }
    
    return analysis

@router.get("/summary-report")
async def generate_summary(user_info=Depends(get_current_user)):
    # This could use Jinja2 to generate a text/HTML summary
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_info["id"])})
    
    summary = f"""
    --- SmartMed Health Summary for {user['name']} ---
    Status: Analysis Complete
    Recommendation: Continue tracking for better AI accuracy.
    """
    return {"summary": summary}
