import React from "react";
import { useEditorial } from "./editorial-context.jsx";
import { Check, Type } from "lucide-react";
import { readerFonts } from "./reader-fonts.js";

export function FontPicker({ t, selected, onChange, status, onRetry }) {
  const cms = useEditorial();
  const language = document.documentElement.lang === "ka" ? "ka" : "ckb";
  return (
    <section className="appearance-section" aria-labelledby="font-heading">
      <h2 id="font-heading">
        <Type size={21} />
        {t.readingFont}
      </h2>
      <p className="font-description">{t.fontDescription}</p>
      <div className="font-grid" role="group" aria-labelledby="font-heading">
        {readerFonts.map((font) => (
          <button
            type="button"
            key={font.id}
            className={`font-card${selected === font.id ? " selected" : ""}`}
            aria-label={cms.text(`fonts.${font.id}.label`, language, font.label)}
            aria-pressed={selected === font.id}
            onClick={() => onChange(font.id)}
          >
            <span className="font-card-heading">
              <span
                lang={language === "ka" ? "ka" : font.id === "nrt" ? "en" : "ckb"}
                dir={language === "ka" ? "ltr" : font.id === "nrt" ? "ltr" : "rtl"}
              >
                {cms.text(`fonts.${font.id}.label`, language, font.label)}
              </span>
              {selected === font.id && <Check size={18} />}
            </span>
            <span
              className="font-sample"
              lang={language}
              dir={language === "ka" ? "ltr" : "rtl"}
              style={{
                "--sample-font": `"${font.family}", "Reader Naskh", "Noto Sans Georgian", "Noto Naskh Arabic", serif`,
              }}
            >
              {cms.text("fonts.sample", language, language === "ka" ? "სიყვარულით სავსე გული" : "دڵێکی پڕ لە خۆشەویستی")}
            </span>
            <span className="font-source" lang="en" dir="ltr">
              {cms.text(`fonts.${font.id}.source`, language === "ka" ? "ka" : "en", font.sourceFamily)}
            </span>
          </button>
        ))}
      </div>
      <p className="settings-caption" role="status">
        {status === "loading"
          ? t.fontLoading
          : status === "error"
            ? t.fontError
            : t.fontSaved}
      </p>
      {status === "error" && (
        <button
          type="button"
          className="text-link font-retry"
          onClick={onRetry}
        >
          {t.retry}
        </button>
      )}
    </section>
  );
}
