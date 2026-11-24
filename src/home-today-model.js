// Match only unambiguous fixed-date feast fields. No inference about a church's
// calendar, movable feasts or fasting rules. Unmatched dates show a featured saint.
const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
export function selectTodaySaint(authors,date) {
 const eligible=(authors||[]).filter(a=>a?.icon_url && a?.slug);
 const month=months[date.getMonth()], day=date.getDate();
 const candidates=[month+" "+day,day+" "+month].map(x=>x.toLowerCase());
 const found=eligible.find(a=>candidates.includes((a.feast_en||"").trim().toLowerCase()));
 if(found)return {author:found,match:true};
 const index=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
 return {author:eligible[((index%eligible.length)+eligible.length)%eligible.length]||null,match:false};
}
