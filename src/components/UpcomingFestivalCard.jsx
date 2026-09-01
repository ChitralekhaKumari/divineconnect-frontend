import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

const RAW_API = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API = RAW_API.replace(/\/api\/?$/, '');

function daysLabel(festivalDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(festivalDateStr);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / 86400000);

  if (diffDays <= 0) return 'TODAY';
  if (diffDays === 1) return 'TOMORROW';
  return `IN ${diffDays} DAYS`;
}

function formatDate(festivalDateStr) {
  return new Date(festivalDateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function UpcomingFestivalCard() {
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/api/calendar/festivals/upcoming?limit=1`)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setFestival((json?.data || [])[0] || null); })
      .catch(() => { if (!cancelled) setFestival(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-[#e8d5b0] rounded-2xl px-6 py-4 h-[76px] animate-pulse"
        style={{ boxShadow: '0 4px 24px rgba(180,130,60,0.12)' }} />
    );
  }
  if (!festival) return null;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-[#e8d5b0] rounded-2xl px-6 py-4 flex items-center justify-between gap-4"
      style={{ boxShadow: '0 4px 24px rgba(180,130,60,0.12)' }}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#fff8f0', border: '1px solid #f5d9a0' }}>
          <CalendarDays className="w-5 h-5 text-[#c9882a]" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9882a] mb-0.5" style={{ fontFamily: 'var(--font-label)' }}>
            {daysLabel(festival.date)}
          </p>
          <p className="text-sm font-bold text-[#2d1a0e]">{festival.name}</p>
          <p className="text-xs text-[#8a6a4a]">{formatDate(festival.date)}</p>
        </div>
      </div>
      <NavLink to="/calendar" className="btn-primary px-5 py-2 text-xs whitespace-nowrap flex-shrink-0">
        View Calendar →
      </NavLink>
    </div>
  );
}
