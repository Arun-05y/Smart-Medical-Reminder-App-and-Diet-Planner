from fastapi import APIRouter, HTTPException, Depends
from ..database import get_db
from ..auth_utils import get_current_user
from openai import OpenAI
import os
from bson import ObjectId

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@router.post("/generate")
async def generate_diet(user_info=Depends(get_current_user)):
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_info["id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    profile = user.get("profile", {})
    
    prompt = f"""
    Generate a personalized diet plan for a user with:
    Age: {profile.get('age', 'N/A')}
    Weight: {profile.get('weight', 'N/A')} kg
    Height: {profile.get('height', 'N/A')} cm
    Goal: {profile.get('goal', 'maintenance')}
    Medical condition: {', '.join(profile.get('diseases', [])) if profile.get('diseases') else 'None'}
    Allergies: {', '.join(profile.get('allergies', [])) if profile.get('allergies') else 'None'}

    Provide:
    1. Breakfast, Lunch, Dinner
    2. Calories for each meal
    3. Nutrition tips
    4. Foods to avoid

    Format the response as clear JSON with keys: breakfast, lunch, dinner, tips, avoid.
    """

    if not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "your_openai_key":
        return {
            "breakfast": {"meals": ["Greek Yogurt Performance", "Mixed Berries"], "calories": 300},
            "lunch": {"meals": ["Chicken Breast with Quinoa", "Avocado"], "calories": 550},
            "dinner": {"meals": ["Grilled Cod", "Lentil Pasta"], "calories": 450},
            "tips": ["Hydrate before meals", "Increase protein intake"],
            "avoid": ["Salty snacks", "Sweetened tea"],
            "isMock": True
        }

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
