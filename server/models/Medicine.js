const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  time: [{ type: String, required: true }], // Array of strings (e.g., "08:00", "20:00")
  frequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'custom'], 
    default: 'daily' 
  },
  days: [{ type: String }], // For weekly/custom: ["Monday", "Wednesday"]
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  description: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
