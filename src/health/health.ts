import type { DbClient } from "../lib/supabase.js";

export interface HealthReport {
  ok: boolean;
  db: "up" | "down";
  checkedAt: string;
  error?: string;
}

/** Minimal dependency probe. Used by the /health endpoint and the runbook. */
export async function checkHealth(
  client: Pick<DbClient, "from">,
  now: () => Date = () => new Date(),
): Promise<HealthReport> {
  const checkedAt = now().toISOString();
  const { error } = await client.from("health_checks").select("id").limit(1);
  if (error !== null) {
    return { ok: false, db: "down", checkedAt, error: error.message };
  }
  return { ok: true, db: "up", checkedAt };
}
