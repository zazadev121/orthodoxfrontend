import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "./api.js";
import { useEditorialWords } from "./editorial-context.jsx";
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
  const closeRef = useRef(null), sheetRef = useRef(null),
    toggleRef = useRef(onToggle), requestRef = useRef(null);
  toggleRef.current = onToggle;
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
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const root = document.getElementById("root");
    const previousInert = root?.inert;
    document.body.style.overflow = "hidden";
    if (root) root.inert = true;
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event) => {
      if (event.key === "Escape") { event.preventDefault(); toggleRef.current(); }
      if (event.key !== "Tab") return;
      const focusable = [...sheetRef.current.querySelectorAll('a[href], button:not(:disabled), [tabindex="0"]')]
        .filter((element) => element.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (root) root.inert = previousInert;
      window.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);
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
  const ui = {
    en: { label: "Patristic commentary", close: "Close explanation", more: "Continue reading", less: "Show less", ai: "AI explanation" },
    ka: { label: "ეკლესიის მამათა განმარტება", close: "განმარტების დახურვა", more: "კითხვის გაგრძელება", less: "ნაკლების ჩვენება", ai: "AI განმარტება" },
    ckb: { label: "ڕوونکردنەوەی باوکانی کڵێسا", close: "داخستنی ڕوونکردنەوە", more: "درێژەی خوێندنەوە", less: "کەمتر پیشان بدە", ai: "ڕوونکردنەوەی AI" },
  }[language] || {};
  useEffect(() => {
    if (open && !loading && !error && !rows.length && !ai && !aiLoading && !aiError) explainWithAi();
  }, [open, loading, error, rows.length, book, chapter, verse, edition, language, ai, aiLoading, aiError]);
  if (!open) return null;
  return createPortal(
    <div className="verse-sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onToggle(); }}>
      <section ref={sheetRef} className="verse-sheet" id={id} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} dir={language === "ckb" ? "rtl" : "ltr"} lang={language}>
        <div className="verse-sheet-handle" aria-hidden="true" />
        <header className="verse-sheet-header">
          <div><span className="verse-sheet-kicker">{ui.label}</span><h2 id={`${id}-title`}>{bookName || book} <bdi>{chapter}:{verse}</bdi></h2></div>
          <button ref={closeRef} className="verse-sheet-close" type="button" onClick={onToggle} aria-label={ui.close}>×</button>
        </header>
        <div className="verse-sheet-scroll">
          <blockquote className="verse-sheet-verse" lang={{eng_webu:"en",ckb_bib:"ckb",ka_ogb:"ka"}[edition]} dir={edition === "ckb_bib" ? "rtl" : "ltr"}>{verseText}</blockquote>
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
            {!rows.length && <p className="verse-sheet-empty">{w.noExplanation}</p>}
            {rows.map((item) => (
              <article className="verse-father-card" key={item.id}>
                <div className="verse-father-byline">
                  {item.author?.icon_url ? <img src={item.author.icon_url} alt="" /> : <span className="verse-father-monogram" aria-hidden="true">✣</span>}
                  <div><h3><a href={profileHref(item.author)}>{authorName(item.author, language)}</a></h3><p>{metadataFor(item, "reference", language)}</p></div>
                </div>
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
              </article>
            ))}
            {!ai && (aiLoading ? <p role="status" className="verse-sheet-loading">{w.loading}</p> : rows.length > 0 && <button className="button secondary verse-ai-button" type="button" onClick={explainWithAi}>{words[1]}</button>)}
            {aiError && <p role="alert">{words[2]} <button className="text-link" type="button" onClick={explainWithAi}>{w.retry}</button></p>}
            {ai && <div className="verse-ai-result"><span className="verse-ai-badge">{ui.ai}</span><h3>{words[0]}</h3><p lang={ai.language} dir={ai.language === "ckb" ? "rtl" : "ltr"}>{ai.explanation}</p><p className="verse-ai-disclaimer">{ai.grounded_in_commentary ? words[3] : ({en:"AI interpretation of this verse; no verse-specific Church Father commentary was found.",ka:"ამ მუხლის AI განმარტება; ეკლესიის მამათა კონკრეტული კომენტარი ვერ მოიძებნა.",ckb:"لێکدانەوەی AI بۆ ئەم ئایەتە؛ لێدوانی تایبەتیی باوکانی کڵێسا نەدۆزرایەوە."})[language]}</p>{ai.source_url && <a href={ai.source_url} target="_blank" rel="noreferrer">{ai.source_title}</a>}</div>}
            </>
          )}
        </div>
      </section>
    </div>
    , document.body);
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
