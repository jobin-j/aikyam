import { useState, useEffect, useCallback } from 'react';
import './PerformerDashboard.scss';
import { getRequests, updateStatus } from '../services/googleSheets';
import AikyamSpinner from './AikyamSpinner';

const fmtAgo = d => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (isNaN(s) || s < 0) return 'just now';
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

export default function PerformerDashboard() {
  const [requests,    setRequests]    = useState([]);
  const [filter,      setFilter]      = useState('');
  const [loadingId,   setLoadingId]   = useState(null);
  const [toast,       setToast]       = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRequests = useCallback(async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    const poll = setInterval(fetchRequests, 3000);
    return () => clearInterval(poll);
  }, [fetchRequests]);

  const toggleSelect = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const bulkComplete = async () => {
    setLoadingId('bulk');
    try {
      await Promise.all(selectedIds.map(id => updateStatus(id, 'completed')));
      setSelectedIds([]);
      showToast(`${selectedIds.length} requests marked complete ✓`);
      await fetchRequests();
    } catch {
      showToast('Failed to update. Try again.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const bulkSkip = async () => {
    setLoadingId('bulk');
    try {
      await Promise.all(selectedIds.map(id => updateStatus(id, 'skipped')));
      setSelectedIds([]);
      showToast(`${selectedIds.length} requests skipped ⊘`);
      await fetchRequests();
    } catch {
      showToast('Failed to update. Try again.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const markCompleted = async id => {
    setLoadingId(id);
    try {
      await updateStatus(id, 'completed');
      showToast('Marked as completed ✓');
      await fetchRequests();
    } catch {
      showToast('Failed to update. Try again.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const markPlaying = async id => {
    setLoadingId(id);
    try {
      await updateStatus(id, 'playing');
      showToast('Now playing ▶');
      await fetchRequests();
    } catch {
      showToast('Failed to update. Try again.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const skip = async id => {
    setLoadingId(id);
    try {
      await updateStatus(id, 'skipped');
      showToast('Request skipped ⊘');
      await fetchRequests();
    } catch {
      showToast('Failed to update. Try again.', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const playing   = requests.find(r => r.status === 'playing');
  const pending   = requests.filter(r =>
    r.status === 'pending' && (
      filter
        ? r.song.toLowerCase().includes(filter.toLowerCase()) ||
          r.artistOrMovie?.toLowerCase().includes(filter.toLowerCase())
        : true
    )
  );

  const today = new Date().toDateString();
  const completed = requests
    .filter(r => r.status === 'completed' && new Date(r.timestamp).toDateString() === today)
    .slice(-5);

  return (
    <>
      {loadingId && <AikyamSpinner fullPage color="#D4AF37" />}
      <div className="pd-page">
        <div className="pd-inner">

          {/* ── Toast ── */}
          {toast && (
            <div className={`pd-toast pd-toast--${toast.type}`}>
              {toast.message}
            </div>
          )}

          {/* ── Header ── */}
          <div className="pd-header">
            <div>
              <h1 className="pd-title">Live Queue</h1>
              <p className="pd-sub">AIKYAM</p>
            </div>
            <div className="pd-stats">
              <div className="pd-stat">
                <div className="pd-stat-num">{pending.length}</div>
                <div className="pd-stat-label">Pending</div>
              </div>
              <div className="pd-stat">
                <div className="pd-stat-num">{completed.length}</div>
                <div className="pd-stat-label">Done</div>
              </div>
            </div>
          </div>

          {/* ── Filter ── */}
          <div className="pd-filter-wrap">
            <input
              className="pd-filter"
              placeholder="Filter by song or artist…"
              value={filter}
              onChange={e => { setFilter(e.target.value); setSelectedIds([]); }}
            />
            {filter && (
              <button className="pd-filter-clear" onClick={() => setFilter('')}>✕</button>
            )}
          </div>

          {/* ── Now Playing ── */}
          {playing && (
            <div className="pd-section">
              <div className="pd-section-head">
                <span className="pd-section-title">▶ Now Playing</span>
              </div>
              <div className="pd-now-card">
                <div className="pd-now-topbar" />
                <div className="pd-now-body">
                  <div className="pd-now-disc">♪</div>
                  <div className="pd-now-info">
                    <div className="pd-now-song">{playing.song}</div>
                    <div className="pd-now-artist">{playing.artistOrMovie}</div>
                    {playing.dedication && (
                      <div className="pd-now-ded">{playing.dedication}</div>
                    )}
                    <div className="pd-now-meta">{fmtAgo(playing.timestamp)}</div>
                  </div>
                  <button
                    className="pd-btn-done"
                    onClick={() => markCompleted(playing.id)}
                    disabled={loadingId === playing.id}
                    title="Mark completed"
                  >
                    {loadingId === playing.id ? '…' : '✓'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Pending Queue ── */}
          <div className="pd-section">
            <div className="pd-section-head">
              <span className="pd-section-title">Queue</span>
              {pending.length > 0 && (
                <span className="pd-badge">{pending.length}</span>
              )}
              {selectedIds.length > 0 && (
                <>
                  <button
                    className="pd-bulk-btn pd-bulk-btn--skip"
                    onClick={bulkSkip}
                    disabled={loadingId === 'bulk'}
                  >
                    {loadingId === 'bulk'
                      ? <AikyamSpinner color="#DC143C" />
                      : `Skip Selected (${selectedIds.length}) ⊘`}
                  </button>
                  <button
                    className="pd-bulk-btn"
                    onClick={bulkComplete}
                    disabled={loadingId === 'bulk'}
                  >
                    {loadingId === 'bulk'
                      ? <AikyamSpinner color="#FFFDF5" />
                      : `Mark Selected (${selectedIds.length}) ✓`}
                  </button>
                </>
              )}
            </div>

            {pending.length > 0 ? (
              <div className="pd-queue">
                {pending.map((r, i) => (
                  <div
                    key={r.id}
                    className={`pd-row ${selectedIds.includes(r.id) ? 'pd-row--selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="pd-checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                    />
                    <div className="pd-row-pos">{i + 1}</div>
                    <div className="pd-row-info">
                      <div className="pd-row-song">{r.song}</div>
                      {r.artistOrMovie && (
                        <div className="pd-row-artist">{r.artistOrMovie}</div>
                      )}
                      {r.dedication && (
                        <div className="pd-row-ded">{r.dedication}</div>
                      )}
                      <div className="pd-row-meta">{fmtAgo(r.timestamp)}</div>
                    </div>
                    <div className="pd-row-actions">
                      <button
                        className="pd-action pd-action--play"
                        onClick={() => markPlaying(r.id)}
                        disabled={loadingId === r.id || selectedIds.length > 0}
                        title={selectedIds.length > 0 ? 'Deselect all to play' : 'Play now'}
                      >
                        {loadingId === r.id ? <AikyamSpinner color="#2a8a3e" /> : '▶'}
                      </button>
                      <button
                        className="pd-action pd-action--skip"
                        onClick={() => skip(r.id)}
                        disabled={loadingId === r.id || selectedIds.length > 0}
                        title={selectedIds.length > 0 ? 'Use bulk skip below' : 'Skip'}
                      >
                        {loadingId === r.id ? <AikyamSpinner color="#DC143C" /> : '⊘'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pd-empty">
                <div className="pd-empty-icon">🎵</div>
                <div className="pd-empty-text">The stage is yours — no requests yet!</div>
              </div>
            )}
          </div>

          {/* ── Completed ── */}
          {completed.length > 0 && (
            <div className="pd-section">
              <div className="pd-section-head">
                <span className="pd-section-title">Completed</span>
                <span className="pd-badge">{completed.length}</span>
              </div>
              <div className="pd-done-list">
                {completed.map(r => (
                  <div key={r.id} className="pd-done-row">
                    <div className="pd-done-tick">✓</div>
                    <div className="pd-done-info">
                      <div className="pd-done-song">{r.song}</div>
                      {r.artistOrMovie && (
                        <div className="pd-done-artist">{r.artistOrMovie}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}