import React from 'react';
import './AikyamAbout.scss';

const MandalaGlyph = ({ tone }) => (
  <svg
    className="aikyam-about__pillar-glyph"
    viewBox="0 0 64 64"
    aria-hidden="true"
  >
    <g fill="none" stroke={`var(--color-${tone})`} strokeLinecap="round">
      <circle cx="32" cy="32" r="28" strokeWidth="0.5" strokeDasharray="1 5" opacity="0.7" />
      <circle cx="32" cy="32" r="20" strokeWidth="0.9" />
      <circle cx="32" cy="32" r="10" strokeWidth="0.7" strokeDasharray="2 3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 32 + Math.cos(angle) * 20;
        const y1 = 32 + Math.sin(angle) * 20;
        const x2 = 32 + Math.cos(angle) * 26;
        const y2 = 32 + Math.sin(angle) * 26;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.8" />
        );
      })}
    </g>
    <circle cx="32" cy="32" r="2" fill={`var(--color-${tone})`} />
  </svg>
);

const SoundWaveGlyph = ({ tone }) => (
  <svg
    className="aikyam-about__pillar-glyph"
    viewBox="0 0 64 64"
    aria-hidden="true"
  >
    <g fill="none" stroke={`var(--color-${tone})`} strokeLinecap="round">
      <path d="M28 22 A 14 14 0 0 1 28 42" strokeWidth="1.1" />
      <path d="M34 16 A 20 20 0 0 1 34 48" strokeWidth="0.9" strokeOpacity="0.75" />
      <path d="M40 10 A 26 26 0 0 1 40 54" strokeWidth="0.7" strokeOpacity="0.5" />
    </g>
    <circle cx="20" cy="32" r="3" fill={`var(--color-${tone})`} />
  </svg>
);

const StarOrnamentGlyph = ({ tone }) => (
  <svg
    className="aikyam-about__pillar-glyph"
    viewBox="0 0 64 64"
    aria-hidden="true"
  >
    <g
      fill="none"
      stroke={`var(--color-${tone})`}
      strokeWidth="0.9"
      strokeLinejoin="round"
    >
      <rect x="14" y="14" width="36" height="36" />
      <rect x="14" y="14" width="36" height="36" transform="rotate(45 32 32)" />
      <circle cx="32" cy="32" r="6" strokeWidth="0.7" strokeDasharray="2 3" />
    </g>
    <circle cx="32" cy="32" r="1.8" fill={`var(--color-${tone})`} />
  </svg>
);

const PILLARS = [
  {
    tone: 'saffron',
    Glyph: MandalaGlyph,
    title: 'The Meaning',
    body:
      'Aikyam — ऐक्यम् — is the Sanskrit word for unity. It is the meeting point where two performers, two instruments, and two traditions speak in one voice.',
  },
  {
    tone: 'gold',
    Glyph: SoundWaveGlyph,
    title: 'The Sound',
    body:
      'We strip Bollywood of its orchestra and search for its soul. Film classics, folk anthems, and ghazals reborn through acoustic guitar and hand percussion — intimate enough for a candle-lit room, alive enough to fill a hall.',
  },
  {
    tone: 'ruby',
    Glyph: StarOrnamentGlyph,
    title: 'The Spirit',
    body:
      'Every set is a conversation — between past and present, between classic and contemporary, between us and you. We do not reinterpret a song so much as sit with it, until it sounds the way it always meant to.',
  },
];

const PetalOrnament = () => (
  <svg
    className="aikyam-about__ornament"
    viewBox="0 0 240 80"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="about-ornament-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--color-bright-gold)" stopOpacity="0" />
        <stop offset="50%" stopColor="var(--color-bright-gold)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--color-bright-gold)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <line
      x1="0"
      y1="40"
      x2="240"
      y2="40"
      stroke="url(#about-ornament-grad)"
      strokeWidth="0.8"
    />
    <g transform="translate(120 40)">
      <circle r="14" fill="none" stroke="var(--color-bright-gold)" strokeWidth="0.8" />
      <circle r="6" fill="none" stroke="var(--color-deep-saffron)" strokeWidth="0.8" />
      <g stroke="var(--color-bright-gold)" strokeWidth="0.8" strokeLinecap="round">
        <line x1="-22" y1="0" x2="-16" y2="0" />
        <line x1="16" y1="0" x2="22" y2="0" />
        <line x1="0" y1="-22" x2="0" y2="-16" />
        <line x1="0" y1="16" x2="0" y2="22" />
      </g>
      <circle r="1.6" fill="var(--color-bright-gold)" />
    </g>
  </svg>
);

const AikyamAbout = () => {
  return (
    <section className="aikyam-about" aria-label="About Aikyam">
      <div className="aikyam-about__grain" aria-hidden="true" />

      <div className="aikyam-about__content">
        <p className="aikyam-about__eyebrow">Our Story</p>

        <h2 className="aikyam-about__title">
          <span className="aikyam-about__title-line aikyam-about__title-line--saffron">
            One voice,
          </span>
          <span className="aikyam-about__title-line aikyam-about__title-line--gold">
            One rhythm.
          </span>
        </h2>

        <PetalOrnament />

        <p className="aikyam-about__lede">
          A single pulse shared between strings and skin, voice and breath —
          Bollywood reimagined for the listening room, the courtyard, the open sky.
        </p>

        <div className="aikyam-about__pillars" role="list">
          {PILLARS.map((pillar, i) => {
            const Glyph = pillar.Glyph;
            return (
              <article
                key={pillar.title}
                role="listitem"
                className={`aikyam-about__pillar aikyam-about__pillar--${pillar.tone}`}
                style={{ '--pillar-index': i }}
              >
                <Glyph tone={pillar.tone} />
                <h3 className="aikyam-about__pillar-title">{pillar.title}</h3>
                <p className="aikyam-about__pillar-body">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AikyamAbout;
