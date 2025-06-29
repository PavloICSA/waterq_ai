import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useWaterQ } from '../context/WaterQContext';
import { Download, BarChart3, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

const ResultsDisplay: React.FC = () => {
  const { t } = useTranslation('results');
  const { results } = useWaterQ();
  const { toPDF, targetRef } = usePDF({ filename: 'waterq-analysis.pdf' });

  if (!results) {
    return null;
  }

  const qualityGroups = [
    {
      title: t('resultsDisplay.groups.basic'),
      items: [
        {
          name: t('resultsDisplay.parameters.tds.name'),
          value: t('resultsDisplay.parameters.tds.value', { value: results.tds.total }),
          details: t('resultsDisplay.parameters.tds.details', { toxic: results.tds.toxic, nonToxic: results.tds.nonToxic }),
          qualityClass: results.tds.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.ph.name'),
          value: t('resultsDisplay.parameters.ph.value', { value: results.pH.value }),
          qualityClass: results.pH.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.ecl.name'),
          value: t('resultsDisplay.parameters.ecl.value', { value: results.toxicIonsECl.value }),
          qualityClass: results.toxicIonsECl.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.carbonates.name'),
          value: t('resultsDisplay.parameters.carbonates.value', {
            carbonateValue: results.carbonates.carbonateValue,
            bicarbonateValue: results.carbonates.bicarbonateValue
          }),
          qualityClass: results.carbonates.qualityClass
        }
      ]
    },
    {
      title: t('resultsDisplay.groups.sodium'),
      items: [
        {
          name: t('resultsDisplay.parameters.ssp.name'),
          value: t('resultsDisplay.parameters.ssp.value', { value: results.ssp.value }),
          qualityClass: results.ssp.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.sar.name'),
          value: t('resultsDisplay.parameters.sar.value', { value: results.sar.value }),
          qualityClass: results.sar.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.rsc.name'),
          value: t('resultsDisplay.parameters.rsc.value', { value: results.rsc.value }),
          qualityClass: results.rsc.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.kellyRatio.name'),
          value: t('resultsDisplay.parameters.kellyRatio.value', { value: results.kellyRatio.value }),
          qualityClass: results.kellyRatio.qualityClass
        }
      ]
    },
    {
      title: t('resultsDisplay.groups.other'),
      items: [
        {
          name: t('resultsDisplay.parameters.alkalinationHazards.name'),
          value: t('resultsDisplay.parameters.alkalinationHazards.value', { value: results.alkalinationHazards.value }),
          qualityClass: results.alkalinationHazards.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.steblerK.name'),
          value: t('resultsDisplay.parameters.steblerK.value', { value: results.steblerK.value }),
          qualityClass: results.steblerK.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.cie.name'),
          value: t('resultsDisplay.parameters.cie.value', { value: results.cie.value }),
          qualityClass: results.cie.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.magnesiumRatio.name'),
          value: t('resultsDisplay.parameters.magnesiumRatio.value', { value: results.magnesiumRatio.value }),
          qualityClass: results.magnesiumRatio.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.permeabilityIndex.name'),
          value: t('resultsDisplay.parameters.permeabilityIndex.value', { value: results.permeabilityIndex.value }),
          qualityClass: results.permeabilityIndex.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.corrosionRatio.name'),
          value: t('resultsDisplay.parameters.corrosionRatio.value', { value: results.corrosionRatio.value }),
          qualityClass: results.corrosionRatio.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.agc.name'),
          value: t('resultsDisplay.parameters.agc.value', { value: results.agc.value }),
          qualityClass: results.agc.qualityClass
        },
        {
          name: t('resultsDisplay.parameters.thermodynamic.name'),
          value: t('resultsDisplay.parameters.thermodynamic.value', {
            solubilityProduct: results.thermodynamic.solubilityProduct,
            ionActivity: results.thermodynamic.ionActivity
          }),
          qualityClass: results.thermodynamic.qualityClass
        }
      ]
    }
  ];

  const isIonBalanceError = (itemQualityClass: any) => {
    return itemQualityClass.class === 'resultsDisplay.qualityClass.error' &&
           itemQualityClass.description.includes('ionBalance.errorMessageShort');
  };

  const getQualityIcon = (qualityClass: any) => {
    if (qualityClass.class.includes('error')) {
      return <XCircle className="text-red-500" size={18} />;
    }
    if (qualityClass.class.includes('excellent') || qualityClass.class.includes('good')) {
      return <CheckCircle className="text-green-500" size={18} />;
    }
    return <AlertTriangle className="text-yellow-500" size={18} />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-emerald-600" size={24} />
          <h3 className="text-2xl font-semibold text-gray-800">{t('resultsDisplay.title')}</h3>
        </div>
        <button
          onClick={() => toPDF()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Download size={16} />
          {t('resultsDisplay.downloadPdf')}
        </button>
      </div>

      <div ref={targetRef} className="space-y-6">
        {qualityGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="card">
            <h4 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              {group.title}
            </h4>
            <div className="space-y-3">
              {group.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getQualityIcon(item.qualityClass)}
                        <h5 className="font-medium text-gray-800">{item.name}</h5>
                      </div>
                      {item.details && <p className="text-sm text-gray-600 mb-2">{item.details}</p>}
                    </div>
                    <div className="flex flex-col lg:items-end gap-2">
                      <div className="font-mono text-sm bg-white px-3 py-1 rounded border text-gray-700">
                        {item.value}
                      </div>
                      <div className={`text-sm font-medium px-3 py-1 rounded-full ${item.qualityClass.color} bg-opacity-10 border`}>
                        {t(item.qualityClass.class)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {isIonBalanceError(item.qualityClass) && (
                        <span className="text-red-500 font-bold">{t('resultsDisplay.errorLabel')}: </span>
                      )}
                      {t(item.qualityClass.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;