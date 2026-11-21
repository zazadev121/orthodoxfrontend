import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {copy} from '../src/i18n.js';
import {authorName,matchesAuthor,metadataFor} from '../src/editorial.js';
import {scriptureEditions,defaultEdition,loadChapter,normalizeReading} from '../src/scripture.js';
function leaves(v,path=''){return Object.entries(v).flatMap(([k,x])=>x&&typeof x==='object'?leaves(x,path+k+'.'):[[path+k,x]]);}
test('Georgian UI covers every English interface key with reviewed local text',()=>{
 for(const [key] of leaves(copy.en)){
  const v=key.split('.').reduce((a,k)=>a?.[k],copy.ka);
  assert.ok(typeof v==='string'&&v.trim(),key);
 }
 assert.equal(authorName({name_en:'English'},'ka'),'ქართული სახელი ჯერ არ არის დამატებული');
 assert.equal(metadataFor({reference:'English'},'reference','ka'),'');
 assert.ok(matchesAuthor({name_ka:'წმინდა იოანე ოქროპირი'},'ოქროპირი'));
});
test('Georgian Bible uses source-preserved local New Testament chapters and matching progress coordinates',async()=>{
 const e=defaultEdition('ka'); assert.equal(e.id,'ka_ogb');assert.equal(e.books.length,27);
 assert.equal(e.books.reduce((n,b)=>n+b.lastChapterNumber,0),260);
 assert.deepEqual(normalizeReading({translation:'ka_ogb',book:'GEN',chapter:1},'ka'),{translation:'ka_ogb',book:'JHN',chapter:1});
 let calls=0;
 const chapter=await loadChapter({translation:'ka_ogb',book:'JHN',chapter:1},{fetcher:async url=>{
  calls++; assert.equal(url,'/scripture/ka_ogb/JHN.json');
  return {ok:true,json:async()=>JSON.parse(readFileSync(new URL('../public/scripture/ka_ogb/JHN.json',import.meta.url),'utf8'))};
 }});
 assert.equal(calls,1);
 assert.equal(chapter.data.chapter.content.find(v=>v.number===1).text,'პირველითგან იყო სიტყუაჲ, და სიტყუაჲ იგი იყო ღმრთისა თანა, და ღმერთი იყო სიტყუაჲ იგი.');
 for(const b of e.books){
  const book=JSON.parse(readFileSync(new URL('../public/scripture/ka_ogb/'+b.id+'.json',import.meta.url),'utf8'));
  assert.equal(book.chapters.length,b.lastChapterNumber);
 }
});
