import {mkdir,writeFile,readFile} from "node:fs/promises";
import {russianScriptureEdition as edition,russianSourceRoot} from "../src/russian-scripture-data.js";
import {parseRussianBook} from "../src/russian-scripture-parser.js";
const root=new URL("../public/scripture/ru_rst/",import.meta.url);
await mkdir(root,{recursive:true});
async function getBook(book){
 const target=new URL(book.id+".json",root);
 try {const cached=JSON.parse(await readFile(target,"utf8"));if(cached.translation?.id===edition.id&&cached.book?.id===book.id&&cached.chapters?.length===book.lastChapterNumber)return;}catch{}
 let err;
 for(let retry=0;retry<3;retry++){
  try{
   const res=await fetch(russianSourceRoot+book.sourceFile,{signal:AbortSignal.timeout(30000)});
   if(!res.ok)throw Error("HTTP "+res.status);
   const data=parseRussianBook(await res.text(),book,edition);
   await writeFile(target,JSON.stringify(data));
   return;
  }catch(e){err=e;}
 }
 throw Error("Failed to prepare "+book.id+": "+err);
}
for(let i=0;i<edition.books.length;i+=8)await Promise.all(edition.books.slice(i,i+8).map(getBook));
console.log("Prepared "+edition.books.length+" Russian Synodal Bible books.");
