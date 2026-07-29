import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';
import Reveal from './Reveal';

// The backend stores the 4 Vedas as separate texts (rigveda, yajurveda,
// samaveda, atharvaveda) rather than one combined "Vedas" entry, so we
// represent "Vedas" on the homepage with the Rigveda — the foremost of the
// four — while still showing it under its own real title/slug.
// Capped at 4 cards to keep the homepage minimal (Upanishads dropped here —
// still fully browsable from the Scriptures page).
const FEATURED_SLUGS = ['bhagavad-gita', 'ramayana', 'mahabharata', 'rigveda'];

function ScriptureCard({ scripture }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col h-full shadow-card-md"
      style={{ border: '1px solid #f5e8d0' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 mb-3"
        style={{ background: scripture.color || '#fdf0d8' }}>
        {scripture.emoji || '📜'}
      </div>
      <h3 className="text-base font-semibold text-[#2d1a0e] leading-snug line-clamp-2"
        style={{ fontFamily: 'var(--font-display)' }}>
        {scripture.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1.5 flex-1 line-clamp-3">
        {scripture.description}
      </p>
      <NavLink to={`/scriptures/${scripture.slug}`}
        className="mt-4 inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-full text-white transition-all hover:brightness-105 self-start"
        style={{ background: 'linear-gradient(135deg, #f59b24, #e07c0a)' }}>
        Read More
      </NavLink>
    </div>
  );
}

export default function ScripturesPreview() {
  const [scriptures, setScriptures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    scriptureApi.getScriptures()
      .then((res) => {
        if (cancelled) return;
        const all = res.data || [];
        const featured = FEATURED_SLUGS
          .map((slug) => all.find((s) => s.slug === slug))
          .filter(Boolean);
        setScriptures(featured.length ? featured : all.slice(0, 4));
      })
      .catch(() => { if (!cancelled) setScriptures([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-12 bg-white" id="scriptures">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8">
            <p className="section-label">SACRED TEXTS</p>
            <h2 className="section-title">Scriptures Preview</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Explore timeless wisdom from the Gita, epics, Vedas and Upanishads.
            </p>
          </div>
        </Reveal>

        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading scriptures...</span>
          </div>
        )}

        {!loading && scriptures.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            Could not load scriptures right now. Make sure the backend is running.
          </div>
        )}

        {!loading && scriptures.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {scriptures.map((s, i) => (
              <Reveal key={s.slug} index={i} className="h-full">
                <ScriptureCard scripture={s} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-8 flex justify-center">
            <NavLink to="/scriptures" className="btn-outline">View All Scriptures</NavLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
