
import React from 'react';
import Hero from './components/Hero';
import Membership from './components/Membership';
import SiteFooter from './components/SiteFooter';
import Waitlist from './components/Waitlist';

const App: React.FC = () => {
  return (
    <div className="relative overflow-x-hidden font-sans">
      <main>
        <Hero />
        <Waitlist />
        <Membership />
      </main>
      <SiteFooter />
    </div>
  );
};

export default App;
