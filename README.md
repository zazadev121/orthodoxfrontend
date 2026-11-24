# Complete editorial dashboard

Open `#admin` and use the existing verified owner account. The seven management sections share the same relational author IDs and content database. Select an author when creating quotes, writings or Bible explanations; published entries then appear automatically in the general library and that author's profile. New records are drafts until you explicitly publish them.

General Content Management lets you search by the visible wording or its identifier and edit each language independently. It includes navigation, settings, homepage descriptions, saint-section labels, Bible book labels, font labels, images and homepage section visibility. Existing text identifiers stay fixed so an accidental rename cannot disconnect an override. Images can be uploaded/replaced/cleared, and display-order fields control author/article order. Text is rendered verbatim, with no automatic translation or theology rewriting.

Bible Management includes exact book/chapter/verse or verse-range explanations, multiple linked authors, source references, optional explicit verse revisions, dated daily verses and edition controls. Explanations expand inline on the reading page; author links open the same shared profiles. The original licensed Bible text and attribution are preserved.

Archive actions hide content without permanently deleting it; restore returns it to draft. Revision history lets you copy an earlier version into the editor for manual review and saving. Content backups include drafts, archives and revision records; keep exports private. Unsaved edits trigger a leave warning.

Run `npm test` and `npm run build`. Public pages use the read-only Supabase Edge reader, with the existing API as a deployment fallback; writes retain owner authentication. No test token, QA entry page, local environment file or fixture is deployed.

## Existing project documentation

# Orthodoxy in Kurdistan — frontend

The header and admin route now share one Supabase session/role state. A signed-in owner sees “Admin panel” in the header and navigation; other signed-in users see “Account”. Prayers are linked from the homepage and main navigation, and reading them never requires login.

English is available in the three-language selector, including navigation, administration, AI answers and the eight starter prayers. Open `/?lang=en#admin` to force English for testing; the language preference is also saved locally. Sorani remains the default. Admin editors offer optional English title/text fields for prayers and English text for quotations. Custom records without English display a missing-translation message instead of silently showing Kurdish as English.

Prayers are available at `/#prayers`, with search, topic filtering and expandable Sorani/Kurmanji text. The header has a visible sign-in link to `/#admin`. Only the single owner can manage quotes, prayers and approved AI sources. Run the backend's latest SQL migration and owner setup before using these editors. Public registration is not offered. Database and AI setup errors are translated into both interface languages.

React 19 + Vite. A responsive Kurdish educational application with Sorani (default, RTL) and Kurmanji (LTR), a persistent language switch, Bible editions, searchable Church Fathers quotations, cited Orthodox AI answers, and protected administration.

Backend: https://github.com/zazadev121/orthodoxbackend

## Run locally

1. Install Node 22+.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_URL` to your backend URL (default `http://localhost:4000`).
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from your Supabase project (Project Settings → API Keys). A legacy anon key also works in this variable. **Never put a Supabase secret/service-role key or Groq key in a `VITE_` variable. Everything prefixed `VITE_` is public in the browser bundle.**
5. `npm ci`, then `npm run dev`.
6. Open http://localhost:5173. Start the backend separately.

The backend README explains the SQL migration, first admin user, source seed, environment and hosting. A database connection string is unnecessary. The frontend needs the same Supabase project as the backend. Admin sign-in is at `/#admin` (also linked in the footer). Only users added to the backend's `admins` table can manage content.

Appearance settings (`/#appearance`) offer nine saved palettes: amethyst, midnight, evening blue, burgundy, forest, ocean, ivory, charcoal, and coffee. The default is amethyst; previous light/dark choices migrate to ivory/midnight. A palette icon opens settings, also available in the mobile bottom navigation. Reading size controls apply to prayers and quotations and persist on this device. Quote creation no longer asks for a source URL; deploy the matching backend update first. Existing source links remain readable. No SQL migration is needed.

## Features

- Fully translated interface in Sorani and Kurmanji; RTL/LTR layouts switch with the locale.
- The homepage and brand use the supplied Kurdistan cross image, bundled locally with no external image dependency.
- In-site Scripture reader: Sorani (Biblica® Open Kurdi Sorani Standard Version™, 66 books, CC BY-SA 4.0) and English (World English Bible Updated, 81 available books including deuterocanonical/additional books, public domain). Book/chapter controls, previous/next navigation, footnotes, shareable passage URLs, saved reading position and reading size. Text and translation metadata come from AO Lab's Free Use Bible API; copyright/source links appear below the reader. Kurmanji UI remains available, but a Kurmanji Scripture translation is not included.
- Homepage daily verse: 40 curated references with exact Sorani/English source text bundled locally. The rotation changes at the visitor's local midnight (checked every 30 seconds and when the tab becomes visible). This is a devotional rotation, not a liturgical lectionary. “Read the chapter” opens and highlights the verse inside the site. No cron job, API key or backend request is required for the daily card.
- Chapters load on demand from `https://bible.helloao.org/api/{translation}/{book}/{chapter}.simple.json`. The last 12 chapters are cached on this device for seven days; older cached copies can be shown when the service fails. Full offline Bible downloads are not included. The service is an external runtime dependency; errors show a retry control.
- To refresh book metadata and unchanged daily excerpts, run `node scripts/refresh-scripture.mjs`. Review the upstream translation license before changing editions. Sorani Scripture text remains under CC BY-SA 4.0; application code is separate.
- Search/filter published quotations; real loading, empty and failure states.
- AI language follows the selected locale and defaults to Sorani. Shows approved citation links and a warning about AI accuracy. Chat history stays in component memory and is cleared when leaving the page or switching languages.
- Admin: create/edit/delete quotations with both Kurdish texts, work/section reference, topic and draft/publish state. Manage approved AI source summaries and multilingual retrieval keywords.
- Responsive layouts, keyboard focus, visible labels, accessible forms and reduced-motion support.

Kurdish copy and theological translations should be reviewed by fluent speakers and an Orthodox editor before public launch. No fabricated quotation samples are shipped.

## Production

`npm run build` produces `dist/`. Deploy on any static host. Set the three public frontend environment variables **before** building; Vite embeds them at build time. Routes use hashes, so they work with static hosting. `_redirects` is provided for compatible hosts. Set the backend's CORS origins and Supabase Auth Site URL to your final HTTPS domain. Google Fonts is optional; system fallback fonts remain available offline.

`npm run preview` serves the production build locally. Frontend build checks are independent of credentials. Live sign-in and content CRUD require the configured backend and Supabase schema.



## Reading fonts

Appearance settings include 12 font cards with real Kurdish samples. The selected font is saved as `readerFont` and applied before first paint to Scripture, daily verses, quotations, prayers and selected reading paragraphs. Themes and reading size remain independent. Navigation and form controls retain their interface font. Fonts are served from this project under `/fonts/`, so the chosen font needs no external font service at runtime. Other faces are loaded for their visible picker previews; entering the rest of the site does not request all 12 fonts.

The requested generic Kurdish family names resolve to NRT Regular, Speda Normal, Rudaw Regular, Rabar 001, Unikurd Web and Nizar Bukra Regular. The other choices are Noto Naskh Arabic, Noto Kufi Arabic, Noto Sans Arabic, Vazirmatn, Readex Pro and Noto Nastaliq Urdu. Individual characters absent from a font use Noto Naskh as fallback. This matters for some Kurdish characters in Readex Pro and Nastaliq. See `public/fonts/sources.json` for the exact source files. Original name/copyright metadata is preserved inside the converted WOFF files; Google Fonts OFL notices are included alongside them.

## Search engine visibility and custom domain

The build creates static public landing pages, page-specific metadata, canonical URLs, robots.txt and sitemap.xml. Existing hash links still work. Public navigation uses crawlable paths. Individual dynamic profiles and Bible passages still use legacy hash links and are not included in the sitemap. The default canonical origin is the existing production deployment at https://orthodoxfrontend.vercel.app. After registering and connecting the new domain, set `VITE_SITE_URL=https://www.orthodoxyinkurdistan.com` in the production build environment and redeploy. Set up apex-to-www and old-domain redirects, backend CORS and Supabase Auth URL settings. Verify domain ownership in Google Search Console, then submit /sitemap.xml. Search ranking is not guaranteed. Run npm test and npm run build to validate changes.
