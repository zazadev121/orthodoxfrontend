import test from "node:test";
import assert from "node:assert/strict";
import { copy } from "../src/i18n.js";
test("English copy covers every Sorani interface key", () => {
  for (const key of Object.keys(copy.ckb)) {
    assert.ok(Object.hasOwn(copy.en, key), `Missing English key: ${key}`);
    assert.ok(copy.en[key], `Empty English key: ${key}`);
  }
});
