# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server at http://localhost:3000 with HMR
- `npm run build` — production build to `build/`
- `npm test` — Jest in interactive watch mode (react-scripts default)
- `npm test -- --watchAll=false path/to/file.test.jsx` — run a single test file once (non-watch)
- `npm test -- -t "test name"` — filter by test name

Build/lint/test all flow through `react-scripts` (Create React App 5.0.1). ESLint runs as part of `start`/`build` via the `react-app` + `react-app/jest` configs declared in `package.json`; there is no separate lint script.

## Architecture

This is a single-page React 19 marketing/hero site for "Aikyam" (a Bollywood-fusion acoustic duo). The app currently renders one view — `AikyamHero` — mounted from `App.jsx` via `src/index.js`.

### Styling system

Styling is **Sass (SCSS) with a shared variables file**, not CSS modules or styled-components:

- `src/styles/_variables.scss` is the single source of truth for the design system: the Bollywood color palette (saffron / gold / ruby / wine families), typography stack (Cinzel display, Cormorant Garamond body, Tiro Devanagari Sanskrit), layout, and motion easing.
- That file does **two things at once**: it exports Sass variables (`$saffron`, `$font-display`, etc.) for use in SCSS, AND it declares matching CSS custom properties on `:root` (`--color-saffron`, `--font-display`, etc.) so the same tokens are available at runtime in JS/inline styles/SVGs.
- Component SCSS files `@import '../styles/variables'` to get the Sass variables. Component JSX references the CSS custom properties via `var(--color-*)` — see `AikyamHero.jsx` SVG gradients/strokes for the pattern.
- Global resets and Google Font imports live in `src/index.scss`, which is imported once from `src/index.js`.

When adding a new color, font, or motion token, add it in **both forms** in `_variables.scss` (the `$var` and the `--var` on `:root`) so it's usable from either side.

### Component conventions

- Components live in `src/components/<Name>/` as a `.jsx` + co-located `.scss` pair (e.g. `AikyamHero.jsx` + `AikyamHero.scss`).
- BEM-style class names scoped by component (`aikyam-hero__letter--saffron`, `mandala-ring--gold`) — the variant suffix typically matches a token name in `_variables.scss`, which is what lets `var(--color-${variant})` resolve at render time.
- Decorative SVG/visual sub-pieces (e.g. `CornerOrnament`, `MandalaRing`, `DiamondDivider`) are defined as small local components inside the same file rather than extracted — keep that pattern unless a piece becomes genuinely reusable across components.
- CSS-driven animation is parameterized via inline CSS custom properties (`--petal-index`, `--petal-delay`, etc.) set in JSX style objects and consumed by the SCSS — prefer this over JS-driven animation.

## Band Identity

- Name: AIKYAM (Sanskrit: ऐक्यम् — means "unity, oneness, harmony")
- Genre: Bollywood Fusion / Acoustic / Soulful
- Members:
  - Kamal Kishor Vyas — Lead Singer & Acoustic Guitar
  - Jobin John — Drummer / Percussionist

## Colors
- Saffron: #FF9933
- Ivory: #FFFFF0
- Gold: #FFD700
- Charcoal: #1C1C1C (main background)
- Ruby: #9B111E

## Exact Hero Text (always use this, never placeholder text)
- Small label: "Bollywood Fusion · Acoustic · Soulful"
- Band name: AIKYAM (A=saffron, I=gold, K=ivory, Y=ruby, A=saffron, M=gold)
- Sanskrit: ऐक्यम्
- Badge: "unity · oneness · harmony"
- Tagline: "Where ancient melody meets the modern stage. Two souls. One voice. Infinite rhythm."
- Chips: "Acoustic Bollywood · Live Performances · Soulful Fusion"
<!-- - Buttons: "Discover Our Music" and "Book Us Live" -->
- Bottom line: "Kamal Kishor Vyas & Jobin John — performing across India"

## Sections to Build (in order)
1. Hero
2. About
3. Members
4. Contact
5. Chatbot widget

## Chatbot Widget (build when asked)
- Floating widget, bottom-right corner
- Uses Anthropic Claude API (claude-sonnet-4-20250514)
- Fetches public/gigs.json at runtime, injects into system prompt
- Answers fan questions about upcoming gigs

## v2 Features (do NOT build yet)
- Mood-based song recommender (AI)
