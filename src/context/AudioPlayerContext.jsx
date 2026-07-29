import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { bhajanApi } from '../services/bhajanApi';
import { addRecentlyPlayed, getProgress, saveProgress } from '../utils/bhajanLocal';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
  }

  const [queue, setQueue] = useState([]);       // list of bhajan objects currently browsable
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [current, setCurrent] = useState(null); // the bhajan object playing right now
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState('off');   // 'off' | 'all' | 'one'
  const [shuffle, setShuffle] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasRecordedPlay = useRef(new Set());

  // ─── Wire up the underlying <audio> element once ─────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onEnded = () => handleEnded();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save "continue listening" progress periodically + on pause/unmount.
  useEffect(() => {
    if (!current) return;
    const id = setInterval(() => {
      const audio = audioRef.current;
      if (audio && audio.currentTime > 0) saveProgress(current.id, audio.currentTime);
    }, 4000);
    return () => clearInterval(id);
  }, [current]);

  function loadAndPlay(bhajan, resumeSeconds = 0) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = bhajan.audio_url;
    audio.currentTime = resumeSeconds || 0;
    audio.volume = muted ? 0 : volume;
    setCurrent(bhajan);
    setCurrentTime(resumeSeconds || 0);
    setDuration(bhajan.duration_seconds || 0);
    audio.play().catch(() => {});

    addRecentlyPlayed(bhajan);
    if (!hasRecordedPlay.current.has(bhajan.id)) {
      hasRecordedPlay.current.add(bhajan.id);
      bhajanApi.recordPlay(bhajan.id);
    }
  }

  // Play a bhajan. queueList (optional) becomes the new "up next" context —
  // pass the currently filtered/visible list so Next/Prev/Shuffle make sense.
  const playBhajan = useCallback((bhajan, queueList) => {
    const list = queueList && queueList.length ? queueList : [bhajan];
    const idx = list.findIndex((b) => b.id === bhajan.id);
    setQueue(list);
    setCurrentIndex(idx === -1 ? 0 : idx);

    const resumeSeconds = getProgress(bhajan.id);
    loadAndPlay(bhajan, resumeSeconds < (bhajan.duration_seconds - 5) ? resumeSeconds : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [current]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seek = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  function pickNextIndex(dir) {
    if (queue.length === 0) return -1;
    if (shuffle) {
      if (queue.length === 1) return 0;
      let idx;
      do { idx = Math.floor(Math.random() * queue.length); } while (idx === currentIndex);
      return idx;
    }
    let idx = currentIndex + dir;
    if (idx >= queue.length) idx = repeat === 'all' ? 0 : -1;
    if (idx < 0) idx = repeat === 'all' ? queue.length - 1 : -1;
    return idx;
  }

  const next = useCallback(() => {
    const idx = pickNextIndex(1);
    if (idx === -1) return;
    setCurrentIndex(idx);
    loadAndPlay(queue[idx]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, shuffle, repeat, volume, muted]);

  const prev = useCallback(() => {
    // Restart current track if we're more than 3s in (standard player UX)
    if (currentTime > 3) { seek(0); return; }
    const idx = pickNextIndex(-1);
    if (idx === -1) return;
    setCurrentIndex(idx);
    loadAndPlay(queue[idx]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, shuffle, repeat, currentTime, volume, muted]);

  function handleEnded() {
    if (current) saveProgress(current.id, 0); // finished — clear resume point
    if (repeat === 'one') {
      seek(0);
      audioRef.current?.play().catch(() => {});
      return;
    }
    next();
  }

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    setMuted(false);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
      return next;
    });
  }, [volume]);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const value = {
    current, isPlaying, currentTime, duration, volume, muted, repeat, shuffle, loading, queue,
    playBhajan, togglePlay, pause, seek, next, prev, setVolume, toggleMute, cycleRepeat, toggleShuffle,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
