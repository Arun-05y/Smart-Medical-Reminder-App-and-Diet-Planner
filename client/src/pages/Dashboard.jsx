import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Droplets, Flame, Pill, AlertCircle, TrendingUp, 
  ChevronRight, Plus, CheckCircle2 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, API_URL } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [healthData, setHealthData] = useState({ waterIntake: 0, caloriesConsumed: 0, medicineAdherence: [] });
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const today = new Date().toISOString().split('T')[0];

      const [medRes, healthRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/medicines`, { headers }),
        axios.get(`${API_URL}/health/${today}`, { headers }),
        axios.get(`${API_URL}/health/history/weekly`, { headers })
      ]);

      setMedicines(medRes.data);
      setHealthData(healthRes.data);
      setWeeklyHistory(historyRes.data.map(d => ({
        name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        water: d.waterIntake,
        calories: d.caloriesConsumed
      })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateWater = async (amount) => {
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.put(`${API_URL}/health/metrics`, {
        date: today,
        waterIntake: healthData.waterIntake + amount
      }, { headers: { Authorization: `Bearer ${token}` } });
      setHealthData(prev => ({ ...prev, waterIntake: res.data.waterIntake }));
      toast.success('Water intake updated');
    } catch (err) {
      toast.error('Failed to update water intake');
    }
  };

  const handleSOS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const message = `EMERGENCY! ${user.name} needs help. Location: https://www.google.com/maps?q=${latitude},${longitude}`;
        toast.error(`SOS Sent! (Simulated: ${message})`, { autoClose: 10000 });
        // In a real app, this would call a backend route to send SMS/Email via Twilio/Nodemailer
      });
    } else {
      toast.error("Geolocation not supported. SOS message sent without location.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold heading-gradient">Hello, {user?.name.split(' ')[0]}!</h1>
          <p className="text-slate-400">Here's your health summary for today.</p>
        </div>
        <button 
          onClick={handleSOS}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all animate-pulse"
        >
          <AlertCircle size={20} />
          EMERGENCY SOS
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                <Droplets size={32} />
              </div>
              <div className="flex-grow">
                <p className="text-slate-400 text-sm">Water Intake</p>
                <h3 className="text-2xl font-bold">{healthData.waterIntake} ml</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateWater(250)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary-500/10 flex items-center justify-center text-secondary-500">
                <Flame size={32} />
              </div>
              <div className="flex-grow">
                <p className="text-slate-400 text-sm">Calories</p>
                <h3 className="text-2xl font-bold">{healthData.caloriesConsumed} kcal</h3>
              </div>
              <TrendingUp className="text-accent" size={24} />
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6">Weekly Progress</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyHistory}>
                  <defs>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="water" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorWater)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming Reminders */}
        <div className="space-y-6">
          <div className="glass-card p-6 h-full border-primary-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Pill className="text-primary-500" /> Reminders
              </h3>
              <span className="text-xs bg-primary-500/20 text-primary-400 py-1 px-2 rounded-lg uppercase tracking-wider font-bold">Today</span>
            </div>
            
            <div className="space-y-4">
              {medicines.length > 0 ? medicines.map((med) => (
                <div key={med._id} className="p-4 bg-white/5 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                  <div className="flex-grow">
                    <h4 className="font-semibold">{med.name}</h4>
                    <p className="text-sm text-slate-400">{med.dosage} • {med.time.join(', ')}</p>
                  </div>
                  <CheckCircle2 className="text-slate-600 hover:text-accent cursor-pointer transition-colors" />
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">No medicines scheduled for today.</p>
                </div>
              )}
            </div>

            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-sm font-medium transition-all">
              View All Medicines
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
