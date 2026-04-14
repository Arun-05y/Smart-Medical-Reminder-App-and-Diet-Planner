import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Pill, Apple, Activity, Bell, ShieldAlert, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/10 rounded-full blur-[120px]"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
              AI-Powered Health Assistant
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Stay Healthy, <br />
              <span className="heading-gradient">Stay On Track</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Your intelligent companion for medicine reminders, personalized meal planning, and health tracking—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 group">
                Get Started Free <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Pill className="text-primary-500" size={32} />}
              title="Medication Reminders"
              desc="Never miss a dose with our smart notification system."
            />
            <FeatureCard 
              icon={<Apple className="text-secondary-500" size={32} />}
              title="AI Diet Planner"
              desc="Personalized nutrition plans based on your health profile."
            />
            <FeatureCard 
              icon={<Activity className="text-accent" size={32} />}
              title="Health Dashboard"
              desc="Track your progress with intuitive charts and metrics."
            />
            <FeatureCard 
              icon={<ShieldAlert className="text-red-500" size={32} />}
              title="Emergency SOS"
              desc="Quickly notify loved ones in case of an emergency."
            />
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold heading-gradient mb-2">24/7</h3>
              <p className="text-slate-400">Monitoring</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold heading-gradient mb-2">99%</h3>
              <p className="text-slate-400">Accuracy</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold heading-gradient mb-2">10k+</h3>
              <p className="text-slate-400">Active Users</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold heading-gradient mb-2">5.0</h3>
              <p className="text-slate-400">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-slate-500">© 2026 SmartMed AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-8 flex flex-col items-center text-center"
  >
    <div className="mb-6 p-4 bg-white/5 rounded-2xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Landing;
