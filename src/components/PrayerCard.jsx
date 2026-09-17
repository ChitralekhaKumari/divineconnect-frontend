import { useNavigate } from 'react-router-dom';
import { getDeityImage } from '../utils/deityImages';
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

/**
 * PrayerCard — the shared card design for every prayer/mantra tile across
 * the Prayers section (listing grid, category grid, recommended strip).
 * Horizontal layout: a small square deity thumbnail (with a decorative
 * parchment caption strip) on the left, title + meta on the right.
 */
export default function PrayerCard({ prayer, compact = false }) {
    const navigate = useNavigate();
    const href = `/prayers/${prayer.slug || prayer.id}`;
    const thumbSize = compact ? 'w-24 h-32 sm:w-28 sm:h-36' : 'w-28 h-36 sm:w-32 sm:h-40';

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => navigate(href)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(href)}
            className="group bg-white rounded-2xl overflow-hidden cursor-pointer h-full flex items-stretch shadow-card-md transition-shadow duration-200 hover:shadow-card-lg"
            style={{ border: '1px solid #f5e8d0', minHeight: compact ? '144px' : '160px' }}
        >
            {/* Thumbnail with a decorative bottom caption strip */}
            <div className={`relative ${thumbSize} flex-shrink-0 overflow-hidden`}>
                <img
                    src={prayer.image || getDeityImage(prayer.deity, 160)}
                    alt={prayer.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    onError={(e) => { e.currentTarget.src = getDeityImage(prayer.deity, 160); }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pt-1.5 pb-1.5 px-1"
                    style={{ background: 'rgba(253, 240, 216, 0.92)' }}>
                    <span style={{ color: '#c9882a', fontSize: '7px', letterSpacing: '2px' }}>✿✿✿✿✿</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-center leading-tight mt-0.5"
                        style={{ color: '#7a4a1a', fontFamily: 'var(--font-display)' }}>
                        {prayer.deity}
                    </span>
                </div>
            </div>

            {/* Title + meta */}
            <div className="flex flex-1 items-center justify-between gap-3 px-4 sm:px-5 py-4 min-w-0">
                <div className="min-w-0">
                    <h3
                        className="font-semibold leading-snug truncate sm:text-wrap sm:line-clamp-2"
                        style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)', fontSize: compact ? '1.05rem' : '1.2rem' }}
                    >
                        {prayer.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1.5">
                        {prayer.deity} · {prayer.frequency}
                    </p>
                </div>
                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <WishlistButton item={toWishlistItem(prayer)} size="sm" />
                </div>
            </div>
        </div>
    );
}
