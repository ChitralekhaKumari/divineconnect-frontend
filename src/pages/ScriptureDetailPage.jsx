import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';
import ChapterVersesModal from '../components/ChapterVersesModal';

export default function ScriptureDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [error, setError] = useState(null);

    const [chapterNumber, setChapterNumber] = useState(null);
    const [chapterData, setChapterData] = useState(null);
    const [loadingChapter, setLoadingChapter] = useState(false);
    const [chapterError, setChapterError] = useState(null);

    const [bookmarks, setBookmarks] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    const isLoggedIn = !!localStorage.getItem('dc_token');

    // Load book metadata + chapter list once
    useEffect(() => {
        let cancelled = false;
        setLoadingMeta(true);
        setError(null);
        scriptureApi.getScripture(slug)
            .then((res) => { if (!cancelled) setMeta(res.data); })
            .catch(() => { if (!cancelled) setError('Unable to load this scripture right now.'); })
            .finally(() => { if (!cancelled) setLoadingMeta(false); });
        return () => { cancelled = true; };
    }, [slug]);

    // Load bookmarked verse ids (best-effort, guests skip)
    useEffect(() => {
        if (!isLoggedIn) return;
        scriptureApi.getBookmarks()
            .then((res) => setBookmarks((res.data || []).map((b) => b.id)))
            .catch(() => { });
    }, [isLoggedIn]);

    // Fetch a chapter's verses and open the modal
    const openChapter = (num) => {
        if (!num) return;
        setChapterNumber(num);
        setChapterData(null);
        setChapterError(null);
        setLoadingChapter(true);
        scriptureApi.getChapter(slug, num)
            .then((res) => {
                setChapterData(res.data);
                if (isLoggedIn && meta) {
                    scriptureApi.updateProgress(meta.id, num, null).catch(() => { });
                }
            })
            .catch(() => setChapterError('Unable to load this chapter right now.'))
            .finally(() => setLoadingChapter(false));
    };

    const closeChapter = () => {
        setChapterNumber(null);
        setChapterData(null);
        setChapterError(null);
    };

    const toggleBookmark = (verseId) => {
        if (!isLoggedIn) return;
        const isBookmarked = bookmarks.includes(verseId);
        setBookmarks((prev) => isBookmarked ? prev.filter((id) => id !== verseId) : [...prev, verseId]);
        const action = isBookmarked ? scriptureApi.removeBookmark : scriptureApi.addBookmark;
        action(verseId).catch(() => {
            setBookmarks((prev) => isBookmarked ? [...prev, verseId] : prev.filter((id) => id !== verseId));
        });
    };

    const copyVerse = (verse) => {
        const text = [verse.sanskrit, verse.transliteration, verse.english].filter(Boolean).join('\n\n');
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(verse.id);
            setTimeout(() => setCopiedId(null), 1500);
        });
    };

    const shareVerse = (verse) => {
        const text = verse.english || verse.sanskrit || '';
        if (navigator.share) {
            navigator.share({ title: meta?.title, text }).catch(() => { });
        } else {
            navigator.clipboard.writeText(text);
            setCopiedId(verse.id);
            setTimeout(() => setCopiedId(null), 1500);
        }
    };

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={() => navigate('/scriptures')}
                    className="flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
                    style={{ color: '#9c8672' }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Scriptures
                </button>

                {loadingMeta && (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading...</span>
                    </div>
                )}

                {error && !loadingMeta && (
                    <div className="text-center py-16 text-sm text-red-500">{error}</div>
                )}

                {meta && !loadingMeta && (
                    <>
                        <span className="section-label">{meta.category?.toUpperCase() || 'SACRED TEXT'}</span>
                        <h1
                            className="text-3xl sm:text-4xl font-bold text-[#2d1a0e] mt-2 mb-2"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {meta.title}
                        </h1>
                        <p className="text-sm text-gray-500 mb-8 max-w-xl">{meta.description}</p>

                        {meta.chapters.length === 0 && (
                            <div className="text-center py-16 text-sm text-gray-400">
                                Chapters for this text are being added soon.
                            </div>
                        )}

                        {/* Chapter buttons, stacked in a column */}
                        {meta.chapters.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {meta.chapters.map((c) => (
                                    <button
                                        key={c.chapter_number}
                                        onClick={() => openChapter(c.chapter_number)}
                                        className="w-full flex items-center justify-between gap-4 px-6 sm:px-8 py-5 rounded-full text-left transition-all hover:opacity-90"
                                        style={{ background: 'linear-gradient(135deg, #f5a742, #e8901f)' }}
                                    >
                                        <span className="text-base sm:text-lg font-bold text-white">
                                            Ch. {c.chapter_number}
                                            {c.title ? ` — ${c.title}` : ''}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-white flex-shrink-0"
                                            style={{ textDecoration: 'underline' }}>
                                            <ArrowRight className="w-4 h-4" style={{ textDecoration: 'none' }} />
                                            View Verses
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Verse popup */}
            {chapterNumber && (
                <ChapterVersesModal
                    scriptureTitle={meta?.title}
                    chapterData={chapterData}
                    loading={loadingChapter}
                    error={chapterError}
                    isLoggedIn={isLoggedIn}
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                    copiedId={copiedId}
                    onCopyVerse={copyVerse}
                    onShareVerse={shareVerse}
                    onNavigateChapter={openChapter}
                    onClose={closeChapter}
                />
            )}
        </div>
    );
}