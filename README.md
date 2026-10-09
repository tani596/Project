# Rice-field Methane & Yield Advisor

Practical, stage-aware field advice to cut rice paddy methane emissions while keeping crop yields steady. Designed for rice growers, agricultural extension workers, and agronomists.

## What The Application Does

Continuous submergence in flooded rice paddies creates anaerobic soil conditions where methanogenic bacteria flourish, contributing an estimated 10-12% of agricultural greenhouse gas emissions. While Alternate Wetting and Drying (AWD) is proven to cut methane by 30-50%, growers are cautious because improper water drainage during critical crop stages (such as flowering/anthesis) can induce severe spikelet sterility and yield loss.

The **Rice-field Methane & Yield Advisor** bridges this gap:
- **Agronomic Rule Engine**: Pure deterministic calculations evaluate crop growth stage, field water condition, and leaf canopy nitrogen status against research-backed agronomic guidelines (IRRI & ICAR).
- **AI Field Advisor Agent**: Formulates clear, stage-specific actions, calculates trade-offs, and provides actionable weekly steps while preventing yield risk.
- **Scenario Contrast**: Allows side-by-side comparison of current water practices versus AWD.
- **Action Checklist & History**: Ticks off field steps and saves paddies for season reviews.
- **Bilingual**: Complete English and Hindi (हिंदी) language support.

## Honesty & Data Sources Note

- **No Satellite Imagery**: The aerial view is an illustrative agricultural drone visual asset, not a live satellite feed.
- **No Live IoT Sensor Telemetry**: All field values are grower-entered or sample data from the preloaded Karnal paddy.
- **Not a Replacement for an Agronomist**: Always confirm field adjustments with your local Krishi Vigyan Kendra (KVK) or extension officer.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server (serves frontend and backend concurrently on port 3000):
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run unit tests on the rule engine:
   ```bash
   npm run test
   ```

## Security

All AI calls run server-side only. API keys are accessed via `process.env.GEMINI_API_KEY` on the server and are never exposed to browser bundles.
