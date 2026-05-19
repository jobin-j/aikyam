import React from 'react';
import './AikyamMembers.scss';

const MEMBERS = [
  {
    name: 'Kamal Kishore Vyas',
    initials: 'KKV',
    role: 'Lead Singer · Acoustic Guitar',
    sanskrit: 'स्वर',
    sanskritLabel: 'svara — voice',
    tone: 'saffron',
    instrument: 'guitar',
    bio:
      'Carries the melody. A voice shaped by film classics and folk tradition, paired with the warm intimacy of a single acoustic guitar.',
  },
  {
    name: 'Jobin John',
    initials: 'JJ',
    role: 'Drummer · Percussionist',
    sanskrit: 'ताल',
    sanskritLabel: 'tāla — rhythm',
    tone: 'ruby',
    instrument: 'drum',
    bio:
      'Grounds the pulse. Drums, cajón, and hand percussion that move easily between Bollywood swing and South-Indian taal.',
  },
];

const PortraitMedallion = ({ initials, sanskrit, tone }) => (
  <svg
    className="aikyam-members__medallion"
    viewBox="0 0 240 240"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id={`medallion-fill-${tone}`} cx="50%" cy="40%" r="65%">
        <stop offset="0%" stopColor="var(--color-maroon)" stopOpacity="0.9" />
        <stop offset="70%" stopColor="#0d0606" stopOpacity="1" />
        <stop offset="100%" stopColor="#050202" stopOpacity="1" />
      </radialGradient>
      <linearGradient id={`medallion-ring-${tone}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--color-bright-gold)" />
        <stop offset="55%" stopColor={`var(--color-${tone})`} />
        <stop offset="100%" stopColor="var(--color-antique-gold)" />
      </linearGradient>
    </defs>

    <circle cx="120" cy="120" r="112" fill={`url(#medallion-fill-${tone})`} />

    <circle
      cx="120"
      cy="120"
      r="112"
      fill="none"
      stroke={`url(#medallion-ring-${tone})`}
      strokeWidth="1.6"
    />
    <circle
      cx="120"
      cy="120"
      r="104"
      fill="none"
      stroke={`url(#medallion-ring-${tone})`}
      strokeWidth="0.7"
      strokeOpacity="0.7"
    />
    <circle
      cx="120"
      cy="120"
      r="96"
      fill="none"
      stroke="var(--color-bright-gold)"
      strokeWidth="0.4"
      strokeDasharray="1 5"
      strokeOpacity="0.7"
    />

    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const r1 = 108;
      const r2 = 116;
      const x1 = 120 + Math.cos(angle) * r1;
      const y1 = 120 + Math.sin(angle) * r1;
      const x2 = 120 + Math.cos(angle) * r2;
      const y2 = 120 + Math.sin(angle) * r2;
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--color-bright-gold)"
          strokeWidth="0.6"
          strokeOpacity="0.55"
        />
      );
    })}

    <text
      x="120"
      y="118"
      textAnchor="middle"
      fontFamily="var(--font-display)"
      fontWeight="600"
      fontSize="46"
      letterSpacing="6"
      fill={`url(#medallion-ring-${tone})`}
    >
      {initials}
    </text>

    <text
      x="120"
      y="160"
      textAnchor="middle"
      fontFamily="var(--font-sanskrit)"
      fontSize="22"
      fill="var(--color-bright-gold)"
      opacity="0.85"
    >
      {sanskrit}
    </text>
  </svg>
);

const InstrumentGlyph = ({ type }) => {
  if (type === 'guitar') {
    return (
      <svg className="aikyam-members__glyph" viewBox="0 0 80 32" aria-hidden="true">
        <g
          fill="none"
          stroke="var(--color-bright-gold)"
          strokeWidth="1"
          strokeLinecap="round"
        >
          <ellipse cx="54" cy="16" rx="14" ry="11" />
          <circle cx="54" cy="16" r="4" />
          <ellipse cx="34" cy="16" rx="7" ry="6" />
          <rect x="10" y="14.5" width="18" height="3" rx="1" />
          <line x1="6" y1="13" x2="10" y2="13" />
          <line x1="6" y1="19" x2="10" y2="19" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="aikyam-members__glyph" viewBox="0 0 80 32" aria-hidden="true">
      <g
        fill="none"
        stroke="var(--color-bright-gold)"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <ellipse cx="28" cy="9" rx="11" ry="3.5" />
        <path d="M17 9 L19 24 Q28 28 37 24 L39 9" />
        <ellipse cx="56" cy="13" rx="8" ry="2.6" />
        <path d="M48 13 L50 24 Q56 26 62 24 L64 13" />
        <line x1="42" y1="11" x2="46" y2="13" />
      </g>
    </svg>
  );
};

const SectionOrnament = () => (
  <svg
    className="aikyam-members__ornament"
    viewBox="0 0 280 60"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="members-orn-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--color-bright-gold)" stopOpacity="0" />
        <stop offset="50%" stopColor="var(--color-bright-gold)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--color-bright-gold)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <line
      x1="0"
      y1="30"
      x2="280"
      y2="30"
      stroke="url(#members-orn-grad)"
      strokeWidth="0.8"
    />
    <g transform="translate(140 30)">
      <polygon
        points="0,-14 12,0 0,14 -12,0"
        fill="none"
        stroke="var(--color-bright-gold)"
        strokeWidth="0.9"
      />
      <polygon
        points="0,-7 6,0 0,7 -6,0"
        fill="var(--color-ruby)"
        stroke="var(--color-bright-gold)"
        strokeWidth="0.6"
      />
      <circle r="1.8" fill="var(--color-bright-gold)" />
    </g>
  </svg>
);

const AikyamMembers = () => {
  return (
    <section className="aikyam-members" aria-label="The Performers">
      <div className="aikyam-members__grain" aria-hidden="true" />

      <div className="aikyam-members__content">
        <p className="aikyam-members__eyebrow">The Duo</p>
        <h2 className="aikyam-members__title">The Performers</h2>

        <SectionOrnament />

        <p className="aikyam-members__intro">
          Two artists. Two instruments. One unbroken conversation.
        </p>

        <div className="aikyam-members__grid" role="list">
          {MEMBERS.map((member, i) => (
            <article
              key={member.name}
              role="listitem"
              className={`aikyam-members__card aikyam-members__card--${member.tone}`}
              style={{ '--member-index': i }}
            >
              <PortraitMedallion
                initials={member.initials}
                sanskrit={member.sanskrit}
                tone={member.tone}
              />

              <p className="aikyam-members__sanskrit-label" lang="sa">
                {member.sanskritLabel}
              </p>

              <h3 className="aikyam-members__name">{member.name}</h3>
              <p className="aikyam-members__role">{member.role}</p>

              <InstrumentGlyph type={member.instrument} />

              <p className="aikyam-members__bio">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AikyamMembers;
