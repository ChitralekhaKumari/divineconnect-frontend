import { Music2, Pause, Play, ScrollText } from 'lucide-react';
import WishlistButton from './WishlistButton';
import { useAudioPlayer } from '../context/AudioPlayerContext';

function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, '0')}`;
}

// bhajanList = the currently visible/filtered list, so Next/Prev in the
// player follow whatever the user was browsing when they hit Play.
export default function BhajanCard({ bhajan, bhajanList, onViewLyrics }) {
  const { current, isPlaying, playBhajan, togglePlay } = useAudioPlayer();
  const isThisPlaying = current?.id === bhajan.id && isPlaying;
  const isThisLoaded = current?.id === bhajan.id;

  function handlePlayClick() {
    // Same bhajan already loaded -> just toggle play/pause on the shared
    // player. Otherwise load *this* bhajan's own audio_url and start it,
    // scoped to the list this card was rendered in (so Next/Prev + the
    // deity filter chips stay consistent with what's on screen).
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
      className="card flex flex-col h-full"
      style={{
        padding: '14px',
        border: isThisLoaded ? '1.5px solid #f59b24' : '1px solid #f5e8d0',
      }}
    >
      {/* Icon badge + wishlist */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f59b24, #e07c0a)' }}
        >
          <Music2 className="w-5 h-5 text-white" />
        </div>
        <WishlistButton item={wishlistItem} size="sm" />
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-base font-semibold text-[#2d1a0e] leading-snug line-clamp-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {bhajan.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 truncate">
          {bhajan.deity} · {bhajan.language}
        </p>
        <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: '#e07c0a' }}>
          {bhajan.singer}
        </p>
      </div>

      {/* Play + Lyrics */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handlePlayClick}
          aria-label={isThisPlaying ? 'Pause' : 'Play'}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:brightness-105"
          style={{ background: 'linear-gradient(135deg, #f59b24, #e07c0a)' }}
        >
          {isThisPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" fill="white" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" fill="white" />
              Play
            </>
          )}
        </button>
        <button
          onClick={() => onViewLyrics(bhajan)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{ background: '#f3ece1', color: '#5c3317' }}
        >
          <ScrollText className="w-3.5 h-3.5" />
          Lyrics
        </button>
      </div>
    </div>
  );
}

export { formatDuration };
