import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon, Star, Sparkles, Loader2 } from 'lucide-react';

// Same base-URL handling as SpiritualCalendar.jsx, so this hits the exact
// same backend the full Calendar page uses.
const RAW_API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API = RAW_API.replace(/\/api\/?$/, '');

// New Delhi — same default used by SpiritualCalendar.jsx until a visitor
// grants geolocation.
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.2090;

function pad(n) { return String(n).padStart(2, '0'); }

function Stat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 px-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff8f0' }}>
        {icon}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9c8672]">{label}</p>
      <p className="text-sm font-semibold text-[#2d1a0e] leading-tight">{value || '—'}</p>
    </div>
  );
}

export default function CalendarPreview() {
  const [panchang, setPanchang] = useState(null);
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const key = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const params = new URLSearchParams({ lat: DEFAULT_LAT, lon: DEFAULT_LON });

    Promise.all([
      fetch(`${API}/api/calendar/festivals/date/${key}?${params}`).then((r) => r.json()).catch(() => null),
      fetch(`${API}/api/calendar/festivals/upcoming?limit=1`).then((r) => r.json()).catch(() => null),
    ]).then(([dayJson, upcomingJson]) => {
      if (cancelled) return;
      setPanchang(dayJson?.panchang || null);
      setFestival((upcomingJson?.data || [])[0] || null);
    }).finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-12" style={{ background: '#fdfaf5' }} id="calendar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="section-label">PANCHANG</p>
          <h2 className="section-title">Hindu Calendar</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Today's tithi, nakshatra and auspicious timings — plus what's coming up next.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card-lg" style={{ border: '1px solid #f5e8d0' }}>
          {loading && (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading today's panchang...</span>
            </div>
          )}

          {!loading && !panchang && (
            <div className="text-center py-8 text-sm text-gray-400">
              Could not load today's panchang right now. Make sure the backend is running.
            </div>
          )}

          {!loading && panchang && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <Stat icon={<Moon className="w-5 h-5" style={{ color: '#e07c0a' }} />} label="Tithi" value={panchang.tithi} />
                <Stat icon={<Star className="w-5 h-5" style={{ color: '#e07c0a' }} />} label="Nakshatra" value={panchang.nakshatra} />
                <Stat icon={<Sparkles className="w-5 h-5" style={{ color: '#e07c0a' }} />} label="Yoga" value={panchang.yoga} />
                <Stat icon={<Sun className="w-5 h-5" style={{ color: '#e07c0a' }} />} label="Sunrise" value={panchang.sunrise} />
                <Stat icon={<Sun className="w-5 h-5" style={{ color: '#c46206' }} />} label="Sunset" value={panchang.sunset} />
              </div>

              {festival && (
                <div className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 mb-6" style={{ background: '#fff8f0', border: '1px solid #f5e0b8' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9882a] mb-0.5">Upcoming Festival</p>
                    <p className="text-sm font-semibold text-[#2d1a0e]">{festival.name}</p>
                  </div>
                  {festival.date && (
                    <span className="text-xs text-[#8a6a4a] flex-shrink-0 whitespace-nowrap">
                      {new Date(festival.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex justify-center">
            <NavLink to="/calendar" className="btn-outline">View Calendar</NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}
