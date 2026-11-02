#!/usr/bin/env node
// Harness check (section 4.2). Runs in pre-commit and CI. Exit 1 on any failure.
//   L0 prototype: createdAt + not older than 30 days.
//   L1 department tool: L0 rules (no expiry) + owner, department, description.
//   L2 production: L1 rules + docs/RUNBOOK.md and docs/HANDOVER.md without TODO
//                  + at least one integration test.
import { existsSync, readFileSync, readdirSync } from "node:fs";

const L0_TTL_DAYS = 30;
const errors = [];

function fail(msg) {
  errors.push(msg);
}

function readHarness() {
  if (!existsSync("harness.json")) {
    fail("harness.json missing (section 4.2)");
    return null;
  }
  try {
    return JSON.parse(readFileSync("harness.json", "utf8"));
  } catch (e) {
    fail(`harness.json is not valid JSON: ${e.message}`);
    return null;
  }
}

function checkCommon(h) {
  if (!["L0", "L1", "L2"].includes(h.level)) fail(`level must be L0|L1|L2, got ${h.level}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(h.createdAt ?? "")) fail("createdAt must be YYYY-MM-DD");
}

function checkL0Expiry(h) {
  const created = Date.parse(h.createdAt);
  if (Number.isNaN(created)) return;
  const ageDays = (Date.now() - created) / 86_400_000;
  if (ageDays > L0_TTL_DAYS) {
    fail(
      `L0 prototype expired: created ${h.createdAt}, limit ${L0_TTL_DAYS} days. Promote via PR or archive.`,
    );
  }
}

function checkL1Fields(h) {
  for (const key of ["owner", "department", "description"]) {
    if (typeof h[key] !== "string" || h[key].trim() === "")
      fail(`${h.level} requires non-empty "${key}"`);
  }
}

function checkDocNoTodo(path) {
  if (!existsSync(path)) return fail(`L2 requires ${path}`);
  const todos = readFileSync(path, "utf8")
    .split("\n")
    .filter((l) => /\bTODO\b/.test(l)).length;
  if (todos > 0) fail(`L2: ${path} still has ${todos} TODO line(s)`);
}

function checkIntegrationTests() {
  const dir = "tests/integration";
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.test\.ts$/.test(f)) : [];
  if (files.length === 0) fail(`L2 requires at least one test in ${dir}/`);
}

function main() {
  const h = readHarness();
  if (h === null) return;
  checkCommon(h);
  if (h.level === "L0") checkL0Expiry(h);
  if (h.level === "L1" || h.level === "L2") checkL1Fields(h);
  if (h.level === "L2") {
    checkDocNoTodo("docs/RUNBOOK.md");
    checkDocNoTodo("docs/HANDOVER.md");
    checkIntegrationTests();
  }
}

main();
if (errors.length > 0) {
  for (const e of errors) console.error(`harness: ${e}`);
  process.exit(1);
}
console.log(`harness: OK (${JSON.parse(readFileSync("harness.json", "utf8")).level})`);
