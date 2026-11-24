// Only exact, curated identity matches. Never use another saint as a fallback.
const localGroups=[
  [
    "chrysostom",
    "John Chrysostom",
    "John the Golden Mouthed",
    "John of Constantinople"
  ],
  [
    "basil",
    "Basil the Great",
    "Basil of Caesarea",
    "Basil of Cesarea"
  ],
  [
    "gregory-theologian",
    "Gregory the Theologian",
    "Gregory of Nazianzus",
    "Gregory Nazianzen"
  ],
  [
    "athanasius",
    "Athanasius the Great",
    "Athanasius of Alexandria"
  ],
  [
    "ephrem",
    "Ephrem the Syrian",
    "Ephraim the Syrian",
    "Ephrem of Syria"
  ],
  [
    "isaac",
    "Isaac the Syrian",
    "Isaac of Nineveh",
    "Isaac of Syria"
  ],
  [
    "paisios",
    "Paisios of Mount Athos",
    "Paisios the Athonite"
  ],
  [
    "anthony",
    "Anthony the Great",
    "Antony the Great",
    "Anthony of Egypt"
  ],
  [
    "maximus",
    "Maximus the Confessor"
  ],
  [
    "gregory-nyssa",
    "Gregory of Nyssa"
  ],
  [
    "saints/cyril-alexandria",
    "Cyril of Alexandria"
  ],
  [
    "saints/cyril-jerusalem",
    "Cyril of Jerusalem"
  ],
  [
    "saints/cyprian-carthage",
    "Cyprian of Carthage",
    "Cyprian the Martyr"
  ],
  [
    "saints/irenaeus-lyons",
    "Irenaeus of Lyons",
    "Irenaeus of Lyon"
  ],
  [
    "saints/ignatius-antioch",
    "Ignatius of Antioch",
    "Ignatius the Godbearer",
    "Ignatius Theophorus"
  ],
  [
    "saints/justin-martyr",
    "Justin Martyr",
    "Justin the Philosopher",
    "Justin of Caesarea"
  ],
  [
    "saints/gregory-palamas",
    "Gregory Palamas"
  ],
  [
    "saints/macarius-great",
    "Macarius the Great",
    "Macarius of Egypt"
  ],
  [
    "saints/polycarp-smyrna",
    "Polycarp of Smyrna"
  ],
  [
    "saints/pachomius-great",
    "Pachomius the Great"
  ],
  [
    "saints/mary-egypt",
    "Mary of Egypt"
  ],
  [
    "saints/nectarios-aegina",
    "Nectarios of Aegina",
    "Nektarios of Aegina",
    "Nectarius of Aegina"
  ],
  [
    "saints/nicholas-myra",
    "Nicholas of Myra",
    "Nicholas the Wonderworker"
  ],
  [
    "saints/seraphim-sarov",
    "Seraphim of Sarov"
  ],
  [
    "saints/sergius-radonezh",
    "Sergius of Radonezh"
  ],
  [
    "saints/spyridon-tremithus",
    "Spyridon of Tremithus",
    "Spyridon of Trimythous"
  ],
  [
    "saints/george-greatmartyr",
    "George the Great Martyr",
    "George the Greatmartyr"
  ],
  [
    "saints/david-gareji",
    "David of Gareji",
    "David Garejeli"
  ],
  [
    "saints/euthymius-athonite",
    "Euthymius the Athonite"
  ],
  [
    "saints/nino-georgia",
    "Nino of Georgia",
    "Nina of Georgia"
  ],
  [
    "saints/shio-mgvime",
    "Shio of Mgvime",
    "Shio Mgvime"
  ],
  [
    "saints/mary-magdalene",
    "Mary Magdalene"
  ],
  [
    "saints/john-theologian",
    "John the Theologian",
    "John the Evangelist",
    "John the Apostle"
  ],
  [
    "saints/andrew",
    "Andrew the Apostle",
    "Andrew the First Called"
  ],
  [
    "saints/bartholomew",
    "Bartholomew the Apostle"
  ],
  [
    "saints/james-alphaeus",
    "James son of Alphaeus",
    "James the son of Alphaeus"
  ],
  [
    "saints/james-zebedee",
    "James son of Zebedee",
    "James the son of Zebedee"
  ],
  [
    "saints/jude",
    "Jude the Apostle",
    "Jude Thaddaeus"
  ],
  [
    "saints/luke",
    "Luke the Evangelist",
    "Luke the Apostle"
  ],
  [
    "saints/mark",
    "Mark the Evangelist",
    "Mark the Apostle"
  ],
  [
    "saints/matthew",
    "Matthew the Evangelist",
    "Matthew the Apostle"
  ],
  [
    "saints/matthias-apostle",
    "Matthias the Apostle"
  ],
  [
    "saints/paul",
    "Paul the Apostle",
    "Apostle Paul",
    "Paul of Tarsus"
  ],
  [
    "saints/peter",
    "Peter the Apostle",
    "Apostle Peter",
    "Simon Peter"
  ],
  [
    "saints/philip",
    "Philip the Apostle",
    "Apostle Philip"
  ],
  [
    "saints/simon-zealot",
    "Simon the Zealot"
  ],
  [
    "saints/stephen-protomartyr",
    "Stephen the Protomartyr",
    "Stephen the First Martyr"
  ],
  [
    "saints/thomas",
    "Thomas the Apostle",
    "Apostle Thomas"
  ]
];
const normalize=value=>String(value||"").normalize("NFKD").replace(/\p{M}/gu,"").toLowerCase().replace(/^static-saint:/,"").replace(/[^a-z0-9]+/g," ").trim().replace(/^(saint|st|blessed)\s+/,"").trim();
const index=new Map();
for(const [path,...names] of localGroups){const file=path.split("/").pop();for(const key of [file,...names])index.set(normalize(key),"/icons/"+path+".webp");}
const augustineImage="https://upload.wikimedia.org/wikipedia/commons/2/23/AugustineLateran.jpg";
export const augustineImageCredit="https://commons.wikimedia.org/wiki/File:AugustineLateran.jpg";
for(const name of ["Augustine","Augustine of Hippo","Augustinus of Hippo","Augustin of Hippo"])index.set(normalize(name),augustineImage);
export function iconCandidates(...authors){
 const candidates=[];
 for(const author of authors.filter(Boolean)){
   for(const key of [author.slug,author.legacy_key,author.name_en]){const image=index.get(normalize(key));if(image)candidates.push(image);}
 }
 // Prefer the known local image over a stale external URL; retain custom CMS images for unmapped authors.
 for(const a of authors.filter(Boolean))if(typeof a.icon_url==="string"&&a.icon_url.trim())candidates.push(a.icon_url.trim());
 return [...new Set(candidates)];
}
