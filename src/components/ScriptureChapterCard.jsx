import { List } from 'lucide-react';

/**
 * ScriptureChapterCard — one tile in the "All Chapters" grid (2-per-row).
 *
 * Plain, content-first card — no imagery. Chapter label, title, an
 * optional description, and a small icon + meta line (verse/sukta count)
 * pinned to the bottom so every card in a row lines up regardless of how
 * much text it holds. The whole card is clickable (acts as the "Read
 * Chapter" action).
 */
export default function ScriptureChapterCard({
    number,
    unitLabel = 'Chapter',
    title,
    description,
    meta,
    onRead,
}) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onRead}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onRead()}
            className="group flex h-full flex-col rounded-2xl bg-white p-7 sm:p-8 text-left cursor-pointer shadow-card-md transition-all duration-300 hover:-translate-y-1"
            style={{ border: '1px solid #f0e2c2' }}
        >
            <span
                className="text-sm font-bold mb-2"
                style={{ color: '#e07c0a' }}
            >
                {unitLabel} {number}
            </span>

            <h3
                className="text-2xl sm:text-[1.7rem] font-bold leading-snug mb-3"
                style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)' }}
            >
                {title}
            </h3>

            {description && (
                <p className="text-[15px] leading-relaxed text-gray-500 mb-6">
                    {description}
                </p>
            )}

            {meta && (
                <div className="mt-auto flex items-center gap-2 pt-2 text-sm" style={{ color: '#9c8672' }}>
                    <List className="w-4 h-4" />
                    {meta}
                </div>
            )}
        </div>
    );
}
