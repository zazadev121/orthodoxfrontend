import test from 'node:test';
import assert from 'node:assert/strict';
import {readDrafts,writeDraft,removeDraft} from '../src/editorial-drafts.js';
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}};
const entry={id:'record-1',resource:'authors',baseline:'{"id":"record-1","updated_at":"original-version"}',language:'ckb',savedAt:'2026-11-21T18:00:00Z',record:{id:'record-1',updated_at:'original-version',biography_ckb:'  یەشوا\nدەقی دەستی  ',biography_en:'  Exact words\nunchanged  ',biography_ka:'დამტკიცებული ტექსტი'}};
test('drafts survive reload with exact wording, original version and owner isolation',()=>{
 const s=storage();assert.equal(writeDraft('owner-a',entry,s),true);
 assert.deepEqual(readDrafts('owner-a',s),[{...entry,version:1}]);assert.deepEqual(readDrafts('owner-b',s),[]);
 assert.equal(writeDraft('',entry,s),false);
 writeDraft('owner-a',{...entry,record:{...entry.record,biography_en:'Revised'}},s);
 assert.equal(readDrafts('owner-a',s).length,1);assert.equal(readDrafts('owner-a',s)[0].record.updated_at,'original-version');
});
test('saved or discarded drafts clear only that record and section; storage failures are reported',()=>{
 const s=storage();writeDraft('a',entry,s);writeDraft('a',{...entry,id:'record-2'},s);writeDraft('a',{...entry,resource:'quotes'},s);
 assert.equal(removeDraft('a','authors','record-1',s),true);assert.equal(readDrafts('a',s).length,2);
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}};
 assert.equal(writeDraft('a',entry,blocked),false);assert.deepEqual(readDrafts('a',blocked),[]);
 assert.deepEqual(readDrafts('a',{getItem:()=>'{broken'}),[]);
});
