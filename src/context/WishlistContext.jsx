import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useAuthModal } from './AuthModalContext';
import { useToast } from './ToastContext';
import { wishlistApi } from '../services/wishlistApi';

const WishlistContext = createContext(null);

function key(itemType, itemId) {
    return `${itemType}:${itemId}`;
}

export function WishlistProvider({ children }) {
    const { isLoggedIn, clearSession } = useAuth();
    const { requireAuth, openAuthModal } = useAuthModal();
    const { showToast } = useToast();

    const [items, setItems] = useState([]); // raw rows from backend
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // The frontend's `isLoggedIn` only checks "is there a token in
    // localStorage?" — it can't verify the token is still valid. If the
    // backend rejects it (expired/invalid JWT) we land here: drop the
    // stale session and, optionally, resume `retryAction` right after
    // the user signs back in.
    const handleSessionExpired = useCallback((retryAction) => {
        clearSession();
        openAuthModal('login', 'Your session has expired. Please sign in again.', retryAction);
    }, [clearSession, openAuthModal]);

    const refresh = useCallback(() => {
        if (!isLoggedIn) return;
        setLoading(true);
        setError(null);
        wishlistApi.getWishlist()
            .then((res) => setItems(res.data || []))
            .catch((err) => {
                if (err.status === 401) {
                    setItems([]);
                    clearSession();
                } else {
                    setError('Could not load your wishlist. Please try again.');
                }
            })
            .finally(() => setLoading(false));
    }, [isLoggedIn, clearSession]);

    // Load wishlist right after login; clear it on logout so the next
    // user never sees a stale list.
    useEffect(() => {
        if (isLoggedIn) refresh();
        else setItems([]);
    }, [isLoggedIn, refresh]);

    const isWishlisted = useCallback(
        (itemType, itemId) => items.some((i) => i.item_type === itemType && String(i.item_id) === String(itemId)),
        [items]
    );

    // item = { type, id, title, subtitle, image, meta }
    const toggleWishlist = useCallback((item) => {
        const { type: itemType, id: itemId } = item;

        const doToggle = () => {
            const already = isWishlisted(itemType, itemId);

            if (already) {
                // Optimistic remove
                setItems((prev) => prev.filter((i) => !(i.item_type === itemType && String(i.item_id) === String(itemId))));
                wishlistApi.removeFromWishlist(itemType, itemId)
                    .then(() => showToast('Removed from wishlist', 'success'))
                    .catch((err) => {
                        if (err.status === 401) {
                            handleSessionExpired(doToggle);
                        } else {
                            showToast('Could not remove item. Please try again.', 'error');
                            refresh();
                        }
                    });
            } else {
                // Optimistic add
                const optimisticRow = {
                    item_type: itemType,
                    item_id: String(itemId),
                    title: item.title,
                    subtitle: item.subtitle,
                    image_url: item.image,
                    meta: item.meta || {},
                    created_at: new Date().toISOString(),
                };
                setItems((prev) => [optimisticRow, ...prev]);
                wishlistApi.addToWishlist({
                    itemType,
                    itemId,
                    title: item.title,
                    subtitle: item.subtitle,
                    imageUrl: item.image,
                    meta: item.meta,
                }).then(() => showToast('Added to wishlist', 'success'))
                    .catch((err) => {
                        setItems((prev) => prev.filter((i) => !(i.item_type === itemType && String(i.item_id) === String(itemId))));
                        if (err.status === 401) {
                            handleSessionExpired(doToggle);
                        } else {
                            showToast('Could not add item. Please try again.', 'error');
                        }
                    });
            }
        };

        // Guests get bounced to the login modal; doToggle() re-runs
        // automatically once login succeeds.
        requireAuth(doToggle, 'Sign in to add this to your wishlist');
    }, [isWishlisted, requireAuth, showToast, refresh, handleSessionExpired]);

    return (
        <WishlistContext.Provider value={{ items, loading, error, isWishlisted, toggleWishlist, refresh }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}

export { key as wishlistKey };

