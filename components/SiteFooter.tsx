
import React from 'react';

const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="text-4xl font-black tracking-tighter uppercase holographic-text">
            C
          </div>
          <span className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Cabana. All rights reserved.
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-neutral-300">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Join</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </nav>
      </div>
    </footer>
  );
};

export default SiteFooter;