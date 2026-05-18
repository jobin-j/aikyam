import React from 'react';
import './AikyamHero.scss';

const LETTERS = [
  { char: 'A', tone: 'saffron' },
  { char: 'I', tone: 'gold' },
  { char: 'K', tone: 'ivory' },
  { char: 'Y', tone: 'ruby' },
  { char: 'A', tone: 'saffron' },
  { char: 'M', tone: 'gold' },
];

const CHIPS = ['Acoustic Bollywood', 'Live Performances', 'Soulful Fusion'];

const PETALS = Array.from({ length: 14 });

const CornerOrnament = ({ position }) => (
  <svg
    className={`aikyam-hero__corner aikyam-hero__corner--${position}`}
    viewBox="0 0 160 160"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`corner-grad-${position}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--color-bright-gold)" />
        <stop offset="55%" stopColor="var(--color-gold)" />
        <stop offset="100%" stopColor="var(--color-deep-saffron)" />
      </linearGradient>
    </defs>
    <g
      fill="none"
      stroke={`url(#corner-grad-${position})`}
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M4 4 L4 70 Q4 4 70 4" />
      <path d="M14 14 L14 60 Q14 14 60 14" />
      <path d="M26 26 Q26 26 52 26" />
      <path d="M26 26 Q26 52 26 52" />
      <circle cx="26" cy="26" r="5" />
      <path d="M40 6 Q48 22 64 14" />
      <path d="M6 40 Q22 48 14 64" />
      <path d="M70 4 Q72 18 86 18" />
      <path d="M4 70 Q18 72 18 86" />
    </g>
    <g fill={`url(#corner-grad-${position})`}>
      <circle cx="86" cy="18" r="2.2" />
      <circle cx="18" cy="86" r="2.2" />
      <circle cx="40" cy="40" r="1.6" />
    </g>
  </svg>
);

const MandalaRing = ({ variant, radius, petals, strokeWidth = 1 }) => {
  const cx = 200;
  const cy = 200;
  const angleStep = 360 / petals;
  const petalLen = radius * 0.18;

  return (
    <g className={`mandala-ring mandala-ring--${variant}`}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={`var(--color-${variant})`}
        strokeWidth={strokeWidth}
        strokeOpacity="0.55"
        strokeDasharray="2 6"
      />
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * angleStep * Math.PI) / 180;
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;
        const x2 = cx + Math.cos(angle) * (radius + petalLen);
        const y2 = cy + Math.sin(angle) * (radius + petalLen);
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`var(--color-${variant})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <circle
              cx={x2}
              cy={y2}
              r={1.6}
              fill={`var(--color-${variant})`}
              opacity="0.9"
            />
          </g>
        );
      })}
    </g>
  );
};

const DiamondDivider = () => (
  <div className="aikyam-hero__divider" aria-hidden="true">
    <span className="aikyam-hero__divider-line" />
    <svg className="aikyam-hero__divider-jewel" viewBox="0 0 40 40">
      <polygon
        points="20,2 38,20 20,38 2,20"
        fill="none"
        stroke="var(--color-bright-gold)"
        strokeWidth="1.2"
      />
      <polygon
        points="20,8 32,20 20,32 8,20"
        fill="var(--color-ruby)"
        stroke="var(--color-bright-gold)"
        strokeWidth="0.8"
      />
      <circle cx="20" cy="20" r="2.2" fill="var(--color-bright-gold)" />
    </svg>
    <span className="aikyam-hero__divider-line" />
  </div>
);

const AikyamHero = () => {
  return (
    <section className="aikyam-hero" aria-label="Aikyam">
      <div className="aikyam-hero__vignette" aria-hidden="true" />
      <div className="aikyam-hero__grain" aria-hidden="true" />

      <svg
        className="aikyam-hero__mandala"
        viewBox="0 0 400 400"
        aria-hidden="true"
      >
        <MandalaRing variant="gold" radius={180} petals={48} strokeWidth={0.8} />
        <MandalaRing variant="bright-gold" radius={140} petals={24} strokeWidth={1} />
        <MandalaRing variant="saffron" radius={100} petals={16} strokeWidth={1.2} />
        <MandalaRing variant="ruby" radius={66} petals={12} strokeWidth={1} />
        <circle
          cx="200"
          cy="200"
          r="36"
          fill="none"
          stroke="var(--color-bright-gold)"
          strokeWidth="0.6"
          strokeDasharray="1 4"
        />
      </svg>

      <div className="aikyam-hero__petals" aria-hidden="true">
        {PETALS.map((_, i) => (
          <span
            key={i}
            className="aikyam-hero__petal"
            style={{
              '--petal-index': i,
              '--petal-left': `${(i * 73) % 100}%`,
              '--petal-delay': `${(i * 1.3) % 12}s`,
              '--petal-duration': `${14 + ((i * 7) % 12)}s`,
              '--petal-scale': `${0.5 + ((i * 17) % 10) / 10}`,
            }}
          />
        ))}
      </div>

      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <div className="aikyam-hero__content">
        <p className="aikyam-hero__eyebrow">Bollywood Fusion · Acoustic · Soulful</p>

        <DiamondDivider />

        <h1 className="aikyam-hero__title" aria-label="Aikyam">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className={`aikyam-hero__letter aikyam-hero__letter--${letter.tone}`}
              style={{ '--letter-index': i }}
            >
              {letter.char}
            </span>
          ))}
        </h1>

        <p className="aikyam-hero__sanskrit" lang="sa">
          ऐक्यम्
        </p>

        <span className="aikyam-hero__meaning">unity · oneness · harmony</span>

        <DiamondDivider />

        <p className="aikyam-hero__tagline">
          Where ancient melody meets the modern stage. Two souls. One voice. Infinite rhythm.
        </p>

        <div className="aikyam-hero__chips" role="list">
          {CHIPS.map((chip) => (
            <span key={chip} className="aikyam-hero__chip" role="listitem">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <p className="aikyam-hero__members">
        Kamal Kishor Vyas &amp; Jobin John — performing across India
      </p>
    </section>
  );
};

export default AikyamHero;
