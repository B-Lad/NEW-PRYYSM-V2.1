/**
 * PrintOps — Quote Calculator
 * Deterministic pricing from file metadata + config.
 * Also exposed as POST /api/quote
 */

export type Quality = 'draft' | 'standard' | 'fine' | 'ultra';

export interface QuoteInput {
  /** Estimated volume in cm³ (from STL parser or file-size proxy) */
  volumeCm3:   number;
  material:    string;
  infillPct:   number;   // 10–100
  quality:     Quality;
  setupFeeOverride?: number;
}

export interface QuoteResult {
  total:        number;
  breakdown: {
    setupFee:    number;
    materialCost: number;
    machineCost: number;
  };
  estimatedTimeSeconds: number;
  currency: 'USD';
}

// ── CONSTANTS ────────────────────────────────────────────────
export const SETUP_FEE = 2.50;

export const MATERIAL_RATES: Record<string, number> = {
  'PLA+':              0.030,
  'PETG':              0.040,
  'ABS':               0.035,
  'ASA':               0.045,
  'TPU':               0.060,
  'PEEK':              0.180,
  'Standard Resin':    0.070,
  'ABS-Like Resin':    0.080,
  'Engineering Resin': 0.120,
};

export const QUALITY_MULTIPLIERS: Record<Quality, number> = {
  draft:    0.80,
  standard: 1.00,
  fine:     1.30,
  ultra:    1.60,
};

// ── CALCULATOR ───────────────────────────────────────────────
export function calculateQuote(input: QuoteInput): QuoteResult {
  const { volumeCm3, material, infillPct, quality, setupFeeOverride } = input;

  const matRate    = MATERIAL_RATES[material] ?? 0.05;
  const qualMul    = QUALITY_MULTIPLIERS[quality] ?? 1.0;
  const infillFact = 0.5 + (infillPct / 100) * 0.8;   // Range: 0.58 (10%) – 1.30 (100%)

  const setupFee    = setupFeeOverride ?? SETUP_FEE;
  const materialCost = +(volumeCm3 * matRate * infillFact).toFixed(4);
  const machineCost  = +(volumeCm3 * 0.025 * qualMul).toFixed(4);
  const total        = +(setupFee + materialCost + machineCost).toFixed(2);

  // Time estimate: base 1.2 min/cm³, scaled by quality and infill
  const estimatedTimeSeconds = Math.round(volumeCm3 * 1.2 * qualMul * infillFact * 60);

  return {
    total,
    breakdown: { setupFee, materialCost, machineCost },
    estimatedTimeSeconds,
    currency: 'USD',
  };
}

// ── STL VOLUME PROXY (client-side, from file size) ───────────
/**
 * Returns a rough volume estimate from an STL file.
 * For a real implementation, use `@jscad/stl-deserializer`
 * to parse actual geometry.
 */
export function estimateVolumeFromFile(file: File): number {
  // Binary STL: each triangle = 50 bytes → rough volume proxy
  const triangleCount = Math.max(1, (file.size - 84) / 50);
  const roughVolumeM3 = triangleCount * 0.0001;   // crude heuristic
  return Math.max(1, Math.min(roughVolumeM3 * 1000, 500));  // clamp 1–500 cm³
}
