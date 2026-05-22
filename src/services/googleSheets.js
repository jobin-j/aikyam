const SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;

// ── Get all requests ─────────────────────────
export const getRequests = async () => {
  const res  = await fetch(SCRIPT_URL);
  const data = await res.json();
  return data.data || [];
};

// ── Add new request ───────────────────────────
export const addRequest = async ({ song, dedication, sessionKey }) => {
  const res = await fetch(SCRIPT_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' },
    body:    JSON.stringify({ song, dedication, sessionKey }),
  });
  const data = await res.json();
  return data;
};

// ── Delete request ────────────────────────────
export const deleteRequest = async (id) => {
  const res = await fetch(SCRIPT_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' },
    body:    JSON.stringify({ action: 'deleteRequest', id }),
  });
  const data = await res.json();
  return data;
};

// ── Update request status ─────────────────────
export const updateStatus = async (id, status) => {
  const res = await fetch(SCRIPT_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' },
    body:    JSON.stringify({ action: 'updateStatus', id, status }),
  });
  const data = await res.json();
  return data;
};