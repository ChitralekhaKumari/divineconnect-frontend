import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Loader2, X, BookOpen } from 'lucide-react';
import { prayerApi } from '../services/prayerApi';
import PrayerCard from '../components/PrayerCard';
import Reveal from '../components/Reveal';

const CATEGORIES = ['All', 'Shiva', 'Krishna', 'Rama', 'Hanuman', 'Ganesha', 'Durga', 'Lakshmi', 'Saraswati', 'Vishnu', 'Surya', 'Other Deities'];

// Deities that have their own dedicated pill above; anything else falls
// under "Other Deities" for filtering purposes only (data is unchanged).
const NAMED_DEITIES = new Set(['Shiva', 'Krishna', 'Rama', 'Hanuman', 'Ganesha', 'Durga', 'Lakshmi', 'Saraswati', 'Vishnu', 'Surya']);

export default function PrayersPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get('open');
  const handledOpenId = useRef(null);

  // All prayers are fetched once; category + search filtering happens client-side
  // so the search bar and the deity pills can work together instantly.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    prayerApi
      .getPrayers('All')
      .then((res) => { if (!cancelled) setPrayers(res.data || []); })
      .catch(() => { if (!cancelled) setError('Unable to load prayers right now. Please try again later.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // Legacy deep-link support: ?open=<slug> (e.g. from Wishlist) now forwards
  // straight to the dedicated prayer page instead of a modal.
  useEffect(() => {
    if (!openId || handledOpenId.current === openId) return;
    handledOpenId.current = openId;
    navigate(`/prayers/${openId}`, { replace: true });
  }, [openId, navigate]);

  const filtered = useMemo(() => {
    let list = prayers;

    if (activeCategory !== 'All') {
      list = activeCategory === 'Other Deities'
        ? list.filter((p) => !NAMED_DEITIES.has(p.deity))
        : list.filter((p) => p.deity === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(q) || p.deity?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [prayers, activeCategory, query]);

  const isCategoryView = activeCategory !== 'All' || query.trim() !== '';

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>

      {/* Hero — same structure/feel as the Scriptures hero: gradient base,
          full-bleed spiritual background image, centered content, search
          bar directly beneath the text. */}
      <div className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2d1a0e 0%, #5c3317 45%, #3a2010 100%)' }}>
        <div className="absolute inset-0 opacity-[0.8]"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/ab/bb/79/abbb79d2a1a2933494f5e97579e8d005.jpg')",
            backgroundSize: 'cover', backgroundPosition: 'center center',
          }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(45,26,14,0.5) 0%, rgba(92,51,23,0.35) 45%, rgba(58,32,16,0.5) 100%)' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(232,166,53,0.18), transparent 70%)' }} />

        <Reveal as="div" className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-5"
            style={{ background: 'rgba(249,187,92,0.15)', color: '#f9bb5c', border: '1px solid rgba(249,187,92,0.3)', fontFamily: 'var(--font-label)' }}>
            <BookOpen className="w-3 h-3" />
            SACRED TEXTS
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5"
            style={{ fontFamily: 'var(--font-display)' }}>
            Prayer Library
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto mb-9 leading-relaxed">
            A collection of powerful mantras and prayers for daily devotion — Sanskrit verses,
            meanings, and benefits for every deity.
          </p>

          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prayers or mantras by name..."
              className="w-full pl-11 pr-10 py-3.5 rounded-full text-sm outline-none shadow-lg"
              style={{ background: 'rgba(255,255,255,0.97)', color: '#2d1a0e' }}
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2.5 mb-10">
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

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading prayers...</span>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-sm text-gray-400">No prayers found. Try a different search or filter.</div>
        )}

        {/* Prayer grid — 2/row for the full "All" listing, 3/row once a
            category or search narrows it down, auto-adjusting to fewer cards. */}
        {!loading && !error && filtered.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isCategoryView ? 'lg:grid-cols-3' : ''} gap-6 sm:gap-8 items-stretch`}>
            {filtered.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
