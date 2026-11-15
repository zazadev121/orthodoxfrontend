import test from 'node:test';
import assert from 'node:assert/strict';
import { scriptureEditions, defaultEdition, dailyVerseForDate, localDateKey, normalizeReading, adjacentReading, readingHref, loadChapter } from '../src/scripture.js';
const reading = { translation: 'eng_webu', book: 'JHN', chapter: 1 };
function responseFor(r = reading) {
  return { translation: { id: r.translation }, book: { id: r.book }, chapter: { number: r.chapter, content: [{ type: 'verse', number: 1, text: 'In the beginning was the Word.' }] } };
}
function storage() {
  const data = new Map();
  return { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value) };
}
test('daily verses have matching real references in both editions and change at local midnight', () => {
  assert.equal(scriptureEditions[0].daily.length, 40);
  assert.deepEqual(scriptureEditions[0].daily.map(({ book, chapter, verse }) => [book,chapter,verse]), scriptureEditions[1].daily.map(({ book, chapter, verse }) => [book,chapter,verse]));
  for (const edition of scriptureEditions) {
    for (const verse of edition.daily) {
      assert.ok(verse.text.length > 4);
      assert.ok(edition.books.some(book => book.id === verse.book && verse.chapter <= book.lastChapterNumber));
    }
    const before = dailyVerseForDate(edition, new Date(2026, 10, 15, 0, 0));
    assert.equal(before, dailyVerseForDate(edition, new Date(2026, 10, 15, 23, 59)));
    assert.notEqual(before, dailyVerseForDate(edition, new Date(2026, 10, 16, 0, 0)));
    assert.notEqual(dailyVerseForDate(edition, new Date(2026, 11, 31)), dailyVerseForDate(edition, new Date(2027, 0, 1)));
  }
  assert.equal(localDateKey(new Date(2026, 0, 2, 23)), '2026-01-02');
});
test('translation defaults and untrusted reading parameters are normalized', () => {
  assert.equal(defaultEdition('ckb').id, 'ckb_bib');
  assert.equal(defaultEdition('kmr').language, 'en');
  assert.equal(scriptureEditions.find(e=>e.id==='ckb_bib').books.length, 66);
  assert.equal(scriptureEditions.find(e=>e.id==='eng_webu').books.length, 81);
  assert.deepEqual(normalizeReading({ translation:'https://evil.test', book:'../../x', chapter:-5, verse:100000 }, 'ckb'), { translation:'ckb_bib', book:'JHN', chapter:1 });
  assert.deepEqual(normalizeReading({ ...reading, chapter:999 }), reading);
  assert.equal(readingHref({ ...reading, verse:16, text:'must not enter URL' }), '#bible?translation=eng_webu&book=JHN&chapter=1&verse=16');
});
test('chapter navigation crosses book boundaries and stops at translation endpoints', () => {
  assert.deepEqual(adjacentReading({ ...reading, chapter:21 }, 1), { translation:'eng_webu', book:'ACT', chapter:1 });
  assert.deepEqual(adjacentReading({ ...reading, book:'JUD' }, 1), { translation:'eng_webu', book:'REV', chapter:1 });
  for (const edition of scriptureEditions) {
    const first = edition.books[0], last = edition.books.at(-1);
    assert.equal(adjacentReading({ translation:edition.id, book:first.id, chapter:first.firstChapterNumber }, -1), null);
    assert.equal(adjacentReading({ translation:edition.id, book:last.id, chapter:last.lastChapterNumber }, 1), null);
  }
});
test('chapters cache, recover offline, reject wrong responses, and preserve aborts', async () => {
  const original = globalThis.localStorage;
  globalThis.localStorage = storage();
  try {
    let calls=0;
    const fetcher=async url=>{calls++;assert.equal(url,'https://bible.helloao.org/api/eng_webu/JHN/1.simple.json');return {ok:true,json:async()=>responseFor()};};
    const first=await loadChapter(reading,{fetcher,now:1000});
    assert.equal(first.data.chapter.number,1);
    const cached=await loadChapter(reading,{fetcher,now:2000});
    assert.deepEqual(cached.data,first.data);assert.equal(calls,1);
    const offline=await loadChapter(reading,{now:1000+8*86400000,fetcher:async()=>{throw Error('offline');}});
    assert.equal(offline.offline,true);
    const controller = new AbortController(); controller.abort();
    await assert.rejects(loadChapter(reading,{now:1000+8*86400000,signal:controller.signal,fetcher:async()=>{throw Error('aborted');}}));
    await assert.rejects(loadChapter({...reading,chapter:2},{fetcher:async()=>({ok:true,json:async()=>responseFor()})}));
    await assert.rejects(loadChapter({...reading,chapter:2},{fetcher:async()=>({ok:false,status:503})}));
  } finally { globalThis.localStorage=original; }
});
test('storage restrictions do not prevent loading Scripture', async () => {
  const original=globalThis.localStorage;
  globalThis.localStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  try { assert.equal((await loadChapter(reading,{fetcher:async()=>({ok:true,json:async()=>responseFor()})})).data.chapter.number,1); }
  finally {globalThis.localStorage=original;}
});
