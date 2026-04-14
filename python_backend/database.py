import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = "smart-medical-reminder"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

def get_db():
    return db
