import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
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
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function dateOnly(raw) { return String(raw).slice(0, 10); }
function toKey(y, m, d) { return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }

function MiniMonthGrid({ year, month, festivals, tithiEvents }) {
  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function hasMark(d) {
    const key = toKey(year, month, d);
    return festivals.some(f => dateOnly(f.date) === key) || tithiEvents.some(e => e.date === key);
  }

  return (
    <div className="grid grid-cols-7 gap-y-1 text-center">
      {DAYS.map((d, i) => (
        <span key={i} className="text-[10px] font-semibold text-stone-400">{d}</span>
      ))}
      {cells.map((d, i) => (
        <span key={i} className="text-[11px] py-0.5 relative flex flex-col items-center text-stone-600">
          {d || ''}
          {d && hasMark(d) && <span className="w-1 h-1 rounded-full bg-saffron-500 mt-0.5" />}
        </span>
      ))}
    </div>
  );
}

export default function RegionalCalendarView({ calendarType }) {
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => getStoredLang(DEFAULT_LANG));
  const t = uiText(lang);
  const name = calendarName(calendarType, lang);

  const [year] = useState(new Date().getFullYear());
  const [monthsData, setMonthsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(
      Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return Promise.all([
          fetch(`${API}/api/calendar/festivals?year=${year}&month=${month}`).then(r => r.json()).catch(() => ({ data: [] })),
          fetch(`${API}/api/calendar/panchang/month?year=${year}&month=${month}`).then(r => r.json()).catch(() => ({ data: [] })),
        ]).then(([festJson, tithiJson]) => ({
          month,
          festivals: festJson.data || [],
          tithiEvents: tithiJson.data || [],
        }));
      })
    ).then(results => { if (!cancelled) setMonthsData(results); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [year]);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Reveal>
          <h1 className="text-center section-title mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            {name} {year}
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto text-center leading-relaxed mb-10">
            {t.introTemplate.replace(/\{name\}/g, name)}
          </p>
        </Reveal>

        {loading && (
          <div className="flex items-center justify-center py-16 text-stone-400 gap-2">
            <Loader size={16} className="animate-spin" />
            <span className="text-sm">{t.loading}</span>
          </div>
        )}

        {!loading && monthsData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {monthsData.map(({ month, festivals, tithiEvents }) => (
              <Reveal key={month} index={month - 1}>
                <div className="bg-white rounded-2xl border border-cream-200 shadow-card-sm p-5 flex flex-col h-full">
                  <p className="text-sm font-bold text-[#2d1a0e] mb-3 text-center">
                    {MONTH_NAMES[month - 1]}, {year} {t.monthCalendarSuffix}
                  </p>

                  <MiniMonthGrid year={year} month={month} festivals={festivals} tithiEvents={tithiEvents} />

                  <div className="mt-4 pt-3 border-t border-cream-100 flex-1">
                    {festivals.length === 0 ? (
                      <p className="text-[11px] text-stone-400">{t.noFestivals}</p>
                    ) : (
                      <ul className="space-y-1">
                        {festivals.slice(0, 3).map(f => (
                          <li key={f.id} className="text-[11px] text-stone-600 truncate">
                            <span className="font-semibold text-saffron-600">{dateOnly(f.date).slice(-2)}</span> — {f.name}
                          </li>
                        ))}
                        {festivals.length > 3 && (
                          <li className="text-[11px] text-stone-400">+{festivals.length - 3} more</li>
                        )}
                      </ul>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/calendar/${calendarType}/${year}/${month}`)}
                    className="btn-outline w-full justify-center text-xs py-2 mt-4"
                  >
                    {t.seeFullCalendar}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
