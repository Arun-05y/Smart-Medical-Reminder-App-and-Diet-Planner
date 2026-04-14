# Smart Medical Reminder & Diet Planner

An AI-powered full-stack application for managing medications and receiving personalized nutrition plans.

## 🚀 Features

- **User Authentication**: Secure JWT-based registration and login.
- **Medicine Reminders**: Full CRUD for medications with time-based scheduling.
- **AI Diet Planner**: Personalized meal plans generated via OpenAI GPT models.
- **Health Dashboard**: Real-time tracking of water intake, calories, and medicine adherence.
- **Emergency SOS**: One-click button to send geolocation-linked emergency alerts.
- **Premium Design**: Dark mode, glassmorphism UI, smooth animations with Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Backend**: Node.js, Express.
- **Microservices**: Python, FastAPI (for AI Diet Planning).
- **Database**: MongoDB (Mongoose).
- **AI**: OpenAI API.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- OpenAI API Key (optional, mock mode available)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SM
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory (template provided in `.env`).
   - Add your `MONGODB_URI` and `OPENAI_API_KEY`.
   - Start the server:
     ```bash
     npm start
     ```

3. **Python AI Service Setup**
   ```bash
   cd ../python_service
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate # Linux/Mac
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧪 Usage Note
If no `OPENAI_API_KEY` is provided, the Diet Planner will operate in **Mock Mode**, providing realistic sample diet plans for demonstration purposes.

---
Built with ❤️ by Antigravity AI
