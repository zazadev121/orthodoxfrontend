export const JOURNEY_KEY = "orthodoxy-journey-v1";
export const journeyLanguages = ["ckb","en","ka"];
export const journeyRegions = ["bakur","bashur","rojava","rojhalat","other","private"];
export function normalizeJourney(value) {
  if (!value || typeof value !== "object") return null;
  if (!journeyLanguages.includes(value.language)) return null;
  return {language:value.language, saint:typeof value.saint==="string" && /^[a-zA-Z0-9_-]{1,150}$/.test(value.saint)?value.saint:"", region:journeyRegions.includes(value.region)?value.region:"private", completed:value.completed===true};
}
export function loadJourney(storage) {
  try { return normalizeJourney(JSON.parse(storage.getItem(JOURNEY_KEY))); } catch { return null; }
}
export function saveJourney(storage, data) {
  const normalized=normalizeJourney(data);
  if(!normalized)return false;
  try {storage.setItem(JOURNEY_KEY,JSON.stringify(normalized));return true;}catch{return false;}
}
export function dayNumber(date=new Date()) {
  return Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
}
export function dailyItem(items,date=new Date()) {
  if(!items.length)return null;
  const day=dayNumber(date);return items[((day%items.length)+items.length)%items.length];
}
export function sourcedQuotes(rows,language,authorId) {
  return (rows||[]).filter(q=>typeof q?.["text_"+language]==="string"&&q["text_"+language].trim()&&(q.source_url||q.reference||q["reference_"+language])&&(!q.author_id||q.author_id===authorId)&&(!q.author?.id||q.author.id===authorId)).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
}
