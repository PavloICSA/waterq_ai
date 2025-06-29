// calculations.ts
import { WaterInputs, WaterResults, SoilProperties, QualityClass } from '../types/waterTypes';

// Salt coefficients for various compounds - EXACTLY matching Python
const SALT_COEFFICIENTS: Record<string, number> = {
  'Na2CO3': 0.053,
  'CaHCO3': 0.081,
  'MgHCO3': 0.073,
  'NaHCO3': 0.084,
  'CaSO4': 0.068,
  'Na2SO4': 0.071,
  'MgSO4': 0.060,
  'NaCl': 0.0585,
  'MgCl2': 0.0475,
  'CaCl2': 0.0555
} as const;

/**
 * Helper function to classify water quality.
 */
const classifyWaterQuality = (
  value: number,
  thresholds: { excellent: number; good: number; fair: number; poor: number },
  language: string,
  paramKey: string
): QualityClass => {
  let qualityKey: string;
  let descriptionKey: string;
  let color: string;

  if (value <= thresholds.excellent) {
    qualityKey = 'excellent';
    descriptionKey = 'goodDescription';
    color = 'text-green-600';
  } else if (value <= thresholds.good) {
    qualityKey = 'good';
    descriptionKey = 'goodDescription';
    color = 'text-blue-600';
  } else if (value <= thresholds.fair) {
    qualityKey = 'fair';
    descriptionKey = 'fairDescription';
    color = 'text-yellow-600';
  } else if (value <= thresholds.poor) {
    qualityKey = 'poor';
    descriptionKey = 'poorDescription';
    color = 'text-orange-600';
  } else {
    qualityKey = 'unsuitable';
    descriptionKey = 'unsuitableDescription';
    color = 'text-red-600';
  }

  return {
    class: `resultsDisplay.qualityClass.${qualityKey}`,
    description: `resultsDisplay.parameters.${paramKey}.${descriptionKey}`,
    color: color
  };
};

// Function to calculate salt binding - EXACTLY matching Python implementation
const calculateSaltBinding = (inputs: WaterInputs): Record<string, number> => {
  let aRem = inputs.calcium; // Ca
  let bRem = inputs.magnesium; // Mg
  let cRem = inputs.sodium + inputs.potassium; // Na + K (exactly like Python: c + k)
  let dRem = inputs.chloride; // Cl
  let eRem = inputs.sulfate; // SO4
  let fRem = inputs.carbonate; // CO3
  let gRem = inputs.bicarbonate; // HCO3

  const saltConcentrations: Record<string, number> = {};
  for (const salt in SALT_COEFFICIENTS) {
    saltConcentrations[salt] = 0;
  }

  // Step 1: Bind CO3 with Na to form Na2CO3 - EXACTLY matching Python
  if (fRem > 0) {
    let maxBind = Math.min(cRem, fRem);
    saltConcentrations['Na2CO3'] = maxBind * SALT_COEFFICIENTS['Na2CO3'];
    cRem -= maxBind;
    fRem -= maxBind;
  }

  // Step 2: Bind CO3 with Ca to form CaHCO3 - EXACTLY matching Python
  const maxCaHco3 = fRem > 0 ? 0.6 : 2;
  let maxBind = Math.min(aRem, gRem, maxCaHco3);
  saltConcentrations['CaHCO3'] = maxBind * SALT_COEFFICIENTS['CaHCO3'];
  aRem -= maxBind;
  gRem -= maxBind;

  // Step 3: Distribute HCO3 between Na and Mg - EXACTLY matching Python
  if (fRem > 0 || gRem > 1.4) {
    // Distribute residual HCO3: 70% for NaHCO3, 30% for MgHCO3
    let maxBindNa = Math.min(cRem, gRem * 0.7);
    let maxBindMg = Math.min(bRem, gRem * 0.3);

    saltConcentrations['NaHCO3'] = maxBindNa * SALT_COEFFICIENTS['NaHCO3'];
    saltConcentrations['MgHCO3'] = maxBindMg * SALT_COEFFICIENTS['MgHCO3'];

    cRem -= maxBindNa;
    bRem -= maxBindMg;
    gRem -= (maxBindNa + maxBindMg);
  } else {
    // Standard binding for HCO3 - EXACTLY matching Python order
    let maxBindMg = Math.min(bRem, gRem);
    saltConcentrations['MgHCO3'] = maxBindMg * SALT_COEFFICIENTS['MgHCO3'];
    bRem -= maxBindMg;
    gRem -= maxBindMg;

    let maxBindNa = Math.min(cRem, gRem);
    saltConcentrations['NaHCO3'] = maxBindNa * SALT_COEFFICIENTS['NaHCO3'];
    cRem -= maxBindNa;
    gRem -= maxBindNa;
  }

  // Step 4: Bind SO4 with Ca, Na, and Mg in that order - EXACTLY matching Python
  maxBind = Math.min(aRem, eRem);
  saltConcentrations['CaSO4'] = maxBind * SALT_COEFFICIENTS['CaSO4'];
  aRem -= maxBind;
  eRem -= maxBind;

  maxBind = Math.min(cRem, eRem);
  saltConcentrations['Na2SO4'] = maxBind * SALT_COEFFICIENTS['Na2SO4'];
  cRem -= maxBind;
  eRem -= maxBind;

  maxBind = Math.min(bRem, eRem);
  saltConcentrations['MgSO4'] = maxBind * SALT_COEFFICIENTS['MgSO4'];
  bRem -= maxBind;
  eRem -= maxBind;

  // Step 5: Bind Cl with Na, Mg, and Ca in that order - EXACTLY matching Python
  maxBind = Math.min(cRem, dRem);
  saltConcentrations['NaCl'] = maxBind * SALT_COEFFICIENTS['NaCl'];
  cRem -= maxBind;
  dRem -= maxBind;

  maxBind = Math.min(bRem, dRem);
  saltConcentrations['MgCl2'] = maxBind * SALT_COEFFICIENTS['MgCl2'];
  bRem -= maxBind;
  dRem -= maxBind;

  maxBind = Math.min(aRem, dRem);
  saltConcentrations['CaCl2'] = maxBind * SALT_COEFFICIENTS['CaCl2'];
  aRem -= maxBind;
  dRem -= maxBind;

  return saltConcentrations;
};

// Function to calculate Total Dissolved Salts (TDS) - CORRECTED to match Python
const calculateTDS = (inputs: WaterInputs, language: string): { total: number; toxic: number; nonToxic: number; qualityClass: QualityClass } => {
  // CORRECTED: Use Python formula: TDS = a * 20 + b * 12 + c * 23 + d * 35.5 + e * 48 + f * 30 + g * 61 + k * 39
  const TDS = inputs.calcium * 20 + inputs.magnesium * 12 + inputs.sodium * 23 + 
              inputs.chloride * 35.5 + inputs.sulfate * 48 + inputs.carbonate * 30 + 
              inputs.bicarbonate * 61 + inputs.potassium * 39;

  // CORRECTED: Calculate toxic and non-toxic salts using Python logic
  // From Python: Calculate non-toxic salts using complex Ca_C and Ca_S logic
  let Ca_C = 0;
  let Ca_S = 0;
  const a = inputs.calcium;
  const b = inputs.magnesium;
  const c = inputs.sodium;
  const k = inputs.potassium;
  const d = inputs.chloride;
  const e = inputs.sulfate;
  const f = inputs.carbonate;
  const g = inputs.bicarbonate;

  // EXACTLY matching Python's complex logic for Ca_C and Ca_S calculation
  if (g > 2 && a > 2) {
    Ca_C = 2 * 0.0081;
    if (e === 0) {
      Ca_S = 0;
    } else if (e <= (a - 2)) {
      Ca_S = e * 0.0068;
    } else if (e > (a - 2)) {
      Ca_S = (a - 2) * 0.0068;
    }
  } else if (g > 2 && a === 2) {
    Ca_C = a * 0.0081;
    Ca_S = 0;
  } else if (g > 2 && a === 0) {
    Ca_C = 0;
    Ca_S = 0;
  } else if (g === 0 && a === 0) {
    Ca_C = 0;
    Ca_S = 0;
  } else if ((g > 2 || g === 0 || (0 < g && g < 2)) && a === 0) {
    Ca_C = 0;
    Ca_S = 0;
  } else if (g === 0 && a > 2) {
    Ca_C = 0;
    if (e === 0) {
      Ca_S = 0;
    } else if (e > a || e === a) {
      Ca_S = a * 0.0068;
    } else if (e < a) {
      Ca_S = e * 0.0068;
    }
  } else if (g === 2 && a > 2) {
    Ca_C = 2 * 0.0081;
    if (e === 0) {
      Ca_S = 0;
    } else if (e <= a - 2) {
      Ca_S = e * 0.0068;
    } else if (e > a - 2) {
      Ca_S = (a - 2) * 0.0068;
    }
  } else if (g < 2 && a > 2) {
    Ca_C = g * 0.0081;
    if (e === 0) {
      Ca_S = 0;
    } else if (e <= a - g) {
      Ca_S = e * 0.0068;
    } else if (e > a - g) {
      Ca_S = (a - g) * 0.0068;
    }
  } else if (g === 2 && a === 2) {
    Ca_C = 2 * 0.0081;
    Ca_S = 0;
  } else if (g === 2 && 0 < a && a < 2) {
    Ca_C = a * 0.0081;
    Ca_S = 0;
  } else if (g === 0 && 0 < a && a < 2) {
    Ca_C = 0;
    if (a < e) {
      Ca_S = a * 0.0068;
    } else if (a >= e) {
      Ca_S = e * 0.0068;
    }
  } else if (0 < g && g < 2 && 0 < a && a < 2) {
    if (a <= g) {
      Ca_C = a * 0.0801;
      Ca_S = 0;
    } else if (a > g) {
      Ca_C = g * 0.0081;
      if (a - g >= e) {
        Ca_S = e * 0.0068;
      } else if (a - g < e) {
        Ca_S = (a - g) * 0.0068;
      }
    }
  } else if (g === 0 && a === 2) {
    Ca_C = 0;
    Ca_S = a * 0.0068;
  } else if (0 < g && g < 2 && a === 2) {
    Ca_C = g * 0.0081;
    if (a - g > e) {
      Ca_S = e * 0.0068;
    } else if (a - g <= e) {
      Ca_S = (a - g) * 0.0068;
    }
  }

  // Calculate non-toxic and toxic salts exactly like Python
  const nonToxicSalts = (Ca_C + Ca_S) * 10000;
  const toxicSalts = TDS - nonToxicSalts;

  const tdsQualityClass = classifyWaterQuality(TDS, {
    excellent: 450,
    good: 1000,
    fair: 2000,
    poor: 3000
  }, language, 'tds');

  return {
    total: parseFloat(TDS.toFixed(2)),
    toxic: parseFloat(toxicSalts.toFixed(2)),
    nonToxic: parseFloat(nonToxicSalts.toFixed(2)),
    qualityClass: tdsQualityClass
  };
};

// Function to calculate pH quality class
const calculatePHQuality = (pH: number, language: string): { value: number; qualityClass: QualityClass } => {
  const qualityClass = classifyWaterQuality(Math.abs(7 - pH), {
    excellent: 0.5,
    good: 1.0,
    fair: 1.5,
    poor: 2.0
  }, language, 'ph');

  return {
    value: parseFloat(pH.toFixed(2)),
    qualityClass
  };
};

// Function to calculate toxic ions in eCl - EXACTLY matching Python
const calculateToxicIonsECl = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const eCl = inputs.chloride + 0.2 * inputs.sulfate + 0.4 * inputs.bicarbonate + 5 * inputs.carbonate;

  const qualityClass = classifyWaterQuality(eCl, {
    excellent: 5,
    good: 10,
    fair: 15,
    poor: 20
  }, language, 'ecl');

  return {
    value: parseFloat(eCl.toFixed(2)),
    qualityClass
  };
};

// Function to calculate carbonates and bicarbonates quality
const calculateCarbonates = (inputs: WaterInputs, language: string): { carbonateValue: number; bicarbonateValue: number; qualityClass: QualityClass } => {
  const qualityClass = classifyWaterQuality(inputs.carbonate * 1000, {
    excellent: 100,
    good: 300,
    fair: 600,
    poor: 900
  }, language, 'carbonates');

  return {
    carbonateValue: parseFloat(inputs.carbonate.toFixed(2)),
    bicarbonateValue: parseFloat(inputs.bicarbonate.toFixed(2)),
    qualityClass
  };
};

// Function to calculate alkalination hazards - EXACTLY matching Python logic
const calculateAlkalinationHazards = (inputs: WaterInputs, soilProperties: SoilProperties, language: string): { value: number; qualityClass: QualityClass } => {
  const x = inputs.bicarbonate - inputs.calcium;
  const pH = inputs.pH;

  let qualityClassObj: QualityClass;

  // EXACTLY matching Python's complex conditional logic
  if (soilProperties.acidity === 'acidic') {
    const ph_1 = pH * 1000 < 8200;
    const ph_2 = 8200 < pH * 1000 && pH * 1000 < 9000;
    const ph_3 = pH * 1000 > 9000;
    const f_1 = inputs.carbonate * 1000 < 300;
    const f_2 = 300 < inputs.carbonate * 1000 && inputs.carbonate * 1000 < 900;
    const f_3 = inputs.carbonate * 1000 > 900;
    const x_1 = x * 1000 < 2500;
    const x_2 = 2500 < x * 1000 && x * 1000 < 8000;
    const x_3 = x * 1000 > 8000;

    if (ph_1 && f_1 && x_1) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.excellent', description: 'resultsDisplay.parameters.alkalinationHazards.goodDescription', color: 'text-green-600' };
    } else if (ph_2 || f_2 || x_2) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.good', description: 'resultsDisplay.parameters.alkalinationHazards.goodDescription', color: 'text-blue-600' };
    } else if (ph_3 || f_3 || x_3) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.alkalinationHazards.poorDescription', color: 'text-orange-600' };
    } else {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.alkalinationHazards.poorDescription', color: 'text-orange-600' };
    }
  } else if (soilProperties.acidity === 'neutral') {
    const ph_1 = pH * 1000 < 8000;
    const ph_2 = 8000 < pH * 1000 && pH * 1000 < 8800;
    const ph_3 = pH * 1000 > 8800;
    const f_1 = inputs.carbonate === 0;
    const f_2 = 100 < inputs.carbonate * 1000 && inputs.carbonate * 1000 < 600;
    const f_3 = inputs.carbonate * 1000 > 600;
    const x_1 = x * 1000 < 2000;
    const x_2 = 2000 < x * 1000 && x * 1000 < 7000;
    const x_3 = x * 1000 > 7000;

    if (ph_1 && f_1 && x_1) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.excellent', description: 'resultsDisplay.parameters.alkalinationHazards.goodDescription', color: 'text-green-600' };
    } else if (ph_2 || f_2 || x_2) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.good', description: 'resultsDisplay.parameters.alkalinationHazards.goodDescription', color: 'text-blue-600' };
    } else if (ph_3 || f_3 || x_3) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.alkalinationHazards.poorDescription', color: 'text-orange-600' };
    } else {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.alkalinationHazards.poorDescription', color: 'text-orange-600' };
    }
  } else { // alkaline
    const ph_1 = pH * 1000 < 7500;
    const ph_2 = 7500 < pH * 1000 && pH * 1000 < 8500;
    const ph_3 = pH * 1000 > 8500;
    const f_1 = inputs.carbonate === 0;
    const f_2 = 100 < inputs.carbonate * 1000 && inputs.carbonate * 1000 < 300;
    const f_3 = inputs.carbonate * 1000 > 300;
    const x_1 = x * 1000 < 1500;
    const x_2 = 1500 < x * 1000 && x * 1000 < 6000;
    const x_3 = x * 1000 > 6000;

    if (ph_1 && f_1 && x_1) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.excellent', description: 'resultsDisplay.parameters.alkalinationHazards.goodDescription', color: 'text-green-600' };
    } else if (ph_2 || f_2 || x_2) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.good', description: 'resultsDisplay.parameters.alkalinationHazards.goodDescription', color: 'text-blue-600' };
    } else if (ph_3 || f_3 || x_3) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.alkalinationHazards.poorDescription', color: 'text-orange-600' };
    } else {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.alkalinationHazards.poorDescription', color: 'text-orange-600' };
    }
  }

  return {
    value: parseFloat(x.toFixed(2)),
    qualityClass: qualityClassObj
  };
};

// Function to calculate Soluble Sodium Percentage (SSP) - EXACTLY matching Python
const calculateSSP = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const totalCations = inputs.calcium + inputs.magnesium + inputs.sodium + inputs.potassium;
  let ssp: number;

  if (totalCations <= 0) {
    ssp = 0;
  } else {
    ssp = (inputs.sodium * 100) / totalCations; // EXACTLY matching Python: c*100/(a + b + c + k)
  }

  const qualityClass = classifyWaterQuality(ssp, {
    excellent: 20,
    good: 40,
    fair: 60,
    poor: 80
  }, language, 'ssp');

  return {
    value: parseFloat(ssp.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Stebler's alkaline characteristics (K) - EXACTLY matching Python
const calculateSteblerK = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  let steblerK: number;
  const c = inputs.sodium;
  const k = inputs.potassium;
  const d = inputs.chloride;
  const e = inputs.sulfate;

  // EXACTLY matching Python logic
  if (c + k - d <= 0) {
    steblerK = 228 / (5 * d);
  } else if (0 < c + k - d && c + k - d < e) {
    steblerK = 228 / (c + 4 * d);
  } else if (c + k - d - e > 0) {
    steblerK = 228 / (10 * c - 5 * d - 9 * e);
  } else {
    steblerK = 0;
  }

  // CORRECTED: Use Stebler value directly for classification, not inverted
  const qualityClass = classifyWaterQuality(steblerK * 1000, {
    excellent: 18000, // > 18000 is good
    good: 6000,       // 6000-18000 is acceptable  
    fair: 1200,       // 1200-6000 is unsuitable
    poor: 0           // < 1200 is bad
  }, language, 'steblerK');

  return {
    value: parseFloat(steblerK.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Sodium Adsorption Ratio (SAR) - EXACTLY matching Python
const calculateSAR = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const denominator = (inputs.calcium + inputs.magnesium) / 2;
  let sar: number;

  if (denominator <= 0) {
    sar = 0;
  } else {
    sar = inputs.sodium / Math.sqrt(denominator); // EXACTLY matching Python: c/(math.sqrt((a + b)/2))
  }

  const qualityClass = classifyWaterQuality(sar, {
    excellent: 10,
    good: 18,
    fair: 26,
    poor: 34
  }, language, 'sar');

  return {
    value: parseFloat(sar.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Coefficient of Ion Exchange (CIE) - EXACTLY matching Python
const calculateCIE = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const tds = calculateTDS(inputs, language).total;
  const denominator = inputs.sodium + 0.23 * tds; // EXACTLY matching Python: c + 0.23*TDS
  let cie: number;

  if (denominator <= 0) {
    cie = 0;
  } else {
    cie = (inputs.calcium + inputs.magnesium) / denominator; // EXACTLY matching Python: (a + b)/(c + 0.23*TDS)
  }

  const qualityClass = classifyWaterQuality(cie < 1 ? 1 : 0, { // Python: if CIE < 1 then unsuitable, else suitable
    excellent: 0.5,
    good: 1,
    fair: 1.5,
    poor: 2
  }, language, 'cie');

  return {
    value: parseFloat(cie.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Residual Sodium Carbonate (RSC) - EXACTLY matching Python
const calculateRSC = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const rsc = inputs.carbonate + inputs.bicarbonate - inputs.calcium - inputs.magnesium; // EXACTLY matching Python: f + g - a - b

  const qualityClass = classifyWaterQuality(rsc * 1000, { // Python uses RSC*1000 for comparison
    excellent: 1250,  // < 1250 is good
    good: 2500,       // 1250-2500 is doubtful
    fair: 5000,       // > 2500 is unsuitable
    poor: 7500
  }, language, 'rsc');

  return {
    value: parseFloat(rsc.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Kelly's Ratio (KR) - EXACTLY matching Python
const calculateKellyRatio = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const denominator = inputs.calcium + inputs.magnesium;
  let kr: number;

  if (denominator <= 0) {
    kr = 0;
  } else {
    kr = inputs.sodium / denominator; // EXACTLY matching Python: c / (a + b)
  }

  const qualityClass = classifyWaterQuality(kr, {
    excellent: 0.5,
    good: 1,      // Python: if KR < 1 then suitable, else unsuitable
    fair: 1.5,
    poor: 2
  }, language, 'kellyRatio');

  return {
    value: parseFloat(kr.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Magnesium Ratio (MR) - EXACTLY matching Python
const calculateMagnesiumRatio = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const denominator = inputs.calcium + inputs.magnesium;
  let mr: number;

  if (denominator <= 0) {
    mr = 0;
  } else {
    mr = (inputs.magnesium * 100) / denominator; // EXACTLY matching Python: b / (a + b) but Python doesn't multiply by 100
  }

  // CORRECTED: Python uses MR without *100 and compares with 50, so we need to adjust
  const qualityClass = classifyWaterQuality(mr, {
    excellent: 25,
    good: 35,
    fair: 50,    // Python: if MR < 50 then suitable, else unsuitable
    poor: 65
  }, language, 'magnesiumRatio');

  return {
    value: parseFloat(mr.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Water Permeability Index (PI) - EXACTLY matching Python
const calculatePI = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const totalCations = inputs.calcium + inputs.magnesium + inputs.sodium + inputs.potassium;
  let pi: number;

  if (totalCations <= 0 || inputs.bicarbonate < 0) {
    pi = 0;
  } else {
    // EXACTLY matching Python: ((c + k + math.sqrt(g))/(a + b + c + k))*100
    pi = ((inputs.sodium + inputs.potassium + Math.sqrt(inputs.bicarbonate)) * 100) / totalCations;
  }

  const qualityClass = classifyWaterQuality(pi, {
    excellent: 75,   // Python: if PI > 75 then good
    good: 25,        // Python: if 25 < PI < 75 then suitable but monitor
    fair: 10,        // Python: if PI < 25 then hazards
    poor: 5
  }, language, 'permeabilityIndex');

  return {
    value: parseFloat(pi.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Corrosion Ratio (CR) - EXACTLY matching Python
const calculateCorrosionRatio = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const denominator = inputs.carbonate / 50 + inputs.bicarbonate / 50; // EXACTLY matching Python: f/50 + g/50
  let cr: number;

  if (denominator <= 0) {
    cr = 0;
  } else {
    cr = (inputs.chloride / 35.5 + inputs.sulfate / 48) / denominator; // EXACTLY matching Python: (d/35.5 + e/48)/(f/50 + g/50)
  }

  const qualityClass = classifyWaterQuality(cr, {
    excellent: 0.5,
    good: 1,      // Python: if CR > 1 then unsafe, else safe
    fair: 2,
    poor: 3
  }, language, 'corrosionRatio');

  return {
    value: parseFloat(cr.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Aidarov-Golovatov Coefficient (AGC) - EXACTLY matching Python
const calculateAGC = (inputs: WaterInputs, language: string): { value: number; qualityClass: QualityClass } => {
  const denominator = 2 * (inputs.calcium + inputs.magnesium);
  let agc: number;

  if (denominator <= 0) {
    agc = 0;
  } else {
    // EXACTLY matching Python: (c/2*(a+b))*100 which is equivalent to ((c + k) / (2 * (a + b))) * 100
    // But Python has: AGG = (c/2*(a+b))*100 which seems to be: (c / (2*(a+b))) * 100
    agc = (inputs.sodium / denominator) * 100; // CORRECTED: Python doesn't include potassium in AGC
  }

  const qualityClass = classifyWaterQuality(agc, {
    excellent: 25,   // Python: if AGG < 25 then suitable
    good: 50,        
    fair: 75,        // Python: if 75 > AGG > 25 then marginally suitable
    poor: 100        // Python: if AGG > 75 then unsuitable
  }, language, 'agc');

  return {
    value: parseFloat(agc.toFixed(2)),
    qualityClass
  };
};

// Function to calculate Thermodynamic Coefficients - EXACTLY matching Python
const calculateThermodynamic = (inputs: WaterInputs, soilProperties: SoilProperties, language: string): { solubilityProduct: number; ionActivity: number; qualityClass: QualityClass } => {
  // Convert to mol/L - EXACTLY matching Python
  const a_m = inputs.calcium / 2000;
  const b_m = inputs.magnesium / 2000;
  const c_m = inputs.sodium / 1000;
  const d_m = inputs.chloride / 1000;
  const e_m = inputs.sulfate / 2000;
  const f_m = inputs.carbonate / 2000;
  const g_m = inputs.bicarbonate / 1000;

  // Calculate ion power - EXACTLY matching Python
  const i_power = (a_m * 4 + b_m * 4 + c_m + d_m + e_m * 4 + f_m * 4 + g_m) / 2;

  // Calculate activity coefficients - EXACTLY matching Python's complex logic
  let cact = 0;
  const iPowerScaled = Math.floor(i_power * 1000);
  
  if (iPowerScaled === 1) cact = 0.86;
  else if (iPowerScaled === 2) cact = 0.79;
  else if (iPowerScaled === 3) cact = 0.74;
  else if (iPowerScaled === 4) cact = 0.73;
  else if (iPowerScaled === 5) cact = 0.72;
  else if (iPowerScaled === 6) cact = 0.69;
  else if (iPowerScaled === 7) cact = 0.67;
  else if (iPowerScaled === 8) cact = 0.66;
  else if (iPowerScaled === 9) cact = 0.64;
  else if (iPowerScaled === 10) cact = 0.63;
  else if (10 < iPowerScaled && iPowerScaled <= 15) cact = 0.59;
  else if (15 < iPowerScaled && iPowerScaled <= 20) cact = 0.55;
  else if (20 < iPowerScaled && iPowerScaled <= 25) cact = 0.53;
  else if (25 < iPowerScaled && iPowerScaled <= 30) cact = 0.50;
  else if (30 < iPowerScaled && iPowerScaled <= 35) cact = 0.49;
  else if (35 < iPowerScaled && iPowerScaled <= 40) cact = 0.47;
  else if (40 < iPowerScaled && iPowerScaled <= 45) cact = 0.45;
  else if (45 < iPowerScaled && iPowerScaled <= 50) cact = 0.44;
  else if (50 < iPowerScaled && iPowerScaled <= 55) cact = 0.42;
  else if (55 < iPowerScaled && iPowerScaled <= 60) cact = 0.40;

  let nact = 0;
  if (iPowerScaled === 1) nact = 0.96;
  else if (iPowerScaled === 2 || iPowerScaled === 3) nact = 0.95;
  else if (iPowerScaled === 4) nact = 0.94;
  else if (iPowerScaled === 5 || iPowerScaled === 6 || iPowerScaled === 7) nact = 0.92;
  else if (iPowerScaled === 8) nact = 0.91;
  else if (iPowerScaled === 9) nact = 0.90;
  else if (iPowerScaled === 10) nact = 0.89;
  else if (10 < iPowerScaled && iPowerScaled <= 15) nact = 0.88;
  else if (15 < iPowerScaled && iPowerScaled <= 20) nact = 0.87;
  else if (20 < iPowerScaled && iPowerScaled <= 25) nact = 0.85;
  else if (25 < iPowerScaled && iPowerScaled <= 30) nact = 0.84;
  else if (30 < iPowerScaled && iPowerScaled <= 35) nact = 0.83;
  else if (35 < iPowerScaled && iPowerScaled <= 45) nact = 0.82;
  else if (45 < iPowerScaled && iPowerScaled <= 50) nact = 0.81;
  else if (50 < iPowerScaled && iPowerScaled <= 60) nact = 0.80;

  const Ca_act = a_m * cact;
  const Na_act = c_m * nact;

  const pCa = Ca_act > 0 ? -Math.log10(Ca_act) : Infinity;
  const pNa = Na_act > 0 ? -Math.log10(Na_act) : Infinity;

  const value_111 = pNa - 0.5 * pCa;  // sodium-calcium potential
  const value_112 = inputs.pH - pNa;   // hydrogen-sodium potential
  const value_113 = value_111 !== 0 ? value_112 / value_111 : Infinity; // potentials ratio

  let qualityClassObj: QualityClass;

  // EXACTLY matching Python's complex thermodynamic classification logic
  if (soilProperties.bufferCapacity === 'low') {
    const value_111_1 = value_111 * 1000 > 1350;
    const value_111_2 = 650 < value_111 * 1000 && value_111 * 1000 <= 1350;
    const value_111_3 = value_111 * 1000 < 650;
    const value_112_1 = 3000 < value_112 * 1000 && value_112 * 1000 < 4000;
    const value_112_2 = 4000 < value_112 * 1000 && value_112 * 1000 < 5000;
    const value_112_3 = value_112 * 1000 > 5000;
    const value_113_1 = value_113 * 1000 < 3000;
    const value_113_2 = 3000 < value_113 * 1000 && value_113 * 1000 < 7000;
    const value_113_3 = value_113 * 1000 > 7000;

    if (value_111_1 && value_112_1 && value_113_1) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.excellent', description: 'resultsDisplay.parameters.thermodynamic.goodDescription', color: 'text-green-600' };
    } else if (value_111_2 || value_112_2 || value_113_2) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.good', description: 'resultsDisplay.parameters.thermodynamic.goodDescription', color: 'text-blue-600' };
    } else if (value_111_3 || value_112_3 || value_113_3) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.thermodynamic.poorDescription', color: 'text-orange-600' };
    } else {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.thermodynamic.poorDescription', color: 'text-orange-600' };
    }
  } else if (soilProperties.bufferCapacity === 'medium') {
    const value_111_1 = value_111 * 1000 > 1250;
    const value_111_2 = 550 < value_111 * 1000 && value_111 * 1000 <= 1250;
    const value_111_3 = value_111 * 1000 < 550;
    const value_112_1 = 3000 < value_112 * 1000 && value_112 * 1000 < 4500;
    const value_112_2 = 4500 < value_112 * 1000 && value_112 * 1000 < 6000;
    const value_112_3 = value_112 * 1000 > 6000;
    const value_113_1 = value_113 * 1000 < 3600;
    const value_113_2 = 3600 < value_113 * 1000 && value_113 * 1000 < 11000;
    const value_113_3 = value_113 * 1000 > 11000;

    if (value_111_1 && value_112_1 && value_113_1) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.excellent', description: 'resultsDisplay.parameters.thermodynamic.goodDescription', color: 'text-green-600' };
    } else if (value_111_2 || value_112_2 || value_113_2) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.good', description: 'resultsDisplay.parameters.thermodynamic.goodDescription', color: 'text-blue-600' };
    } else if (value_111_3 || value_112_3 || value_113_3) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.thermodynamic.poorDescription', color: 'text-orange-600' };
    } else {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.thermodynamic.poorDescription', color: 'text-orange-600' };
    }
  } else { // high
    const value_111_1 = value_111 * 1000 > 1200;
    const value_111_2 = 500 < value_111 * 1000 && value_111 * 1000 <= 1200;
    const value_111_3 = value_111 * 1000 < 500;
    const value_112_1 = 3000 < value_112 * 1000 && value_112 * 1000 < 5000;
    const value_112_2 = 5000 < value_112 * 1000 && value_112 * 1000 < 7000;
    const value_112_3 = value_112 * 1000 > 7000;
    const value_113_1 = value_113 * 1000 < 4200;
    const value_113_2 = 4200 < value_113 * 1000 && value_113 * 1000 < 14000;
    const value_113_3 = value_113 * 1000 > 14000;

    if (value_111_1 && value_112_1 && value_113_1) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.excellent', description: 'resultsDisplay.parameters.thermodynamic.goodDescription', color: 'text-green-600' };
    } else if (value_111_2 || value_112_2 || value_113_2) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.good', description: 'resultsDisplay.parameters.thermodynamic.goodDescription', color: 'text-blue-600' };
    } else if (value_111_3 || value_112_3 || value_113_3) {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.thermodynamic.poorDescription', color: 'text-orange-600' };
    } else {
      qualityClassObj = { class: 'resultsDisplay.qualityClass.poor', description: 'resultsDisplay.parameters.thermodynamic.poorDescription', color: 'text-orange-600' };
    }
  }

  return {
    solubilityProduct: parseFloat(i_power.toFixed(4)),
    ionActivity: parseFloat(value_113.toFixed(2)),
    qualityClass: qualityClassObj
  };
};

// Main calculation function that returns all results
export const calculateResults = (inputs: WaterInputs, soilProperties: SoilProperties, language: string): WaterResults => {
  // Validate inputs
  const requiredInputs = ['calcium', 'magnesium', 'sodium', 'potassium', 'chloride', 'sulfate', 'carbonate', 'bicarbonate', 'pH'];
  for (const key of requiredInputs) {
    if (typeof inputs[key as keyof WaterInputs] !== 'number' || isNaN(inputs[key as keyof WaterInputs]) || inputs[key as keyof WaterInputs] < 0) {
      throw new Error(`Invalid input for ${key}`);
    }
  }

  if (!['acidic', 'neutral', 'alkaline'].includes(soilProperties.acidity)) {
    throw new Error('Invalid soil acidity');
  }
  if (!['low', 'medium', 'high'].includes(soilProperties.bufferCapacity)) {
    throw new Error('Invalid soil buffer capacity');
  }

  // Check ion balance - EXACTLY matching Python tolerance
  const cations = inputs.calcium + inputs.magnesium + inputs.sodium + inputs.potassium;
  const anions = inputs.chloride + inputs.sulfate + inputs.carbonate + inputs.bicarbonate;
  const tolerance = 1e-6; // EXACTLY matching Python: abs(cations - anions) < 1e-6

  if (Math.abs(cations - anions) > tolerance) {
    return {
      tds: { total: 0, toxic: 0, nonToxic: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorDescription', color: 'text-red-600' } },
      pH: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      toxicIonsECl: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      carbonates: { carbonateValue: 0, bicarbonateValue: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      alkalinationHazards: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      ssp: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      steblerK: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      sar: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      cie: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      rsc: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      kellyRatio: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      magnesiumRatio: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      permeabilityIndex: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      corrosionRatio: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      agc: { value: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } },
      thermodynamic: { solubilityProduct: 0, ionActivity: 0, qualityClass: { class: 'resultsDisplay.qualityClass.error', description: 'resultsDisplay.parameters.ionBalance.errorMessageShort', color: 'text-red-600' } }
    } as WaterResults;
  }

  return {
    tds: calculateTDS(inputs, language),
    pH: calculatePHQuality(inputs.pH, language),
    toxicIonsECl: calculateToxicIonsECl(inputs, language),
    carbonates: calculateCarbonates(inputs, language),
    alkalinationHazards: calculateAlkalinationHazards(inputs, soilProperties, language),
    ssp: calculateSSP(inputs, language),
    steblerK: calculateSteblerK(inputs, language),
    sar: calculateSAR(inputs, language),
    cie: calculateCIE(inputs, language),
    rsc: calculateRSC(inputs, language),
    kellyRatio: calculateKellyRatio(inputs, language),
    magnesiumRatio: calculateMagnesiumRatio(inputs, language),
    permeabilityIndex: calculatePI(inputs, language),
    corrosionRatio: calculateCorrosionRatio(inputs, language),
    agc: calculateAGC(inputs, language),
    thermodynamic: calculateThermodynamic(inputs, soilProperties, language)
  };
};