import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { scriptureApi } from '../services/scriptureApi';
import ScriptureChapterCard from './ScriptureChapterCard';
import Reveal from './Reveal';

// The backend stores the 4 Vedas as separate texts (rigveda, yajurveda,
// samaveda, atharvaveda) rather than one combined "Vedas" entry, so we
// represent "Vedas" on the homepage with the Rigveda — the foremost of the
// four — while still showing it under its own real title/slug.
// Capped at 4 cards to keep the homepage minimal (Upanishads dropped here —
// still fully browsable from the Scriptures page).
const FEATURED_SLUGS = ['bhagavad-gita', 'ramayana', 'mahabharata', 'rigveda'];

// ScriptureChapterCard (the same card used inside every book's chapter/Kanda/
// Parva grid) already picks an icon off `unitLabel` — reusing that mapping
// here keeps the homepage book cards visually identical to the internal
// pages instead of introducing a second card design.
function unitLabelFor(slug) {
  if (slug === 'ramayana') return 'Kanda';
  if (slug === 'mahabharata') return 'Book';
  if (slug?.includes('veda')) return 'Mandala';
  return 'Chapter';
}

export default function ScripturesPreview() {
  const [scriptures, setScriptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        {/* Same ScriptureChapterCard used inside every book's own page —
            identical icon treatment, typography and offset panel, so the
            homepage preview matches the rest of the Scriptures section. */}
        {!loading && scriptures.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
            {scriptures.map((s, i) => (
              <Reveal key={s.slug} index={i} className="h-full">
                <ScriptureChapterCard
                  unitLabel={unitLabelFor(s.slug)}
                  title={s.title}
                  description={s.description}
                  onRead={() => navigate(`/scriptures/${s.slug}`)}
                />
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
