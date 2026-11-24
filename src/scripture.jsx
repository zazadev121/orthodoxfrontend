import React, { useEffect, useState } from "react";
import "./bible-reader-study.css";
import {
  useEditorial,
  useEditorialResource,
  useEditorialWords,
} from "./editorial-context.jsx";
import { VerseExplanations, BibleRevision } from "./bible-editorial.jsx";
import {
  BookOpen,
  Sunrise,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LoaderCircle,
} from "lucide-react";
import {
  scriptureEditions,
  defaultEdition,
  editionFor,
  dailyVerseForDate,
  localDateKey,
  normalizeReading,
  readingFromLocation,
  readingHref,
  adjacentReading,
  loadChapter,
} from "./scripture.js";

function Attribution({ edition, language, compact = false }) {
  return (
    <div
      className={`scripture-attribution${compact ? " compact" : ""}`}
      lang="en"
      dir="ltr"
    >
      {edition.language === "ka" ? (<span>{language === "ka" ? "ძველი ქართული ახალი აღთქმა · ისტორიული ტექსტი · საჯარო საკუთრება. ციფრული წყარო: pumenis/random-access-ogb (MIT)." : "Old Georgian New Testament · Historical public-domain text · Digital source: pumenis/random-access-ogb (MIT)."}</span>) : edition.language === "ckb" ? (
        <>
          <span>Biblica® Open Kurdi Sorani Standard Version™</span>
          <span>Copyright © 1998, 2011, 2016, 2020 by Biblica, Inc.</span>
          {!compact && (
            <span>
              “Biblica” is a trademark registered in the United States Patent
              and Trademark Office by Biblica, Inc. Used with permission.
            </span>
          )}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY-SA 4.0
          </a>
        </>
      ) : (
        <span>{language === "ka" ? "მსოფლიო ინგლისური ბიბლიის განახლებული გამოცემა · საჯარო საკუთრება" : "World English Bible Updated · Public domain"}</span>
      )}
      {!compact && (
        <span>
          <a href={edition.licenseUrl} target="_blank" rel="noreferrer">
            {language === "ka" ? "წყარო და ლიცენზია" : "Source & license"}
          </a>{" "}
          · {edition.language === "ka" ? "pumenis/random-access-ogb" : language === "ka" ? "ტექსტის მომწოდებელი: AO Lab / eBible.org" : "Text supplied by AO Lab / eBible.org"}
        </span>
      )}
    </div>
  );
}
export function DailyVerse({ t, language, compact = false }) {
  const cms = useEditorial();
  const [date, setDate] = useState(() => new Date());
  const [translation, setTranslation] = useState(
    () => defaultEdition(language).id,
  );
  useEffect(() => setTranslation(defaultEdition(language).id), [language]);
  useEffect(() => {
    const refresh = () => setDate(new Date());
    const timer = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const edition = editionFor(translation);
  const custom = useEditorialResource(
    `/bible/daily?date=${localDateKey(date)}&edition=${translation}`,
    { enabled: cms.ready === true },
  );
  const chosen = custom.data?.item;
  const verse = chosen
    ? {
        book: chosen.book,
        chapter: chosen.chapter,
        verse: chosen.verse_start,
        text: chosen.text,
      }
    : dailyVerseForDate(edition, date);
  const available = scriptureEditions.filter(
    (e) => !cms.ready || cms.editions.some((setting) => setting.id === e.id),
  );
  useEffect(() => {
    if (
      cms.ready &&
      available.length &&
      !available.some((e) => e.id === translation)
    )
      setTranslation(available[0].id);
  }, [cms.ready, cms.editions, translation]);
  const book = edition.books.find((b) => b.id === verse.book);
  const soraniDate = language === "ckb"
    ? `${String(date.getDate()).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[digit])}ی ${["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"][date.getMonth()]} ${String(date.getFullYear()).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[digit])}`
    : null;
  if (cms.ready && !available.length) return null;
  return (
    <section className="daily-verse" aria-labelledby="daily-title">
      <div className="daily-topline">
        <span className="eyebrow" id="daily-title">
          <Sunrise size={18} />
          {t.dailyVerse}
        </span>
        <time dateTime={localDateKey(date)}>
          {soraniDate || date.toLocaleDateString(
            language === "ka" ? "ka-GE" : language === "en" ? "en-GB" : language === "ckb" ? "ckb" : "ku",
            { day: "numeric", month: "long", year: "numeric" },
          )}
        </time>
      </div>
      <blockquote dir={edition.direction} lang={edition.language}>
        {verse.text}
      </blockquote>
      <div className="daily-bottomline">
        <span
          className="daily-reference"
          dir={edition.direction}
          lang={edition.language}
        >
          {chosen ? (
            language === "ka" ? chosen.reference_ka || `${cms.text(`bible.book.${book.id}`, "ka", book.name)} ${chosen.chapter}:${chosen.verse_start}` : chosen.reference
          ) : (
            <>
              {cms.text(`bible.book.${book.id}`, edition.language, book.name)}{" "}
              <bdi>
                {verse.chapter}:{verse.verse}
              </bdi>
            </>
          )}
        </span>
        <a className="text-link" href={readingHref({ translation, ...verse })}>
          {t.readChapter}
          <ArrowUpRight size={16} />
        </a>
      </div>
      {compact && <details className="daily-options"><summary>{t.dailyTranslation}</summary><DailyVerseOptions t={t} language={language} translation={translation} setTranslation={setTranslation} available={available} cms={cms} edition={edition} /></details>}
      {!compact && <DailyVerseOptions t={t} language={language} translation={translation} setTranslation={setTranslation} available={available} cms={cms} edition={edition} />}
    </section>
  );
}
function DailyVerseOptions({t,language,translation,setTranslation,available,cms,edition}) {
  return <>
      <div className="daily-meta">
        <select
          aria-label={t.dailyTranslation}
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        >
          {available.map((edition) => (
            <option key={edition.id} value={edition.id}>
              {cms.ready
                ? cms.editions.find((e) => e.id === edition.id)?.[
                    `title_${language}`
                  ]
                : edition.language === "ka" ? t.georgianEdition : edition.language === "ckb"
                  ? t.soraniEdition
                  : t.englishEdition}
            </option>
          ))}
        </select>
        <span>{t.dailyRefresh}</span>
      </div>
      <Attribution edition={edition} language={language} compact />
  </>;
}
export function BibleReader({ t, language }) {
  const cms = useEditorial(),
    w = useEditorialWords(language);
  const [reading, setReading] = useState(() => readingFromLocation(language));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [openVerse, setOpenVerse] = useState(null);
  useEffect(() => setOpenVerse(null), [reading.translation, reading.book, reading.chapter]);
  const edition = editionFor(reading.translation);
  const book = edition.books.find((b) => b.id === reading.book);
  const bookName = cms.text(
    `bible.book.${book.id}`,
    edition.language,
    book.name,
  );
  const editorialPath = `/bible/editorial?book=${reading.book}&chapter=${reading.chapter}&edition=${reading.translation}`;
  const editorial = useEditorialResource(
    editorialPath,
    { enabled: cms.ready === true },
  );
  const available = scriptureEditions.filter(
    (e) => !cms.ready || cms.editions.some((setting) => setting.id === e.id),
  );
  const editionSetting = cms.editions.find((e) => e.id === edition.id);
  useEffect(() => {
    if (
      cms.ready &&
      available.length &&
      !available.some((e) => e.id === reading.translation)
    )
      navigate({
        translation: available[0].id,
        book: reading.book,
        chapter: reading.chapter,
      });
  }, [cms.ready, cms.editions, reading.translation]);
  function rememberVerse(verse) {
    const next = { ...reading, verse };
    setReading(next);
    history.replaceState(null, "", readingHref(next));
    try {
      localStorage.setItem(language === "ka" ? "scripture-position:ka" : "scripture-position", JSON.stringify(next));
    } catch {}
  }
  useEffect(() => {
    const sync = () => {
      if (location.hash.split("?")[0] === "#bible")
        setReading(readingFromLocation(language));
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [language]);
  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    const timeout = setTimeout(() => controller.abort(), 20000);
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      localStorage.setItem(language === "ka" ? "scripture-position:ka" : "scripture-position", JSON.stringify(reading));
    } catch {}
    loadChapter(reading, { signal: controller.signal })
      .then((data) => {
        if (alive) setResult(data);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [reading.translation, reading.book, reading.chapter, attempt]);
  useEffect(() => {
    if (!loading && reading.verse && result) {
      const timer = setTimeout(
        () =>
          document
            .getElementById(`scripture-verse-${reading.verse}`)
            ?.scrollIntoView({ block: "center" }),
        0,
      );
      return () => clearTimeout(timer);
    }
  }, [loading, reading.verse, result]);
  function navigate(next) {
    const safe = normalizeReading(next, language);
    setReading(safe);
    setOpenVerse(null);
    // Shareable passages, including links from the daily verse, stay on this site.
    history.replaceState(null, "", readingHref(safe));
  }
  const previous = adjacentReading(reading, -1),
    next = adjacentReading(reading, 1);
  const chapters = Array.from(
    { length: book.lastChapterNumber - book.firstChapterNumber + 1 },
    (_, i) => book.firstChapterNumber + i,
  );
  if (cms.ready && !available.length)
    return (
      <div className="page">
        <h1>{t.bibleTitle}</h1>
        <p>{w.empty}</p>
      </div>
    );
  return (
    <div className="page bible-reader-page">
      <div className="page-heading">
        <BookOpen size={25} />
        <h1>{t.bibleTitle}</h1>
        <p>{t.readerIntro}</p>
      </div>
      {language === "kmr" && (
        <p className="reader-language-note">{t.kurmanjiPending}</p>
      )}
      <div className="reader-controls">
        <label>
          {t.translation}
          <select
            value={reading.translation}
            onChange={(e) =>
              navigate({
                ...reading,
                translation: e.target.value,
                verse: undefined,
              })
            }
          >
            {[["en", "English"], ["ckb", "کوردی (سۆرانی)"], ["ka", "ქართული"]].map(([code, label]) => {
              const options = available.filter(e => e.language === code);
              return options.length ? <optgroup key={code} label={label}>
                {options.map(e => <option key={e.id} value={e.id}>
                  {cms.editions.find(setting => setting.id === e.id)?.[`title_${language}`] ||
                    (code === "ka" ? t.georgianEdition : code === "ckb" ? t.soraniEdition : t.englishEdition)}
                </option>)}
              </optgroup> : null;
            })}
          </select>
        </label>
        <label>
          {t.book}
          <select
            value={reading.book}
            dir={edition.direction}
            onChange={(e) =>
              navigate({
                ...reading,
                book: e.target.value,
                chapter: edition.books.find(b => b.id === e.target.value)?.firstChapterNumber || 1,
                verse: undefined,
              })
            }
          >
            {[
              [t.oldTestament, (b) => !b.isApocryphal && b.order <= 39],
              [t.newTestament, (b) => !b.isApocryphal && b.order > 39],
              [t.deuterocanonical, (b) => b.isApocryphal],
            ].map(([label, include]) => {
              const books = edition.books.filter(include);
              return books.length ? (
                <optgroup label={label} key={label}>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {cms.text(`bible.book.${b.id}`, edition.language, b.name)}
                    </option>
                  ))}
                </optgroup>
              ) : null;
            })}
          </select>
        </label>
        <label>
          {t.chapter}
          <select
            value={reading.chapter}
            onChange={(e) =>
              navigate({
                ...reading,
                chapter: Number(e.target.value),
                verse: undefined,
              })
            }
          >
            {chapters.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="chapter-navigation">
        <button
          type="button"
          className="button secondary"
          disabled={!previous}
          onClick={() => navigate(previous)}
        >
          <ArrowLeft size={17} />
          <span>{t.previousChapter}</span>
        </button>
        <span dir={edition.direction} lang={edition.language}>
          {bookName} <bdi>{reading.chapter}</bdi>
        </span>
        <button
          type="button"
          className="button secondary"
          disabled={!next}
          onClick={() => navigate(next)}
        >
          <span>{t.nextChapter}</span>
          <ArrowRight size={17} />
        </button>
      </div>
      <div aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="reader-loading">
            <LoaderCircle className="spin" size={23} />
            <p>{t.loading}</p>
          </div>
        ) : error ? (
          <div className="reader-error" role="alert">
            <p>{t.scriptureError}</p>
            <button
              className="button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              {t.retry}
            </button>
          </div>
        ) : (
          <>
            {result.offline && (
              <p className="reader-language-note">{t.cachedChapter}</p>
            )}
            <article
              className="scripture-chapter"
              dir={edition.direction}
              lang={edition.language}
              aria-label={`${bookName} ${reading.chapter}`}
            >
              <div className="chapter-title">
                <span>
                  {edition.language === "ka" ? t.georgianEdition : edition.language === "ckb"
                    ? t.soraniEdition
                    : t.englishEdition}
                </span>
                <h2>
                  {bookName} <bdi>{reading.chapter}</bdi>
                </h2>
              </div>
              {result.data.chapter.content.map((row, index) => {
                if (row.type === "heading")
                  return <h3 key={index}>{row.text}</h3>;
                if (row.type === "hebrew_subtitle")
                  return (
                    <p className="scripture-subtitle" key={index}>
                      {row.text}
                    </p>
                  );
                if (row.type !== "verse") return null;
                const override = (editorial.path === editorialPath ? editorial.data : null)?.overrides?.find(
                  (item) => item.verse === row.number,
                );
                return (
                  <React.Fragment
                    key={`${reading.book}-${reading.chapter}-${row.number}`}
                  >
                    <div
                      id={`scripture-verse-${row.number}`}
                      className={`scripture-verse${reading.verse === row.number ? " highlighted" : ""}`}
                    >
                      <button className="scripture-verse-trigger" type="button" aria-expanded={openVerse === row.number} aria-controls={`explanation-${reading.book}-${reading.chapter}-${row.number}`} onClick={() => { setOpenVerse(openVerse === row.number ? null : row.number); rememberVerse(row.number); }}>
                        <sup>{row.number}</sup>
                        <span>{override ? override.text : row.text || (edition.language === "ka" ? t.sourceVerseMissing : "")}</span>
                      </button>
                      {cms.ready && <button className="study-commentary-toggle" type="button" aria-expanded={openVerse === row.number} aria-controls={`explanation-${reading.book}-${reading.chapter}-${row.number}`} onClick={() => setOpenVerse(current => current === row.number ? null : row.number)}>
                        <BookOpen size={15} aria-hidden="true" />
                        <span>{({en:"Church Fathers", ckb:"ڕوونکردنەوەی باوکانی کڵێسا", ka:"ეკლესიის მამათა განმარტება", kmr:"Şiroveya Bavên Dêrê"})[language] || "Church Fathers"}</span>
                        <span aria-hidden="true">⌄</span>
                      </button>}
                    </div>
                    {override && (
                      <BibleRevision
                        override={override}
                        original={row.text}
                        language={language}
                      />
                    )}
                    {cms.ready && (
                      <VerseExplanations
                        verse={row.number}
                        explanations={(editorial.path === editorialPath ? editorial.data?.explanations : null) || []}
                        loading={editorial.path !== editorialPath || editorial.loading}
                        error={editorial.path === editorialPath ? editorial.error : null}
                        retry={editorial.retry}
                        language={language}
                        onOpen={rememberVerse}
                        passageKey={`${reading.book}-${reading.chapter}`}
                        book={reading.book}
                        bookName={bookName}
                        chapter={reading.chapter}
                        edition={reading.translation}
                        verseText={override ? override.text : row.text}
                        open={openVerse === row.number}
                        onToggle={() => setOpenVerse(openVerse === row.number ? null : row.number)}
                      />
                    )}
                    {!!row.footnotes?.length && (
                      <details className="verse-notes">
                        <summary>
                          {t.verseNotes} <bdi>{row.number}</bdi>
                        </summary>
                        {row.footnotes.map((note, i) => (
                          <p key={i}>{note.text}</p>
                        ))}
                      </details>
                    )}
                  </React.Fragment>
                );
              })}
            </article>
          </>
        )}
      </div>
      <Attribution edition={edition} language={language} />
            {edition.language === "ka" && <p className="reader-language-note">{language === "ka" ? t.georgianScope : "This historical Old Georgian edition contains the 27 New Testament books. It is not a newly commissioned modern Georgian translation."}</p>}
      <p className="reader-scope editorial-verbatim">
        {editionSetting
          ? editionSetting[`description_${language}`]
          : edition.language === "ckb"
            ? t.soraniScope
            : t.englishScope}
      </p>
    </div>
  );
}
