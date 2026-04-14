require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const healthRoutes = require('./routes/health');
const dietRoutes = require('./routes/diet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/diet', dietRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-medical-reminder')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Smart Medical Reminder API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
