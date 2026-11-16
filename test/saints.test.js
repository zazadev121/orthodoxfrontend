import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { saints, saintById, localized } from '../src/saints-data.js';
test('all ten requested saints have bilingual biographies, feast days, and authentic locally bundled icons with credits',()=>{
 assert.equal(saints.length,10);
 assert.equal(new Set(saints.map(s=>s.id)).size,10);
 const credits=JSON.parse(readFileSync(new URL('../src/icon-credits.json',import.meta.url)));
 for(const s of saints){
  assert.ok(s.ckb.startsWith('پایەپیرۆز '));
  for(const key of ['bio','history','contribution','writings','feast']){
   assert.equal(s[key].length,2,`${s.id} ${key}`);
   assert.ok(s[key].every(Boolean));
  }
  assert.ok(s.bio[0].length>200, s.id);
  assert.ok(s.source.startsWith('https://www.oca.org/')||s.source.startsWith('https://www.goarch.org/'));
  const bytes=readFileSync(new URL(`../public/icons/${s.id}.webp`,import.meta.url));
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
  assert.ok(bytes.length<180000,`${s.id} mobile image size`);
  assert.ok(credits[s.id].url.startsWith('https://commons.wikimedia.org/wiki/File:'));
  assert.ok(credits[s.id].license);
  assert.equal(saintById(s.id),s);
 }
 assert.equal(saintById('unknown'),undefined);
 assert.equal(localized(['English','کوردی'],'ckb'),'کوردی');
 assert.equal(localized(['English','کوردی'],'kmr'),'English');
});
test('every published quotation has a named real work, passage locator, original text, translation, and source link',()=>{
 for(const s of saints){
  for(const key of ['en','ckb','work','locator','url']) assert.ok(s.quote[key],`${s.id}: ${key}`);
  assert.ok(s.quote.url.startsWith('https://'));
  assert.ok(s.quote.en.split(/\s+/).length<=25,`${s.id} short source excerpt`);
 }
 assert.match(saintById('anthony').quote.work,/Athanasius/);
 assert.match(saintById('isaac').dates,/uncertain/);
 assert.match(saintById('gregory-nyssa').dates,/after/);
});
