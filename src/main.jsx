import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
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
} from "lucide-react";
import { copy } from "./i18n";
import { api, auth } from "./api";
import { useAccount } from "./use-account";
import "./style.css";
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
  const account = useAccount();
  const [language, setLanguage] = useState(() => {
    const requested =
      new URLSearchParams(location.search).get("lang") ||
      localStorage.getItem("language");
    return Object.hasOwn(copy, requested) ? requested : "ckb";
  });
  const [page, setPage] = useState(() => location.hash.slice(1) || "home");
  const [menu, setMenu] = useState(false);
  const t = copy[language];
  useEffect(() => {
    const handle = () => {
      setPage(location.hash.slice(1) || "home");
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ckb" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);
  const nav = [
    ["home", t.home],
    ["bible", t.bible],
    ["fathers", t.fathers],
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
        <a href="#home" className="brand">
          <img
            className="brand-cross"
            src="/kurdistan-cross.jpg"
            alt=""
            width="42"
            height="42"
          />
          <span>
            {t.name}
            <small lang="en" dir="ltr">
              Orthodoxy in Kurdistan
            </small>
          </span>
        </a>
        <nav
          aria-label={t.home}
          className={menu ? "navigation open" : "navigation"}
        >
          {nav.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={page === id ? "active" : ""}
              aria-current={page === id ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
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
            aria-label={t.chooseLanguage || "Language / زمان"}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ckb">سۆرانی</option>
            <option value="kmr">Kurmancî</option>
            <option value="en">English</option>
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
      <main id="main" tabIndex={-1}>
        {page === "home" ? (
          <Home t={t} />
        ) : page === "bible" ? (
          <Bible t={t} />
        ) : page === "fathers" ? (
          <Fathers t={t} language={language} />
        ) : page === "prayers" ? (
          <Prayers t={t} language={language} />
        ) : page === "ai" ? (
          <Chat key={language} t={t} language={language} />
        ) : page === "admin" ? (
          <Admin t={t} language={language} account={account} />
        ) : page === "sources" ? (
          <Sources t={t} />
        ) : (
          <div className="page">
            <a href="#home">{t.back}</a>
          </div>
        )}
      </main>
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <img
              className="brand-cross"
              src="/kurdistan-cross.jpg"
              alt=""
              width="42"
              height="42"
              loading="lazy"
            />
            <div>
              <strong>{t.name}</strong>
              <p>{t.footer}</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#sources">{t.sources}</a>
            <a href="#admin">{t.admin}</a>
            <span lang="en" dir="ltr">
              © {new Date().getFullYear()} Orthodoxy in Kurdistan
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
function Home({ t }) {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <div className="welcome">
            <span />
            {t.welcome}
          </div>
          <h1>{t.hero}</h1>
          <p>{t.intro}</p>
          <div className="hero-actions">
            <a className="button gold" href="#bible">
              <BookOpen size={19} />
              {t.read}
            </a>
            <a className="text-link" href="#ai">
              {t.ask}
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="hero-note">
            <ShieldCheck size={17} />
            {t.sourcePolicy}
          </div>
        </div>
        <div className="sacred-art kurdistan-art">
          <img
            className="kurdistan-cross"
            src="/kurdistan-cross.jpg"
            alt="Kurdistan cross"
            width="960"
            height="960"
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="explore-section">
        <div className="section-heading">
          <h2>{t.journey}</h2>
          <p>{t.journeyBody}</p>
        </div>
        <div className="paths">
          {[
            ["bible", BookOpen, t.bible, t.bibleDesc],
            ["fathers", Library, t.fathers, t.fathersDesc],
            ["ai", MessageCircle, t.ai, t.aiDesc],
            ["prayers", Heart, t.prayers, t.prayersIntro],
          ].map(([id, Icon, title, desc]) => (
            <a className="path" key={id} href={`#${id}`}>
              <Icon className="path-icon" size={28} />
              <h3>{title}</h3>
              <p>{desc}</p>
              <span>
                {t.explore}
                <ArrowUpRight size={18} />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="principle">
        <Cross />
        <div>
          <h2>{t.principle}</h2>
          <p>{t.principleBody}</p>
        </div>
      </section>
    </>
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
function Bible({ t }) {
  return (
    <div className="page">
      <PageHead icon={BookOpen} title={t.bibleTitle} intro={t.bibleIntro} />
      <div className="bible-editions">
        {[
          [
            t.soraniBible,
            t.kss,
            t.kssInfo,
            "KSS",
            "https://www.biblegateway.com/versions/Kurdi-Sorani-Standard-KSS-Bible",
          ],
          [
            t.kurmanjiBible,
            t.kurnt,
            t.kurInfo,
            "KURNT",
            "https://www.bible.com/versions/251",
          ],
        ].map(([title, name, desc, code, url]) => (
          <article className="edition" key={code}>
            <div className="book-cover">
              <Cross />
              <span dir="ltr">{code}</span>
            </div>
            <div>
              <h2>{title}</h2>
              <h3>{name}</h3>
              <p>{desc}</p>
              <a className="button" href={url} target="_blank" rel="noreferrer">
                {t.openBible}
                <ExternalLink size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <aside className="notice">
        <ShieldCheck size={22} />
        <p>{t.bibleNotice}</p>
      </aside>
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
              <a href={q.source_url} target="_blank" rel="noreferrer">
                {q.reference}
                <ExternalLink size={14} />
              </a>
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
function Sources({ t }) {
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
              <h2>{s.title}</h2>
              <p>{s.publisher}</p>
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
  source_url: "",
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
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [tab, setTab] = useState("quotes"),
    [items, setItems] = useState([]),
    [editing, setEditing] = useState(null),
    [notice, setNotice] = useState(""),
    [listLoading, setListLoading] = useState(false);
  const token = session?.access_token;
  async function load() {
    setListLoading(true);
    try {
      const d = await api(`/admin/${tab}`, { token });
      setItems(d.items);
    } catch (e) {
      setError(errorMessage(e, t));
    } finally {
      setListLoading(false);
    }
  }
  useEffect(() => {
    setEditing(null);
    setItems([]);
    setNotice("");
    if (allowed) load();
  }, [allowed, tab, token]);
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const { error } = await auth.auth.signInWithPassword({
        email: form.get("email"),
        password: form.get("password"),
      });
      if (error) throw error;
    } catch (e) {
      setError(errorMessage(e, t));
    } finally {
      setBusy(false);
    }
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { id, created_at, ...body } = editing;
      await api(`/admin/${tab}${id ? `/${id}` : ""}`, {
        method: id ? "PATCH" : "POST",
        token,
        body: JSON.stringify(body),
      });
      setEditing(null);
      setNotice(t.saved);
      await load();
    } catch (e) {
      setError(errorMessage(e, t));
    } finally {
      setBusy(false);
    }
  }
  async function remove(item) {
    if (!window.confirm(t.confirmDelete)) return;
    setBusy(true);
    setError("");
    try {
      await api(`/admin/${tab}/${item.id}`, { method: "DELETE", token });
      setNotice(t.deleted);
      await load();
    } catch (e) {
      setError(errorMessage(e, t));
    } finally {
      setBusy(false);
    }
  }
  const fields =
    tab === "quotes"
      ? [
          ["father", t.father],
          ["text_ckb", t.textCkb, "textarea"],
          ["text_kmr", t.textKmr, "textarea"],
          ["text_en", t.textEn || copy.en.textEn, "textarea"],
          ["reference", t.ref],
          ["source_url", t.url, "url"],
          ["topic", t.topic],
        ]
      : tab === "prayers"
        ? [
            ["title_ckb", t.titleCkb],
            ["title_kmr", t.titleKmr],
            ["title_en", t.titleEn || copy.en.titleEn],
            ["text_ckb", t.textCkb, "textarea"],
            ["text_kmr", t.textKmr, "textarea"],
            ["text_en", t.textEn || copy.en.textEn, "textarea"],
            ["reference", t.ref],
            ["source_url", t.url, "url"],
            ["topic", t.topic],
          ]
        : [
            ["title", t.title],
            ["publisher", t.publisher],
            ["url", t.url, "url"],
            ["content", t.content, "textarea"],
            ["content_ckb", t.textCkb, "textarea"],
            ["content_kmr", t.textKmr, "textarea"],
            ["keywords", t.keywords, "textarea"],
          ];
  const toggle = tab === "sources" ? "approved" : "published";
  return (
    <div className="page admin-page">
      <PageHead icon={ShieldCheck} title={t.manage} />
      {checking ? (
        <p>{t.loading}</p>
      ) : !auth ? (
        <aside className="notice">{t.setup}</aside>
      ) : !session ? (
        <form className="login-form" onSubmit={login}>
          <h2>{t.login}</h2>
          <p className="owner-note">{t.ownerOnly}</p>
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
                setError("");
                const { error } = await auth.auth.signOut();
                if (error) setError(error.message);
              }}
            >
              <LogOut size={16} />
              {t.signOut}
            </button>
          </div>
          {allowed && (
            <>
              <div className="tabs">
                <button
                  className={tab === "prayers" ? "selected" : ""}
                  onClick={() => setTab("prayers")}
                >
                  {t.prayers}
                </button>
                <button
                  className={tab === "quotes" ? "selected" : ""}
                  onClick={() => setTab("quotes")}
                >
                  {t.quotesTab}
                </button>
                <button
                  className={tab === "sources" ? "selected" : ""}
                  onClick={() => setTab("sources")}
                >
                  {t.sourcesTab}
                </button>
              </div>
              <p className="editor-note">{t.sourceHint}</p>
              {editing ? (
                <form className="editor" onSubmit={save}>
                  {fields.map(([key, label, type]) => (
                    <label key={key}>
                      {label}
                      {type === "textarea" ? (
                        <textarea
                          required={!["text_en", "title_en"].includes(key)}
                          rows={key === "content" ? 7 : 4}
                          value={editing[key] || ""}
                          dir={
                            key === "text_ckb" || key === "content_ckb"
                              ? "rtl"
                              : key === "text_kmr" ||
                                  key === "content_kmr" ||
                                  key.endsWith("_en")
                                ? "ltr"
                                : undefined
                          }
                          maxLength={
                            key.startsWith("content") ||
                            (tab === "prayers" && key.startsWith("text_"))
                              ? 12000
                              : key === "keywords"
                                ? 1500
                                : 5000
                          }
                          onChange={(e) =>
                            setEditing({ ...editing, [key]: e.target.value })
                          }
                        />
                      ) : (
                        <input
                          required={!["text_en", "title_en"].includes(key)}
                          type={type || "text"}
                          value={editing[key] || ""}
                          dir={type === "url" ? "ltr" : undefined}
                          maxLength={
                            key === "father"
                              ? 160
                              : key === "reference"
                                ? 500
                                : key === "topic"
                                  ? 100
                                  : 2000
                          }
                          onChange={(e) =>
                            setEditing({ ...editing, [key]: e.target.value })
                          }
                        />
                      )}
                    </label>
                  ))}
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={editing[toggle]}
                      onChange={(e) =>
                        setEditing({ ...editing, [toggle]: e.target.checked })
                      }
                    />
                    {t[toggle]}
                  </label>
                  <div className="editor-actions">
                    <button className="button" disabled={busy}>
                      {t.save}
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      disabled={busy}
                      onClick={() => setEditing(null)}
                    >
                      {t.cancel}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <button
                    className="button"
                    onClick={() =>
                      setEditing({
                        ...(tab === "quotes"
                          ? blankQuote
                          : tab === "prayers"
                            ? blankPrayer
                            : blankSource),
                      })
                    }
                  >
                    <Plus size={18} />
                    {t.add}
                  </button>
                  {listLoading ? (
                    <p>{t.loading}</p>
                  ) : (
                    <div className="admin-list">
                      {!items.length && <p>{t.noRecords}</p>}
                      {items.map((item) => (
                        <article key={item.id}>
                          <div>
                            <strong>
                              {item.father ||
                                item.title ||
                                item[`title_${language}`] ||
                                item.title_ckb}
                            </strong>
                            <p className="record-preview">
                              {item[`text_${language}`] ||
                                item.content ||
                                t.missingEnglish ||
                                copy.en.missingEnglish}
                            </p>
                            <span
                              className={
                                item[toggle] ? "badge approved" : "badge"
                              }
                            >
                              {item[toggle] ? t[toggle] : t.draft}
                            </span>
                          </div>
                          <div className="record-actions">
                            <button
                              className="icon-button"
                              title={t.edit}
                              aria-label={t.edit}
                              onClick={() => setEditing({ ...item })}
                            >
                              <PenLine size={18} />
                            </button>
                            <button
                              className="icon-button danger"
                              title={t.remove}
                              aria-label={t.remove}
                              disabled={busy}
                              onClick={() => remove(item)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      {(error || accountError) && (
        <div className="error" role="alert">
          {error || (accountError && errorMessage(accountError, t))}
        </div>
      )}
      {notice && (
        <p className="success" role="status">
          <Check size={17} />
          {notice}
        </p>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
