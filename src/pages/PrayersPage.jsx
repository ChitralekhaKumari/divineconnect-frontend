import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Loader2 } from 'lucide-react';
import { prayerApi } from '../services/prayerApi';
import PrayerDetailModal from '../components/PrayerDetailModal';
import WishlistButton from '../components/WishlistButton';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['All', 'Ganesha', 'Shiva', 'Vishnu', 'Rama', 'Durga', 'Lakshmi', 'Saraswati', 'Surya', 'Hanuman', 'Savitri', 'Navagraha', 'Universal', 'Gita'];

// Builds the wishlist item shape for a prayer.
function toWishlistItem(prayer) {
  return {
    type: 'prayer',
    id: prayer.slug || prayer.id,
    title: prayer.title,
    subtitle: `${prayer.deity} · ${prayer.frequency}`,
    meta: { emoji: '🙏' },
  };
}

export default function PrayersPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get('open');
  const { showToast } = useToast();
  const handledOpenId = useRef(null); // which ?open value we've already acted on

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSelectedPrayer(null);

    prayerApi
      .getPrayers(activeCategory)
      .then((res) => { if (!cancelled) setPrayers(res.data || []); })
      .catch(() => { if (!cancelled) setError('Unable to load prayers right now. Please try again later.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [activeCategory]);

  // Auto-open the item requested via ?open=<slug> (e.g. from Wishlist)
  useEffect(() => {
    if (!openId || loading || handledOpenId.current === openId) return;

    function finish(prayer) {
      handledOpenId.current = openId;
      if (prayer) {
        const el = document.getElementById(`prayer-${prayer.slug || prayer.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSelectedPrayer(prayer);
      } else {
        showToast('This prayer could not be found. It may have been removed.', 'error');
      }
      // clear the param so a refresh doesn't reopen it
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('open');
        return next;
      }, { replace: true });
    }

    const found = prayers.find((p) => (p.slug || String(p.id)) === openId);
    if (found) {
      finish(found);
      return;
    }

    let cancelled = false;
    prayerApi.getBySlug(openId)
      .then((res) => { if (!cancelled) finish(res.data); })
      .catch(() => { if (!cancelled) finish(null); });
    return () => { cancelled = true; };
  }, [openId, loading, prayers, showToast, setSearchParams]);

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <span className="section-label">SACRED TEXTS</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2d1a0e] mt-2 mb-3"
          style={{ fontFamily: 'var(--font-display)' }}>
          Prayer Book
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-xl">
          A collection of powerful mantras and prayers for daily devotion.
        </p>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2.5 mt-8 mb-8">
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

        {!loading && !error && prayers.length === 0 && (
          <div className="text-center py-16 text-sm text-gray-400">No prayers found for this category.</div>
        )}

        {/* Prayer list */}
        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {prayers.map((prayer) => (
              <div key={prayer.id} id={`prayer-${prayer.slug || prayer.id}`}
                className="bg-white rounded-2xl transition-all duration-300"
                style={{ border: '1px solid #f5e8d0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

                {/* Header row */}
                <button onClick={() => setSelectedPrayer(prayer)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#fdf0d8' }}>
                      <BookOpen className="w-5 h-5" style={{ color: '#e07c0a' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2d1a0e]"
                        style={{ fontFamily: 'var(--font-display)' }}>
                        {prayer.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {prayer.deity} · {prayer.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <WishlistButton item={toWishlistItem(prayer)} />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Prayer detail popup */}
        {selectedPrayer && (
          <PrayerDetailModal
            prayer={selectedPrayer}
            onClose={() => setSelectedPrayer(null)}
          />
        )}
      </div>
    </div>
  );
}