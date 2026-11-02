import { describe, expect, it } from "vitest";
import { loadEnv } from "./env.js";
import { createAnonClient, createServiceClient } from "./supabase.js";

const base = { SUPABASE_URL: "http://127.0.0.1:54321", SUPABASE_ANON_KEY: "anon" };

describe("supabase clients", () => {
  it("creates an anon client", () => {
    const client = createAnonClient(loadEnv(base));
    expect(typeof client.from).toBe("function");
  });

  it("refuses a service client when the service-role key is missing", () => {
    expect(() => createServiceClient(loadEnv(base))).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  it("creates a service client when the key is present", () => {
    const env = loadEnv({ ...base, SUPABASE_SERVICE_ROLE_KEY: "service" });
    expect(typeof createServiceClient(env).from).toBe("function");
  });
});
