// Wikimedia Commons file descriptions were checked for subject and reuse status.
const files = {
"methodius-confessor": ["Agios Methodios Konstantinoupoleos Vissarionos.jpg","Tzortis Phouka, 16th-century fresco, Saint Bessarion's Monastery"],
"agatha-sicily": ["Agatha orthodox icon.jpg","Anonymous icon, circa 1500"],
"innocent-alaska": ["St Innocent of Alaska.JPG","Wolfymoza","cc-by-sa/4.0"],
"lucia-syracuse": ["Chiesa di Santa Lucia (icons)03.png","Asia, photograph of Byzantine icon of Saint Lucy","cc-by-sa/4.0"],
"silouan-athonite": ["Silouanicon.jpg","Historical icon, Wikimedia Commons (Jack1956 upload)"],
"joseph-hesychast": ["FullBodyIconOfElderJoseph.jpg","Moralmonke, Wikimedia Commons","cc-by-sa/4.0"],
"matrona-moscow": ["Блаженная Матрона Московская (13899411716).jpg","Icon Painting Workshop Eleon","cc-by/2.0"],
"photina-samaritan": ["Saint Photina.jpg","Anonymous 13th-century icon detail"],
"menas-egypt": ["Saint Menas with scenes from his life Tryavna 19th-century icon.jpg","Anonymous 19th-century Tryavna icon"],
  "constantine-great": [
    "Saint Constantin and Helena, mother of Constantine I icon, Syria (14th Century).jpg",
    "14th-century Syrian icon; Michel Bakni / Wikimedia Commons",
    "cc-by-sa/4.0"
  ],
  "helen-empress": [
    "Saint Constantin and Helena, mother of Constantine I icon, Syria (14th Century).jpg",
    "14th-century Syrian icon; Michel Bakni / Wikimedia Commons",
    "cc-by-sa/4.0"
  ],
  "olga-kiev": [
    "St. Olga, 1895 (priv. coll).jpg",
    "Anonymous Russian icon painter, 1895"
  ],
  "cyril-slavs": [
    "Kyrill&Method.jpg",
    "18th-century Russian icon of Cyril and Methodius"
  ],
  "methodius-slavs": [
    "Kyrill&Method.jpg",
    "18th-century Russian icon of Cyril and Methodius"
  ],
  "mark-ephesus": [
    "Mark of Ephesus.jpg",
    "Historical icon via Wikimedia Commons"
  ],
  "porphyrius-gaza": [
    "Saint Porphyrius of Gaza Crop.jpg",
    "Historical Orthodox fresco via Wikimedia Commons"
  ],
  "euthymius-great": [
    "Euthymius the Great.jpg",
    "Historical icon via Wikimedia Commons"
  ],
  "xenia-petersburg": [
    "Ksenia of petersbourg.jpeg",
    "Orthodox icon via Wikimedia Commons",
    "cc0"
  ],
  "marina-antioch": [
    "Saint Marina icon.JPG",
    "15th-century icon, Byzantine and Christian Museum, Athens"
  ],
  "theodore-stratelates": [
    "Byzantine enameled icon of Theodore Stratelates.jpg",
    "Historical Byzantine enamel icon"
  ],
  "thekla": [
    "Saint Thecla.jpg",
    "Historical image of Saint Thecla via Wikimedia Commons"
  ],
  "simeon-stylite": [
    "Saint Simeon Stylites the Elder (1664 icon).jpg",
    "1664 icon"
  ],
  "anastasia-martyr": [
    "Saint Anastasia.jpg",
    "Traditional Orthodox icon via Wikimedia Commons"
  ],
  "barbara-great-martyr": [
    "Saint-Barbara-Grk-ikon.png",
    "Traditional Greek Orthodox icon"
  ],
  "john-baptist": [
    "An early byzantine icon of John the Baptist, 6th century AD.jpg",
    "Anonymous Byzantine master, Khanenko Museum, Kyiv"
  ],
  "catherine-alexandria": [
    "St.CatherineofAlexandria.jpg",
    "Anonymous 14th-century icon"
  ],
  "panteleimon": [
    "St Panteleimon.jpg",
    "Historic icon, Saint Catherine's Monastery, Sinai"
  ],
  "paraskevi-rome": [
    "Saint Paraskeve Icon with Scenes.jpg",
    "Historical icon with scenes via Wikimedia Commons"
  ],
  "demetrios-thessaloniki": [
    "Saint Demetrios de Thessalonique.jpg",
    "Anonymous Russian icon, Tretyakov Gallery"
  ],
  "sabbas-sanctified": [
    "SabbastheSanctified.jpg",
    "Medieval icon"
  ],
  "sava-serbia": [
    "Saint Sava, fresco from Mileševa.jpg",
    "Historical fresco, Mileševa Monastery"
  ],
  "hermolaus": [
    "Greek Icon of Saints Hermolaos and Panteleimon.jpg",
    "Historical Greek icon depicting Hermolaos and Panteleimon"
  ],
  "macrina-younger": [
    "Macrina the Younger.jpg",
    "Fresco in Saint Sophia Cathedral, Kyiv"
  ],
  "tikhon-zadonsk": [
    "St. Tikhon of Zadonsk (19th. c., Russia, priv. coll.).jpg",
    "19th-century Russian icon"
  ],
  "herman-alaska": [
    "Saint Herman of Alaska.jpg",
    "Coastal Monastery icon, AlexEleon / Wikimedia Commons",
    "cc-by-sa/3.0"
  ],
  "john-kronstadt": [
    "John of Kronstadt, Иоанн Кронштадский.jpg",
    "Saint Nicholas Church, Batumi; Wikivorker / Wikimedia Commons",
    "cc0"
  ],
  "theodosius-cenobiarch": [
    "Theodosius the Cenobiarch (mosaic in Nea Moni).jpg",
    "Historical mosaic in Nea Moni"
  ],
  "euphemia-chalcedon": [
    "St Euphemia.jpg",
    "Historical icon via Wikimedia Commons"
  ],
  "gregory-dialogus": [
    "Άγιος Γρηγόριος ο Διάλογος 0633.jpg",
    "17th-century icon; C messier / Wikimedia Commons",
    "cc0"
  ],
  "vladimir-kiev": [
    "Icon of saint Vladimir.jpg",
    "Anonymous historical icon"
  ],
  "ignatius-antioch": [
    "Ignatius Theophorus, Ignatius of Antioch.jpg",
    "Orthodox icon; Wikivorker / Wikimedia Commons",
    "cc0"
  ]
};
export const saintIconCount = Object.keys(files).length;
export function withVerifiedIcon(author) {
 if (!author || author.icon_url || !Object.hasOwn(files,author.slug)) return author;
 const [file,credit,license]=files[author.slug];
 const name=encodeURIComponent(file.replaceAll(" ","_"));
 return {...author,icon_url:"https://commons.wikimedia.org/wiki/Special:FilePath/"+name+"?width=600",icon_source:"https://commons.wikimedia.org/wiki/File:"+name,icon_credit:credit+" · Wikimedia Commons",icon_license_url:license==="cc0"?"https://creativecommons.org/publicdomain/zero/1.0/":license?"https://creativecommons.org/licenses/"+license+"/":"https://creativecommons.org/publicdomain/mark/1.0/",icon_alt:author.name_en||author.name_ckb||""};
}
