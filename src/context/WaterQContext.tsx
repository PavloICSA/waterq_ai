import React, { createContext, useState, useContext, ReactNode } from 'react';
import { calculateResults } from '../utils/calculations';
import { WaterInputs, WaterResults, SoilProperties } from '../types/waterTypes';
import { useTranslation } from 'react-i18next';

interface WaterQContextType {
  inputs: WaterInputs;
  results: WaterResults | null;
  soilProperties: SoilProperties;
  setInputValue: (key: keyof WaterInputs, value: number | null) => void;
  setSoilProperty: (key: keyof SoilProperties, value: string) => void;
  calculateWaterQuality: () => void;
  clearResults: () => void;
  hasCalculated: boolean;
}

const defaultInputs: WaterInputs = {
  calcium: 0,
  magnesium: 0,
  sodium: 0,
  potassium: 0,
  sulfate: 0,
  chloride: 0,
  carbonate: 0,
  bicarbonate: 0,
  pH: 0
};

const defaultSoilProperties: SoilProperties = {
  texture: 'loam',
  acidity: 'neutral',
  bufferCapacity: 'medium'
};

const WaterQContext = createContext<WaterQContextType | undefined>(undefined);

export const WaterQProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [inputs, setInputs] = useState<WaterInputs>(defaultInputs);
  const [soilProperties, setSoilProps] = useState<SoilProperties>(defaultSoilProperties);
  const [results, setResults] = useState<WaterResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const setInputValue = (key: keyof WaterInputs, value: number | null) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  };

  const setSoilProperty = (key: keyof SoilProperties, value: string) => {
    setSoilProps(prev => ({ ...prev, [key]: value }));
  };

  const calculateWaterQuality = () => {
    const calculatedResults = calculateResults(inputs, soilProperties, i18n.language);
    setResults(calculatedResults);
    setHasCalculated(true);
  };

  const clearResults = () => {
    setInputs(defaultInputs);
    setSoilProps(defaultSoilProperties);
    setResults(null);
    setHasCalculated(false);
  };

  return (
    <WaterQContext.Provider
      value={{
        inputs,
        soilProperties,
        results,
        setInputValue,
        setSoilProperty,
        calculateWaterQuality,
        clearResults,
        hasCalculated
      }}
    >
      {children}
    </WaterQContext.Provider>
  );
};

export const useWaterQ = (): WaterQContextType => {
  const context = useContext(WaterQContext);
  if (context === undefined) {
    throw new Error('useWaterQ must be used within a WaterQProvider');
  }
  return context;
};