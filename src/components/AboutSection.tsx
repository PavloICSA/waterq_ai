import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Book, Award, HeartHandshake, Target, Microscope, User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutSection: React.FC = () => {
  const { t } = useTranslation('about');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('about.title')}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('about.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Section icon={<Target className="text-emerald-600" size={28} />} title={t('about.missionTitle')}>
          <p className="text-gray-600 mb-4 text-justify leading-relaxed">{t('about.mission1')}</p>
          <p className="text-gray-600 text-justify leading-relaxed">{t('about.mission2')}</p>
        </Section>

        <Section icon={<Microscope className="text-emerald-600" size={28} />} title={t('about.scienceTitle')}>
          <p className="text-gray-600 mb-4 text-justify leading-relaxed">{t('about.scienceIntro')}</p>
          <div className="space-y-3">
            {t('about.indicators', { returnObjects: true }).slice(0, 4).map((indicator: any, i: number) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{indicator.title}</span>
                <p className="text-sm text-gray-600 mt-1">{indicator.description}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-justify leading-relaxed mt-4">{t('about.scienceConclusion')}</p>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section icon={<User className="text-emerald-600" size={28} />} title={t('about.developerTitle')}>
          <p className="text-gray-600 mb-4 text-justify leading-relaxed">{t('about.developerInfo')}</p>
          <p className="text-gray-600 mb-4">{t('about.developerLinksIntro')}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { key: 'wos', url: 'https://www.webofscience.com/wos/author/record/P-8632-2017' },
              { key: 'scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=57203401147' },
              { key: 'scholar', url: 'https://scholar.google.com/citations?user=3lSpU2sAAAAJ&hl=en' },
              { key: 'researchgate', url: 'https://www.researchgate.net/profile/Pavlo-Lykhovyd' }
            ].map((link) => (
              <a
                key={link.key}
                href={link.url}
                className="flex items-center justify-center p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(`about.links.${link.key}`)}
              </a>
            ))}
          </div>
          <p className="text-gray-600 text-justify leading-relaxed">{t('about.developerNote')}</p>
        </Section>

        <Section icon={<Users className="text-emerald-600" size={28} />} title={t('about.joinTitle')}>
          <p className="text-gray-600 mb-4 text-justify leading-relaxed">{t('about.joinText1')}</p>
          <p className="text-gray-600 text-justify leading-relaxed">{t('about.joinText2')}</p>
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
  <div className="card h-full">
    <div className="flex items-center mb-6">
      {icon}
      <h3 className="text-xl font-semibold text-gray-800 ml-3">{title}</h3>
    </div>
    {children}
  </div>
);

export default AboutSection;