const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

// ── Get all requests ─────────────────────────
export const getRequests = async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/requests?order=timestamp.asc`, { headers });
  const data = await res.json();
  return data.map(r => ({
    id:            r.id,
    song:          r.song,
    artistOrMovie: r.artist_or_movie,
    dedication:    r.dedication,
    status:        r.status,
    timestamp:     r.timestamp,
    sessionKey:    r.session_key,
  }));
};

// ── Add new request ───────────────────────────
export const addRequest = async ({ song, dedication, sessionKey }) => {
  const id = Date.now().toString();
  await fetch(`${SUPABASE_URL}/rest/v1/requests`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify({
      id,
      song,
      artist_or_movie: '',
      dedication:      dedication || null,
      status:          'pending',
      session_key:     sessionKey,
    }),
  });

  // Get queue position
  const queueRes = await fetch(
    `${SUPABASE_URL}/rest/v1/requests?status=eq.pending&order=timestamp.asc`,
    { headers }
  );
  const queue = await queueRes.json();
  const position = queue.findIndex(r => r.id === id) + 1;

  return { id, position };
};

// ── Delete request ────────────────────────────
export const deleteRequest = async (id) => {
  await fetch(`${SUPABASE_URL}/rest/v1/requests?id=eq.${id}`, {
    method: 'DELETE',
    headers,
  });
  return { success: true };
};

// ── Update request status ─────────────────────
export const updateStatus = async (id, status) => {
  await fetch(`${SUPABASE_URL}/rest/v1/requests?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify({ status }),
  });
  return { success: true };
};