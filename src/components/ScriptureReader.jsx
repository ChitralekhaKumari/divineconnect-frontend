import { useState, useRef, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, ArrowLeft, Copy, Share2, Check,
    Loader2, BookOpen, List, X,
} from 'lucide-react';
import Reveal from './Reveal';

/**
 * ScriptureReader — a dedicated, full-width reading experience for a single
 * chapter/sukta/sarga/adhyaya, rendered inline in the page (not a popup).
 *
 * Inspired by the layout rhythm of dedicated verse-reading sites (generous
 * reading column, a persistent way to jump chapters/verses, verse-by-verse
 * cards with clearly separated source/translation blocks) — restyled fully
 * in DivineConnect's own warm, temple-inspired design language.
 */
export default function ScriptureReader({
    scriptureTitle,
    scriptureImage,
    scriptureColor,
    scriptureEmoji,
    breadcrumb,
    headingOverride,
    chapterSubtitle,     // e.g. "12 Suktas" / small meta line under the heading
    chapterData,
    chapters = [],        // [{ number, label }] — full nav list for the jump menu
    loading,
    error,
    copiedId,
    onCopyVerse,
    onShareVerse,
    onNavigateChapter,
    onBackToChapters,
}) {
    const [showChapterNav, setShowChapterNav] = useState(false);
    const containerRef = useRef(null);

    // Scroll the reading pane into view when a new chapter loads, so the
    // reader doesn't have to manually scroll up past the old content.
    useEffect(() => {
        if (chapterData) {
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setShowChapterNav(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chapterData?.chapter?.chapter_number]);

    const heading = headingOverride
        ? headingOverride
        : (chapterData
            ? `Chapter ${chapterData.chapter.chapter_number}${chapterData.chapter.title ? ` — ${chapterData.chapter.title}` : ''}`
            : 'Loading chapter…');

    const verses = chapterData?.verses || [];

    return (
        <div ref={containerRef} className="fade-up-section" style={{ scrollMarginTop: '24px' }}>
            {/* ── Reading-pane frame ─────────────────────────────────────── */}
            <div
                className="rounded-3xl overflow-hidden"
                style={{ background: '#fffdf9', border: '1px solid #f0e2c2', boxShadow: '0 4px 28px rgba(74,44,18,0.08)' }}
            >
                {/* Top bar: back / breadcrumb / chapter-jump */}
                <div
                    className="flex items-center justify-between gap-3 px-5 sm:px-8 py-4"
                    style={{ borderBottom: '1px solid #f0e2c2', background: 'linear-gradient(180deg, #fdf6e8 0%, #fffdf9 100%)' }}
                >
                    <button
                        onClick={onBackToChapters}
                        className="flex items-center gap-1.5 text-sm font-semibold transition-colors flex-shrink-0"
                        style={{ color: '#a5743a' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">All Chapters</span>
                    </button>

                    {breadcrumb && breadcrumb.length > 0 && (
                        <p className="text-xs text-gray-400 truncate hidden md:block flex-1 text-center">
                            {breadcrumb.join(' · ')}
                        </p>
                    )}

                    {chapters.length > 1 && (
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={() => setShowChapterNav((s) => !s)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full transition-all"
                                style={{ background: '#f5ead2', color: '#8a5a1e' }}
                            >
                                <List className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Jump to Chapter</span>
                            </button>

                            {showChapterNav && (
                                <div
                                    className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-2xl p-2 z-20 fade-up-section"
                                    style={{ background: '#fff', border: '1px solid #f0e2c2', boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}
                                >
                                    {chapters.map((c) => (
                                        <button
                                            key={c.number}
                                            onClick={() => { onNavigateChapter(c.number); setShowChapterNav(false); }}
                                            className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors"
                                            style={{
                                                background: c.number === chapterData?.chapter?.chapter_number ? '#f5ead2' : 'transparent',
                                                color: c.number === chapterData?.chapter?.chapter_number ? '#8a5a1e' : '#5c4a3a',
                                                fontWeight: c.number === chapterData?.chapter?.chapter_number ? 600 : 400,
                                            }}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Chapter heading block */}
                <div className="px-5 sm:px-8 pt-7 pb-5 flex items-center gap-4">
                    <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
                        style={{ background: scriptureColor || '#f5ead2' }}
                    >
                        {scriptureImage
                            ? <img src={scriptureImage} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            : (scriptureEmoji || '📜')}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#c9882a' }}>
                            {scriptureTitle}
                        </p>
                        <h2
                            className="text-2xl sm:text-3xl font-bold leading-snug"
                            style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)' }}
                        >
                            {heading}
                        </h2>
                        {chapterSubtitle && (
                            <p className="text-xs text-gray-400 mt-1">{chapterSubtitle}</p>
                        )}
                    </div>
                </div>

                {/* Verse quick-nav strip */}
                {verses.length > 1 && (
                    <div className="px-5 sm:px-8 pb-5 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                        {verses.map((v) => (
                            <a
                                key={v.id}
                                href={`#verse-${v.id}`}
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                                style={{ background: '#f7f1e4', color: '#a5743a' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f0dfb3'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f7f1e4'; }}
                            >
                                {v.verse_number}
                            </a>
                        ))}
                    </div>
                )}

                {/* ── Reading content ──────────────────────────────────────── */}
                <div className="px-4 sm:px-8 pb-10" style={{ borderTop: '1px solid #f5ecd8' }}>
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-9 h-9 animate-spin" style={{ color: '#e07c0a' }} />
                            <p className="text-sm text-gray-400">Loading verses…</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-14">
                            <p className="text-red-500 text-sm">{error}</p>
                        </div>
                    )}

                    {chapterData && !loading && !error && (
                        <>
                            {verses.length === 0 && (
                                <div className="text-center py-16 text-sm text-gray-400">
                                    {verses.some?.((v) => v.is_sukta)
                                        ? 'Suktas for this chapter are being added soon.'
                                        : 'Verses for this chapter are being added soon.'}
                                </div>
                            )}

                            <div className="w-full mt-6 space-y-6">
                                {verses.map((verse, vi) => (
                                    <Reveal key={verse.id} index={Math.min(vi, 4)} as="div" id={`verse-${verse.id}`} className="scroll-mt-[110px]">
                                        <VerseCard
                                            verse={verse}
                                            copied={copiedId === verse.id}
                                            onCopy={() => onCopyVerse(verse)}
                                            onShare={() => onShareVerse(verse)}
                                        />
                                    </Reveal>
                                ))}
                            </div>

                            {/* Prev / Next chapter */}
                            <div className="w-full flex items-center justify-between gap-3 pt-10 mt-4" style={{ borderTop: '1px solid #f0e2c2' }}>
                                <NavButton
                                    direction="prev"
                                    disabled={!chapterData.prevChapter}
                                    onClick={() => onNavigateChapter(chapterData.prevChapter)}
                                />
                                <button
                                    onClick={onBackToChapters}
                                    className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all"
                                    style={{ background: '#f5ead2', color: '#8a5a1e' }}
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    All Chapters
                                </button>
                                <NavButton
                                    direction="next"
                                    disabled={!chapterData.nextChapter}
                                    onClick={() => onNavigateChapter(chapterData.nextChapter)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function NavButton({ direction, disabled, onClick }) {
    const isPrev = direction === 'prev';
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
                background: disabled ? '#f5f0e8' : 'linear-gradient(135deg, #f5a742, #e8901f)',
                color: disabled ? '#b3a48f' : '#fff',
            }}
        >
            {isPrev && <ChevronLeft className="w-4 h-4" />}
            {isPrev ? 'Previous' : 'Next'}
            {!isPrev && <ChevronRight className="w-4 h-4" />}
        </button>
    );
}

function VerseCard({ verse, copied, onCopy, onShare }) {
    return (
        <div
            className="rounded-2xl p-5 sm:p-7"
            style={{ background: '#fff', border: '1px solid #f0e2c2', boxShadow: '0 2px 10px rgba(74,44,18,0.05)' }}
        >
            {/* Row: verse badge + actions */}
            <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: '#fdf6e8', color: '#8a5a1e', border: '1px solid #edd9b3' }}
                    >
                        {verse.is_sukta ? `Sukta ${verse.verse_number}` : `Verse ${verse.verse_number}`}
                    </span>
                    {verse.is_sukta && verse.mantra_count != null && (
                        <span
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                            style={{ background: '#fff8e1', color: '#a5750f', border: '1px solid #f0e0ae' }}
                        >
                            {verse.mantra_count} mantra{verse.mantra_count === 1 ? '' : 's'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={onCopy} title="Copy"
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: '#faf5ea' }}>
                        {copied
                            ? <Check className="w-3.5 h-3.5" style={{ color: '#2e7d32' }} />
                            : <Copy className="w-3.5 h-3.5" style={{ color: '#9c8672' }} />}
                    </button>
                    <button onClick={onShare} title="Share"
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: '#faf5ea' }}>
                        <Share2 className="w-3.5 h-3.5" style={{ color: '#9c8672' }} />
                    </button>
                </div>
            </div>

            {/* Sanskrit / source text */}
            {verse.is_sukta && verse.sanskrit ? (
                <ol className="mb-1 space-y-3 list-none">
                    {verse.sanskrit.split('\n\n').map((mantra, idx) => (
                        <li key={idx} className="flex gap-3">
                            <span className="text-xs font-semibold flex-shrink-0 mt-2" style={{ color: '#c9882a' }}>
                                {idx + 1}
                            </span>
                            <p className="text-[1.15rem] leading-[1.5]" style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)' }}>
                                {mantra}
                            </p>
                        </li>
                    ))}
                </ol>
            ) : (
                verse.sanskrit && (
                    <p
                        className="text-[1.15rem] leading-[1.5] mb-1"
                        style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}
                    >
                        {verse.sanskrit}
                    </p>
                )
            )}

            {verse.transliteration && (
                <p className="text-[13px] italic leading-relaxed mt-3" style={{ color: '#b09a80', whiteSpace: 'pre-line' }}>
                    {verse.transliteration}
                </p>
            )}

            {/* Translations — clearly separated blocks, stacked */}
            {(verse.english || verse.hindi) && (
                <div className="mt-5 pt-5 space-y-4 border-t border-dashed" style={{ borderColor: '#edd9b3' }}>
                    {verse.english && (
                        <div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#c9882a' }}>
                                English
                            </span>
                            <p className="text-[15px] leading-[1.85] text-gray-600">{verse.english}</p>
                        </div>
                    )}
                    {verse.hindi && (
                        <div>
                            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#c9882a' }}>
                                हिंदी
                            </span>
                            <p className="text-[15px] leading-[1.85] text-gray-600">{verse.hindi}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Meaning / description, when available */}
            {verse.summary && (
                <div className="mt-5 p-4 rounded-xl" style={{ background: '#fdf9ef', border: '1px solid #f2e6c8' }}>
                    <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#a5750f' }}>
                        Meaning
                    </span>
                    <p className="text-[13.5px] leading-relaxed" style={{ color: '#7d6a54' }}>{verse.summary}</p>
                </div>
            )}
        </div>
    );
}
