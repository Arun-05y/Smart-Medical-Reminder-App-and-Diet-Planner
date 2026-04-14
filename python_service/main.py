from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SmartMed AI Diet Service")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class DietRequest(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    goal: str = "maintenance"
    diseases: List[str] = []
    allergies: List[str] = []

class MealPlan(BaseModel):
    meals: List[str]
    calories: int

class DietResponse(BaseModel):
    breakfast: MealPlan
    lunch: MealPlan
    dinner: MealPlan
    tips: List[str]
    avoid: List[str]
    isMock: bool = False

@app.post("/generate-diet", response_model=DietResponse)
async def generate_diet(request: DietRequest):
    prompt = f"""
    Generate a personalized diet plan for a user with:
    Age: {request.age or 'N/A'}
    Weight: {request.weight or 'N/A'} kg
    Height: {request.height or 'N/A'} cm
    Goal: {request.goal}
    Medical condition: {', '.join(request.diseases) if request.diseases else 'None'}
    Allergies: {', '.join(request.allergies) if request.allergies else 'None'}

    Provide:
    1. Breakfast, Lunch, Dinner
    2. Calories for each meal
    3. Nutrition tips
    4. Foods to avoid

    Format the response as clear JSON.
    """

    if not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "your_openai_key":
        # Mock response
        return {
            "breakfast": {"meals": ["Oatmeal with almonds", "1 Apple"], "calories": 320},
            "lunch": {"meals": ["Quinoa Bowl with Tofu", "Spinach Salad"], "calories": 480},
            "dinner": {"meals": ["Lentil Soup", "Steamed Asparagus"], "calories": 400},
            "tips": ["Stay hydrated", "Slow down while eating"],
            "avoid": ["Processed snacks", "Sugary sodas"],
            "isMock": True
        }

    try {
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {"status": "Python Diet Service is healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
