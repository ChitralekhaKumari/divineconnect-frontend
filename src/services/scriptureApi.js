const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders() {
    const token = localStorage.getItem('dc_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, params = {}) {
    const url = new URL(`${BASE_URL}${path}`);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
    const res = await fetch(url.toString(), { headers: authHeaders() });
    if (!res.ok) {
        const err = new Error(`API error ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return res.json();
}

async function mutate(method, path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

export const scriptureApi = {
    /** All scriptures, optionally filtered by category */
    getScriptures: (category) => request('/scriptures', { category }),

    /** Distinct category list (Itihasa, Veda, Purana, Upanishad, Smriti) */
    getCategories: () => request('/scriptures/categories'),

    /** Book metadata + chapter list for one scripture */
    getScripture: (slug) => request(`/scriptures/${slug}`),

    /** Chapter with verses, paginated */
    getChapter: (slug, chapterNumber, page = 1) =>
        request(`/scriptures/${slug}/chapters/${chapterNumber}`, { page }),

    /** One random verse — used for a "verse of the day" style widget */
    getRandomVerse: () => request('/scriptures/random-verse'),

    /** Full-text search across Sanskrit/Hindi/English */
    search: (q, page = 1) => request('/scriptures/search', { q, page }),

    // ── Auth-required ──
    // Favorites/progress are keyed by scripture slug + chapter/verse
    // number instead of a DB id, since scripture content lives in .md files.
    getFavorites: () => request('/scriptures/favorites'),
    addFavorite: (scriptureSlug) => mutate('POST', '/scriptures/favorites', { scriptureSlug }),
    removeFavorite: (scriptureSlug) => mutate('DELETE', `/scriptures/favorites/${scriptureSlug}`),

    updateProgress: (scriptureSlug, chapterNumber, verseNumber) =>
        mutate('PUT', '/scriptures/progress', { scriptureSlug, chapterNumber, verseNumber }),
    getRecentReads: () => request('/scriptures/recent'),
};
