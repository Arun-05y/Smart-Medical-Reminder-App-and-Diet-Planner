const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

router.post('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { profile } = user;

    // Call the Python Microservice
    try {
      const response = await axios.post(`${PYTHON_SERVICE_URL}/generate-diet`, {
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        goal: profile.goal,
        diseases: profile.diseases,
        allergies: profile.allergies
      });

      res.json(response.data);
    } catch (pythonErr) {
      console.error('Python Service Error:', pythonErr.message);
      
      // Fallback if Python service is down (optional, but good for UX)
      res.status(503).json({ 
        message: 'Diet service is currently unavailable. Please try again later or check the Python microservice.',
        error: pythonErr.message
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
