export const readerFonts = [
  { id: "naskh", label: "ناسخ", family: "Reader Naskh", sourceFamily: "Noto Naskh Arabic" },
  { id: "kufi", label: "کوفی", family: "Reader Kufi", sourceFamily: "Noto Kufi Arabic" },
  { id: "sans", label: "سانس", family: "Reader Sans", sourceFamily: "Noto Sans Arabic" },
  { id: "vazir", label: "ڤازیر", family: "Reader Vazir", sourceFamily: "Vazirmatn" },
  { id: "readex", label: "ریادێکس", family: "Reader Readex", sourceFamily: "Readex Pro" },
  { id: "nrt", label: "NRT", family: "Reader NRT", sourceFamily: "NRT Regular" },
  { id: "speda", label: "سپێدا", family: "Reader Speda", sourceFamily: "Speda Normal" },
  { id: "rudaw", label: "ڕوداو", family: "Reader Rudaw", sourceFamily: "Rudaw Regular" },
  { id: "nastaliq", label: "نەستعلیق", family: "Reader Nastaliq", sourceFamily: "Noto Nastaliq Urdu" },
  { id: "rabar", label: "ڕەبار", family: "Reader Rabar", sourceFamily: "Rabar 001" },
  { id: "unikurd", label: "یونیکورد", family: "Reader Unikurd", sourceFamily: "Unikurd Web" },
  { id: "bukra", label: "بەکرا", family: "Reader Bukra", sourceFamily: "Nizar Bukra Regular" },
];
export function readerFontFor(value) {
  return readerFonts.find(font => font.id === value) || readerFonts.find(font => font.id === "speda");
}
export function initialReaderFont() {
  try { return readerFontFor(localStorage.getItem("readerFont")).id; }
  catch { return "speda"; }
}
