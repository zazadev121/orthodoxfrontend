import test from "node:test";
import assert from "node:assert/strict";
import { saintBiographies, withExpandedBiography } from "../src/expanded-saint-biographies.js";
test("exactly fifteen sourced entries; preserve owner changes and other languages",()=>{
 assert.equal(Object.keys(saintBiographies).length,15);
 for(const [slug,row] of Object.entries(saintBiographies)){
  const input={slug, biography_ckb:row.original, biography_en:"original English"};
  assert.equal(withExpandedBiography(input).biography_ckb,row.biography);
  assert.equal(withExpandedBiography(input).biography_en,"original English");
  assert.equal(withExpandedBiography({...input,biography_ckb:"owner text"}).biography_ckb,"owner text");
  assert.ok(row.source.startsWith("https://www.oca.org/"));
 }
 const owner={slug:"chrysostom",biography_ckb:"owner text"};
 assert.equal(withExpandedBiography(owner),owner);
});
