import { describe, expect, it } from "vitest";
import { checkHealth } from "./health.js";

function fakeClient(error: { message: string } | null) {
  return {
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve({ data: null, error }),
      }),
    }),
  } as unknown as Parameters<typeof checkHealth>[0];
}

const fixedNow = () => new Date("2026-11-02T00:00:00.000Z");

describe("checkHealth", () => {
  it("reports up when the query succeeds", async () => {
    const report = await checkHealth(fakeClient(null), fixedNow);
    expect(report).toEqual({ ok: true, db: "up", checkedAt: "2026-11-02T00:00:00.000Z" });
  });

  it("reports down with the error message when the query fails", async () => {
    const report = await checkHealth(fakeClient({ message: "connection refused" }), fixedNow);
    expect(report.ok).toBe(false);
    expect(report.db).toBe("down");
    expect(report.error).toBe("connection refused");
  });
});

describe("checkHealth default clock", () => {
  it("uses the current time when no clock is given", async () => {
    const report = await checkHealth(fakeClient(null));
    expect(Date.parse(report.checkedAt)).not.toBeNaN();
  });
});
