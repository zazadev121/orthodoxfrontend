# Orthodox content and appearance

The ten saint profiles are editorial summaries in `src/saints-data.js`. The existing database-backed Church Fathers and prayers remain separate and unchanged. Sorani biographies and quote translations are editorial translations, not official liturgical translations. Kurmanji navigation and existing content remain available; new extended material uses an explicit English fallback until a reviewed Kurmanji translation is supplied.

Each profile links its OCA/GOARCH biography, primary work or identifiable published quotation excerpt, and icon attribution. Quotes are short excerpts, not paraphrases presented as verbatim text. Anthony's teaching is identified as recorded by Athanasius. Paisios's quotation names the published volume and page and the parish bulletin reproducing it. Isaac's quotation identifies the HTM 1984 edition because homily numbering varies.

Do not remove uncertainty from dates: Isaac's exact birth/death years are not established; Gregory of Nyssa died after 394; Gregory the Theologian's death is commonly dated 389/390. Isaac's older OCA calendar entry conflicts with the seventh-century dating used by GOARCH, so that entry is used only for the feast date. Feast dates are ecclesiastical dates; Julian-calendar civil dates differ.

The councils and introductory lessons in `src/orthodox-home.jsx` are concise educational summaries, not formal conciliar definitions. They link Orthodox Church in America catechetical publications and patristic texts. Do not treat a single patristic passage as replacing the received faith of the Church. No new prayers have been composed.

Icons are real artwork obtained from the Wikimedia Commons files listed in `src/icon-credits.json`. Nine are marked public domain there. The Paisios photograph is credited to Russian Orthodox Cathedral of St John the Baptist, Washington DC, under CC BY-SA 2.0; the cropped/resized web version retains that licence. Source and licence links are displayed on each profile. WebP derivatives are self-hosted and cards load lazily.

## Preferences

`readerFont` remains the storage key for compatibility, but the CSS font token now applies to the complete interface. Speda is the default when no valid preference exists. Actual specimens in the font picker intentionally keep their own typeface. The early initializer prevents a default-font flash. Existing theme, language, Bible position, chapter cache, and reading-size preferences remain intact. New saint bookmarks and last-visited saint are saved locally, as are lesson and council completion marks.

## Validation

Run `npm test` and `npm run build`. Tests cover all 12 font files/defaults, theme names/migrations, Scripture references/navigation/cache/storage failures, ten saints with biographies/icons/credits, and mandatory quotation attribution fields. Browser checks must also confirm global computed fonts, refresh persistence, search, each profile/quotation tab, source links, saved profiles, study progress, Bible navigation, RTL/LTR language changes, and phone/tablet/desktop layouts. Database-backed prayers, Fathers, and authenticated admin require a configured API/auth environment; production should be checked independently after deployment.
