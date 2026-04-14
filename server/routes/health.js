const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData');
const auth = require('../middleware/auth');

// Get health data for a specific date
router.get('/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    
    let healthData = await HealthData.findOne({ userId: req.user.id, date });
    if (!healthData) {
      healthData = new HealthData({ userId: req.user.id, date });
      await healthData.save();
    }
    res.json(healthData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update health metrics
router.put('/metrics', auth, async (req, res) => {
  try {
    const { date, waterIntake, caloriesConsumed, medicineAdherence } = req.body;
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    let healthData = await HealthData.findOne({ userId: req.user.id, date: searchDate });
    
    if (!healthData) {
      healthData = new HealthData({ userId: req.user.id, date: searchDate });
    }

    if (waterIntake !== undefined) healthData.waterIntake = waterIntake;
    if (caloriesConsumed !== undefined) healthData.caloriesConsumed = caloriesConsumed;
    if (medicineAdherence !== undefined) healthData.medicineAdherence = medicineAdherence;

    await healthData.save();
    res.json(healthData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get historical data for charts (last 7 days)
router.get('/history/weekly', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const history = await HealthData.find({
      userId: req.user.id,
      date: { $gte: lastWeek, $lte: today }
    }).sort({ date: 1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
