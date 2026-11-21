# Elvar Strategy Firm website (elvarstrategyfirm.com)

Static site hosted on GitHub Pages. Every push to `main` goes live in about a minute.

## Rules
- Each page is a folder with `index.html` (e.g. `/elvar-athlete/index.html` → elvarstrategyfirm.com/elvar-athlete). Images live in `/assets/img/`.
- **Never rename or delete a live address.** Booklet QR codes point to pages like `/evo-academy`. Old addresses get a small redirect `index.html` instead (see `/1-on-1-recaps/index.html` for the pattern).
- Portals that update often keep content in a data file (e.g. `/evo-academy/sessions.json`); weekly updates touch only that file.
- Password-protected portal content must be encrypted in the repo (the repo is public).
- Design: background `#262626`, dark sections `#1d1d1d`, cards `#2e2e2e`, lines `#3a3a3a`, gold `#C9A84C` (hover `#d8b964`), Montserrat. Wordmark "EL**V**AR" with gold V. Every page ends with a small grey "Prepared by Michael Chaves Jr." credit.
- No "Text Mike" or personal phone number links. Consult booking (Acuity: https://elvarstrategyfirm.as.me/schedule/523525b2) and current-partner portal access sit at the top of partnership pages.
- Elvar Business pages never lead with "AI"; say smarter systems, modern tools, less busywork.
- `/mikechavesjrportfolio` is hidden: not linked anywhere, `noindex`, blocked in `robots.txt`.

## Who owns what (chats in the "Elvar Website" Claude project)
- Website chat: page design, new pages, redirects
- One-on-One portal chat: `/one-on-one-partner-portal`
- Team portal chat: `/team-portal`
- Evo Academy chat: `/evo-academy` (weekly transcript + YouTube link → `sessions.json`)

Full guide: `claude/elvar-website-site-guide.md` in the Elvar Website project.
