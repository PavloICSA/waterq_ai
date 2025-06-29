import React from 'react';
import { motion } from 'framer-motion';
import { Heart, DollarSign, Users, Lightbulb, CreditCard, Share2, MessageSquare, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DonationSection: React.FC = () => {
  const { t } = useTranslation('donation');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('title')}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Section icon={<Heart className="text-emerald-600" size={28} />} title={t('whySupport.title')}>
          <p className="text-gray-600 mb-4 text-justify leading-relaxed">{t('whySupport.p1')}</p>
          <p className="text-gray-600 mb-4 text-justify leading-relaxed">{t('whySupport.p2')}</p>
          <div className="space-y-2">
            {t('whySupport.items', { returnObjects: true }).map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-emerald-50 rounded-lg">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<DollarSign className="text-emerald-600" size={28} />} title={t('donationOptions.title')}>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="text-emerald-600" size={20} />
                <h4 className="font-medium text-gray-800">{t('donationOptions.card.title')}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3 text-justify">{t('donationOptions.card.desc')}</p>
              <a
                href="https://next.privat24.ua/send/gdygm"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center block"
              >
                {t('donationOptions.card.button')}
              </a>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-emerald-600" size={20} />
                <h4 className="font-medium text-gray-800">{t('donationOptions.paypal.title')}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3 text-justify">{t('donationOptions.paypal.desc')}</p>
              <a
                href="https://www.paypal.com/donate/?hosted_button_id=FLYXSPK2Z3DKS"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center block"
              >
                {t('donationOptions.paypal.button')}
              </a>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section icon={<Users className="text-emerald-600" size={28} />} title={t('orgSupport.title')}>
          <p className="text-gray-600 mb-4 text-justify leading-relaxed">{t('orgSupport.p1')}</p>
          <div className="space-y-2 mb-6">
            {t('orgSupport.items', { returnObjects: true }).map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }))}
            className="btn-secondary w-full"
          >
            {t('orgSupport.button')}
          </button>
        </Section>

        <Section icon={<Lightbulb className="text-emerald-600" size={28} />} title={t('otherWays.title')}>
          <p className="text-gray-600 mb-6 text-justify leading-relaxed">{t('otherWays.p')}</p>
          <div className="space-y-4">
            {t('otherWays.items', { returnObjects: true }).map((item: any, index: number) => {
              const icons = [MessageSquare, Share2, MessageSquare, Globe];
              const IconComponent = icons[index] || MessageSquare;
              return (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <IconComponent className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <span className="font-medium text-gray-800">{item.label}</span>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              );
            })}
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
  <div className="card h-full">
    <div className="flex items-center mb-6">
      {icon}
      <h3 className="text-xl font-semibold text-gray-800 ml-3">{title}</h3>
    </div>
    {children}
  </div>
);

export default DonationSection;