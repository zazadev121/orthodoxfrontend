import { russianDiscover } from "./russian-copy.js";
import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  useEditorial,
  useEditorialResource,
  useEditorialWords,
} from "./editorial-context.jsx";
import { authorName, profileHref, searchKey, textFor } from "./editorial.js";
import "./discover.css";

// These are editorial labels, not automatically generated religious content.
// Each value can be overridden in General Content Management at discover.<key>.
export const discoverTranslations = {
  ru: russianDiscover,
  en: {
    title: "Discover",
    search: "Search",
    saints: "Saints",
    saintsDescription: "The lives, teachings, and works of Orthodox saints.",
    reading: "Reading",
    readingDescription: "Read the writings of the Holy Fathers and Orthodox spiritual literature.",
    history: "Orthodox History",
    historyDescription: "Discover the history and heritage of the Orthodox Church.",
    councils: "Councils",
    councilsDescription: "Explore the Seven Ecumenical Councils and other important synods.",
    theology: "Theology",
    theologyDescription: "Study Orthodox doctrine and theology.",
    prayers: "Prayers",
    prayersDescription: "Discover traditional Orthodox prayers and liturgical texts.",
    empty: "No categories match your search.",
    readingEmpty: "No writings have been published yet.",
    historyEmpty: "No historical articles have been published yet.",
    quotes: "Saints’ Quotes",
    back: "Back to Discover",
    imageSources: "Historical image sources",
    iconSources: "Traditional icons: source credits are available on each saint’s profile.",
    manuscriptSource: "Jaharis Byzantine Lectionary, about 1100 · The Metropolitan Museum of Art · Public domain",
    loadError: "This collection could not be loaded. Please try again.",
  },
  ckb: {
    title: "گەڕان و دۆزینەوە",
    search: "گەڕان",
    saints: "پایەپیرۆزان",
    saintsDescription: "ژیان، فێرکاری و بەرهەمەکانی پایەپیرۆزانی ئۆرتۆدۆکس.",
    reading: "خوێندنەوە",
    readingDescription: "نووسینەکانی باوکانی کڵێسا و ئەدەبیاتی ڕۆحیی ئۆرتۆدۆکس بخوێنەوە.",
    history: "مێژووی ئۆرتۆدۆکس",
    historyDescription: "مێژوو و میراتی کڵێسای ئۆرتۆدۆکس بناسە.",
    councils: "ئەنجومەنەکان",
    councilsDescription: "حەوت ئەنجومەنی گشتی و ئەنجومەنە گرنگەکانی دیکە بناسە.",
    theology: "خوداناسی",
    theologyDescription: "عەقیدە و خوداناسیی ئۆرتۆدۆکس بخوێنە.",
    prayers: "نوێژ و دوعا",
    prayersDescription: "نوێژە نەریتییەکان و دەقە پەرستنییەکانی ئۆرتۆدۆکس بناسە.",
    empty: "هیچ بەشێک لەگەڵ گەڕانەکەت ناگونجێت.",
    readingEmpty: "هێشتا هیچ نووسینێک بڵاو نەکراوەتەوە.",
    historyEmpty: "هێشتا هیچ وتارێکی مێژوویی بڵاو نەکراوەتەوە.",
    quotes: "وتەکانی پایەپیرۆزان",
    back: "گەڕانەوە بۆ دۆزینەوە",
    imageSources: "سەرچاوەی وێنە مێژووییەکان",
    iconSources: "ئایکۆنە نەریتییەکان: سەرچاوەکان لە پڕۆفایلی هەر پایەپیرۆزێکدا هەن.",
    manuscriptSource: "دەستنووسی بیزەنتیی جاهاریس، نزیکەی ١١٠٠ · مۆزەخانەی مێترۆپۆلیتن · موڵکی گشتی",
    loadError: "ئەم کۆمەڵەیە بار نەبوو. تکایە دووبارە هەوڵ بدەوە.",
  },
  kmr: {
    title: "Bikole",
    search: "Lêgerîn",
    saints: "Pîroz",
    saintsDescription: "Jiyan, hînkirin û berhemên pîrozên Ortodoks.",
    reading: "Xwendin",
    readingDescription: "Nivîsên Bavên Dêrê û edebiyata giyanî ya Ortodoks bixwîne.",
    history: "Dîroka Ortodoksiyê",
    historyDescription: "Dîrok û mîrateya Dêra Ortodoks nas bike.",
    councils: "Civînên Dêrê",
    councilsDescription: "Heft Civînên Ekumenîk û civînên din ên girîng nas bike.",
    theology: "Teolojî",
    theologyDescription: "Doktrîn û teolojiya Ortodoks bixwîne.",
    prayers: "Dua",
    prayersDescription: "Duayên kevneşopî û nivîsên lîturjîk ên Ortodoks nas bike.",
    empty: "Tu beş li lêgerîna te nayê.",
    readingEmpty: "Hêj tu nivîs nehatiye weşandin.",
    historyEmpty: "Hêj tu gotara dîrokî nehatiye weşandin.",
    quotes: "Gotinên Pîrozan",
    back: "Vegere Bikole",
    imageSources: "Çavkaniyên wêneyên dîrokî",
    iconSources: "Îkonên kevneşopî: çavkanî li profîla her pîrozî hene.",
    manuscriptSource: "Lectionarya Bîzansî ya Jaharis, nêzî 1100 · Muzeya Metropolitan · Milkê giştî",
    loadError: "Ev berhevok nehat barkirin. Ji kerema xwe dîsa biceribîne.",
  },
  ka: {
    title: "აღმოაჩინე",
    search: "ძიება",
    saints: "წმინდანები",
    saintsDescription: "მართლმადიდებელ წმინდანთა ცხოვრება, სწავლებები და ნაშრომები.",
    reading: "საკითხავი",
    readingDescription: "წაიკითხეთ წმინდა მამათა ნაშრომები და მართლმადიდებლური სასულიერო ლიტერატურა.",
    history: "მართლმადიდებლობის ისტორია",
    historyDescription: "გაეცანით მართლმადიდებელი ეკლესიის ისტორიასა და მემკვიდრეობას.",
    councils: "საეკლესიო კრებები",
    councilsDescription: "გაეცანით შვიდ მსოფლიო კრებასა და სხვა მნიშვნელოვან საეკლესიო კრებებს.",
    theology: "ღვთისმეტყველება",
    theologyDescription: "შეისწავლეთ მართლმადიდებლური მოძღვრება და ღვთისმეტყველება.",
    prayers: "ლოცვები",
    prayersDescription: "გაეცანით ტრადიციულ მართლმადიდებლურ ლოცვებსა და საღვთისმსახურო ტექსტებს.",
    empty: "თქვენი ძიების შესაბამისი განყოფილება ვერ მოიძებნა.",
    readingEmpty: "ნაშრომები ჯერ არ გამოქვეყნებულა.",
    historyEmpty: "ისტორიული სტატიები ჯერ არ გამოქვეყნებულა.",
    quotes: "წმინდანთა გამონათქვამები",
    back: "დაბრუნება აღმოჩენის გვერდზე",
    imageSources: "ისტორიული გამოსახულებების წყაროები",
    iconSources: "ტრადიციული ხატების წყაროები მითითებულია თითოეული წმინდანის გვერდზე.",
    manuscriptSource: "იაჰარისის ბიზანტიური სახარება, დაახლოებით 1100 წელი · მეტროპოლიტენის მუზეუმი · საჯარო საკუთრება",
    loadError: "კრებულის ჩატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა.",
  },
};

export function discoverWords(language) {
  return discoverTranslations[language] || discoverTranslations.en;
}

// The icons are the site's already verified, locally bundled historical art.
// Image overrides are optional; the default page does not rely on hotlinked art.
export const discoverCategories = [
  { id: "saints", href: "#saints", image: "/icons/basil.webp", position: "75% 5%", aliases: "saints lives synaxarion church fathers پایەپیرۆزان წმინდანები" },
  { id: "reading", href: "#reading", image: "/icons/chrysostom.webp", position: "74% 5%", aliases: "reading writings literature fathers books خوێندنەوە საკითხავი" },
  { id: "history", href: "#history", image: "/icons/maximus.webp", position: "76% 33%", aliases: "orthodox history heritage church مێژوو ისტორია" },
  { id: "councils", href: "#councils", image: "/icons/gregory-theologian.webp", position: "72% 34%", aliases: "councils seven ecumenical synods ئەنجومەن კრებები" },
  { id: "theology", href: "#doctrine", image: "/icons/gregory-nyssa.webp", position: "75% 27%", aliases: "theology doctrine teaching faith عقیدە خوداناسی ღვთისმეტყველება" },
  { id: "prayers", href: "#prayers", image: "/icons/anthony.webp", position: "75% 2%", aliases: "prayers liturgy liturgical نوێژ دوعا ლოცვები" },
];

export function DiscoverPage({ language, hideHeading = false }) {
  const cms = useEditorial();
  const w = cms.words(discoverWords(language), "discover", language);
  const [search, setSearch] = useState("");
  const key = searchKey(search);
  const matches = discoverCategories.filter((card) =>
    searchKey(`${w[card.id]} ${w[`${card.id}Description`]} ${card.aliases}`).includes(key),
  );
  return (
    <div className="discover-page" dir={language === "ckb" ? "rtl" : "ltr"}>
      {!hideHeading && <h1 id="discover-title" className="discover-title">{w.title}</h1>}
      <label className="discover-search">
        <Search size={22} aria-hidden="true" />
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={w.search} aria-label={w.search} autoComplete="off" />
      </label>
      <div className="discover-categories">
        {matches.map((card, index) => (
          <a className={`discover-card discover-card-${card.id}`} key={card.id} href={card.href}>
            <img src={cms.text(`discover.images.${card.id}`, language, card.image)} alt="" aria-hidden="true" loading={index < 2 ? "eager" : "lazy"} decoding="async" style={{ objectPosition: card.position }} width="1200" height="400" />
            <div className="discover-card-content">
              <h2>{w[card.id]}</h2>
              <p>{w[`${card.id}Description`]}</p>
            </div>
          </a>
        ))}
      </div>
      {!matches.length && <p className="discover-empty" role="status">{w.empty}</p>}
      <div className="discover-secondary">
        <a href="#fathers">{w.quotes}</a>
        <details className="discover-credits">
          <summary>{w.imageSources}</summary>
          <p>{w.iconSources}</p>
        </details>
      </div>
    </div>
  );
}

function CollectionState({ resource, language }) {
  const cms = useEditorial();
  const w = cms.words(discoverWords(language), "discover", language);
  const ew = useEditorialWords(language);
  return <div className={resource.error ? "error" : "empty"} role={resource.error ? "alert" : "status"}>
    <p>{resource.error ? w.loadError : ew.loading}</p>
    {resource.error && <button className="button secondary" onClick={resource.retry}>{ew.retry}</button>}
  </div>;
}

function DiscoverCollection({ language, history = false }) {
  const cms = useEditorial();
  const w = cms.words(discoverWords(language), "discover", language);
  const ew = useEditorialWords(language);
  const [page, setPage] = useState(1);
  const resource = useEditorialResource(history ? `/doctrines?category=history&page=${page}&limit=50` : `/writings?page=${page}&limit=50`);
  const items = resource.data?.items || [];
  return <div className="page heritage-page discover-collection">
    <a className="discover-back text-link" href="#discover">{w.back}</a>
    <header className="heritage-heading">
      <h1>{history ? w.history : w.reading}</h1>
      <p>{history ? w.historyDescription : w.readingDescription}</p>
    </header>
    {!history && <p><a className="button secondary" href="#fathers">{w.quotes}</a></p>}
    {!resource.data ? <CollectionState resource={resource} language={language} /> : <>
      {resource.error && <CollectionState resource={resource} language={language} />}
      <div className="lessons-grid discover-writing-list">
        {items.map((item) => <article className="lesson-card" key={item.id}>
          <h2><a href={history ? `#article?id=${encodeURIComponent(item.slug)}` : `#writing?id=${encodeURIComponent(item.id)}`}>{textFor(item, "title", language) || ew.missingTranslation}</a></h2>
          {!history && item.author && <p className="discover-writing-author"><a href={profileHref(item.author)}>{authorName(item.author, language)}</a></p>}
          {textFor(item, "subtitle", language) && <p className="editorial-verbatim">{textFor(item, "subtitle", language)}</p>}
          <a className="text-link" href={history ? `#article?id=${encodeURIComponent(item.slug)}` : `#writing?id=${encodeURIComponent(item.id)}`}>{ew.read}</a>
        </article>)}
      </div>
      {!items.length && <p className="empty" role="status">{history ? w.historyEmpty : w.readingEmpty}</p>}
      {resource.data.total > 50 && <div className="editorial-pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>{ew.previous}</button>
        <span>{page}</span>
        <button disabled={page * 50 >= resource.data.total} onClick={() => setPage((p) => p + 1)}>{ew.next}</button>
      </div>}
    </>}
  </div>;
}

export function ReadingLibrary({ language }) {
  return <DiscoverCollection language={language} />;
}

export function HistoryLibrary({ language }) {
  return <DiscoverCollection language={language} history />;
}
