const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');

// Get all medicines for user
router.get('/', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.id });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add medicine
router.post('/', auth, async (req, res) => {
  try {
    const { name, dosage, time, frequency, days, description, endDate } = req.body;
    const medicine = new Medicine({
      userId: req.user.id,
      name,
      dosage,
      time,
      frequency,
      days,
      description,
      endDate
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update medicine
router.put('/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete medicine
router.delete('/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
