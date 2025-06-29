import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Calculator, ExternalLink, Satellite, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OtherAppsSection: React.FC = () => {
  const { t } = useTranslation('otherapps');

  const apps = t('otherAppsSection.apps', { returnObjects: true }) as Array<{
    title: string;
    description: string;
    linkText: string;
  }>;

  const appIcons = [
    <Satellite className="text-green-600" size={28} />,
    <Database className="text-blue-600" size={28} />
  ];

  const appLinks = [
    "https://ukr-crop-map.web.app",
    "https://ukr-soil-clim-database.web.app"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('otherAppsSection.title')}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('otherAppsSection.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {apps.map((app, index) => (
          <div
            key={index}
            className="card h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gray-100 p-3 rounded-lg mr-4">
                {appIcons[index]}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{app.title}</h3>
            </div>
            <p className="text-gray-600 text-justify leading-relaxed mb-6 flex-1">
              {app.description}
            </p>
            <div className="flex justify-end">
              <a
                href={appLinks[index]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                <ExternalLink size={16} />
                {app.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center mb-6">
          <div className="bg-cyan-100 p-3 rounded-lg mr-4">
            <Leaf className="text-cyan-600" size={28} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">{t('otherAppsSection.stayUpdated.title')}</h3>
        </div>
        <p className="text-gray-600 text-justify leading-relaxed">
          {t('otherAppsSection.stayUpdated.description')}
        </p>
      </div>
    </motion.div>
  );
};

export default OtherAppsSection;