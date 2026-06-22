const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const prayerApi = {
  /** Fetch prayers, optionally filtered by deity/category */
  getPrayers: (category) => request('/prayers', { category }),

  /** Distinct deity/category list */
  getCategories: () => request('/prayers/categories'),
};
