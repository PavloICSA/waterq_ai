export interface WaterInputs {
  calcium: number;
  magnesium: number;
  sodium: number;
  potassium: number;
  sulfate: number;
  chloride: number;
  carbonate: number;
  bicarbonate: number;
  pH: number;
}

export interface SoilProperties {
  texture: string;
  acidity: string;
  bufferCapacity: string;
}

export interface QualityClass {
  class: string;
  description: string;
  color: string;
}

export interface WaterResults {
  // TDS Results
  tds: {
    total: number;
    toxic: number;
    nonToxic: number;
    qualityClass: QualityClass;
  };
  // pH value
  pH: {
    value: number;
    qualityClass: QualityClass;
  };
  // Toxic ions in eCl
  toxicIonsECl: {
    value: number;
    qualityClass: QualityClass;
  };
  // Carbonate and bicarbonate concentrations
  carbonates: {
    carbonateValue: number;
    bicarbonateValue: number;
    qualityClass: QualityClass;
  };
  // Alkalination hazards
  alkalinationHazards: {
    value: number;
    qualityClass: QualityClass;
  };
  // Soluble sodium percentage
  ssp: {
    value: number;
    qualityClass: QualityClass;
  };
  // Stebler's alkaline characteristics
  steblerK: {
    value: number;
    qualityClass: QualityClass;
  };
  // Sodium adsorption ratio
  sar: {
    value: number;
    qualityClass: QualityClass;
  };
  // Coefficient of ion exchange
  cie: {
    value: number;
    qualityClass: QualityClass;
  };
  // Residual sodium carbonate
  rsc: {
    value: number;
    qualityClass: QualityClass;
  };
  // Kelly's ratio
  kellyRatio: {
    value: number;
    qualityClass: QualityClass;
  };
  // Magnesium ratio
  magnesiumRatio: {
    value: number;
    qualityClass: QualityClass;
  };
  // Water permeability index
  permeabilityIndex: {
    value: number;
    qualityClass: QualityClass;
  };
  // Corrosion ratio
  corrosionRatio: {
    value: number;
    qualityClass: QualityClass;
  };
  // Aidarov-Golovatov coefficient
  agc: {
    value: number;
    qualityClass: QualityClass;
  };
  // Thermodynamic coefficients
  thermodynamic: {
    solubilityProduct: number;
    ionActivity: number;
    qualityClass: QualityClass;
  };
}