# AIKYAM Project Context — Updated May 19, 2026

## Project 1: AIKYAM Band Website

### Band Info
- **Name:** AIKYAM
- **Genre:** Bollywood Fusion Acoustic
- **Members:** Kamal Kishor Vyas (Lead Singer & Acoustic Guitar), Jobin John (Drummer/Percussionist)
- **Live URL:** https://aikyam-official.netlify.app
- **Repo:** https://github.com/jobin-j/aikyam

### Tech Stack
- React (Create React App)
- SCSS for styling
- Single page — NO react-router
- Hash-based routing added manually (#/request, #/performer, etc.)
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
│   ├── SongRequestForm.jsx / .scss   ← NEW (built today)
│   └── PerformerDashboard.jsx / .scss ← TODO tomorrow
├── styles/
│   └── _variables.scss
├── App.jsx
├── index.js
└── index.scss
```

### Brand Tokens (from _variables.scss)
```scss
// Saffron family
$saffron:       #FF9933;
$deep-saffron:  #FF6B1A;
$marigold:      #FFA630;
// Gold family
$gold:          #D4AF37;
$bright-gold:   #FFC72C;
$antique-gold:  #C9A227;
// Ruby / red family
$ruby:          #9B111E;
$crimson:       #DC143C;
$vermilion:     #E34234;
// Background / depth
$maroon:        #3D0A0A;
$wine:          #1F0303;
$midnight-plum: #2A0A1A;
// Highlights
$ivory:         #FFF8DC;
$cream:         #FBF2D4;
$bronze:        #CD7F32;
$peacock:       #1B5E78;
// Typography
$font-display:  'Cinzel', 'Times New Roman', serif;
$font-sanskrit: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
$font-body:     'Cormorant Garamond', Georgia, serif;
```

---

## Project 2: Song Request Management System

### Problem Being Solved
- Audience at venue writes song requests on tissue paper → chaotic, loses sequence
- Dedications (birthdays, anniversaries) get lost
- Staff involvement creates confusion
- Now: Audience scans QR → digital form → Performer sees live queue

### Flow
```
QR Code at Venue
      ↓
/#/request  — Audience fills form (song + optional dedication)
      ↓
Success screen — shows queue position + est. wait
      ↓
/#/queue  — Optional: public read-only queue view (TODO)

Separately:
/#/performer  — PIN-protected performer dashboard (TODO tomorrow)
```

### Hash Routing (added to App.jsx)
```js
const [view, setView] = useState(() => {
  const hash = window.location.hash;
  if (hash.startsWith('#/request'))   return 'request';
  if (hash.startsWith('#/queue'))     return 'queue';
  if (hash.startsWith('#/performer')) return 'performer';
  return 'home';
});

useEffect(() => {
  const onHash = () => {
    const hash = window.location.hash;
    if (hash.startsWith('#/request'))        setView('request');
    else if (hash.startsWith('#/queue'))     setView('queue');
    else if (hash.startsWith('#/performer')) setView('performer');
    else setView('home');
  };
  window.addEventListener('hashchange', onHash);
  return () => window.removeEventListener('hashchange', onHash);
}, []);

// In JSX:
{view === 'home'      && <YourExistingWebsite />}
{view === 'request'   && <SongRequestForm />}
{view === 'queue'     && <QueueView />}       // TODO
{view === 'performer' && <PerformerGuard />}  // TODO tomorrow
```

---

## SongRequestForm — COMPLETED ✅

### File: src/components/SongRequestForm.jsx

**Key decisions:**
- No external song API (Spotify needs Premium, Saavn unreliable)
- Simple free text inputs — song name + artist or movie name
- Title case enforced on all inputs via toTitleCase()
- 3 steps: Song details → Dedication → Success
- Queue position and est. wait are currently HARDCODED (#4, ~15m) — will be real data once backend is built

**State:**
```js
const [step,    setStep]    = useState(1);   // 1, 2, 3
const [songName, setSongName] = useState('');
const [artist,   setArtist]   = useState(''); // artist OR movie name
const [chipSel,  setChipSel]  = useState('');
const [ded,      setDed]      = useState('');
```

**Helper:**
```js
const toTitleCase = str =>
  str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
```

**Submit function (currently logs, needs backend wired up):**
```js
const submit = () => {
  console.log('Request →', { song: songName, artistOrMovie: artist, dedication: ded || null });
  setStep(3);
};
```

**Step flow:**
- Step 1: Song name input + Artist or Movie input (optional) → Next button
- Step 2: Dedication chips (Birthday, Anniversary, Special, Friend) + custom textarea → Send Request
- Step 3: Success — song name, artist, dedication shown + queue pills (#4, ~15m)

**CSS class naming convention:** `sr-*` prefix (sr-page, sr-card, sr-input, etc.)

### File: src/components/SongRequestForm.scss
- Light theme: page bg `#C4956A` (terracotta), card bg `#FFFDF5` (near white)
- All inputs white with strong borders for visibility
- Uses SCSS `@use '../styles/variables' as *`

---

## TODO Tomorrow

### 1. PerformerDashboard.jsx + PerformerDashboard.scss
CSS class prefix to use: `pd-*`

**Features needed:**
- Live queue list (all pending requests in order received)
- Each request shows: song, artist/movie, dedication (if any), timestamp
- Actions per request:
  - ▶ Now Playing — highlights current song
  - ✓ Completed — archives it
  - ⊘ Skip — removes from queue
- Filter by artist/song (text input)
- Stats: pending count, completed count
- Real-time polling every 3 seconds (simple, upgrade to WebSocket later)
- Dark cinematic theme (wine/maroon background, gold accents)

### 2. PerformerGuard.jsx + styles in PerformerDashboard.scss
- Simple PIN screen protecting /#/performer route
- PIN hardcoded for now (e.g. '2412')
- Uses same brand fonts/colors
- CSS class prefix: `pg-*`

```jsx
// Basic structure
const PIN = '2412';
const [input, setInput] = useState('');
const [unlocked, setUnlocked] = useState(false);
const [error, setError] = useState(false);

if (unlocked) return <PerformerDashboard />;
// else show PIN input screen
```

### 3. Backend (Node.js + Express)
**Endpoints needed:**
```
POST /api/requests          — audience submits song request
GET  /api/requests          — performer fetches queue (all pending)
PATCH /api/requests/:id     — update status (now_playing/completed/skipped)
```

**Request data shape:**
```js
{
  id:           auto-generated,
  song:         string,
  artistOrMovie:string (optional),
  dedication:   string (optional),
  status:       'pending' | 'now_playing' | 'completed' | 'skipped',
  timestamp:    Date,
  gigId:        string  // for future multi-gig support
}
```

**Tech:** Node.js + Express + MongoDB or PostgreSQL
**Hosting:** Railway or Render (backend), keep Netlify for frontend

### 4. Wire Up Frontend to Backend
- Replace `console.log` in SongRequestForm `submit()` with real `fetch('/api/requests', ...)`
- Add polling in PerformerDashboard (`setInterval` every 3s calling `GET /api/requests`)
- Replace hardcoded #4 / ~15m with real queue position from API response

### 5. QR Code
- Points to: `https://aikyam-official.netlify.app/#/request`
- Generate at qrcode-monkey.com using saffron/gold brand colors
- Print and display at venue

---

## Scalability Notes (already designed in)
- Add `gigId` to every request from day 1
- Performer creates a "Gig" before the show → gets unique QR per gig
- Multiple performers can share same gigId dashboard
- Phase 2: Add gig creation UI, multi-venue support

## Real-time: Polling vs WebSocket
- **Current plan:** Polling every 3 seconds (simple, works fine for venue scale)
- **Upgrade to WebSocket later:** ~2-3 hours of work, just change one useEffect + add Socket.io to backend
- Don't over-engineer now

---

## How to Resume Tomorrow

1. Open a new Claude chat
2. Paste this entire file content and say:
   **"Here's my project context. Let's continue building AIKYAM Song Request System. Today I want to build the Performer Dashboard and PIN Guard."**
3. Claude will have full context and pick up exactly from here.

---

## Key Decisions Already Made (don't revisit)
- No Spotify API (requires Premium)
- No Saavn API (unreliable)
- Simple free-text inputs for song request
- Hash routing (no react-router)
- Polling over WebSocket for now
- PIN protection for performer route (not full auth for MVP)
- `gigId` in data model from day 1 for future scalability
- CSS class prefixes: `sr-*` for SongRequestForm, `pd-*` for PerformerDashboard, `pg-*` for PerformerGuard
