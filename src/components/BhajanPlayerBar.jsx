import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { formatDuration } from './BhajanCard';

export default function BhajanPlayerBar() {
  const {
    current, isPlaying, currentTime, duration, volume, muted, repeat, shuffle,
    togglePlay, seek, next, prev, setVolume, toggleMute, cycleRepeat, toggleShuffle, pause,
  } = useAudioPlayer();

  // This bar is mounted once, globally, in App.jsx (below <Footer />), so it
  // survives route changes. Without a route check it would keep showing on
  // Temples/Prayers/Scriptures/Calendar/etc. the moment any bhajan starts
  // playing. Restrict it to the Bhajans page only.
  const location = useLocation();
  const onBhajansPage = location.pathname.startsWith('/bhajans');

  // Also stop playback when leaving the Bhajans page, so audio never keeps
  // running in the background on a page with no visible controls for it.
  useEffect(() => {
    if (!onBhajansPage && isPlaying) pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onBhajansPage]);

  if (!current || !onBhajansPage) return null;

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  function handleSeek(e) {
    const pct = Number(e.target.value);
    seek((pct / 100) * duration);
  }

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ background: '#fffdf9', borderTop: '1px solid #f5e8d0', boxShadow: '0 -8px 30px rgba(0,0,0,0.08)' }}
    >
      {/* Seek bar */}
      <div className="relative w-full h-1 group cursor-pointer" style={{ background: '#f5e8d0' }}>
        <div className="absolute inset-y-0 left-0 transition-all" style={{ width: `${progressPct}%`, background: '#e07c0a' }} />
        <input
          type="range" min="0" max="100" step="0.1" value={progressPct} onChange={handleSeek}
          aria-label="Seek"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-3 sm:gap-6">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 w-2/5 sm:w-1/4">
          <img src={current.cover_image} alt={current.title} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2d1a0e] truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {current.title}
            </p>
            <p className="text-[11px] text-gray-400 truncate">{current.deity} · {current.singer}</p>
          </div>
        </div>

        {/* Transport controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
          <button onClick={toggleShuffle} aria-label="Shuffle" aria-pressed={shuffle}
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center"
            style={{ color: shuffle ? '#e07c0a' : '#b8a790' }}>
            <Shuffle className="w-4 h-4" />
          </button>

          <button onClick={prev} aria-label="Previous" className="w-9 h-9 rounded-full flex items-center justify-center text-[#5c4a3a] hover:text-[#e07c0a]">
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>

          <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
            {isPlaying
              ? <Pause className="w-5 h-5 text-white" fill="white" />
              : <Play className="w-5 h-5 text-white ml-0.5" fill="white" />}
          </button>

          <button onClick={next} aria-label="Next" className="w-9 h-9 rounded-full flex items-center justify-center text-[#5c4a3a] hover:text-[#e07c0a]">
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>

          <button onClick={cycleRepeat} aria-label="Repeat" aria-pressed={repeat !== 'off'}
            className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center"
            style={{ color: repeat !== 'off' ? '#e07c0a' : '#b8a790' }}>
            <RepeatIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Time + volume */}
        <div className="hidden sm:flex items-center gap-3 w-1/4 justify-end">
          <span className="text-[11px] text-gray-400 tabular-nums whitespace-nowrap">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
          <button onClick={toggleMute} aria-label="Mute" className="text-[#5c4a3a]">
            <VolumeIcon className="w-4 h-4" />
          </button>
          <input
            type="range" min="0" max="1" step="0.01" value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume" className="w-20 accent-[#e07c0a]"
          />
        </div>

        {/* Mobile: just elapsed time */}
        <span className="sm:hidden text-[11px] text-gray-400 tabular-nums whitespace-nowrap">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </span>
      </div>
    </div>
  );
}
