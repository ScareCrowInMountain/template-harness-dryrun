import { defineConfig } from "vitest/config";

// Integration tests hit a real local Supabase (`supabase start`). Required at L2.
export default defineConfig({
  test: { include: ["tests/integration/**/*.test.ts"], testTimeout: 30_000 },
});
