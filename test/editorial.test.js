import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesAuthor,searchKey,mergeWords,profileHref } from '../src/editorial.js';
import { newEditorialRecord,savePayload,editorResources } from '../src/editorial-admin-model.js';
test('saint search matches alternative names, Golden-Mouth, titles and Arabic-script variants without changing stored names',()=>{
 const a={id:'fixed-id',slug:'chrysostom',name_en:'Saint John Chrysostom',name_ckb:'پایەپیرۆز یۆحەنای دەمزێڕین',aliases:['Golden-Mouth'],title_en:'Golden Mouth',position_en:'Archbishop of Constantinople'};
 for(const q of ['Golden-Mouth','golden mouth','goldenmouth','Chrysostom','Constantinople','یۆحەنای'])assert.ok(matchesAuthor(a,q),q);
 assert.equal(matchesAuthor(a,'Saint Basil'),false);
 assert.equal(searchKey('كۆتایی'),searchKey('کۆتایی'));
 assert.equal(a.name_en,'Saint John Chrysostom');assert.equal(profileHref(a),'#saint?id=chrysostom');
});
test('manual copy overrides include nested objects, example arrays, deliberate blanks and verbatim whitespace',()=>{
 const base={home:'Original',themeNames:{dark:'Dark'},examples:['One','Two']};
 const blocks=[{key:'ui.home',published:true,text_en:'  Exact\nmanual text  '},{key:'ui.themeNames.dark',published:true,text_en:''},{key:'ui.examples.0',published:true,text_en:'My question'},{key:'ui.examples.1',published:false,text_en:'Private draft'}];
 const result=mergeWords(base,blocks,'ui','en');
 assert.equal(result.home,'  Exact\nmanual text  ');assert.equal(result.themeNames.dark,'');assert.deepEqual(result.examples,['My question','Two']);assert.equal(base.home,'Original');
});
test('all seven dashboard sections have editable resources, and new material starts unpublished',()=>{
 assert.deepEqual(new Set(Object.values(editorResources).map(r=>r.section)),new Set(['saints','quotes','prayers','doctrine','writings','bible','general']));
 for(const name of Object.keys(editorResources)){const r=newEditorialRecord(name,'11111111-1111-4111-8111-111111111111');assert.equal(r.published,false);}
 const row={id:'example',body_en:'  Exact words\nno paraphrase  ',updated_at:'2026-11-17T00:00:00Z',created_at:'old',legacy_key:'old',deleted_at:null};
 const payload=savePayload(row);assert.equal(payload.body_en,row.body_en);assert.equal(payload.expected_updated_at,row.updated_at);assert.equal(payload.created_at,undefined);assert.equal(payload.legacy_key,undefined);
});
