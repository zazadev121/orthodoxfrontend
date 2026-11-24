import test from "node:test";
import assert from "node:assert/strict";
import { pages, publicHref, routeFromLocation, seoTitle } from "../src/seo-pages.js";
test("public pages have crawlable paths and unique titles", () => {
  const titles = new Set();
  for (const page of Object.keys(pages)) {
    const path = publicHref(page);
    assert.equal(routeFromLocation({pathname:path,hash:""}), page);
    titles.add(seoTitle(page));
  }
  assert.equal(titles.size,Object.keys(pages).length);
  assert.equal(publicHref("admin"),"#admin");
});
test("legacy hash links and Bible passage routes remain supported", () => {
  assert.equal(routeFromLocation({pathname:"/",hash:"#bible?book=JHN&chapter=1"}),"bible?book=JHN&chapter=1");
  assert.equal(routeFromLocation({pathname:"/saints/",hash:"#admin"}),"admin");
  assert.equal(routeFromLocation({pathname:"/unknown/",hash:""}),"home");
});
