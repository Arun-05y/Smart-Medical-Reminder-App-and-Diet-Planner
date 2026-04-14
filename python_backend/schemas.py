from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserProfile(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = None
    diseases: List[str] = []
    allergies: List[str] = []
    goal: str = "maintenance"

class EmergencyContact(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class MedicineCreate(BaseModel):
    name: str
    dosage: str
    time: List[str]
    frequency: str = "daily"
    days: List[str] = []
    description: Optional[str] = None
    endDate: Optional[datetime] = None

class HealthMetricUpdate(BaseModel):
    date: str
    waterIntake: Optional[int] = None
    caloriesConsumed: Optional[int] = None
    medicineAdherence: Optional[List[dict]] = None
