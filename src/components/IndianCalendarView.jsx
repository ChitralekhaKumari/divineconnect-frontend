import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader, CalendarDays } from 'lucide-react';
import CalendarPageHeader from './CalendarPageHeader';
import { getStoredLang } from '../utils/calendarLang';
import Reveal from './Reveal';
import { DEFAULT_LANG, calendarName, uiText } from '../data/calendarTypes';
import { categorizeFestival, categoryLabel, CATEGORIES } from '../utils/festivalCategory';

const RAW_API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API = RAW_API.replace(/\/api\/?$/, '');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function dateOnly(raw) { return String(raw).slice(0, 10); }

function dayLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    day: d,
    weekday: dt.toLocaleDateString('en-US', { weekday: 'long' }),
  };
}

export default function IndianCalendarView({ calendarType }) {
  const [lang, setLang] = useState(() => getStoredLang(DEFAULT_LANG));
  const t = uiText(lang);
  const name = calendarName(calendarType, lang);

  const [year, setYear] = useState(new Date().getFullYear());
  const [yearInput, setYearInput] = useState(String(year));
  const [monthsData, setMonthsData] = useState(null); // [{month, items:[...]}]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(
      Array.from({ length: 12 }, (_, i) =>
        fetch(`${API}/api/calendar/festivals?year=${year}&month=${i + 1}`)
          .then(r => r.json())
          .then(json => ({ month: i + 1, items: json.data || [] }))
          .catch(() => ({ month: i + 1, items: [] }))
      )
    ).then(results => {
      if (!cancelled) setMonthsData(results);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [year]);

  const categoriesPresent = useMemo(() => {
    if (!monthsData) return [];
    const set = new Set();
    monthsData.forEach(m => m.items.forEach(f => set.add(categorizeFestival(f.name))));
    return Array.from(set);
  }, [monthsData]);

  function commitYear(next) {
    const n = parseInt(next, 10);
    if (!isNaN(n) && n > 1900 && n < 2200) {
      setYear(n);
      setYearInput(String(n));
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <CalendarPageHeader
        crumbs={[
          { label: t.home, to: '/home' },
          { label: t.calendar, to: '/calendar' },
          { label: name },
        ]}
        lang={lang}
        onSelectLang={setLang}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Reveal>
          <h1 className="text-center section-title mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            {name} {year} - {t.festivalsSuffix}
          </h1>
        </Reveal>

        {/* Banner */}
        <Reveal>
          <div
            className="relative rounded-2xl overflow-hidden h-40 sm:h-52 flex items-center justify-center mb-6 shadow-card-md"
            style={{ background: 'linear-gradient(135deg, var(--color-saffron-400), var(--color-temple-gold))' }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }} />
            <div className="relative text-center px-4">
              <CalendarDays className="w-8 h-8 text-white/90 mx-auto mb-2" />
              <p className="text-white text-2xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {name}
              </p>
              <p className="text-white/85 text-sm mt-1">{year}</p>
            </div>
          </div>
        </Reveal>

        {/* Year controls */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-3 bg-cream-50 border border-cream-200 rounded-xl px-4 py-3 mb-6">
            <span className="text-xs font-semibold text-[#2d1a0e]">{t.year}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => commitYear(year - 1)}
                aria-label={t.prevYear}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-cream-300 text-stone-500 hover:text-saffron-600 hover:border-saffron-300 transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <input
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onBlur={(e) => commitYear(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitYear(e.currentTarget.value); }}
                className="w-20 text-center text-sm font-semibold border border-cream-300 rounded-lg py-1.5 text-[#2d1a0e] focus:outline-none focus:border-saffron-400"
              />
              <button
                onClick={() => commitYear(year + 1)}
                aria-label={t.nextYear}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-cream-300 text-stone-500 hover:text-saffron-600 hover:border-saffron-300 transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <button onClick={() => commitYear(year + 1)} className="btn-primary text-xs py-2 px-4">
              {t.nextYear}
            </button>
          </div>
        </Reveal>

        {/* Legend */}
        {categoriesPresent.length > 0 && (
          <Reveal>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8 text-xs">
              {categoriesPresent.map(key => (
                <span key={key} className="flex items-center gap-1.5 font-medium" style={{ color: CATEGORIES[key]?.color }}>
                  <span className="text-sm leading-none">*</span> {categoryLabel(key, lang)}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16 text-stone-400 gap-2">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm">{t.loading}</span>
          </div>
        )}

        {!loading && monthsData && (
          <div className="flex flex-col gap-5">
            {monthsData.map(({ month, items }) => (
              <Reveal key={month} index={month - 1}>
                <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-card-sm">
                  <div className="flex items-center justify-between px-5 py-3" style={{ background: 'var(--color-cream-50)' }}>
                    <span className="text-sm font-bold text-[#2d1a0e]">{MONTH_NAMES[month - 1]} {year}</span>
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">{t.festivalsCol}</span>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-xs text-stone-400 px-5 py-4">{t.noFestivals}</p>
                  ) : (
                    <div className="divide-y divide-cream-100">
                      {items.map(f => {
                        const { day, weekday } = dayLabel(dateOnly(f.date));
                        const cat = categorizeFestival(f.name);
                        return (
                          <div key={f.id} className="flex items-start gap-4 px-5 py-2.5 text-sm">
                            <span className="w-24 flex-shrink-0 text-stone-500">
                              <span className="font-semibold text-[#2d1a0e]">{day}</span> {weekday}
                            </span>
                            <span className="font-medium" style={{ color: CATEGORIES[cat]?.color || '#dc2626' }}>
                              {f.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
