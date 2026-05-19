import React from 'react';
import './AikyamContact.scss';

const WHATSAPP_URL = 'https://wa.me/+919916697933?text=Hi%20Aikyam%2C%20I%20would%20like%20to%20inquire%20about%20booking%20your%20band%20for%20my%20event.';

const PetalOrnament = () => (
  <svg
    className="aikyam-contact__ornament"
    viewBox="0 0 240 60"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="contact-ornament-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--color-bright-gold)" stopOpacity="0" />
        <stop offset="50%" stopColor="var(--color-bright-gold)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--color-bright-gold)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <line
      x1="0"
      y1="30"
      x2="240"
      y2="30"
      stroke="url(#contact-ornament-grad)"
      strokeWidth="0.8"
    />
    <g transform="translate(120 30)">
      <polygon
        points="0,-12 10,0 0,12 -10,0"
        fill="none"
        stroke="var(--color-bright-gold)"
        strokeWidth="0.9"
      />
      <polygon
        points="0,-6 5,0 0,6 -5,0"
        fill="var(--color-ruby)"
        stroke="var(--color-bright-gold)"
        strokeWidth="0.6"
      />
      <circle r="1.6" fill="var(--color-bright-gold)" />
    </g>
  </svg>
);

const WhatsAppGlyph = () => (
  <svg
    className="aikyam-contact__cta-icon"
    viewBox="0 0 32 32"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M16.04 4C9.4 4 4 9.4 4 16.04c0 2.12.55 4.18 1.6 6L4 28l6.13-1.6a12 12 0 0 0 5.91 1.55h.01c6.64 0 12.04-5.4 12.04-12.04 0-3.21-1.25-6.23-3.52-8.5A11.96 11.96 0 0 0 16.04 4Zm0 21.92h-.01a9.93 9.93 0 0 1-5.06-1.39l-.36-.21-3.64.96.97-3.55-.24-.37a9.93 9.93 0 0 1-1.52-5.32c0-5.5 4.48-9.98 9.98-9.98 2.66 0 5.17 1.04 7.06 2.93a9.93 9.93 0 0 1 2.93 7.06c0 5.5-4.48 9.98-10.11 9.98Zm5.47-7.47c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49a9.1 9.1 0 0 1-1.68-2.08c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.52l-.58-.01c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.55.72.31 1.27.5 1.71.64.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
    />
  </svg>
);

const AikyamContact = () => {
  return (
    <section className="aikyam-contact" aria-label="Book Aikyam">
      <div className="aikyam-contact__grain" aria-hidden="true" />

      <div className="aikyam-contact__content">
        {/* <p className="aikyam-contact__eyebrow">Bookings</p> */}

        <h2 className="aikyam-contact__title">Book AIKYAM</h2>

        <PetalOrnament />

        <p className="aikyam-contact__subtitle">
          Let&rsquo;s make your event unforgettable
        </p>

        <p className="aikyam-contact__intro">
          Have a celebration coming up? A wedding, a corporate night, a college
          fest? AIKYAM brings the soul of Bollywood live to your stage.
        </p>

        <a
          className="aikyam-contact__cta"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppGlyph />
          <span>Message us on WhatsApp</span>
        </a>

        <p className="aikyam-contact__note">
          We usually respond within a few hours
        </p>
      </div>
    </section>
  );
};

export default AikyamContact;
