import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWaterQ } from '../context/WaterQContext';
import { Beaker, Layers, TestTube, Zap } from 'lucide-react';

const InputForm: React.FC = () => {
  const { t, i18n } = useTranslation('input');
  const { inputs, soilProperties, setInputValue, setSoilProperty, calculateWaterQuality } = useWaterQ();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Local state for input display values to handle comma/dot separators
  const [localInputValues, setLocalInputValues] = useState<Record<string, string>>(() => {
    const initialLocal: Record<string, string> = {};
    Object.keys(inputs).forEach(key => {
      initialLocal[key] = inputs[key] !== null && inputs[key] !== undefined ? String(inputs[key]) : '';
    });
    return initialLocal;
  });

  const cationInputs = [
    { id: 'calcium', label: t('ions.calcium'), value: inputs.calcium, maxDecimals: 2 },
    { id: 'magnesium', label: t('ions.magnesium'), value: inputs.magnesium, maxDecimals: 2 },
    { id: 'sodium', label: t('ions.sodium'), value: inputs.sodium, maxDecimals: 2 },
    { id: 'potassium', label: t('ions.potassium'), value: inputs.potassium, maxDecimals: 2 }
  ];

  const anionInputs = [
    { id: 'sulfate', label: t('ions.sulfate'), value: inputs.sulfate, maxDecimals: 2 },
    { id: 'chloride', label: t('ions.chloride'), value: inputs.chloride, maxDecimals: 2 },
    { id: 'carbonate', label: t('ions.carbonate'), value: inputs.carbonate, maxDecimals: 2 },
    { id: 'bicarbonate', label: t('ions.bicarbonate'), value: inputs.bicarbonate, maxDecimals: 2 }
  ];

  const textureOptions = [
    { value: 'sand', label: t('soil.texture.sand') },
    { value: 'loam', label: t('soil.texture.loam') },
    { value: 'clay', label: t('soil.texture.clay') }
  ];

  const acidityOptions = [
    { value: 'acidic', label: t('soil.acidity.acidic') },
    { value: 'neutral', label: t('soil.acidity.neutral') },
    { value: 'alkaline', label: t('soil.acidity.alkaline') }
  ];

  const bufferOptions = [
    { value: 'low', label: t('soil.buffer.low') },
    { value: 'medium', label: t('soil.buffer.medium') },
    { value: 'high', label: t('soil.buffer.high') }
  ];

  // Validation helper functions
  const validateNumericInput = (value: string): { isValid: boolean; error?: string } => {
    if (value === '') {
      return { isValid: true };
    }

    const numericRegex = /^[0-9]*[.,]?[0-9]*$/;
    if (!numericRegex.test(value)) {
      return { isValid: false, error: t('errors.invalid') };
    }

    const normalizedValue = value.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);

    if (isNaN(numericValue)) {
      return { isValid: false, error: t('errors.invalid') };
    }

    if (numericValue < 0) {
      return { isValid: false, error: t('errors.negative') };
    }

    return { isValid: true };
  };

  const validateDecimalPrecision = (value: string, maxDecimals: number): { isValid: boolean; error?: string } => {
    if (value === '') return { isValid: true };

    const normalizedValue = value.replace(',', '.');
    
    if (normalizedValue.includes('.')) {
      const decimalPart = normalizedValue.split('.')[1];
      if (decimalPart && decimalPart.length > maxDecimals) {
        return { 
          isValid: false, 
          error: maxDecimals === 1 ? t('errors.phPrecision') : t('errors.ionPrecision')
        };
      }
    }

    return { isValid: true };
  };

  const validatePHRange = (value: string): { isValid: boolean; error?: string } => {
    if (value === '') return { isValid: true };

    const normalizedValue = value.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);

    if (!isNaN(numericValue) && (numericValue < 0 || numericValue > 14)) {
      return { isValid: false, error: t('errors.phRange') };
    }

    return { isValid: true };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof inputs, maxDecimals?: number) => {
    const rawInputValue = e.target.value;
    setLocalInputValues(prev => ({ ...prev, [key]: rawInputValue }));

    const newErrors = { ...errors };

    const numericValidation = validateNumericInput(rawInputValue);
    if (!numericValidation.isValid) {
      newErrors[key] = numericValidation.error!;
      setErrors(newErrors);
      return;
    }

    if (maxDecimals !== undefined) {
      const precisionValidation = validateDecimalPrecision(rawInputValue, maxDecimals);
      if (!precisionValidation.isValid) {
        newErrors[key] = precisionValidation.error!;
        setErrors(newErrors);
        return;
      }
    }

    if (key === 'pH') {
      const phRangeValidation = validatePHRange(rawInputValue);
      if (!phRangeValidation.isValid) {
        newErrors[key] = phRangeValidation.error!;
        setErrors(newErrors);
        return;
      }

      const phPrecisionValidation = validateDecimalPrecision(rawInputValue, 1);
      if (!phPrecisionValidation.isValid) {
        newErrors[key] = phPrecisionValidation.error!;
        setErrors(newErrors);
        return;
      }
    }

    delete newErrors[key];
    setErrors(newErrors);

    if (rawInputValue === '') {
      setInputValue(key, null);
    } else {
      const normalizedValue = rawInputValue.replace(',', '.');
      const numericValue = parseFloat(normalizedValue);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setInputValue(key, numericValue);
      }
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof soilProperties) => {
    setSoilProperty(key, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentErrors: Record<string, string> = {};
    let hasErrors = false;

    [...cationInputs, ...anionInputs].forEach(ion => {
      const rawValue = localInputValues[ion.id as keyof typeof inputs];
      
      const numericValidation = validateNumericInput(rawValue || '');
      if (!numericValidation.isValid) {
        currentErrors[ion.id] = numericValidation.error!;
        hasErrors = true;
        return;
      }

      const precisionValidation = validateDecimalPrecision(rawValue || '', ion.maxDecimals);
      if (!precisionValidation.isValid) {
        currentErrors[ion.id] = precisionValidation.error!;
        hasErrors = true;
        return;
      }

      if (rawValue === '' || rawValue === undefined) {
        setInputValue(ion.id as keyof typeof inputs, null);
      } else {
        const normalizedValue = rawValue.replace(',', '.');
        const numericValue = parseFloat(normalizedValue);
        if (!isNaN(numericValue) && numericValue >= 0) {
          setInputValue(ion.id as keyof typeof inputs, numericValue);
        }
      }
    });

    const rawPHValue = localInputValues['pH'];
    
    const phNumericValidation = validateNumericInput(rawPHValue || '');
    if (!phNumericValidation.isValid) {
      currentErrors['pH'] = phNumericValidation.error!;
      hasErrors = true;
    } else {
      const phRangeValidation = validatePHRange(rawPHValue || '');
      if (!phRangeValidation.isValid) {
        currentErrors['pH'] = phRangeValidation.error!;
        hasErrors = true;
      } else {
        const phPrecisionValidation = validateDecimalPrecision(rawPHValue || '', 1);
        if (!phPrecisionValidation.isValid) {
          currentErrors['pH'] = phPrecisionValidation.error!;
          hasErrors = true;
        }
      }
    }

    if (!hasErrors || !currentErrors['pH']) {
      if (rawPHValue === '' || rawPHValue === undefined) {
        setInputValue('pH', null);
      } else {
        const normalizedPHValue = rawPHValue.replace(',', '.');
        const numericPHValue = parseFloat(normalizedPHValue);
        if (!isNaN(numericPHValue) && numericPHValue >= 0 && numericPHValue <= 14) {
          setInputValue('pH', numericPHValue);
        }
      }
    }

    setErrors(currentErrors);

    if (hasErrors) {
      return;
    }

    calculateWaterQuality();
  };

  const getUnitLabel = () => {
    return i18n.language === 'en' ? 'meq/L' : 'мекв/л';
  };

  const hasFormErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <TestTube className="text-emerald-600" size={28} />
          {t('sectionTitle')}
        </h3>
      </div>

      {/* Cations Section */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Beaker className="text-emerald-600 mr-3" size={24} />
          <h4 className="text-xl font-semibold text-gray-800">Cations</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cationInputs.map((ion) => (
            <div key={ion.id} className="form-group">
              <label htmlFor={ion.id} className="block text-sm font-medium text-gray-700 mb-2">
                {ion.label} ({getUnitLabel()})
              </label>
              <input
                type="text"
                id={ion.id}
                value={localInputValues[ion.id as keyof typeof inputs] || ''}
                onChange={(e) => handleInputChange(e, ion.id as keyof typeof inputs, ion.maxDecimals)}
                className={`input-field ${
                  errors[ion.id] ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Enter value"
              />
              {errors[ion.id] && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors[ion.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Anions Section */}
      <div className="card">
        <div className="flex items-center mb-6">
          <Layers className="text-emerald-600 mr-3" size={24} />
          <h4 className="text-xl font-semibold text-gray-800">Anions</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {anionInputs.map((ion) => (
            <div key={ion.id} className="form-group">
              <label htmlFor={ion.id} className="block text-sm font-medium text-gray-700 mb-2">
                {ion.label} ({getUnitLabel()})
              </label>
              <input
                type="text"
                id={ion.id}
                value={localInputValues[ion.id as keyof typeof inputs] || ''}
                onChange={(e) => handleInputChange(e, ion.id as keyof typeof inputs, ion.maxDecimals)}
                className={`input-field ${
                  errors[ion.id] ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Enter value"
              />
              {errors[ion.id] && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors[ion.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* pH Section */}
      <div className="card">
        <div className="max-w-md">
          <label htmlFor="pH" className="block text-sm font-medium text-gray-700 mb-2">
            {t('phLabel')}
          </label>
          <input
            type="text"
            id="pH"
            value={localInputValues['pH'] || ''}
            onChange={(e) => handleInputChange(e, 'pH')}
            className={`input-field ${
              errors.pH ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            placeholder="Enter pH value"
          />
          {errors.pH && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <span className="mr-1">⚠</span>
              {errors.pH}
            </p>
          )}
        </div>
      </div>

      {/* Soil Properties Section */}
      <div className="card">
        <h4 className="text-xl font-semibold text-gray-800 mb-6">{t('soilSectionTitle')}</h4>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {t('textureTitle')}
            </label>
            <div className="space-y-3">
              {textureOptions.map((option) => (
                <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="texture"
                    value={option.value}
                    checked={soilProperties.texture === option.value}
                    onChange={(e) => handleRadioChange(e, 'texture')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {t('acidityTitle')}
            </label>
            <div className="space-y-3">
              {acidityOptions.map((option) => (
                <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="acidity"
                    value={option.value}
                    checked={soilProperties.acidity === option.value}
                    onChange={(e) => handleRadioChange(e, 'acidity')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              {t('bufferTitle')}
            </label>
            <div className="space-y-3">
              {bufferOptions.map((option) => (
                <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="bufferCapacity"
                    value={option.value}
                    checked={soilProperties.bufferCapacity === option.value}
                    onChange={(e) => handleRadioChange(e, 'bufferCapacity')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 font-medium">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Summary */}
      {hasFormErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠</span>
            <h4 className="text-sm font-medium text-red-800">
              {t('errors.formHasErrors')}
            </h4>
          </div>
          <p className="text-xs text-red-600 mt-1">
            {t('errors.pleaseCorrect')}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={hasFormErrors}
          className={`flex items-center gap-2 ${
            hasFormErrors
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'btn-primary'
          } px-8 py-4 text-lg font-semibold`}
        >
          <Zap size={20} />
          {t('submitButton')}
        </button>
      </div>
    </form>
  );
};

export default InputForm;