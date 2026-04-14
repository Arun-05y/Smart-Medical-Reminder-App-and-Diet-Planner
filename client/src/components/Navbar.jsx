import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Pill, LayoutDashboard, Utensils, User, LogOut, HeartPulse } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <HeartPulse className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold heading-gradient">SmartMed</span>
          </Link>

          {user ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/medicines" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <Pill size={18} />
                <span>Medicines</span>
              </Link>
              <Link to="/diet-planner" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <Utensils size={18} />
                <span>Diet Plans</span>
              </Link>
              <Link to="/profile" className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                <User size={18} />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </div>
          )}
          
          {/* Mobile menu could go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
