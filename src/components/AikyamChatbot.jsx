import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AikyamChatbot.scss';

const SHEET_BASE_PUB = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbZJKItcKbJ6XOev-EyCgbhj2UnpYjnopDk26ZX7ZI59HD34m-hcYoSjdLdu45HPwwK80VJPEhSHGM/pub';

const SHEET_URLS = {
  Band_Info: `${SHEET_BASE_PUB}?gid=0&single=true&output=csv`,
  Index:     `${SHEET_BASE_PUB}?gid=109174446&single=true&output=csv`,
};

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

const OPENING_MESSAGE =
  "Namaste! 🎵 I am AIKYAM's virtual assistant. Ask me about our upcoming gigs, band members, or anything about our music!";

const SYSTEM_PROMPT_PREFIX =
  "You are AIKYAM's virtual assistant. AIKYAM is a Bollywood fusion acoustic duo based in India. You MUST answer ONLY from the data provided below. Do NOT use any general knowledge or make assumptions. If a gig schedule sheet exists but has no rows of data, say 'No shows are scheduled for that month yet.' If the answer is in the data below, use it. For any booking enquiries or unavailable information, direct them to WhatsApp at +917023384619. Be warm and friendly.";

async function fetchUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
  return res.text();
}

function parseIndex(indexCsv) {
  const lines = indexCsv
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  // Skip header row
  return lines.slice(1).map((line) => {
    const cols = line.split(',');
    const name = (cols[0] || '').replace(/"/g, '').trim();
    const gid  = (cols[1] || '').replace(/"/g, '').trim();
    return { name, gid };
  }).filter((r) => r.name && r.gid);
}

// function getMonthTabsFromIndex(indexCsv) {
//   const lines = indexCsv
//     .split(/\r?\n/)
//     .map((l) => l.trim())
//     .filter(Boolean);
//   if (lines.length === 0) return [];
//   return lines
//     .slice(1)
//     .map((line) => {
//       const quoted = line.match(/^"([^"]*)"/);
//       if (quoted) return quoted[1].trim();
//       return (line.split(',')[0] || '').trim();
//     })
//     .filter(Boolean);
// }

async function loadAikyamContext() {
  let bandInfoCsv = '';
  let tabs = [];

  console.log('Fetching Band_Info...');
  try {
    bandInfoCsv = await fetchUrl(SHEET_URLS.Band_Info);
    console.log('Band_Info fetched successfully');
  } catch (err) {
    console.error('Band_Info failed:', err);
  }

  console.log('Fetching Index...');
  try {
    const indexCsv = await fetchUrl(SHEET_URLS.Index);
    tabs = parseIndex(indexCsv);
    console.log('Index tabs found:', tabs);
  } catch (err) {
    console.error('Index failed:', err);
  }

  const monthResults = [];
  for (const tab of tabs) {
    const url = `${SHEET_BASE_PUB}?gid=${tab.gid}&single=true&output=csv`;
    console.log(`Fetching ${tab.name}...`);
    try {
      const csv = await fetchUrl(url);
      monthResults.push(`## ${tab.name}\n${csv.trim()}`);
      console.log(`${tab.name} fetched successfully`);
    } catch (err) {
      console.error(`${tab.name} failed:`, err);
      monthResults.push(`## ${tab.name}\n(schedule unavailable)`);
    }
  }

  console.log('All data loaded, opening chat');

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return [
    SYSTEM_PROMPT_PREFIX,
    `Today's date is: ${today}. Use this to answer questions like "this month", "this week", "upcoming shows" etc.`,
    '',
    'BAND INFO:',
    bandInfoCsv.trim() || '(unavailable)',
    '',
    'GIG SCHEDULE:',
    monthResults.length > 0 ? monthResults.join('\n\n') : '(unavailable)',
  ].join('\n');
}

async function callClaude(systemPrompt, messages) {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing REACT_APP_ANTHROPIC_API_KEY');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const textBlock = (data.content || []).find((b) => b.type === 'text');
  return textBlock ? textBlock.text : '';
}

const MusicNoteIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20 3.5c0-.46-.41-.82-.86-.75l-9 1.5A.75.75 0 0 0 9.5 5v9.55a4 4 0 1 0 1.5 3.11V8.13l8-1.33v6.3a4 4 0 1 0 1.5 3.11V3.5Z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"
    />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M3 20v-6l13-2-13-2V4l19 8-19 8Z" />
  </svg>
);

const TypingDots = () => (
  <span className="aikyam-chatbot__typing" aria-label="Assistant is typing">
    <span />
    <span />
    <span />
  </span>
);

const Spinner = () => (
  <span
    className="aikyam-chatbot__spinner"
    role="status"
    aria-label="Loading"
  />
);

const AikyamChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (messages.length > 0) return;
    setMessages([{ role: 'assistant', content: OPENING_MESSAGE }]);
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (!isOpen || systemPrompt) return;
    let cancelled = false;
    setIsLoadingSheets(true);
    setError(null);
    loadAikyamContext()
      .then((prompt) => {
        if (cancelled) return;
        setSystemPrompt(prompt);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingSheets(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, systemPrompt]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isLoadingSheets]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isLoadingSheets) {
      inputRef.current.focus();
    }
  }, [isOpen, isLoadingSheets]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping || isLoadingSheets || !systemPrompt) return;

    const userMessage = { role: 'user', content: text };
    const apiMessages = [...messages, userMessage]
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const reply = await callClaude(systemPrompt, apiMessages);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply || '...' },
      ]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, isLoadingSheets, systemPrompt, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`aikyam-chatbot ${
        isOpen ? 'aikyam-chatbot--open' : 'aikyam-chatbot--closed'
      }`}
    >
      {isOpen && (
        <div className="aikyam-chatbot__panel" role="dialog" aria-label="Aikyam assistant">
          <header className="aikyam-chatbot__header">
            <div className="aikyam-chatbot__header-text">
              <p className="aikyam-chatbot__eyebrow">AIKYAM</p>
              <h3 className="aikyam-chatbot__title">Virtual Assistant</h3>
            </div>
            <button
              type="button"
              className="aikyam-chatbot__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="aikyam-chatbot__messages" aria-live="polite">
            {isLoadingSheets && (
              <div className="aikyam-chatbot__loading">
                <Spinner />
                <span>Tuning in to the schedule…</span>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`aikyam-chatbot__message aikyam-chatbot__message--${msg.role}`}
              >
                {msg.content}
              </div>
            ))}

            {isTyping && (
              <div className="aikyam-chatbot__message aikyam-chatbot__message--assistant aikyam-chatbot__message--typing">
                <TypingDots />
              </div>
            )}

            {error && (
              <div className="aikyam-chatbot__error" role="alert">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="aikyam-chatbot__input-row"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="aikyam-chatbot__input"
              placeholder={
                isLoadingSheets ? 'Loading…' : 'Ask about gigs, the band…'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoadingSheets || isTyping}
            />
            <button
              type="submit"
              className="aikyam-chatbot__send"
              disabled={
                !input.trim() || isLoadingSheets || isTyping || !systemPrompt
              }
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="aikyam-chatbot__toggle"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Chat with Aikyam'}
        aria-expanded={isOpen}
      >
        {isOpen ? <CloseIcon /> : <MusicNoteIcon />}
      </button>
    </div>
  );
};

export default AikyamChatbot;
