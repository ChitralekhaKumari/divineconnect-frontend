import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2 } from 'lucide-react';
import { prayerApi } from '../services/prayerApi';
import { getDeityImage } from '../utils/deityImages';
import Reveal from './Reveal';
import WishlistButton from './WishlistButton';

function toWishlistItem(prayer) {
    return {
        type: 'prayer',
        id: prayer.slug || prayer.id,
        title: prayer.title,
        subtitle: `${prayer.deity} · ${prayer.frequency}`,
        meta: { emoji: '🙏' },
    };
}

// Shown at the bottom of a prayer's reading page — exactly 4 other prayers,
// never the one currently open. Same shape as RecommendedScriptures: same
// deity first (most relevant to what's currently being read), then filled
// out with other prayers if that deity doesn't have enough on its own.
export default function RecommendedPrayers({ currentSlug, currentDeity }) {
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        prayerApi.getPrayers('All')
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

    const others = all.filter((p) => (p.slug || String(p.id)) !== currentSlug);
    const sameDeity = others.filter((p) => p.deity === currentDeity);
    const rest = others.filter((p) => p.deity !== currentDeity);
    const picks = [...sameDeity, ...rest].slice(0, 4);

    if (picks.length === 0) return null;

    return (
        <section className="mt-16 pt-10" style={{ borderTop: '1px solid #f0e2c4' }}>
            <Reveal>
                <span className="section-label">CONTINUE YOUR DEVOTION</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2d1a0e] mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    Recommended Prayers
                </h2>
                <p className="text-sm text-gray-500 max-w-xl mb-7">
                    A few more prayers and mantras worth exploring next.
                </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {picks.map((prayer, i) => {
                    const href = `/prayers/${prayer.slug || prayer.id}`;
                    return (
                        <Reveal key={prayer.slug || prayer.id} index={i} className="h-full">
                            <div
                                className="group bg-white rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col shadow-card-md transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1"
                                style={{ border: '1px solid #f5e8d0' }}
                                onClick={() => navigate(href)}
                            >
                                <div className="relative h-32 overflow-hidden flex-shrink-0" style={{ background: '#f5f0e8' }}>
                                    <img
                                        src={prayer.image || getDeityImage(prayer.deity, 300)}
                                        alt={prayer.title}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                        onError={(e) => { e.currentTarget.src = getDeityImage(prayer.deity, 300); }}
                                    />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,26,14,0.6) 0%, transparent 65%)' }} />
                                    <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                                        <WishlistButton
                                            item={toWishlistItem(prayer)}
                                            size="sm"
                                            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                                            idleColor="#ffffff"
                                        />
                                    </div>
                                    <span className="absolute bottom-2 left-3 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                        style={{ background: 'rgba(255,255,255,0.9)', color: '#a34d07' }}>
                                        {prayer.deity}
                                    </span>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-sm font-semibold text-[#2d1a0e] leading-snug mb-1.5 line-clamp-2"
                                        style={{ fontFamily: 'var(--font-display)' }}>
                                        {prayer.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
                                        {prayer.frequency} devotion
                                    </p>
                                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#e07c0a' }}>
                                        <BookOpen className="w-3.5 h-3.5" />
                                        Read Now
                                    </span>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
