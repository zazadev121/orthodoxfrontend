export const languageFields = ["en", "ckb", "kmr", "ka"];
const translated = (base, label, large = false) => ({
  base,
  label,
  translated: true,
  large,
});
const field = (key, label, type = "text") => ({ key, label, type });
const image = [
  field("icon_url", "iconUrl", "url"),
  field("icon_alt", "iconAlt"),
  field("icon_credit", "iconCredit", "textarea"),
];
const source = [
  field("reference", "source", "textarea"),
  field("source_url", "sourceUrl", "url"),
];
const article = [
  translated("title", "title"),
  translated("subtitle", "subtitle", true),
  translated("body", "body", true),
];
export const editorResources = {
  authors: {
    section: "saints",
    fields: [
      field("slug", "slug"),
      field("kind", "kind", "kind"),
      translated("name", "name"),
      translated("title", "traditionalTitle"),
      translated("position", "position"),
      field("aliases", "aliases", "aliases"),
      translated("summary", "summary", true),
      translated("biography", "biography", true),
      translated("history", "historyText", true),
      translated("contributions", "contributions", true),
      translated("writings_intro", "writingsIntro", true),
      translated("life_dates", "lifeDates"),
      field("birth_info", "birth"),
      field("death_info", "death"),
      translated("feast", "feast"),
      ...image,
      field("icon_source", "iconSource", "url"),
      field("icon_license_url", "iconLicense", "url"),
      field("source_reference", "source", "textarea"),
      field("source_url", "sourceUrl", "url"),
      field("sort_order", "order", "number"),
    ],
  },
  quotes: {
    section: "quotes",
    fields: [
      field("author_id", "author", "author"),
      translated("text", "body", true),
      ...source,
      field("topic", "topic"),
      field("review_note_ka", "editorialNote", "textarea"),
    ],
  },
  prayers: {
    section: "prayers",
    fields: [
      translated("title", "title"),
      translated("text", "body", true),
      ...source,
      field("topic", "topic"),
      field("review_note_ka", "editorialNote", "textarea"),
    ],
  },
  doctrines: {
    section: "doctrine",
    fields: [
      field("slug", "slug"),
      field("category", "category", "category"),
      field("council_year", "councilYear"),
      ...article,
      ...image,
      field("bible_references", "bibleReferences", "textarea"),
      field("father_references", "fatherReferences", "textarea"),
      field("council_references", "councilReferences", "textarea"),
      field("author_ids", "links", "authors"),
      ...source,
      field("sort_order", "order", "number"),
    ],
  },
  writings: {
    section: "writings",
    fields: [
      field("author_id", "author", "author"),
      ...article,
      ...source,
      field("sort_order", "order", "number"),
    ],
  },
  "bible-explanations": {
    section: "bible",
    fields: [
      field("book", "book", "book"),
      field("chapter", "chapter", "chapter"),
      field("verse_start", "verseStart", "verse"),
      field("verse_end", "verseEnd", "verse"),
      field("author_id", "author", "author"),
      translated("title", "title"),
      translated("body", "body", true),
      ...source,
      field("review_note_ka", "editorialNote", "textarea"),
      field("sort_order", "order", "number"),
    ],
  },
  "bible-overrides": {
    section: "bible",
    fields: [
      field("edition_id", "edition", "edition"),
      field("book", "book", "book"),
      field("chapter", "chapter", "chapter"),
      field("verse", "verse", "verse"),
      field("text", "body", "textarea"),
      field("editorial_note", "editorialNote", "textarea"),
    ],
  },
  "daily-verses": {
    section: "bible",
    fields: [
      field("date", "date", "date"),
      field("edition_id", "edition", "edition"),
      field("book", "book", "book"),
      field("chapter", "chapter", "chapter"),
      field("verse_start", "verseStart", "verse"),
      field("verse_end", "verseEnd", "verse"),
      field("text", "body", "textarea"),
      field("reference", "source", "textarea"),
    ],
  },
  "bible-editions": {
    section: "bible",
    fields: [
      field("id", "edition", "edition-fixed"),
      translated("title", "title"),
      translated("description", "description", true),
      field("sort_order", "order", "number"),
    ],
  },
  "content-blocks": {
    section: "general",
    fields: [
      field("key", "key"),
      field("section", "section"),
      field("value_type", "valueType", "value-type"),
      translated("text", "body", true),
      field("sort_order", "order", "number"),
    ],
  },
  sources: {
    section: "general",
    fields: [
      field("title", "title"),
      field("publisher", "source"),
      field("url", "sourceUrl", "url"),
      field("content", "body", "textarea"),
      field("content_ckb", "body", "textarea"),
      field("content_kmr", "body", "textarea"),
      field("content_ka", "body", "textarea"),

      field("keywords", "topic", "textarea"),
    ],
    toggle: "approved",
  },
};
export function newEditorialRecord(resource, id = crypto.randomUUID()) {
  const record = { published: false, sort_order: 0 };
  for (const f of editorResources[resource].fields) {
    if (f.translated)
      for (const lang of languageFields) record[`${f.base}_${lang}`] = "";
    else
      record[f.key] = ["author_ids", "aliases"].includes(f.key)
        ? []
        : f.type === "number"
          ? 0
          : "";
  }
  if ("slug" in record)
    record.slug = `${resource === "authors" ? "author" : "article"}-${id.slice(0, 8)}`;
  if ("book" in record) {
    record.book = "JHN";
    record.chapter = 1;
  }
  for (const k of ["verse", "verse_start", "verse_end"])
    if (k in record) record[k] = 1;
  if ("edition_id" in record) record.edition_id = "ckb_bib";
  if (resource === "authors") record.kind = "saint-and-father";
  if (resource === "doctrines") record.category = "doctrine";
  if (resource === "content-blocks") record.value_type = "text";
  if (resource === "sources") record.approved = false;
  return record;
}
export function savePayload(record) {
  const { created_at, updated_at, deleted_at, legacy_key, ...data } = record;
  return {
    ...data,
    ...(updated_at ? { expected_updated_at: updated_at } : {}),
  };
}
