// Public landing pages; legacy hash links remain supported.
export const pages = {
  home: ["Orthodoxy in Kurdistan", "Discover Eastern Orthodox Christianity, the Bible, saints, Church Fathers and Orthodox traditions in Kurdish, English and Georgian."],
  bible: ["Kurdish Orthodox Bible", "Read Holy Scripture in Sorani Kurdish and other available Bible editions, with Orthodox study resources."],
  saints: ["Orthodox Saints and Church Fathers", "Explore the lives, writings and teachings of Orthodox saints and Church Fathers."],
  fathers: ["Church Fathers’ Quotes", "Read quotations and teachings from the Church Fathers in the Orthodox Christian tradition."],
  discover: ["Discover Orthodox Christianity", "Explore Orthodox Christian history, theology, reading resources and tradition."],
  doctrine: ["Orthodox Christian Doctrine", "Learn about the teachings and beliefs of Eastern Orthodox Christianity."],
  prayers: ["Orthodox Christian Prayers", "Explore Orthodox Christian prayers and devotional resources in Kurdish and other available languages."],
  councils: ["Ecumenical Councils", "Learn about the ecumenical councils of the Orthodox Church and their teachings."],
  history: ["Orthodox Church History", "Explore the history and heritage of Eastern Orthodox Christianity."],
  about: ["About Orthodoxy in Kurdistan", "Learn about the Orthodoxy in Kurdistan educational project and its resources."],
  reading: ["Orthodox Reading Library", "Discover Orthodox Christian reading resources and writings."],
  sources: ["Orthodox Christian Sources", "Explore source references for Orthodox Christian learning."]
};
export function publicHref(page) {
  return page === "home" ? "/" : Object.hasOwn(pages, page) ? "/" + page + "/" : "#" + page;
}
export function routeFromLocation(loc) {
  const hash = loc.hash.slice(1);
  if (hash) return hash;
  const path = loc.pathname.replace(/^\/+|\/+$/g, "");
  return Object.hasOwn(pages, path) ? path : "home";
}
export function seoTitle(page) {
  return page === "home" ? "Orthodoxy in Kurdistan | ئۆرتۆدۆکسی ڕۆم لە کوردستان" :
    Object.hasOwn(pages, page) ? pages[page][0] + " | Orthodoxy in Kurdistan" : "Orthodoxy in Kurdistan";
}
