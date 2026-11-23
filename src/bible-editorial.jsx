import React, { useEffect, useState } from "react";
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
  onOpen,
  passageKey,
  book,
  chapter,
  edition,
  verseText,
  open,
  onToggle,
}) {
  const w = useEditorialWords(language),
    [ai, setAi] = useState(null),
    [aiLoading, setAiLoading] = useState(false),
    [aiError, setAiError] = useState(false);
  const rows = explanations.filter(
    (item) => item.verse_start <= verse && item.verse_end >= verse,
  );
  const id = `explanation-${passageKey}-${verse}`;
  const hasLocalized = rows.some((item) => textFor(item, "body", language)?.trim());
  useEffect(() => {
    setAi(null);
    setAiError(false);
  }, [book, chapter, verse, edition, language]);
  async function explainWithAi() {
    setAiLoading(true);
    setAiError(false);
    try {
      setAi(await api("/bible/explain", {
        method: "POST",
        body: JSON.stringify({ book, chapter, verse, edition, verseText }),
      }));
    } catch {
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  }
  const words = {
    en: ["AI explanation from an Orthodox perspective", "Explain with AI", "AI explanation is temporarily unavailable. Try again.", "Based on the linked Orthodox source; this is an AI summary, not a quotation from a saint."],
    ka: ["AI განმარტება მართლმადიდებლური ხედვით", "AI-ით განმარტება", "AI განმარტება დროებით მიუწვდომელია. სცადეთ ხელახლა.", "დაფუძნებულია მითითებულ მართლმადიდებლურ წყაროზე; ეს არის AI-ის შეჯამება და არა წმინდანის ციტატა."],
    ckb: ["ڕوونکردنەوەی AI لە ڕوانگەی ئۆرتۆدۆکسەوە", "بە AI ڕوونی بکەرەوە", "ڕوونکردنەوەی AI ئێستا بەردەست نییە. دووبارە هەوڵ بدەرەوە.", "پشت بە سەرچاوە ئۆرتۆدۆکسە بەستراوە؛ ئەمە پوختەی AI ـە، نەک وتەی ڕاستەوخۆی پیرۆزێک."],
  }[language] || [];
  return (
    <div
      className="verse-explanations"
      dir={language === "ckb" ? "rtl" : "ltr"}
      lang={language}
    >
      <button
        className="verse-explanation-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          onToggle();
          if (!open) onOpen?.(verse);
        }}
      >
        {w.explain}
        {rows.length > 0 && ` (${rows.length})`}
      </button>
      {open && (
        <div className="verse-explanation-panel" id={id}>
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
            {!rows.length && <p>{w.noExplanation}</p>}
            {rows.map((item) => (
              <article key={item.id}>
                <h4>
                  <a href={profileHref(item.author)}>
                    {authorName(item.author, language)}
                  </a>
                </h4>
                {textFor(item, "title", language) && (
                  <h5>{textFor(item, "title", language)}</h5>
                )}
                <p className="editorial-verbatim">
                  {textFor(item, "body", language) || w.missingTranslation}
                </p>
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
            {!ai && <button className="button secondary verse-ai-button" type="button" disabled={aiLoading} onClick={explainWithAi}>{aiLoading ? w.loading : words[1]}</button>}
            {aiError && <p role="alert">{words[2]} <button className="text-link" type="button" onClick={explainWithAi}>{w.retry}</button></p>}
            {ai && <div className="verse-ai-result"><h4>{words[0]}</h4><p lang={ai.language} dir={ai.language === "ckb" ? "rtl" : "ltr"}>{ai.explanation}</p><p className="verse-ai-disclaimer">{ai.grounded_in_commentary ? words[3] : ({en:"AI interpretation of this verse; no verse-specific Church Father commentary was found.",ka:"ამ მუხლის AI განმარტება; ეკლესიის მამათა კონკრეტული კომენტარი ვერ მოიძებნა.",ckb:"لێکدانەوەی AI بۆ ئەم ئایەتە؛ لێدوانی تایبەتیی باوکانی کڵێسا نەدۆزرایەوە."})[language]}</p>{ai.source_url && <a href={ai.source_url} target="_blank" rel="noreferrer">{ai.source_title}</a>}</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
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
