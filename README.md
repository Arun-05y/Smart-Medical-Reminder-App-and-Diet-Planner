# Smart Medical Reminder & Diet Planner (Python Major)

An AI-powered full-stack health platform with a specialized **FastAPI** backend for medical management and personalized nutrition.

## 🚀 Features

- **User Authentication**: Secure JWT-based registration and login in Python.
- **Medicine Reminders**: Managed via asynchronous FastAPI routes.
- **AI Diet Planner**: GPT-powered meal strategy based on medical profiles.
- **Health Dashboard**: Tracking water, calories, and adherence with real-time charts.
- **Emergency SOS**: Geolocation-linked alerts.
- **Modern UI**: Dark-mode glassmorphism with Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Recharts, Framer Motion.
- **Backend (Primary)**: Python, FastAPI, Motor (Async MongoDB).
- **AI**: OpenAI GPT-3.5 API.
- **Database**: MongoDB.

## 📦 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js (v18+)
- MongoDB

### Steps

1. **Clone & Setup Backend**
   ```bash
   cd python_backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8080
   ```
   - Ensure `OPENAI_API_KEY` is set in `python_backend/.env`.

2. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

3. **Legacy Node.js Backend** (Optional)
   The original Node.js implementation is kept in the `server/` directory for reference.

---
Built with ❤️ by Antigravity AI
