import React from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  setActiveSection: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveSection }) => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-3">{t('appName')}</h3>
            <p className="text-gray-300 text-base max-w-md leading-relaxed">
              {t('appDescription')}
            </p>
          </div>
          
          <div className="flex items-center">
            <p className="text-gray-300 text-base">
              {t('footer.madeWith')} <Heart size={16} className="inline text-red-500 mx-1" /> {t('footer.forSustainability')}
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-base mb-4 md:mb-0">
            &copy; {currentYear} {t('appName')}. {t('footer.allRightsReserved')}
          </p>
          
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveSection('privacy')}
              className="text-gray-400 hover:text-emerald-300 transition-colors duration-200 text-base"
            >
              {t('footer.privacyPolicy')}
            </button>
            <button 
              onClick={() => setActiveSection('terms')}
              className="text-gray-400 hover:text-emerald-300 transition-colors duration-200 text-base"
            >
              {t('footer.termsOfUse')}
            </button>
            <button 
              onClick={() => setActiveSection('contact')}
              className="text-gray-400 hover:text-emerald-300 transition-colors duration-200 text-base"
            >
              {t('footer.contact')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bolt.new Badge */}
      <div className="absolute bottom-6 right-6 z-10">
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block transition-transform duration-200 hover:scale-110"
          aria-label="Built with Bolt.new"
        >
          <img 
            src="/black_circle_360x360.png" 
            alt="Built with Bolt.new" 
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;