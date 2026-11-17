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
        ["en", "ckb", "kmr"].map((lang) => author[`${base}_${lang}`] || ""),
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
