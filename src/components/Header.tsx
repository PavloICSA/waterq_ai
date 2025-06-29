import React from 'react';
import { Droplets, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const { t } = useTranslation('common');

  const navItems = [
    { id: 'main', label: t('navigation.analysis') },
    { id: 'about', label: t('navigation.about') },
    { id: 'guidelines', label: t('navigation.guidelines') },
    { id: 'references', label: t('navigation.references') },
    { id: 'donation', label: t('navigation.support') },
    { id: 'other-apps', label: t('navigation.otherApps') }
  ];

  const getSubtitle = () => {
    return t('appSubtitle');
  };

  const getAnalyzeButtonText = () => {
    return t('buttons.analyzeNow');
  };

  return (
    <header className="bg-gradient-to-r from-cyan-700 via-cyan-800 to-cyan-900 text-white shadow-xl relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Logo and Title */}
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mr-3"
            >
              <Droplets size={40} className="text-cyan-300" />
            </motion.div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">{t('appName')}</h1>
              <p className="text-cyan-200 text-sm font-light hidden sm:block">
                {getSubtitle()}
              </p>
            </div>
          </div>
          
          {/* Navigation and CTA */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
            {/* Navigation */}
            <nav className="w-full lg:w-auto">
              <ul className="flex flex-wrap gap-2 lg:gap-4">
                {navItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 relative text-sm lg:text-base ${
                        activeSection === item.id 
                          ? 'text-white font-medium bg-white/20 backdrop-blur-sm' 
                          : 'text-cyan-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* CTA Button and Language Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSection('main')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Zap size={18} />
                <span className="hidden sm:inline">{getAnalyzeButtonText()}</span>
                <span className="sm:hidden">{t('buttons.analyze')}</span>
              </button>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;