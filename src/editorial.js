export function searchKey(value = "") {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
export function matchesAuthor(author, query) {
  const key = searchKey(query);
  if (!key) return true;
  const text = searchKey(
    [
      ...["name", "title", "position"].flatMap((base) =>
        ["en", "ckb", "kmr", "ka"].map((lang) => author[`${base}_${lang}`] || ""),
      ),
      ...(author.aliases || []),
    ].join(" "),
  );
  return (
    text.includes(key) ||
    text.replaceAll(" ", "").includes(key.replaceAll(" ", ""))
  );
}
export function authorName(author, language = "en") {
  if (language === "ka") return author?.name_ka || "ქართული სახელი ჯერ არ არის დამატებული";
  return (
    author?.[`name_${language}`] ||
    author?.name_en ||
    author?.name_ckb ||
    author?.name_kmr ||
    ""
  );
}
export function textFor(row, base, language) {
  return row?.[`${base}_${language}`] ?? "";
}
export function profileHref(author) {
  return `#saint?id=${encodeURIComponent(author.slug || author.id)}`;
}
export function mergeWords(base, blocks, prefix, language) {
  const index = new Map(
    blocks.filter((row) => row.published).map((row) => [row.key, row]),
  );
  function walk(value, path) {
    if (Array.isArray(value))
      return value.map((entry, i) => walk(entry, `${path}.${i}`));
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, entry]) => [
          key,
          walk(entry, `${path}.${key}`),
        ]),
      );
    const row = index.get(path);
    return row ? (row[`text_${language}`] ?? value) : value;
  }
  return walk(base, prefix);
}

export function metadataFor(row, field, language) {
  return language === "ka" ? (row?.[`${field}_ka`] || "") : (row?.[field] || "");
}
export function localizedError(error, language) {
  if (language !== "ka") return error?.message || String(error || "");
  const messages = {
    AUTHOR_NOT_FOUND: "არჩეული ავტორი ვერ მოიძებნა ან არქივშია გადატანილი.",
    DUPLICATE_RECORD: "ასეთი ჩანაწერი უკვე არსებობს. შეცვალეთ არსებული ჩანაწერი.",
    PASSAGE_VERIFICATION_UNAVAILABLE: "ბიბლიური ადგილის გადამოწმება ვერ მოხერხდა. ტექსტი არ შეცვლილა. ხელახლა სცადეთ.",
    CMS_MIGRATION_REQUIRED: "შინაარსის მართვის სისტემა დროებით მიუწვდომელია.",
    EDITORIAL_CONFLICT: "ჩანაწერი სხვა სესიაში შეიცვალა. შეინახეთ თქვენი ტექსტის ასლი და განაახლეთ გვერდი.",
  };
  return messages[error?.code] || (error?.status === 401 ? "ამ მოქმედებისთვის საჭიროა ანგარიშში შესვლა." : "მოთხოვნა ვერ შესრულდა. ხელახლა სცადეთ.");
}
