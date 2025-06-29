import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RotateCcw } from 'lucide-react';
import InputForm from './InputForm';
import ResultsDisplay from './ResultsDisplay';
import { useWaterQ } from '../context/WaterQContext';

const MainSection: React.FC = () => {
  const { t } = useTranslation('main');
  const { hasCalculated, clearResults } = useWaterQ();

  const getInstructionText = () => {
    return t('mainSection.instructionText');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('mainSection.title')}</h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-4 leading-relaxed">
          {t('mainSection.description1')}
        </p>
        <p className="text-base text-gray-600 max-w-4xl mx-auto mb-4 leading-relaxed">
          {getInstructionText()}
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
          <AlertCircle size={20} />
          <p>{t('mainSection.description2')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className={`${hasCalculated ? 'xl:col-span-5' : 'xl:col-span-12'} transition-all duration-500`}>
          <InputForm />
        </div>

        {hasCalculated && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:col-span-7"
          >
            <div className="card h-full">
              <ResultsDisplay />
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={clearResults}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <RotateCcw size={18} />
                  {t('mainSection.button.clearResults')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MainSection;