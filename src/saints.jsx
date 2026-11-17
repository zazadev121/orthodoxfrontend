import React, { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, CalendarDays, Search, Bookmark, Check } from "lucide-react";
import { saints, saintById, localized } from "./saints-data.js";
import credits from "./icon-credits.json";
export const saintWords = language => language === "ckb" ? {
  title: "پایەپیرۆزان", intro: "ژیان، فێرکردن و میراتی پایەپیرۆزانی کڵێسای ئۆرتۆدۆکسی ڕۆژهەڵات.", all: "هەموو پایەپیرۆزان", savedOnly: "پایەپیرۆزە پاشەکەوتکراوەکان", search: "گەڕان بە ناوی پایەپیرۆز", bio: "ژیاننامە", quotes: "وتەکان", history: "پاشخانی مێژوویی", contribution: "بەشدارییە باوەڕناسییەکان", writings: "نووسینە گرنگەکان", feast: "ڕۆژی یاد", dates: "ڕێکەوتەکانی ژیان", sources: "سەرچاوەکان", read: "ژیاننامە بخوێنەوە", empty: "هیچ پایەپیرۆزێک نەدۆزرایەوە.", translation: "وەرگێڕانی سۆرانیی دەستکاریکاران؛ بۆ پشکنین دەقی ئینگلیزی و سەرچاوەکە بخوێنەوە.", original: "دەقی سەرچاوە بە ئینگلیزی", calendar: "ڕێکەوتەکان بە ڕۆژژمێری کڵێسایین. کڵێساکانی پەیڕەوی ڕۆژژمێری یولیانی هەمان ڕۆژی یاد لە ڕێکەوتێکی مەدەنیی جیاوازدا دەگرن.", saved: "پاشەکەوت کرا", save: "پاشەکەوتکردن", resume: "درێژەی خوێندنەوە", credit: "سەرچاوە و مۆڵەتی ئایکۆن", unavailable: "ئەم ژیاننامەیە نەدۆزرایەوە.", sourcePolicy: "پوختەکان ژیاننامەن، نەک وتەی ڕاستەوخۆ. وتەکان جیاوازن و هەر یەک ناوی بەرهەم و شوێنی دەقەکەی لەگەڵە."
} : {
  title: "Lives of the Saints", intro: "The lives, teaching, and living legacy of ten saints of the Eastern Orthodox Church.", all: "All saints", savedOnly: "Saved saints", search: "Search saints by name", bio: "Biography", quotes: "Quotations · وتەکان", history: "Historical background", contribution: "Theological contributions", writings: "Important writings", feast: "Feast day", dates: "Life dates", sources: "Sources", read: "Read the life", empty: "No saints match your search.", translation: "Editorial Sorani translation; compare the source English and cited text.", original: "Source English", calendar: "Dates are ecclesiastical calendar dates. Churches following the Julian calendar observe the same feasts on different civil dates.", saved: "Saved", save: "Save profile", resume: "Continue reading", credit: "Icon source and licence", unavailable: "This saint's profile could not be found.", sourcePolicy: "Biographical summaries are editorial prose, not quotations. Every quotation is separate and includes a named work and a passage reference."
};
export function SaintCard({ saint, language }) {
  const w = saintWords(language);
  return <a className="saint-card" href={`#saint?id=${saint.id}`}>
    <div className="saint-image"><img src={`/icons/${saint.id}.webp`} alt={`${saint.en} — Eastern Orthodox icon`} width="480" height="600" loading="lazy" decoding="async" /></div>
    <div className="saint-card-copy"><h3 lang="ckb" dir="rtl">{saint.ckb}</h3><p lang="en" dir="ltr">{saint.en}</p><span>{w.read}<ArrowUpRight size={16} /></span></div>
  </a>;
}
export function Saints({ language }) {
  const [search, setSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds] = useState(() => { try { return saints.filter(s => localStorage.getItem(`saint:${s.id}:saved`) === "true").map(s => s.id); } catch { return []; } });
  const [last] = useState(() => { try { return saintById(localStorage.getItem("lastSaint")); } catch { return null; } });
  const w = saintWords(language);
  const list = saints.filter(s => (!savedOnly || savedIds.includes(s.id)) && `${s.en} ${s.ckb}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  return <div className="page heritage-page"><header className="heritage-heading"><span className="eyebrow">EASTERN ORTHODOX SYNAXARION</span><h1>{w.title}</h1><p>{w.intro}</p></header>
    <div className="directory-tools"><label className="saint-search"><Search size={18} /><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={w.search} aria-label={w.search} /></label><button className="profile-save" aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={16} />{w.savedOnly}</button>{last && <a className="text-link" href={`#saint?id=${last.id}`}>{w.resume}: {language === "ckb" ? last.ckb : last.en}</a>}</div>
    <p className="editorial-note">{w.sourcePolicy}</p><div className="saints-grid">{list.map(s => <SaintCard key={s.id} saint={s} language={language} />)}</div>
    {!list.length && <p role="status">{w.empty}</p>}
  </div>;
}
export function SaintProfile({ language, route }) {
  const params = new URLSearchParams(route.split("?")[1]);
  const saint = saintById(params.get("id"));
  const tab = params.get("tab") === "quotes" ? "quotes" : "bio";
  const [saved, setSaved] = useState(false);
  const w = saintWords(language);
  useEffect(() => {
    if (!saint) return;
    try { localStorage.setItem("lastSaint", saint.id); setSaved(localStorage.getItem(`saint:${saint.id}:saved`) === "true"); } catch {}
    document.title = `${saint.en} · Rūm Orthodoxy In Kurdistan`;
    return () => { document.title = "Rūm Orthodoxy In Kurdistan"; };
  }, [saint]);
  if (!saint) return <div className="page"><h1>{w.unavailable}</h1><a className="button" href="#saints">{w.all}</a></div>;
  const credit = credits[saint.id];
  function toggleSaved() { const value = !saved; setSaved(value); try { localStorage.setItem(`saint:${saint.id}:saved`, String(value)); } catch {} }
  return <article className="page heritage-page saint-profile"><a href="#saints" className="text-link">← {w.all}</a>
    <header className="profile-header"><figure><img className="profile-icon" src={`/icons/${saint.id}.webp`} alt={`${saint.en} — Eastern Orthodox icon`} width="720" height="960" fetchPriority="high" /><figcaption><a href={credit.url} target="_blank" rel="noreferrer">{w.credit} ↗</a></figcaption></figure>
      <div className="profile-heading"><span className="eyebrow">EASTERN ORTHODOX SYNAXARION</span><h1 lang="ckb" dir="rtl">{saint.ckb}</h1><p className="english-name" lang="en" dir="ltr">{saint.en}</p>
        <dl className="saint-facts"><div><dt>{w.dates}</dt><dd lang="en" dir="ltr">{saint.dates}</dd></div><div><dt><CalendarDays size={16} />{w.feast}</dt><dd>{localized(saint.feast, language)}</dd></div></dl>
        <button className="profile-save" aria-pressed={saved} onClick={toggleSaved}>{saved ? <Check size={16} /> : <Bookmark size={16} />}{saved ? w.saved : w.save}</button>
      </div></header>
    <nav className="profile-tabs" aria-label={language === "ckb" ? "ناوەڕۆکی ژیاننامە" : "Profile sections"}>
      <a href={`#saint?id=${saint.id}`} aria-current={tab === "bio" ? "page" : undefined}><BookOpen size={17} />{w.bio}</a>
      <a href={`#saint?id=${saint.id}&tab=quotes`} aria-current={tab === "quotes" ? "page" : undefined}>{w.quotes}</a>
    </nav>
    {tab === "quotes" ? <section className="profile-body"><h2>{w.quotes}</h2><p className="editorial-note">{w.sourcePolicy}</p><blockquote className="verified-quote"><span className="eyebrow">{language === "ckb" ? "پارچەدەقێک لە سەرچاوە" : "SOURCED EXCERPT"}</span><p lang={language === "ckb" ? "ckb" : "en"} dir={language === "ckb" ? "rtl" : "ltr"}>{language === "ckb" ? saint.quote.ckb : saint.quote.en}</p><cite lang="en" dir="ltr">{saint.quote.work}<br />{saint.quote.locator}</cite><a className="text-link" href={saint.quote.url} target="_blank" rel="noreferrer">{w.sources} ↗</a></blockquote>
      {language === "ckb" && <><p className="editorial-note">{w.translation}</p><details><summary>{w.original}</summary><p lang="en" dir="ltr">{saint.quote.en}</p></details></>}
    </section> : <div className="profile-body">{[[w.bio, saint.bio], [w.history, saint.history], [w.contribution, saint.contribution], [w.writings, saint.writings]].map(([title, body]) => <section key={title}><h2>{title}</h2><p>{localized(body, language)}</p></section>)}<p className="editorial-note">{w.calendar}</p><a className="button gold" href={`#saint?id=${saint.id}&tab=quotes`}>{w.quotes}<ArrowUpRight size={17} /></a></div>}
    <aside className="profile-sources"><h2>{w.sources}</h2><a href={saint.source} target="_blank" rel="noreferrer">{saint.id === "isaac" ? "Greek Orthodox Archdiocese · Biography" : "Orthodox Church in America · Synaxarion"} ↗</a>{saint.calendarSource && <a href={saint.calendarSource} target="_blank" rel="noreferrer">OCA · Feast calendar ↗</a>}<a href={saint.quote.url} target="_blank" rel="noreferrer">{saint.quote.work} · {saint.quote.locator} ↗</a><p className="icon-credit" lang="en" dir="ltr">Icon: {credit.artist} · {credit.license}. Resized for the web{saint.id === "paisios" ? "; photograph cropped to focus on the icon." : "."} <a href={credit.url} target="_blank" rel="noreferrer">{credit.title}</a>{credit.licenseUrl && <> · <a href={credit.licenseUrl} target="_blank" rel="noreferrer">Licence</a></>}</p></aside>
  </article>;
}
