import { useEffect, useMemo, useState } from 'react';
import { Clock3, History, Loader2, PlayCircle, Search, Sparkles } from 'lucide-react';
import { bhajanApi } from '../services/bhajanApi';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import BhajanCard, { formatDuration } from '../components/BhajanCard';
import BhajanLyricsModal from '../components/BhajanLyricsModal';
import { getContinueListening, getRecentlyPlayed } from '../utils/bhajanLocal';
import Reveal from '../components/Reveal';

const CATEGORIES = ['All', 'Rama', 'Krishna', 'Shiv', 'Ganesha', 'Vishnu', 'Durga', 'Hanuman', 'Devi', 'Sai Baba'];

const SORT_OPTIONS = [
  { value: 'az', label: 'A-Z' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'mostplayed', label: 'Most Played' },
  { value: 'duration', label: 'Duration' },
];

export default function BhajansPage() {
  const { current, playBhajan } = useAudioPlayer();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');

  const [bhajans, setBhajans] = useState([]);
  const [allBhajans, setAllBhajans] = useState([]); // unfiltered, for lookups + fallbacks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lyricsBhajan, setLyricsBhajan] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [continueListening, setContinueListening] = useState([]);

  // Debounce free-text search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch the unfiltered library once — powers recently played / continue
  // listening / recommendation fallbacks regardless of active filters.
  useEffect(() => {
    bhajanApi.getBhajans({}).then((res) => setAllBhajans(res.data || [])).catch(() => {});
  }, []);

  // Fetch the filtered/sorted grid whenever filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    bhajanApi.getBhajans({ deity: activeCategory, search, sort })
      .then((res) => { if (!cancelled) setBhajans(res.data || []); })
      .catch(() => { if (!cancelled) setError('Unable to load bhajans right now. Please try again later.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeCategory, search, sort]);

  // Recently Played + Continue Listening read from localStorage, refreshed
  // whenever the library loads or a new track starts playing.
  useEffect(() => {
    setRecentlyPlayed(getRecentlyPlayed());
    if (allBhajans.length) {
      const byId = Object.fromEntries(allBhajans.map((b) => [String(b.id), b]));
      setContinueListening(getContinueListening(byId));
    }
  }, [allBhajans, current]);

  // Recommended: based on the track currently playing (or last played)
  useEffect(() => {
    const seed = current || recentlyPlayed[0];
    if (!seed) { setRecommended([]); return; }
    bhajanApi.getRecommended(seed.id, 6)
      .then((res) => setRecommended(res.data || []))
      .catch(() => setRecommended([]));
  }, [current, recentlyPlayed]);

  const recentlyPlayedFull = useMemo(() => {
    if (!allBhajans.length) return [];
    const byId = Object.fromEntries(allBhajans.map((b) => [String(b.id), b]));
    return recentlyPlayed.map((r) => byId[String(r.id)]).filter(Boolean);
  }, [recentlyPlayed, allBhajans]);

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">

        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <Reveal>
          <span className="section-label">DEVOTIONAL MUSIC</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2d1a0e] mt-2 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}>
            Bhajans &amp; Songs
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl">
            Timeless devotional songs to elevate your spirit and connect with the divine.
          </p>
        </Reveal>

        {/* ─── Search + Sort ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, singer, deity, or language..."
              className="w-full pl-11 pr-4 py-3 rounded-full text-sm outline-none transition-all"
              style={{ background: '#fff', border: '1px solid #f5e8d0' }}
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-full text-sm font-semibold outline-none cursor-pointer"
            style={{ background: '#fff', border: '1px solid #f5e8d0', color: '#6b5b4d' }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
            ))}
          </select>
        </div>

        {/* ─── Category filter chips ────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2.5 mt-6 mb-10">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150"
              style={activeCategory === cat
                ? { background: '#f59b24', color: '#fff' }
                : { background: '#f3ece1', color: '#6b5b4d' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* ─── Continue Listening ───────────────────────────────────────── */}
        {continueListening.length > 0 && (
          <Section icon={<Clock3 className="w-4 h-4" />} title="Continue Listening">
            <HorizontalRow>
              {continueListening.map(({ bhajan, seconds }) => (
                <MiniCard key={bhajan.id} bhajan={bhajan}
                  subtitle={`${formatDuration(seconds)} of ${formatDuration(bhajan.duration_seconds)}`}
                  progressPct={(seconds / bhajan.duration_seconds) * 100}
                  onPlay={() => playBhajan(bhajan, allBhajans)} />
              ))}
            </HorizontalRow>
          </Section>
        )}

        {/* ─── Recently Played ──────────────────────────────────────────── */}
        {recentlyPlayedFull.length > 0 && (
          <Section icon={<History className="w-4 h-4" />} title="Recently Played">
            <HorizontalRow>
              {recentlyPlayedFull.map((bhajan) => (
                <MiniCard key={bhajan.id} bhajan={bhajan}
                  subtitle={`${bhajan.deity} · ${bhajan.singer}`}
                  onPlay={() => playBhajan(bhajan, allBhajans)} />
              ))}
            </HorizontalRow>
          </Section>
        )}

        {/* ─── Main grid ─────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading bhajans...</span>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && bhajans.length === 0 && (
          <div className="text-center py-16 text-sm text-gray-400">No bhajans found. Try a different search or category.</div>
        )}

        {!loading && !error && bhajans.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {bhajans.map((bhajan, i) => (
              <Reveal key={bhajan.id} index={i} className="h-full">
                <BhajanCard bhajan={bhajan} bhajanList={bhajans} onViewLyrics={setLyricsBhajan} />
              </Reveal>
            ))}
          </div>
        )}

        {/* ─── Recommended ───────────────────────────────────────────────── */}
        {recommended.length > 0 && (
          <Section icon={<Sparkles className="w-4 h-4" />} title="Recommended For You" topMargin="mt-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recommended.map((bhajan, i) => (
                <Reveal key={bhajan.id} index={i} className="h-full">
                  <BhajanCard bhajan={bhajan} bhajanList={recommended} onViewLyrics={setLyricsBhajan} />
                </Reveal>
              ))}
            </div>
          </Section>
        )}
      </div>

      {lyricsBhajan && (
        <BhajanLyricsModal bhajan={lyricsBhajan} bhajanList={bhajans} onClose={() => setLyricsBhajan(null)} />
      )}
    </div>
  );
}

// ─── Small local presentational helpers ────────────────────────────────────

function Section({ icon, title, children, topMargin = 'mt-2' }) {
  return (
    <div className={`${topMargin} mb-10`}>
      <div className="flex items-center gap-2 mb-4" style={{ color: '#a34d07' }}>
        {icon}
        <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function HorizontalRow({ children }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {children}
    </div>
  );
}

function MiniCard({ bhajan, subtitle, progressPct, onPlay }) {
  return (
    <button onClick={onPlay}
      className="flex items-center gap-3 flex-shrink-0 w-64 p-3 rounded-2xl text-left transition-all hover:shadow-md"
      style={{ background: '#fff', border: '1px solid #f5e8d0' }}>
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img src={bhajan.cover_image} alt={bhajan.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <PlayCircle className="w-5 h-5 text-white" fill="rgba(255,255,255,0.2)" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#2d1a0e] truncate">{bhajan.title}</p>
        <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>
        {typeof progressPct === 'number' && (
          <div className="h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: '#f5e8d0' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, progressPct)}%`, background: '#e07c0a' }} />
          </div>
        )}
      </div>
    </button>
  );
}
