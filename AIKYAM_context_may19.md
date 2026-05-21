# AIKYAM Project Context — Updated May 21, 2026

## Project 1: AIKYAM Band Website

### Band Info
- **Name:** AIKYAM
- **Genre:** Bollywood Fusion Acoustic
- **Members:** Kamal Kishor Vyas (Lead Singer & Acoustic Guitar), Jobin John (Drummer/Percussionist)
- **Live URL:** https://aikyam-official.netlify.app
- **Repo:** https://github.com/jobin-j/aikyam
- **Active Branch:** `song-request-dashboard`

### Tech Stack
- React (Create React App)
- SCSS for styling
- Single page — NO react-router
- Hash-based routing added manually (#/request, #/performer, #/queue)
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
│   ├── AikyamSpinner.jsx / .scss      ← Branded spinner component
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

### Brand Tokens (from _variables.scss)
```scss
$saffron:       #FF9933;
$deep-saffron:  #FF6B1A;
$marigold:      #FFA630;
$gold:          #D4AF37;
$bright-gold:   #FFC72C;
$antique-gold:  #C9A227;
$ruby:          #9B111E;
$crimson:       #DC143C;
$vermilion:     #E34234;
$maroon:        #3D0A0A;
$wine:          #1F0303;
$midnight-plum: #2A0A1A;
$ivory:         #FFF8DC;
$cream:         #FBF2D4;
$bronze:        #CD7F32;
$peacock:       #1B5E78;
$font-display:  'Cinzel', 'Times New Roman', serif;
$font-sanskrit: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
$font-body:     'Cormorant Garamond', Georgia, serif;
```

---

## Project 2: Song Request Management System

### Flow
```
QR Code at Venue
      ↓
/#/request  — Audience fills form (song + optional dedication)
      ↓
Success screen — shows real queue position + est. wait
      ↓  [View Live Queue button]
/#/queue  — Public read-only queue (highlights user's own request)

Separately:
/#/performer  — PIN-protected performer dashboard
```

### Hash Routing (in App.jsx)
```js
{view === 'home'      && <YourExistingWebsite />}
{view === 'request'   && <SongRequestForm />}
{view === 'queue'     && <QueueView />}
{view === 'performer' && <PerformerGuard />}
```

---

## Components — ALL COMPLETED ✅

### SongRequestForm.jsx
- 3-step flow: Song Details → Dedication → Success
- Free text inputs, title case enforced via toTitleCase()
- Artist OR Movie name field
- Dedication chips + custom textarea (150 char limit)
- Real queue position from Google Sheets (est. wait = position * 4 mins)
- AikyamSpinner shown while submitting (color: #FF9933)
- Error message on failure — stays on step 2 so user can retry
- Saves request ID to localStorage on success
- "View Live Queue →" button on success screen
- CSS prefix: `sr-*`
- Theme: Light (page bg #E8D5B0, card bg #FFFDF5)

### PerformerDashboard.jsx
- Live queue with auto-polling every 3 seconds
- Now Playing section with spinning disc animation
- Queue rows with ▶ Play, ⊘ Skip action buttons
- Completed list (last 5 only)
- Filter by song or artist
- Stats: pending count, completed count
- loadingId state — disables buttons while action in progress
- AikyamSpinner (color: #D4AF37) shown while updating
- Toast notifications — success=saffron, error=crimson, auto-dismiss 3s
- CSS prefix: `pd-*`
- Theme: Dark (wine bg, maroon card)

### PerformerGuard.jsx
- PIN screen protecting /#/performer
- PIN hardcoded: '2412'
- On success → renders PerformerDashboard
- CSS prefix: `pg-*`
- Uses PerformerDashboard.scss

### QueueView.jsx
- Public read-only queue, auto-polls every 3 seconds
- Highlights user's own request with "Yours!" badge using localStorage ID
- My Request status banner:
  - pending  → shows position in queue
  - playing  → "Now Playing!"
  - completed → "Your song was played!"
  - skipped  → "Sorry, we don't know this one. Try another?" + link to /#/request
- Now Playing section
- Full pending queue list
- "+ Request a Song" button at bottom
- CSS prefix: `qv-*`
- Theme: Light (matches SongRequestForm)

### AikyamSpinner.jsx
- Reusable full-page overlay spinner
- Spins the "A" in Cinzel font
- Accepts `color` prop
- Usage:
  - SongRequestForm:     `<AikyamSpinner color="#FF9933" />`
  - PerformerDashboard:  `<AikyamSpinner color="#D4AF37" />`
  - QueueView:           `<AikyamSpinner color="#FF9933" />`

---

## Backend: Google Sheets via Apps Script ✅

### Setup
- Google Sheet: "AIKYAM Song Requests"
- Columns: id | song | artistOrMovie | dedication | status | timestamp
- Google Apps Script deployed as Web App (Anyone can access)
- Script URL: https://script.google.com/macros/s/AKfycbwWlChcuoGr4dGs0kiFs8CaMR6MC5W6XsNS-ijx8BuhX25MlIKWktqo_r0eUmbcM0RN/exec

### Request statuses
```
pending   → in queue, not yet played
playing   → currently being performed
completed → song was played
skipped   → performer doesn't know the song → triggers apology in QueueView
```

### .env variables
```
REACT_APP_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwWlChcuoGr4dGs0kiFs8CaMR6MC5W6XsNS-ijx8BuhX25MlIKWktqo_r0eUmbcM0RN/exec
REACT_APP_GOOGLE_SHEET_ID=your_sheet_id
```

---

## TODO — Remaining

### 1. Netlify Deployment
- Add env variables to Netlify:
  - REACT_APP_GOOGLE_SCRIPT_URL
  - REACT_APP_GOOGLE_SHEET_ID
- Branch pushed: `song-request-dashboard`
- Preview URL: `https://song-request-dashboard--aikyam-official.netlify.app`
- Test on preview → merge to `main` for production

### 2. QR Code
- URL: `https://aikyam-official.netlify.app/#/request`
- Generate at qrcode-monkey.com
- Colors: foreground `#FF9933`, background `#FFFDF5`
- Print and display at venue

### 3. Merge to main
- After testing on preview URL
- PR: `song-request-dashboard` → `main`
- Merge → auto-deploys to production

---

## Key Decisions Made (don't revisit)
- No Spotify/Saavn API — simple free text inputs
- No googleapis library — doesn't work in browser
- Hash routing — no react-router
- Google Apps Script as backend — free, no server
- Polling every 3 seconds — upgrade to WebSocket later if needed
- PIN hardcoded '2412' for MVP
- localStorage to identify user's request in queue
- Last 5 completed requests shown in performer dashboard
- Est. wait = queuePos * 4 minutes
- CSS prefixes: sr-*, pd-*, pg-*, qv-*, aikyam-spinner

---

## How to Resume

1. Open a new Claude chat
2. Share these two raw GitHub URLs:
   - https://raw.githubusercontent.com/jobin-j/aikyam/song-request-dashboard/AIKYAM_context_may19.md
   - https://raw.githubusercontent.com/jobin-j/aikyam/song-request-dashboard/AIKYAM_design_instructions.md
3. Say: "Here's my project context. Let's continue — I need to deploy to Netlify and generate the QR code."
