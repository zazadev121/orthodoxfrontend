import { scriptureEditions } from "./scripture-data.js";

export { scriptureEditions };
const cacheKey = "scripture-chapters-v1";
const week = 7 * 86400000;
export function defaultEdition(language) {
  return scriptureEditions.find(e => e.language === language) || scriptureEditions.find(e => e.language === "en");
}
export function editionFor(id) {
  return scriptureEditions.find(e => e.id === id);
}
export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dailyVerseForDate(edition, date = new Date()) {
  // Civil-date arithmetic avoids DST changes and resets at the visitor's midnight.
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return edition.daily[((day % edition.daily.length) + edition.daily.length) % edition.daily.length];
}
export function normalizeReading(input, language = "en") {
  const edition = editionFor(input?.translation) || defaultEdition(language);
  const book = edition.books.find(b => b.id === input?.book) || edition.books.find(b => b.id === "JHN") || edition.books[0];
  const requested = Number(input?.chapter);
  const chapter = Number.isInteger(requested) && requested >= book.firstChapterNumber && requested <= book.lastChapterNumber ? requested : book.firstChapterNumber;
  const verse = Number(input?.verse);
  return { translation: edition.id, book: book.id, chapter, ...(Number.isInteger(verse) && verse > 0 && verse <= 200 ? { verse } : {}) };
}
export function readingFromLocation(language) {
  const query = new URLSearchParams(location.hash.split("?")[1] || "");
  if (query.has("book") || query.has("translation")) return normalizeReading(Object.fromEntries(query), language);
  try {
    const saved = JSON.parse(localStorage.getItem("scripture-position"));
    if (saved) return normalizeReading(saved, language);
  } catch {}
  return normalizeReading({}, language);
}
export function readingHref(reading) {
  return `#bible?${new URLSearchParams({ translation: reading.translation, book: reading.book, chapter: String(reading.chapter), ...(reading.verse ? { verse: String(reading.verse) } : {}) })}`;
}
export function adjacentReading(reading, step) {
  const edition = editionFor(reading.translation);
  const index = edition.books.findIndex(b => b.id === reading.book);
  const book = edition.books[index];
  const chapter = reading.chapter + step;
  if (chapter >= book.firstChapterNumber && chapter <= book.lastChapterNumber) return { translation: edition.id, book: book.id, chapter };
  const neighbor = edition.books[index + step];
  return neighbor ? { translation: edition.id, book: neighbor.id, chapter: step > 0 ? neighbor.firstChapterNumber : neighbor.lastChapterNumber } : null;
}
function validChapter(data, reading) {
  return data?.translation?.id === reading.translation && data?.book?.id === reading.book && data?.chapter?.number === reading.chapter && Array.isArray(data.chapter.content) && data.chapter.content.some(row => row.type === "verse" && typeof row.text === "string");
}
function readCache() {
  try {
    const rows = JSON.parse(localStorage.getItem(cacheKey) || "[]");
    return Array.isArray(rows) ? rows.slice(-12) : [];
  } catch { return []; }
}
export async function loadChapter(reading, { signal, fetcher = fetch, now = Date.now() } = {}) {
  const key = `${reading.translation}/${reading.book}/${reading.chapter}`;
  const cached = readCache().find(row => row?.key === key && validChapter(row.data, reading));
  if (cached && now - cached.savedAt < week) return { data: cached.data, offline: false };
  try {
    const response = await fetcher(`https://bible.helloao.org/api/${key}.simple.json`, { signal });
    if (!response.ok) throw Error(`Scripture request failed (${response.status})`);
    const data = await response.json();
    if (!validChapter(data, reading)) throw Error("Scripture response did not match the requested chapter");
    try {
      const rows = readCache().filter(row => row?.key !== key);
      localStorage.setItem(cacheKey, JSON.stringify([...rows, { key, savedAt: now, data }].slice(-12)));
    } catch {} // Storage quota/privacy settings must never prevent reading.
    return { data, offline: false };
  } catch (error) {
    if (signal?.aborted) throw error;
    if (cached) return { data: cached.data, offline: true };
    throw error;
  }
}
