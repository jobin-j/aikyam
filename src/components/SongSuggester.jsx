import React, { useState } from 'react';
import './SongSuggester.scss';
import { callClaude, CLAUDE_MODEL_SMART } from '../services/claudeApi';

import AikyamSpinner from './AikyamSpinner';

const MOOD_CHIPS = [
  { label: 'Pyaar Wala 💕',   value: 'romantic and love' },
  { label: 'Toota Dil 💔',    value: 'sad and emotional' },
  { label: 'Nachle! 🎉',      value: 'party and celebration' },
  { label: 'Purana Gold 🎸',  value: 'classic 90s and old Bollywood hits' },
];

const SYSTEM_PROMPT = `You are a Bollywood music expert helping an audience member at a live acoustic fusion gig by AIKYAM in Bangalore. AIKYAM is a duo — Kamal Kishor Vyas on vocals and acoustic guitar, Jobin John on percussion.

Suggest songs that:
- Match the mood or occasion described
- Are very well-known Bollywood hits (Hindi film songs)
- Work beautifully on acoustic guitar and percussion
- Are singable by a male vocalist
- Span different eras (classic to modern)

STRICT RULES:
- Only suggest songs you are 100% certain about — song name, movie, and year
- Never guess or approximate. Accuracy is critical
- Do NOT include artist/singer name — omit that field entirely
- Respond with ONLY a raw JSON array. No markdown fences, no explanation, nothing else

Format:
[
  { "song": "Song Name", "movie": "Movie Name", "year": "YYYY", "why": "One line reason why this fits the mood" }
]`;

export default function SongSuggester({ onSongSelect, onBack }) {
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood,   setCustomMood]   = useState('');
  const [suggestions,  setSuggestions]  = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  const activeMood = customMood.trim() || selectedMood;

  const getSuggestions = async () => {
    if (!activeMood) return;
    setLoading(true);
    setError('');
    setSuggestions([]);

    try {
      const text = await callClaude({
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Suggest 3 Bollywood songs for this vibe: "${activeMood}"` }],
        model: CLAUDE_MODEL_SMART,
        maxTokens: 1000,
      });
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setSuggestions(parsed);
    } catch (e) {
      setError(e.message || 'Could not fetch suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (value) => {
    setSelectedMood(prev => prev === value ? '' : value);
    setCustomMood('');
    setSuggestions([]);
    setError('');
  };

  const handleCustomChange = (e) => {
    setCustomMood(e.target.value);
    setSelectedMood('');
    setSuggestions([]);
    setError('');
  };

  if (loading) return <AikyamSpinner color="#FF9933" />; 
  
  return (
    <div className="ss-page">
      <div className="ss-card">
        <div className="ss-shimmer" />

        <div className="ss-header">
          <button className="ss-back" onClick={onBack}>← Back</button>
          <p className="ss-eyebrow">AI Recommender</p>
          <h2 className="ss-title">What's the vibe tonight?</h2>
          <p className="ss-sub">Pick a mood or describe the moment</p>
        </div>

        <div className="ss-ornament"><span>✦</span></div>

        <div className="ss-chips">
          {MOOD_CHIPS.map(chip => (
            <button
              key={chip.value}
              className={`ss-chip ${selectedMood === chip.value ? 'ss-chip--active' : ''}`}
              onClick={() => handleChipClick(chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="ss-field">
          <label className="ss-label">Or describe it your way</label>
          <textarea
            className="ss-textarea"
            placeholder="e.g. Something for my wife's birthday, she loves old romantic songs…"
            value={customMood}
            onChange={handleCustomChange}
            rows={3}
            maxLength={200}
          />
        </div>

        <button
          className="ss-btn-primary"
          onClick={getSuggestions}
          disabled={!activeMood || loading}
        >
          {loading ? 'Finding songs…' : '✨ Suggest Songs'}
        </button>

        {error && <p className="ss-error">{error}</p>}

        {suggestions.length > 0 && (
          <div className="ss-results">
            <div className="ss-ornament ss-ornament--results"><span>✦</span></div>
            <p className="ss-results-label">Pick one to request</p>
            {suggestions.map((s, i) => (
              <div key={i} className="ss-suggestion">
                <div className="ss-suggestion-info">
                  <p className="ss-song-name">🎵 {s.song}</p>
                  <p className="ss-song-meta">{s.movie} · {s.year}</p>
                  <p className="ss-song-why">{s.why}</p>
                </div>
                <button
                  className="ss-btn-pick"
                  onClick={() => onSongSelect({ songName: s.song, movie: s.movie })}
                >
                  Pick
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}