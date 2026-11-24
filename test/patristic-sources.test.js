import {test} from "node:test";
import assert from "node:assert/strict";
import {patristicSources} from "../src/patristic-sources.js";
test("John 1:1 has three patristic authors and real source references",()=>{
 const rows=patristicSources("JHN",1,1);
 assert.equal(new Set(rows.map(s=>s.author)).size,3);
 assert.equal(rows.find(s=>s.author==="chrysostom"&&s.number===2).url,"https://www.newadvent.org/fathers/240102.htm");
 assert.ok(rows.some(s=>s.excerpt));
});
test("cross-chapter ranges and unrelated books",()=>{
 assert.ok(patristicSources("JHN",2,1).some(s=>s.author==="chrysostom"&&s.number===21));
 assert.ok(patristicSources("JHN",21,25).some(s=>s.author==="augustine"&&s.number===124));
 assert.deepEqual(patristicSources("MAT",1,1),[]);
 assert.ok(!patristicSources("JHN",2,3).some(s=>s.excerpt));
});
