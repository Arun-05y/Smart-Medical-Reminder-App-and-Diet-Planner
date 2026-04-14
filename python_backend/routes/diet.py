from fastapi import APIRouter, HTTPException, Depends
from ..database import get_db
from ..auth_utils import get_current_user
from openai import OpenAI
import os
import json
from bson import ObjectId
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from fastapi.responses import FileResponse
import tempfile
from datetime import datetime

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
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download-pdf/{user_id}")
async def download_diet_pdf(user_id: str):
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, f"diet_plan_{user_id}.pdf")
    
    c = canvas.Canvas(file_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(100, 750, f"SmartMed Diet Plan for {user['name']}")
    
    c.setFont("Helvetica", 12)
    c.drawString(100, 720, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    y = 680
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, y, "Breakfast:")
    c.setFont("Helvetica", 12)
    c.drawString(120, y-20, "• Oatmeal with Almonds (320 kcal)")
    
    y -= 50
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, y, "Lunch:")
    c.setFont("Helvetica", 12)
    c.drawString(120, y-20, "• Quinoa Bowl with Tofu (480 kcal)")
    
    y -= 50
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, y, "Dinner:")
    c.setFont("Helvetica", 12)
    c.drawString(120, y-20, "• Lentil Soup with Asparagus (400 kcal)")
    
    y -= 60
    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, y, "AI Nutrition Tips:")
    c.setFont("Helvetica", 10)
    c.drawString(120, y-20, "- Drink 3L of water daily.")
    c.drawString(120, y-35, "- Avoid refined sugars.")
    
    c.save()
    return FileResponse(file_path, media_type='application/pdf', filename=f"SmartMed_Diet_{user['name']}.pdf")
