// Preserve the source's numbering, additions in square brackets and text.
export function parseRussianBook(raw,book,edition){
 const decode=s=>s.replace(/<\/?i>/g,"").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&(mdash|ndash|nbsp|quot|apos|lt|gt|amp|hellip|laquo|raquo);/g,(_,name)=>({mdash:"—",ndash:"–",nbsp:"\u00a0",quot:'"',apos:"'",lt:"<",gt:">",amp:"&",hellip:"…",laquo:"«",raquo:"»"})[name]);
 const chapters=Array.from({length:book.lastChapterNumber},(_,i)=>({number:i+1,content:[]}));
 let total=0;
 for(const line of raw.replace(/^\uFEFF/,"").split(/\r?\n/)){
  if(!line.trim()||line==="#p#")continue;
  const match=line.match(/^#(\d+):(\d+)#(.*)$/);
  if(!match)throw Error("Unexpected source line in "+book.id+": "+line.slice(0,40));
  const chapter=Number(match[1]),number=Number(match[2]),text=decode(match[3]);
  if(chapter===0||number===0){const target=chapters[Math.max(0,chapter-1)];if(!target)throw Error("Invalid source heading");target.content.push({type:"hebrew_subtitle",text});continue;}
  const target=chapters[chapter-1];if(!target)throw Error("Invalid source chapter "+book.id+" "+chapter);
  target.content.push({type:"verse",number,text});total++;
 }
 if(!total||chapters.some(c=>!c.content.some(v=>v.type==="verse")))throw Error("Incomplete Russian Bible book "+book.id);
 return {translation:{id:edition.id,name:edition.name,language:edition.language},book:{id:book.id,name:book.name},chapters};
}
