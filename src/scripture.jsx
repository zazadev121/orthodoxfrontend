import React, { useEffect, useState } from "react";
import { BookOpen, Sunrise, ArrowLeft, ArrowRight, ArrowUpRight, LoaderCircle } from "lucide-react";
import { scriptureEditions, defaultEdition, editionFor, dailyVerseForDate, localDateKey, normalizeReading, readingFromLocation, readingHref, adjacentReading, loadChapter } from "./scripture.js";

function Attribution({ edition, compact = false }) {
  return <div className={`scripture-attribution${compact ? " compact" : ""}`} lang="en" dir="ltr">
    {edition.language === "ckb" ? <>
      <span>Biblica® Open Kurdi Sorani Standard Version™</span>
      <span>Copyright © 1998, 2011, 2016, 2020 by Biblica, Inc.</span>
      {!compact && <span>“Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission.</span>}
      <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
    </> : <span>World English Bible Updated · Public domain</span>}
    {!compact && <span><a href={edition.licenseUrl} target="_blank" rel="noreferrer">Source &amp; license</a> · Text supplied by AO Lab / eBible.org</span>}
  </div>;
}
export function DailyVerse({ t, language }) {
  const [date, setDate] = useState(() => new Date());
  const [translation, setTranslation] = useState(() => defaultEdition(language).id);
  useEffect(() => setTranslation(defaultEdition(language).id), [language]);
  useEffect(() => {
    const refresh = () => setDate(new Date());
    const timer = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  const edition = editionFor(translation);
  const verse = dailyVerseForDate(edition, date);
  const book = edition.books.find(b => b.id === verse.book);
  return <section className="daily-verse" aria-labelledby="daily-title">
    <div className="daily-topline">
      <span className="eyebrow" id="daily-title"><Sunrise size={18} />{t.dailyVerse}</span>
      <time dateTime={localDateKey(date)}>{date.toLocaleDateString(language === "en" ? "en-GB" : language === "ckb" ? "ckb" : "ku", { day: "numeric", month: "long", year: "numeric" })}</time>
    </div>
    <blockquote dir={edition.direction} lang={edition.language}>{verse.text}</blockquote>
    <div className="daily-bottomline">
      <span className="daily-reference" dir={edition.direction} lang={edition.language}>{book.name} <bdi>{verse.chapter}:{verse.verse}</bdi></span>
      <a className="text-link" href={readingHref({ translation, ...verse })}>{t.readChapter}<ArrowUpRight size={16} /></a>
    </div>
    <div className="daily-meta">
      <select aria-label={t.dailyTranslation} value={translation} onChange={e => setTranslation(e.target.value)}>
        {scriptureEditions.map(edition => <option key={edition.id} value={edition.id}>{edition.language === "ckb" ? t.soraniEdition : t.englishEdition}</option>)}
      </select>
      <span>{t.dailyRefresh}</span>
    </div>
    <Attribution edition={edition} compact />
  </section>;
}
export function BibleReader({ t, language }) {
  const [reading, setReading] = useState(() => readingFromLocation(language));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const edition = editionFor(reading.translation);
  const book = edition.books.find(b => b.id === reading.book);
  useEffect(() => {
    const sync = () => { if (location.hash.split("?")[0] === "#bible") setReading(readingFromLocation(language)); };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [language]);
  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    const timeout = setTimeout(() => controller.abort(), 20000);
    setLoading(true); setError(false); setResult(null);
    try { localStorage.setItem("scripture-position", JSON.stringify(reading)); } catch {}
    loadChapter(reading, { signal: controller.signal })
      .then(data => { if (alive) setResult(data); })
      .catch(() => { if (alive) setError(true); })
      .finally(() => { clearTimeout(timeout); if (alive) setLoading(false); });
    return () => { alive = false; clearTimeout(timeout); controller.abort(); };
  }, [reading.translation, reading.book, reading.chapter, attempt]);
  useEffect(() => {
    if (!loading && reading.verse && result) {
      const timer = setTimeout(() => document.getElementById(`scripture-verse-${reading.verse}`)?.scrollIntoView({ block: "center" }), 0);
      return () => clearTimeout(timer);
    }
  }, [loading, reading.verse, result]);
  function navigate(next) {
    const safe = normalizeReading(next, language);
    setReading(safe);
    // Shareable passages, including links from the daily verse, stay on this site.
    history.replaceState(null, "", readingHref(safe));
  }
  const previous = adjacentReading(reading, -1), next = adjacentReading(reading, 1);
  const chapters = Array.from({ length: book.lastChapterNumber - book.firstChapterNumber + 1 }, (_, i) => book.firstChapterNumber + i);
  return <div className="page bible-reader-page">
    <div className="page-heading"><BookOpen size={25} /><h1>{t.bibleTitle}</h1><p>{t.readerIntro}</p></div>
    {language === "kmr" && <p className="reader-language-note">{t.kurmanjiPending}</p>}
    <div className="reader-controls">
      <label>{t.translation}<select value={reading.translation} onChange={e => navigate({ ...reading, translation: e.target.value, verse: undefined })}>
        {scriptureEditions.map(edition => <option key={edition.id} value={edition.id}>{edition.language === "ckb" ? t.soraniEdition : t.englishEdition}</option>)}
      </select></label>
      <label>{t.book}<select value={reading.book} dir={edition.direction} onChange={e => navigate({ ...reading, book: e.target.value, chapter: 1, verse: undefined })}>
        {[[t.oldTestament, b => !b.isApocryphal && b.order <= 39], [t.newTestament, b => !b.isApocryphal && b.order > 39], [t.deuterocanonical, b => b.isApocryphal]].map(([label, include]) => {
          const books = edition.books.filter(include);
          return books.length ? <optgroup label={label} key={label}>{books.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</optgroup> : null;
        })}
      </select></label>
      <label>{t.chapter}<select value={reading.chapter} onChange={e => navigate({ ...reading, chapter: Number(e.target.value), verse: undefined })}>
        {chapters.map(number => <option key={number} value={number}>{number}</option>)}
      </select></label>
    </div>
    <div className="chapter-navigation">
      <button type="button" className="button secondary" disabled={!previous} onClick={() => navigate(previous)}><ArrowLeft size={17} /><span>{t.previousChapter}</span></button>
      <span dir={edition.direction} lang={edition.language}>{book.name} <bdi>{reading.chapter}</bdi></span>
      <button type="button" className="button secondary" disabled={!next} onClick={() => navigate(next)}><span>{t.nextChapter}</span><ArrowRight size={17} /></button>
    </div>
    <div aria-live="polite" aria-busy={loading}>
      {loading ? <div className="reader-loading"><LoaderCircle className="spin" size={23} /><p>{t.loading}</p></div> : error ? <div className="reader-error" role="alert"><p>{t.scriptureError}</p><button className="button" onClick={() => setAttempt(value => value + 1)}>{t.retry}</button></div> : <>
        {result.offline && <p className="reader-language-note">{t.cachedChapter}</p>}
        <article className="scripture-chapter" dir={edition.direction} lang={edition.language} aria-label={`${book.name} ${reading.chapter}`}>
          <div className="chapter-title"><span>{edition.language === "ckb" ? t.soraniEdition : t.englishEdition}</span><h2>{book.name} <bdi>{reading.chapter}</bdi></h2></div>
          {result.data.chapter.content.map((row, index) => {
            if (row.type === "heading") return <h3 key={index}>{row.text}</h3>;
            if (row.type === "hebrew_subtitle") return <p className="scripture-subtitle" key={index}>{row.text}</p>;
            if (row.type !== "verse") return null;
            return <React.Fragment key={index}><p id={`scripture-verse-${row.number}`} className={`scripture-verse${reading.verse === row.number ? " highlighted" : ""}`}><sup>{row.number}</sup><span>{row.text}</span></p>
              {!!row.footnotes?.length && <details className="verse-notes"><summary>{t.verseNotes} <bdi>{row.number}</bdi></summary>{row.footnotes.map((note, i) => <p key={i}>{note.text}</p>)}</details>}
            </React.Fragment>;
          })}
        </article>
      </>}
    </div>
    <Attribution edition={edition} />
    <p className="reader-scope">{edition.language === "ckb" ? t.soraniScope : t.englishScope}</p>
  </div>;
}
