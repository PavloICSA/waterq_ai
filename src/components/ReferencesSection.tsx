import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Globe, ExternalLink, Calculator, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ReferencesSection: React.FC = () => {
  const { t, i18n } = useTranslation('references');

  const publications = t('references.publications', { returnObjects: true }) as Array<{
    title: string;
    authors: string;
    year: string;
    source: string;
    url: string;
  }>;

  const websites = t('references.websites', { returnObjects: true }) as Array<{
    name: string;
    url: string;
  }>;

  const methodologies = t('references.methodologies.items', { returnObjects: true }) as Array<{
    title: string;
    formula: string | string[];
    significance: string;
    interpretation: string | string[];
  }>;

  const getSubtitle = () => {
    return i18n.language === 'en' 
      ? "Scientific literature and resources that inform our water quality analysis"
      : t('references.subtitle');
  };

  const getPublicationsTitle = () => {
    return i18n.language === 'en' 
      ? "Academic Publications"
      : t('references.publicationsTitle');
  };

  const getPublicationsIntro = () => {
    return i18n.language === 'en' 
      ? "The following academic publications form the scientific foundation for the water quality indicators and classification systems used in WaterQ AI:"
      : t('references.publicationsIntro');
  };

  const getViewPublicationText = () => {
    return i18n.language === 'en' 
      ? "View publication"
      : t('references.viewPublication');
  };

  const getOnlineResourcesTitle = () => {
    return i18n.language === 'en' 
      ? "Online Resources"
      : t('references.onlineResourcesTitle');
  };

  const getOnlineResourcesIntro = () => {
    return i18n.language === 'en' 
      ? "These websites provide additional information on water quality standards, testing procedures, and interpretation guidelines:"
      : t('references.onlineResourcesIntro');
  };

  const getFormulaLabel = () => {
    return i18n.language === 'en' ? "Formula: " : "Формула: ";
  };

  const getSignificanceLabel = () => {
    return i18n.language === 'en' ? "Significance: " : "Значення: ";
  };

  const getInterpretationLabel = () => {
    return i18n.language === 'en' ? "Interpretation: " : "Тлумачення: ";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('references.title')}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {getSubtitle()}
        </p>
      </div>

      <div className="space-y-8">
        <Section icon={<BookOpen className="text-emerald-600" size={28} />} title={getPublicationsTitle()}>
          <p className="text-gray-600 mb-6 text-justify leading-relaxed">
            {getPublicationsIntro()}
          </p>
          
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                <h4 className="text-base font-semibold text-gray-800 mb-2 leading-tight">{pub.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{pub.authors} ({pub.year})</p>
                <p className="text-sm text-gray-500 mb-3 italic">{pub.source}</p>
                {pub.url !== "#" && (
                  <a 
                    href={pub.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-200 font-medium"
                  >
                    <ExternalLink size={16} />
                    {getViewPublicationText()}
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<Globe className="text-emerald-600" size={28} />} title={getOnlineResourcesTitle()}>
          <p className="text-gray-600 mb-6 text-justify leading-relaxed">
            {getOnlineResourcesIntro()}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {websites.map((site, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 text-emerald-600 rounded-full p-2 flex-shrink-0">
                    <Globe size={18} />
                  </div>
                  <div className="flex-1">
                    <a 
                      href={site.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-base text-emerald-600 hover:text-emerald-700 transition-colors duration-200 font-medium leading-tight block"
                    >
                      {site.name}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<Calculator className="text-emerald-600" size={28} />} title={t('references.methodologies.title')}>
          <div className="space-y-6">
            {methodologies.map((method, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{method.title}</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded border">
                    <span className="font-medium text-gray-700">{getFormulaLabel()}</span>
                    {Array.isArray(method.formula) ? (
                      <div className="mt-2 space-y-1">
                        {method.formula.map((f, i) => (
                          <div key={i} className="font-mono text-sm bg-gray-100 p-2 rounded">{f}</div>
                        ))}
                      </div>
                    ) : (
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-2">{method.formula}</div>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">{getSignificanceLabel()}</span>
                    <p className="text-gray-600 text-justify leading-relaxed mt-1">{method.significance}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">{getInterpretationLabel()}</span>
                    {Array.isArray(method.interpretation) ? (
                      <div className="mt-2 space-y-2">
                        {method.interpretation.map((i, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-600 text-justify leading-relaxed">{i}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-justify leading-relaxed mt-1">{method.interpretation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </motion.div>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <div className="card">
    <div className="flex items-center mb-6">
      {icon}
      <h3 className="text-2xl font-semibold text-gray-800 ml-3">{title}</h3>
    </div>
    {children}
  </div>
);

export default ReferencesSection;