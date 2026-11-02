import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";
import type { Env } from "./env.js";

export type DbClient = SupabaseClient<Database>;

/** Anon-key client: safe for user-facing code paths (RLS applies). */
export function createAnonClient(env: Env): DbClient {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Service-role client: bypasses RLS. Server-only. Throws if the key is absent
 * so a misconfigured deploy cannot silently fall back to anon.
 */
export function createServiceClient(env: Env): DbClient {
  if (env.SUPABASE_SERVICE_ROLE_KEY === undefined) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for the service client");
  }
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
