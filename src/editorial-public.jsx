import { saintThumbnail } from "./localized-saint-names.js";
import { saintScriptureQuotes, mergeSaintQuotes, saintQuoteLabel } from "./saint-scripture-quotes.js";
import { withVerifiedIcon } from "./saint-icons-2026.js";
import React, { useEffect, useState } from "react";
import { withClimacusContent } from "./climacus-content.js";
import { mergeSaintLibrary, localSaintByIdentifier } from "./additional-saints-2026.js";
import { withExpandedBiography } from "./expanded-saint-biographies.js";
import { withRemainingBiography, extraSaintSources } from "./remaining-saint-biographies.js";
import { ArrowUpRight, BookOpen, Bookmark, Check, Search } from "lucide-react";
import {
  useEditorial,
  useEditorialResource,
  useEditorialWords,
} from "./editorial-context.jsx";
import {
  authorName,
  matchesAuthor,
  profileHref,
  textFor,
  metadataFor,
  localizedError,
} from "./editorial.js";
export function ResourceState({ resource, language }) {
  const w = useEditorialWords(language);
  return (
    <div
      className={resource.error ? "error" : "empty"}
      role={resource.error ? "alert" : "status"}
    >
      <p>{resource.error?.message || w.loading}</p>
      {resource.error && (
        <button className="button secondary" onClick={resource.retry}>
          {w.retry}
        </button>
      )}
    </div>
  );
}
export function AuthorCard({ author, language }) {
  author = withVerifiedIcon(withClimacusContent(author));
  const w = useEditorialWords(language);
  return (
    <a className="saint-card author-library-card" href={profileHref(author)}>
      <div className={"saint-image"+(saintThumbnail(author).portrait?" portrait-crop":"")}>
        {author.icon_url ? (
          <img
            src={author.icon_url}
            alt={metadataFor(author, "icon_alt", language) || authorName(author, language)}
            width="480"
            height="600"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <BookOpen size={42} />
        )}
      </div>
      <div className="saint-card-copy">
        <h3>{authorName(author, language)}</h3>
        {textFor(author, "title", language) && (
          <p className="traditional-title">
            {textFor(author, "title", language)}
          </p>
        )}
        {textFor(author, "position", language) && (
          <p>{textFor(author, "position", language)}</p>
        )}
        {textFor(author, "summary", language) && (
          <p className="saint-card-summary">
            {textFor(author, "summary", language)}
          </p>
        )}
        {textFor(author, "feast", language) && (
          <p>{textFor(author, "feast", language)}</p>
        )}
        <div className="author-counts">
          <span>
            {Math.max(author.quote_count || 0, saintScriptureQuotes(author).length)} {w.quotesCount}
          </span>
          <span>
            {author.writing_count || 0} {w.writingsCount}
          </span>
        </div>
        <span>
          {w.read}
          <ArrowUpRight size={16} />
        </span>
      </div>
    </a>
  );
}
export function AuthorLibrary({ language }) {
  const cms = useEditorial(),
    w = useEditorialWords(language);
  const [search, setSearch] = useState(""),
    [savedOnly, setSavedOnly] = useState(false);
  const saved = (author) => {
    try {
      return (
        localStorage.getItem(`saint:${author.id}:saved`) === "true" ||
        localStorage.getItem(`saint:${author.slug}:saved`) === "true"
      );
    } catch {
      return false;
    }
  };
  const rows = mergeSaintLibrary(cms.authors).filter(
    (a) => matchesAuthor(a, search) && (!savedOnly || saved(a)),
  );
  return (
    <div className="page heritage-page saints-directory">
      <header className="heritage-heading">
        <span className="eyebrow">
          {cms.text("general.synaxarionLabel", language, "EASTERN ORTHODOX SYNAXARION")}
        </span>
        <h1>{w.libraryTitle}</h1>
        <p>{w.libraryIntro}</p>
        {language === "ru" && <p className="settings-caption">Дни памяти приведены по церковному календарю. Гражданская дата зависит от календаря конкретной Церкви.</p>}
        {language === "ka" && <p className="settings-caption">ხსენების დღეები მითითებულია საეკლესიო თარიღით. იულიუსის კალენდრის მიმდევარ ეკლესიებში სამოქალაქო თარიღი ამჟამად 13 დღით გვიან დგება.</p>}
      </header>
      <div className="directory-tools">
        <label className="saint-search">
          <Search size={18} />
          <input
            type="search"
            aria-label={w.searchSaints}
            placeholder={w.searchSaints}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button
          className="profile-save"
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly((v) => !v)}
        >
          <Bookmark size={16} />
          {w.savedProfiles}
        </button>
      </div>
      {cms.error && (
        <p className="error" role="alert">
          {localizedError(cms.error, language)}
        </p>
      )}
      <div className="saints-grid">
        {rows.map((a) => (
          <AuthorCard key={a.id} author={a} language={language} />
        ))}
      </div>
      {!rows.length && <p role="status">{w.noMatches}</p>}
    </div>
  );
}
export function QuoteCard({ quote, language }) {
  const w = useEditorialWords(language);
  return (
    <article className="quote shared-quote">
      {language === "ka" && quote.review_note_ka && <p className="editorial-review-note" role="note">{quote.review_note_ka}</p>}
      {quote.id?.startsWith("scripture-saint-") && <p className="editorial-note">{saintQuoteLabel(language)}</p>}
      <span className="quote-mark">“</span>
      <blockquote>
        {textFor(quote, "text", language) || (quote.kind && quote.id?.startsWith("scripture-saint-") ? quote.text_en : w.missingTranslation)}
      </blockquote>
      <h3>
        {quote.author ? (
          <a href={profileHref(quote.author)}>
            {authorName(quote.author, language)}
          </a>
        ) : (
          quote.father
        )}
      </h3>
      <p>{metadataFor(quote, "topic", language)}</p>
      <details className="source-disclosure"><summary>{w.source}</summary>
      {quote.source_url ? (
        <a href={quote.source_url} target="_blank" rel="noreferrer">
          {metadataFor(quote, "reference", language)}
          <ArrowUpRight size={14} />
        </a>
      ) : (
        <p className="quote-reference">{metadataFor(quote, "reference", language)}</p>
      )}</details>
    </article>
  );
}
export function QuoteFeed({ language, authorId = null, author = null }) {
  const w = useEditorialWords(language),
    cms = useEditorial();
  const [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [topic, setTopic] = useState("");
  const params = new URLSearchParams({ limit: "100", page: String(page) });
  if (authorId) params.set("author_id", authorId);
  if (search) params.set("q", search);
  if (topic) params.set("topic", topic);
  const resource = useEditorialResource("/quotes?" + params, {enabled:!author?.local_library}),
    data = author?.local_library ? {quotes:[],total:0} : resource.data;
  const supplemental = saintScriptureQuotes(author).filter(q=>!search || (q.text_en+" "+q.text_ckb+" "+q.reference).toLowerCase().includes(search.toLowerCase()));
  const quotes = mergeSaintQuotes(data?.quotes, page===1 ? supplemental : []);
  useEffect(() => {
    if (data?.total && page > Math.ceil(data.total / 100))
      setPage(Math.ceil(data.total / 100));
  }, [data?.total, page]);
  return (
    <section className={authorId ? "profile-quote-feed" : "page"}>
      {!authorId && (
        <header className="heritage-heading">
          <h1>{cms.text("ui.fathersTitle", language, w.quotes)}</h1>
          <p>{cms.text("ui.fathersDesc", language, "")}</p>
        </header>
      )}
      <label className="search editorial-search">
        <Search size={18} />
        <input
          type="search"
          aria-label={w.search}
          placeholder={w.search}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </label>
      {!authorId && (
        <select
          className="editorial-topic"
          aria-label={cms.text("ui.topic", language, "Topic")}
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{cms.text("ui.all", language, w.all)}</option>
          {data?.topics?.map((value) => (
            <option key={value} value={value}>
              {language === "ka" ? data.topicTranslations?.[value] || w.all : value}
            </option>
          ))}
        </select>
      )}
      {resource.error && (
        <ResourceState resource={resource} language={language} />
      )}
      {resource.loading && !data && !quotes.length ? (
        <ResourceState resource={resource} language={language} />
      ) : (
        <>
          <div className="quotes-grid">
            {quotes.map((q) => (
              <QuoteCard key={q.id} quote={q} language={language} />
            ))}
          </div>
          {!quotes.length && <p role="status">{w.empty}</p>}
          {(data?.total || 0) > 100 && (
            <div className="editorial-pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {w.previous}
              </button>
              <span>
                {page} / {Math.ceil(data.total / 100)}
              </span>
              <button
                disabled={page * 100 >= data.total}
                onClick={() => setPage((p) => p + 1)}
              >
                {w.next}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
export function WritingList({ language, authorId }) {
  const w = useEditorialWords(language),
    [page, setPage] = useState(1);
  const resource = useEditorialResource(
    `/writings?author_id=${authorId}&page=${page}&limit=100`,
  );
  if (!resource.data)
    return <ResourceState resource={resource} language={language} />;
  return (
    <section>
      {resource.error && (
        <ResourceState resource={resource} language={language} />
      )}
      <div className="writing-list">
        {resource.data.items.map((item) => (
          <a
            className="lesson-card"
            key={item.id}
            href={`#writing?id=${item.id}`}
          >
            <h3>{textFor(item, "title", language) || w.missingTranslation}</h3>
            <p>{textFor(item, "subtitle", language)}</p>
            <span className="text-link">
              {w.read}
              <ArrowUpRight size={16} />
            </span>
          </a>
        ))}
      </div>
      {!resource.data.items.length && <p>{w.empty}</p>}
      {resource.data.total > 100 && (
        <div className="editorial-pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            {w.previous}
          </button>
          <span>{page}</span>
          <button
            disabled={page * 100 >= resource.data.total}
            onClick={() => setPage((p) => p + 1)}
          >
            {w.next}
          </button>
        </div>
      )}
    </section>
  );
}
export function AuthorProfile({ language, route }) {
  const cms = useEditorial(),
    w = useEditorialWords(language),
    params = new URLSearchParams(route.split("?")[1]);
  const identifier = params.get("id") || "",
    tab = ["quotes", "writings"].includes(params.get("tab"))
      ? params.get("tab")
      : "bio";
  const localAuthor = localSaintByIdentifier(identifier, cms.authors);
  const resource = useEditorialResource(
      "/authors/" + encodeURIComponent(identifier), { enabled: !localAuthor },
    ),
    a = withVerifiedIcon(localAuthor || withRemainingBiography(withExpandedBiography(withClimacusContent(resource.data?.author))));
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!a) return;
    try {
      setSaved(
        localStorage.getItem(`saint:${a.id}:saved`) === "true" ||
          localStorage.getItem(`saint:${a.slug}:saved`) === "true",
      );
      localStorage.setItem("lastSaint", a.slug);
    } catch {}
  }, [a?.id]);
  if (!a)
    return (
      <div className="page">
        <ResourceState resource={resource} language={language} />
        <a className="text-link" href="#saints">
          {w.back}
        </a>
      </div>
    );
  const toggle = () => {
    setSaved(!saved);
    try {
      for (const key of [a.id, a.slug])
        localStorage.setItem(`saint:${key}:saved`, String(!saved));
    } catch {}
  };
  const related = cms.doctrines.filter((d) =>
    d.doctrine_authors?.some((link) => link.author_id === a.id),
  );
  return (
    <article className="page heritage-page saint-profile">
      <a className="text-link" href="#saints">
        ← {cms.text("saints.all", language, w.back)}
      </a>
      {!localAuthor && resource.error && (
        <ResourceState resource={resource} language={language} />
      )}
      <header className="profile-header">
        <figure>
          <div className="saint-portrait">
          {a.icon_url ? (
            <img
              className="profile-icon"
              src={a.icon_url}
              alt={metadataFor(a, "icon_alt", language) || authorName(a, language)}
              width="720"
              height="960"
              fetchPriority="high"
            />
          ) : (
            <BookOpen size={64} />
          )}
          </div>
          {a.icon_url && <figcaption className="editorial-verbatim"><details className="source-disclosure"><summary>{w.iconCredit}</summary>
            {metadataFor(a, "icon_credit", language)}
            {a.icon_source && (
              <>
                {" "}
                ·{" "}
                <a href={a.icon_source} target="_blank" rel="noreferrer">
                  {w.source} ↗
                </a>
              </>
            )}
            {a.icon_license_url && (
              <>
                {" "}
                ·{" "}
                <a href={a.icon_license_url} target="_blank" rel="noreferrer">
                  {w.iconLicense} ↗
                </a>
              </>
            )}
          </details></figcaption>}
        </figure>
        <div className="profile-heading">
          <span className="eyebrow">
            {cms.text(
              "general.synaxarionLabel",
              language,
              language === "ru" ? "ПРАВОСЛАВНЫЕ ЖИТИЯ СВЯТЫХ" : "EASTERN ORTHODOX SYNAXARION",
            )}
          </span>
          <h1>{authorName(a, language)}</h1>
          {textFor(a, "title", language) && (
            <p>{textFor(a, "title", language)}</p>
          )}
          {textFor(a, "position", language) && (
            <p>{textFor(a, "position", language)}</p>
          )}
          <dl className="saint-facts">
            {[
              [w.lifeDates, textFor(a, "life_dates", language)],
              [w.birth, metadataFor(a, "birth_info", language)],
              [w.death, metadataFor(a, "death_info", language)],
              [w.feast, textFor(a, "feast", language)],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd className="editorial-verbatim">{value}</dd>
                </div>
              ))}
          </dl>
          <button
            className="profile-save"
            aria-pressed={saved}
            onClick={toggle}
          >
            {saved ? <Check size={16} /> : <Bookmark size={16} />}{" "}
            {saved ? w.saved : w.saveProfile}
          </button>
        </div>
      </header>
      {<nav className="profile-tabs" aria-label={w.details}>
        {[
          ["bio", w.biography],
          ["quotes", w.quotesLabel],
          ...(!localAuthor ? [["writings", `${w.writingsLabel} (${a.writing_count || 0})`]] : []),
        ].map(([id, label]) => (
          <a
            key={id}
            href={`${profileHref(a)}${id === "bio" ? "" : `&tab=${id}`}`}
            aria-current={tab === id ? "page" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>}
      {tab === "quotes" ? (
        <QuoteFeed key={a.id} language={language} authorId={a.id} author={a} />
      ) : !localAuthor && tab === "writings" ? (
        <div className="profile-body">
          <h2>{w.writingsLabel}</h2>
          <p className="editorial-verbatim">
            {textFor(a, "writings_intro", language)}
          </p>
          <WritingList key={a.id} language={language} authorId={a.id} />
        </div>
      ) : (
        <div className="profile-body saint-biography">
          {[
            [w.biography, "biography"],
            [w.historyText, "history"],
            [w.contributions, "contributions"],
            [w.writingsLabel, "writings_intro"],
          ].filter(([, base]) => !localAuthor || base === "biography").map(([title, base]) => (
            <section key={base}>
              <h2>{title}</h2>
              <p className="editorial-verbatim">
                {textFor(a, base, language) || w.missingTranslation}
              </p>
            </section>
          ))}
          {<a className="button gold" href={`${profileHref(a)}&tab=quotes`}>
            {w.quotesLabel}<ArrowUpRight size={16} />
          </a>}
        </div>
      )}
      {related.length > 0 && (
        <section className="profile-body">
          <h2>{w.doctrineTitle}</h2>
          {related.map((d) => (
            <p key={d.id}>
              <a className="text-link" href={`#article?id=${d.slug}`}>
                {textFor(d, "title", language) || w.missingTranslation} ↗
              </a>
            </p>
          ))}
        </section>
      )}
      {(a.source_reference || a.source_url || extraSaintSources(a).length > 0) && (
        <details className="profile-sources source-disclosure">
          <summary>{w.source}</summary>
          <p className="editorial-verbatim">{metadataFor(a, "source_reference", language)}</p>
          {extraSaintSources(a).map(url => <p key={url}><a className="text-link" href={url} target="_blank" rel="noreferrer">{new URL(url).hostname} ↗</a></p>)}
          {a.source_url && (
            <a href={a.source_url} target="_blank" rel="noreferrer">
              {w.read} ↗
            </a>
          )}
        </details>
      )}
    </article>
  );
}
export function DoctrineLibrary({ language, category = "doctrine" }) {
  const cms = useEditorial(),
    w = useEditorialWords(language),
    [search, setSearch] = useState("");
  const items = cms.doctrines.filter(
    (d) =>
      d.category === category &&
      `${d.title_en} ${d.title_ckb} ${d.title_kmr} ${d.title_ka || ""} ${d.subtitle_ka || ""} ${d.subtitle_en} ${d.subtitle_ckb}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  return (
    <div className="page heritage-page">
      <header className="heritage-heading">
        <h1>
          {category === "council"
            ? cms.text("home.councils", language, w.doctrineTitle)
            : w.doctrineTitle}
        </h1>
        <p>
          {category === "council"
            ? cms.text("home.councilSub", language, "")
            : w.doctrineIntro}
        </p>
      </header>
      <label className="search editorial-search">
        <Search size={18} />
        <input
          type="search"
          placeholder={w.search}
          aria-label={w.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {category === "council" ? (
        <div className="council-timeline">
          {items.map((d) => (
            <article className="council-entry" key={d.id}>
              <span className="council-year" dir="ltr">
                {d.council_year}
              </span>
              <div>
                <h2>{textFor(d, "title", language) || w.missingTranslation}</h2>
                <p className="editorial-verbatim">
                  {textFor(d, "subtitle", language)}
                </p>
                <a className="text-link" href={`#article?id=${d.slug}`}>
                  {w.read}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="lessons-grid">
          {items.map((d) => (
            <a
              className="lesson-card doctrine-card"
              key={d.id}
              href={`#article?id=${d.slug}`}
            >
              {d.icon_url && (
                <img
                  src={d.icon_url}
                  alt={metadataFor(d, "icon_alt", language) || textFor(d, "title", language)}
                  loading="lazy"
                  width="480"
                  height="240"
                />
              )}
              <h2>{textFor(d, "title", language) || w.missingTranslation}</h2>
              <p className="editorial-verbatim">
                {textFor(d, "subtitle", language)}
              </p>
              <span className="text-link">
                {w.read}
                <ArrowUpRight size={16} />
              </span>
            </a>
          ))}
        </div>
      )}
      {!items.length && <p>{w.empty}</p>}
    </div>
  );
}
export function EditorialArticle({ language, route, writing = false }) {
  const cms = useEditorial(),
    w = useEditorialWords(language),
    id = new URLSearchParams(route.split("?")[1]).get("id") || "";
  const resource = useEditorialResource(
      `/${writing ? "writings" : "doctrines"}/${encodeURIComponent(id)}`,
    ),
    item = resource.data?.item;
  if (!item)
    return (
      <div className="page">
        <ResourceState resource={resource} language={language} />
      </div>
    );
  const authors = writing
    ? [item.author].filter(Boolean)
    : cms.authors.filter((a) =>
        item.doctrine_authors?.some((l) => l.author_id === a.id),
      );
  return (
    <article className="page heritage-page editorial-article">
      <a
        className="text-link"
        href={
          writing && item.author
            ? `${profileHref(item.author)}&tab=writings`
            : item.category === "history" ? "#history" : "#doctrine"
        }
      >
        ← {w.back}
      </a>
      {resource.error && (
        <ResourceState resource={resource} language={language} />
      )}
      <header className="heritage-heading">
        {item.icon_url && (
          <figure>
            <img
              className="doctrine-icon"
              src={item.icon_url}
              alt={metadataFor(item, "icon_alt", language) || textFor(item, "title", language)}
              width="720"
              height="480"
            />
            <figcaption className="icon-credit"><details className="source-disclosure"><summary>{w.iconCredit}</summary>{metadataFor(item, "icon_credit", language)}</details></figcaption>
          </figure>
        )}
        <h1>{textFor(item, "title", language) || w.missingTranslation}</h1>
        <p className="editorial-verbatim">
          {textFor(item, "subtitle", language)}
        </p>
      </header>
      <div className="profile-body">
        <p className="editorial-verbatim">
          {textFor(item, "body", language) || w.missingTranslation}
        </p>
        <details className="source-disclosure article-sources"><summary>{w.source}</summary>
        {[
          [w.bibleReferences, "bible_references"],
          [w.fatherReferences, "father_references"],
          [w.councilReferences, "council_references"],
          [w.source, "reference"],
        ]
          .filter(([, key]) => metadataFor(item,key,language))
          .map(([label, key]) => (
            <section key={key}>
              <h2>{label}</h2>
              <p className="editorial-verbatim">{metadataFor(item, key, language)}</p>
            </section>
          ))}
        {item.source_url && (
          <a
            className="text-link"
            href={item.source_url}
            target="_blank"
            rel="noreferrer"
          >
            {w.source} ↗
          </a>
        )}
        </details>
        {authors.length > 0 && (
          <section>
            <h2>{w.links}</h2>
            {authors.map((a) => (
              <p key={a.id}>
                <a className="text-link" href={profileHref(a)}>
                  {authorName(a, language)} ↗
                </a>
              </p>
            ))}
          </section>
        )}
      </div>
    </article>
  );
}
export function PrayerFeed({ language, t }) {
  const w = useEditorialWords(language),
    [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [topic, setTopic] = useState("");
  const resource = useEditorialResource(
      "/prayers?" +
        new URLSearchParams({
          limit: "100",
          page: String(page),
          ...(search ? { q: search } : {}),
          ...(topic ? { topic } : {}),
        }),
    ),
    data = resource.data;
  return (
    <div className="page">
      <header className="heritage-heading">
        <h1>{t.prayersTitle}</h1>
        <p>{t.prayersIntro}</p>
      </header>
      <p className="public-prayers-note">{t.prayersPublic}</p>
      <aside className="prayer-translation-note">
        <p>{t.prayerTranslationNote}</p>
      </aside>
      <label className="search editorial-search">
        <Search size={18} />
        <input
          aria-label={t.prayerSearch}
          placeholder={t.prayerSearch}
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </label>
      <select
        className="editorial-topic"
        aria-label={t.topic}
        value={topic}
        onChange={(e) => {
          setTopic(e.target.value);
          setPage(1);
        }}
      >
        <option value="">{t.all}</option>
        {data?.topics?.map((value) => (
          <option key={value} value={value}>
            {language === "ka" ? data.topicTranslations?.[value] || w.all : value}
          </option>
        ))}
      </select>
      {resource.error && (
        <ResourceState resource={resource} language={language} />
      )}
      <div className="prayer-list">
        {data?.prayers.map((p) => (
          <details className="prayer" key={p.id}>
            <summary>
              <h2>{textFor(p, "title", language) || w.missingTranslation}</h2>
              <span>{metadataFor(p, "topic", language)}</span>
            </summary>
            <p className="prayer-text editorial-verbatim">
              {textFor(p, "text", language) || w.missingTranslation}
            </p>
            {language === "ka" && p.review_note_ka && <p className="editorial-review-note" role="note">{p.review_note_ka}</p>}
            <details className="source-disclosure"><summary>{w.source}</summary>
            {p.source_url ? (
              <a
                className="text-link"
                href={p.source_url}
                target="_blank"
                rel="noreferrer"
              >
                {metadataFor(p, "reference", language)} ↗
              </a>
            ) : (
              <p className="editorial-verbatim">{metadataFor(p, "reference", language)}</p>
            )}</details>
          </details>
        ))}
      </div>
      {resource.loading && !data ? (
        <ResourceState resource={resource} language={language} />
      ) : (
        !data?.prayers?.length && <p>{w.empty}</p>
      )}
      {(data?.total || 0) > 100 && (
        <div className="editorial-pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            {w.previous}
          </button>
          <span>{page}</span>
          <button
            disabled={page * 100 >= data.total}
            onClick={() => setPage((p) => p + 1)}
          >
            {w.next}
          </button>
        </div>
      )}
    </div>
  );
}
