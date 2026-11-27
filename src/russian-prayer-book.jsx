import React, {useState} from "react";
import {Search} from "lucide-react";
import {russianPrayers} from "./russian-prayers.js";
const rules = [
 ["Полное утреннее молитвенное правило", "https://azbyka.ru/molitvoslov/molitvy-utrennie-bez-tolkovanij.html"],
 ["Полное вечернее молитвенное правило", "https://azbyka.ru/molitvoslov/molitvy-na-son-gryadushhim.html"],
 ["Правило ко Святому Причащению, каноны и акафисты", "https://ms.pravoslavie.ru/"]
];
export function RussianPrayerBook() {
 const [search,setSearch]=useState(""),[topic,setTopic]=useState("");
 const categories=[...new Set(russianPrayers.map(p=>p.topic))];
 const found=russianPrayers.filter(p=>(!topic||p.topic===topic)&&[p.title_ru,p.topic,p.text_ru].join(" ").toLocaleLowerCase("ru").includes(search.trim().toLocaleLowerCase("ru")));
 return <div className="page" lang="ru" dir="ltr">
 <header className="heritage-heading"><h1>Православный молитвослов</h1><p>Традиционные молитвы Русской Православной Церкви</p></header>
 <aside className="prayer-translation-note"><p>Молитвы приведены на церковнославянском языке в современной кириллической записи без знаков ударения. Это традиционные тексты, а не новые переводы. Отдельные молитвы не заменяют полного утреннего или вечернего правила.</p></aside>
 <div className="prayer-list"><h2>Полные молитвенные правила</h2>{rules.map(([title,url])=><p key={url}><a className="text-link" href={url} target="_blank" rel="noreferrer">{title} ↗</a></p>)}</div>
 <label className="search editorial-search"><Search size={18}/><input type="search" value={search} onChange={e=>setSearch(e.target.value)} aria-label="Поиск молитв" placeholder="Поиск по названию или тексту молитвы…"/></label>
 <select className="editorial-topic" value={topic} onChange={e=>setTopic(e.target.value)} aria-label="Раздел молитв"><option value="">Все молитвы</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
 <div className="prayer-list">{found.map(p=><details className="prayer" key={p.id}><summary><h2>{p.title_ru}</h2><span>{p.topic}</span></summary><p className="prayer-text editorial-verbatim">{p.text_ru}</p>{p.note_ru&&<p className="editorial-review-note">{p.note_ru}</p>}<a className="text-link" href={p.source_url} target="_blank" rel="noreferrer">{p.reference} ↗</a></details>)}</div>
 {!found.length&&<p>Молитвы не найдены.</p>}
 </div>
}
