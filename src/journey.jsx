import { withVerifiedIcon } from "./saint-icons-2026.js";
import React,{useEffect,useRef,useState} from "react";
import {ArrowUpRight,BookOpen,Check,ChevronRight,Heart,Search,Settings2} from "lucide-react";
import {useEditorial,useEditorialResource} from "./editorial-context.jsx";
import {authorName,matchesAuthor,profileHref,textFor} from "./editorial.js";
import {mergeSaintLibrary} from "./additional-saints-2026.js";
import {withClimacusContent} from "./climacus-content.js";
import {saints} from "./saints-data.js";
import {dailyItem,sourcedQuotes,journeyLanguages} from "./journey-model.js";
const copy={
ckb:{language:"زمانی دڵخوازی خۆت هەڵبژێرە",welcome:"سڵاوی یەشوای مەسیحت لێ بێت بەڕێز",intro:"بەخێربێیت بۆ ئۆرتۆدۆکسی ڕۆم لە کوردستان. ئەم سایتە دەربارەی باوەڕی کڵێسای ئۆرتۆدۆکسی ڕۆژهەڵاتە. لێرە دەتوانیت کتێبی پیرۆز بخوێنیتەوە و وەڵامی پرسیارەکانت بدۆزیتەوە و لە ژیان و فێرکارییەکانی پایەپیرۆزان فێر ببیت و زۆر شتی تر بناسیت",saint:"پایەپیرۆزی دڵخوازت هەڵبژێرە",saintText:"با لە درێژەی ئەم گەشتە ڕۆحییەدا لە ژیان و فێرکارییەکانی فێر ببین و داوای نوێژ و شەفاعەتی لێ بکەین. هەموو ڕۆژێک وتەیەکی بە سەرچاوە ئەگەر بەردەست بێت و نوێژێک لە سایتەکە دەبینیت",region:"خەڵکی کام بەشی کوردستانیت؟",regionText:"وەڵامدانەوەی ئەم پرسیارە ئارەزوومەندانەیە. هەڵبژاردنەکە تەنها لە وێبگەڕەکەی خۆت پاشەکەوت دەکرێت و بۆ سێرڤەر نانێردرێت",regions:["باکوور","باشوور","ڕۆژاڤا","ڕۆژهەڵات","شوێنێکی تر","نامەوێت وەڵام بدەمەوە"],next:"بەردەوام بە",back:"گەڕانەوە",skip:"دواتر",finish:"دەست بە گەشتەکەت بکە",search:"بەدوای پایەپیرۆزێکدا بگەڕێ",edit:"ڕێکخستنی گەشتەکەم",reset:"سڕینەوەی هەڵبژاردنەکان",daily:"گەشتی ڕۆحی تۆ",quote:"وتەی ڕۆژ لە پایەپیرۆزەکەت",prayer:"نوێژی ڕۆژ",prayerNote:"نوێژێک بۆ یەزدان بە داوای شەفاعەتی پایەپیرۆز، نەک وتەیەک لە پایەپیرۆزەکە",empty:"هێشتا وتەیەکی بە سەرچاوە بەم زمانە بۆ ئەم پایەپیرۆزە بەردەست نییە",read:"ژیاننامەکە بخوێنەوە",source:"سەرچاوە",loading:"چاوەڕێ بکە...",storage:"وێبگەڕەکەت ڕێگە بە پاشەکەوتکردن نادات. هەڵبژاردنەکان تەنها تا داخستنی ئەم پەڕەیە دەمێننەوە",privacy:"هەڵبژاردنەکانت لەم وێبگەڕەدا دەپارێزرێن. بۆ پیشاندانی وتەکان، سایت داوای وتەکانی پایەپیرۆزەکەت لە سێرڤەر دەکات. هیچ ئاگادارکردنەوەیەکی دەرەوەی سایت بەبێ مۆڵەت نانێردرێت",noResults:"هیچ پایەپیرۆزێک نەدۆزرایەوە",prayers:["ئەی یەزدانی تاقانە بە نیعمەتی خۆت دڵم پڕ لە خۆشەویستی بکە و بە نوێژی پایەپیرۆزان ڕێنماییم بکە. ئامین","ئەی یەشوای مەسیح بەزەییت پێمدا بێتەوە و بە شەفاعەتی پایەپیرۆزان یارمەتیم بدە لە ڕێگای تۆدا بمێنمەوە. ئامین","ئەی پەروەردگار ئاشتی و خاکەڕایی پێم ببەخشە و بە نوێژی پایەپیرۆزان دڵم لە هەموو خراپەیەک بپارێزە. ئامین"]},
en:{language:"Choose your preferred language",welcome:"May the peace of Jesus Christ be with you",intro:"Welcome to Orthodoxy in Kurdistan. This is a place to discover the Eastern Orthodox faith, read Holy Scripture, find answers to your questions, explore the lives of the saints, and much more.",saint:"Choose your favorite saint",saintText:"Let this saint accompany your spiritual journey through their life, teachings and intercession. Each day, discover a sourced quotation when available and a prayer on your homepage.",region:"Which part of Kurdistan are you from?",regionText:"This question is optional. Your answer is saved only in this browser and is not sent to our server.",regions:["Bakur","Bashur","Rojava","Rojhalat","Somewhere else","Prefer not to answer"],next:"Continue",back:"Back",skip:"Not now",finish:"Begin your journey",search:"Search for a saint",edit:"My journey settings",reset:"Clear my choices",daily:"Your spiritual journey",quote:"A daily saying from your saint",prayer:"Daily prayer",prayerNote:"A devotional prayer to God asking for the saints’ intercession, not a quotation from your saint.",empty:"No sourced quotation is available for this saint in this language yet.",read:"Read the life",source:"Source",loading:"Loading…",storage:"Your browser prevented saving. Your choices will last only until you leave this page.",privacy:"Your choices are stored in this browser. The website requests your selected saint’s published quotations from its server. No external notifications are sent without permission.",noResults:"No saints found.",prayers:["O Lord, fill my heart with love and guide me by Your grace, through the prayers of Your saints. Amen.","Lord Jesus Christ, have mercy on me and help me remain faithful to You through the intercession of Your saints. Amen.","O Lord, grant me peace and humility, and guard my heart from evil through the prayers of Your saints. Amen."]},
ka:{language:"აირჩიეთ სასურველი ენა",welcome:"იესო ქრისტეს მშვიდობა იყოს თქვენთან",intro:"კეთილი იყოს თქვენი მობრძანება. აქ შეგიძლიათ გაეცნოთ აღმოსავლურ მართლმადიდებლობას, წაიკითხოთ წმინდა წერილი, იპოვოთ პასუხები თქვენს კითხვებზე და გაეცნოთ წმინდანთა ცხოვრებას.",saint:"აირჩიეთ საყვარელი წმინდანი",saintText:"გაეცანით წმინდანის ცხოვრებასა და სწავლებას და სთხოვეთ მეოხება. ყოველდღე მთავარ გვერდზე ნახავთ დამოწმებულ გამონათქვამს, თუ ხელმისაწვდომია, და ლოცვას.",region:"ქურთისტანის რომელი ნაწილიდან ხართ?",regionText:"პასუხი არასავალდებულოა და მხოლოდ თქვენს ბრაუზერში ინახება. სერვერზე არ იგზავნება.",regions:["ბაკური","ბაშური","როჟავა","როჟჰალატი","სხვა ადგილი","არ მსურს პასუხი"],next:"გაგრძელება",back:"უკან",skip:"ახლა არა",finish:"დაიწყეთ თქვენი გზა",search:"წმინდანის ძიება",edit:"ჩემი გზის პარამეტრები",reset:"არჩევანის წაშლა",daily:"თქვენი სულიერი გზა",quote:"თქვენი წმინდანის დღიური გამონათქვამი",prayer:"დღის ლოცვა",prayerNote:"ღვთისადმი ლოცვა წმინდანთა მეოხების თხოვნით და არა წმინდანის ციტატა.",empty:"ამ ენაზე ამ წმინდანის დამოწმებული ციტატა ჯერ არ არის.",read:"ცხოვრების წაკითხვა",source:"წყარო",loading:"იტვირთება…",storage:"ბრაუზერში შენახვა შეუძლებელია. არჩევანი მხოლოდ ამ გვერდის დახურვამდე დარჩება.",privacy:"არჩევანი ბრაუზერში ინახება. საიტი სერვერიდან ითხოვს არჩეული წმინდანის გამოქვეყნებულ ციტატებს. გარე შეტყობინებები ნებართვის გარეშე არ იგზავნება.",noResults:"წმინდანი ვერ მოიძებნა.",prayers:["უფალო, აღავსე ჩემი გული სიყვარულით და შენი მადლით წარმმართე წმინდანთა ლოცვით. ამინ.","უფალო იესო ქრისტე, შემიწყალე და შემეწიე, რომ შენი ერთგული დავრჩე წმინდანთა მეოხებით. ამინ.","უფალო, მომანიჭე მშვიდობა და სიმდაბლე და დამიფარე ბოროტებისგან წმინდანთა ლოცვით. ამინ."]}
};
export const journeyWords=language=>copy[language]||copy.en;
const regionalWelcome = {
  "ckb": {
    "bakur": [
      "باکووری کوردستان",
      "بەخێربێیت لە باکوورەوە، خاکی چیا بەرزەکان و شارە دێرینەکان و میراثێکی دەوڵەمەندی زمان و ئەدەب. باوەڕ و ئاشتی لەگەڵت بن و یەزدان خاک و خەڵکەکەت بپارێزێت"
    ],
    "bashur": [
      "باشووری کوردستان",
      "بەخێربێیت لە باشوورەوە، خاکی شارستانییەتە دێرینەکانی میزۆپۆتامیا و میراثی زانست و ئەدەب و بیرکردنەوە. لە هەولێر و سلێمانی تا چیاکانی زاگرۆس، با ئاشتی و نیعمەتی یەزدان لەگەڵت بێت"
    ],
    "rojava": [
      "ڕۆژاڤای کوردستان",
      "بەخێربێیت لە ڕۆژاڤاوە، خاکی میراثێکی دەوڵەمەندی کوردی و مەسیحی و کۆمەڵگە جۆراوجۆرەکان. با هیوا و ئاشتی لە ماڵ و دڵتدا بمێننەوە و یەزدان خەڵکەکەت بپارێزێت"
    ],
    "rojhalat": [
      "ڕۆژهەڵاتی کوردستان",
      "بەخێربێیت لە ڕۆژهەڵاتەوە، خاکی چیاکانی زاگرۆس و میراثی کۆنی شیعر و مۆسیقا و ئەدەبی کوردی. با خۆشەویستی مەسیح ڕێگات ڕووناک بکاتەوە و ئاشتی لەگەڵت بێت"
    ],
    "other": [
      "بەخێربێیت",
      "لە هەر شوێنێکەوە هاتووبیت لێرە جێگەت هەیە. با خۆشەویستی مەسیح و ئاشتی لەگەڵت بن"
    ],
    "private": [
      "بەخێربێیت",
      "لە هەر شوێنێک بیت با ئاشتی مەسیح لەگەڵت بێت"
    ]
  },
  "en": {
    "bakur": [
      "Bakur",
      "Welcome from Bakur, a land of high mountains, ancient towns, and a rich heritage of language and literature. May God protect your people and grant you peace."
    ],
    "bashur": [
      "Bashur",
      "Welcome from Bashur, a land connected to the ancient civilizations of Mesopotamia and a rich heritage of learning, literature and thought. From Erbil and Sulaymaniyah to the Zagros mountains, may God's grace and peace be with you."
    ],
    "rojava": [
      "Rojava",
      "Welcome from Rojava, a land of rich Kurdish and Christian heritage and diverse communities. May hope and peace remain in your home and may God protect your people."
    ],
    "rojhalat": [
      "Rojhalat",
      "Welcome from Rojhalat, a land of the Zagros mountains and a rich heritage of Kurdish poetry, music and literature. May the love of Christ illuminate your journey."
    ],
    "other": [
      "Welcome",
      "Wherever you come from, there is a place for you here. May the love and peace of Christ be with you."
    ],
    "private": [
      "Welcome",
      "Wherever you are, may the peace of Christ be with you."
    ]
  },
  "ka": {
    "bakur": [
      "ბაკური",
      "კეთილი იყოს თქვენი მობრძანება ბაკურიდან, მაღალი მთების, ძველი ქალაქებისა და მდიდარი ენობრივი და ლიტერატურული მემკვიდრეობის ქვეყნიდან. ღმერთმა დაგლოცოთ და მშვიდობა მოგანიჭოთ."
    ],
    "bashur": [
      "ბაშური",
      "კეთილი იყოს თქვენი მობრძანება ბაშურიდან, ძველი მესოპოტამიის ცივილიზაციებთან დაკავშირებული მიწიდან, რომელსაც სწავლისა და ლიტერატურის მდიდარი მემკვიდრეობა აქვს. ღვთის მადლი და მშვიდობა იყოს თქვენთან."
    ],
    "rojava": [
      "როჟავა",
      "კეთილი იყოს თქვენი მობრძანება როჟავიდან, მდიდარი ქურთული და ქრისტიანული მემკვიდრეობისა და მრავალფეროვანი თემების მიწიდან. ღმერთმა დაიფაროს თქვენი ხალხი და მშვიდობა მოგანიჭოთ."
    ],
    "rojhalat": [
      "როჟჰალატი",
      "კეთილი იყოს თქვენი მობრძანება როჟჰალატიდან, ზაგროსის მთებისა და ქურთული პოეზიის, მუსიკისა და ლიტერატურის მდიდარი მემკვიდრეობის მიწიდან. ქრისტეს სიყვარულმა გაანათოს თქვენი გზა."
    ],
    "other": [
      "კეთილი იყოს თქვენი მობრძანება",
      "საიდანაც არ უნდა მოდიოდეთ, აქ თქვენთვის ადგილია. ქრისტეს სიყვარული და მშვიდობა იყოს თქვენთან."
    ],
    "private": [
      "კეთილი იყოს თქვენი მობრძანება",
      "სადაც არ უნდა იყოთ, ქრისტეს მშვიდობა იყოს თქვენთან."
    ]
  }
};
const regionIds=["bakur","bashur","rojava","rojhalat","other","private"];
function useJourneySaints(){
 const cms=useEditorial();
 const fallback=saints.map(s=>({id:s.id,slug:s.id,name_en:s.en,name_ckb:s.ckb,icon_url:"/icons/"+s.id+".webp",legacy:true}));
 return mergeSaintLibrary(cms.ready?cms.authors:fallback).map(a=>withVerifiedIcon(withClimacusContent(a)));
}
function displayName(a,language){return a?.["name_"+language]?authorName(a,language):a?.name_en||a?.name_ckb||"";}
export function JourneyWelcome({language,initial,onLanguage,onComplete,onReset,editing=false}){
 const [step,setStep]=useState(0),[chosen,setChosen]=useState(initial?.saint||""),[region,setRegion]=useState(initial?.region||"private"),[query,setQuery]=useState("");
 const w=journeyWords(language),dialog=useRef(null),heading=useRef(null), authors=useJourneySaints(), cms=useEditorial();
 useEffect(()=>{const el=dialog.current;if(!el)return;const prior=document.activeElement;if(!el.open)el.showModal();const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{if(el.open)el.close();document.body.style.overflow=old;prior?.focus?.();};},[]);
 useEffect(()=>{heading.current?.focus();if(dialog.current)dialog.current.scrollTop=0;},[step]);
 const go=()=>setStep(s=>Math.min(4,s+1));
 const finish=(r=region)=>onComplete({language,saint:chosen,region:r,completed:true});
 const filtered=authors.filter(a=>matchesAuthor(a,query));
 return <dialog ref={dialog} className="journey-dialog" aria-labelledby="journey-title" dir={language==="ckb"?"rtl":"ltr"} onCancel={e=>e.preventDefault()}>
  <div className="journey-shell">
   <div className="journey-progress" aria-label={String(step+1)+" / 5"}>{[0,1,2,3,4].map(i=><span key={i} className={i<=step?"filled":""}/>)}</div>
   <div className="journey-stage" key={step}>
   {step===0?<><img className="journey-emblem" src="/kurdistan-cross.jpg" width="150" height="150" alt=""/><div className="journey-brand" dir="ltr">Orthodoxy in Kurdistan</div><h2 id="journey-title" tabIndex={-1} ref={heading}>زمانی دڵخوازی خۆت هەڵبژێرە</h2><p lang="en" dir="ltr">Choose your preferred language</p><div className="journey-languages">{[["ckb","کوردی (سۆرانی)","Sorani Kurdish"],["en","English","English"],["ka","ქართული","Georgian"]].map(([id,label,sub])=><button type="button" key={id} onClick={()=>{onLanguage(id);go();}}><span><strong>{label}</strong><small>{sub}</small></span><ChevronRight size={20}/></button>)}</div></>:
   step===1?<><div className="journey-halo" aria-hidden="true">☦</div><h2 id="journey-title" tabIndex={-1} ref={heading}>{w.welcome}</h2><p className="journey-intro">{w.intro}</p><div className="journey-feature-icons" aria-hidden="true"><BookOpen/><Heart/><span>☦</span></div><button className="journey-primary" onClick={go}>{w.next}<ChevronRight size={18}/></button></>:
   step===2?<><h2 id="journey-title" tabIndex={-1} ref={heading}>{w.saint}</h2><p>{w.saintText}</p><label className="journey-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={w.search} aria-label={w.search}/></label>{cms.ready===null&&<p role="status">{w.loading}</p>}<div className="journey-saints">{filtered.map(a=><button key={a.id} type="button" className={chosen===a.slug?"selected":""} aria-pressed={chosen===a.slug} onClick={()=>setChosen(a.slug)}>{a.icon_url?<img src={a.icon_url} alt="" width="52" height="63" loading="lazy"/>:<span className="journey-no-icon" aria-hidden="true">☦</span>}<span>{displayName(a,language)}{a.quote_count>0&&<small>{a.quote_count} · {w.source}</small>}</span>{chosen===a.slug&&<Check size={19}/>}</button>)}</div>{!filtered.length&&<p>{w.noResults}</p>}<button className="journey-primary" disabled={!chosen} onClick={go}>{w.next}<ChevronRight size={18}/></button><button className="journey-quiet" onClick={()=>{setChosen("");go();}}>{w.skip}</button></>:
   step===3?<><h2 id="journey-title" tabIndex={-1} ref={heading}>{w.region}</h2><p>{w.regionText}</p><div className="journey-regions" role="group" aria-label={w.region}>{regionIds.map((id,i)=><button key={id} type="button" aria-pressed={region===id} className={region===id?"selected":""} onClick={()=>{setRegion(id);go();}}>{w.regions[i]}{region===id&&<Check size={18}/>}</button>)}</div><p className="journey-privacy">{w.privacy}</p><button className="journey-quiet" onClick={()=>{setRegion("private");go();}}>{w.skip}</button></>:<><div className="journey-region-art" aria-hidden="true"><svg viewBox="0 0 240 108"><defs><radialGradient id="regionSun"><stop offset="0%" stopColor="#e8c481" stopOpacity=".7"/><stop offset="100%" stopColor="#e8c481" stopOpacity="0"/></radialGradient></defs><circle cx="120" cy="45" r="45" fill="url(#regionSun)"/><circle cx="120" cy="45" r="19" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M0 99 58 39 95 80 142 20 240 99M24 99 70 67 108 99M142 20 163 58 177 53 240 99" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg></div><h2 id="journey-title" tabIndex={-1} ref={heading}>{(regionalWelcome[language]||regionalWelcome.en)[region][0]}</h2><p className="journey-region-message">{(regionalWelcome[language]||regionalWelcome.en)[region][1]}</p><button className="journey-primary" onClick={()=>finish()}>{w.finish}<ChevronRight size={18}/></button></>}
   {step>0&&<button className="journey-quiet journey-back" onClick={()=>setStep(s=>s-1)}>{w.back}</button>}
   {editing&&<button className="journey-quiet" onClick={onReset}>{w.reset}</button>}
   </div>
  </div>
 </dialog>;
}
export function JourneyDaily({language,journey,onEdit}){
 const w=journeyWords(language),cms=useEditorial(),authors=useJourneySaints();
 const a=authors.find(x=>x.slug===journey?.saint);
 const live=a&&!a.local_library&&!a.legacy&&cms.ready===true;
 const path="/quotes?limit=100&page=1&author_id="+encodeURIComponent(a?.id||"");
 const resource=useEditorialResource(path,{enabled:!!live});
 const [date,setDate]=useState(()=>new Date());
 useEffect(()=>{const update=()=>setDate(new Date());const timer=setInterval(update,30000);document.addEventListener("visibilitychange",update);return()=>{clearInterval(timer);document.removeEventListener("visibilitychange",update);};},[]);
 const data=live&&resource.path===path?resource.data:null;
 const q=dailyItem(sourcedQuotes(data?.quotes,language,a?.id),date);
 const legacy=a?.legacy?saints.find(s=>s.id===a.id)?.quote:null;
 const fallbackQuote=legacy?.[language]&&legacy?.url?legacy:null;
 if(!journey?.completed)return null;
 const prayer=dailyItem(w.prayers,date);
 return <section className="journey-daily today-section"><div className="today-section-head"><h2>{w.daily}</h2><button className="journey-edit" onClick={onEdit} aria-label={w.edit}><Settings2 size={18}/>{w.edit}</button></div><div className="journey-daily-card">
 {a&&<a className="journey-daily-saint" href={"/"+profileHref(a)}>{a.icon_url?<img src={a.icon_url} alt="" width="86" height="108" loading="lazy"/>:<span className="journey-no-icon">☦</span>}<span><strong>{displayName(a,language)}</strong><small>{w.read} <ArrowUpRight size={14}/></small></span></a>}
 {a&&(q||fallbackQuote?<div className="journey-daily-quote"><span>{w.quote}</span><blockquote>{q?textFor(q,"text",language):fallbackQuote[language]}</blockquote>{(q?.source_url||fallbackQuote?.url)?<a href={q?.source_url||fallbackQuote?.url} target="_blank" rel="noreferrer">{q?.["reference_"+language]||q?.reference||fallbackQuote?.work||w.source} ↗</a>:<p>{q?.["reference_"+language]||q?.reference}</p>}</div>:<p className="journey-quote-empty" role="status">{live&&(resource.path!==path||resource.loading)?w.loading:w.empty}</p>)}
 <div className="journey-daily-prayer"><span>{w.prayer}</span><p>{prayer}</p><small>{w.prayerNote}</small></div>
 </div></section>;
}
