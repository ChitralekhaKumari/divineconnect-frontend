// src/components/SpiritualCalendar.jsx
// UI unchanged — data now comes from Google Calendar API via backend.

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bell, Calendar, Moon, Star, Flame, Sun, Loader } from 'lucide-react';

const RAW_API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API = RAW_API.replace(/\/api\/?$/, '');

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function pad(n) { return String(n).padStart(2, '0'); }
function toKey(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

function dateOnly(rawDate) {
  if (!rawDate) return '';
  return String(rawDate).slice(0, 10);
}

function formatDateStr(rawDate) {
  const key = dateOnly(rawDate);
  if (!key) return '';
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SpiritualCalendar() {
  const today = new Date();
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [festivals, setFestivals] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);

  const year = cur.getFullYear();
  const month = cur.getMonth();

  // Fetch holidays for visible month (dots on calendar grid)
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ year, month: month + 1 });
    fetch(`${API}/api/calendar/festivals?${params}`)
      .then(r => r.json())
      .then(json => setFestivals(json.data || []))
      .catch(() => setFestivals([]))
      .finally(() => setLoading(false));
  }, [year, month]);

  // Fetch upcoming holidays for sidebar
  useEffect(() => {
    fetch(`${API}/api/calendar/festivals/upcoming?limit=6`)
      .then(r => r.json())
      .then(json => setUpcoming(json.data || []))
      .catch(() => setUpcoming([]));
  }, []);

  // Fetch holidays for selected day
  useEffect(() => {
    if (!selectedDay) { setDayEvents([]); return; }
    const key = toKey(year, month, selectedDay);
    setDayLoading(true);
    fetch(`${API}/api/calendar/festivals/date/${key}`)
      .then(r => r.json())
      .then(json => setDayEvents(json.data || []))
      .catch(() => setDayEvents([]))
      .finally(() => setDayLoading(false));
  }, [year, month, selectedDay]);

  function getDayFestivals(d) {
    const key = toKey(year, month, d);
    return festivals.filter(f => dateOnly(f.date) === key);
  }

  function goPrevMonth() { setCur(new Date(year, month - 1, 1)); setSelectedDay(null); }
  function goNextMonth() { setCur(new Date(year, month + 1, 1)); setSelectedDay(null); }

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedLabel = selectedDay
    ? new Date(year, month, selectedDay).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    })
    : '';

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-4 py-10 md:px-10">

      <p className="text-xs font-semibold tracking-widest text-amber-700 uppercase mb-2">
        Spiritual Calendar
      </p>
      <h1 className="text-4xl text-stone-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
        Your Divine Schedule
      </h1>
      <p className="text-sm text-stone-500 mb-8 max-w-md leading-relaxed">
        Never miss a festival, fasting day, or auspicious occasion.
        Personalized reminders based on your spiritual journey.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* Calendar card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">

          <div className="flex items-center gap-3 mb-6">
            <button onClick={goPrevMonth} className="text-stone-400 hover:text-amber-700 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-lg text-stone-800" style={{ fontFamily: 'var(--font-display)' }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={goNextMonth} className="text-stone-400 hover:text-amber-700 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-stone-400 py-1">{d}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-stone-400 gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Loading holidays...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((d, i) => {
                if (d === null) return <div key={i} />;

                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = d === selectedDay;
                const fests = getDayFestivals(d);

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(d)}
                    title={fests.map(f => f.name).join(', ')}
                    className={`
                      mx-auto flex flex-col items-center justify-center
                      w-12 h-12 rounded-xl text-sm transition-colors
                      ${isSelected ? 'bg-amber-500 text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}
                      ${isToday && !isSelected ? 'ring-1 ring-amber-300' : ''}
                    `}
                  >
                    <span>{d}</span>
                    {fests.length > 0 && (
                      <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected day detail panel */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <p className="text-base text-stone-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {selectedLabel}
            </p>

            {dayLoading ? (
              <p className="text-sm text-stone-400 flex items-center gap-2">
                <Loader size={13} className="animate-spin" /> Loading...
              </p>
            ) : (
              <>
                {dayEvents.length === 0 ? (
                  <p className="text-sm text-stone-400 mb-4">No holiday on this date.</p>
                ) : (
                  <div className="flex flex-col gap-3 mb-4">
                    {dayEvents.map(f => (
                      <div key={f.id} className="bg-stone-50 rounded-xl p-4 flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Sun size={16} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-800">{f.name}</p>
                          {f.description && <p className="text-sm text-stone-500 mt-0.5">{f.description}</p>}
                          <div className="flex gap-2 mt-2">
                            <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">
                              Public Holiday
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-4">
              <Bell size={15} />
              Upcoming
            </div>
            <div className="flex flex-col divide-y divide-stone-100">
              {upcoming.length === 0 && (
                <p className="text-xs text-stone-400 py-2">No upcoming holidays found.</p>
              )}
              {upcoming.map(f => (
                <div key={f.id} className="flex items-center gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Star size={14} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-stone-800 leading-tight">{f.name}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">{formatDateStr(f.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <p className="text-base text-stone-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Quick Actions
            </p>
            <div className="flex flex-col gap-2">
              {[
                { icon: <Bell size={14} />, label: 'Set Festival Reminders' },
                { icon: <Calendar size={14} />, label: 'Sync to Google Calendar' },
                { icon: <Moon size={14} />, label: 'View Fasting Schedule' },
              ].map((a, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-stone-50 hover:bg-amber-50 rounded-lg text-[13px] text-stone-600 hover:text-amber-800 transition-colors text-left"
                >
                  <span className="text-amber-500">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
