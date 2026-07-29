import { Music2, Pause, Play, X } from 'lucide-react';
import WishlistButton from './WishlistButton';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export default function BhajanLyricsModal({ bhajan, bhajanList, onClose }) {
  const { current, isPlaying, playBhajan, togglePlay } = useAudioPlayer();
  if (!bhajan) return null;

  const isThisPlaying = current?.id === bhajan.id && isPlaying;
  const isThisLoaded = current?.id === bhajan.id;

  function handlePlayClick() {
    if (isThisLoaded) togglePlay();
    else playBhajan(bhajan, bhajanList);
  }

  const wishlistItem = {
    type: 'bhajan',
    id: bhajan.id,
    title: bhajan.title,
    subtitle: `${bhajan.deity} · ${bhajan.singer}`,
    image: bhajan.cover_image,
    meta: { emoji: '🎵' },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-2">
          <div className="flex items-center gap-4 min-w-0">
            <img src={bhajan.cover_image} alt={bhajan.title}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[#2d1a0e] truncate" style={{ fontFamily: 'var(--font-display)' }}>
                {bhajan.title}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {bhajan.deity} · {bhajan.singer} · {bhajan.language}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handlePlayClick} aria-label={isThisPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
              {isThisPlaying
                ? <Pause className="w-4 h-4 text-white" fill="white" />
                : <Play className="w-4 h-4 text-white ml-0.5" fill="white" />}
            </button>
            <WishlistButton item={wishlistItem} />
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all shadow-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 pt-4">
          <div className="rounded-xl p-4 sm:p-5" style={{ background: '#fdfaf5', border: '1px solid #f5e8d0' }}>

            <div className="flex items-center gap-1.5 mb-1">
              <Music2 className="w-3.5 h-3.5" style={{ color: '#e07c0a' }} />
              <p className="text-xs font-semibold" style={{ color: '#e07c0a' }}>
                {bhajan.language === 'Hindi' || bhajan.language === 'Awadhi' || bhajan.language === 'Marathi' ? 'HINDI / ORIGINAL' : 'SANSKRIT / ORIGINAL'}
              </p>
            </div>
            <p className="text-base sm:text-lg text-[#2d1a0e] leading-relaxed mb-4"
              style={{ fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}>
              {bhajan.lyrics_original}
            </p>

            <p className="text-xs font-semibold mb-1" style={{ color: '#e07c0a' }}>ENGLISH TRANSLITERATION</p>
            <p className="text-xs sm:text-sm text-gray-600 italic mb-4" style={{ whiteSpace: 'pre-line' }}>
              {bhajan.lyrics_transliteration}
            </p>

            <div>
              <p className="text-xs font-semibold text-[#5c4a3a] mb-1">ENGLISH MEANING</p>
              <p className="text-sm text-gray-600 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                {bhajan.lyrics_meaning}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-5">
            <button onClick={onClose}
              className="px-6 py-3 rounded-full text-sm font-semibold border border-[#e8d5b0] text-white hover:bg-[#e47b02] transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
