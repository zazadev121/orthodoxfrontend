import test from "node:test";
import assert from "node:assert/strict";
import { themes, initialTheme, initialReaderSize } from "../src/themes.js";
import { copy } from "../src/i18n.js";
test("every palette has a translated name in every language", () => {
  assert.equal(new Set(themes.map(t => t.id)).size, 10);
  for (const language of Object.values(copy))
    for (const theme of themes) assert.ok(language.themeNames[theme.id]);
});
test("saved themes migrate and invalid preferences fall back safely", () => {
  const original = globalThis.localStorage;
  try {
    for (const [saved, expected] of [[null,"charcoal"], ["dark","midnight"], ["light","ivory"], ["bad","charcoal"], ...themes.map(t => [t.id,t.id])]) {
      globalThis.localStorage = { getItem: () => saved };
      assert.equal(initialTheme(), expected);
    }
    for (const [saved, expected] of [["0.9","0.9"], ["1.15","1.15"], ["200","1"], [null,"1"]]) {
      globalThis.localStorage = { getItem: () => saved };
      assert.equal(initialReaderSize(), expected);
    }
    globalThis.localStorage = { getItem() { throw Error("Storage blocked"); } };
    assert.equal(initialTheme(), "charcoal");
    assert.equal(initialReaderSize(), "1");
  } finally { globalThis.localStorage = original; }
});
