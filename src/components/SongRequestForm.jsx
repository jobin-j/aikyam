import { useState, useRef } from 'react';
import './SongRequestForm.scss';
import { addRequest, getRequests } from '../services/googleSheets';
import AikyamSpinner from './AikyamSpinner';
import SongSuggester from './SongSuggester';

const CHIPS = ['Birthday 🎂', 'Anniversary 💑', 'Special ❤️', 'Friend 👯'];
const MAX_REQUESTS = 3;

const toTitleCase = str =>
  str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

const getSessionKey = () => {
  let key = localStorage.getItem('aikyam_session');
  if (!key) {
    key = Date.now().toString(36);
    localStorage.setItem('aikyam_session', key);
  }
  return key;
};

const getMyRequestIds = () =>
  JSON.parse(localStorage.getItem('aikyam_request_ids') || '[]');

const addMyRequestId = (id) => {
  const existing = getMyRequestIds();
  existing.push(id);
  localStorage.setItem('aikyam_request_ids', JSON.stringify(existing));
};

export default function SongRequestForm() {
  const [step,        setStep]        = useState(1);
  const [songName,    setSongName]    = useState('');
  const [chipSel,     setChipSel]     = useState('');
  const [ded,         setDed]         = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [queuePos,    setQueuePos]    = useState(null);
  const [showSuggester, setShowSuggester] = useState(false);
  const inputRef = useRef();

  const chipClick = c => { setChipSel(c); setDed(c); };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError('');

    try {
      // Check pending request count before submitting
      const allRequests = await getRequests();
      const myIds = getMyRequestIds();
      const myPending = allRequests.filter(r =>
        myIds.includes(r.id) && r.status === 'pending'
      );

      if (myPending.length >= MAX_REQUESTS) {
        setSubmitError(`You've already requested ${MAX_REQUESTS} songs. Wait for one to play first!`);
        setSubmitting(false);
        return;
      }

      const res = await addRequest({
        song: songName,
        dedication: ded || null,
        sessionKey: getSessionKey(),
      });

      addMyRequestId(res.id);
      setQueuePos(res.position);
      setStep(3);
    } catch (err) {
      console.error('Failed to submit:', err);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1); setSongName('');
    setChipSel(''); setDed(''); setSubmitError('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const dotClass = i => step > i ? 'dot done' : step === i ? 'dot active' : 'dot';

  const handleAISongSelect = ({ songName, movie }) => {
    setSongName(toTitleCase(`${songName} - ${movie}`));
    setShowSuggester(false);
  };

  if (showSuggester) {
    return (
      <SongSuggester
        onSongSelect={handleAISongSelect}
        onBack={() => setShowSuggester(false)}
      />
    );
  }

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
                <label className="sr-label">What would you like to hear?</label>
                <input
                  ref={inputRef}
                  autoFocus
                  className="sr-input"
                  placeholder="e.g. Tum Hi Ho, Any Aashiqui 2 song…"
                  value={songName}
                  onChange={e => setSongName(toTitleCase(e.target.value))}
                  onKeyDown={e => e.key === 'Enter' && songName.trim() && setStep(2)}
                />
                <div className="sr-ai-divider"><span>or</span></div>
                <button
                  className="sr-btn-ai"
                  onClick={() => setShowSuggester(true)}
                >
                  ✨ Suggest me a song
                </button>
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
                  <div className="sr-error">{submitError}</div>
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