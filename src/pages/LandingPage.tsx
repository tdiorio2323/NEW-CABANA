/**
 * Landing Page
 * Original marketing landing page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero';
import Waitlist from '../../components/Waitlist';
import Membership from '../../components/Membership';
import SiteFooter from '../../components/SiteFooter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Waitlist />
      <Membership />
      <SiteFooter />

      {/* Demo Mode Banner */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[var(--brand-gold)] text-black px-6 py-2 rounded-full shadow-lg flex items-center gap-3">
          <span className="font-bold">🎮 Demo Mode Active</span>
          <Link
            to="/login"
            className="bg-black text-[var(--brand-gold)] px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            Enter Demo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
