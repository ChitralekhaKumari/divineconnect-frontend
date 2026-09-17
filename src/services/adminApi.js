const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('dc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}/admin${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `API error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// ─── Temples module ─────────────────────────────────────────────────────
export const adminTemplesApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/temples${q ? `?${q}` : ''}`);
  },
  get: (id) => request('GET', `/temples/${id}`),
  create: (temple) => request('POST', '/temples', temple),
  update: (id, fields) => request('PUT', `/temples/${id}`, fields),
  setActive: (id, is_active) => request('PATCH', `/temples/${id}/active`, { is_active }),
  remove: (id) => request('DELETE', `/temples/${id}`),
};

// ─── Prayers module ─────────────────────────────────────────────────────
// File-based (.md), git-backed: every write commits directly to GitHub via
// the backend, which triggers Vercel's existing auto-deploy on push.
export const adminPrayersApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/prayers${q ? `?${q}` : ''}`);
  },
  get: (slug) => request('GET', `/prayers/${slug}`),
  create: (prayer) => request('POST', '/prayers', prayer),
  update: (slug, fields) => request('PUT', `/prayers/${slug}`, fields),
  remove: (slug) => request('DELETE', `/prayers/${slug}`),
};

// ─── Home module ────────────────────────────────────────────────────────
export const adminHomeApi = {
  getContent: () => request('GET', '/home'),
  updateContent: (fields) => request('PUT', '/home', fields),

  listStats: () => request('GET', '/home/stats'),
  createStat: (stat) => request('POST', '/home/stats', stat),
  updateStat: (id, fields) => request('PUT', `/home/stats/${id}`, fields),
  deleteStat: (id) => request('DELETE', `/home/stats/${id}`),

  listSections: () => request('GET', '/home/sections'),
  updateSection: (key, fields) => request('PUT', `/home/sections/${key}`, fields),
  reorderSections: (order) => request('PUT', '/home/sections/reorder', { order }),
};
