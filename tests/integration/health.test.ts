import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/lib/env.js";
import { createAnonClient } from "../../src/lib/supabase.js";
import { checkHealth } from "../../src/health/health.js";

// Requires `supabase start` and a filled .env. Skipped when SUPABASE_URL is unset.
describe.skipIf(process.env.SUPABASE_URL === undefined)("health (integration)", () => {
  it("reads the seeded health_checks row through RLS as anon", async () => {
    const report = await checkHealth(createAnonClient(loadEnv()));
    expect(report.ok).toBe(true);
  });
});
