import React,{useState} from "react";
import {iconCandidates,augustineImageCredit} from "./commentary-icons.js";
export function CommentaryIcon({author,fallback}){
 const candidates=iconCandidates(author,fallback);
 const [failed,setFailed]=useState([]);
 const src=candidates.find(url=>!failed.includes(url));
 if(!src)return <span className="verse-father-monogram" aria-hidden="true">✣</span>;
 const img=<img key={src} src={src} alt="" loading="lazy" decoding="async" onError={()=>setFailed(old=>[...old,src])}/>;
 return src.includes("AugustineLateran.jpg")?<a className="commentary-icon-credit" href={augustineImageCredit} target="_blank" rel="noreferrer" title="Augustine of Hippo · sixth-century Lateran fresco · Public domain">{img}</a>:img;
}
