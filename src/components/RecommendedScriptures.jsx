import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2 } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';
import Reveal from './Reveal';
import WishlistButton from './WishlistButton';

// Language availability tags ("Sanskrit", "Hindi", "English", "Sanskrit
// only", etc.) shouldn't surface as badges — keep only structural labels
// (chapter/mandala/verse counts) wherever meta_labels are shown.
const LANGUAGE_LABEL_RE = /\b(sanskrit|hindi|english)\b/i;
function nonLanguageLabels(labels) {
    return (labels || []).filter((tag) => !LANGUAGE_LABEL_RE.test(tag));
}

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

// Shown at the bottom of a scripture's reading page — 3-4 other texts from
// the same category (never the one currently open), so a reader of the
// Rigveda sees the other Vedas, a reader of the Gita sees the other epics,
// and so on. Falls back to other categories if the current one is too thin.
export default function RecommendedScriptures({ currentSlug, currentCategory }) {
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        scriptureApi.getScriptures()
            .then((res) => { if (!cancelled) setAll(res.data || []); })
            .catch(() => { if (!cancelled) setAll([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Loading recommendations...</span>
            </div>
        );
    }

    const others = all.filter((s) => s.slug !== currentSlug);
    const sameCategory = others.filter((s) => s.category === currentCategory);
    const rest = others.filter((s) => s.category !== currentCategory);
    const picks = [...sameCategory, ...rest].slice(0, 4);

    if (picks.length === 0) return null;

    return (
        <section className="mt-16 pt-10" style={{ borderTop: '1px solid #f0e2c4' }}>
            <Reveal>
                <span className="section-label">CONTINUE EXPLORING</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2d1a0e] mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    Recommended Scriptures
                </h2>
                <p className="text-sm text-gray-500 max-w-xl mb-7">
                    A few more sacred texts worth exploring next.
                </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {picks.map((scripture, i) => (
                    <Reveal key={scripture.slug} index={i} className="h-full">
                        <div
                            className="group bg-white rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col shadow-card-md transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1"
                            style={{ border: '1px solid #f5e8d0' }}
                            onClick={() => navigate(`/scriptures/${scripture.slug}`)}
                        >
                            <div className="relative h-32 overflow-hidden flex-shrink-0" style={{ background: scripture.color || '#f5f0e8' }}>
                                {scripture.image_url ? (
                                    <img
                                        src={scripture.image_url}
                                        alt={scripture.title}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                ) : null}
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,26,14,0.6) 0%, transparent 65%)' }} />
                                <div className="absolute top-2 right-2">
                                    <WishlistButton
                                        item={toWishlistItem(scripture)}
                                        size="sm"
                                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                                        idleColor="#ffffff"
                                    />
                                </div>
                                <span className="absolute bottom-2 left-3 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                    style={{ background: 'rgba(255,255,255,0.9)', color: '#a34d07' }}>
                                    {scripture.category}
                                </span>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-sm font-semibold text-[#2d1a0e] leading-snug mb-1.5 line-clamp-2"
                                    style={{ fontFamily: 'var(--font-display)' }}>
                                    {scripture.title}
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
                                    {scripture.description}
                                </p>
                                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#e07c0a' }}>
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Read Now
                                </span>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
