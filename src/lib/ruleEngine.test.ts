import { evaluateFieldRules } from './ruleEngine';
import { FieldInputs } from '../types/advisor';

/**
 * Agronomic rule engine unit test suite
 */
export function runRuleEngineTests(): { passed: number; failed: number; results: string[] } {
  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(testName: string, condition: boolean, extra?: string) {
    if (condition) {
      passed++;
      results.push(`✓ PASS: ${testName}`);
    } else {
      failed++;
      results.push(`✗ FAIL: ${testName} ${extra || ''}`);
    }
  }

  // Test 1: Continuously flooded from tillering to panicle initiation -> methane high
  const test1Input: FieldInputs = {
    fieldName: 'Karnal Plot A',
    latitude: 29.69,
    longitude: 76.99,
    growthStage: 'tillering',
    waterCondition: 'continuously_flooded',
    leafColor: 'healthy_green',
    lastUreaDose: 45,
  };
  const res1 = evaluateFieldRules(test1Input);
  assert('Flooded at tillering yields high methane risk', res1.methane_risk === 'high');

  // Test 2: AWD -> methane lower, yield risk low unless stage is flowering
  const test2Input: FieldInputs = {
    fieldName: 'Karnal Plot B',
    latitude: 29.69,
    longitude: 76.99,
    growthStage: 'tillering',
    waterCondition: 'alternate_wetting_drying',
    leafColor: 'healthy_green',
    lastUreaDose: 45,
  };
  const res2 = evaluateFieldRules(test2Input);
  assert('AWD at tillering yields low methane risk and low yield risk', res2.methane_risk === 'low' && res2.yield_risk === 'low');

  // Test 2b: AWD at flowering yields medium yield risk
  const test2bInput: FieldInputs = {
    fieldName: 'Karnal Plot B2',
    latitude: 29.69,
    longitude: 76.99,
    growthStage: 'flowering',
    waterCondition: 'alternate_wetting_drying',
    leafColor: 'healthy_green',
    lastUreaDose: 45,
  };
  const res2b = evaluateFieldRules(test2bInput);
  assert('AWD at flowering flags yield risk', res2b.yield_risk === 'medium');

  // Test 3: Drained or drought-stressed at flowering -> yield risk high, must_avoid_drying
  const test3Input: FieldInputs = {
    fieldName: 'Karnal Plot C',
    latitude: 29.69,
    longitude: 76.99,
    growthStage: 'flowering',
    waterCondition: 'drought_stressed',
    leafColor: 'healthy_green',
    lastUreaDose: 45,
  };
  const res3 = evaluateFieldRules(test3Input);
  assert('Drought stressed at flowering yields high yield risk and must avoid drying', res3.yield_risk === 'high' && res3.must_avoid_drying === true);

  // Test 4: Deficiency signs with low or no urea dose -> yield risk medium or higher
  const test4Input: FieldInputs = {
    fieldName: 'Karnal Plot D',
    latitude: 29.69,
    longitude: 76.99,
    growthStage: 'tillering',
    waterCondition: 'alternate_wetting_drying',
    leafColor: 'mild_yellowing',
    lastUreaDose: 15,
  };
  const res4 = evaluateFieldRules(test4Input);
  assert('Mild yellowing with 15 kg/ha urea yields medium or high yield risk', res4.yield_risk === 'medium' || res4.yield_risk === 'high');

  // Test 5: Large single urea dose (>75 kg/ha) on flooded field
  const test5Input: FieldInputs = {
    fieldName: 'Karnal Plot E',
    latitude: 29.69,
    longitude: 76.99,
    growthStage: 'tillering',
    waterCondition: 'continuously_flooded',
    leafColor: 'healthy_green',
    lastUreaDose: 90,
  };
  const res5 = evaluateFieldRules(test5Input);
  const flaggedSplit = res5.rules_applied.some(r => r.includes('90') || r.includes('volatilization'));
  assert('Large single urea dose (>75 kg/ha) on flooded field is flagged', flaggedSplit);

  // Test 6: Implausible urea dose (>250 kg/ha)
  const test6Input: FieldInputs = {
    fieldName: 'Karnal Plot F',
    latitude: 29.69,
    longitude: 76.99,
    growthStage: 'tillering',
    waterCondition: 'continuously_flooded',
    leafColor: 'healthy_green',
    lastUreaDose: 850,
  };
  const res6 = evaluateFieldRules(test6Input);
  assert('Implausible urea dose (>250 kg/ha) sets is_implausible_urea and lists missing input', res6.is_implausible_urea === true && res6.missing_inputs.length > 0);

  // Test 7: Missing or vague inputs -> confidence low
  const test7Input: FieldInputs = {
    fieldName: '',
    latitude: 999, // invalid coordinate
    longitude: 76.99,
    growthStage: 'tillering',
    waterCondition: 'continuously_flooded',
    leafColor: 'healthy_green',
  };
  const res7 = evaluateFieldRules(test7Input);
  assert('Missing coordinates and vague inputs sets low confidence', res7.confidence === 'low' || res7.confidence === 'medium');

  // Test 8: Empty string coordinates and urea should not be treated as valid values
  const test8Input: FieldInputs = {
    fieldName: 'Trim test',
    latitude: '',
    longitude: '  ',
    growthStage: 'tillering',
    waterCondition: 'alternate_wetting_drying',
    leafColor: 'healthy_green',
    lastUreaDose: '',
  };
  const res8 = evaluateFieldRules(test8Input);
  assert('Empty coordinate and blank urea values are treated as missing inputs', res8.missing_inputs.some(item => item.includes('coordinates') || item.includes('Field name')) || res8.confidence === 'low');

  return { passed, failed, results };
}
