import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Pill, Plus, Trash2, Clock, Calendar, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Medicines = () => {
  const { API_URL } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '08:00',
    frequency: 'daily',
    description: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/medicines`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(res.data);
    } catch (err) {
      toast.error('Failed to fetch medicines');
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/medicines`, {
        ...formData,
        time: [formData.time] // Wrap in array as expected by backend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Medicine added successfully');
      setShowModal(false);
      fetchMedicines();
    } catch (err) {
      toast.error('Failed to add medicine');
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(medicines.filter(m => m._id !== id));
      toast.success('Medicine removed');
    } catch (err) {
      toast.error('Failed to delete medicine');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">My Medicines</h1>
          <p className="text-slate-400">Manage your daily prescriptions and reminders.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {medicines.map((med) => (
            <motion.div 
              key={med._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 border-white/5 relative group"
            >
              <button 
                onClick={() => deleteMedicine(med._id)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                  <Pill size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{med.name}</h3>
                  <p className="text-primary-400 text-sm font-medium">{med.dosage}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock size={16} />
                  <span>{med.time.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar size={16} />
                  <span className="capitalize">{med.frequency}</span>
                </div>
              </div>
              
              {med.description && (
                <p className="mt-4 text-xs text-slate-500 italic border-t border-white/5 pt-4">
                  {med.description}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Medicine Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 w-full max-w-lg relative z-50"
          >
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Add Medicine</h2>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Medicine Name</label>
                  <input 
                    type="text" 
                    required 
                    className="input-field w-full"
                    placeholder="e.g., Vitamin C"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Dosage</label>
                  <input 
                    type="text" 
                    required 
                    className="input-field w-full"
                    placeholder="e.g., 500mg"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Time</label>
                  <input 
                    type="time" 
                    required 
                    className="input-field w-full"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Frequency</label>
                  <select 
                    className="input-field w-full bg-slate-800"
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Instructions (Optional)</label>
                <textarea 
                  className="input-field w-full h-24"
                  placeholder="Take after meals..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4 mt-4">
                Save Medicine
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Medicines;
