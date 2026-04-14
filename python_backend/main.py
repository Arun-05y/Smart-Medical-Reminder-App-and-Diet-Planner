from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, medicines, health, diet
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SmartMed Python Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(medicines.router, prefix="/api/medicines", tags=["medicines"])
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(diet.router, prefix="/api/diet", tags=["diet"])

@app.get("/")
def home():
    return {"message": "SmartMed Python Main Backend is running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("python_backend.main:app", host="0.0.0.0", port=port, reload=True)
