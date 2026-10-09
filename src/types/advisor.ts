export type GrowthStage =
  | 'nursery'
  | 'transplanting'
  | 'tillering'
  | 'panicle_initiation'
  | 'flowering'
  | 'grain_filling'
  | 'maturity';

export type WaterCondition =
  | 'continuously_flooded'
  | 'alternate_wetting_drying'
  | 'saturated'
  | 'drained'
  | 'drought_stressed';

export type LeafColor =
  | 'healthy_green'
  | 'mild_yellowing'
  | 'severe_yellowing'
  | 'dark_green'
  | 'brown_spots';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface FieldInputs {
  fieldName: string;
  latitude: number | string;
  longitude: number | string;
  growthStage: GrowthStage;
  waterCondition: WaterCondition;
  leafColor: LeafColor;
  lastUreaDose?: number | string;
  notes?: string;
  language?: 'en' | 'hi';
}

export interface RuleEngineResult {
  methane_risk: RiskLevel;
  yield_risk: RiskLevel;
  confidence: RiskLevel;
  rules_applied: string[];
  missing_inputs: string[];
  is_implausible_urea: boolean;
  must_avoid_drying: boolean;
}

export interface AdviceStep {
  priority: 'Do now' | 'Soon' | 'Later';
  timing: string;
  action: string;
  why: string;
}

export interface AgentTraceStep {
  step: string;
  status: 'completed' | 'running' | 'pending';
  description: string;
}

export interface AdviceResult {
  summary: string;
  methane_risk: RiskLevel;
  yield_risk: RiskLevel;
  confidence: RiskLevel;
  top_priority: string;
  steps: AdviceStep[];
  reasoning: string;
  trade_off_notes: string;
  direction_of_change: string;
  verify_locally: string[];
  agent_trace: AgentTraceStep[];
  source: 'ai' | 'rule_fallback';
  simple_summary?: string[];
  generated_at?: string;
}

export interface ScenarioComparison {
  current: {
    waterCondition: WaterCondition;
    methane_risk: RiskLevel;
    yield_risk: RiskLevel;
    rules_applied: string[];
  };
  alternative: {
    waterCondition: WaterCondition;
    methane_risk: RiskLevel;
    yield_risk: RiskLevel;
    rules_applied: string[];
  };
  explanation: string;
}

export interface SavedField {
  id: string;
  user_id: string;
  field_name: string;
  inputs: FieldInputs;
  advice: AdviceResult;
  checklist: Record<number, boolean>;
  followed_advice?: 'yes' | 'partly' | 'no';
  yield_vs_usual?: 'lower' | 'same' | 'higher';
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
}
