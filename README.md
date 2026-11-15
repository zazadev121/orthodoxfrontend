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

