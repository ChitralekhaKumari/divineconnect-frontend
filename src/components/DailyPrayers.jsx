import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Loader2 } from 'lucide-react';
import { prayerApi } from '../services/prayerApi';
import Reveal from './Reveal';

// Prayers have no dedicated "description" field yet, so — same as the full
// Prayers page — we show deity + frequency as the short descriptive line.
function PrayerCard({ prayer }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col h-full shadow-card-md"
      style={{ border: '1px solid #f5e8d0' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mb-3"
        style={{ background: '#fdf0d8' }}>
        <BookOpen className="w-5 h-5" style={{ color: '#e07c0a' }} />
      </div>
      <h3 className="text-base font-semibold text-[#2d1a0e] leading-snug"
        style={{ fontFamily: 'var(--font-display)' }}>
        {prayer.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1.5 flex-1">
        {prayer.deity}{prayer.deity && prayer.frequency ? ' · ' : ''}{prayer.frequency}
      </p>
      <NavLink to={`/prayers?open=${prayer.slug || prayer.id}`}
        className="mt-4 inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-full text-white transition-all hover:brightness-105 self-start"
        style={{ background: 'linear-gradient(135deg, #f59b24, #e07c0a)' }}>
        Read Prayer
      </NavLink>
    </div>
  );
}

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
                <PrayerCard prayer={prayer} />
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
