# AIKYAM — Project Summary & Design Instructions

---

## What We Have Built

### 1. AIKYAM Band Website (Existing)
A single-page React website for AIKYAM, a Bollywood Fusion acoustic duo based in Bangalore.

**Sections:** Hero, About, Members, Contact
**Live:** https://aikyam-official.netlify.app
**Repo:** https://github.com/jobin-j/aikyam

---

### 2. Song Request Management System (In Progress)

#### Problem Solved
Replaced the chaotic tissue-paper song request system at venues with a clean digital flow.

#### How It Works
```
Audience scans QR at venue
        ↓
Fills song request form (/#/request)
        ↓
Gets acknowledgement + queue position
        ↓
Performer sees live dashboard (/#/performer) — PIN protected
        ↓
Performer plays / skips / completes requests in order
```

#### What's Built
- ✅ Hash-based routing in App.jsx (#/request, #/queue, #/performer)
- ✅ SongRequestForm.jsx — 3-step flow
  - Step 1: Song name + Artist or Movie (optional)
  - Step 2: Dedication (chips + custom text)
  - Step 3: Success screen with queue position
- ✅ Title case enforced on all user inputs
- ✅ AIKYAM brand fully applied (colors + fonts)

#### What's Pending
- ⬜ PerformerDashboard.jsx — live queue with play/skip/complete
- ⬜ PerformerGuard.jsx — PIN screen protecting /#/performer
- ⬜ Backend — Node.js + Express + database
- ⬜ Wire frontend to backend (replace mock data)
- ⬜ QR Code generation for venue

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Create React App) |
| Styling | SCSS |
| Routing | Hash-based (no react-router) |
| Backend (pending) | Node.js + Express |
| Database (pending) | MongoDB or PostgreSQL |
| Hosting | Netlify (frontend), Railway/Render (backend) |

---

## Design Instructions
### For Any New Page, Component or Feature in AIKYAM

---

### 1. Colors
Always use variables from `src/styles/_variables.scss`. Never hardcode hex values.

```scss
// Use these for backgrounds (dark to light)
$wine           // deepest background #1F0303
$maroon         // card backgrounds #3D0A0A
$midnight-plum  // alternative dark bg #2A0A1A

// Use these for text on dark backgrounds
$ivory          // primary text #FFF8DC
$cream          // secondary text #FBF2D4

// Use these for light theme backgrounds
// Page bg:  #C4956A (terracotta — used in SongRequestForm)
// Card bg:  #FFFDF5 (near white — used in SongRequestForm)

// Use these for accents and highlights
$gold           // headings, borders, ornaments #D4AF37
$bright-gold    // gradient highlights #FFC72C
$antique-gold   // gradient ends #C9A227
$saffron        // primary buttons, active states #FF9933
$deep-saffron   // button gradients #FF6B1A
$ruby           // titles on light bg, dedications, special #9B111E
$crimson        // dedication text, error states #DC143C
```

**Color Role Guide:**
- `$gold` / `$bright-gold` → Logo, headings, borders on dark backgrounds
- `$saffron` / `$deep-saffron` → Primary CTA buttons, active states, hover glows
- `$ruby` → Page/section titles on light backgrounds, special/emotional moments
- `$crimson` → Dedication text, error messages
- `$ivory` / `$cream` → Body text on dark backgrounds
- `$maroon` → Body text on light backgrounds
- `$wine` → Deep dark backgrounds (performer dashboard)
- `#C4956A` → Page background for light-theme pages (audience-facing)
- `#FFFDF5` → Card background for light-theme pages

---

### 2. Typography
Always use variables from `src/styles/_variables.scss`. Never use generic fonts.

```scss
$font-display:  'Cinzel', 'Times New Roman', serif;
$font-sanskrit: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
$font-body:     'Cormorant Garamond', Georgia, serif;
```

**Font Role Guide:**

| Font | Use for | Size range |
|------|---------|-----------|
| `$font-display` (Cinzel) | Page titles, section headings, nav logo, labels, buttons, stat numbers | 9px–28px |
| `$font-sanskrit` (Tiro Devanagari) | Nav tagline, decorative Sanskrit text, sub-branding | 10px–13px |
| `$font-body` (Cormorant Garamond) | All body text, song names, artist names, lyrics, dedications, subtitles | 11px–19px |

**Typography Rules:**
- Cinzel labels → always `uppercase`, `letter-spacing: 2–4px`, `font-weight: 600–700`
- Cormorant Garamond body → often `font-style: italic` for subtitles, song names, dedications
- Never use sans-serif fonts (no Inter, Roboto, DM Sans etc.) — breaks brand consistency
- Minimum readable size: `11px` for labels, `13px` for body, `15px` for inputs

---

### 3. Component Styling Rules

**Border radius:** Always `2px` or `3px` — sharp, architectural, not rounded
**Borders:** `1px` or `1.5px solid` — subtle but present
**Box shadows:** Layered, warm-toned:
```scss
// Light theme card
box-shadow: 0 8px 48px rgba($maroon, .35);

// Dark theme card
box-shadow: 0 28px 60px rgba(0,0,0,.55);
```

**Buttons:**
```scss
// Primary — always saffron gradient
background: linear-gradient(135deg, $saffron, $deep-saffron);
color: $wine; // dark text on saffron
font-family: $font-display;
letter-spacing: 2.5px;
text-transform: uppercase;
border-radius: 2px;

// Ghost — always transparent with subtle border
background: transparent;
border: 1px solid rgba($maroon, .2); // light theme
// or
border: 1px solid rgba($gold, .2);   // dark theme
```

**Inputs:**
```scss
// Light theme
background: #FFFFFF;
border: 1.5px solid rgba($maroon, .35);
color: $maroon;
font-family: $font-body;
font-size: 17px;

// Dark theme
background: rgba($ivory, .05);
border: 1px solid rgba($gold, .22);
color: $ivory;
font-family: $font-body;
```

**Labels (all caps Cinzel):**
```scss
font-family: $font-display;
font-size: 9px–11px;
font-weight: 600;
letter-spacing: 2.5px;
text-transform: uppercase;
```

---

### 4. Animations
Use these standard keyframes — define them at top of each SCSS file:

```scss
// Page/step entrance
@keyframes [prefix]-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

// Shimmer bar (top of card)
@keyframes [prefix]-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

// Card ambient glow
@keyframes [prefix]-glow {
  0%, 100% { box-shadow: 0 0 24px rgba($maroon, .18); }
  50%       { box-shadow: 0 0 40px rgba($gold, .2); }
}

// Breathing (success icons, decorative elements)
@keyframes [prefix]-breathe {
  0%, 100% { opacity: .75; }
  50%       { opacity: 1; }
}
```

**Shimmer top bar** — use on every card:
```scss
.card-topbar {
  height: 3px;
  background: linear-gradient(90deg, $ruby, $saffron, $gold, $saffron, $ruby);
  background-size: 200% auto;
  animation: shimmer 4s linear infinite;
}
```

---

### 5. CSS Class Naming Convention
Use a short component-specific prefix for all classes to avoid conflicts.

| Component | Prefix | Example |
|-----------|--------|---------|
| SongRequestForm | `sr-` | `.sr-card`, `.sr-input` |
| PerformerDashboard | `pd-` | `.pd-card`, `.pd-queue` |
| PerformerGuard (PIN) | `pg-` | `.pg-card`, `.pg-input` |
| QueueView | `qv-` | `.qv-row`, `.qv-status` |
| New components | Pick 2-3 letter prefix | Always kebab-case |

---

### 6. Theme Guide — When to Use Dark vs Light

| Page/Screen | Theme | Who sees it |
|-------------|-------|-------------|
| `/#/request` — Song Request Form | **Light** (terracotta bg, white card) | Audience at venue |
| `/#/queue` — Public Queue | **Light** | Audience at venue |
| `/#/performer` — Dashboard | **Dark** (wine bg, maroon card) | Performer on stage/backstage |
| `/#/performer` — PIN Guard | **Dark** | Performer |
| Main website | Existing dark cinematic | Everyone |

**Reasoning:** Audience uses it in a bright venue → light theme is easier to read. Performer uses it in a dim stage environment → dark theme reduces glare.

---

### 7. Ornament Divider
Use between sections as a decorative separator — signature AIKYAM element:

```scss
.ornament {
  display: flex;
  align-items: center;
  gap: 10px;
  color: $gold;
  opacity: .45;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, $gold);
  }
  &::after { background: linear-gradient(90deg, $gold, transparent); }

  span { font-size: 12px; flex-shrink: 0; }
}

// JSX usage
<div className="ornament"><span>✦</span></div>
```

---

### 8. SCSS File Structure
Every new component follows this order:

```scss
@use '../styles/variables' as *;

// 1. Animations (keyframes)
// 2. Page/wrapper styles
// 3. Card styles
// 4. Top shimmer bar
// 5. Header section
// 6. Body/content sections
// 7. Individual elements (inputs, buttons, labels)
// 8. Hover/focus/active states
// 9. Responsive (@media max-width: 480px)
```

---

### 9. Checklist for Every New Component

Before considering a component complete:

- [ ] Uses `@use '../styles/variables' as *` — no hardcoded hex values
- [ ] Uses `$font-display`, `$font-body`, `$font-sanskrit` — no other fonts
- [ ] Has a shimmer top bar on cards
- [ ] Has `sr-fade-up` (or equivalent) entrance animation
- [ ] Primary button uses saffron gradient
- [ ] All labels are Cinzel, uppercase, letter-spaced
- [ ] Inputs have visible borders and focus states
- [ ] Mobile responsive at 480px breakpoint
- [ ] CSS classes use component prefix (sr-, pd-, pg-, etc.)
- [ ] Light theme for audience-facing, dark theme for performer-facing
