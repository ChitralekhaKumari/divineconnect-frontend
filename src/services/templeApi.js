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

export const templeApi = {
  /**
   * Fetch paginated temples
   * @param {{ page, limit, search, category, tag, state, sort }} params
   */
  getTemples: (params) => request('/temples', params),

  /** Single temple by id */
  getById: (id) => request(`/temples/${id}`),

  /** Category counts */
  getCategories: () => request('/temples/categories'),

  /** State list */
  getStates: () => request('/temples/states'),

  /** Featured / LIVE temples for hero strip */
  getFeatured: () => request('/temples/featured'),
};
