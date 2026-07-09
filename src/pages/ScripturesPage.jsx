import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Loader2 } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';

export default function ScripturesPage() {
    const [scriptures, setScriptures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        scriptureApi
            .getScriptures()
            .then((res) => { if (!cancelled) setScriptures(res.data || []); })
            .catch(() => { if (!cancelled) setError('Unable to load scriptures right now. Please try again later.'); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, []);

    // Load the signed-in user's favorited scriptures, best-effort (guest = skip)
    useEffect(() => {
        if (!localStorage.getItem('dc_token')) return;
        scriptureApi.getFavorites()
            .then((res) => setFavorites((res.data || []).map((f) => f.id)))
            .catch(() => { });
    }, []);

    const toggleFav = (scriptureId, e) => {
        e.stopPropagation();
        const isFav = favorites.includes(scriptureId);
        setFavorites((prev) =>
            isFav ? prev.filter((f) => f !== scriptureId) : [...prev, scriptureId]
        );
        const action = isFav ? scriptureApi.removeFavorite : scriptureApi.addFavorite;
        action(scriptureId).catch(() => {
            // revert on failure
            setFavorites((prev) =>
                isFav ? [...prev, scriptureId] : prev.filter((f) => f !== scriptureId)
            );
        });
    };

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Page Header */}
                <span className="section-label">SACRED KNOWLEDGE</span>
                <h1
                    className="text-4xl sm:text-5xl font-bold text-[#2d1a0e] mt-2 mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Scriptures
                </h1>
                <p className="text-sm sm:text-base text-gray-500 max-w-xl mb-10">
                    Explore the timeless wisdom of Hindu sacred texts —{' '}
                    <span style={{ color: '#e07c0a' }}>the foundation of Dharma.</span>
                </p>

                {/* States */}
                {loading && (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading scriptures...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-16 text-sm text-red-500">{error}</div>
                )}

                {!loading && !error && scriptures.length === 0 && (
                    <div className="text-center py-16 text-sm text-gray-400">No scriptures found.</div>
                )}

                {/* Scripture Cards Grid */}
                {!loading && !error && scriptures.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scriptures.map((scripture) => {
                            const isFav = favorites.includes(scripture.id);
                            return (
                                <div
                                    key={scripture.id}
                                    className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300"
                                    style={{
                                        border: '1px solid #f5e8d0',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                    }}
                                    onClick={() => navigate(`/scriptures/${scripture.slug}`)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {/* Top Row: Icon + Favorite */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ background: scripture.color }}
                                        >
                                            {scripture.emoji}
                                        </div>
                                        <button
                                            onClick={(e) => toggleFav(scripture.id, e)}
                                            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                            style={{ background: '#f7f2ea' }}
                                        >
                                            <Heart
                                                className="w-4 h-4"
                                                style={{
                                                    color: isFav ? '#e07c0a' : '#9c8672',
                                                    fill: isFav ? '#e07c0a' : 'none',
                                                }}
                                            />
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-xl font-semibold text-[#2d1a0e] mb-2"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {scripture.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                        {scripture.description}
                                    </p>

                                    {/* Meta Tags */}
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {(scripture.meta_labels || []).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-3 py-1 rounded-full font-medium"
                                                style={{
                                                    background: '#f5f0e8',
                                                    color: '#6b5b4d',
                                                    border: '1px solid #edd9b3',
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Read Now Link */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/scriptures/${scripture.slug}`);
                                        }}
                                        className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                                        style={{ color: '#e07c0a' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#c46206')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = '#e07c0a')}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Read Now →
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
