import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader, MapPin, Sparkles } from 'lucide-react';
import CalendarPageHeader from './CalendarPageHeader';
import { getStoredLang } from '../utils/calendarLang';
import Reveal from './Reveal';
import { DEFAULT_LANG, calendarName, uiText } from '../data/calendarTypes';

const RAW_API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API = RAW_API.replace(/\/api\/?$/, '');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.2090;

function dateOnly(raw) { return String(raw).slice(0, 10); }
function toKey(y, m, d) { return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }

export default function RegionalCalendarMonth({ calendarType, year, month }) {
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => getStoredLang(DEFAULT_LANG));
  const t = uiText(lang);
  const name = calendarName(calendarType, lang);

  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON, label: 'New Delhi (default)' });
  const [days, setDays] = useState(null);
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' }),
      () => {},
      { timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelectedDay(null);
    Promise.all([
      fetch(`${API}/api/calendar/panchang/month-days?year=${year}&month=${month}&lat=${coords.lat}&lon=${coords.lon}`)
        .then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API}/api/calendar/festivals?year=${year}&month=${month}`)
        .then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([panchangJson, festJson]) => {
      if (cancelled) return;
      setDays(panchangJson.data || []);
      setFestivals(festJson.data || []);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [year, month, coords]);

  function goPrevMonth() {
    const m = month === 1 ? 12 : month - 1;
    const y = month === 1 ? year - 1 : year;
    navigate(`/calendar/${calendarType}/${y}/${m}`);
  }
  function goNextMonth() {
    const m = month === 12 ? 1 : month + 1;
    const y = month === 12 ? year + 1 : year;
    navigate(`/calendar/${calendarType}/${y}/${m}`);
  }

  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function festivalsOn(d) {
    const key = toKey(year, month, d);
    return festivals.filter(f => dateOnly(f.date) === key);
  }
  function panchangFor(d) {
    if (!days) return null;
    return days.find(x => x.day === d);
  }

  const selected = selectedDay ? panchangFor(selectedDay) : null;

  return (
    <div className="min-h-screen bg-white">
      <CalendarPageHeader
        crumbs={[
          { label: t.home, to: '/home' },
          { label: t.calendar, to: '/calendar' },
          { label: name, to: `/calendar/${calendarType}` },
          { label: `${MONTH_NAMES[month - 1]} ${year}` },
        ]}
        lang={lang}
        onSelectLang={setLang}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Reveal>
          <h1 className="text-center section-title mb-2" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)' }}>
            {name} {year} {MONTH_NAMES[month - 1]}
          </h1>
          <p className="text-xs text-stone-400 mb-6 flex items-center justify-center gap-1">
            <MapPin size={12} /> Panchang shown for {coords.label}
          </p>
        </Reveal>

        <Reveal>
          <div className="flex items-center justify-center gap-4 mb-6">
            <button onClick={goPrevMonth} className="w-9 h-9 rounded-full flex items-center justify-center bg-cream-50 border border-cream-200 text-stone-500 hover:text-saffron-600 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-base font-semibold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
              {MONTH_NAMES[month - 1]} {year}
            </span>
            <button onClick={goNextMonth} className="w-9 h-9 rounded-full flex items-center justify-center bg-cream-50 border border-cream-200 text-stone-500 hover:text-saffron-600 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-400 gap-2">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm">{t.loading}</span>
          </div>
        ) : (
          <Reveal>
            <div className="bg-white rounded-2xl border border-cream-200 shadow-card-sm p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] sm:text-[11px] font-semibold text-stone-400 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  if (d === null) return <div key={i} />;
                  const fests = festivalsOn(d);
                  const pd = panchangFor(d);
                  const isSelected = selectedDay === d;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(d)}
                      className={`rounded-lg p-1.5 sm:p-2 flex flex-col items-center text-center transition-colors border ${
                        isSelected ? 'border-saffron-400 bg-saffron-50' : 'border-transparent hover:bg-cream-50'
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-saffron-700' : 'text-[#2d1a0e]'}`}>{d}</span>
                      {pd && (
                        <span className="text-[8px] sm:text-[9px] text-stone-400 leading-tight mt-0.5 truncate w-full">{pd.tithi}</span>
                      )}
                      {fests.length > 0 && <span className="w-1 h-1 rounded-full bg-saffron-500 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Selected day Panchang strip */}
        {selected && (
          <Reveal>
            <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-3">
                <Sparkles size={15} /> {t.panchangDetails}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-[11px] text-stone-400">{t.tithi}</p><p className="font-medium text-[#2d1a0e]">{selected.tithi}</p></div>
                <div><p className="text-[11px] text-stone-400">Paksha</p><p className="font-medium text-[#2d1a0e]">{selected.paksha}</p></div>
                <div><p className="text-[11px] text-stone-400">{t.nakshatra}</p><p className="font-medium text-[#2d1a0e]">{selected.nakshatra}</p></div>
                <div><p className="text-[11px] text-stone-400">{t.maas}</p><p className="font-medium text-[#2d1a0e]">{selected.maas}</p></div>
              </div>
              {festivalsOn(selectedDay).length > 0 && (
                <div className="mt-3 pt-3 border-t border-cream-200 flex flex-col gap-1">
                  {festivalsOn(selectedDay).map(f => (
                    <p key={f.id} className="text-sm font-medium text-saffron-700">{f.name}</p>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Festivals list for the month */}
        <Reveal>
          <div className="bg-white rounded-2xl border border-cream-200 shadow-card-sm overflow-hidden">
            <div className="px-5 py-3" style={{ background: 'var(--color-cream-50)' }}>
              <span className="text-sm font-bold text-[#2d1a0e]">{t.festivalsCol}</span>
            </div>
            {festivals.length === 0 ? (
              <p className="text-xs text-stone-400 px-5 py-4">{t.noFestivals}</p>
            ) : (
              <div className="divide-y divide-cream-100">
                {festivals.map(f => (
                  <div key={f.id} className="flex items-start gap-4 px-5 py-2.5 text-sm">
                    <span className="w-20 flex-shrink-0 font-semibold text-[#2d1a0e]">
                      {dateOnly(f.date).slice(-2)} {MONTH_NAMES[month - 1].slice(0, 3)}
                    </span>
                    <span className="font-medium text-saffron-700">{f.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <div className="text-center mt-8">
          <button onClick={() => navigate(`/calendar/${calendarType}`)} className="btn-outline text-xs py-2 px-5">
            ← {t.backToYear}
          </button>
        </div>
      </div>
    </div>
  );
}
