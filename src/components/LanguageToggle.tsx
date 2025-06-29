import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation('common');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'uk' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center px-3 py-2 rounded-md text-cyan-200 hover:text-white transition-colors duration-200"
      title={`Switch to ${i18n.language === 'en' ? 'Українська' : 'English'}`}
    >
      <Globe size={18} className="mr-2" />
      <span className="text-sm font-medium">
        {i18n.language === 'en' ? 'UK' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;