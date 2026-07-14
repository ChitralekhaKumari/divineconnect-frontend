import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';
import ChapterVersesModal from '../components/ChapterVersesModal';
import ItemNotFound from '../components/ItemNotFound';
import RamayanaKandaCard from '../components/RamayanaKandaCard';
import { groupChaptersByKanda, parseKandaTitle } from '../utils/ramayanaKandas';
import useSmartBack from '../utils/useSmartBack';

export default function ScriptureDetailPage() {
    const { slug } = useParams();
    const goBack = useSmartBack('/scriptures');

    const [meta, setMeta] = useState(null);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    // Ramayana-only: which Kanda's Sarga list is currently open (null = Kanda grid)
    const [selectedKanda, setSelectedKanda] = useState(null);

    const [chapterNumber, setChapterNumber] = useState(null);
    const [chapterData, setChapterData] = useState(null);
    const [loadingChapter, setLoadingChapter] = useState(false);
    const [chapterError, setChapterError] = useState(null);

    const [copiedId, setCopiedId] = useState(null);

    const isLoggedIn = !!localStorage.getItem('dc_token');
    const isRamayana = slug === 'ramayana';

    const kandas = useMemo(
        () => (isRamayana && meta ? groupChaptersByKanda(meta.chapters) : []),
        [isRamayana, meta]
    );

    // Load book metadata + chapter list once
    useEffect(() => {
        let cancelled = false;
        setLoadingMeta(true);
        setError(null);
        setNotFound(false);
        setSelectedKanda(null);
        scriptureApi.getScripture(slug)
            .then((res) => { if (!cancelled) setMeta(res.data); })
            .catch((err) => {
                if (cancelled) return;
                if (err.status === 404) setNotFound(true);
                else setError('Unable to load this scripture right now.');
            })
            .finally(() => { if (!cancelled) setLoadingMeta(false); });
        return () => { cancelled = true; };
    }, [slug]);

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
                if (isLoggedIn) {
                    scriptureApi.updateProgress(slug, num, null).catch(() => { });
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

    if (notFound) {
        return (
            <ItemNotFound
                title="Scripture not found"
                message="This scripture may have been removed, or the link you used is incorrect."
                backLabel="Back to Scriptures"
                backPath="/scriptures"
            />
        );
    }

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
            <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-12 ${isRamayana && !selectedKanda ? 'max-w-6xl' : 'max-w-3xl'}`}>
                <button
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
                    style={{ color: '#9c8672' }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
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
                        <p className="text-sm text-gray-500 mb-6 max-w-xl">{meta.description}</p>

                        {/* Breadcrumb — Ramayana only (Scriptures → Ramayan → Kanda) */}
                        {isRamayana && (
                            <div className="flex items-center flex-wrap gap-1 text-xs font-medium mb-8" style={{ color: '#9c8672' }}>
                                <button onClick={goBack} className="hover:underline" style={{ color: '#9c8672' }}>Scriptures</button>
                                <span>→</span>
                                {selectedKanda ? (
                                    <button onClick={() => setSelectedKanda(null)} className="hover:underline" style={{ color: '#9c8672' }}>
                                        {meta.title}
                                    </button>
                                ) : (
                                    <span style={{ color: '#e07c0a' }}>{meta.title}</span>
                                )}
                                {selectedKanda && (
                                    <>
                                        <span>→</span>
                                        <span style={{ color: '#e07c0a' }}>{selectedKanda.name}</span>
                                    </>
                                )}
                            </div>
                        )}

                        {meta.chapters.length === 0 && (
                            <div className="text-center py-16 text-sm text-gray-400">
                                Chapters for this text are being added soon.
                            </div>
                        )}

                        {/* ── Ramayana: Kanda cards → Sarga list ─────────────────────── */}
                        {isRamayana && meta.chapters.length > 0 && !selectedKanda && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-up-section">
                                {kandas.map((kanda) => (
                                    <RamayanaKandaCard key={kanda.name} kanda={kanda} onSelect={setSelectedKanda} />
                                ))}
                            </div>
                        )}

                        {isRamayana && selectedKanda && (
                            <div className="fade-up-section">
                                <button
                                    onClick={() => setSelectedKanda(null)}
                                    className="flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors"
                                    style={{ color: '#e07c0a' }}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Kandas
                                </button>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                        style={{ background: selectedKanda.color }}>
                                        {selectedKanda.emoji}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
                                            {selectedKanda.name}
                                        </h2>
                                        <p className="text-xs text-gray-400">{selectedKanda.chapters.length} Sargas</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {selectedKanda.chapters.map((c) => (
                                        <button
                                            key={c.chapter_number}
                                            onClick={() => openChapter(c.chapter_number)}
                                            className="w-full flex items-center justify-between gap-4 px-6 sm:px-8 py-5 rounded-full text-left transition-all hover:opacity-90"
                                            style={{ background: 'linear-gradient(135deg, #f5a742, #e8901f)' }}
                                        >
                                            <span className="text-base sm:text-lg font-bold text-white">
                                                {c.sargaLabel || c.title}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-white flex-shrink-0"
                                                style={{ textDecoration: 'underline' }}>
                                                <ArrowRight className="w-4 h-4" style={{ textDecoration: 'none' }} />
                                                View Verses
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Every other scripture: original flat chapter list, unchanged ── */}
                        {!isRamayana && meta.chapters.length > 0 && (
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
                    breadcrumb={isRamayana && selectedKanda ? ['Scriptures', meta?.title, selectedKanda.name] : undefined}
                    headingOverride={isRamayana && chapterData ? (parseKandaTitle(chapterData.chapter.title).sargaLabel || chapterData.chapter.title) : undefined}
                    chapterData={chapterData}
                    loading={loadingChapter}
                    error={chapterError}
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