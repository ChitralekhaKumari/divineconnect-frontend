import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';
import ScriptureReader from '../components/ScriptureReader';
import ItemNotFound from '../components/ItemNotFound';
import RamayanaKandaCard from '../components/RamayanaKandaCard';
import { groupChaptersByKanda, parseKandaTitle } from '../utils/ramayanaKandas';
import MahabharataParvaCard from '../components/MahabharataParvaCard';
import { groupChaptersByParva, parseParvaTitle } from '../utils/mahabharataParvas';
import ScriptureChapterCard from '../components/ScriptureChapterCard';
import useSmartBack from '../utils/useSmartBack';
import Reveal from '../components/Reveal';
import WishlistButton from '../components/WishlistButton';
import RecommendedScriptures from '../components/RecommendedScriptures';

export default function ScriptureDetailPage() {
    const { slug } = useParams();
    const goBack = useSmartBack('/scriptures');

    const [meta, setMeta] = useState(null);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    // Ramayana-only: which Kanda's Sarga list is currently open (null = Kanda grid)
    const [selectedKanda, setSelectedKanda] = useState(null);

    // Mahabharata-only: which Parva's Adhyaya list is currently open (null = Parva grid)
    const [selectedParva, setSelectedParva] = useState(null);

    const [chapterNumber, setChapterNumber] = useState(null);
    const [chapterData, setChapterData] = useState(null);
    const [loadingChapter, setLoadingChapter] = useState(false);
    const [chapterError, setChapterError] = useState(null);

    const [copiedId, setCopiedId] = useState(null);
    const readingRef = useRef(null);

    const isLoggedIn = !!localStorage.getItem('dc_token');
    const isRamayana = slug === 'ramayana';
    const isMahabharata = slug === 'mahabharata';
    const isRigveda = slug === 'rigveda';

    // The plain "All Chapters" grid — every scripture that isn't grouped
    // into Kandas/Parvas and isn't currently showing a chapter's verses.
    const isChapterGridView = !isRamayana && !isMahabharata && !chapterNumber
        && !!meta && meta.chapters.length > 0;

    const kandas = useMemo(
        () => (isRamayana && meta ? groupChaptersByKanda(meta.chapters) : []),
        [isRamayana, meta]
    );

    const parvas = useMemo(
        () => (isMahabharata && meta ? groupChaptersByParva(meta.chapters) : []),
        [isMahabharata, meta]
    );

    // Flat {number,label} nav list for the reader's "Jump to Chapter" menu —
    // scoped to whichever grouping context is currently open.
    const readerChapters = useMemo(() => {
        if (isRamayana && selectedKanda) {
            return selectedKanda.chapters.map((c) => ({ number: c.chapter_number, label: c.sargaLabel || c.title }));
        }
        if (isMahabharata && selectedParva) {
            return selectedParva.chapters.map((c) => ({ number: c.chapter_number, label: c.adhyayaLabel || c.title }));
        }
        if (meta) {
            return meta.chapters.map((c) => ({
                number: c.chapter_number,
                label: isRigveda
                    ? (c.title || `Mandala ${c.chapter_number}`)
                    : `Ch. ${c.chapter_number}${c.title ? ` — ${c.title}` : ''}`,
            }));
        }
        return [];
    }, [isRamayana, selectedKanda, isMahabharata, selectedParva, meta, isRigveda]);

    // Load book metadata + chapter list once
    useEffect(() => {
        let cancelled = false;
        setLoadingMeta(true);
        setError(null);
        setNotFound(false);
        setSelectedKanda(null);
        setSelectedParva(null);
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
        const text = [verse.sanskrit, verse.transliteration, verse.english, verse.hindi].filter(Boolean).join('\n\n');
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(verse.id);
            setTimeout(() => setCopiedId(null), 1500);
        });
    };

    const shareVerse = (verse) => {
        const text = [verse.english, verse.hindi].filter(Boolean).join('\n\n') || verse.sanskrit || '';
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
            {/* ── Full-width hero: breaks out of the centered container entirely ── */}
            {meta && !loadingMeta && (
                <Reveal>
                    <div className="relative w-full overflow-hidden" style={{ background: meta.color || '#f5f0e8', minHeight: '440px' }}>
                        {meta.image_url ? (
                            <img
                                src={meta.image_url}
                                alt={meta.title}
                                className="absolute inset-0 w-full h-full object-cover object-center"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        ) : null}
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(180deg, rgba(20,11,5,0.55) 0%, rgba(20,11,5,0.35) 35%, rgba(20,11,5,0.75) 78%, rgba(20,11,5,0.92) 100%)' }} />

                        {/* Floating back button */}
                        <button
                            onClick={chapterNumber ? closeChapter : goBack}
                            className="absolute top-5 left-4 sm:left-6 lg:left-8 flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all z-20"
                            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', color: '#fff' }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {chapterNumber ? 'All Chapters' : 'Back'}
                        </button>

                        {/* Floating wishlist button */}
                        <div className="absolute top-5 right-4 sm:right-6 lg:right-8 z-20">
                            <WishlistButton
                                item={{
                                    type: 'scripture',
                                    id: meta.slug,
                                    title: meta.title,
                                    subtitle: (meta.meta_labels || []).filter((tag) => !/\b(sanskrit|hindi|english)\b/i.test(tag)).join(' · '),
                                    image: meta.image_url,
                                    meta: { emoji: meta.emoji, color: meta.color },
                                }}
                                style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                                idleColor="#ffffff"
                            />
                        </div>

                        {/* Content, inset to align with the rest of the page's content width */}
                        <div className="relative z-10 flex flex-col justify-end h-full min-h-[440px] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 pt-24 pointer-events-none">
                            <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-4 w-fit"
                                style={{ background: 'rgba(255,255,255,0.92)', color: '#a34d07' }}>
                                {meta.category || 'Sacred Text'}
                            </span>
                            <h1
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {meta.title}
                            </h1>
                            <p className="text-white/85 text-base sm:text-lg max-w-2xl mb-6 leading-relaxed">
                                {meta.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
                                {meta.chapters.length > 0 && (
                                    <button
                                        onClick={() => readingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                        className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:brightness-105"
                                        style={{ background: 'linear-gradient(135deg, #f5a742, #e8901f)', color: '#fff' }}
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Start Reading
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Reveal>
            )}

            <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-12 ${chapterNumber || (isRamayana && !selectedKanda) || (isMahabharata && !selectedParva) || isChapterGridView ? 'max-w-6xl' : 'max-w-3xl'}`}>
                {!meta && (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
                        style={{ color: '#9c8672' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                )}

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

                        {/* Breadcrumb — Mahabharata only (Scriptures → Mahabharata → Parva) */}
                        {isMahabharata && (
                            <div className="flex items-center flex-wrap gap-1 text-xs font-medium mb-8" style={{ color: '#9c8672' }}>
                                <button onClick={goBack} className="hover:underline" style={{ color: '#9c8672' }}>Scriptures</button>
                                <span>→</span>
                                {selectedParva ? (
                                    <button onClick={() => setSelectedParva(null)} className="hover:underline" style={{ color: '#9c8672' }}>
                                        {meta.title}
                                    </button>
                                ) : (
                                    <span style={{ color: '#e07c0a' }}>{meta.title}</span>
                                )}
                                {selectedParva && (
                                    <>
                                        <span>→</span>
                                        <span style={{ color: '#e07c0a' }}>{selectedParva.name}</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Breadcrumb — every other scripture's flat "All Chapters" grid */}
                        {isChapterGridView && (
                            <div className="flex items-center flex-wrap gap-1 text-xs font-medium mb-8" style={{ color: '#9c8672' }}>
                                <button onClick={goBack} className="hover:underline" style={{ color: '#9c8672' }}>Scriptures</button>
                                <span>→</span>
                                <span style={{ color: '#e07c0a' }}>All Chapters</span>
                            </div>
                        )}

                        <div ref={readingRef} />

                        {meta.chapters.length === 0 && (
                            <div className="text-center py-16 text-sm text-gray-400">
                                Chapters for this text are being added soon.
                            </div>
                        )}

                        {/* ── Ramayana: Kanda cards → Sarga list ─────────────────────── */}
                        {isRamayana && meta.chapters.length > 0 && !selectedKanda && !chapterNumber && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-up-section">
                                {kandas.map((kanda) => (
                                    <RamayanaKandaCard key={kanda.name} kanda={kanda} onSelect={setSelectedKanda} />
                                ))}
                            </div>
                        )}

                        {isRamayana && selectedKanda && !chapterNumber && (
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

                        {/* ── Mahabharata: Parva cards → Adhyaya list ─────────────────── */}
                        {isMahabharata && meta.chapters.length > 0 && !selectedParva && !chapterNumber && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-up-section">
                                {parvas.map((parva) => (
                                    <MahabharataParvaCard key={parva.name} parva={parva} onSelect={setSelectedParva} />
                                ))}
                            </div>
                        )}

                        {isMahabharata && selectedParva && !chapterNumber && (
                            <div className="fade-up-section">
                                <button
                                    onClick={() => setSelectedParva(null)}
                                    className="flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors"
                                    style={{ color: '#e07c0a' }}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Parvas
                                </button>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                        style={{ background: selectedParva.color }}>
                                        {selectedParva.emoji}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
                                            {selectedParva.name}
                                        </h2>
                                        <p className="text-xs text-gray-400">{selectedParva.chapters.length} Adhyayas</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {selectedParva.chapters.map((c) => (
                                        <button
                                            key={c.chapter_number}
                                            onClick={() => openChapter(c.chapter_number)}
                                            className="w-full flex items-center justify-between gap-4 px-6 sm:px-8 py-5 rounded-full text-left transition-all hover:opacity-90"
                                            style={{ background: 'linear-gradient(135deg, #f5a742, #e8901f)' }}
                                        >
                                            <span className="text-base sm:text-lg font-bold text-white">
                                                {c.adhyayaLabel || c.title}
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

                        {/* ── Every other scripture: All Chapters card grid ─────────────── */}
                        {isChapterGridView && (
                            <div className="relative">
                                {/* Subtle scripture-themed watermark, sits behind the grid */}
                                <div
                                    className="pointer-events-none absolute -top-6 right-0 select-none hidden sm:block"
                                    style={{
                                        fontSize: '13rem',
                                        lineHeight: 1,
                                        color: meta.color || '#f5a742',
                                        opacity: 0.06,
                                        fontFamily: 'var(--font-display)',
                                        zIndex: 0,
                                    }}
                                    aria-hidden="true"
                                >
                                    ॐ
                                </div>

                                <div className="relative z-10 flex items-baseline justify-between gap-3 mb-6 fade-up-section">
                                    <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#2d1a0e', fontFamily: 'var(--font-display)' }}>
                                        Chapters
                                    </h2>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                        {meta.chapters.length} {isRigveda ? 'Mandalas' : 'Chapters'}
                                    </span>
                                </div>

                                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                                    {meta.chapters.map((c, i) => {
                                        const title = isRigveda
                                            ? (c.title || `Mandala ${c.chapter_number}`)
                                            : (c.title || `Chapter ${c.chapter_number}`);
                                        const metaLine = isRigveda
                                            ? `${c.verse_count} Sukta${c.verse_count === 1 ? '' : 's'}`
                                            : `${c.verse_count} Verse${c.verse_count === 1 ? '' : 's'}`;
                                        return (
                                            <Reveal key={c.chapter_number} index={i} className="h-full">
                                                <ScriptureChapterCard
                                                    number={c.chapter_number}
                                                    unitLabel={isRigveda ? 'Mandala' : 'Chapter'}
                                                    title={title}
                                                    meta={metaLine}
                                                    onRead={() => openChapter(c.chapter_number)}
                                                />
                                            </Reveal>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ── Reading experience: replaces the old popup with an inline page ── */}
                        {chapterNumber && (
                            <ScriptureReader
                                scriptureTitle={meta.title}
                                scriptureImage={meta.image_url}
                                scriptureColor={meta.color}
                                scriptureEmoji={meta.emoji}
                                breadcrumb={
                                    isRamayana && selectedKanda ? ['Scriptures', meta.title, selectedKanda.name]
                                        : isMahabharata && selectedParva ? ['Scriptures', meta.title, selectedParva.name]
                                            : undefined
                                }
                                headingOverride={
                                    isRamayana && chapterData ? (parseKandaTitle(chapterData.chapter.title).sargaLabel || chapterData.chapter.title)
                                        : isMahabharata && chapterData ? (parseParvaTitle(chapterData.chapter.title).adhyayaLabel || chapterData.chapter.title)
                                            : isRigveda && chapterData ? (chapterData.chapter.title || `Mandala ${chapterData.chapter.chapter_number}`)
                                                : undefined
                                }
                                chapterSubtitle={
                                    isRigveda && chapterData ? `${chapterData.chapter.verse_count} Suktas` : undefined
                                }
                                chapterData={chapterData}
                                chapters={readerChapters}
                                loading={loadingChapter}
                                error={chapterError}
                                copiedId={copiedId}
                                onCopyVerse={copyVerse}
                                onShareVerse={shareVerse}
                                onNavigateChapter={openChapter}
                                onBackToChapters={closeChapter}
                            />
                        )}

                        <RecommendedScriptures currentSlug={meta.slug} currentCategory={meta.category} />
                    </>
                )}
            </div>
        </div>
    );
}