import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2, Search, ScrollText } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';
import Reveal from '../components/Reveal';
import WishlistButton from '../components/WishlistButton';

// Builds the wishlist item shape for a scripture.
function toWishlistItem(scripture) {
    return {
        type: 'scripture',
        id: scripture.slug,
        title: scripture.title,
        subtitle: nonLanguageLabels(scripture.meta_labels).join(' · '),
        image: scripture.image_url,
        meta: { emoji: scripture.emoji, color: scripture.color },
    };
}

// Scripture cards should read as clean, image-forward tiles — not a spec
// sheet. Language availability ("Sanskrit", "Hindi", "English", "Sanskrit
// only", "Sanskrit + English + Hindi", etc.) is dropped here so only
// structural tags (chapter/mandala/verse counts) remain visible on the card.
const LANGUAGE_LABEL_RE = /\b(sanskrit|hindi|english)\b/i;
function nonLanguageLabels(labels) {
    return (labels || []).filter((tag) => !LANGUAGE_LABEL_RE.test(tag));
}

// Category display order + a short curatorial blurb for each group —
// mirrors the "digital library" feel without being a literal grid of
// undifferentiated cards.
const CATEGORY_META = {
    Veda: {
        label: 'The Four Vedas',
        blurb: 'The oldest layer of revealed knowledge — hymns, chants, rituals, and everyday wisdom passed down since the Vedic age.',
    },
    Upanishad: {
        label: 'Upanishads',
        blurb: 'The philosophical crown of the Vedas — dialogues on the nature of the self, consciousness, and liberation.',
    },
    Itihasa: {
        label: 'The Great Epics',
        blurb: 'Itihasa — "so indeed it happened." Sweeping narratives of dharma, devotion, and destiny.',
    },
    Smriti: {
        label: 'Smriti',
        blurb: 'Remembered teaching — Krishna\'s counsel to Arjuna on the battlefield of Kurukshetra.',
    },
    Purana: {
        label: 'Puranas',
        blurb: 'Ancient chronicles of creation, cosmology, and the gods — encyclopedic lore woven into story.',
    },
};
const CATEGORY_ORDER = ['Smriti', 'Itihasa', 'Veda', 'Upanishad', 'Purana'];

export default function ScripturesPage() {
    const [scriptures, setScriptures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
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

    const categories = useMemo(() => {
        const present = new Set(scriptures.map((s) => s.category));
        return ['All', ...CATEGORY_ORDER.filter((c) => present.has(c))];
    }, [scriptures]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return scriptures.filter((s) => {
            const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
            const matchesSearch = !q
                || s.title.toLowerCase().includes(q)
                || (s.description || '').toLowerCase().includes(q)
                || (s.meta_labels || []).some((t) => t.toLowerCase().includes(q));
            return matchesCategory && matchesSearch;
        });
    }, [scriptures, search, activeCategory]);

    // Grouped by category, in curatorial order — only when not actively
    // filtering to a single category (keeps a flat grid while filtering).
    const grouped = useMemo(() => {
        if (activeCategory !== 'All') return null;
        const groups = {};
        for (const s of filtered) {
            (groups[s.category] ||= []).push(s);
        }
        return CATEGORY_ORDER
            .filter((cat) => groups[cat]?.length)
            .map((cat) => ({ category: cat, items: groups[cat] }));
    }, [filtered, activeCategory]);

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="relative py-20 px-4 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #2d1a0e 0%, #5c3317 45%, #3a2010 100%)' }}>
                <div className="absolute inset-0 opacity-[0.8]"
                    style={{
                        backgroundImage: "url('https://i.pinimg.com/1200x/2c/57/18/2c5718754fe48b702e482fb0e1c5ab37.jpg')",
                        backgroundSize: 'cover', backgroundPosition: 'center center',
                    }} />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(45,26,14,0.5) 0%, rgba(92,51,23,0.35) 45%, rgba(58,32,16,0.5) 100%)' }} />
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgba(232,166,53,0.18), transparent 70%)' }} />
                <Reveal as="div" className="relative z-10 max-w-3xl mx-auto text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-5"
                        style={{ background: 'rgba(249,187,92,0.15)', color: '#f9bb5c', border: '1px solid rgba(249,187,92,0.3)', fontFamily: 'var(--font-label)' }}>
                        <ScrollText className="w-3 h-3" />
                        SACRED KNOWLEDGE
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5"
                        style={{ fontFamily: 'var(--font-display)' }}>
                        The Scripture Library
                    </h1>
                    <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mb-9 leading-relaxed">
                        A digital home for the timeless texts of Sanatana Dharma — the Vedas, Upanishads,
                        epics, and Puranas — preserved in Sanskrit, Hindi, and English for the modern seeker.
                    </p>
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, theme, or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm outline-none shadow-lg"
                            style={{ background: 'rgba(255,255,255,0.97)', color: '#2d1a0e' }}
                        />
                    </div>
                </Reveal>
            </div>

            {/* ── Category filter bar ─────────────────────────────────────── */}
            <div className="sticky top-16 z-40 bg-white border-b border-[#edd9b3] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150"
                            style={activeCategory === cat
                                ? { background: '#e07c0a', color: '#fff' }
                                : { background: '#fdfaf5', color: '#5c4a3a', border: '1px solid #e8d5b0' }}
                        >
                            {cat === 'All' ? 'All Texts' : (CATEGORY_META[cat]?.label || cat)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading && (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading scriptures...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-16 text-sm text-red-500">{error}</div>
                )}

                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-16 text-sm text-gray-400">
                        No scriptures match your search.
                    </div>
                )}

                {/* Grouped-by-category view (default, "All Texts") */}
                {!loading && !error && grouped && grouped.map((group, gi) => (
                    <section key={group.category} className={gi > 0 ? 'mt-16' : ''}>
                        <Reveal>
                            <span className="section-label" style={{ fontSize: '1.19rem' }}>{CATEGORY_META[group.category]?.label?.toUpperCase() || group.category.toUpperCase()}</span>
                            <p className="text-sm text-gray-500 max-w-2xl mb-7 -mt-1">
                                {CATEGORY_META[group.category]?.blurb}
                            </p>
                        </Reveal>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {group.items.map((scripture, i) => (
                                <ScriptureCard
                                    key={scripture.slug}
                                    scripture={scripture}
                                    index={i}
                                    onOpen={() => navigate(`/scriptures/${scripture.slug}`)}
                                />
                            ))}
                        </div>
                    </section>
                ))}

                {/* Flat filtered grid (when a category or search narrows results) */}
                {!loading && !error && !grouped && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((scripture, i) => (
                            <ScriptureCard
                                key={scripture.slug}
                                scripture={scripture}
                                index={i}
                                onOpen={() => navigate(`/scriptures/${scripture.slug}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Scripture Card ─────────────────────────────────────────────────────────
// Image-forward card: photo/manuscript art on top with a category chip
// floating over it, then title/description/tags/CTA below. Deliberately
// different from a plain icon+text card so scriptures feel like books on
// a shelf rather than list rows.
export function ScriptureCard({ scripture, index = 0, onOpen }) {
    const tags = nonLanguageLabels(scripture.meta_labels);
    return (
        <Reveal index={index} className="h-full">
            <div
                className="group bg-white rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col shadow-card-md transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1"
                style={{ border: '1px solid #f5e8d0' }}
                onClick={onOpen}
            >
                {/* Fixed-height image area — every card gets the same crop
                    frame, image fills it edge-to-edge, and object-top keeps
                    the top of the artwork (faces / deities / manuscript
                    headers) in view instead of centering into a crop. */}
                <div className="relative h-64 sm:h-72 overflow-hidden flex-shrink-0" style={{ background: scripture.color || '#f5f0e8' }}>
                    {scripture.image_url ? (
                        <img
                            src={scripture.image_url}
                            alt={scripture.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ objectPosition: '50% 5%' }}
                            loading="lazy"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    ) : null}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,26,14,0.6) 0%, rgba(45,26,14,0.08) 55%, transparent 75%)' }} />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{ background: 'rgba(255,255,255,0.92)', color: '#a34d07' }}>
                        {scripture.category}
                    </span>
                    <div className="absolute top-3 right-3">
                        <WishlistButton
                            item={toWishlistItem(scripture)}
                            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                            idleColor="#ffffff"
                        />
                    </div>
                    <h3 className="absolute bottom-3 left-4 right-4 text-white font-semibold text-xl leading-tight"
                        style={{ fontFamily: 'var(--font-display)' }}>
                        {scripture.title}
                    </h3>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <p className="text-[15px] text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
                        {scripture.description}
                    </p>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5 overflow-hidden" style={{ maxHeight: '34px' }}>
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap"
                                    style={{ background: '#f5f0e8', color: '#6b5b4d', border: '1px solid #edd9b3' }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); onOpen(); }}
                        className="flex items-center gap-1.5 text-sm font-semibold transition-colors mt-auto"
                        style={{ color: '#e07c0a' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#c46206')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#e07c0a')}
                    >
                        <BookOpen className="w-4 h-4" />
                        Read Scripture →
                    </button>
                </div>
            </div>
        </Reveal>
    );
}
