import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, BookOpen, ChevronRight } from 'lucide-react';
import { prayerApi } from '../services/prayerApi';
import { getDeityImage } from '../utils/deityImages';
import WishlistButton from '../components/WishlistButton';
import RecommendedPrayers from '../components/RecommendedPrayers';
import Reveal from '../components/Reveal';
import useSmartBack from '../utils/useSmartBack';

function toWishlistItem(prayer) {
    return {
        type: 'prayer',
        id: prayer.slug || prayer.id,
        title: prayer.title,
        subtitle: `${prayer.deity} · ${prayer.frequency}`,
        meta: { emoji: '🙏' },
    };
}

// A clearly-labelled, boxed section — used for every content block below
// so Sanskrit / Hindi / English / Meaning / Benefits are visually distinct.
// Opaque white cards by design: they need to stay perfectly readable
// sitting on top of the shared background image behind them.
function Section({ label, text }) {
    if (!text) return null;
    return (
        <div className="rounded-2xl p-5 sm:p-6 shadow-card-md"
            style={{
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(245,232,208,0.8)',
            }}>
            <p className="text-xs font-semibold mb-2.5 uppercase" style={{ color: '#e07c0a', fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}>
                {label}
            </p>
            <p className="text-[15px] sm:text-base text-[#3a2c1e] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                {text}
            </p>
        </div>
    );
}

/**
 * PrayerDetailPage — dedicated reading page for a single prayer/mantra.
 *
 * The prayer's own image (same one shown on the listing card) runs as one
 * continuous background from the top of the page through the hero AND the
 * reading sections below it — not just a hero banner. A light wash keeps
 * the image sharp and clearly visible across the entire area (object-top,
 * minimal cropping); readability for the reading sections comes from each
 * Section card being a translucent frosted-glass panel (backdrop-blur)
 * rather than a heavy overlay on the image itself. Recommended Prayers
 * sits outside this image zone, back on the site's normal background.
 *
 * All prayer content, fields, and routing are unchanged.
 */
export default function PrayerDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const goBack = useSmartBack('/prayers');
    const readingRef = useRef(null);

    const [prayer, setPrayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        setPrayer(null);
        window.scrollTo({ top: 0 });

        prayerApi.getBySlug(slug)
            .then((res) => { if (!cancelled) setPrayer(res.data); })
            .catch(() => { if (!cancelled) setError('This prayer could not be found.'); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [slug]);

    if (loading) {
        return (
            <div style={{ background: '#fdfaf5', minHeight: '100vh' }} className="flex items-center justify-center py-24 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading prayer...</span>
            </div>
        );
    }

    if (error || !prayer) {
        return (
            <div style={{ background: '#fdfaf5', minHeight: '100vh' }} className="max-w-3xl mx-auto px-4 py-24 text-center">
                <p className="text-sm text-gray-400 mb-6">{error || 'This prayer could not be found.'}</p>
                <button onClick={() => navigate('/prayers')}
                    className="px-6 py-3 rounded-full text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
                    Back to Prayer Library
                </button>
            </div>
        );
    }

    const heroImage = prayer.image || getDeityImage(prayer.deity, 1000);

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>

            {/* ── Image zone: hero + reading sections share one continuous
                background, ending right before Recommended Prayers ────── */}
            <div className="relative">

                {/* Background layer — stretches to match this wrapper's full
                    height (hero + all sections below), since it's absolutely
                    positioned inside a position:relative parent sized by its
                    normal-flow content. */}
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={heroImage}
                        alt={prayer.title}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        onError={(e) => { e.currentTarget.src = getDeityImage(prayer.deity, 1000); }}
                    />
                    {/* Left-heavy wash, sized to the hero only — just enough to
                        keep the hero text readable on the left while the
                        artwork stays clearly visible everywhere else */}
                    <div className="absolute top-0 left-0 right-0 h-[460px] sm:h-[540px] lg:h-[620px]" style={{
                        background: 'linear-gradient(90deg, rgba(253,250,245,0.55) 0%, rgba(253,250,245,0.4) 30%, rgba(253,250,245,0.18) 58%, rgba(253,250,245,0.04) 78%, transparent 100%)'
                    }} />
                    {/* Full-height vertical fade — light throughout, never
                        building past ~40% opacity, so the image stays sharp
                        and clearly visible across the entire background area,
                        all the way down through the reading sections. Actual
                        text contrast comes from the Section cards themselves
                        (frosted glass, not the background wash). */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(180deg, rgba(253,250,245,0.05) 0%, rgba(253,250,245,0.1) 22%, rgba(253,250,245,0.18) 40%, rgba(253,250,245,0.28) 58%, rgba(253,250,245,0.35) 100%)'
                    }} />
                </div>

                {/* Floating wishlist button */}
                <div className="absolute top-5 right-4 sm:right-6 lg:right-8 z-20">
                    <WishlistButton
                        item={toWishlistItem(prayer)}
                        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}
                    />
                </div>

                {/* Hero content */}
                <Reveal>
                    <div className="relative z-10 flex flex-col justify-center min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                        {/* Breadcrumb */}
                        <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-medium mb-6">
                            <button onClick={goBack} className="hover:underline" style={{ color: '#8a6a4a' }}>Prayers</button>
                            <ChevronRight className="w-3 h-3" style={{ color: '#c9a97a' }} />
                            <span className="font-semibold" style={{ color: '#e07c0a' }}>{prayer.title}</span>
                        </div>

                        {/* Pills */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-6">
                            <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid #e8d5b0', color: '#5c4a3a' }}>
                                Prayer
                            </span>
                            <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid #e8d5b0', color: '#5c4a3a' }}>
                                {prayer.deity}
                            </span>
                            <span className="text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid #e8d5b0', color: '#5c4a3a' }}>
                                {prayer.frequency} Devotion
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 max-w-2xl"
                            style={{ color: '#e07c0a', fontFamily: 'var(--font-display)' }}>
                            {prayer.title}
                        </h1>

                        {/* Real-data excerpt from the prayer's own "meaning" field —
                            clipped to 2 lines for the hero, shown in full below */}
                        {prayer.meaning && (
                            <p className="text-sm sm:text-base max-w-xl mb-8 leading-relaxed line-clamp-2"
                                style={{ color: '#3a2c1e' }}>
                                {prayer.meaning}
                            </p>
                        )}

                        <div>
                            <button
                                onClick={() => readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:brightness-105"
                                style={{ background: 'linear-gradient(135deg, #f5a742, #e8901f)', color: '#fff' }}
                            >
                                <BookOpen className="w-4 h-4" />
                                Read Full Prayer
                            </button>
                        </div>
                    </div>
                </Reveal>

                {/* Reading sections — still inside the image zone, sitting on
                    the now-near-opaque part of the shared background */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
                    <div ref={readingRef} className="flex flex-col gap-5 scroll-mt-20">
                        <Section label="Sanskrit" text={prayer.sanskrit} />
                        <Section label="Hindi Translation" text={prayer.hindi} />
                        <Section label="English Translation" text={prayer.english} />
                        <Section label="Transliteration" text={prayer.transliteration} />
                        <Section label="Meaning" text={prayer.meaning} />
                        <Section label="Benefits" text={prayer.benefits} />
                    </div>
                </div>
            </div>

            {/* ── Recommended Prayers — outside the image zone, back on the
                site's normal background ───────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <RecommendedPrayers currentSlug={prayer.slug || String(prayer.id)} currentDeity={prayer.deity} />
            </div>
        </div>
    );
}
