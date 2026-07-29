import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { bhajanApi } from '../services/bhajanApi';
import BhajanCard from './BhajanCard';
import BhajanLyricsModal from './BhajanLyricsModal';
import Reveal from './Reveal';

export default function FeaturedBhajans() {
  const [bhajans, setBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lyricsBhajan, setLyricsBhajan] = useState(null);

  useEffect(() => {
    let cancelled = false;
    bhajanApi.getBhajans()
      .then((res) => { if (!cancelled) setBhajans((res.data || []).slice(0, 4)); })
      .catch(() => { if (!cancelled) setBhajans([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-12" style={{ background: '#fdfaf5' }} id="bhajans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8">
            <p className="section-label">DEVOTIONAL MUSIC</p>
            <h2 className="section-title">Featured Bhajans</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Immerse yourself in soulful bhajans dedicated to your favorite deities.
            </p>
          </div>
        </Reveal>

        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading bhajans...</span>
          </div>
        )}

        {!loading && bhajans.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            Could not load bhajans right now. Make sure the backend is running.
          </div>
        )}

        {!loading && bhajans.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bhajans.map((bhajan, i) => (
              <Reveal key={bhajan.id} index={i} className="h-full">
                <BhajanCard
                  bhajan={bhajan}
                  bhajanList={bhajans}
                  onViewLyrics={setLyricsBhajan}
                />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-8 flex justify-center">
            <NavLink to="/bhajans" className="btn-outline">View All Bhajans</NavLink>
          </div>
        </Reveal>
      </div>

      {lyricsBhajan && (
        <BhajanLyricsModal bhajan={lyricsBhajan} bhajanList={bhajans} onClose={() => setLyricsBhajan(null)} />
      )}
    </section>
  );
}
