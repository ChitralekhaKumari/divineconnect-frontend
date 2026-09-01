import { X, ChevronLeft, ChevronRight, Copy, Share2, Loader2, Check } from 'lucide-react';

export default function ChapterVersesModal({
    scriptureTitle,
    breadcrumb,       // optional string[] — e.g. ['Scriptures', 'Ramayan', 'Bala Kanda'] — shown above the title
    headingOverride,  // optional string — replaces the default "Ch. N — Title" heading
    chapterData,
    loading,
    error,
    copiedId,
    onCopyVerse,
    onShareVerse,
    onNavigateChapter,
    onClose,
}) {
    const heading = headingOverride
        ? headingOverride
        : (chapterData
            ? `Ch. ${chapterData.chapter.chapter_number}${chapterData.chapter.title ? ` — ${chapterData.chapter.title}` : ''}`
            : 'Loading chapter…');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

                {/* Header */}
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4"
                    style={{ borderBottom: '1px solid #f5e8d0' }}>
                    <div className="min-w-0">
                        {breadcrumb && breadcrumb.length > 0 && (
                            <p className="text-[11px] text-gray-400 mb-1 truncate">{breadcrumb.join(' → ')}</p>
                        )}
                        {!breadcrumb && <p className="text-xs text-gray-400 mb-1">{scriptureTitle}</p>}
                        <h2 className="text-xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
                            {heading}
                        </h2>
                    </div>
                    <button onClick={onClose}
                        className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all shadow-lg flex-shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <Loader2 className="w-10 h-10 text-[#e07c0a] animate-spin" />
                            <p className="text-sm text-gray-500">Loading verses…</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-10">
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        </div>
                    )}

                    {chapterData && !loading && !error && (
                        <>
                            {chapterData.verses.length === 0 && (
                                <div className="text-center py-12 text-sm text-gray-400">
                                    {chapterData.verses.some?.((v) => v.is_sukta)
                                        ? 'Suktas for this chapter are being added soon.'
                                        : 'Verses for this chapter are being added soon.'}
                                </div>
                            )}

                            <div className="space-y-6">
                                {chapterData.verses.map((verse) => (
                                    <div
                                        key={verse.id}
                                        className="rounded-2xl p-5"
                                        style={{ background: '#fdfaf5', border: '1px solid #f5e8d0' }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    className="text-xs font-semibold px-3 py-1 rounded-full inline-block"
                                                    style={{ background: '#f5f0e8', color: '#6b5b4d', border: '1px solid #edd9b3' }}
                                                >
                                                    {verse.is_sukta ? `Sukta ${verse.verse_number}` : `Verse ${verse.verse_number}`}
                                                </span>
                                                {verse.is_sukta && verse.mantra_count != null && (
                                                    <span
                                                        className="text-[11px] font-medium px-2.5 py-1 rounded-full inline-block"
                                                        style={{ background: '#fff8e1', color: '#a5750f', border: '1px solid #f0e0ae' }}
                                                    >
                                                        {verse.mantra_count} mantra{verse.mantra_count === 1 ? '' : 's'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => onCopyVerse(verse)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                                    style={{ background: '#f7f2ea' }}
                                                    title="Copy"
                                                >
                                                    {copiedId === verse.id
                                                        ? <Check className="w-3.5 h-3.5" style={{ color: '#2e7d32' }} />
                                                        : <Copy className="w-3.5 h-3.5" style={{ color: '#9c8672' }} />}
                                                </button>
                                                <button
                                                    onClick={() => onShareVerse(verse)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                                    style={{ background: '#f7f2ea' }}
                                                    title="Share"
                                                >
                                                    <Share2 className="w-3.5 h-3.5" style={{ color: '#9c8672' }} />
                                                </button>
                                            </div>
                                        </div>

                                        {verse.is_sukta && verse.sanskrit ? (
                                            // Suktas hold multiple mantra lines (joined by a blank line) —
                                            // render each as its own numbered stanza rather than one block.
                                            <ol className="mb-1 space-y-2.5 list-none">
                                                {verse.sanskrit.split('\n\n').map((mantra, idx) => (
                                                    <li key={idx} className="flex gap-2.5">
                                                        <span
                                                            className="text-xs font-semibold flex-shrink-0 mt-1.5"
                                                            style={{ color: '#c9882a' }}
                                                        >
                                                            {idx + 1}
                                                        </span>
                                                        <p
                                                            className="text-lg leading-relaxed"
                                                            style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)' }}
                                                        >
                                                            {mantra}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            verse.sanskrit && (
                                                <p
                                                    className="text-lg mb-3 leading-relaxed"
                                                    style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}
                                                >
                                                    {verse.sanskrit}
                                                </p>
                                            )
                                        )}
                                        {verse.transliteration && (
                                            <p className="text-sm italic text-gray-400 mb-3 mt-3" style={{ whiteSpace: 'pre-line' }}>{verse.transliteration}</p>
                                        )}
                                        {verse.english && (
                                            <p className="text-sm text-gray-600 leading-relaxed mt-3">{verse.english}</p>
                                        )}
                                        {verse.hindi && (
                                            <p className="text-sm text-gray-600 leading-relaxed mt-2 pt-2" style={{ borderTop: '1px dashed #edd9b3' }}>
                                                {verse.hindi}
                                            </p>
                                        )}
                                        {verse.is_sukta && verse.summary && (
                                            <p className="text-xs text-gray-400 mt-3 pt-2" style={{ borderTop: '1px dashed #edd9b3' }}>
                                                {verse.summary}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Chapter navigation + bottom close */}
                            <div className="flex items-center justify-between pt-6 mt-2" style={{ borderTop: '1px solid #f5e8d0' }}>
                                <button
                                    disabled={!chapterData.prevChapter}
                                    onClick={() => onNavigateChapter(chapterData.prevChapter)}
                                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    style={{ color: '#e07c0a' }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>

                                <button onClick={onClose}
                                    className="px-6 py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                                    style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
                                    Close
                                </button>

                                <button
                                    disabled={!chapterData.nextChapter}
                                    onClick={() => onNavigateChapter(chapterData.nextChapter)}
                                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    style={{ color: '#e07c0a' }}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}