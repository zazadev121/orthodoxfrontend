import React, { useEffect, useRef, useState } from "react";
import { api } from "./api.js";
import { useEditorial, useEditorialWords } from "./editorial-context.jsx";
import { fathers, patristicSources } from "./patristic-sources.js";
import { HistoricalReading } from "./patristic-reading.jsx";
import { authorName, textFor, profileHref, metadataFor } from "./editorial.js";
export function VerseExplanations({
  verse,
  explanations,
  loading,
  error,
  retry,
  language,
  passageKey,
  book,
  bookName,
  chapter,
  edition,
  verseText,
  open,
  onToggle,
}) {
  const w = useEditorialWords(language),
    [ai, setAi] = useState(null),
    [aiLoading, setAiLoading] = useState(false),
    [aiError, setAiError] = useState(false),
    [expanded, setExpanded] = useState({});
  const requestRef = useRef(null);
  const cms = useEditorial();
  const sources = open ? patristicSources(book, chapter, verse) : [];
  const sourceWords = ({en:["Historical homilies & commentaries","Related passage; not necessarily a direct explanation of every verse.","Read full English source","Historical English excerpt"],ckb:["وتار و لێکدانەوە مێژووییەکان","ئەم سەرچاوەیە پەیوەندی بە بەشەکەوە هەیە؛ نەک بە ناچاری ڕوونکردنەوەی هەر ئایەتێک.","سەرچاوەی تەواو بە ئینگلیزی","دەقێکی مێژوویی بە ئینگلیزی"],ka:["ისტორიული ქადაგებები და კომენტარები","დაკავშირებული მონაკვეთი; არა აუცილებლად თითოეული მუხლის პირდაპირი განმარტება.","სრული ინგლისური წყარო","ისტორიული ინგლისური ამონარიდი"]})[language] || ["Historical homilies & commentaries","Related passage; not necessarily a direct explanation of every verse.","Read full English source","Historical English excerpt"];
  const rows = explanations.filter(
    (item) => item.verse_start <= verse && item.verse_end >= verse,
  );
  const id = `explanation-${passageKey}-${verse}`;
  useEffect(() => {
    requestRef.current?.abort();
    setAi(null);
    setAiLoading(false);
    setAiError(false);
    setExpanded({});
    return () => requestRef.current?.abort();
  }, [book, chapter, verse, edition, language]);
  useEffect(() => { if (!open) { requestRef.current?.abort(); setAiLoading(false); } }, [open]);
  async function explainWithAi() {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setAiLoading(true);
    setAiError(false);
    try {
      const result = await api("/bible/explain", {
        signal: controller.signal,
        method: "POST",
        body: JSON.stringify({ book, chapter, verse, edition, verseText }),
      });
      if (!controller.signal.aborted) setAi(result);
    } catch {
      if (!controller.signal.aborted) setAiError(true);
    } finally {
      if (!controller.signal.aborted) setAiLoading(false);
    }
  }
  const words = {
    en: ["AI explanation from an Orthodox perspective", "Explain with AI", "AI explanation is temporarily unavailable. Try again.", "Based on the linked Orthodox source; this is an AI summary, not a quotation from a saint."],
    ka: ["AI განმარტება მართლმადიდებლური ხედვით", "AI-ით განმარტება", "AI განმარტება დროებით მიუწვდომელია. სცადეთ ხელახლა.", "დაფუძნებულია მითითებულ მართლმადიდებლურ წყაროზე; ეს არის AI-ის შეჯამება და არა წმინდანის ციტატა."],
    ckb: ["ڕوونکردنەوەی AI لە ڕوانگەی ئۆرتۆدۆکسەوە", "بە AI ڕوونی بکەرەوە", "ڕوونکردنەوەی AI ئێستا بەردەست نییە. دووبارە هەوڵ بدەرەوە.", "پشت بە سەرچاوە ئۆرتۆدۆکسە بەستراوە؛ ئەمە پوختەی AI ـە، نەک وتەی ڕاستەوخۆی پایەپیرۆزێک."],
  }[language] || [];
  const aiLanguage = ai?.language || { eng_webu: "en", ckb_bib: "ckb", ka_ogb: "ka" }[edition] || language;
  const aiNotice = {
    en: "This is an AI-generated explanation and may be wrong.",
    ka: "ეს განმარტება შექმნილია AI-ის მიერ და შეიძლება მცდარი იყოს.",
    ckb: "ئەمە ڕوونکردنەوەیەکی دروستکراوی AI ـە و ڕەنگە هەڵە بێت.",
  }[aiLanguage] || "This is an AI-generated explanation and may be wrong.";
  const ui = {
    en: { label: "Patristic commentary", close: "Close explanation", more: "Continue reading", less: "Show less", ai: "AI explanation" },
    ka: { label: "ეკლესიის მამათა განმარტება", close: "განმარტების დახურვა", more: "კითხვის გაგრძელება", less: "ნაკლების ჩვენება", ai: "AI განმარტება" },
    ckb: { label: "ڕوونکردنەوەی باوکانی کڵێسا", close: "داخستنی ڕوونکردنەوە", more: "درێژەی خوێندنەوە", less: "کەمتر پیشان بدە", ai: "ڕوونکردنەوەی AI" },
  }[language] || {};
  const groups = new Map();
  for (const item of rows) {
    const key = item.author?.id || item.author_id || item.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return <section className="study-commentary" id={id} hidden={!open} aria-label={ui.label || "Patristic commentary"} dir={language === "ckb" ? "rtl" : "ltr"} lang={language}>
    {open && <div className="study-commentary-content">
      <header className="study-commentary-heading"><span>{ui.label || "Patristic commentary"}</span><bdi>{chapter}:{verse}</bdi></header>
          {loading ? (
            <p role="status">{w.loading}</p>
          ) : error ? (
            <div role="alert">
              <p>{w.explanationError}</p>
              <button className="text-link" onClick={retry}>
                {w.retry}
              </button>
            </div>
          ) : (
            <>
            {!rows.length && !sources.length && <p className="verse-sheet-empty">{w.noExplanation}</p>}
            {[...groups.entries()].map(([key, entries]) => {
              const author = entries[0].author;
              return <div className="study-father-group" key={key}>
                <div className="verse-father-byline">
                  {author?.icon_url ? <img src={author.icon_url} alt="" loading="lazy" decoding="async" onError={event => { event.currentTarget.hidden = true; }} /> : <span className="verse-father-monogram" aria-hidden="true">✣</span>}
                  <h3>{author && <a href={profileHref(author)}>{authorName(author, language)}</a>}</h3>
                </div>
                {entries.map(item => <article className="verse-father-card" key={item.id}>
                  <p className="study-source-reference">{metadataFor(item, "reference", language) || item.reference}</p>
                <div className={`verse-father-reading${(textFor(item, "body", language) || "").length > 220 ? " collapsible" : ""}${expanded[item.id] ? " expanded" : ""}`}>
                  {textFor(item, "title", language) && <h4>{textFor(item, "title", language)}</h4>}
                  <p className="editorial-verbatim">{textFor(item, "body", language) || w.missingTranslation}</p>
                </div>
                {((textFor(item, "body", language) || "").length > 220) && <button className="verse-read-more" type="button" aria-expanded={!!expanded[item.id]} onClick={() => setExpanded((current) => ({ ...current, [item.id]: !current[item.id] }))}>{expanded[item.id] ? ui.less : ui.more} <span aria-hidden="true">⌄</span></button>}
                {language === "ka" && item.review_note_ka && <p className="editorial-review-note" role="note">{item.review_note_ka}</p>}
                <span className="passage-range" dir="ltr">
                  {item.book} {item.chapter}:{item.verse_start}
                  {item.verse_end !== item.verse_start
                    ? `–${item.verse_end}`
                    : ""}
                </span>
                {item.source_url ? (
                  <a
                    className="text-link editorial-verbatim"
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {metadataFor(item, "reference", language)} ↗
                  </a>
                ) : (
                  <p className="editorial-verbatim">{metadataFor(item, "reference", language)}</p>
                )}
              </article>)}
              </div>;
            })}
            {!ai && (aiLoading ? <p role="status" className="verse-sheet-loading">{w.loading}</p> : <button className="button secondary verse-ai-button" type="button" onClick={explainWithAi}>{words[1] || "Explain with AI"}</button>)}
            {aiError && <p role="alert">{words[2]} <button className="text-link" type="button" onClick={explainWithAi}>{w.retry}</button></p>}
            {ai && <div className="verse-ai-result"><span className="verse-ai-badge">{ui.ai}</span><h3>{words[0]}</h3><p className="verse-ai-notice" role="note" lang={aiLanguage} dir={aiLanguage === "ckb" ? "rtl" : "ltr"}><strong>{aiNotice}</strong></p><p lang={ai.language} dir={ai.language === "ckb" ? "rtl" : "ltr"}>{ai.explanation}</p><p className="verse-ai-disclaimer">{ai.grounded_in_commentary ? words[3] : ({en:"AI interpretation of this verse; no verse-specific Church Father commentary was found.",ka:"ამ მუხლის AI განმარტება; ეკლესიის მამათა კონკრეტული კომენტარი ვერ მოიძებნა.",ckb:"لێکدانەوەی AI بۆ ئەم ئایەتە؛ لێدوانی تایبەتیی باوکانی کڵێسا نەدۆزرایەوە."})[language]}</p>{ai.source_url && <a href={ai.source_url} target="_blank" rel="noreferrer">{ai.source_title}</a>}</div>}
            </>
          )}
          {!!sources.length && <section className="study-historical-sources">
            <h3>{sourceWords[0]}</h3><p className="study-source-reference">{sourceWords[1]}</p>
            {Object.entries(fathers).map(([key,fallback]) => {
              const matches = sources.filter(s=>s.author===key);
              if(!matches.length)return null;
              const author = cms.authors.find(a=>a.slug===fallback.slug || a.name_en===fallback.name_en) || fallback;
              const icon = author.icon_url || fallback.icon_url;
              return <div className="study-father-group" key={key}>
                <div className="verse-father-byline">{icon ? <img src={icon} alt="" loading="lazy" /> : <span className="verse-father-monogram" aria-hidden="true">✣</span>}<h3>{authorName(author,language)}</h3></div>
                {matches.map(s=><article className="verse-father-card" key={s.number}><p lang="en" dir="ltr" className="study-source-reference">{s.reference} · John {s.range}</p><HistoricalReading source={s} chapter={chapter} verse={verse} language={language} /></article>)}
              </div>;
            })}
          </section>}
        </div>}
      </section>;
}
export function BibleRevision({ override, original, language }) {
  const w = useEditorialWords(language);
  if (!override) return null;
  return (
    <details className="bible-revision">
      <summary>{w.editorialRevision}</summary>
      <p className="editorial-verbatim">{override.editorial_note}</p>
      <strong>{w.originalVerse}</strong>
      <p className="editorial-verbatim">{original}</p>
    </details>
  );
}
