const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders() {
    const token = localStorage.getItem('dc_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path) {
    const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
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
    if (!res.ok) {
        const err = new Error(`API error ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return res.json();
}

// item shape: { itemType: 'prayer'|'scripture'|'temple', itemId, title, subtitle, imageUrl, meta }
export const wishlistApi = {
    getWishlist: () => request('/wishlist'),
    addToWishlist: (item) => mutate('POST', '/wishlist', item),
    removeFromWishlist: (itemType, itemId) =>
        mutate('DELETE', `/wishlist/${itemType}/${encodeURIComponent(itemId)}`),
};
