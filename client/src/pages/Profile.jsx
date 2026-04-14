import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Activity, Heart, ShieldAlert, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    diseases: '',
    allergies: '',
    goal: 'maintenance',
    emergencyName: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        age: user.profile?.age || '',
        weight: user.profile?.weight || '',
        height: user.profile?.height || '',
        gender: user.profile?.gender || 'male',
        diseases: user.profile?.diseases?.join(', ') || '',
        allergies: user.profile?.allergies?.join(', ') || '',
        goal: user.profile?.goal || 'maintenance',
        emergencyName: user.emergencyContact?.name || '',
        emergencyPhone: user.emergencyContact?.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        profile: {
          age: Number(profileData.age),
          weight: Number(profileData.weight),
          height: Number(profileData.height),
          gender: profileData.gender,
          goal: profileData.goal,
          diseases: profileData.diseases.split(',').map(s => s.trim()).filter(s => s),
          allergies: profileData.allergies.split(',').map(s => s.trim()).filter(s => s),
        },
        emergencyContact: {
          name: profileData.emergencyName,
          phone: profileData.emergencyPhone
        }
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold heading-gradient mb-2">Health Profile</h1>
        <p className="text-slate-400">Keep your information up to date for better AI recommendations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="text-primary-500" /> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Age</label>
              <input 
                type="number" 
                className="input-field w-full"
                value={profileData.age}
                onChange={(e) => setProfileData({...profileData, age: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Weight (kg)</label>
              <input 
                type="number" 
                className="input-field w-full"
                value={profileData.weight}
                onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Height (cm)</label>
              <input 
                type="number" 
                className="input-field w-full"
                value={profileData.height}
                onChange={(e) => setProfileData({...profileData, height: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Health Details */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Heart className="text-red-500" /> Medical Profile
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Goal</label>
              <select 
                className="input-field w-full bg-slate-800"
                value={profileData.goal}
                onChange={(e) => setProfileData({...profileData, goal: e.target.value})}
              >
                <option value="weight loss">Weight Loss</option>
                <option value="weight gain">Weight Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Diseases / Conditions (comma separated)</label>
              <input 
                type="text" 
                className="input-field w-full"
                placeholder="e.g. Diabetes, Hypertension"
                value={profileData.diseases}
                onChange={(e) => setProfileData({...profileData, diseases: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Allergies (comma separated)</label>
              <input 
                type="text" 
                className="input-field w-full"
                placeholder="e.g. Peanuts, Penicillin"
                value={profileData.allergies}
                onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShieldAlert className="text-orange-500" /> Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Contact Name</label>
              <input 
                type="text" 
                className="input-field w-full"
                value={profileData.emergencyName}
                onChange={(e) => setProfileData({...profileData, emergencyName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Phone Number</label>
              <input 
                type="text" 
                className="input-field w-full"
                value={profileData.emergencyPhone}
                onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
          <Save size={20} /> Save Health Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
