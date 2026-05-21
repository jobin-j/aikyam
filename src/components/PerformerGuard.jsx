import { useState } from 'react';
import PerformerDashboard from './PerformerDashboard';
import './PerformerGuard.scss';

const PIN = '2412';

export default function PerformerGuard() {
  const [input,    setInput]    = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error,    setError]    = useState(false);

  const attempt = () => {
    if (input === PIN) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  if (unlocked) return <PerformerDashboard />;

  return (
    <div className="pg-page">
      <div className="pg-card">
        <div className="pg-topbar" />
        <div className="pg-logo">Aikyam</div>
        <div className="pg-sub">Performer Access</div>
        <div className="pg-ornament"><span>✦</span></div>
        <input
          className="pg-input"
          type="password"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter PIN"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          autoFocus
        />
        {error && (
          <div className="pg-error">Incorrect PIN. Try again.</div>
        )}
        <button className="pg-btn" onClick={attempt}>Enter</button>
        <a className="pg-back" href="#/">← Back to website</a>
      </div>
    </div>
  );
}