# Orthodoxy in Kurdistan — frontend

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

## Features

- Fully translated interface in Sorani and Kurmanji; RTL/LTR layouts switch with the locale.
- Home artwork uses CSS/vector geometry, with no external photograph dependencies.
- Bible links open verified editions at their providers: [KSS on BibleGateway](https://www.biblegateway.com/versions/Kurdi-Sorani-Standard-KSS-Bible) (Biblica; Old/New Testament) and [Kurmanji Încîl](https://www.bible.com/versions/251) (Bible Society in Turkey, 2005; New Testament and Psalms). These are recognized Kurdish translations, not Orthodox-specific editions. Complete Orthodox canon coverage is not claimed. Full text is not bundled, scraped, or machine-translated. Obtain publisher permission / a licensed API before adding an in-app full-text reader.
- Search/filter published quotations; real loading, empty and failure states.
- AI language follows the selected locale and defaults to Sorani. Shows approved citation links and a warning about AI accuracy. Chat history stays in component memory and is cleared when leaving the page or switching languages.
- Admin: create/edit/delete quotations with both Kurdish texts, work/section reference, source URL, topic and draft/publish state. Manage approved AI source summaries and multilingual retrieval keywords.
- Responsive layouts, keyboard focus, visible labels, accessible forms and reduced-motion support.

Kurdish copy and theological translations should be reviewed by fluent speakers and an Orthodox editor before public launch. No fabricated quotation samples are shipped.

## Production

`npm run build` produces `dist/`. Deploy on any static host. Set the three public frontend environment variables **before** building; Vite embeds them at build time. Routes use hashes, so they work with static hosting. `_redirects` is provided for compatible hosts. Set the backend's CORS origins and Supabase Auth Site URL to your final HTTPS domain. Google Fonts is optional; system fallback fonts remain available offline.

`npm run preview` serves the production build locally. Frontend build checks are independent of credentials. Live sign-in and content CRUD require the configured backend and Supabase schema.
