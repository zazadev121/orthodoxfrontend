// Passage ranges from the historical English translation indexes linked below.
// A source covering a passage is not necessarily a direct comment on each verse.
// Augustine 50 and 94 omitted pending review of ambiguous/incorrect index headings.
export const fathers = {
  chrysostom: { slug:"chrysostom", name_en:"Saint John Chrysostom", name_ckb:"پایەپیرۆز یۆحەنای دەمزێڕین", name_ka:"წმინდა იოანე ოქროპირი", icon_url:"/icons/chrysostom.webp" },
  augustine: { slug:"augustine-of-hippo", name_en:"Saint Augustine of Hippo", name_ckb:"پایەپیرۆز ئاگوستینۆسی هیپۆ", name_ka:"წმინდა ავგუსტინე იპონიელი" },
  cyril: { slug:"cyril-alexandria", name_en:"Saint Cyril of Alexandria", name_ckb:"پایەپیرۆز سیریلی ئەسکەندەریە", name_ka:"წმინდა კირილე ალექსანდრიელი", icon_url:"/icons/saints/cyril-alexandria.webp" }
};
const chrysostom = "1:1;1:1;1:1;1:3-5;1:6-8;1:9;1:9-10;1:11;1:11-13;1:14;1:14;1:15;1:16-17;1:18;1:21-27;1:28-34;1:35-40;1:41-42;1:43-49;1:49-2:4;2:4-10;2:11-22;2:23-3:4;3:5;3:6-11;3:12-16;3:17-20;3:22-30;3:31-34;3:35-4:12;4:13-22;4:23-27;4:28-39;4:40-53;4:54-5:3;5:6-13;5:14-21;5:23-30;5:31-39;5:39-47;6:1-7;6:16-25;6:26-27;6:28-40;6:41-52;6:53-70;7:1-8;7:9-24;7:25-35;7:37-44;7:45-8:19;8:20-31;8:31-46;8:48-59;9:1-5;9:6-16;9:17-34;9:34-10:12;10:14-19;10:22-42;11:1-27;11:30-40;11:41-48;11:49-12:8;12:8-24;12:25-32;12:34-41;12:42-50;13:1-2;13:1-18;13:20-31;13:36-14:7;14:8-14;14:15-31;14:31-15:10;15:11-16:4;16:4-15;16:16-33;17:1-5;17:6-13;17:14-26;18:1-37;18:37-19:15;19:16-20:2;20:10-23;20:24-21:14;21:15-25";
const augustine = "1:1-5;1:6-14;1:15-18;1:19-33;1:33;1:32-33;1:34-51;2:1-4;2:1-2;2:12-21;2:23-3:5;3:6-21;3:22-29;3:29-36;4:1-42;4:43-54;5:1-18;5:19;5:19-30;5:19;5:20-23;5:24-30;5:19-40;6:1-14;6:15-44;6:41-59;6:60-72;7:1-13;7:14-18;7:19-24;7:25-36;7:37-39;7:40-8:11;8:12;8:13-14;8:15-18;8:19-20;8:21-25;8:26-27;8:28-32;8:31-36;8:37-47;8:48-59;9:1-41;10:1-10;10:11-13;10:14-21;10:22-42;11:1-54;;12:12-26;12:27-36;12:37-43;12:44-50;13:1-5;13:6-10;13:6-10;13:10-15;13:16-20;13:21;13:21-26;13:26-31;13:31-32;13:33;13:34-35;13:36-38;14:1-3;14:1-3;14:4-6;14:7-10;14:10-14;14:10-14;14:10-14;14:15-17;14:18-21;14:22-24;14:25-27;14:27-28;14:29-31;15:1-3;15:4-7;15:8-10;15:2-12;15:13;15:14-15;15:15-16;15:17-19;15:20-21;15:22-23;15:23;15:24-25;15:26-27;16:1-4;;16:8-11;16:12-13;16:12-13;16:12-33;16:13;16:13-15;16:16-23;16:23-28;16:29-33;17:1;17:1-5;17:6-8;17:9-13;17:14-19;17:20;17:21-23;17:24-26;18:1-12;18:13-27;18:28-32;18:33-40;19:1-16;19:17-22;19:23-24;19:24-30;19:31-20:9;20:10-29;20:30-21:11;21:12-19;21:19-25";
function bounds(range) {
  const [first,last] = range.split("-");
  const [chapter,verse] = first.split(":").map(Number);
  const [endChapter,endVerse] = !last ? [chapter,verse] : last.includes(":") ? last.split(":").map(Number) : [chapter,Number(last)];
  return [chapter*1000+verse,endChapter*1000+endVerse];
}
function indexed(author,ranges,offset,prefix,kind,work) {
  return ranges.split(";").flatMap((range,i)=>{
    if(!range)return [];
    const number=i+offset;
    return [{author,range,number,reference:work+" · "+kind+" "+number,url:"https://www.newadvent.org/fathers/"+prefix+String(number).padStart(author==="chrysostom"?2:3,"0")+".htm"}];
  });
}
const cyrilUrl="https://www.ccel.org/ccel/pearse/morefathers/files/cyril_on_john_01_book1.htm";
const cyril = [[1,"1:1"],[2,"1:1"],[3,"1:1"],[4,"1:2"],[5,"1:3"],[6,"1:3-4"],[7,"1:4"],[8,"1:9"],[9,"1:9-10"],[10,"1:18"]].map(([number,range])=>({author:"cyril",range,number,reference:"Commentary on John · Book I, chapter "+number,url:cyrilUrl}));
const excerpts={
  "chrysostom:2:1":"For this ‘was in the beginning,’ is nothing else than expressive of ever being and being infinitely.",
  "chrysostom:5:3":"not one, whether it be visible or intelligible was brought into being without the power of the Son.",
  "chrysostom:5:5":"He calls death and error, ‘darkness.’",
  "augustine:1:3":"Do not then believe that that was made by which were made all things, lest you be not new-made by the Word, which makes all things new.",
  "cyril:4:2":"This, there being no second."
};
const sources=[...indexed("chrysostom",chrysostom,2,"2401","Homily","Homilies on John"),...indexed("augustine",augustine,1,"1701","Tractate","Tractates on John"),...cyril];
export function patristicSources(book,chapter,verse) {
  if(book!=="JHN") return [];
  const position=chapter*1000+verse;
  return sources.filter(s=>{const [start,end]=bounds(s.range);return position>=start&&position<=end}).map(s=>({...s,excerpt:chapter===1?excerpts[s.author+":"+s.number+":"+verse]:undefined}));
}
