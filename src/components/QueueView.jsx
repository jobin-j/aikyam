import { useState, useEffect } from 'react';
import { getRequests, deleteRequest } from '../services/googleSheets';
import AikyamSpinner from './AikyamSpinner';
import './QueueView.scss';

const fmtAgo = d => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (isNaN(s) || s < 0) return 'just now';
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

const getMyRequestIds = () =>
  JSON.parse(localStorage.getItem('aikyam_request_ids') || '[]');

const removeMyRequestId = (id) => {
  const existing = getMyRequestIds();
  localStorage.setItem('aikyam_request_ids', JSON.stringify(existing.filter(i => i !== id)));
};

export default function QueueView() {
  const [requests,   setRequests]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const sessionKey = localStorage.getItem('aikyam_session');

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

  const playing = requests.find(r => r.status === 'playing');

  const myIds      = getMyRequestIds();
  const myRequests = requests.filter(r =>
    myIds.includes(r.id) &&
    new Date(r.timestamp).toDateString() === today
  );

  const getStatus = (r) => {
    if (r.status === 'completed') return 'done';
    if (r.status === 'skipped')   return 'skipped';
    if (r.status === 'playing')   return 'playing';
    return 'pending';
  };

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await deleteRequest(id);
      removeMyRequestId(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to cancel:', err);
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="qv-page">
      {loading && <AikyamSpinner color="#FF9933" />}

      <div className="qv-inner">

        {/* ── Header ── */}
        <div className="qv-header">
          <h1 className="qv-title">Live Queue</h1>
          <p className="qv-sub">AIKYAM · Tonight's Requests</p>
        </div>

        {/* ── My Request Banners ── */}
        {myRequests
        .filter(r => getStatus(r) !== 'pending')
        .slice(0, 2)                              // ← max 2 notifications
        .map(myRequest => {
          const myStatus   = getStatus(myRequest);
          const myPosition = pending.findIndex(r => r.id === myRequest.id) + 1;

          return (
            <div key={myRequest.id} className={`qv-my-banner qv-my-banner--${myStatus}`}>
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
                    <div className="qv-my-pos">We don't know this one. Try another?</div>
                    <a className="qv-my-again" href="#/request">Request a different song →</a>
                  </div>
                </>
              )}
            </div>
          );
        })}

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
                <div className="qv-row-meta">{fmtAgo(playing.timestamp)}</div>
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
                  className={`qv-row ${myIds.includes(r.id) ? 'qv-mine' : ''}`}
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
                    <div className="qv-row-meta">{fmtAgo(r.timestamp)}</div>
                  </div>
                  {myIds.includes(r.id) && (
                    <div className="qv-mine-actions">
                      <div className="qv-mine-badge">Yours!</div>
                      <button
                        className="qv-cancel-btn"
                        onClick={() => handleCancel(r.id)}
                        disabled={cancelling === r.id}
                      >
                        {cancelling === r.id ? '…' : '✕'}
                      </button>
                    </div>
                  )}
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