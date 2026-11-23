import { readDrafts, writeDraft, removeDraft } from "./editorial-drafts.js";
import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  ImageOff,
  Plus,
  Archive,
  RotateCcw,
  Download,
  History,
  Search,
  Save,
  ShieldCheck,
} from "lucide-react";
import { api } from "./api.js";
import {
  useEditorial,
  useEditorialWords,
  notifyEditorialChange,
} from "./editorial-context.jsx";
import { authorName, textFor, localizedError } from "./editorial.js";
import {
  editorResources,
  newEditorialRecord,
  savePayload,
} from "./editorial-admin-model.js";
import {
  scriptureEditions,
  editionFor,
  loadChapter,
  localDateKey,
} from "./scripture.js";
const labels = {
  saints: "authors",
  quotes: "quotes",
  prayers: "prayers",
  doctrine: "doctrines",
  writings: "writings",
  bible: "bible-explanations",
  general: "content-blocks",
};
const bibleTabs = [
  "bible-explanations",
  "bible-overrides",
  "daily-verses",
  "bible-editions",
];
const bibleLabel = ["explanations", "verseOverrides", "daily", "editions"];
function itemTitle(item, language) {
  if (item.key)
    return item.key
      .split(".")
      .map((part) => part.replace(/([a-z])([A-Z])/g, "$1 $2"))
      .join(" · ");
  return (
    item[`name_${language}`] ||
    item.name_en ||
    item.name_ckb ||
    item[`title_${language}`] ||
    item.title_en ||
    item.title_ckb ||
    item.title ||
    item.key ||
    item.father ||
    `${item.book || ""} ${item.chapter || ""}:${item.verse_start || item.verse || ""}`
  );
}
async function allAdminAuthors(token) {
  const items = [];
  for (let page = 1; ; page++) {
    const r = await api(`/admin/authors?limit=200&page=${page}`, { token });
    items.push(...r.items);
    if (r.items.length < 200 || items.length >= r.total) break;
  }
  return items;
}
export function AdminWorkspace({ token, language, ownerId }) {
  const cms = useEditorial(),
    w = useEditorialWords(language);
  const [section, setSection] = useState("saints"),
    [resource, setResource] = useState("authors"),
    [page, setPage] = useState(1),
    [archived, setArchived] = useState(false),
    [search, setSearch] = useState(""),
    [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]),
    [total, setTotal] = useState(0),
    [authors, setAuthors] = useState([]),
    [editing, setEditing] = useState(null),
    [baseline, setBaseline] = useState(""),
    [formLanguage, setFormLanguage] = useState(language);
  const [draftId,setDraftId]=useState(null), [recovery,setRecovery]=useState(()=>readDrafts(ownerId)), [draftState,setDraftState]=useState(null);
  useEffect(()=>setRecovery(readDrafts(ownerId)),[ownerId]);
  const [status, setStatus] = useState(null),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [revisions, setRevisions] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(search);
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);
  const sequence = useRef(0),
    fileInput = useRef(null);
  const dirty = editing && JSON.stringify(editing) !== baseline;
  useEffect(()=>{
    if (!dirty || !draftId || !ownerId) return;
    const ok=writeDraft(ownerId,{id:draftId,resource,record:editing,baseline,language:formLanguage,savedAt:new Date().toISOString()});
    setDraftState(ok ? "saved" : "unavailable");
    if(ok)setRecovery(readDrafts(ownerId));
  },[dirty,editing,baseline,draftId,ownerId,resource,formLanguage]);
  function recoverDraft(entry){
    if(!leave())return;
    setEditing(structuredClone(entry.record));setBaseline(entry.baseline);setDraftId(entry.id);setFormLanguage(entry.language||language);setRevisions(null);setError("");
  }
  function discardDraft(entry){
    if(!window.confirm(w.discardDraftConfirm))return;
    removeDraft(ownerId,entry.resource,entry.id);setRecovery(readDrafts(ownerId));
  }
  useEffect(() => {
    const stop = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", stop);
    return () => window.removeEventListener("beforeunload", stop);
  }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const currentUrl = location.href;
    const guard = (event) => {
      if (!window.confirm(w.leave)) {
        event.stopImmediatePropagation();
        history.replaceState(null, "", currentUrl);
      }
    };
    window.addEventListener("hashchange", guard, true);
    return () => window.removeEventListener("hashchange", guard, true);
  }, [dirty, w.leave]);
  const passageEdition = editing?.edition_id || "eng_webu",
    passageBook = editionFor(passageEdition)?.books.find(
      (b) => b.id === editing?.book,
    ),
    [verseMax, setVerseMax] = useState(200);
  useEffect(() => {
    if (!editing?.book || !editing.chapter) return;
    let alive = true;
    const controller = new AbortController();
    loadChapter(
      {
        translation: passageEdition,
        book: editing.book,
        chapter: editing.chapter,
      },
      { signal: controller.signal },
    )
      .then((r) => {
        const numbers = r.data.chapter.content
          .filter((row) => row.type === "verse")
          .map((row) => row.number);
        if (alive) setVerseMax(Math.max(...numbers));
      })
      .catch(() => {
        if (alive) setVerseMax(200);
      });
    return () => {
      alive = false;
      controller.abort();
    };
  }, [editing?.book, editing?.chapter, passageEdition]);
  async function load() {
    const version = ++sequence.current;
    setLoading(true);
    setError("");
    try {
      const ready = await api("/admin/cms/status", { token });
      if (version !== sequence.current) return;
      setStatus(ready);
      if (!ready.ready) return;
      const [list, people] = await Promise.all([
        api(
          `/admin/${resource}?${new URLSearchParams({ limit: "100", page: String(page), archived: String(archived), ...(searchQuery ? { q: searchQuery } : {}) })}`,
          { token },
        ),
        allAdminAuthors(token),
      ]);
      if (version !== sequence.current) return;
      setItems(list.items);
      setTotal(list.total ?? list.items.length);
      setAuthors(people);
    } catch (e) {
      if (version === sequence.current) setError(localizedError(e, language));
    } finally {
      if (version === sequence.current) setLoading(false);
    }
  }
  useEffect(() => {
    load();
    return () => {
      sequence.current++;
    };
  }, [token, resource, page, archived, searchQuery]);
  function begin(item) {
    const value = item ? structuredClone(item) : newEditorialRecord(resource);
    setDraftId(value.id || crypto.randomUUID());setDraftState(null);
    setEditing(value);
    setBaseline(JSON.stringify(value));
    setRevisions(null);
    setError("");
    setNotice("");
  }
  function leave() {
    return !dirty || window.confirm(w.leave);
  }
  function switchSection(next) {
    if (!leave()) return;
    setEditing(null);
    setItems([]);
    setSection(next);
    setResource(labels[next]);
    setPage(1);
    setSearch("");
    setArchived(false);
    setRevisions(null);
    setNotice("");
  }
  function switchResource(next) {
    if (!leave()) return;
    setEditing(null);
    setItems([]);
    setResource(next);
    setPage(1);
    setSearch("");
    setArchived(false);
    setRevisions(null);
    setNotice("");
  }
  function change(key, value) {
    setEditing((record) => ({ ...record, [key]: value }));
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const id = editing.id,
        creating = resource === "bible-editions" ? false : !id;
      await api(`/admin/${resource}${creating ? "" : `/${id}`}`, {
        token,
        method: creating ? "POST" : "PATCH",
        body: JSON.stringify(savePayload(editing)),
      });
      removeDraft(ownerId,resource,draftId);setRecovery(readDrafts(ownerId));setDraftState(null);
      setEditing(null);
      setBaseline("");
      setNotice(w.saveNotice);
      notifyEditorialChange();
      await Promise.all([load(), cms.refresh()]);
    } catch (e) {
      setError(e.code === "EDIT_CONFLICT" ? w.conflict : e.message);
    } finally {
      setBusy(false);
    }
  }
  async function archive(item) {
    if (!window.confirm(w.archiveConfirm)) return;
    setBusy(true);
    setError("");
    try {
      await api(`/admin/${resource}/${item.id}`, {
        token,
        method: "DELETE",
        body: JSON.stringify({ expected_updated_at: item.updated_at }),
      });
      setNotice(w.saveNotice);
      notifyEditorialChange();
      await Promise.all([load(), cms.refresh()]);
    } catch (e) {
      setError(localizedError(e, language));
    } finally {
      setBusy(false);
    }
  }
  async function restore(item) {
    setBusy(true);
    setError("");
    try {
      await api(`/admin/${resource}/${item.id}/restore`, {
        token,
        method: "POST",
      });
      notifyEditorialChange();
      await Promise.all([load(), cms.refresh()]);
      setNotice(w.saveNotice);
    } catch (e) {
      setError(localizedError(e, language));
    } finally {
      setBusy(false);
    }
  }
  async function upload(file) {
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setError(w.imageHelp);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const media = await api("/admin/media", {
        token,
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      setEditing((row) =>
        resource === "content-blocks"
          ? {
              ...row,
              text_en: media.url,
              text_ckb: media.url,
              text_kmr: media.url,
            }
          : { ...row, icon_url: media.url, icon_media_id: media.id },
      );
    } catch (e) {
      setError(localizedError(e, language));
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }
  async function backup() {
    setBusy(true);
    setError("");
    try {
      const data = await api("/admin/cms/export", { token });
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `orthodox-content-${localDateKey()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(language === "ka" ? w.downloadFailed : e.message || w.downloadFailed);
    } finally {
      setBusy(false);
    }
  }
  async function history() {
    setBusy(true);
    setError("");
    try {
      const r = await api(
        `/admin/cms/revisions?${new URLSearchParams({ table: resource.replaceAll("-", "_"), id: editing.id })}`,
        { token },
      );
      setRevisions(r.items);
    } catch (e) {
      setError(localizedError(e, language));
    } finally {
      setBusy(false);
    }
  }
  function copyRevision(row) {
    const currentUpdated = editing.updated_at;
    const record = {
      ...row,
      updated_at: currentUpdated,
      [resource === "sources" ? "approved" : "published"]: false,
      ...(resource === "doctrines"
        ? { author_ids: editing.author_ids || [] }
        : {}),
    };
    setEditing(record);
    setRevisions(null);
  }
  function renderField(f) {
    if (f.key === "review_note_ka" && formLanguage !== "ka") return null;
    if (resource === "sources" && ["content","content_ckb","content_kmr","content_ka"].includes(f.key) && f.key !== (formLanguage === "en" ? "content" : `content_${formLanguage}`)) return null;
    const localizedMetadata = formLanguage === "ka" && ["reference","topic","icon_alt","icon_credit","source_reference","birth_info","death_info","bible_references","father_references","council_references",...(resource === "sources" ? ["title","publisher"] : [])].includes(f.key);
    const key = f.translated ? `${f.base}_${formLanguage}` : localizedMetadata ? `${f.key}_ka` : f.key,
      value = editing[key] ?? "",
      label = w[f.label] || f.label;
    const common = {
      id: `editor-${key}`,
      name: key,
      value,
      disabled: busy || (Boolean(editing.id) && key === "key"),
      onChange: (e) => change(key, e.target.value),
      dir: f.translated
        ? formLanguage === "ckb"
          ? "rtl"
          : "ltr"
        : ["slug", "key"].includes(key)
          ? "ltr"
          : undefined,
    };
    if (
      resource === "content-blocks" &&
      f.translated &&
      editing.value_type === "visibility"
    )
      return (
        <label className="checkbox" key={key}>
          <input
            type="checkbox"
            checked={editing.text_en !== "false"}
            onChange={(e) =>
              setEditing((row) => ({
                ...row,
                text_en: String(e.target.checked),
                text_ckb: String(e.target.checked),
                text_kmr: String(e.target.checked),
                text_ka: String(e.target.checked),
              }))
            }
          />
          {w.sectionVisible}
        </label>
      );
    if (f.type === "authors")
      return (
        <fieldset className="editor-author-links" key={key}>
          <legend>{label}</legend>
          {authors.map((a) => (
            <label className="checkbox" key={a.id}>
              <input
                type="checkbox"
                disabled={busy}
                checked={(editing.author_ids || []).includes(a.id)}
                onChange={(e) =>
                  change(
                    "author_ids",
                    e.target.checked
                      ? [...(editing.author_ids || []), a.id]
                      : (editing.author_ids || []).filter((id) => id !== a.id),
                  )
                }
              />
              {authorName(a, language)}
            </label>
          ))}
        </fieldset>
      );
    let input;
    if (f.type === "author")
      input = (
        <select {...common} required>
          <option value="">{w.select}</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {authorName(a, language)}
              {a.published ? "" : ` (${w.draft})`}
            </option>
          ))}
        </select>
      );
    else if (f.type === "book")
      input = (
        <select
          {...common}
          onChange={(e) =>
            setEditing((row) => ({
              ...row,
              book: e.target.value,
              chapter: 1,
              verse_start: 1,
              verse_end: 1,
              verse: 1,
            }))
          }
        >
          {editionFor(passageEdition).books.map((b) => (
            <option key={b.id} value={b.id}>
              {cms.text(`bible.book.${b.id}`, language, b.name)} ({b.id})
            </option>
          ))}
        </select>
      );
    else if (f.type === "chapter")
      input = (
        <select
          {...common}
          onChange={(e) =>
            setEditing((row) => ({
              ...row,
              chapter: Number(e.target.value),
              verse_start: 1,
              verse_end: 1,
              verse: 1,
            }))
          }
        >
          {Array.from(
            {
              length:
                (passageBook?.lastChapterNumber || 1) -
                (passageBook?.firstChapterNumber || 1) +
                1,
            },
            (_, i) => (passageBook?.firstChapterNumber || 1) + i,
          ).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      );
    else if (f.type === "edition" || f.type === "edition-fixed")
      input = (
        <select
          {...common}
          disabled={busy || f.type === "edition-fixed"}
          onChange={(e) =>
            setEditing((row) => ({
              ...row,
              [key]: e.target.value,
              book: "JHN",
              chapter: 1,
              verse: 1,
              verse_start: 1,
              verse_end: 1,
            }))
          }
        >
          {scriptureEditions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.language === "ka" ? "ქართული" : e.language === "ckb" ? "سۆرانی" : language === "ka" ? "ინგლისური" : "English"} · {e.id}
            </option>
          ))}
        </select>
      );
    else if (["kind", "category", "value-type"].includes(f.type))
      input = (
        <select {...common}>
          {(f.type === "kind"
            ? ["saint", "father", "saint-and-father"]
            : f.type === "category"
              ? ["doctrine", "council", "history"]
              : ["text", "image", "visibility"]
          ).map((option) => (
            <option key={option} value={option}>
              {language === "ka" ? ({saint:"წმინდანი",father:"ეკლესიის მამა","saint-and-father":"წმინდანი და ეკლესიის მამა",doctrine:"ღვთისმეტყველება",council:"კრება",history:"ეკლესიის ისტორია",text:"ტექსტი",image:"გამოსახულება",visibility:"ხილვადობა"}[option] || option) : option}
            </option>
          ))}
        </select>
      );
    else if (f.type === "aliases")
      input = (
        <textarea
          {...common}
          rows={4}
          value={(editing.aliases || []).join("\n")}
          onChange={(e) => change("aliases", e.target.value.split("\n"))}
        />
      );
    else if (f.large || f.type === "textarea")
      input = (
        <textarea
          {...common}
          rows={
            ["biography", "body", "text", "history", "contributions"].includes(
              f.base || key,
            )
              ? 8
              : 4
          }
          maxLength={150000}
        />
      );
    else
      input = (
        <input
          {...common}
          type={
            ["number", "verse"].includes(f.type)
              ? "number"
              : f.type === "date"
                ? "date"
                : "text"
          }
          inputMode={f.type === "url" ? "url" : undefined}
          min={f.type === "verse" ? 1 : undefined}
          max={f.type === "verse" ? verseMax : undefined}
          onChange={(e) =>
            change(
              key,
              ["number", "verse"].includes(f.type)
                ? Number(e.target.value)
                : e.target.value,
            )
          }
          required={["slug", "key", "date"].includes(key)}
        />
      );
    return (
      <label className="editorial-field" key={key} htmlFor={`editor-${key}`}>
        <span>
          {label}
          {f.translated && (
            <small>
              {" "}
              ·{" "}
              {formLanguage === "ckb"
                ? "سۆرانی"
                : formLanguage === "ka" ? "ქართული" : formLanguage === "kmr"
                  ? "Kurmancî"
                  : "English"}
            </small>
          )}
        </span>
        {input}
        {f.type === "author" && (
          <small>{authors.length ? w.authorHelp : w.createAuthor}</small>
        )}
      </label>
    );
  }
  const config = editorResources[resource],
    toggle = config.toggle || "published";
  const filtered = items;
  return (
    <div className="editorial-dashboard">
      <header className="editorial-dashboard-head">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={15} />
            {w.manual}
          </span>
          <h1>{w.dashboard}</h1>
          <p>{w.intro}</p>
        </div>
        <button
          className="button secondary"
          onClick={backup}
          disabled={busy || !status?.ready}
        >
          <Download size={17} />
          {w.backup}
        </button>
      </header>
      <div className="editorial-dashboard-layout">
        <nav className="editorial-sidebar" aria-label={w.dashboard}>
          {Object.keys(labels).map((key) => (
            <button
              key={key}
              type="button"
              aria-current={section === key ? "page" : undefined}
              onClick={() => switchSection(key)}
            >
              {w[key]}
            </button>
          ))}
        </nav>
        <div className="editorial-workspace">
          <h2>{w[section]}</h2>
          {section === "bible" && (
            <nav className="editorial-subtabs">
              {bibleTabs.map((key, i) => (
                <button
                  key={key}
                  aria-pressed={resource === key}
                  onClick={() => switchResource(key)}
                >
                  {w[bibleLabel[i]]}
                </button>
              ))}
            </nav>
          )}
          {section === "general" && (
            <>
              <nav className="editorial-subtabs">
                <button
                  aria-pressed={resource === "content-blocks"}
                  onClick={() => switchResource("content-blocks")}
                >
                  {w.general}
                </button>
                <button
                  aria-pressed={resource === "sources"}
                  onClick={() => switchResource("sources")}
                >
                  {w.aiSources}
                </button>
              </nav>
              <p className="editorial-help">
                {resource === "sources" ? w.sourceOnly : w.visibilityHelp}
              </p>
            </>
          )}
          {error && (
            <div className="error" role="alert">
              {error}
              <button
                className="text-link"
                type="button"
                disabled={busy}
                onClick={load}
              >
                {w.retry}
              </button>
            </div>
          )}
          {notice && (
            <p className="success" role="status">
              {notice}
            </p>
          )}
          {!editing && recovery.some(d=>d.resource===resource) && <aside className="draft-recovery">
            <h3>{w.draftRecovery}</h3><p>{w.draftHelp}</p>
            {recovery.filter(d=>d.resource===resource).map(d=><div key={d.id}>
              <strong>{itemTitle(d.record,language) || w.draft}</strong>
              <time dateTime={d.savedAt}>{new Date(d.savedAt).toLocaleString(language==="ka"?"ka-GE":language==="ckb"?"ckb":language==="kmr"?"ku":"en-GB")}</time>
              <button type="button" className="button secondary" onClick={()=>recoverDraft(d)}>{w.recoverDraft}</button>
              <button type="button" className="text-link" onClick={()=>discardDraft(d)}>{w.discardDraft}</button>
            </div>)}
          </aside>}
          {status && !status.ready ? (
            <div className="notice">
              <p>{w.migration}</p>
              <code>supabase/migrations/20261117163506_editorial_cms.sql</code>
              <button className="button secondary" onClick={load}>
                {w.retry}
              </button>
            </div>
          ) : editing ? (
            <form className="editorial-form" onSubmit={save}>
              {dirty && draftState && <p className={draftState==="saved"?"draft-status":"error"} role="status">{draftState==="saved"?w.draftSaved:w.draftUnavailable}</p>}
              <div className="editorial-form-toolbar">
                <p>{w.exact}</p>
                <div
                  className="editorial-language-tabs"
                  role="group"
                  aria-label={language === "ka" ? "თარგმანი" : "Translation"}
                >
                  {[
                    ["ckb", "سۆرانی"],
                    ["en", "English"],
                    ["ka", "ქართული"],
                  ].map(([id, title]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={formLanguage === id}
                      onClick={() => setFormLanguage(id)}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>
              {(config.fields.some((f) => f.key === "icon_url") ||
                (resource === "content-blocks" &&
                  editing.value_type === "image")) && (
                <div className="editorial-upload">
                  {(editing.icon_url ||
                    (resource === "content-blocks" &&
                      editing[`text_${formLanguage}`])) && (
                    <img
                      src={editing.icon_url || editing[`text_${formLanguage}`]}
                      alt={editing.icon_alt || ""}
                      width="200"
                      height="200"
                    />
                  )}
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    aria-label={w.upload}
                    disabled={busy}
                    onChange={(e) => upload(e.target.files?.[0])}
                  />
                  <p>{w.imageHelp}</p>
                  <button
                    className="button secondary"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      setEditing((row) =>
                        resource === "content-blocks"
                          ? { ...row, text_en: "", text_ckb: "", text_kmr: "" }
                          : { ...row, icon_url: "", icon_media_id: null },
                      )
                    }
                  >
                    <ImageOff size={16} />
                    {w.removeImage}
                  </button>
                </div>
              )}
              {config.fields.map(renderField)}
              <label className="checkbox editorial-publish">
                <input
                  type="checkbox"
                  checked={Boolean(editing[toggle])}
                  onChange={(e) => change(toggle, e.target.checked)}
                  disabled={busy}
                />
                {w.approved}
              </label>
              <div className="editorial-savebar">
                <button className="button gold" disabled={busy}>
                  <Save size={16} />
                  {busy ? w.loading : editing[toggle] ? w.publish : w.save}
                </button>
                <button
                  className="button secondary"
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (leave()) {
                      setEditing(null);
                      setRevisions(null);
                    }
                  }}
                >
                  {w.cancel}
                </button>
                {editing.id && (
                  <button
                    className="button secondary"
                    type="button"
                    disabled={busy}
                    onClick={history}
                  >
                    <History size={16} />
                    {w.history}
                  </button>
                )}
              </div>
              {revisions && (
                <aside className="editorial-revisions">
                  <h3>{w.history}</h3>
                  <p>{w.historyHelp}</p>
                  {revisions.map((revision) => (
                    <details key={revision.id}>
                      <summary>
                        {new Date(revision.created_at).toLocaleString()} ·{" "}
                        {revision.operation}
                      </summary>
                      <pre>
                        {JSON.stringify(
                          revision.previous_row || revision.next_row,
                          null,
                          2,
                        )}
                      </pre>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() =>
                          copyRevision(
                            revision.previous_row || revision.next_row,
                          )
                        }
                      >
                        {w.copyRevision}
                      </button>
                    </details>
                  ))}
                </aside>
              )}
            </form>
          ) : (
            <>
              <div className="editorial-list-toolbar">
                {resource !== "bible-editions" && (
                  <button
                    className="button gold"
                    disabled={busy || !status?.ready}
                    onClick={() => begin(null)}
                  >
                    <Plus size={17} />
                    {w.add}
                  </button>
                )}
                <label className="search editorial-search">
                  <Search size={18} />
                  <input
                    value={search}
                    placeholder={w.search}
                    aria-label={w.search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                {resource !== "bible-editions" && (
                  <button
                    className="button secondary"
                    aria-pressed={archived}
                    onClick={() => {
                      setArchived((v) => !v);
                      setPage(1);
                    }}
                  >
                    {archived ? w.active : w.archived}
                  </button>
                )}
              </div>
              {loading ? (
                <p role="status">{w.loading}</p>
              ) : (
                <div className="editorial-record-list">
                  {filtered.map((item) => (
                    <article key={item.id}>
                      <div>
                        <h3>{itemTitle(item, language)}</h3>
                        <span className="badge">
                          {item[toggle] ? w.published : w.draft}
                        </span>
                        {item.author_id && (
                          <p>
                            {authorName(
                              authors.find((a) => a.id === item.author_id),
                              language,
                            ) || item.father}
                          </p>
                        )}
                        {item.book && (
                          <p dir="ltr">
                            {item.book} {item.chapter}:
                            {item.verse_start || item.verse}
                            {item.verse_end &&
                            item.verse_end !== item.verse_start
                              ? `–${item.verse_end}`
                              : ""}
                          </p>
                        )}
                        <p className="record-preview editorial-verbatim">
                          {textFor(item, "body", language) ||
                            textFor(item, "text", language) ||
                            textFor(item, "summary", language) ||
                            item.source_reference ||
                            item.reference ||
                            item.key}
                        </p>
                      </div>
                      <div className="editorial-record-actions">
                        {archived ? (
                          <button
                            className="button secondary"
                            disabled={busy}
                            onClick={() => restore(item)}
                          >
                            <RotateCcw size={16} />
                            {w.restore}
                          </button>
                        ) : (
                          <>
                            <button
                              className="button secondary"
                              disabled={busy}
                              onClick={() => begin(item)}
                            >
                              {w.edit}
                            </button>
                            {resource !== "bible-editions" && (
                              <button
                                className="button secondary danger"
                                disabled={busy}
                                onClick={() => archive(item)}
                              >
                                <Archive size={16} />
                                {w.archive}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                  {!filtered.length && <p>{w.empty}</p>}
                </div>
              )}
              {total > 100 && (
                <div className="editorial-pagination">
                  <button
                    disabled={page === 1 || busy}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    {w.previous}
                  </button>
                  <span>
                    {page} / {Math.ceil(total / 100)}
                  </span>
                  <button
                    disabled={page * 100 >= total || busy}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {w.next}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
