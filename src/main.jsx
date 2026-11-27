import { RussianPrayerBook } from "./russian-prayer-book.jsx";
import { JourneyWelcome, journeyWords } from "./journey.jsx";
import { JOURNEY_KEY, loadJourney, saveJourney } from "./journey-model.js";
import "./journey.css";
import { localSaintByIdentifier } from "./additional-saints-2026.js";
import { DiscoverPage, ReadingLibrary, HistoryLibrary, discoverWords } from "./discover.jsx";
import { localizedError, metadataFor } from "./editorial.js";
import React, { useEffect, useState } from "react";
import { publicHref, routeFromLocation, seoTitle } from "./seo-pages.js";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  Church,
  MessageCircle,
  Library,
  ArrowUpRight,
  Search,
  ExternalLink,
  Menu,
  X,
  LogOut,
  Plus,
  PenLine,
  Trash2,
  Send,
  ShieldCheck,
  ChevronRight,
  Globe,
  Check,
  LoaderCircle,
  Heart,
  LogIn,
  Palette,
  Home as HomeIcon,
  Settings2,
} from "lucide-react";
import { copy } from "./i18n";
import { api, auth } from "./api";
import { useAccount } from "./use-account";
import { themes, initialTheme, initialReaderSize } from "./themes.js";
import { FontPicker } from "./font-picker.jsx";
import { initialReaderFont, readerFontFor } from "./reader-fonts.js";
import { DailyVerse, BibleReader } from "./scripture.jsx";
import { OrthodoxHome, OrthodoxStudy } from "./orthodox-home.jsx";
import { Saints, SaintProfile } from "./saints.jsx";
import "./style.css";
import "./reader-fonts.css";
import "./heritage.css";
import "./home.css";
import {
  EditorialProvider,
  useEditorial,
  useEditorialWords,
} from "./editorial-context.jsx";
import {
  AuthorLibrary,
  AuthorProfile,
  QuoteFeed,
  PrayerFeed,
  DoctrineLibrary,
  EditorialArticle,
} from "./editorial-public.jsx";
const AdminWorkspace = React.lazy(() =>
  import("./editorial-admin.jsx").then((module) => ({
    default: module.AdminWorkspace,
  })),
);
import "./editorial.css";
import "./saints-gallery.css";
import "./home-today.css";
import "./bible-reader-study.css";
function errorMessage(error, t) {
  return (
    {
      DATABASE_SCHEMA_MISSING: t.databaseSetup,
      DATABASE_CREDENTIALS_INVALID: t.databaseKeyError,
      AI_NOT_CONFIGURED: t.aiSetup,
    }[error.code] ||
    error.message ||
    t.error
  );
}

function Cross({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 80"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M30 4v72M17 19h26M6 34h48M17 58l26 10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M26 4h8M26 76h8M6 30v8M54 30v8"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
function App() {
  const cms = useEditorial();
  const account = useAccount();
  const [theme, setTheme] = useState(initialTheme);
  const [readerSize, setReaderSize] = useState(initialReaderSize);
  const [readerFont, setReaderFont] = useState(initialReaderFont);
  const [fontStatus, setFontStatus] = useState("loading");
  const [fontAttempt, setFontAttempt] = useState(0);
  useEffect(() => {
    const font = readerFontFor(readerFont);
    document.documentElement.dataset.readerFont = font.id;
    try {
      localStorage.setItem("readerFont", font.id);
    } catch {}
    let active = true;
    setFontStatus("loading");
    if (!document.fonts) {
      setFontStatus("error");
      return;
    }
    document.fonts
      .load(`20px "${font.family}"`, "دڵێکی پڕ لە خۆشەویستی")
      .then((faces) => {
        if (active) setFontStatus(faces.length ? "loaded" : "error");
      })
      .catch(() => {
        if (active) setFontStatus("error");
      });
    return () => {
      active = false;
    };
  }, [readerFont, fontAttempt]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    document.documentElement.style.setProperty("--reader-scale", readerSize);
    try {
      localStorage.setItem("readerSize", readerSize);
    } catch {}
  }, [readerSize]);
  const [journey, setJourney] = useState(() => {try{return loadJourney(localStorage);}catch{return null;}});
  const [journeyOpen, setJourneyOpen] = useState(() => !journey?.completed);
  const [journeyStorageError, setJourneyStorageError] = useState(false);
  const finishJourney = value => {let saved=false;try{saved=saveJourney(localStorage,value);}catch{}setJourneyStorageError(!saved);setJourney(value);setJourneyOpen(false);};
  const resetJourney = () => {try{localStorage.removeItem(JOURNEY_KEY);}catch{}setJourney(null);setJourneyOpen(false);};
  const [language, setLanguage] = useState(() => {
    const requested =
      new URLSearchParams(location.search).get("lang") ||
      (() => {
        try {
          return journey?.language || localStorage.getItem("language");
        } catch {
          return null;
        }
      })();
    return Object.hasOwn(copy, requested) ? requested : "ckb";
  });
  const [route, setRoute] = useState(() => routeFromLocation(location));
  const page = route.split("?")[0];
  useEffect(() => { document.documentElement.dataset.page = page; }, [page]);
  const [menu, setMenu] = useState(false);
  const t = {
    ...cms.words(copy[language], "ui", language),
    aiIntro: copy[language].aiIntro,
    aiDesc: copy[language].aiDesc,
    sourcePolicy: copy[language].sourcePolicy,
    intro: copy[language].intro,
    prayersIntro: copy[language].prayersIntro,
  };
  const ew = useEditorialWords(language);
  useEffect(() => {
    const handle = () => {
      setRoute(routeFromLocation(location));
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = seoTitle(page);
    document.documentElement.dir = language === "ckb" ? "rtl" : "ltr";
    try {
      localStorage.setItem("language", language);
    } catch {}
  }, [language, page]);
  useEffect(()=>{if(!journey?.completed || journey.language===language || journeyOpen)return;const next={...journey,language};setJourney(next);try{if(!saveJourney(localStorage,next))setJourneyStorageError(true);}catch{setJourneyStorageError(true);}},[language,journey,journeyOpen]);
  const fatherQuotesLabel = cms.text(
    "general.navFatherQuotes",
    language,
    language === "ckb" ? "وتەکانی باوکانی کڵێسا" : language === "ka" ? "ეკლესიის მამათა გამონათქვამები" : language === "ru" ? "Изречения святых отцов" : language === "kmr" ? "Gotinên Bavên Dêrê" : "Church Fathers’ Quotes",
  );
  const saintsQuotesLabel = cms.text(
    "general.bottomSaintQuotes",
    language,
    language === "ckb" ? "وتەکانی پایەپیرۆزان" : language === "ka" ? "წმინდანთა გამონათქვამები" : language === "ru" ? "Изречения святых" : language === "kmr" ? "Gotinên Pîrozan" : "Saints’ Quotes",
  );
  const nav = [
    ["home", t.home],
    ["bible", t.bible],
    ["discover", cms.text("general.navDiscover", language, discoverWords(language).title)],
    [
      "saints",
      cms.text(
        "general.navSaints",
        language,
        language === "ckb"
          ? "پایەپیرۆزان"
          : language === "ka" ? "წმინდანები" : language === "ru" ? "Святые" : language === "kmr"
            ? "Pîroz"
            : "Saints",
      ),
    ],
    ["doctrine", ew.doctrineTitle],
    ["prayers", t.prayers],
    ["ai", t.ai],
    ...(account.allowed ? [["admin", t.adminPanel]] : []),
  ];
  return (
    <>
      <a
        href="#main"
        className="skip"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("main").focus();
        }}
      >
        {t.skip}
      </a>
      <header className="header">
        <a href="/" className="brand">
          {page === "discover" ? <h1 className="discover-header-title">{cms.text("discover.title", language, discoverWords(language).title)}</h1> : <>
          {(cms.text("general.brandImage", language, "/kurdistan-cross-transparent.svg") || "").replace("/kurdistan-cross.jpg", "/kurdistan-cross-transparent.svg") && (
            <img
              className="brand-cross"
              src={(cms.text(
                "general.brandImage",
                language,
                "/kurdistan-cross-transparent.svg",
              ) || "").replace("/kurdistan-cross.jpg", "/kurdistan-cross-transparent.svg")}
              alt=""
              width="42"
              height="42"
            />
          )}
          <span>
            {t.name}
            <small lang="en" dir="ltr">
              {cms.text(
                "general.brandEnglish",
                language,
                "Rum Orthodoxy In Kurdistan",
              )}
            </small>
          </span>
          </>}
        </a>
        <nav
          aria-label={t.home}
          className={menu ? "navigation open" : "navigation"}
        >
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={publicHref(id)}
              className={page === id || (id === "saints" && page === "saint") ? "active" : ""}
              aria-current={page === id || (id === "saints" && page === "saint") ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="icon-button theme-toggle"
            href="#appearance"
            aria-label={t.appearance}
            title={t.appearance}
            aria-current={page === "appearance" ? "page" : undefined}
          >
            <Palette size={20} />
          </a>
          <a
            className="admin-signin"
            href="#admin"
            aria-label={
              account.session
                ? account.allowed
                  ? t.adminPanel
                  : t.account
                : t.signIn
            }
          >
            {account.allowed ? <ShieldCheck size={16} /> : <LogIn size={16} />}
            <span>
              {account.session
                ? account.allowed
                  ? t.adminPanel
                  : t.account
                : t.signIn}
            </span>
          </a>
          <select
            className="language"
            aria-label={t.languageLabel || t.chooseLanguage || "Language / زمان"}
            value={language}
            onChange={(e) => {
              const next = e.target.value;
              if (next === "ka" && page === "bible") location.hash = "bible?translation=ka_ogb&book=JHN&chapter=1";
              if (next === "ru" && page === "bible") location.hash = "bible?translation=ru_rst&book=JHN&chapter=1";
              setLanguage(next);
            }}
          >
            <option value="ckb">سۆرانی</option>
            <option value="en">English</option>
            <option value="ka">ქართული</option>
            <option value="ru">Русский</option>
          </select>
          <button
            className="mobile-menu icon-button"
            aria-label={
              menu ? t.closeMenu || "Close menu" : t.openMenu || "Open menu"
            }
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {journeyStorageError && <p className="journey-storage-alert" role="status">{journeyWords(language).storage}</p>}
      <main id="main" tabIndex={-1}>
        {cms.ready === null &&
        !["admin", "appearance", "bible"].includes(page) ? (
          <div className="page">
            <p role="status">{cms.error ? localizedError(cms.error, language) : t.loading}</p>
            {cms.error && (
              <button
                className="button"
                onClick={() => cms.refresh().catch(() => {})}
              >
                {t.retry}
              </button>
            )}
          </div>
        ) : page === "appearance" ? (
          <Appearance
            t={t}
            theme={theme}
            setTheme={setTheme}
            readerSize={readerSize}
            setReaderSize={setReaderSize}
            readerFont={readerFont}
            setReaderFont={setReaderFont}
            fontStatus={fontStatus}
            retryFont={() => setFontAttempt((value) => value + 1)}
          />
        ) : page === "home" ? (
          <OrthodoxHome t={t} language={language} journey={journey} onEditJourney={()=>setJourneyOpen(true)} />
        ) : page === "discover" ? (
          <DiscoverPage language={language} hideHeading />
        ) : page === "reading" ? (
          <ReadingLibrary language={language} />
        ) : page === "history" ? (
          <HistoryLibrary language={language} />
        ) : page === "saints" ? (
          cms.ready ? (
            <AuthorLibrary language={language} />
          ) : (
            <Saints language={language} />
          )
        ) : page === "saint" ? (
          (cms.ready || localSaintByIdentifier(new URLSearchParams(route.split("?")[1]).get("id"), cms.authors)) ? (
            <AuthorProfile language={language} route={route} />
          ) : (
            <SaintProfile language={language} route={route} />
          )
        ) : page === "article" || page === "writing" ? (
          <EditorialArticle
            language={language}
            route={route}
            writing={page === "writing"}
          />
        ) : cms.ready &&
          ["doctrine", "teachings", "councils"].includes(page) ? (
          <DoctrineLibrary
            key={page}
            language={language}
            category={page === "councils" ? "council" : "doctrine"}
          />
        ) : ["doctrine", "teachings", "councils", "about"].includes(page) ? (
          <OrthodoxStudy
            key={page}
            language={language}
            page={page === "doctrine" ? "teachings" : page}
            route={route}
          />
        ) : page === "bible" ? (
          <BibleReader key={language} t={t} language={language} />
        ) : page === "fathers" ? (
          cms.ready ? (
            <QuoteFeed language={language} />
          ) : (
            <Fathers t={t} language={language} />
          )
        ) : page === "prayers" ? (
          language === "ru" ? <RussianPrayerBook /> : cms.ready ? (
            <PrayerFeed t={t} language={language} />
          ) : (
            <Prayers t={t} language={language} />
          )
        ) : page === "ai" ? (
          <Chat key={language} t={t} language={language} />
        ) : page === "admin" ? (
          <Admin t={t} language={language} account={account} />
        ) : page === "sources" ? (
          <Sources t={t} language={language} />
        ) : (
          <div className="page">
            <a href="#home">{t.back}</a>
          </div>
        )}
      </main>
      <nav className="bottom-navigation" aria-label={t.mobileNavigation}>
        {[
          ["home", HomeIcon, t.home],
          ["bible", BookOpen, t.bible],
          ["discover", Library, cms.text("general.navDiscover", language, discoverWords(language).title)],
          ["saints", Church, cms.text("general.navSaints", language, language === "ckb" ? "پایەپیرۆزان" : language === "ka" ? "წმინდანები" : language === "ru" ? "Святые" : language === "kmr" ? "Pîroz" : "Saints")],
          ["prayers", Heart, t.prayers],
          ["appearance", Palette, t.appearance],
        ].map(([id, Icon, label]) => (
          <a
            key={id}
            href={publicHref(id)}
            className={page === id || (id === "saints" && page === "saint") ? "active" : ""}
            aria-current={page === id || (id === "saints" && page === "saint") ? "page" : undefined}
          >
            <Icon size={21} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            {(cms.text(
              "general.brandImage",
              language,
              "/kurdistan-cross-transparent.svg",
            ) || "").replace("/kurdistan-cross.jpg", "/kurdistan-cross-transparent.svg") && (
              <img
                className="brand-cross"
                src={(cms.text(
                  "general.brandImage",
                  language,
                  "/kurdistan-cross-transparent.svg",
                ) || "").replace("/kurdistan-cross.jpg", "/kurdistan-cross-transparent.svg")}
                alt=""
                width="42"
                height="42"
                loading="lazy"
              />
            )}
            <div>
              <strong>{t.name}</strong>
              <p>{t.footer}</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="/about/">
              {cms.text(
                "general.footerAbout",
                language,
                language === "ka" ? "ჩვენ შესახებ" : language === "ckb"
                  ? "دەربارەی ئێمە"
                  : language === "kmr"
                    ? "Derbarê me"
                    : "About",
              )}
            </a>
            <a href="/councils/">
              {cms.text(
                "general.footerCouncils",
                language,
                language === "ka" ? "მსოფლიო საეკლესიო კრებები" : language === "ckb"
                  ? "ئەنجومەنەکان"
                  : language === "kmr"
                    ? "Civînên gerdûnî"
                    : "Ecumenical Councils",
              )}
            </a>
            <button type="button" className="journey-footer-button" onClick={()=>setJourneyOpen(true)}>{journeyWords(language).edit}</button>
            <a href="/sources/">{t.sources}</a>
            <a href="#admin">{t.admin}</a>
            <span lang="en" dir="ltr">
              © {new Date().getFullYear()} {language === "ka" ? t.name : "Rum Orthodoxy In Kurdistan"}
            </span>
          </div>
        </div>
      </footer>
      {journeyOpen && page !== "admin" && <JourneyWelcome language={language} initial={journey} editing={!!journey?.completed} onLanguage={setLanguage} onComplete={finishJourney} onReset={resetJourney}/>}
    </>
  );
}
function Appearance({
  t,
  theme,
  setTheme,
  readerSize,
  setReaderSize,
  readerFont,
  setReaderFont,
  fontStatus,
  retryFont,
}) {
  return (
    <div className="page appearance-page">
      <div className="appearance-heading">
        <span className="eyebrow">
          <Settings2 size={15} />
          {t.personalSpace}
        </span>
        <h1>{t.appearance}</h1>
        <p>{t.appearanceIntro}</p>
      </div>
      <section className="appearance-section" aria-labelledby="palette-heading">
        <h2 id="palette-heading">
          <Palette size={21} />
          {t.displayColor}
        </h2>
        <div
          className="theme-grid"
          role="group"
          aria-labelledby="palette-heading"
        >
          {themes.map(({ id, preview }) => (
            <button
              key={id}
              type="button"
              className={`theme-card${theme === id ? " selected" : ""}`}
              aria-pressed={theme === id}
              onClick={() => setTheme(id)}
            >
              <span className="theme-swatch" style={{ background: preview }}>
                {theme === id && (
                  <span className="theme-check">
                    <Check size={22} />
                  </span>
                )}
              </span>
              <span className="theme-name">{t.themeNames[id]}</span>
            </button>
          ))}
        </div>
        <p className="settings-caption" role="status">
          {t.savedOnDevice}
        </p>
      </section>
      <FontPicker
        t={t}
        selected={readerFont}
        onChange={setReaderFont}
        status={fontStatus}
        onRetry={retryFont}
      />
      <section className="appearance-section" aria-labelledby="reader-heading">
        <h2 id="reader-heading">
          <BookOpen size={21} />
          {t.reading}
        </h2>
        <div className="reading-panel">
          <p>{t.readingSize}</p>
          <div
            className="size-options"
            role="group"
            aria-labelledby="reader-heading"
          >
            {[
              ["0.9", t.smallText],
              ["1", t.mediumText],
              ["1.15", t.largeText],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                aria-pressed={readerSize === value}
                className={readerSize === value ? "selected" : ""}
                onClick={() => setReaderSize(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="reading-preview">
            <Cross />
            <p>{t.principleBody}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PageHead({ icon: Icon, title, intro }) {
  return (
    <div className="page-heading">
      <Icon size={25} />
      <h1>{title}</h1>
      {intro && <p>{intro}</p>}
    </div>
  );
}
function Fathers({ t, language }) {
  const [loadError, setLoadError] = useState(null);
  const [quotes, setQuotes] = useState([]),
    [status, setStatus] = useState("loading"),
    [search, setSearch] = useState(""),
    [topic, setTopic] = useState("");
  const load = () => {
    setStatus("loading");
    setLoadError(null);
    api("/quotes")
      .then((d) => {
        setQuotes(d.quotes);
        setStatus("ready");
      })
      .catch((e) => {
        setLoadError(e);
        setStatus("error");
      });
  };
  useEffect(load, []);
  const filtered = quotes.filter(
    (q) =>
      (!topic || q.topic === topic) &&
      `${q.father} ${q.topic} ${q.text_ckb} ${q.text_kmr} ${q.text_en || ""}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  return (
    <div className="page">
      <PageHead icon={Library} title={t.fathersTitle} intro={t.fathersDesc} />
      <div className="filters">
        <label className="search">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
        </label>
        <select
          aria-label={t.topic}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="">{t.all}</option>
          {[...new Set(quotes.map((q) => q.topic))].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>
      {status === "loading" ? (
        <Empty icon={LoaderCircle} title={t.loading} />
      ) : status === "error" ? (
        <Empty
          icon={Library}
          title={loadError ? errorMessage(loadError, t) : t.error}
        >
          <button className="button" onClick={load}>
            {t.retry}
          </button>
        </Empty>
      ) : !filtered.length ? (
        <Empty icon={Library} title={quotes.length ? t.noResults : t.noQuotes}>
          <p>{!quotes.length && t.emptyQuotes}</p>
        </Empty>
      ) : (
        <div className="quotes-grid">
          {filtered.map((q) => (
            <article className="quote" key={q.id}>
              <span className="quote-mark">“</span>
              <blockquote>
                {q[`text_${language}`] ||
                  t.missingEnglish ||
                  copy.en.missingEnglish}
              </blockquote>
              <h3>{q.father}</h3>
              <p>{q.topic}</p>
              {q.source_url ? (
                <a href={q.source_url} target="_blank" rel="noreferrer">
                  {q.reference}
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span className="quote-reference">{q.reference}</span>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
function Empty({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      <Icon size={34} />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
function Prayers({ t, language }) {
  const [items, setItems] = useState([]),
    [status, setStatus] = useState("loading"),
    [error, setError] = useState(null),
    [search, setSearch] = useState(""),
    [topic, setTopic] = useState("");
  function load() {
    setStatus("loading");
    setError(null);
    api("/prayers")
      .then((d) => {
        setItems(d.prayers);
        setStatus("ready");
      })
      .catch((e) => {
        setError(e);
        setStatus("error");
      });
  }
  useEffect(load, []);
  const filtered = items.filter(
    (p) =>
      (!topic || p.topic === topic) &&
      `${p.title_ckb} ${p.title_kmr} ${p.title_en || ""} ${p.text_en || ""} ${p.text_ckb} ${p.text_kmr} ${p.topic}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  return (
    <div className="page">
      <PageHead icon={Heart} title={t.prayersTitle} intro={t.prayersIntro} />
      <p className="public-prayers-note">{t.prayersPublic}</p>
      <aside className="notice prayer-translation-note">
        <ShieldCheck size={20} />
        <p>{t.prayerTranslationNote}</p>
      </aside>
      <div className="filters">
        <label className="search">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t.prayerSearch}
            placeholder={t.prayerSearch}
          />
        </label>
        <select
          aria-label={t.topic}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="">{t.all}</option>
          {[...new Set(items.map((p) => p.topic))].map((v) => (
            <option key={v} value={v}>
              {language === "en"
                ? items.find((p) => p.topic === v)?.topic_en || v
                : v}
            </option>
          ))}
        </select>
      </div>
      {status === "loading" ? (
        <Empty icon={LoaderCircle} title={t.loading} />
      ) : error ? (
        <Empty icon={Heart} title={errorMessage(error, t)}>
          <button className="button" onClick={load}>
            {t.retry}
          </button>
        </Empty>
      ) : !filtered.length ? (
        <Empty icon={Heart} title={items.length ? t.noResults : t.noPrayers}>
          <p>{!items.length && t.emptyPrayers}</p>
        </Empty>
      ) : (
        <div className="prayer-list">
          {filtered.map((p) => (
            <details className="prayer" key={p.id}>
              <summary>
                <h2>{p[`title_${language}`] || p.title_kmr}</h2>
                <span>
                  {language === "en" ? p.topic_en || p.topic : p.topic}
                </span>
              </summary>
              <p className="prayer-text">
                {p[`text_${language}`] ||
                  t.missingEnglish ||
                  copy.en.missingEnglish}
              </p>
              <a
                className="text-link"
                href={p.source_url}
                target="_blank"
                rel="noreferrer"
              >
                {p.reference}
                <ExternalLink size={15} />
              </a>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
function Chat({ t, language }) {
  const [question, setQuestion] = useState(""),
    [messages, setMessages] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    if (busy || question.trim().length < 3) return;
    const q = question.trim();
    setBusy(true);
    setError("");
    try {
      const result = await api("/chat", {
        method: "POST",
        body: JSON.stringify({ question: q, language }),
      });
      setMessages((m) => [...m, { question: q, ...result }]);
      setQuestion("");
    } catch (err) {
      setError(errorMessage(err, t));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page chat-page">
      <PageHead icon={MessageCircle} title={t.aiTitle} intro={t.aiIntro} />
      <div className="chat-layout">
        <section className="chat-panel">
          <div className="chat-top">
            <span className="status-dot" />
            {t.ai}
            <ShieldCheck size={17} />
          </div>
          <div className="messages" aria-live="polite">
            {!messages.length ? (
              <div className="chat-welcome">
                <Cross />
                <h2>{t.ask}</h2>
                <p>{t.sourcePolicy}</p>
                <div className="suggestions">
                  {t.examples.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuestion(q);
                        document.getElementById("question").focus();
                      }}
                    >
                      {q}
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div className="exchange" key={i}>
                  <div className="user-message">
                    <small>{t.you}</small>
                    <p>{m.question}</p>
                  </div>
                  <div className="answer-message">
                    <strong>{t.answer}</strong>
                    {m.mode === "ai-explanation" && <p className="ai-answer-label" role="note">{{
                      en: "AI explanation · No verified source was found for this answer.",
                      ka: "AI განმარტება · ამ პასუხისთვის გადამოწმებული წყარო ვერ მოიძებნა.",
                      ckb: "ڕوونکردنەوەی AI · بۆ ئەم وەڵامە سەرچاوەیەکی پشتڕاستکراوە نەدۆزرایەوە.",
                      kmr: "Şîroveya AI · Ji bo vê bersivê çavkaniyeke piştrastkirî nehat dîtin.",
                    }[language]}</p>}
                    <p>{m.answer}</p>
                    {m.citations.length > 0 && (
                      <div className="citations">
                        <span>{t.sources}</span>
                        {m.citations.map((s) => (
                          <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {s.title}
                            <ExternalLink size={13} />
                            <small>{s.publisher}</small>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {busy && (
              <p className="loading">
                <LoaderCircle size={18} className="spin" />
                {t.thinking}
              </p>
            )}
          </div>
          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}
          <form className="chat-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="question">
              {t.prompt}
            </label>
            <textarea
              id="question"
              placeholder={t.prompt}
              value={question}
              maxLength={1500}
              rows={2}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              className="button"
              disabled={busy || question.trim().length < 3}
              aria-label={t.send}
              title={t.send}
            >
              <Send size={21} />
            </button>
          </form>
        </section>
        <aside className="chat-sidebar">
          <ShieldCheck size={26} />
          <h2>{t.sources}</h2>
          <p>{t.sourcePolicy}</p>
          <a href="#sources" className="text-link">
            {t.sources}
            <ArrowUpRight size={17} />
          </a>
          <div className="sidebar-rule" />
          <p>{t.aiNotice}</p>
        </aside>
      </div>
    </div>
  );
}
function Sources({ t, language }) {
  const [sources, setSources] = useState([]),
    [error, setError] = useState("");
  useEffect(() => {
    api("/sources")
      .then((d) => setSources(d.sources))
      .catch(() => setError(t.error));
  }, [t]);
  return (
    <section className="page sources-page">
      <PageHead icon={ShieldCheck} title={t.sources} intro={t.sourcePolicy} />
      {error && <p role="alert">{error}</p>}
      <div className="source-list">
        {sources.map((s) => (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer">
            <div>
              <h2>{metadataFor(s, "title", language)}</h2>
              <p>{metadataFor(s, "publisher", language)}</p>
            </div>
            <ExternalLink size={19} />
          </a>
        ))}
      </div>
    </section>
  );
}
const blankQuote = {
  text_en: "",
  father: "",
  text_ckb: "",
  text_kmr: "",
  reference: "",
  topic: "",
  published: false,
};
const blankSource = {
  title: "",
  publisher: "",
  url: "",
  content: "",
  content_ckb: "",
  content_kmr: "",
  keywords: "",
  approved: false,
};
const blankPrayer = {
  title_en: "",
  text_en: "",
  title_ckb: "",
  title_kmr: "",
  text_ckb: "",
  text_kmr: "",
  reference: "",
  source_url: "",
  topic: "",
  published: false,
};
function Admin({ t, language, account }) {
  const { session, checking, allowed, error: accountError } = account;
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const result = await auth.auth.signInWithPassword({
        email: form.get("email"),
        password: form.get("password"),
      });
      if (result.error) throw result.error;
    } catch (e) {
      setError(localizedError(e, language));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page admin-page">
      {checking ? (
        <p>{t.loading}</p>
      ) : !auth ? (
        <aside className="notice">{t.setup}</aside>
      ) : !session ? (
        <form className="login-form" onSubmit={login}>
          <h1>{t.login}</h1>
          <p>{t.ownerOnly}</p>
          <label>
            {t.email}
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              dir="ltr"
            />
          </label>
          <label>
            {t.password}
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              dir="ltr"
            />
          </label>
          <button className="button" disabled={busy}>
            {busy ? t.loading : t.signIn}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-toolbar">
            <span dir="ltr">{session.user.email}</span>
            <button
              className="text-link"
              onClick={async () => {
                const r = await auth.auth.signOut();
                if (r.error) setError(r.error.message);
              }}
            >
              <LogOut size={16} />
              {t.signOut}
            </button>
          </div>
          {allowed ? (
            <React.Suspense fallback={<p>{t.loading}</p>}>
              <AdminWorkspace
                ownerId={session.user.id}
                token={session.access_token}
                language={language}
              />
            </React.Suspense>
          ) : (
            !accountError && <p role="status">{t.loading}</p>
          )}
        </>
      )}
      {(error || accountError) && (
        <div className="error" role="alert">
          {error || errorMessage(accountError, t)}
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EditorialProvider>
      <App />
    </EditorialProvider>
  </React.StrictMode>,
);
