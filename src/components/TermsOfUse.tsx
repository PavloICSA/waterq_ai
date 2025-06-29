import React from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Copyright, AlertTriangle, Shield, Users, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TermsOfUse: React.FC = () => {
  const { t } = useTranslation('terms');

  const sectionIcons = [
    <User className="text-emerald-600" size={24} />,
    <Copyright className="text-emerald-600" size={24} />,
    <AlertTriangle className="text-amber-600" size={24} />,
    <Shield className="text-emerald-600" size={24} />,
    <Users className="text-emerald-600" size={24} />,
    <ExternalLink className="text-emerald-600" size={24} />,
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
          <FileText className="text-emerald-600" size={36} />
          <h2 className="text-4xl font-bold text-gray-800">{t('termsOfUse.title')}</h2>
        </div>
        <div className="text-sm text-gray-500 mb-6 bg-gray-100 inline-block px-4 py-2 rounded-lg">
          {t('termsOfUse.effectiveDate')}
        </div>
      </div>
      
      <div className="card mb-8">
        <p className="text-lg text-gray-700 text-justify leading-relaxed">
          {t('termsOfUse.intro')}
        </p>
      </div>

      <div className="space-y-6">
        <Section icon={sectionIcons[0]} title={t('termsOfUse.sections.use.title')}>
          <p className="text-gray-700 text-justify leading-relaxed mb-4">{t('termsOfUse.sections.use.p1')}</p>
          <p className="text-gray-700 mb-4">{t('termsOfUse.sections.use.p2')}</p>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <ul className="space-y-2">
              {t('termsOfUse.sections.use.list', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-justify leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-700 mt-4 text-justify leading-relaxed">{t('termsOfUse.sections.use.p3')}</p>
        </Section>

        <Section icon={sectionIcons[1]} title={t('termsOfUse.sections.ownership.title')}>
          <p className="text-gray-700 text-justify leading-relaxed mb-4">{t('termsOfUse.sections.ownership.p1')}</p>
          <p className="text-gray-700 mb-4">{t('termsOfUse.sections.ownership.p2')}</p>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <ul className="space-y-2">
              {t('termsOfUse.sections.ownership.list', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-justify leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section icon={sectionIcons[2]} title={t('termsOfUse.sections.disclaimer.title')}>
          <p className="text-gray-700 text-justify leading-relaxed mb-4">{t('termsOfUse.sections.disclaimer.p1')}</p>
          <p className="text-gray-700 mb-4">{t('termsOfUse.sections.disclaimer.p2')}</p>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <ul className="space-y-2">
              {t('termsOfUse.sections.disclaimer.list', { returnObjects: true }).map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 text-justify leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section icon={sectionIcons[3]} title={t('termsOfUse.sections.liability.title')}>
          <p className="text-gray-700 text-justify leading-relaxed">{t('termsOfUse.sections.liability.p1')}</p>
        </Section>

        <Section icon={sectionIcons[4]} title={t('termsOfUse.sections.userData.title')}>
          <p className="text-gray-700 text-justify leading-relaxed">{t('termsOfUse.sections.userData.p1')}</p>
        </Section>

        <Section icon={sectionIcons[5]} title={t('termsOfUse.sections.thirdParty.title')}>
          <p className="text-gray-700 text-justify leading-relaxed">{t('termsOfUse.sections.thirdParty.p1')}</p>
        </Section>

        <Section icon={sectionIcons[6]} title={t('termsOfUse.sections.changes.title')}>
          <p className="text-gray-700 text-justify leading-relaxed">{t('termsOfUse.sections.changes.p1')}</p>
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
      <h3 className="text-xl font-semibold text-gray-800 ml-3">{title}</h3>
    </div>
    {children}
  </div>
);

export default TermsOfUse;