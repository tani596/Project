# AI Field Advisor Agent Architecture & Security Directives

All AI calls run server-side only. The AI key and requests never reach the client. The app does not fetch satellite imagery or live sensor data; all field data is user-entered or clearly labelled example data. Guest mode must always give full access to the advisor with the example field. Saved fields are protected by per-user row-level security.

## Core Directives

1. **Server-Side AI Gateway Only**:
   - The `@google/genai` SDK is instantiated and called strictly within `server.ts`.
   - The browser client interacts via `/api/advisor`, `/api/explain-simply`, and `/api/compare-scenarios`.
   - Keys (`GEMINI_API_KEY`) and headers are never exposed or bundled into frontend JavaScript.

2. **Deterministic Agronomic Boundary**:
   - The rule engine (`src/lib/ruleEngine.ts`) executes pure agronomic checks before the AI is invoked.
   - The computed risk levels (`methane_risk`, `yield_risk`, `confidence`) and safety flags (`must_avoid_drying`) are passed to Gemini as immutable facts.
   - System prompts strictly forbid the AI from modifying risk levels, inventing exact percentages, or recommending drying during the critical anthesis/flowering stage.

3. **Fallback Resiliency**:
   - If the Gemini API is unreachable, rate-limited, or returns malformed output, the system fails over immediately to `generateRuleFallbackAdvice()`.
   - Fallback advice is clearly badged in the UI as "Basic rule-based guidance (AI unavailable)".

4. **Honesty and Data Boundaries**:
   - Visual imagery is an illustrative app asset generated for contextual awareness.
   - The application does not claim to stream live satellite imagery or IoT sensor telemetry.
   - All recommendations conclude with a reminder to confirm with a local agronomist or extension officer.
