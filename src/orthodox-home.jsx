import { saintThumbnail } from "./localized-saint-names.js";
import { russianHeritage, russianIdentity } from "./russian-copy.js";
import { JourneyDaily } from "./journey.jsx";
import { georgianHeritageWords } from "./georgian-copy.js";
import React from "react";
import { useEditorial, useEditorialWords } from "./editorial-context.jsx";
import { authorName, profileHref, textFor } from "./editorial.js";
import {
  ArrowUpRight,
  BookOpen,
  Church,
  Heart,
  Library,
  ScrollText,
} from "lucide-react";
import { DailyVerse } from "./scripture.jsx";
import { TodayReading, TodayPrayers, TodaySaint } from "./home-today.jsx";
import { saints, localized } from "./saints-data.js";
export const councilSource =
  "https://www.oca.org/orthodoxy/the-orthodox-faith/doctrine-scripture/sources-of-christian-doctrine/the-councils";
export const councils = [
  {
    year: "325",
    name: ["Nicaea I", "نیقیەی یەکەم"],
    teaching: [
      "The Son is truly God, of one essence with the Father.",
      "کوڕ بەڕاستی خودایە و هاوجەوهەری باوکە.",
    ],
  },
  {
    year: "381",
    name: ["Constantinople I", "قسطنطینیەی یەکەم"],
    teaching: [
      "Confessed the Holy Spirit's divinity; completed the Creed.",
      "خوایەتیی ڕۆحی پیرۆزی ڕاگەیاند؛ باوەڕنامەکەی تەواو کرد.",
    ],
  },
  {
    year: "431",
    name: ["Ephesus", "ئەفەسۆس"],
    teaching: [
      "Christ is one Person; Mary is Theotokos, Mother of God.",
      "مەسیح یەک کەسە؛ مەریەم تێئۆتۆکۆسە، دایکی خودا.",
    ],
  },
  {
    year: "451",
    name: ["Chalcedon", "خەلقیدۆن"],
    teaching: [
      "One and the same Christ in two natures, divine and human, without confusion or division.",
      "هەمان یەک مەسیح لە دوو سروشتدا، خودایی و مرۆڤانە، بەبێ تێکەڵبوون یان دابەشبوون.",
    ],
    source:
      "https://www.oca.org/orthodoxy/the-orthodox-faith/church-history/fifth-century/the-fourth-ecumenical-council",
  },
  {
    year: "553",
    name: ["Constantinople II", "قسطنطینیەی دووەم"],
    teaching: [
      "Reaffirmed the one divine Person of the incarnate Son.",
      "یەک کەسی خودایی کوڕی مرۆڤبووی پشتڕاست کردەوە.",
    ],
  },
  {
    year: "680–681",
    name: ["Constantinople III", "قسطنطینیەی سێیەم"],
    teaching: [
      "Christ has divine and human wills and energies.",
      "مەسیح ویست و کردەی خودایی و مرۆڤانەی هەیە.",
    ],
  },
  {
    year: "787",
    name: ["Nicaea II", "نیقیەی دووەم"],
    teaching: [
      "Honour given to an icon passes to its prototype; worship belongs to God alone.",
      "ڕێزی دراو بە ئایکۆن دەگاتە کەسی وێنەکە؛ پەرستش تەنها بۆ خودایە.",
    ],
    source:
      "https://www.oca.org/reflections/misc-authors/fathers-seventh-ecumenical-council-relationship-image-person-redemptive-work-sacred-space",
  },
];
const lessons = [
  {
    title: ["The Holy Trinity", "سێیەکێتیی پیرۆز"],
    text: [
      "One God in three divine Persons: Father, Son, and Holy Spirit. The Persons share one divine nature; they are not three gods.",
      "یەک خودا لە سێ کەسی خوداییدا: باوک، کوڕ و ڕۆحی پیرۆز. هەر سێ کەسەکە یەک سروشتی خوداییان هەیە؛ سێ خودا نین.",
    ],
    scripture: "Matthew 28:19",
    url: "https://www.oca.org/orthodoxy/the-orthodox-faith/doctrine-scripture/the-holy-trinity/the-doctrine-of-the-holy-trinity",
  },
  {
    title: ["The Incarnation", "مرۆڤبوونی وشە"],
    text: [
      "The eternal Son truly became human for our salvation, remaining truly God. Jesus Christ is one Person in two natures.",
      "کوڕی هەتاهەتایی بۆ ڕزگاریی ئێمە بەڕاستی بوو بە مرۆڤ، لە کاتێکدا بەڕاستی خودا مایەوە. یەشوای مەسیح یەک کەسە لە دوو سروشتدا.",
    ],
    scripture: "John 1:14",
    url: "https://www.newadvent.org/fathers/2802.htm",
  },
  {
    title: ["The Holy Eucharist", "قوربانیی پیرۆز"],
    text: [
      "In the Divine Liturgy the faithful receive Christ's true Body and Blood. The Eucharist stands at the centre of the Church's life.",
      "لە لیتورژیای خوداییدا باوەڕداران جەستە و خوێنی ڕاستەقینەی مەسیح وەردەگرن. قوربانیی پیرۆز لە ناوەندی ژیانی کڵێسادایە.",
    ],
    scripture: "1 Corinthians 10:16–17",
    url: "https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-sacraments/holy-eucharist",
  },
  {
    title: ["Prayer and life in Christ", "نوێژ و ژیان لە مەسیحدا"],
    text: [
      "Christian prayer draws us to the Father, through the Son, in the Holy Spirit. Repentance, mercy, and love of our neighbour belong with prayer.",
      "نوێژی مەسیحی لە ڕێگەی کوڕەوە و بە ڕۆحی پیرۆز ئێمە بەرەو باوک دەبات. تۆبە و بەزەیی و خۆشەویستیی نزیکەکان لەگەڵ نوێژدان.",
    ],
    scripture: "Romans 8:15–16; Matthew 6:5–15",
    url: "https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-daily-cycles-of-prayer/prayer",
  },
];
export const heritageWords = (language) =>
  language === "ru" ? russianHeritage : language === "ka" ? georgianHeritageWords : language === "ckb"
    ? {
        welcome: "میراتێکی زیندوو · باوەڕێکی هەتاهەتایی",
        title: "ڕووناکیی ئۆرتۆدۆکسی، بە زمانی کوردی",
        intro:
          "شوێنێکی ئارام بۆ خوێندنەوەی کتێبی پیرۆز، ناسینی پایەپیرۆزان و فێربوونی باوەڕی کڵێسای ئۆرتۆدۆکسی ڕۆژهەڵات.",
        begin: "کتێبی پیرۆز بخوێنەوە",
        discover: "پایەپیرۆزان بناسە",
        journey: "ڕێگای خوێندنەوە و فێربوون",
        sub: "لە وشەی خوداوە بۆ ژیانی نوێژ و فێرکاریی کڵێسا.",
        saints: "ژیانی پایەپیرۆزان",
        saintSub: "گەواهیدەرانی باوەڕ، خۆشەویستی و خزمەت.",
        all: "هەموو پایەپیرۆزان",
        teaching: "فێرکاریی ئۆرتۆدۆکسی ڕۆژهەڵات",
        teachingSub: "ناسینێکی سەرەتایی بۆ باوەڕی نێردراوان و کڵێسا.",
        councils: "حەوت ئەنجومەنە جیهانییەکان",
        councilSub: "پاراستنی باوەڕی کڵێسا لە سەدەکانی یەکەمدا.",
        about: "دەربارەی ئۆرتۆدۆکسی ڕۆم لە کوردستان",
        aboutText:
          "ئەم ماڵپەڕە سەرچاوەیەکی فێرکارییە بۆ ناساندنی باوەڕی ئۆرتۆدۆکسی ڕۆژهەڵات بە خوێنەرانی کورد. کتێبی پیرۆز، ژیانی پایەپیرۆزان، نوێژ و فێرکاری لە یەک شوێندا کۆدەکاتەوە.",
        aboutPolicy:
          "ناوەڕۆکەکان پشت بە کتێبی پیرۆز، باوکانی کڵێسا و سەرچاوە ئۆرتۆدۆکسی ڕۆژهەڵات ناسراوەکان دەبەستن. دەقە وەرگێڕدراوەکان دەستنیشان دەکرێن؛ بۆ ڕێنماییی شوانایەتی پەیوەندی بە قەشەیەکی ئۆرتۆدۆکسی ڕۆژهەڵاتەوە بکە.",
        more: "زیاتر بخوێنەوە",
        sources: "سەرچاوە",
        prayerTitle: "نوێژ و یادکردنەوەی ئۆرتۆدۆکسی ڕۆژهەڵات",
        prayerText:
          "نوێژەکان بخوێنەوە و کاتێک بۆ ئارامی و یادکردنەوەی خودا تەرخان بکە.",
        prayerAction: "نوێژەکان بخوێنەوە",
        seven: "٧ ئەنجومەن · یەک باوەڕ",
        learned: "خوێندراوە",
        mark: "خوێندراو نیشان بدە",
        languageNote: "",
        sourceNote:
          "ئەم پوختانە دەقی فەرمیی بڕیارەکانی ئەنجومەنەکان نین؛ بۆ خوێندنەوەی زیاتر سەرچاوەکان بکەرەوە.",
      }
    : {
        welcome: "A LIVING TRADITION · AN ENDURING FAITH",
        title: "The light of Eastern Orthodoxy, in Kurdish",
        intro:
          "A quiet place to read Holy Scripture, discover the saints, and explore the faith of the Eastern Orthodox Church.",
        begin: "Read the Holy Bible",
        discover: "Discover the saints",
        journey: "A path of reading and discovery",
        sub: "From the Word of God to the prayer and teaching of the Church.",
        saints: "Lives of the Saints",
        saintSub: "Witnesses to faith, love, and service across the centuries.",
        all: "Explore all ten saints",
        teaching: "Eastern Orthodox Teachings",
        teachingSub:
          "A short introduction to the apostolic faith of the Church.",
        councils: "The Seven Ecumenical Councils",
        councilSub:
          "Safeguarding the Church's confession through the early centuries.",
        about: "About Rum Orthodoxy In Kurdistan",
        aboutText:
          "This educational website introduces the Eastern Orthodox faith to Kurdish readers. It brings Scripture, the lives of the saints, prayers, and Christian teaching together in one place.",
        aboutPolicy:
          "Our reference points are Holy Scripture, the Church Fathers, and reliable Eastern Orthodox publications. Editorial translations are identified. For personal pastoral guidance, speak with an Eastern Orthodox priest.",
        more: "Read more",
        sources: "Source",
        prayerTitle: "Eastern Orthodox Prayers and Remembrance",
        prayerText:
          "Read the prayers and make room for stillness and remembrance of God.",
        prayerAction: "Read the prayers",
        seven: "7 COUNCILS · ONE FAITH",
        learned: "Read",
        mark: "Mark as read",
        languageNote:
          language === "kmr"
            ? "Ev beşa nû niha bi Soranî û Îngilîzî heye. Naveroka Îngilîzî li jêr tê nîşandan."
            : "",
        sourceNote:
          "These are editorial summaries, not the formal conciliar definitions. Follow the references for further study.",
      };
function SectionHeading({ label, title, description, action, href }) {
  return (
    <div className="heritage-section-heading">
      <div>
        {label && <span className="eyebrow">{label}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {action}
          <ArrowUpRight size={16} />
        </a>
      )}
    </div>
  );
}
export function OrthodoxHome({ t, language, journey, onEditJourney }) {
  const cms = useEditorial(),
    ew = useEditorialWords(language);
  const w = cms.words(heritageWords(language), "home", language);
  const labels = {
    ru: { scripture: 'ПИСАНИЕ И ПРЕДАНИЕ', saints: 'СОБОР СВЯТЫХ', prayer: 'ВРЕМЯ МОЛИТВЫ', teaching: 'ВЕРА ЦЕРКВИ' },
    en: { scripture: "SCRIPTURE & TRADITION", saints: "THE COMMUNION OF SAINTS", prayer: "A MOMENT OF STILLNESS", teaching: "THE FAITH OF THE CHURCH" },
    ckb: { scripture: "کتێبی پیرۆز و نەریتی کڵێسا", saints: "کۆمەڵی پایەپیرۆزان", prayer: "کاتێک بۆ نوێژ", teaching: "باوەڕی کڵێسا" },
    kmr: { scripture: "PIRTÛKA PÎROZ Û KEVNEŞOPÎ", saints: "CIVATA PÎROZAN", prayer: "DEMEK JI BO DUA", teaching: "BAWERIYA DÊRÊ" },
    ka: { scripture: "წმინდა წერილი და გადმოცემა", saints: "წმინდანთა დასი", prayer: "ლოცვის დრო", teaching: "ეკლესიის სარწმუნოება" },
  }[language] || {};
  const homeLabel = (key, field) => {
    const english = {
      scripture: "SCRIPTURE & TRADITION",
      saints: "THE COMMUNION OF SAINTS",
      prayer: "A MOMENT OF STILLNESS",
      teaching: "THE FAITH OF THE CHURCH",
    }[field];
    const value = cms.text(key, language, labels[field] || english);
    return language !== "en" && value === english ? labels[field] : value;
  };
  const homeIdentity = {
    ru: russianIdentity,
    ckb: { name: "ئۆرتۆدۆکسی ڕۆم لە کوردستان", line: "باوەڕی کڵێسا بە زمانی کوردی", intro: "ئەم پەیجە بۆ هەموو ئەو کەسانەیە کە دەیانەوێت مەسیح و باوەڕی کڵێسای ئۆرتۆدۆکسی بناسن. لێرە دەتوانیت کتێبی پیرۆز بخوێنیتەوە و لە ژیان و فێرکارییەکانی باوکانی کڵێسا و پایەپیرۆزان فێر ببیت", explore: "گەشتێک بە ناو سایتەکەدا", about: "دەربارەی ئێمە" },
    en: { name: "Orthodoxy in Kurdistan", line: "The faith of the Church in the Kurdish language", intro: "A place for everyone seeking to know Christ and the Orthodox Christian faith. Read Holy Scripture, discover the lives of the saints, and explore the teachings of the Church Fathers.", explore: "Explore the library", about: "About us" },
    ka: { name: "მართლმადიდებლობა ქურთისტანში", line: "ეკლესიის სარწმუნოება ქურთულ ენაზე", intro: "სივრცე ყველასთვის, ვისაც სურს ქრისტესა და მართლმადიდებლური სარწმუნოების გაცნობა. წაიკითხეთ წმინდა წერილი, გაეცანით წმინდანთა ცხოვრებასა და ეკლესიის მამათა სწავლებას.", explore: "ბიბლიოთეკის გაცნობა", about: "ჩვენ შესახებ" },
    kmr: { name: "Ortodoksî li Kurdistanê", line: "Baweriya Dêrê bi zimanê Kurdî", intro: "Cihê her kesê ku dixwaze Mesîh û baweriya Ortodoks nas bike. Pirtûka Pîroz bixwîne û jiyana pîrozan û hînkirinên Bavên Dêrê nas bike.", explore: "Pirtûkxaneyê bibîne", about: "Derbarê me" }
  }[language] || {};
  const identity = (key) => cms.text("home.identity." + key, language, homeIdentity[key]);
  const crossImage = (cms.text("general.brandImage", language, "/kurdistan-cross-transparent.svg") || "").replace("/kurdistan-cross.jpg", "/kurdistan-cross-transparent.svg") || "/kurdistan-cross-transparent.svg";
  const preview = cms.ready
    ? cms.doctrines.filter((d) => d.category === "doctrine").slice(0, 2)
    : lessons.slice(0, 2);
  const yearList = cms.ready
    ? cms.doctrines
        .filter((d) => d.category === "council")
        .map((d) => d.council_year)
    : councils.map((c) => c.year);
  return (
    <div className="heritage-home today-home">
      {cms.visible("hero") && (
        <section className="heritage-hero home-centered-cover">
          <div className="heritage-hero-copy">
            {cms.visible("heroArt") && <div className="home-cross-stage"><img className="home-cross-emblem" src={crossImage} alt="" width="300" height="300" fetchPriority="high" /></div>}
            <div className="home-chapter-label"><span>{identity("line")}</span></div>
            <h1>{identity("name")}</h1>
            {language !== "en" && <div className="home-english-brand" lang="en" dir="ltr">Orthodoxy in Kurdistan</div>}
            <div className="home-cover-rule" aria-hidden="true"><span>✣</span></div>
            <p className="editorial-verbatim">{identity("intro")}</p>
            <div className="hero-actions">
              <a className="button gold" href="/bible/"><BookOpen size={18} />{w.begin}</a>
              <a className="button secondary" href="/discover/">{identity("explore")}<ArrowUpRight size={16} /></a>
            </div>
            <div className="home-hero-rail"><a href="/saints/">{w.saints}</a><a href="/fathers/">{t.fathers}</a><a href="/prayers/">{w.prayerTitle}</a></div>
          </div>
        </section>
      )}
      <JourneyDaily language={language} journey={journey} onEdit={onEditJourney}/>
      {cms.visible("paths") && <TodayReading language={language} />}
      {cms.visible("daily") && <DailyVerse t={t} language={language} compact />}
      {cms.visible("prayers") && <TodayPrayers language={language} />}
      {cms.visible("saints") && <TodaySaint language={language} />}
      {cms.visible("paths") && (
        <section className="heritage-section home-path-section">
          <SectionHeading
            label={homeLabel("general.scriptureLabel", "scripture")}
            title={w.journey}
            description={w.sub}
          />
          <div className="heritage-paths">
            {[
              ["bible", BookOpen, t.bible, t.bibleDesc],
              ["fathers", Library, t.fathers, t.fathersDesc],
              [
                "doctrine",
                ScrollText,
                cms.ready ? ew.doctrineTitle : w.teaching,
                w.teachingSub,
              ],
            ].map(([id, Icon, title, body], index) => (
              <a className={`heritage-path${index === 0 ? " heritage-path-primary" : ""}`} href={`/${id}/`} key={id}>
                <span className="home-path-icon"><Icon size={index === 0 ? 32 : 26} /></span>
                <span className="home-path-copy"><h3>{title}</h3><p className="editorial-verbatim">{body}</p></span>
                <span className="home-path-action" aria-hidden="true"><ArrowUpRight size={20} /></span>
              </a>
            ))}
          </div>
        </section>
      )}
      {cms.visible("saints") && (
        <section className="heritage-section">
          <SectionHeading
            label={homeLabel("general.saintsLabel", "saints")}
            title={w.saints}
            description={w.saintSub}
            action={cms.ready ? ew.exploreAuthors : w.all}
            href="/saints/"
          />
          <div className="home-saints-grid">
            {cms.ready
              ? cms.authors
                  .filter(a=>a.icon_url)
                  .slice(0, 4)
                  .map((a, index) => (
                    <a className={`home-saint${index === 0 ? " home-saint-featured" : ""}`} key={a.id} href={profileHref(a)}>
                      <div className={"home-saint-image"+(saintThumbnail(a).portrait?" portrait-crop":"")}>{a.icon_url ? <img src={a.icon_url} alt="" width="320" height="400" loading="lazy" decoding="async" /> : <Church size={32} />}</div>
                      <div className="home-saint-copy"><h3>{authorName(a,language)}</h3><p>{textFor(a,"title",language) || textFor(a,"feast",language)}</p><span aria-hidden="true"><ArrowUpRight size={18} /></span></div>
                    </a>
                  ))
              : saints
                  .slice(0, 4)
                  .map((saint, index) => (
                    <a className={`home-saint${index === 0 ? " home-saint-featured" : ""}`} key={saint.id} href={`#saint?id=${saint.id}`}>
                      <div className={"home-saint-image"+(saintThumbnail(saint).portrait?" portrait-crop":"")}><img src={`/icons/${saint.id}.webp`} alt="" width="320" height="400" loading="lazy" decoding="async" /></div>
                      <div className="home-saint-copy"><h3>{authorName(saint,language)}</h3>{["ckb","en"].includes(language)&&<p>{language === "ckb" ? saint.feast?.[1] : saint.feast?.[0]}</p>}<span aria-hidden="true"><ArrowUpRight size={18} /></span></div>
                    </a>
                  ))}
          </div>
        </section>
      )}
      {cms.visible("prayers") && (
        <section className="heritage-prayer-band">
          <Heart size={32} />
          <div>
            <span className="eyebrow">
              {homeLabel("general.prayerLabel", "prayer")}
            </span>
            <h2>{w.prayerTitle}</h2>
            <p className="editorial-verbatim">{w.prayerText}</p>
          </div>
          <a className="button secondary" href="/prayers/">
            {w.prayerAction}
            <ArrowUpRight size={16} />
          </a>
        </section>
      )}
      {cms.visible("doctrine") && (
        <section className="heritage-section">
          <SectionHeading
            label={homeLabel("general.teachingLabel", "teaching")}
            title={cms.ready ? ew.doctrineTitle : w.teaching}
            description={w.teachingSub}
            action={w.more}
            href="/doctrine/"
          />
          <div className="teaching-preview">
            {preview.map((item, i) => (
              <a
                key={cms.ready ? item.id : item.url}
                href={
                  cms.ready
                    ? `#article?id=${item.slug}`
                    : `#teachings?lesson=${i}`
                }
              >
                <span className="eyebrow">
                  {cms.ready ? item.council_year : item.scripture}
                </span>
                <h3>
                  {cms.ready
                    ? textFor(item, "title", language) || ew.missingTranslation
                    : localized(item.title, language)}
                </h3>
                <p className="editorial-verbatim">
                  {cms.ready
                    ? textFor(item, "subtitle", language)
                    : localized(item.text, language)}
                </p>
                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        </section>
      )}
      {cms.visible("councils") && (
        <section className="councils-feature">
          <div>
            <span className="eyebrow">{w.seven}</span>
            <h2>{w.councils}</h2>
            <p className="editorial-verbatim">{w.councilSub}</p>
            <a className="text-link" href="/councils/">
              {w.more}
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="council-years" aria-hidden="true">
            {yearList.map((year, i) => (
              <span key={i}>{year}</span>
            ))}
          </div>
        </section>
      )}
      {cms.visible("about") && (
        <section className="heritage-section about-feature">
          <Church size={34} />
          <details className="home-faith-statement">
            <summary><h2>{w.about}</h2><span>{w.more}</span></summary>
            <p className="editorial-verbatim">{w.aboutText}</p>
            <a className="text-link" href="/about/">{w.more}</a>
          </details>
        </section>
      )}
    </div>
  );
}
export function OrthodoxStudy({ language, page, route }) {
  const cms = useEditorial();
  const w = cms.words(heritageWords(language), "home", language);
  const [read, setRead] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orthodox-study-progress")) || {};
    } catch {
      return {};
    }
  });
  const lessonId = Number(
    new URLSearchParams(route.split("?")[1]).get("lesson"),
  );
  const selected =
    route.includes("lesson=") &&
    Number.isInteger(lessonId) &&
    lessonId >= 0 &&
    lessonId < lessons.length
      ? lessonId
      : null;
  function mark(id) {
    const next = { ...read, [id]: !read[id] };
    setRead(next);
    try {
      localStorage.setItem("orthodox-study-progress", JSON.stringify(next));
    } catch {}
  }
  return (
    <div className="page heritage-page study-page">
      <a className="text-link" href="#home">
        ← {language === "ru" ? "Главная" : language === "ka" ? "მთავარი" : language === "ckb" ? "سەرەکی" : "Home"}
      </a>
      <header className="heritage-heading">
        <span className="eyebrow">{language === "ru" ? "ПРАВОСЛАВНАЯ ВЕРА И ЖИЗНЬ" : language === "ka" ? "მართლმადიდებლური სარწმუნოება და ცხოვრება" : "EASTERN ORTHODOX FAITH & LIFE"}</span>
        <h1>
          {
            w[
              page === "councils"
                ? "councils"
                : page === "teachings"
                  ? "teaching"
                  : "about"
            ]
          }
        </h1>
        <p>
          {
            w[
              page === "councils"
                ? "councilSub"
                : page === "teachings"
                  ? "teachingSub"
                  : "aboutText"
            ]
          }
        </p>
      </header>
      {w.languageNote && <p className="editorial-note">{w.languageNote}</p>}
      {page === "about" ? (
        <div className="profile-body">
          <h2>
            {language === "ckb"
              ? "سەرچاوە و بەرپرسیارێتی"
              : language === "ka" ? "წყაროები და სარედაქციო პასუხისმგებლობა" : "Sources and editorial care"}
          </h2>
          <p>{w.aboutPolicy}</p>
          <div className="about-actions">
            <a className="button gold" href="#sources">
              {w.sources}
            </a>
            <a className="button secondary" href="#appearance">
              {language === "ka" ? "შრიფტები და გარეგნობა" : language === "ckb" ? "فۆنت و ڕەنگ" : "Fonts and appearance"}
            </a>
          </div>
          <a href="/saints/" className="text-link">
            {w.all} ↗
          </a>
        </div>
      ) : page === "councils" ? (
        <>
          <p className="editorial-note">{w.sourceNote}</p>
          <div className="council-timeline">
            {councils.map((c, i) => (
              <section className="council-entry" key={c.year}>
                <span className="council-year" dir="ltr">
                  {c.year}
                </span>
                <div>
                  <h2>{localized(c.name, language)}</h2>
                  <p>{localized(c.teaching, language)}</p>
                  <a
                    href={c.source || councilSource}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    {w.sources} ↗
                  </a>
                  <button
                    aria-pressed={Boolean(read[`council-${i}`])}
                    onClick={() => mark(`council-${i}`)}
                  >
                    {read[`council-${i}`] ? `✓ ${w.learned}` : w.mark}
                  </button>
                </div>
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="lessons-grid">
          {lessons.map((lesson, i) => (
            <section
              className={`lesson-card${selected === i ? " focused-lesson" : ""}`}
              key={lesson.url}
            >
              <span className="eyebrow">{lesson.scripture}</span>
              <h2>{localized(lesson.title, language)}</h2>
              <p>{localized(lesson.text, language)}</p>
              <a
                href={lesson.url}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                {w.sources} ↗
              </a>
              <button
                aria-pressed={Boolean(read[`lesson-${i}`])}
                onClick={() => mark(`lesson-${i}`)}
              >
                {read[`lesson-${i}`] ? `✓ ${w.learned}` : w.mark}
              </button>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
