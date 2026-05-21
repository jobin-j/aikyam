import { useState, useRef } from 'react';
import './SongRequestForm.scss';
import { addRequest } from '../services/googleSheets';
import AikyamSpinner from './AikyamSpinner';

const CHIPS = ['Birthday 🎂', 'Anniversary 💑', 'Special ❤️', 'Friend 👯'];

const toTitleCase = str =>
  str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

export default function SongRequestForm() {
  const [step,        setStep]        = useState(1);
  const [songName,    setSongName]    = useState('');
  const [artist,      setArtist]      = useState('');
  const [chipSel,     setChipSel]     = useState('');
  const [ded,         setDed]         = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [queuePos, setQueuePos] = useState(null);
  const inputRef = useRef();

  const chipClick = c => { setChipSel(c); setDed(c); };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await addRequest({
        song:          songName,
        artistOrMovie: artist,
        dedication:    ded || null,
      });
      localStorage.setItem('aikyam_request_id', res.id);
      setQueuePos(res.position);
      setStep(3);
    } catch (err) {
      console.error('Failed to submit:', err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1); setSongName(''); setArtist('');
    setChipSel(''); setDed(''); setSubmitError(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const dotClass = i => step > i ? 'dot done' : step === i ? 'dot active' : 'dot';

  return (
    <>
      {submitting && <AikyamSpinner fullPage color="#FF9933" />}
      <div className="sr-page">
        <div className="sr-card">
          <div className="sr-topbar" />

          <div className="sr-header">
            <h1 className="sr-title">Request a Song</h1>
            <div className="sr-steps">
              {[1, 2, 3].map((n, i) => (
                <span key={n} className="sr-step-wrap">
                  {i > 0 && <span className="sr-step-line" />}
                  <span className={dotClass(n)} />
                </span>
              ))}
            </div>
          </div>

          <div className="sr-body">

            {/* ── Step 1: Song Details ── */}
            {step === 1 && (
              <div className="sr-step">
                <label className="sr-label">Song Name</label>
                <input
                  ref={inputRef}
                  autoFocus
                  className="sr-input"
                  placeholder="e.g. Tum Hi Ho…"
                  value={songName}
                  onChange={e => setSongName(toTitleCase(e.target.value))}
                  onKeyDown={e => e.key === 'Enter' && songName.trim() && setStep(2)}
                />

                <label className="sr-label" style={{ marginTop: '16px' }}>
                  Artist or Movie <span className="sr-optional">— Optional</span>
                </label>
                <input
                  className="sr-input"
                  placeholder="e.g. Arijit Singh or Aashiqui 2…"
                  value={artist}
                  onChange={e => setArtist(toTitleCase(e.target.value))}
                  onKeyDown={e => e.key === 'Enter' && songName.trim() && setStep(2)}
                />

                <div className="sr-btn-row">
                  <button
                    className="sr-btn sr-btn--primary"
                    onClick={() => songName.trim() && setStep(2)}
                    disabled={!songName.trim()}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Dedication ── */}
            {step === 2 && (
              <div className="sr-step">
                <label className="sr-label">
                  Dedication <span className="sr-optional">— Optional</span>
                </label>
                <div className="sr-chips">
                  {CHIPS.map(c => (
                    <div
                      key={c}
                      className={`sr-chip${chipSel === c ? ' sr-chip--sel' : ''}`}
                      onClick={() => chipClick(c)}
                    >
                      {c}
                    </div>
                  ))}
                </div>
                <textarea
                  className="sr-textarea"
                  placeholder="Write your own… e.g. For Priya on her birthday ❤️"
                  value={ded}
                  maxLength={150}
                  onChange={e => { setDed(e.target.value); setChipSel(''); }}
                />
                <div className="sr-charcount">{ded.length} / 150</div>

                {submitError && (
                  <div className="sr-error">
                    Something went wrong. Please try again.
                  </div>
                )}

                <div className="sr-btn-row">
                  <button
                    className="sr-btn sr-btn--primary"
                    onClick={submit}
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Send Request'}
                  </button>
                  <button
                    className="sr-btn sr-btn--ghost"
                    onClick={() => setStep(1)}
                    disabled={submitting}
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Success ── */}
            {step === 3 && (
              <div className="sr-step">
                <div className="sr-success">
                  <div className="sr-success-icon">✨</div>
                  <h2 className="sr-success-title">Request Sent!</h2>
                  <div className="sr-success-card">
                    <div className="sr-success-song">{songName}</div>
                    <div className="sr-success-artist">{artist}</div>
                    {ded && <div className="sr-success-ded">"{ded}"</div>}
                  </div>
                  <div className="sr-pills">
                    <div className="sr-pill">
                      <div className="sr-pill-num">#{queuePos ?? '—'}</div>
                      <div className="sr-pill-label">In Queue</div>
                    </div>
                    <div className="sr-pill">
                      <div className="sr-pill-num">~{queuePos ? queuePos * 4 : '—'}m</div>
                      <div className="sr-pill-label">Est. Wait</div>
                    </div>
                  </div>

                  <a className="sr-btn sr-btn--queue" href="#/queue">
                    View Live Queue →
                  </a>

                  <button className="sr-btn sr-btn--primary" onClick={reset}>
                    Request Another Song
                  </button>
                  <p className="sr-enjoy">Sit back and enjoy the music 🎶</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}