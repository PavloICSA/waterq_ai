import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, Eye, Cookie, Users, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation('privacy');

  const sectionIcons = [
    <Database className="text-emerald-600" size={24} />,
    <Eye className="text-emerald-600" size={24} />,
    <Lock className="text-emerald-600" size={24} />,
    <Users className="text-emerald-600" size={24} />,
    <Cookie className="text-emerald-600" size={24} />,
    <Shield className="text-emerald-600" size={24} />,
    <RefreshCw className="text-emerald-600" size={24} />
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="text-emerald-600" size={36} />
          <h2 className="text-4xl font-bold text-gray-800">{t('privacyPolicy.title')}</h2>
        </div>
        <div className="text-sm text-gray-500 mb-6 bg-gray-100 inline-block px-4 py-2 rounded-lg">
          {t('privacyPolicy.effectiveDate')}
        </div>
      </div>
      
      <div className="card mb-8">
        <p className="text-lg text-gray-700 text-justify leading-relaxed">
          {t('privacyPolicy.intro')}
        </p>
      </div>

      <div className="space-y-6">
        {t('privacyPolicy.sections', { returnObjects: true }).map((section: any, index: number) => (
          <div key={index} className="card">
            <div className="flex items-center mb-6">
              {sectionIcons[index]}
              <h3 className="text-xl font-semibold text-gray-800 ml-3">{section.title}</h3>
            </div>
            
            <div className="space-y-4">
              {section.paragraphs.map((paragraph: string, pIndex: number) => (
                <p key={pIndex} className="text-gray-700 text-justify leading-relaxed">{paragraph}</p>
              ))}
              
              {section.list && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <ul className="space-y-2">
                    {section.list.map((item: string, lIndex: number) => (
                      <li key={lIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-justify leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {section.paragraphsAfterList && section.paragraphsAfterList.map((paragraph: string, pIndex: number) => (
                <p key={pIndex} className="text-gray-700 text-justify leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;