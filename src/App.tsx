import React, { useState } from 'react';
import Header from './components/Header';
import MainSection from './components/MainSection';
import AboutSection from './components/AboutSection';
import GuidelinesSection from './components/GuidelinesSection';
import ReferencesSection from './components/ReferencesSection';
import DonationSection from './components/DonationSection';
import OtherAppsSection from './components/OtherAppsSection';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { WaterQProvider } from './context/WaterQContext';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('main');

  // Listen for navigation events
  React.useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setActiveSection(event.detail);
    };

    window.addEventListener('navigate' as any, handleNavigation);
    return () => window.removeEventListener('navigate' as any, handleNavigation);
  }, []);

  return (
    <WaterQProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
        <Header activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-grow container mx-auto px-4 py-12">
          {activeSection === 'main' && <MainSection />}
          {activeSection === 'about' && <AboutSection />}
          {activeSection === 'guidelines' && <GuidelinesSection />}
          {activeSection === 'references' && <ReferencesSection />}
          {activeSection === 'donation' && <DonationSection />}
          {activeSection === 'other-apps' && <OtherAppsSection />}
          {activeSection === 'privacy' && <PrivacyPolicy />}
          {activeSection === 'terms' && <TermsOfUse />}
          {activeSection === 'contact' && <ContactSection />}
        </main>
        
        <Footer setActiveSection={setActiveSection} />
      </div>
    </WaterQProvider>
  );
};

export default App;