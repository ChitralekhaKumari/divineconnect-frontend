import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { prayerApi } from '../services/prayerApi';
import Reveal from './Reveal';
import PrayerCard from './PrayerCard';

// Reuses the exact same card component as the /prayers listing page
// (compact mode) — so this teaser strip on Home is pixel-identical in
// design to the real Prayers section, just smaller so 4 fit in a row.
export default function DailyPrayers() {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    prayerApi.getPrayers()
      .then((res) => { if (!cancelled) setPrayers((res.data || []).slice(0, 4)); })
      .catch(() => { if (!cancelled) setPrayers([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-12 bg-white" id="prayers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8">
            <p className="section-label">SHLOKAS & STOTRAS</p>
            <h2 className="section-title">Daily Prayers</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Begin your day with time-tested prayers and stotras, each with meaning and pronunciation.
            </p>
          </div>
        </Reveal>

        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading prayers...</span>
          </div>
        )}

        {!loading && prayers.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            Could not load prayers right now. Make sure the backend is running.
          </div>
        )}

        {!loading && prayers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {prayers.map((prayer, i) => (
              <Reveal key={prayer.id} index={i} className="h-full">
                <PrayerCard prayer={prayer} compact />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-8 flex justify-center">
            <NavLink to="/prayers" className="btn-outline">View All Prayers</NavLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
