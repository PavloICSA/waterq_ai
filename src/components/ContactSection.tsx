import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactSection: React.FC = () => {
  const { t } = useTranslation('contact');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mail className="text-emerald-600" size={36} />
          <h2 className="text-4xl font-bold text-gray-800">{t('contact.title')}</h2>
        </div>
      </div>
      
      <div className="card mb-8">
        <p className="text-lg text-gray-700 text-justify leading-relaxed">
          {t('contact.intro')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Section icon={<Mail className="text-emerald-600" size={28} />} title={t('contact.emailSupport.title')}>
          <p className="text-gray-700 text-justify leading-relaxed mb-4">
            {t('contact.emailSupport.description')}
          </p>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center gap-3">
              <Mail className="text-emerald-600" size={20} />
              <a 
                href="mailto:pavel.likhovid@icsanaas.com.ua"
                className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors duration-200"
              >
                {t('contact.emailSupport.email')}
              </a>
            </div>
          </div>
        </Section>

        <Section icon={<MessageSquare className="text-emerald-600" size={28} />} title={t('contact.feedback.title')}>
          <p className="text-gray-700 text-justify leading-relaxed">
            {t('contact.feedback.description')}
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <MessageSquare className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">We value your input!</h4>
                <p className="text-sm text-blue-700">Your feedback helps us improve WaterQ AI for everyone.</p>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-8">
        <Section icon={<Scale className="text-emerald-600" size={28} />} title={t('contact.legal.title')}>
          <p className="text-gray-700 text-justify leading-relaxed">
            {t('contact.legal.description')}{' '}
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'privacy' }))}
              className="text-emerald-600 hover:text-emerald-700 underline font-medium transition-colors duration-200"
            >
              {t('contact.legal.links.privacy')}
            </button>{' '}
            {t('contact.legal.description').includes('and') ? 'and' : 'та'}{' '}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'terms' }))}
              className="text-emerald-600 hover:text-emerald-700 underline font-medium transition-colors duration-200"
            >
              {t('contact.legal.links.terms')}
            </button>. If you still have questions, email us directly.
          </p>
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

export default ContactSection;