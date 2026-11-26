import { withVerifiedIcon } from "./saint-icons-2026.js";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, ChevronRight, Heart } from "lucide-react";
import { useEditorial, useEditorialResource } from "./editorial-context.jsx";
import { authorName, profileHref, textFor } from "./editorial.js";
import { withClimacusContent } from "./climacus-content.js";
import { defaultEdition, readingHref, normalizeReading, localDateKey } from "./scripture.js";
import { saints } from "./saints-data.js";
import { selectTodaySaint } from "./home-today-model.js";
const words = {
  en: { next:"Your next step", john:"The Gospel of John", start:"Begin with the first chapter of John and discover the life and teaching of Christ.", begin:"Begin", continue:"Continue reading", resume:"Pick up where you left off in Holy Scripture.", pray:"Pray", all:"See all", church:"From the life of the Church", saint:"From the saints library", feast:"Commemoration in our library", noPrayer:"Explore the prayer library", details:"Read the life" },
  ckb: { next:"هەنگاوی داهاتووت", john:"مژدەی یۆحەنا", start:"لە بەشی یەکەمی مژدەی یۆحەنا دەست پێ بکە و زیاتر لە ژیان و فێرکارییەکانی مەسیح فێر ببە", begin:"دەست پێ بکە", continue:"درێژە بە خوێندنەوە بدە", resume:"لەو شوێنەوە کتێبی پیرۆز بخوێنەوە کە پێشتر وەستاویت", pray:"نوێژ", all:"هەمووی ببینە", church:"لە ژیانی کڵێسا", saint:"لە ژیانی پایەپیرۆزان", feast:"یادی پایەپیرۆز لە کتێبخانەکەمان", noPrayer:"کتێبخانەی نوێژەکان ببینە", details:"ژیاننامەکە بخوێنەوە" },
  ka: { next:"შენი შემდეგი ნაბიჯი", john:"იოანეს სახარება", start:"დაიწყე იოანეს სახარების პირველი თავით და გაეცანი ქრისტეს ცხოვრებასა და სწავლებას.", begin:"დაწყება", continue:"კითხვის გაგრძელება", resume:"გააგრძელე წმინდა წერილის კითხვა იქიდან, სადაც შეჩერდი.", pray:"ლოცვა", all:"ყველას ნახვა", church:"ეკლესიის ცხოვრებიდან", saint:"წმინდანთა ცხოვრებიდან", feast:"ხსენება ჩვენს ბიბლიოთეკაში", noPrayer:"ლოცვების ბიბლიოთეკა", details:"ცხოვრების წაკითხვა" },
  kmr: { next:"Gava te ya din", john:"Mizgîniya Yûhenna", start:"Ji beşa yekem a Mizgîniya Yûhenna dest pê bike û jiyana Mesîh nas bike.", begin:"Dest pê bike", continue:"Xwendinê bidomîne", resume:"Xwendina Pirtûka Pîroz ji cihê ku rawestiyayî bidomîne.", pray:"Dua", all:"Hemûyan bibîne", church:"Ji jiyana Dêrê", saint:"Ji jiyana pîrozan", feast:"Bîranîn di pirtûkxaneya me de", noPrayer:"Pirtûkxaneya duayan", details:"Jiyanê bixwîne" }
};
const wFor = language => words[language] || words.en;
function readSaved(language) {
 try { const v=JSON.parse(localStorage.getItem(language==="ka"?"scripture-position:ka":"scripture-position")); return v?.book && v?.translation ? normalizeReading(v,language) : null; } catch { return null; }
}
export function TodayReading({language}) {
 const w=wFor(language), cms=useEditorial(), saved=readSaved(language);
 const initial=defaultEdition(language);
 const available=cms.ready ? cms.editions.map(x=>x.id) : null;
 const fallbackId=available && !available.includes(initial.id) ? available[0] : initial.id;
 if(!fallbackId) return null;
 const resume=saved && (!available || available.includes(saved.translation)) ? saved : null;
 const reading=resume || normalizeReading({translation:fallbackId,book:"JHN",chapter:1},language);
 const edition=defaultEdition(language);
 const localBook=edition.id===reading.translation ? edition.books.find(b=>b.id===reading.book)?.name : null;
 return <section className="today-next">
   <div className="today-card-kicker"><span>{w.next}</span><BookOpen size={20}/></div>
   <h2>{resume ? w.continue : w.john}</h2>
   <p>{resume ? w.resume : w.start}</p>
   {resume && localBook && <span className="today-resume-ref">{localBook} <bdi>{reading.chapter}</bdi></span>}
   <a className="today-pill" href={"/"+readingHref(reading)}>{resume ? w.continue : w.begin}<ArrowUpRight size={18}/></a>
 </section>;
}
export function TodayPrayers({language}) {
 const w=wFor(language),cms=useEditorial();
 const r=useEditorialResource("/prayers?limit=100&page=1",{enabled:cms.ready===true});
 const prayers=(r.data?.prayers||[]).filter(p=>textFor(p,"title",language)&&textFor(p,"text",language));
 const ordered=[...prayers].sort((a,b)=>score(b)-score(a));
 function score(p){return /evening|sleep|morning|jesus prayer/i.test(p.title_en||"")?1:0;}
 return <section className="today-section">
  <div className="today-section-head"><h2>{w.pray}</h2><a href="/prayers/">{w.all}<ChevronRight size={16}/></a></div>
  <div className="today-prayer-group">
   {ordered.length?ordered.slice(0,2).map(p=><details key={p.id} className="today-prayer"><summary><span>{textFor(p,"title",language)}</span><ChevronRight size={21}/></summary><p className="editorial-verbatim">{textFor(p,"text",language)}</p>{p.source_url&&<a href={p.source_url} target="_blank" rel="noreferrer">{p.reference||new URL(p.source_url).hostname} ↗</a>}</details>):<a className="today-prayer today-prayer-link" href="/prayers/"><Heart size={20}/><span>{w.noPrayer}</span><ChevronRight size={20}/></a>}
  </div>
 </section>;
}
export function TodaySaint({language}) {
 const cms=useEditorial(), w=wFor(language);
 const [date,setDate]=useState(()=>new Date());
 useEffect(()=>{const update=()=>setDate(new Date());const timer=setInterval(update,30000);document.addEventListener("visibilitychange",update);return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",update);};},[]);
 const authors=cms.ready?cms.authors.map(a=>withVerifiedIcon(withClimacusContent(a))):saints.map(s=>({slug:s.id,id:s.id,name_en:s.en,name_ckb:s.ckb,feast_en:s.feast[0],feast_ckb:s.feast[1],icon_url:"/icons/"+s.id+".webp"}));
 const {author,match}=selectTodaySaint(authors,date);
 if(!author)return null;
 return <section className="today-section">
  <div className="today-section-head"><h2>{w.church}</h2><a href="/saints/">{w.all}<ChevronRight size={16}/></a></div>
  <a className="today-saint-card" href={"/"+profileHref(author)}>
   <div className="today-saint-copy"><span className="today-card-kicker">{match?w.feast:w.saint}</span><h3>{authorName(author,language)}</h3>{textFor(author,"position",language)&&<p>{textFor(author,"position",language)}</p>}<span className="today-saint-more">{w.details}<ArrowUpRight size={16}/></span></div>
   <div className="today-saint-art"><img src={author.icon_url} alt="" width="320" height="400" loading="lazy" decoding="async"/></div>
  </a>
 </section>;
}
