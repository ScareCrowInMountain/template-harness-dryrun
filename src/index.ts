import { loadEnv } from "./lib/env.js";
import { createAnonClient } from "./lib/supabase.js";
import { checkHealth } from "./health/health.js";

async function main(): Promise<void> {
  const env = loadEnv();
  const client = createAnonClient(env);
  const report = await checkHealth(client);
  process.stdout.write(`${JSON.stringify(report)}\n`);
  process.exitCode = report.ok ? 0 : 1;
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
