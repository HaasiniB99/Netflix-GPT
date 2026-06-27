# Netflix GPT

A Netflix-style streaming UI built with React and Redux, featuring AI-powered conversational movie discovery via OpenRouter/GPT and live movie data from TMDB.

![CI](https://github.com/HaasiniB99/Netflix-GPT/actions/workflows/ci.yml/badge.svg)

---

## Features

- **Authentication** — Firebase Auth (email/password signup and signin)
- **Browse homepage** — Now Playing, Popular, Top Rated, and Upcoming movie rows pulled live from TMDB
- **Auto-rotating hero banner** — cycles through 5–6 featured movies every 3 seconds with a smooth crossfade, pausing on hover
- **Movie detail pages** — click any movie card to view backdrop, description, release year, runtime, rating, genres, cast, and similar-movie recommendations — all real TMDB data, nothing fabricated
- **Trailer playback** — "Play Trailer" expands the trailer to a fullscreen view with a brief "Now Playing" title overlay, closable via an X button or the Escape key
- **AI-powered conversational search (GPT mode)** — describe what you're in the mood for in natural language; an LLM (via OpenRouter, free-tier model) suggests movies, which are then looked up and displayed via TMDB
- **Direct title search** — a standalone search icon in the header for direct TMDB title lookups, independent of the AI search
- **Loading and error states** — skeleton loaders while data is in flight, inline retry messaging on API failure instead of blank screens
- **Accessibility** — keyboard navigation and visible focus states on interactive elements, descriptive alt text on movie posters, aria-labels on icon-only buttons
- **Automated testing & CI** — Jest/React Testing Library unit tests, run automatically on every push via GitHub Actions



## Tech Stack

Layer -> Tech 

Framework | React 19 (Create React App) 
State management | Redux Toolkit 
Styling | Tailwind CSS 
Routing | React Router 
Auth | Firebase Authentication 
Movie data | TMDB API 
AI search | OpenRouter (OpenAI-compatible API, free-tier model) 
Testing | Jest + React Testing Library 
CI | GitHub Actions 


## Setup

1. Install dependencies: npm install


2. Create a `.env` file in the project root with:
   
   REACT_APP_TMDB_KEY=your_tmdb_v4_read_access_token
   REACT_APP_GPT_KEY=your_openrouter_api_key
   
   - Get a TMDB key at [themoviedb.org](https://www.themoviedb.org) (Settings → API → use the **v4 Read Access Token**)
   - Get a free OpenRouter key at [openrouter.ai](https://openrouter.ai) — no payment required, the app uses a free-tier model

4. Run it: npm start


5. Run tests: npm test
 

## Bugs Found & Fixed

This project started as a course-style clone with a number of latent bugs. Rather than just adding features on top, the existing codebase was audited and the following issues were identified and fixed:

- **Signin was completely broken.** Validation logic required a `name' field on every auth attempt, including signin — but signin never collects a name, so it was passed as `null` and validation failed before email/password were even checked. Fixed by scoping name validation to signup only.
- **Dead recursive component.** A leftover `GptSearchBar.js` component rendered itself inside its own JSX, which would have caused an infinite render loop / crash if it were ever imported. Confirmed it was unused and removed it.
- **Form submission used the wrong event.** The GPT search form was wired to `onClick` with a manual `preventDefault()` instead of `onSubmit` — meaning pressing Enter in the search box didn't behave correctly. Fixed by properly binding `onSubmit`.
- **No error handling on any API calls.** TMDB and OpenRouter calls had no `try/catch`, so a failed request just produced a blank screen or a silent console error. Added loading states and inline error/retry UI across the movie-fetching hooks and the GPT search flow.
- **White flash on initial page load.** The app showed a default white background for 1–2 seconds before the dark theme painted in. Fixed by setting the body background to match the app's dark theme so there's no flash.
- **GPT search results were unreachable.** The results view was locked to a fixed `h-screen overflow-hidden` container, which capped the page at one viewport height and made any rows below the fold completely unscrollable — not just visually hidden, but actually unreachable. Fixed by switching to a scrollable container.
- **Selected language wasn't influencing GPT search results.** The language selector changed UI placeholder text but was never actually passed into the AI prompt, so results defaulted to English/Hollywood regardless of the selected language. Diagnosed across the full pipeline (prompt construction → AI response → TMDB lookup) and addressed with explicit language/industry instructions in the prompt plus a TMDB-side language filter as a backstop, since free-tier AI models don't reliably follow instructions on their own.
- **Unused imports and dead code** (`signOut` in Login.js, unused `analytics` reference, an unused constant) were cleaned up.

---

## Known Limitations

- **Trailers only, not full movies.** TMDB only provides metadata and YouTube trailer links — it has no licensing to serve full films, and no legitimate API does for a project like this. "Play Trailer" plays the actual movie trailer in a fullscreen view, which is the standard, honest approach for this type of project.
- **GPT search runs on a free-tier AI model**, which is rate-limited (roughly 50 requests/day) and occasionally less consistent at following instructions than a paid model would be.
- **No backend beyond Firebase Auth and third-party APIs** — this is a frontend-focused project; there's no custom server or database layer.

---

## Testing

Unit tests cover:
- Auth validation logic (including a regression test locking in the signin bug fix above)
- The Redux reducer powering GPT search results
- Movie card rendering, including edge cases like missing poster images


Every push and pull request to main triggers a GitHub Actions workflow (.github/workflows/ci.yml) that runs npm ci, the full test suite, and a production build — with no API keys present, confirming the app builds and tests cleanly even without .env configured.