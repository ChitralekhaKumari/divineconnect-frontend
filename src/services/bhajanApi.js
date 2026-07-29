const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = new Error(`API error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function post(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST' });
  if (!res.ok) {
    const err = new Error(`API error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const bhajanApi = {
  /** deity, search, sort ('az' | 'recent' | 'mostplayed' | 'duration') */
  getBhajans: (params) => request('/bhajans', params),

  getById: (id) => request(`/bhajans/${id}`),

  getDeities: () => request('/bhajans/meta/deities'),

  getRecommended: (id, limit) => request(`/bhajans/${id}/recommended`, { limit }),

  /** Fire-and-forget play counter bump. Never throw into the player UI. */
  recordPlay: (id) => post(`/bhajans/${id}/play`).catch(() => null),
};
