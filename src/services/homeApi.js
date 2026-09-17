const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const err = new Error(`API error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const homeApi = {
  /** { content, stats, sections } — everything the Home page needs in one call */
  getHomeContent: () => request('/home'),
};
