import React, { useState } from "react";
import { useEditorialWords } from "./editorial-context.jsx";
import { authorName, textFor, profileHref } from "./editorial.js";
export function VerseExplanations({
  verse,
  explanations,
  loading,
  error,
  retry,
  language,
  onOpen,
  passageKey,
}) {
  const w = useEditorialWords(language),
    [open, setOpen] = useState(false);
  const rows = explanations.filter(
    (item) => item.verse_start <= verse && item.verse_end >= verse,
  );
  const id = `explanation-${passageKey}-${verse}`;
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
          setOpen(!open);
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
          ) : !rows.length ? (
            <p>{w.noExplanation}</p>
          ) : (
            rows.map((item) => (
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
                    {item.reference} ↗
                  </a>
                ) : (
                  <p className="editorial-verbatim">{item.reference}</p>
                )}
              </article>
            ))
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
