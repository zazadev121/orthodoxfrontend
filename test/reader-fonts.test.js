import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readerFonts, readerFontFor, initialReaderFont } from '../src/reader-fonts.js';
test('all twelve requested fonts have a real bundled WOFF file and Kurdish label',()=>{
 assert.deepEqual(readerFonts.map(f=>f.label),['ناسخ','کوفی','سانس','ڤازیر','ریادێکس','NRT','سپێدا','ڕوداو','نەستعلیق','ڕەبار','یونیکورد','بەکرا']);
 assert.equal(new Set(readerFonts.map(f=>f.family)).size,12);
 const css=readFileSync(new URL('../src/reader-fonts.css',import.meta.url),'utf8');
 for(const font of readerFonts){
  const bytes=readFileSync(new URL(`../public/fonts/${font.id}.woff`,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'wOFF',font.id);
  assert.ok(bytes.length>10000,font.id);
  assert.ok(css.includes(`font-family: "${font.family}"`),font.id);
 }
});
test('font preferences restore safely and reject unknown saved values',()=>{
 const original=globalThis.localStorage;
 try{
  for(const font of readerFonts){globalThis.localStorage={getItem:()=>font.id};assert.equal(initialReaderFont(),font.id);}
  for(const value of [null,'bad','url(https://example.test/x)','__proto__']){globalThis.localStorage={getItem:()=>value};assert.equal(initialReaderFont(),'naskh');assert.equal(readerFontFor(value).id,'naskh');}
  globalThis.localStorage={getItem(){throw Error('blocked');}};assert.equal(initialReaderFont(),'naskh');
 }finally{globalThis.localStorage=original;}
});
