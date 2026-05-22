# AIKYAM Project Context — Updated May 22, 2026

## Project 1: AIKYAM Band Website

### Band Info
- **Name:** AIKYAM
- **Genre:** Bollywood Fusion Acoustic
- **Members:** Kamal Kishor Vyas (Lead Singer & Acoustic Guitar), Jobin John (Drummer/Percussionist)
- **Live URL:** https://aikyam-official.netlify.app
- **Repo:** https://github.com/jobin-j/aikyam
- **Active Branch:** `main` (song-request-dashboard merged)

### Tech Stack
- React (Create React App)
- SCSS for styling
- Single page — NO react-router
- Hash-based routing (#/request, #/performer, #/queue)
- Hosted on Netlify

### Repo Structure
```
src/
├── components/
│   ├── AikyamHero.jsx / .scss
│   ├── AikyamAbout.jsx / .scss
│   ├── AikyamMembers.jsx / .scss
│   ├── AikyamContact.jsx / .scss
│   ├── AikyamChatbot.jsx / .scss
│   ├── AikyamSpinner.jsx / .scss      ← Branded full-page spinner
│   ├── SongRequestForm.jsx / .scss    ← DONE
│   ├── PerformerDashboard.jsx / .scss ← DONE
│   ├── PerformerGuard.jsx             ← DONE (uses PerformerDashboard.scss)
│   └── QueueView.jsx / .scss          ← DONE
├── services/
│   └── googleSheets.js                ← DONE
├── styles/
│   └── _variables.scss
├── App.jsx
├── index.js
└── index.scss
```

---

## Project 2: Song Request Management System

### Flow
```
QR Code at Venue
      ↓
/#/request  — Single input form (song name or any description)
      ↓
Success screen — real queue position + est. wait
      ↓  [View Live Queue button]
/#/queue  — Public read-only queue (highlights user's own requests)

Separately:
/#/performer  — PIN-protected performer dashboard (PIN: 2412)
```

### Hash Routing (in App.jsx)
```js
{view === 'home'      && <ExistingWebsite />}
{view === 'request'   && <SongRequestForm />}
{view === 'queue'     && <QueueView />}
{view === 'performer' && <PerformerGuard />}
```

---

## Components — ALL COMPLETED ✅

### SongRequestForm.jsx
- 3-step flow: Song Request → Dedication → Success
- **Single free-text input** — user types anything:
  - "Tum Hi Ho"
  - "Any Aashiqui 2 song"
  - "Any song by Arijit Singh"
- Title case enforced via toTitleCase()
- Dedication chips (Birthday, Anniversary, Special, Friend) + custom textarea (150 char)
- Real queue position from Google Sheets (est. wait = position × 4 mins)
- AikyamSpinner shown while submitting (color: #FF9933)
- Error message on failure — stays on step 2 so user can retry
- Saves request ID to localStorage on success (for banner)
- Session key saved to localStorage (for "Yours!" on multiple requests)
- "View Live Queue →" button on success screen
- CSS prefix: `sr-*`
- Theme: Light (page bg #C4956A, card bg #FFFDF5)

### PerformerDashboard.jsx
- Live queue with auto-polling every 3 seconds
- Now Playing section with spinning disc animation
- Queue rows with:
  - ▶ Play button
  - ⊘ Skip button
  - ☑ Checkbox for bulk actions
- **Bulk actions** — when checkboxes selected:
  - Individual play/skip buttons disabled
  - "Skip Selected (n) ⊘" button appears
  - "Mark Selected (n) ✓" button appears
- Completed list (last 5 of TODAY only — date filtered)
- Filter by song or artist
- Stats: pending count, completed count
- loadingId state — disables buttons while action in progress
- AikyamSpinner (color: #D4AF37) shown while updating
- Toast notifications — success=saffron, error=crimson, auto-dismiss 3s
- Empty state messages:
  - Playing + empty queue → "Currently playing — queue is clear!"
  - Nothing at all → "The stage is yours — no requests yet!"
- CSS prefix: `pd-*`
- Theme: Light (matches audience screens — #E8D5B0 bg, #FFFDF5 cards)

### PerformerGuard.jsx
- PIN screen protecting /#/performer
- PIN hardcoded: '2412'
- **PIN persists across refresh** via localStorage (`aikyam_performer_auth`)
- On success → renders PerformerDashboard
- CSS prefix: `pg-*`
- Uses PerformerDashboard.scss

### QueueView.jsx
- Public read-only queue, auto-polls every 3 seconds
- **Session-key based** "Yours!" highlighting — works for multiple requests
- Today's date filter — no previous gig requests shown
- My Request status banner:
  - pending  → position in queue
  - playing  → "Now Playing!"
  - completed → "Your song was played!"
  - skipped  → "Sorry, we don't know this one. Try another?" + link to /#/request
- Now Playing section with timestamp
- Full pending queue list with timestamps
- "Be the first to request a song!" empty state
- "+ Request a Song" button at bottom
- CSS prefix: `qv-*`
- Theme: Light (matches SongRequestForm — #E8D5B0 bg, #FFFDF5 cards)

### AikyamSpinner.jsx
- Reusable full-page overlay spinner
- Spins the "A" letter in Cinzel font
- Accepts `color` prop
- Usage:
  - SongRequestForm:    `<AikyamSpinner color="#FF9933" />`
  - PerformerDashboard: `<AikyamSpinner color="#D4AF37" />`
  - QueueView:          `<AikyamSpinner color="#FF9933" />`

---

## Backend: Google Sheets via Apps Script ✅

### Google Sheet: "AIKYAM Song Requests"
Columns:
```
A: id
B: song
C: artistOrMovie (kept empty — no longer used in UI)
D: dedication
E: status
F: timestamp
G: sessionKey
```

### Apps Script
- URL: https://script.google.com/macros/s/AKfycbwWlChcuoGr4dGs0kiFs8CaMR6MC5W6XsNS-ijx8BuhX25MlIKWktqo_r0eUmbcM0RN/exec
- GET → returns all requests
- POST `{ song, dedication, sessionKey }` → adds row, returns `{ success, id, position }`
- POST `{ action: 'updateStatus', id, status }` → updates status

### Request statuses
```
pending   → in queue
playing   → currently being performed
completed → song was played
skipped   → performer doesn't know → triggers apology in QueueView
```

### .env variables
```
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id
```

### Netlify Environment Variables
```
REACT_APP_GOOGLE_SCRIPT_URL
REACT_APP_GOOGLE_SHEET_ID
SECRETS_SCAN_OMIT_KEYS=ANTHROPIC_API_KEY,REACT_APP_GOOGLE_SCRIPT_URL
```

---

## Design System

### Colors (from _variables.scss)
```scss
// Saffron family
$saffron:       #FF9933;  → Primary buttons, active states, spinner
$deep-saffron:  #FF6B1A;  → Button gradients
$marigold:      #FFA630;

// Gold family
$gold:          #D4AF37;  → Shimmer bar, borders, ornaments
$bright-gold:   #FFC72C;  → Gradient highlights
$antique-gold:  #C9A227;  → Gradient ends

// Ruby / red family
$ruby:          #9B111E;  → Titles, headings, special moments
$crimson:       #DC143C;  → Dedication text, error states, skip button
$vermilion:     #E34234;

// Background / depth
$maroon:        #3D0A0A;  → Body text on light bg, borders
$wine:          #1F0303;  → (no longer used — all screens now light theme)
$midnight-plum: #2A0A1A;

// Highlights
$ivory:         #FFF8DC;  → Spinner text, button text on dark
$cream:         #FBF2D4;
$bronze:        #CD7F32;
$peacock:       #1B5E78;
```

### Theme — All Screens Now Light
| Screen | Page BG | Card BG |
|--------|---------|---------|
| `/#/request` | `#C4956A` terracotta | `#FFFDF5` |
| `/#/queue` | `#E8D5B0` warm sand | `#FFFDF5` |
| `/#/performer` | `#E8D5B0` warm sand | `#FFFDF5` |
| PIN Guard | `#E8D5B0` warm sand | `#FFFDF5` |

### Typography
```scss
$font-display:  'Cinzel', 'Times New Roman', serif;
$font-sanskrit: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
$font-body:     'Cormorant Garamond', Georgia, serif;
```

| Font | Role | Size range |
|------|------|-----------|
| Cinzel (`$font-display`) | Page titles, labels, buttons, stats, section heads | 12px–34px |
| Cormorant Garamond (`$font-body`) | Song names, artist names, dedications, body text | 15px–24px |
| Tiro Devanagari (`$font-sanskrit`) | Taglines, sub-branding only | 10px–13px |

### Typography Rules
- Cinzel labels → always `uppercase`, `letter-spacing: 2–2.5px`, `font-weight: 700`
- Cormorant song names → `font-weight: 700`, `font-size: 18–24px`
- Cormorant artist names → `font-style: italic`, `font-size: 15–18px`, `opacity: .65`
- Cormorant dedications → `font-style: italic`, `color: $crimson`
- Minimum: `12px` labels, `15px` body, `19px` inputs

### Component Rules
- Border radius: `2px` or `3px` — sharp, architectural
- Borders: `1.5px` or `2px solid`
- Primary button: `linear-gradient(135deg, $saffron, $deep-saffron)`, color `#FFFDF5`
- Shimmer bar on every card: Ruby → Saffron → Gold → Saffron → Ruby
- CSS class prefixes: `sr-*`, `pd-*`, `pg-*`, `qv-*`, `aikyam-spinner`

---

## LocalStorage Keys
```
aikyam_session          → session key (for "Yours!" on multiple requests)
aikyam_request_id       → last request ID (for status banner)
aikyam_performer_auth   → 'true' if performer PIN entered (persists refresh)
```

---

## Key Decisions Made (don't revisit)
- No Spotify/Saavn API — single free-text input instead
- No googleapis library — doesn't work in browser
- Hash routing — no react-router
- Google Apps Script as backend — free, no server
- Polling every 3 seconds — upgrade to WebSocket later
- PIN hardcoded '2412' for MVP
- Session key for identifying all of user's requests
- Date filter on completed/queue — no previous gig data shown
- All screens light theme — consistent, readable at bright venues
- artistOrMovie column kept in sheet (empty) — avoids breaking row mapping
- Last 5 completed requests shown (today only)
- Est. wait = queuePos × 4 minutes

---

## TODO — Future Enhancements
- ⬜ Logout button on Performer Dashboard
- ⬜ Gig-based separation (gigId) for multiple venues/performers simultaneously
- ⬜ "Start New Gig" button — archives old requests, fresh start
- ⬜ QR Code generation with AIKYAM brand colors
- ⬜ WebSocket upgrade (currently polling every 3s)
- ⬜ Song library — mark songs performer knows/doesn't know
- ⬜ Analytics — most requested songs, most requested artists
- ⬜ Karaoke mode — "Your Name" field for audience singers
- ⬜ Multi-performer support (gigId architecture already planned)

---

## How to Resume in a New Chat
1. Share these two URLs:
   - https://raw.githubusercontent.com/jobin-j/aikyam/main/AIKYAM_context_may19.md
   - https://raw.githubusercontent.com/jobin-j/aikyam/main/AIKYAM_design_instructions.md
2. Say what you want to work on next