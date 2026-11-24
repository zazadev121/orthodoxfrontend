import React,{useEffect,useState} from "react";
import {translationsFor,localHomilies} from "./patristic-translations.js";
const words={
en:["Read full text here","Original English passage","Sorani translation (editorial draft; awaiting review)","Source / attribution","Full text not yet imported","Loading…","Unable to load text","English historical translation"],
ckb:["دەقی تەواو لێرە بخوێنەوە","دەقی ئینگلیزیی سەرچاوە","وەرگێڕانی سۆرانی (ڕەشنووس؛ پێویستی بە پێداچوونەوە هەیە)","سەرچاوە","دەقی تەواو هێشتا زیاد نەکراوە","چاوەڕوان بە…","دەقەکە بار نەکرا","وەرگێڕانی مێژوویی ئینگلیزی"],
ka:["სრული ტექსტის წაკითხვა","ინგლისური წყაროს მონაკვეთი","სორანული თარგმანი (სარედაქციო პროექტი)","წყარო","სრული ტექსტი ჯერ არ დამატებულა","იტვირთება…","ტექსტი ვერ ჩაიტვირთა","ისტორიული ინგლისური თარგმანი"]
};
export function HistoricalReading({source,chapter,verse,language}){
 const w=words[language]||words.en;
 const rows=translationsFor(source.author,source.number,chapter,verse);
 const key=source.author+"-"+source.number;
 const local=localHomilies.includes(key);
 const [open,setOpen]=useState(false),[data,setData]=useState(null),[error,setError]=useState(false);
 useEffect(()=>{if(!open||!local)return;const c=new AbortController();setError(false);
 fetch("/patristic/john/"+key+".json",{signal:c.signal}).then(r=>{if(!r.ok)throw Error("source unavailable");return r.json()}).then(d=>{if(!c.signal.aborted&&d.author===source.author&&d.number===source.number)setData(d)}).catch(()=>{if(!c.signal.aborted)setError(true)});
 return()=>c.abort();},[open,key,local,source.author,source.number]);
 return <div className="historical-reading">
 {rows.map((r,i)=><div key={i} className="historical-passage">{language==="ckb"?<><p className="study-source-reference">{w[2]}</p><blockquote lang="ckb" dir="rtl">{r.ckb}</blockquote><details><summary>{w[1]}</summary><blockquote lang="en" dir="ltr">{r.en}</blockquote></details></>:<blockquote lang="en" dir="ltr">{r.en}</blockquote>}</div>)}
 {!rows.length&&source.excerpt&&<blockquote lang="en" dir="ltr">{source.excerpt}</blockquote>}
 {local?<details onToggle={e=>setOpen(e.currentTarget.open)}><summary>{w[0]}</summary>{error?<p>{w[6]}</p>:data?<><p className="study-source-reference">{w[7]} · {data.edition}</p><div className="historical-full-text" lang="en" dir="ltr">{data.text.split(/\n\n+/).map((p,i)=><p key={i}>{p}</p>)}</div><a className="text-link" href={data.source} target="_blank" rel="noreferrer">{w[3]}</a></>:<p>{w[5]}</p>}</details>:<p className="study-source-reference">{w[4]}</p>}
 <a className="text-link historical-attribution" href={source.url} target="_blank" rel="noreferrer">{w[3]} ↗</a>
 </div>;
}
