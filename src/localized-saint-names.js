// Localized names keyed by stable identifier and known aliases; no cross-language display fallback.
const records = [
  [
    "chrysostom",
    "Saint John Chrysostom",
    "پایەپیرۆز یۆحەنای دەمزێڕین",
    "Святитель Иоанн Златоуст",
    "წმინდა იოანე ოქროპირი",
    [
      "john-chrysostom",
      "john chrysostom"
    ]
  ],
  [
    "basil",
    "Saint Basil the Great",
    "پایەپیرۆز باسیلۆسی مەزن",
    "Святитель Василий Великий",
    "წმინდა ბასილი დიდი",
    [
      "basil-the-great",
      "basil of caesarea"
    ]
  ],
  [
    "gregory-theologian",
    "Saint Gregory the Theologian",
    "پایەپیرۆز گریگۆری خوداناس",
    "Святитель Григорий Богослов",
    "წმინდა გრიგოლ ღვთისმეტყველი",
    [
      "gregory-nazianzus",
      "gregory-of-nazianzus"
    ]
  ],
  [
    "athanasius",
    "Saint Athanasius the Great",
    "پایەپیرۆز ئەتاناسیۆسی مەزن",
    "Святитель Афанасий Великий",
    "წმინდა ათანასე დიდი",
    [
      "athanasius-of-alexandria"
    ]
  ],
  [
    "ephrem",
    "Saint Ephrem the Syrian",
    "پایەپیرۆز ئەفرایمی سریانی",
    "Преподобный Ефрем Сирин",
    "ღირსი ეფრემ ასური",
    [
      "ephrem-the-syrian"
    ]
  ],
  [
    "isaac",
    "Saint Isaac the Syrian",
    "پایەپیرۆز ئیسحاقی سریانی",
    "Преподобный Исаак Сирин",
    "ღირსი ისააკ ასური",
    [
      "isaac-the-syrian",
      "isaac-of-nineveh"
    ]
  ],
  [
    "paisios",
    "Saint Paisios of Mount Athos",
    "پایەپیرۆز پاییسیۆسی ئاتۆس",
    "Преподобный Паисий Святогорец",
    "ღირსი პაისი ათონელი",
    [
      "paisios-the-athonite",
      "paisios-athonite"
    ]
  ],
  [
    "anthony",
    "Saint Anthony the Great",
    "پایەپیرۆز ئەنتۆنی مەزن",
    "Преподобный Антоний Великий",
    "ღირსი ანტონი დიდი",
    [
      "anthony-the-great"
    ]
  ],
  [
    "maximus",
    "Saint Maximus the Confessor",
    "پایەپیرۆز ماکسیموسی دانپێدەر",
    "Преподобный Максим Исповедник",
    "ღირსი მაქსიმე აღმსარებელი",
    [
      "maximus-the-confessor"
    ]
  ],
  [
    "gregory-nyssa",
    "Saint Gregory of Nyssa",
    "پایەپیرۆز گریگۆری نیسا",
    "Святитель Григорий Нисский",
    "წმინდა გრიგოლ ნოსელი",
    [
      "gregory-of-nyssa"
    ]
  ],
  [
    "john-of-damascus",
    "Saint John of Damascus",
    "پایەپیرۆز یۆحەنای دیمەشقی",
    "Преподобный Иоанн Дамаскин",
    "ღირსი იოანე დამასკელი",
    [
      "john-damascene",
      "john-damascus",
      "damascene",
      "damascus",
      "john-of-damaskus",
      "st john of damascus",
      "john damascene",
      "یۆحەنای دیمەشقی",
      "یۆحەنای دیمەشق",
      "یۆحەنای دیمەشقیی"
    ]
  ],
  [
    "john-climacus",
    "Saint John Climacus",
    "پایەپیرۆز یۆحەنای کلیماکۆس",
    "Преподобный Иоанн Лествичник",
    "ღირსი იოანე კიბისაღმწერელი",
    [
      "climacus",
      "john-of-the-ladder",
      "john climacus"
    ]
  ],
  [
    "gregory-palamas",
    "Saint Gregory Palamas",
    "پایەپیرۆز گریگۆری پالاماس",
    "Святитель Григорий Палама",
    "წმინდა გრიგოლ პალამა",
    []
  ],
  [
    "nicholas",
    "Saint Nicholas of Myra",
    "پایەپیرۆز نیکۆلاۆس",
    "Святитель Николай Чудотворец",
    "წმინდა ნიკოლოზ საკვირველთმოქმედი",
    [
      "nicholas-of-myra",
      "nicholas-the-wonderworker"
    ]
  ],
  [
    "paul",
    "Saint Paul the Apostle",
    "پایەپیرۆز پۆڵۆسی نێردراو",
    "Апостол Павел",
    "წმინდა პავლე მოციქული",
    [
      "paul-apostle"
    ]
  ],
  [
    "peter",
    "Saint Peter the Apostle",
    "پایەپیرۆز پەترۆسی نێردراو",
    "Апостол Пётр",
    "წმინდა პეტრე მოციქული",
    [
      "peter-apostle"
    ]
  ],
  [
    "thomas",
    "Saint Thomas the Apostle",
    "پایەپیرۆز تۆماسی نێردراو",
    "Апостол Фома",
    "წმინდა თომა მოციქული",
    [
      "thomas-apostle"
    ]
  ],
  [
    "ignatius",
    "Saint Ignatius of Antioch",
    "پایەپیرۆز ئیگناتیۆسی ئەنتاکیا (تێئۆفۆرۆس)",
    "Священномученик Игнатий Богоносец",
    "წმინდა ეგნატე ღმერთშემოსილი",
    [
      "ignatius-of-antioch",
      "ignatius-theophorus"
    ]
  ],
  [
    "cyril-alexandria",
    "Saint Cyril of Alexandria",
    "پایەپیرۆز کیریلۆسی ئەسکەندەریە",
    "Святитель Кирилл Александрийский",
    "წმინდა კირილე ალექსანდრიელი",
    [
      "cyril-of-alexandria"
    ]
  ],
  [
    "irenaeus",
    "Saint Irenaeus of Lyons",
    "پایەپیرۆز ئیرینیۆسی لیۆن",
    "Священномученик Ириней Лионский",
    "წმინდა ირინეოს ლიონელი",
    [
      "irenaeus-of-lyons"
    ]
  ],
  [
    "mary-egypt",
    "Saint Mary of Egypt",
    "پایەپیرۆز مەریەمی میسری",
    "Преподобная Мария Египетская",
    "ღირსი მარიამ ეგვიპტელი",
    [
      "mary-of-egypt"
    ]
  ],
  [
    "seraphim",
    "Saint Seraphim of Sarov",
    "پایەپیرۆز سێرافیمی سارۆڤ",
    "Преподобный Серафим Саровский",
    "ღირსი სერაფიმე საროველი",
    [
      "seraphim-of-sarov"
    ]
  ],
  [
    "nektarios",
    "Saint Nektarios of Aegina",
    "پایەپیرۆز نێکتاریۆسی ئایگینا",
    "Святитель Нектарий Эгинский",
    "წმინდა ნექტარიოს ეგინელი",
    [
      "nektarios-of-aegina"
    ]
  ],
  [
    "john-theologian",
    "Saint John the Theologian",
    "پایەپیرۆز یۆحەنای خوداناس",
    "Апостол и евангелист Иоанн Богослов",
    "წმინდა იოანე ღვთისმეტყველი",
    [
      "john-the-apostle",
      "john-apostle"
    ]
  ],
  [
    "constantine-great",
    "Saint Constantine the Great",
    "پایەپیرۆز قسطنطینی مەزن",
    "Равноапостольный царь Константин Великий",
    "წმინდა კონსტანტინე დიდი",
    []
  ],
  [
    "helen-empress",
    "Saint Helen, Equal to the Apostles",
    "پایەپیرۆز هێلێنای هاوشانی نێردراوان",
    "Равноапостольная царица Елена",
    "წმინდა ელენე დედოფალი",
    []
  ],
  [
    "olga-kiev",
    "Saint Olga of Kiev",
    "پایەپیرۆز ئۆلگای کیێڤ",
    "Равноапостольная великая княгиня Ольга",
    "წმინდა ოლღა",
    []
  ],
  [
    "cyril-slavs",
    "Saint Cyril, Teacher of the Slavs",
    "پایەپیرۆز کیریلۆسی مامۆستای سلاڤەکان",
    "Равноапостольный Кирилл, учитель Словенский",
    "წმინდა კირილე, სლავთა განმანათლებელი",
    []
  ],
  [
    "methodius-slavs",
    "Saint Methodius, Teacher of the Slavs",
    "پایەپیرۆز مێتۆدیۆسی مامۆستای سلاڤەکان",
    "Равноапостольный Мефодий, учитель Словенский",
    "წმინდა მეთოდე, სლავთა განმანათლებელი",
    []
  ],
  [
    "mark-ephesus",
    "Saint Mark of Ephesus",
    "پایەپیرۆز مەرقۆسی ئەفەسۆس",
    "Святитель Марк Эфесский",
    "წმინდა მარკოზ ეფესელი",
    []
  ],
  [
    "porphyrios-kavsokalyvia",
    "Saint Porphyrios of Kavsokalyvia",
    "پایەپیرۆز پۆرفیریۆسی کاڤسۆکالیڤیا",
    "Преподобный Порфирий Кавсокаливит",
    "წმინდა პორფირი კავსოკალიველი",
    []
  ],
  [
    "porphyrius-gaza",
    "Saint Porphyrius of Gaza",
    "پایەپیرۆز پۆرفیریۆسی غەززە",
    "Святитель Порфирий Газский",
    "წმინდა პორფირი ღაზელი",
    []
  ],
  [
    "elizabeth-new-martyr",
    "Saint Elizabeth the New Martyr",
    "پایەپیرۆز ئیلیزابێتی شەهیدی نوێ",
    "Преподобномученица великая княгиня Елисавета",
    "წმინდა ელისაბედ ახალმოწამე",
    []
  ],
  [
    "barbara-novice",
    "Saint Barbara the New Martyr",
    "پایەپیرۆز باربارای شەهیدی نوێ",
    "Преподобномученица Варвара",
    "წმინდა ბარბარე ახალმოწამე",
    []
  ],
  [
    "euthymius-great",
    "Saint Euthymius the Great",
    "پایەپیرۆز ئەوتیمیۆسی مەزن",
    "Преподобный Евфимий Великий",
    "ღირსი ექვთიმე დიდი",
    []
  ],
  [
    "xenia-petersburg",
    "Saint Xenia of Saint Petersburg",
    "پایەپیرۆز کسێنیای سانت پیتەرزبورگ",
    "Блаженная Ксения Петербургская",
    "ნეტარი ქსენია პეტერბურგელი",
    []
  ],
  [
    "xenia-rome",
    "Saint Xenia of Rome",
    "پایەپیرۆز کسێنیای ڕۆما",
    "Преподобная Ксения Римская",
    "ღირსი ქსენია რომაელი",
    []
  ],
  [
    "marina-antioch",
    "Saint Marina of Antioch",
    "پایەپیرۆز مارینای ئەنتاکیا",
    "Великомученица Марина",
    "წმინდა დიდმოწამე მარინე",
    []
  ],
  [
    "theodore-stratelates",
    "Saint Theodore Stratelates",
    "پایەپیرۆز تیۆدۆرۆسی سەرکردەی سەربازی",
    "Великомученик Феодор Стратилат",
    "წმინდა თეოდორე სტრატილატი",
    []
  ],
  [
    "thekla",
    "Saint Thekla, Equal to the Apostles",
    "پایەپیرۆز تێکلای هاوشانی نێردراوان",
    "Равноапостольная первомученица Фекла",
    "წმინდა მოციქულთასწორი თეკლა",
    []
  ],
  [
    "simeon-stylite",
    "Saint Simeon the Stylite",
    "پایەپیرۆز شیمۆنی ستوون‌نشین",
    "Преподобный Симеон Столпник",
    "ღირსი სვიმეონ მესვეტე",
    []
  ],
  [
    "anastasia-martyr",
    "Saint Anastasia the Great Martyr",
    "پایەپیرۆز ئاناستاسیای شەهیدی مەزن",
    "Великомученица Анастасия Узорешительница",
    "წმინდა დიდმოწამე ანასტასია",
    []
  ],
  [
    "barbara-great-martyr",
    "Saint Barbara the Great Martyr",
    "پایەپیرۆز باربارای شەهیدی مەزن",
    "Великомученица Варвара",
    "წმინდა დიდმოწამე ბარბარე",
    []
  ],
  [
    "john-baptist",
    "Saint John the Baptist",
    "پایەپیرۆز یۆحەنای گیانشۆرکەر",
    "Пророк, Предтеча и Креститель Господень Иоанн",
    "წმინდა იოანე ნათლისმცემელი",
    []
  ],
  [
    "methodius-confessor",
    "Saint Methodius the Confessor",
    "پایەپیرۆز مێتۆدیۆسی دانپێدەر",
    "Святитель Мефодий Исповедник",
    "წმინდა მეთოდე აღმსარებელი",
    []
  ],
  [
    "irene-great-martyr",
    "Saint Irene the Great Martyr",
    "پایەپیرۆز ئیرێنەی شەهیدی مەزن",
    "Великомученица Ирина",
    "წმინდა დიდმოწამე ირინე",
    []
  ],
  [
    "photios-great",
    "Saint Photios the Great",
    "پایەپیرۆز فۆتیۆسی مەزن",
    "Святитель Фотий, патриарх Константинопольский",
    "წმინდა ფოტიოს დიდი",
    []
  ],
  [
    "catherine-alexandria",
    "Saint Catherine of Alexandria",
    "پایەپیرۆز کاتەرینای ئەسکەندەری",
    "Великомученица Екатерина",
    "წმინდა დიდმოწამე ეკატერინე",
    []
  ],
  [
    "panteleimon",
    "Saint Panteleimon the Healer",
    "پایەپیرۆز پانتەلەیمۆنی چاککەرەوە",
    "Великомученик и целитель Пантелеимон",
    "წმინდა დიდმოწამე პანტელეიმონი",
    []
  ],
  [
    "paraskevi-rome",
    "Saint Paraskevi of Rome",
    "پایەپیرۆز پاراسکێڤی ڕۆما",
    "Преподобномученица Параскева Римская",
    "წმინდა პარასკევა რომაელი",
    []
  ],
  [
    "demetrios-thessaloniki",
    "Saint Demetrios of Thessaloniki",
    "پایەپیرۆز دیمیتریۆسی تەسالۆنیکی",
    "Великомученик Димитрий Солунский",
    "წმინდა დიდმოწამე დიმიტრი თესალონიკელი",
    []
  ],
  [
    "sabbas-sanctified",
    "Saint Sabbas the Sanctified",
    "پایەپیرۆز ساباسی پیرۆزکراو",
    "Преподобный Савва Освященный",
    "ღირსი საბა განწმენდილი",
    []
  ],
  [
    "sava-serbia",
    "Saint Sava of Serbia",
    "پایەپیرۆز ساڤای سربیا",
    "Святитель Савва Сербский",
    "წმინდა საბა სერბი",
    []
  ],
  [
    "hermolaus",
    "Saint Hermolaus of Nicomedia",
    "پایەپیرۆز هێرمۆلاۆسی نیکۆمیدیا",
    "Священномученик Ермолай Никомидийский",
    "წმინდა ერმოლაოსი ნიკომიდიელი",
    []
  ],
  [
    "iakovos-tsalikis",
    "Saint Iakovos Tsalikis of Evia",
    "پایەپیرۆز یاکۆڤۆسی تسالیکیس",
    "Преподобный Иаков Эвбейский",
    "ღირსი იაკობ ევბეელი",
    []
  ],
  [
    "silouan-athonite",
    "Saint Silouan the Athonite",
    "پایەپیرۆز سیلوانی ئاتۆس",
    "Преподобный Силуан Афонский",
    "ღირსი სილუან ათონელი",
    []
  ],
  [
    "lucia-syracuse",
    "Saint Lucy of Syracuse",
    "پایەپیرۆز لۆسیای سیراکوسا",
    "Мученица Лукия Сиракузская",
    "წმინდა ლუკია სირაკუზელი",
    []
  ],
  [
    "joseph-hesychast",
    "Saint Joseph the Hesychast",
    "پایەپیرۆز یۆسفی هێسیکاست",
    "Преподобный Иосиф Исихаст",
    "ღირსი იოსებ ისიქასტი",
    []
  ],
  [
    "macrina-younger",
    "Saint Macrina the Younger",
    "پایەپیرۆز مەکرینای بچووک",
    "Преподобная Макрина Младшая",
    "ღირსი მაკრინე უმცროსი",
    []
  ],
  [
    "tikhon-zadonsk",
    "Saint Tikhon of Zadonsk",
    "پایەپیرۆز تیخۆنی زادۆنسک",
    "Святитель Тихон Задонский",
    "წმინდა ტიხონ ზადონელი",
    []
  ],
  [
    "matrona-moscow",
    "Saint Matrona of Moscow",
    "پایەپیرۆز ماترۆنای مۆسکۆ",
    "Блаженная Матрона Московская",
    "ნეტარი მატრონა მოსკოველი",
    []
  ],
  [
    "herman-alaska",
    "Saint Herman of Alaska",
    "پایەپیرۆز هێرمانی ئەلاسکا",
    "Преподобный Герман Аляскинский",
    "ღირსი გერმანე ალასკელი",
    []
  ],
  [
    "innocent-alaska",
    "Saint Innocent of Alaska",
    "پایەپیرۆز ئینۆکێنتی ئەلاسکا",
    "Святитель Иннокентий Московский",
    "წმინდა ინოკენტი ალასკელი",
    []
  ],
  [
    "luke-crimea",
    "Saint Luke of Crimea",
    "پایەپیرۆز لۆقای کریمیا",
    "Святитель Лука Крымский",
    "წმინდა ლუკა ყირიმელი",
    []
  ],
  [
    "theophan-recluse",
    "Saint Theophan the Recluse",
    "پایەپیرۆز تێئۆفانی گۆشەگیر",
    "Святитель Феофан Затворник",
    "წმინდა თეოფანე დაყუდებული",
    []
  ],
  [
    "john-kronstadt",
    "Saint John of Kronstadt",
    "پایەپیرۆز یۆحەنای کرۆنشتات",
    "Праведный Иоанн Кронштадтский",
    "წმინდა იოანე კრონშტადტელი",
    []
  ],
  [
    "agatha-sicily",
    "Saint Agatha of Sicily",
    "پایەپیرۆز ئاگاتای سیسیلیا",
    "Мученица Агафия Сицилийская",
    "წმინდა აგათია სიცილიელი",
    []
  ],
  [
    "theodosius-cenobiarch",
    "Saint Theodosius the Cenobiarch",
    "پایەپیرۆز تێئۆدۆسیۆسی مەزن",
    "Преподобный Феодосий Великий",
    "ღირსი თეოდოსი დიდი",
    []
  ],
  [
    "menas-egypt",
    "Saint Menas of Egypt",
    "پایەپیرۆز میناسی میسری",
    "Великомученик Мина Египетский",
    "წმინდა მინა ეგვიპტელი",
    []
  ],
  [
    "photina-samaritan",
    "Saint Photina the Samaritan Woman",
    "پایەپیرۆز فۆتینای سامیری",
    "Мученица Фотина Самаряныня",
    "წმინდა ფოტინე სამარიელი",
    []
  ],
  [
    "tarasius-constantinople",
    "Saint Tarasius of Constantinople",
    "پایەپیرۆز تاراسیۆسی قسطنطینیە",
    "Святитель Тарасий Константинопольский",
    "წმინდა ტარასი კონსტანტინოპოლელი",
    []
  ],
  [
    "euphemia-chalcedon",
    "Saint Euphemia of Chalcedon",
    "پایەپیرۆز ئەوفیمیای خەلقیدۆن",
    "Великомученица Евфимия Всехвальная",
    "წმინდა ეფემია ქალკედონელი",
    []
  ],
  [
    "gregory-dialogus",
    "Saint Gregory Dialogus of Rome",
    "پایەپیرۆز گریگۆری دیالۆگۆسی ڕۆما",
    "Святитель Григорий Двоеслов",
    "წმინდა გრიგოლ დიოლოღოსი",
    []
  ],
  [
    "vladimir-kiev",
    "Saint Vladimir of Kiev",
    "پایەپیرۆز ڤلادیمیری کیێڤ",
    "Равноапостольный великий князь Владимир",
    "წმინდა მოციქულთასწორი ვლადიმერი",
    []
  ]
];
const script={en:/\p{Script=Latin}/u,ckb:/\p{Script=Arabic}/u,ka:/\p{Script=Georgian}/u,ru:/\p{Script=Cyrillic}/u,kmr:/\p{Script=Latin}/u};
export function validLanguageText(value,language){
 if(typeof value!=="string"||!value.trim())return false;
 const letters=[...value].filter(c=>/\p{L}/u.test(c));
 return !letters.length||!script[language]||letters.filter(c=>script[language].test(c)).length>=letters.length*.75;
}
const normal=s=>String(s||"").normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,"");
const key=s=>normal(s).replace(/^saint|^st(?=[a-z])/,"");
const map=new Map();for(const [slug,en,ckb,ru,ka,aliases] of records){const row={en,ckb,ru,ka};for(const value of [slug,en,ckb,ru,ka,...aliases])if(value)map.set(key(value),row);}
export function knownSaint(author){
 if(!author)return null;
 for(const value of [author.slug,author.id,author.name_en,author.en,author.name_ckb,author.ckb,author.name_ka,author.name_ru,...(author.aliases||[])]){const found=map.get(key(value));if(found)return found;}
 const combined=[author.slug,author.name_en,author.name_ckb].join(" ");
 if(/damasc|damask|دیمەشق|دیمشق/i.test(combined))return map.get(key("john-of-damascus"));
 return null;
}
const missing={en:"Saint (name pending)",ckb:"پایەپیرۆز (ناو هێشتا زیاد نەکراوە)",ru:"Святой (имя уточняется)",ka:"წმინდანი (სახელი დასაზუსტებელია)",kmr:"Pîroz (nav hîn nehat nivîsandin)"};
export function localizedSaintName(author,language="en"){
 if(!author)return "";
 const provided=author["name_"+language]||author[language];
 if(validLanguageText(provided,language))return provided;
 const known=knownSaint(author)?.[language];
 if(validLanguageText(known,language))return known;
 return missing[language]||missing.en;
}
export function saintThumbnail(author){
 const known=knownSaint(author);
 const original=author?.icon_url||"";
 // Keep the original historical icon in profiles; display a compact portrait crop only in cards.
 return {src:original,portrait:known?.en==="Saint John Chrysostom"||known?.en==="Saint Basil the Great"||/NG\.M\.0152[23]|\/icons\/(chrysostom|basil)\.webp/i.test(original)};
}
