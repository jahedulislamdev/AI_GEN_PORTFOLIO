import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, User, Sparkles } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

// Cast motion to any to avoid strict type issues in some environments
const MotionDiv = motion.div as any;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-cozy-50 text-cozy-900 font-sans selection:bg-cozy-200 selection:text-cozy-900">
      
      {/* Scroll Progress Bar */}
      <MotionDiv
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cozy-400 via-cozy-600 to-cozy-800 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Floating Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-cozy-200 shadow-2xl rounded-full px-6 py-3 flex items-center space-x-8 hover:scale-105 transition-transform duration-300">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex flex-col items-center space-y-1 transition-colors hover:text-cozy-600 ${isActive && !isDashboard ? 'text-cozy-800 font-bold' : 'text-cozy-400'}`
            }
          >
            <User size={20} />
            <span className="text-[10px] uppercase tracking-wider">Portfolio</span>
          </NavLink>
          
          <div className="h-8 w-px bg-cozy-200"></div>

          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex flex-col items-center space-y-1 transition-colors hover:text-cozy-600 ${isActive ? 'text-cozy-800 font-bold' : 'text-cozy-400'}`
            }
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] uppercase tracking-wider">Dashboard</span>
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-24">
        {children}
      </main>

      {/* Animated Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cozy-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
         <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-rose-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-50/60 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Layout;