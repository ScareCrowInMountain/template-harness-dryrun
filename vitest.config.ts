import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/index.ts"],
      // Coverage gate. Raise over time; never lower without an INCIDENTS.md entry.
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 },
    },
  },
});
