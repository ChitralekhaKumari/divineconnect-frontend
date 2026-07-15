import { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Bell, Calendar, Moon, Star, Sun, Loader,
  Sparkles, ChevronDown, ChevronUp, MapPin,
} from 'lucide-react';

const RAW_API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API = RAW_API.replace(/\/api\/?$/, '');

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Default location shown until the user grants geolocation (New Delhi)
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.2090;

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

// Small marker dot styles per tithi-event type (used on the calendar grid)
const EVENT_DOT_STYLE = {
  amavasya: 'bg-stone-700',
  purnima: 'bg-indigo-400',
  ekadashi: 'bg-emerald-500',
  sankranti: 'bg-orange-500',
};

function PanchangRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
      <span className="text-[13px] text-stone-500">{label}</span>
      <span className="text-[13px] font-medium text-stone-800 text-right">{value || '—'}</span>
    </div>
  );
}

function MuhurtaChip({ label, value, tone = 'neutral' }) {
  const tones = {
    good: 'bg-emerald-50 text-emerald-700',
    bad: 'bg-red-50 text-red-600',
    neutral: 'bg-stone-50 text-stone-600',
  };
  return (
    <div className={`rounded-lg px-3 py-2 ${tones[tone]}`}>
      <p className="text-[10px] uppercase tracking-wide font-semibold opacity-70">{label}</p>
      <p className="text-[13px] font-medium mt-0.5">{value || '—'}</p>
    </div>
  );
}

function ChoghadiyaHoraTable({ title, rows, kind }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 border border-stone-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-stone-50 text-[13px] font-medium text-stone-700"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="max-h-56 overflow-y-auto divide-y divide-stone-100">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 text-[12px]">
              <span className="text-stone-400">{row.time}</span>
              {kind === 'choghadiya' ? (
                <span className={`px-2 py-0.5 rounded-full font-medium ${row.good ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                  {row.name}
                </span>
              ) : (
                <span className="font-medium text-stone-700">{row.planet}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SpiritualCalendar() {
  const today = new Date();
  const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [festivals, setFestivals] = useState([]);
  const [tithiEvents, setTithiEvents] = useState([]);
  const [dayEvents, setDayEvents] = useState([]);
  const [panchang, setPanchang] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON, label: 'New Delhi (default)' });

  const year = cur.getFullYear();
  const month = cur.getMonth();

  // Try to use the visitor's real location for accurate sunrise/sunset-based
  // Panchang; silently fall back to New Delhi if denied or unavailable.
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' }),
      () => {},
      { timeout: 5000 }
    );
  }, []);

  // Festivals (Google Calendar) for visible month — dots on the grid
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ year, month: month + 1 });
    fetch(`${API}/api/calendar/festivals?${params}`)
      .then(r => r.json())
      .then(json => setFestivals(json.data || []))
      .catch(() => setFestivals([]))
      .finally(() => setLoading(false));
  }, [year, month]);

  // Panchang tithi events (Ekadashi/Amavasya/Purnima/Sankranti) for visible month
  useEffect(() => {
    const params = new URLSearchParams({ year, month: month + 1, lat: coords.lat, lon: coords.lon });
    fetch(`${API}/api/calendar/panchang/month?${params}`)
      .then(r => r.json())
      .then(json => setTithiEvents(json.data || []))
      .catch(() => setTithiEvents([]));
  }, [year, month, coords]);

  // Upcoming holidays for sidebar
  useEffect(() => {
    fetch(`${API}/api/calendar/festivals/upcoming?limit=6`)
      .then(r => r.json())
      .then(json => setUpcoming(json.data || []))
      .catch(() => setUpcoming([]));
  }, []);

  // Holidays + full Panchang for selected day
  useEffect(() => {
    if (!selectedDay) { setDayEvents([]); setPanchang(null); return; }
    const key = toKey(year, month, selectedDay);
    setDayLoading(true);
    const params = new URLSearchParams({ lat: coords.lat, lon: coords.lon });
    fetch(`${API}/api/calendar/festivals/date/${key}?${params}`)
      .then(r => r.json())
      .then(json => {
        setDayEvents(json.data || []);
        setPanchang(json.panchang || null);
      })
      .catch(() => { setDayEvents([]); setPanchang(null); })
      .finally(() => setDayLoading(false));
  }, [year, month, selectedDay, coords]);

  function getDayFestivals(d) {
    const key = toKey(year, month, d);
    return festivals.filter(f => dateOnly(f.date) === key);
  }
  function getDayTithiEvents(d) {
    const key = toKey(year, month, d);
    return tithiEvents.filter(e => e.date === key);
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
      <p className="text-sm text-stone-500 mb-2 max-w-md leading-relaxed">
        Full daily Panchang — Tithi, Nakshatra, Muhurtas, Choghadiya and more —
        alongside festivals and public holidays.
      </p>
      <p className="text-xs text-stone-400 mb-8 flex items-center gap-1">
        <MapPin size={12} /> Panchang shown for {coords.label}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">

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
              <span className="text-sm">Loading calendar...</span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((d, i) => {
                if (d === null) return <div key={i} />;

                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = d === selectedDay;
                const fests = getDayFestivals(d);
                const tithiDayEvents = getDayTithiEvents(d);
                const allTags = [...fests.map(f => f.name), ...tithiDayEvents.map(e => e.name)];

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(d)}
                    title={allTags.join(', ')}
                    className={`
                      mx-auto flex flex-col items-center justify-center
                      w-12 h-12 rounded-xl text-sm transition-colors
                      ${isSelected ? 'bg-amber-500 text-white font-medium' : 'text-stone-700 hover:bg-stone-50'}
                      ${isToday && !isSelected ? 'ring-1 ring-amber-300' : ''}
                    `}
                  >
                    <span>{d}</span>
                    {(fests.length > 0 || tithiDayEvents.length > 0) && (
                      <span className="flex gap-0.5 mt-0.5">
                        {fests.length > 0 && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
                        )}
                        {tithiDayEvents.map((e, idx) => (
                          <span
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : EVENT_DOT_STYLE[e.type] || 'bg-stone-400'}`}
                          />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-stone-100 text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Holiday</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ekadashi</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-stone-700" /> Amavasya</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Purnima</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Sankranti</span>
          </div>

          {/* Selected day detail panel */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <p className="text-base text-stone-800 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {selectedLabel}
            </p>

            {dayLoading ? (
              <p className="text-sm text-stone-400 flex items-center gap-2 py-6">
                <Loader size={13} className="animate-spin" /> Loading Panchang...
              </p>
            ) : (
              <>
                {/* Holidays / festivals for the day */}
                {dayEvents.length > 0 && (
                  <div className="flex flex-col gap-3 mb-5">
                    {dayEvents.map(f => (
                      <div key={f.id} className="bg-stone-50 rounded-xl p-4 flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Sun size={16} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-800">{f.name}</p>
                          {f.description && <p className="text-sm text-stone-500 mt-0.5">{f.description}</p>}
                          <span className="inline-block mt-2 text-[11px] px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700">
                            Public Holiday
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full Panchang */}
                {panchang && (
                  <div>
                    <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-3">
                      <Sparkles size={15} /> Panchang
                    </div>

                    {/* Tithi banner + special-day tags */}
                    <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <p className="text-lg text-stone-800 font-medium">{panchang.tithi}</p>
                          <p className="text-[12px] text-stone-500">{panchang.paksha} · {panchang.maas} Maas · {panchang.samvatsara} Samvatsara</p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {panchang.is_ekadashi && <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">Ekadashi</span>}
                          {panchang.is_amavasya && <span className="text-[11px] px-2 py-1 rounded-full bg-stone-200 text-stone-700 font-medium">Amavasya</span>}
                          {panchang.is_purnima && <span className="text-[11px] px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">Purnima</span>}
                        </div>
                      </div>
                    </div>

                    {/* Core panchang elements */}
                    <div className="grid grid-cols-2 gap-x-6">
                      <PanchangRow label="Nakshatra" value={`${panchang.nakshatra} (Pada ${panchang.nakshatra_pada})`} />
                      <PanchangRow label="Yoga" value={panchang.yoga} />
                      <PanchangRow label="Karana" value={panchang.karana} />
                      <PanchangRow label="Weekday" value={panchang.weekday} />
                      <PanchangRow label="Sun Rashi" value={panchang.sun_rashi} />
                      <PanchangRow label="Moon Rashi" value={panchang.moon_rashi} />
                    </div>

                    {/* Sun & moon timings */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                      <MuhurtaChip label="Sunrise" value={panchang.sunrise} tone="neutral" />
                      <MuhurtaChip label="Sunset" value={panchang.sunset} tone="neutral" />
                      <MuhurtaChip label="Moonrise" value={panchang.moonrise} tone="neutral" />
                      <MuhurtaChip label="Moonset" value={panchang.moonset} tone="neutral" />
                    </div>

                    {/* Auspicious / inauspicious muhurtas */}
                    <p className="text-[11px] uppercase tracking-wide text-stone-400 font-semibold mt-4 mb-2">Muhurtas</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <MuhurtaChip label="Rahu Kalam" value={panchang.rahu_kalam} tone="bad" />
                      <MuhurtaChip label="Yamaganda" value={panchang.yamaganda} tone="bad" />
                      <MuhurtaChip label="Gulika Kaal" value={panchang.gulika_kalam} tone="bad" />
                      <MuhurtaChip label="Abhijit Muhurta" value={panchang.abhijit_muhurta} tone="good" />
                      <MuhurtaChip label="Brahma Muhurta" value={panchang.brahma_muhurta} tone="good" />
                    </div>

                    {/* Choghadiya & Hora tables */}
                    {panchang.choghadiya?.length > 0 && (
                      <ChoghadiyaHoraTable title="Choghadiya (full day)" rows={panchang.choghadiya} kind="choghadiya" />
                    )}
                    {panchang.hora?.length > 0 && (
                      <ChoghadiyaHoraTable title="Hora (planetary hours)" rows={panchang.hora} kind="hora" />
                    )}
                  </div>
                )}

                {!panchang && dayEvents.length === 0 && (
                  <p className="text-sm text-stone-400 py-6">No data available for this date.</p>
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
