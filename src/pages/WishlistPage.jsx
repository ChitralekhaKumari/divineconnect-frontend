import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Landmark, ScrollText, Trash2, Loader2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

// prayer/temple open a modal on their list page, scripture has its own page
const SECTION_META = {
    prayer: { label: 'Prayers', icon: BookOpen, path: (id) => `/prayers?open=${encodeURIComponent(id)}` },
    scripture: { label: 'Scriptures', icon: ScrollText, path: (id) => `/scriptures/${id}` },
    temple: { label: 'Temples', icon: Landmark, path: (id) => `/temples?open=${encodeURIComponent(id)}` },
};

function sectionFor(type) {
    return SECTION_META[type] || { label: type.charAt(0).toUpperCase() + type.slice(1), icon: Heart, path: '/home' };
}

export default function WishlistPage() {
    const { items, loading, error, refresh, toggleWishlist } = useWishlist();
    const navigate = useNavigate();
    const [removingKey, setRemovingKey] = useState(null);

    // Group flat wishlist rows by item_type, in a stable, friendly order.
    const groups = items.reduce((acc, item) => {
        (acc[item.item_type] = acc[item.item_type] || []).push(item);
        return acc;
    }, {});
    const orderedTypes = Object.keys(groups).sort((a, b) => {
        const order = ['prayer', 'scripture', 'temple'];
        const ia = order.indexOf(a), ib = order.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });

    function handleOpen(item) {
        const meta = sectionFor(item.item_type);
        const path = typeof meta.path === 'function' ? meta.path(item.item_id) : meta.path;
        navigate(path);
    }

    function handleRemove(item, e) {
        e.stopPropagation();
        const k = `${item.item_type}:${item.item_id}`;
        setRemovingKey(k);
        // Small delay so the row-leaving animation is visible before it's gone.
        setTimeout(() => {
            toggleWishlist({ type: item.item_type, id: item.item_id });
            setRemovingKey(null);
        }, 220);
    }

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <span className="section-label">SAVED FOR LATER</span>
                <h1 className="text-4xl sm:text-5xl font-bold text-[#2d1a0e] mt-2 mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    My Wishlist
                </h1>
                <p className="text-sm sm:text-base text-gray-500 max-w-xl mb-8">
                    All your favorite prayers, scriptures, and temples, saved in one place.
                </p>

                {loading && (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading your wishlist...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-16">
                        <p className="text-sm text-red-500 mb-4">{error}</p>
                        <button onClick={refresh} className="btn-primary text-xs px-6">Retry</button>
                    </div>
                )}

                {!loading && !error && items.length === 0 && (
                    <div className="text-center py-20 px-4 rounded-3xl"
                        style={{ background: '#fff', border: '1px solid #f5e8d0' }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ background: '#fdf0d8' }}>
                            <Heart className="w-7 h-7" style={{ color: '#e07c0a' }} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#2d1a0e] mb-1"
                            style={{ fontFamily: 'var(--font-display)' }}>
                            Your wishlist is empty
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            Start adding your favorite prayers, scriptures, and temples.
                        </p>
                    </div>
                )}

                {!loading && !error && orderedTypes.map((type) => {
                    const meta = sectionFor(type);
                    const Icon = meta.icon;
                    return (
                        <div key={type} className="mb-10 wishlist-fade-up">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: '#fdf0d8' }}>
                                    <Icon className="w-4 h-4" style={{ color: '#e07c0a' }} />
                                </div>
                                <h2 className="text-lg font-bold text-[#2d1a0e]"
                                    style={{ fontFamily: 'var(--font-display)' }}>
                                    {meta.label}
                                </h2>
                                <span className="text-xs text-gray-400">({groups[type].length})</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {groups[type].map((item) => {
                                    const k = `${item.item_type}:${item.item_id}`;
                                    const leaving = removingKey === k;
                                    return (
                                        <div
                                            key={k}
                                            onClick={() => handleOpen(item)}
                                            className={`bg-white rounded-2xl flex items-center gap-4 px-5 py-4 cursor-pointer transition-shadow hover:shadow-md ${leaving ? 'wishlist-row-leaving' : ''}`}
                                            style={{ border: '1px solid #f5e8d0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                                        >
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.title}
                                                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                                                    style={{ background: '#fdf0d8' }}>
                                                    {item.meta?.emoji || '🕉️'}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-semibold text-[#2d1a0e] truncate">
                                                    {item.title || item.item_id}
                                                </h3>
                                                {item.subtitle && (
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.subtitle}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => handleRemove(item, e)}
                                                aria-label="Remove from wishlist"
                                                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-50"
                                                style={{ background: '#f7f2ea' }}
                                            >
                                                <Trash2 className="w-4 h-4" style={{ color: '#c0392b' }} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
