import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pages, publicHref, seoTitle } from "../src/seo-pages.js";

const configured = process.env.VITE_SITE_URL || "https://orthodoxfrontend.vercel.app";
const url = new URL(configured);
if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
  throw new Error("VITE_SITE_URL must be an HTTPS site origin");
}
const origin = url.origin;
const root = new URL("../dist/", import.meta.url);
const template = await readFile(new URL("index.html", root), "utf8");
const escape = s => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const links = [];
for (const [page, [label, description]] of Object.entries(pages)) {
  const canonical = origin + publicHref(page);
  links.push(canonical);
  const head = [
    '<link rel="canonical" href="' + escape(canonical) + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Orthodoxy in Kurdistan" />',
    '<meta property="og:title" content="' + escape(seoTitle(page)) + '" />',
    '<meta property="og:description" content="' + escape(description) + '" />',
    '<meta property="og:url" content="' + escape(canonical) + '" />',
    '<meta property="og:image" content="' + escape(origin + "/kurdistan-cross.jpg") + '" />',
    '<meta name="twitter:card" content="summary" />',
  ].join("\n    ");
  const html = template.replace(/<title>[\s\S]*?<\/title>/, "<title>" + escape(seoTitle(page)) + "</title>")
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, '<meta name="description" content="' + escape(description) + '" />')
    .replace("</head>", head + "\n  </head>");
  const dir = page === "home" ? root : new URL(page + "/", root);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), html);
}
await writeFile(new URL("robots.txt", root), "User-agent: *\nAllow: /\nSitemap: " + origin + "/sitemap.xml\n");
await writeFile(new URL("sitemap.xml", root), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + links.map(link => "  <url><loc>" + escape(link) + "</loc></url>").join("\n") + "\n</urlset>\n");
console.log("Generated " + links.length + " public SEO landing pages for " + origin);
