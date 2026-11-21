// Palette IDs are shared with the early theme initializer in index.html.
export const themes = [
  { id: "traditional", preview: "linear-gradient(135deg, #5b1824 0 48%, #c3a15e 49% 52%, #f6efe1 53%)" },
  {
    "id": "amethyst",
    "preview": "linear-gradient(135deg, #100b1b, #281544)"
  },
  {
    "id": "midnight",
    "preview": "linear-gradient(135deg, #0c1028, #232657)"
  },
  {
    "id": "slate",
    "preview": "linear-gradient(135deg, #070e19, #172a43)"
  },
  {
    "id": "burgundy",
    "preview": "linear-gradient(135deg, #210c10, #481d27)"
  },
  {
    "id": "forest",
    "preview": "linear-gradient(135deg, #07190f, #10321d)"
  },
  {
    "id": "ocean",
    "preview": "linear-gradient(135deg, #071a21, #11414b)"
  },
  {
    "id": "ivory",
    "preview": "linear-gradient(135deg, #f6f0de, #ffffff)"
  },
  {
    "id": "charcoal",
    "preview": "linear-gradient(135deg, #101215, #30343a)"
  },
  {
    "id": "coffee",
    "preview": "linear-gradient(135deg, #1d1408, #463016)"
  }
];
export function initialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (themes.some(theme => theme.id === saved)) return saved;
    if (saved === "light") return "ivory";
    if (saved === "dark") return "midnight";
  } catch {}
  return "charcoal";
}
export function initialReaderSize() {
  try {
    const saved = localStorage.getItem("readerSize");
    if (["0.9", "1", "1.15"].includes(saved)) return saved;
  } catch {}
  return "1";
}
