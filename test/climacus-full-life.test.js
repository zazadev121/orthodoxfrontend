import test from "node:test";
import assert from "node:assert/strict";
import {fullClimacusBiography,withFullClimacusBiography,climacusBiographySources,isClimacus} from "../src/climacus-full-life.js";
test("complete parallel life in every active language, with existing profile metadata preserved",()=>{
 const langs=["ckb","en","ka","ru"];
 const a={id:"7caceeb3-4b2f-4a50-9262-7d54a250a7fc",icon_url:"existing-icon",quote_count:5,biography_ckb:"old"};
 const updated=withFullClimacusBiography(a);
 for(const lang of langs){assert.equal(fullClimacusBiography[lang].split(/\n\n+/).length,22);assert.ok(fullClimacusBiography[lang].length>6000);assert.equal(updated["biography_"+lang],fullClimacusBiography[lang]);}
 assert.equal(updated.icon_url,a.icon_url);assert.equal(updated.quote_count,5);assert.ok(isClimacus(a));
 const other={id:"other",biography_ckb:"unchanged"};assert.equal(withFullClimacusBiography(other),other);assert.equal(climacusBiographySources.length,4);
});
