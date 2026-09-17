import { ArrowRight, BookOpen, ScrollText, Landmark, Sparkles } from 'lucide-react';

// Which glyph represents each grouping level. Falls back to BookOpen for
// anything unrecognised so a new unitLabel never renders blank.
const UNIT_ICONS = {
    Chapter: BookOpen,
    Kanda: ScrollText,
    Book: Landmark,
    Mandala: Sparkles,
};

/**
 * ScriptureChapterCard — one tile in the "All Chapters" grid, and the shared
 * building block behind RamayanaKandaCard / MahabharataParvaCard, so every
 * internal book page (Gita, Ramayana, Mahabharata, Vedas, Upanishads,
 * Puranas, ...) renders through one consistent card design:
 * an icon badge, a bold title, a short description, and a solid colour
 * panel peeking out from behind the card — no photography, no text baked
 * into images.
 */
// Fixed reference palette — sampled directly from the design reference, and
// applied the same way to every card regardless of book, so all Scripture
// cards share one identical color language (not a per-book accent).
const TEAL = '#0b3a3e';      // icon strokes + heading text
const ORANGE = '#ee9075';    // offset panel behind the card + small accents
const BODY_GRAY = '#5c6f70'; // description text — a softer, teal-tinted gray

export default function ScriptureChapterCard({
    number,
    unitLabel = 'Chapter',
    title,
    description,
    meta,
    onRead,
}) {
    const Icon = UNIT_ICONS[unitLabel] || BookOpen;

    return (
        <div className="group relative h-full">
            {/* Solid orange panel, offset behind the card — the "peeking edge" look.
                Stays put on hover; only the front card lifts, so the two layers
                don't drift apart. */}
            <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl"
                style={{ background: ORANGE, transform: 'translate(4px, 4px)' }}
            />

            <div
                role="button"
                tabIndex={0}
                onClick={onRead}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onRead()}
                className="relative z-10 flex h-full flex-col rounded-2xl bg-white text-left cursor-pointer p-6 sm:p-7 transition-shadow duration-200 ease-out"
                style={{ border: '1px solid #eef2f2', boxShadow: '0 1px 3px rgba(11,58,62,0.05), 0 6px 18px rgba(11,58,62,0.06)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(11,58,62,0.08), 0 10px 26px rgba(11,58,62,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(11,58,62,0.05), 0 6px 18px rgba(11,58,62,0.06)'; }}
            >
                <div className="mb-5 flex-shrink-0">
                    <Icon className="w-9 h-9" style={{ color: TEAL }} strokeWidth={1.6} />
                </div>

                {number != null && (
                    <span
                        className="text-[11px] font-semibold mb-1.5 uppercase"
                        style={{ color: ORANGE, fontFamily: 'var(--font-label)', letterSpacing: '0.06em' }}
                    >
                        {unitLabel} {number}
                    </span>
                )}

                <h3
                    className="text-lg sm:text-xl font-semibold leading-snug mb-2"
                    style={{ color: TEAL, fontFamily: 'var(--font-display)' }}
                >
                    {title}
                </h3>

                {description && (
                    <p className="text-sm leading-relaxed line-clamp-3 mb-5" style={{ color: BODY_GRAY }}>
                        {description}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    {meta && (
                        <span
                            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                            style={{ background: '#eef6f6', color: TEAL, border: '1px solid #dcebea' }}
                        >
                            {meta}
                        </span>
                    )}

                    <span
                        className="flex items-center gap-1 text-xs font-semibold ml-auto flex-shrink-0"
                        style={{ color: ORANGE }}
                    >
                        Read
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </div>
            </div>
        </div>
    );
}
