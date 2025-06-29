import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, AlertCircle, Info, FileText, Play, Beaker, TestTube, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GuidelinesSection: React.FC = () => {
  const { t, i18n } = useTranslation('guidelines');

  const renderInputGuidelinesText = () => {
    if (i18n.language === 'en') {
      return (
        <p className="text-gray-600 mb-4 text-justify leading-relaxed">
          Units - All ion concentrations must be entered in milligram-equivalents per liter (meq/L). If your laboratory results are in different units (such as mg/L or ppm), you'll need to convert them before entry. <a href="http://www.nafwa.org/convert1.php" className="text-emerald-600 underline hover:text-emerald-700">Here</a> is a converter for mg in meq, and <a href="https://www.inchcalculator.com/ppm-to-mgl-converter/" className="text-emerald-600 underline hover:text-emerald-700">here</a> is a converter to get mg from ppm. Remember to round ion concentrations to two decimal places, and pH to one decimal place.
        </p>
      );
    } else {
      return (
        <p className="text-gray-600 mb-4 text-justify leading-relaxed">
          Одиниці вимірювання - Усі концентрації іонів повинні вводитися в міліграм-еквівалентах на літр (мекв/л). Якщо ваші лабораторні результати подано в інших одиницях (наприклад, мг/л або ppm), їх потрібно конвертувати перед введенням. <a href="http://www.nafwa.org/convert1.php" className="text-emerald-600 underline hover:text-emerald-700">Ось</a> конвертер для переведення мг у мекв, а <a href="https://www.inchcalculator.com/ppm-to-mgl-converter/" className="text-emerald-600 underline hover:text-emerald-700">ось</a> конвертер для переведення мг з ppm. Не забудьте округлити концентрації іонів до двох знаків після коми, а pH — до одного знака після коми.
        </p>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('guidelinesSection.title')}</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {t('guidelinesSection.subtitle')}
        </p>
      </div>

      <div className="space-y-8">
        <Section icon={<Play className="text-emerald-600" size={28} />} title={t('guidelinesSection.sections.gettingStarted.title')}>
          <div className="space-y-4">
            {t('guidelinesSection.sections.gettingStarted.steps', { returnObjects: true }).map((step: string, index: number) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-justify leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<FileText className="text-emerald-600" size={28} />} title={t('guidelinesSection.sections.inputGuidelines.title')}>
          {renderInputGuidelinesText()}
          <div className="space-y-3">
            {t('guidelinesSection.sections.inputGuidelines.points', { returnObjects: true }).slice(1).map((point: string, index: number) => (
              <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-gray-700 text-justify leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<BarChart3 className="text-emerald-600" size={28} />} title={t('guidelinesSection.sections.understandingResults.title')}>
          <p className="text-gray-600 mb-6 text-justify leading-relaxed">
            {t('guidelinesSection.sections.understandingResults.intro')}
          </p>
          <div className="space-y-4">
            {t('guidelinesSection.sections.understandingResults.points', { returnObjects: true }).map((point: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                {typeof point === 'string' ? (
                  <p className="text-gray-700 text-justify leading-relaxed">{point}</p>
                ) : (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">{point.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {point.details.map((detail: string, detailIndex: number) => (
                        <div key={detailIndex} className={`p-2 rounded text-sm ${
                          detail.includes('Excellent') ? 'bg-green-100 text-green-800' :
                          detail.includes('Good') ? 'bg-blue-100 text-blue-800' :
                          detail.includes('Fair') ? 'bg-yellow-100 text-yellow-800' :
                          detail.includes('Poor') ? 'bg-orange-100 text-orange-800' :
                          detail.includes('Unsuitable') ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section icon={<AlertCircle className="text-amber-600" size={28} />} title={t('guidelinesSection.sections.importantNotes.title')}>
          <div className="space-y-3">
            {t('guidelinesSection.sections.importantNotes.points', { returnObjects: true }).map((point: string, index: number) => (
              <div key={index} className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-gray-700 text-justify leading-relaxed">{point}</p>
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

export default GuidelinesSection;