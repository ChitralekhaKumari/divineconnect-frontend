import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Search, Star, Video, Clock, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import TempleDetailModal from '../components/TempleDetailModal';
import { templeApi } from '../services/templeApi';

const TAG_STYLE   = { LIVE: '#ef4444', POPULAR: '#e07c0a', FEATURED: '#7c3aed', NEW: '#16a34a' };
const CATEGORIES  = ['All', 'Shiva', 'Vishnu', 'Devi', 'Other'];
const LIMIT       = 12;

// Local placeholder images rotated by index so every card has an image
const PLACEHOLDER_IMAGES = [
  '/src/assets/images/temple-kashi.jpg',
  '/src/assets/images/temple-meenakshi.jpg',
  '/src/assets/images/temple-tirupati.jpg',
  '/src/assets/images/temple-somnath.jpg',
];
function imgFor(temple, index) {
  if (temple.image_url && !temple.image_url.startsWith('http')) return temple.image_url;
  if (temple.image_url && temple.image_url.startsWith('http')) return temple.image_url;
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
}

export default function TemplesPage() {
  const [temples,        setTemples]        = useState([]);
  const [pagination,     setPagination]     = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [search,         setSearch]         = useState('');
  const [searchInput,    setSearchInput]    = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [liveOnly,       setLiveOnly]       = useState(false);
  const [currentPage,    setCurrentPage]    = useState(1);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [featuredLive,   setFeaturedLive]   = useState([]);

  // Load featured/live temples for the bottom strip
  useEffect(() => {
    templeApi.getFeatured()
      .then(r => setFeaturedLive(r.data || []))
      .catch(() => {});
  }, []);

  // Main data fetch – re-runs whenever filters/page change
  const fetchTemples = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page:     currentPage,
        limit:    LIMIT,
        search:   search || undefined,
        category: activeCategory !== 'All' ? activeCategory : undefined,
        tag:      liveOnly ? 'LIVE' : undefined,
      };
      const res = await templeApi.getTemples(params);
      setTemples(res.data || []);
      setPagination(res.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      setError('Could not load temples. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, activeCategory, liveOnly]);

  useEffect(() => { fetchTemples(); }, [fetchTemples]);

  // Reset to page 1 when filters change
  function applyCategory(cat) { setActiveCategory(cat); setCurrentPage(1); }
  function applyLive()        { setLiveOnly(v => !v);   setCurrentPage(1); }
  function applySearch()      { setSearch(searchInput);  setCurrentPage(1); }

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
      {/* Modal */}
      {selectedTemple && (
        <TempleDetailModal temple={selectedTemple} onClose={() => setSelectedTemple(null)} />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #2d1a0e 0%, #5c3317 50%, #2d1a0e 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('/src/assets/images/hero-temple.jpg')`,
                   backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{ background: 'rgba(249,187,92,0.2)', color: '#f9bb5c', border: '1px solid rgba(249,187,92,0.3)' }}>
            SACRED SHRINES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, serif' }}>
            Explore Temples of India
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Discover revered temples, book personalised pujas, and attend live darshan from sacred shrines across India.
          </p>
          <div className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search temples, cities, or deities..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applySearch()}
                className="w-full pl-10 pr-4 py-3 rounded-full text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#2d1a0e' }}
              />
            </div>
            <button className="btn-primary px-5 text-sm" onClick={applySearch}>Search</button>
          </div>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#edd9b3] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <Filter className="w-4 h-4 text-[#c9882a] flex-shrink-0" />
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => applyCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150"
              style={activeCategory === cat
                ? { background: '#e07c0a', color: '#fff' }
                : { background: '#fdfaf5', color: '#5c4a3a', border: '1px solid #e8d5b0' }}>
              {cat}
            </button>
          ))}
          <button onClick={applyLive}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ml-2"
            style={liveOnly
              ? { background: '#ef4444', color: '#fff' }
              : { background: '#fdfaf5', color: '#5c4a3a', border: '1px solid #e8d5b0' }}>
            <span className={`w-1.5 h-1.5 rounded-full ${liveOnly ? 'bg-white' : 'bg-red-500'} animate-pulse`} />
            Live Only
          </button>
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {pagination.total} temples
          </span>
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button onClick={fetchTemples} className="btn-primary text-xs px-6">Retry</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-gray-200 rounded-full flex-1" />
                    <div className="h-8 w-16 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && !error && temples.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {temples.map((temple, idx) => (
              <TempleCard
                key={temple.id}
                temple={temple}
                index={idx}
                onDetails={() => setSelectedTemple(temple)}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && temples.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🕍</div>
            <h3 className="text-lg font-semibold text-[#2d1a0e] mb-2">No temples found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {!loading && pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            onPage={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}
      </div>

      {/* ── Live Darshan strip ───────────────────────────────────────────── */}
      <LiveStrip temples={featuredLive} onOpen={setSelectedTemple} />
    </div>
  );
}

// ─── Temple Card ──────────────────────────────────────────────────────────────
function TempleCard({ temple, index, onDetails }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <div className="relative h-52 overflow-hidden">
        <img src={imgFor(temple, index)} alt={temple.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
        {temple.tag && (
          <div className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1"
            style={{ background: TAG_STYLE[temple.tag] || '#666' }}>
            {temple.tag === 'LIVE' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            {temple.tag}
          </div>
        )}
        {temple.tag === 'LIVE' && (
          <button className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full hover:bg-black/60 transition-all">
            <Video className="w-3 h-3" /> Watch
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-sm leading-tight">{temple.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-[#f9bb5c]" />
            <span className="text-white/80 text-xs">
              {temple.location_city}, {temple.location_state}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#fff8f0', color: '#c9882a', border: '1px solid #fcd9a0' }}>
            {temple.deity}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#f59b24] fill-[#f59b24]" />
            <span className="text-xs font-bold text-[#2d1a0e]">{temple.rating}</span>
            <span className="text-xs text-gray-400">({(temple.reviews || 0).toLocaleString()})</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 truncate">{temple.timings_general || '–'}</span>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1 justify-center text-xs py-2">Book Puja</button>
          <button onClick={onDetails}
            className="btn-outline px-3 py-2 text-xs hover:bg-[#fff8f0] transition-all">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ pagination, currentPage, onPage }) {
  const { totalPages } = pagination;

  // Build visible page numbers with ellipsis
  function pages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr = [];
    arr.push(1);
    if (currentPage > 3) arr.push('…');
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) arr.push(p);
    if (currentPage < totalPages - 2) arr.push('…');
    arr.push(totalPages);
    return arr;
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPage(currentPage - 1)}
        className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold transition-all"
        style={currentPage === 1
          ? { background: '#f5f5f5', color: '#bbb', cursor: 'not-allowed' }
          : { background: '#fff', color: '#2d1a0e', border: '1px solid #e8d5b0' }}>
        <ChevronLeft className="w-3.5 h-3.5" /> Prev
      </button>

      {pages().map((p, i) =>
        p === '…'
          ? <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
          : <button key={p} onClick={() => onPage(p)}
              className="w-9 h-9 rounded-full text-xs font-bold transition-all"
              style={p === currentPage
                ? { background: '#e07c0a', color: '#fff', boxShadow: '0 4px 12px rgba(224,124,10,0.35)' }
                : { background: '#fff', color: '#2d1a0e', border: '1px solid #e8d5b0' }}>
              {p}
            </button>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPage(currentPage + 1)}
        className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold transition-all"
        style={currentPage === totalPages
          ? { background: '#f5f5f5', color: '#bbb', cursor: 'not-allowed' }
          : { background: '#fff', color: '#2d1a0e', border: '1px solid #e8d5b0' }}>
        Next <ChevronRight className="w-3.5 h-3.5" />
      </button>

      <span className="text-xs text-gray-400 ml-2">
        Page {currentPage} of {totalPages} · {pagination.total} temples
      </span>
    </div>
  );
}

// ─── Live Darshan strip ───────────────────────────────────────────────────────
function LiveStrip({ temples, onOpen }) {
  const live = temples.filter(t => t.tag === 'LIVE').slice(0, 4);
  if (live.length === 0) return null;

  return (
    <div className="py-14" style={{ background: 'linear-gradient(135deg, #fff8f0, #faf3e8)' }}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <span className="section-label">LIVE DARSHAN</span>
        <h2 className="section-title mb-3">Watch Sacred Temples Live</h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto mb-8">
          Experience the divine energy of temples in real-time. Watch morning aarti, evening rituals, and special ceremonies as they happen.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {live.map((temple, idx) => (
            <div key={temple.id}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              style={{ height: '140px' }}
              onClick={() => onOpen(temple)}>
              <img src={imgFor(temple, idx)} alt={temple.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" /> LIVE
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold leading-tight">{temple.name}</p>
              </div>
            </div>
          ))}
        </div>
        <NavLink to="/epuja" className="btn-primary px-8 py-3">
          Book Puja at Any Temple →
        </NavLink>
      </div>
    </div>
  );
}
