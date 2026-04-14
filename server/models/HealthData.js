const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  waterIntake: { type: Number, default: 0 }, // in ml
  caloriesConsumed: { type: Number, default: 0 }, // in kcal
  medicineAdherence: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    medicineName: { type: String },
    taken: { type: Boolean, default: false },
    timeTaken: { type: String }
  }]
}, { timestamps: true });

// Create a unique index for userId and date (ignoring time) to store data per-day
healthDataSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthData', healthDataSchema);
