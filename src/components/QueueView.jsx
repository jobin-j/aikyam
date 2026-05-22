import { useState, useEffect } from 'react';
import { getRequests } from '../services/googleSheets';
import AikyamSpinner from './AikyamSpinner';
import './QueueView.scss';

const fmtAgo = d => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (isNaN(s) || s < 0) return 'just now';
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

export default function QueueView() {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const sessionKey = localStorage.getItem('aikyam_session');
  const myRequestId = localStorage.getItem('aikyam_request_id'); // for banner only

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRequests();
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch queue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    const poll = setInterval(fetchRequests, 3000);
    return () => clearInterval(poll);
  }, []);

  const today = new Date().toDateString();

  const pending = requests.filter(r =>
    r.status === 'pending' &&
    new Date(r.timestamp).toDateString() === today
  );

  const playing   = requests.find(r => r.status === 'playing');
  const myRequest = requests.find(r =>
    r.id === myRequestId &&
    new Date(r.timestamp).toDateString() === today
  );

  const getMyStatus = () => {
    if (!myRequest) return null;
    if (myRequest.status === 'completed')        return 'done';
    if (myRequest.status === 'skipped')          return 'skipped'; // ADD THIS
    if (myRequest.status === 'playing')          return 'playing';
    return 'pending';
  };

  const myStatus   = getMyStatus();
  const myPosition = pending.findIndex(r => r.sessionKey === sessionKey) + 1;

  return (
    <div className="qv-page">
      {loading && <AikyamSpinner color="#FF9933" />}

      <div className="qv-inner">

        {/* ── Header ── */}
        <div className="qv-header">
          <h1 className="qv-title">Live Queue</h1>
          <p className="qv-sub">AIKYAM · Tonight's Requests</p>
        </div>

        {/* ── My Request Status Banner ── */}
        {myRequest && (
          <div className={`qv-my-banner qv-my-banner--${myStatus}`}>
            {myStatus === 'pending' && (
              <>
                <div className="qv-my-icon">🎵</div>
                <div className="qv-my-info">
                  <div className="qv-my-label">Your Request</div>
                  <div className="qv-my-song">{myRequest.song}</div>
                  <div className="qv-my-pos">Position #{myPosition} in queue</div>
                </div>
              </>
            )}
            {myStatus === 'playing' && (
              <>
                <div className="qv-my-icon">▶</div>
                <div className="qv-my-info">
                  <div className="qv-my-label">Now Playing!</div>
                  <div className="qv-my-song">{myRequest.song}</div>
                </div>
              </>
            )}
            {myStatus === 'done' && (
              <>
                <div className="qv-my-icon">✓</div>
                <div className="qv-my-info">
                  <div className="qv-my-label">Your song was played!</div>
                  <div className="qv-my-song">{myRequest.song}</div>
                  <a className="qv-my-again" href="#/request">Request another →</a>
                </div>
              </>
            )}
            {myStatus === 'skipped' && (
                <>
                    <div className="qv-my-icon">😔</div>
                    <div className="qv-my-info">
                    <div className="qv-my-label">Sorry!</div>
                    <div className="qv-my-song">{myRequest.song}</div>
                    <div className="qv-my-pos">
                        We don't know this one. Try another?
                    </div>
                    <a className="qv-my-again" href="#/request">
                        Request a different song →
                    </a>
                    </div>
                </>
            )}
          </div>
        )}

        {/* ── Now Playing ── */}
        {playing && (
          <div className="qv-section">
            <div className="qv-section-head">
              <span className="qv-section-title">▶ Now Playing</span>
            </div>
            <div className={`qv-now ${playing.sessionKey === sessionKey ? 'qv-mine' : ''}`}>
              <div className="qv-now-disc">♪</div>
              <div className="qv-now-info">
                <div className="qv-now-song">{playing.song}</div>
                <div className="qv-now-artist">{playing.artistOrMovie}</div>
                {playing.dedication && (
                  <div className="qv-now-ded">{playing.dedication}</div>
                )}
              </div>
              {playing.sessionKey === sessionKey && <div className="qv-mine-badge">Yours!</div>}
            </div>
          </div>
        )}

        {/* ── Queue ── */}
        <div className="qv-section">
          <div className="qv-section-head">
            <span className="qv-section-title">Up Next</span>
            {pending.length > 0 && (
              <span className="qv-badge">{pending.length}</span>
            )}
          </div>

          {pending.length > 0 ? (
            <div className="qv-list">
              {pending.map((r, i) => (
                <div
                  key={r.id}
                  className={`qv-row ${r.sessionKey === sessionKey ? 'qv-mine' : ''}`}
                >
                  <div className="qv-row-pos">{i + 1}</div>
                  <div className="qv-row-info">
                    <div className="qv-row-song">{r.song}</div>
                    {r.artistOrMovie && (
                      <div className="qv-row-artist">{r.artistOrMovie}</div>
                    )}
                    {r.dedication && (
                      <div className="qv-row-ded">{r.dedication}</div>
                    )}
                  </div>
                  {r.sessionKey === sessionKey && <div className="qv-mine-badge">Yours!</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="qv-empty">
              <div className="qv-empty-icon">🎶</div>
              <div className="qv-empty-text">Be the first to request a song!</div>
            </div>
          )}
        </div>

        <a className="qv-request-btn" href="#/request">+ Request a Song</a>

      </div>
    </div>
  );
}