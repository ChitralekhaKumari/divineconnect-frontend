import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, Flame, Landmark, Flower2, Sun, Drum, Waves, Gem,
  Mountain, Music, Sparkles, Leaf, Users, Feather,
} from 'lucide-react';
import Reveal from './Reveal';
import { LANGUAGES, DEFAULT_LANG, CALENDAR_TYPES, calendarName, uiText } from '../data/calendarTypes';
import { LANG_STORAGE_KEY } from '../utils/calendarLang';

const ICONS = {
  Flame, Landmark, Flower2, Sun, Drum, Waves, Gem, Mountain, Music, Sparkles, Leaf, Users, Feather,
};


function CalendarCard({ icon, name, viewLabel, index, onOpen }) {
  const Icon = ICONS[icon] || Sparkles;
  return (
    <Reveal index={index}>
      <button
        onClick={onOpen}
        className="w-full h-full text-left bg-white rounded-2xl border border-cream-200 shadow-card-sm p-5 flex flex-col items-center text-center gap-3 group"
      >
        <span
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{ background: 'linear-gradient(135deg, var(--color-saffron-100), var(--color-cream-200))' }}
        >
          <Icon className="w-7 h-7" style={{ color: 'var(--color-saffron-600)' }} strokeWidth={1.75} />
        </span>
        <span className="text-sm font-semibold text-[#2d1a0e] leading-snug">{name}</span>
        <span className="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: 'var(--color-saffron-600)' }}>
          {viewLabel} →
        </span>
      </button>
    </Reveal>
  );
}

export default function CalendarHub() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG);
  const t = uiText(lang);

  function selectLang(code) {
    setLang(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb bar */}
      <div className="border-b border-cream-200" style={{ background: 'var(--color-cream-50)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
            <Link to="/home" className="hover:underline" style={{ color: '#8a6a4a' }}>{t.home}</Link>
            <ChevronRight className="w-3 h-3" style={{ color: '#c9a97a' }} />
            <span className="font-semibold" style={{ color: 'var(--color-saffron-600)' }}>{t.calendar}</span>
          </div>
        </div>
      </div>

      {/* Language filter bar */}
      <div className="border-b border-cream-200 bg-white sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-[#2d1a0e] flex-shrink-0">{t.langLabel}</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {LANGUAGES.map((l, i) => (
              <span key={l.code} className="flex items-center">
                {i > 0 && <span className="w-px h-3.5 mx-1.5" style={{ background: 'var(--color-cream-300)' }} />}
                <button
                  onClick={() => selectLang(l.code)}
                  className={`text-xs sm:text-[13px] font-medium px-1 py-1 whitespace-nowrap transition-colors rounded ${
                    lang === l.code ? '' : 'hover:text-[#c9882a]'
                  }`}
                  style={lang === l.code
                    ? { color: 'var(--color-saffron-600)', fontWeight: 700 }
                    : { color: '#8a6a4a' }}
                >
                  {l.label}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center">
        <Reveal>
          <p className="section-label justify-center flex">{t.calendar}</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)' }}>{t.title}</h1>
          <p className="text-sm text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">{t.subtitle}</p>
        </Reveal>
      </div>

      {/* Calendar type cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {CALENDAR_TYPES.map((c, i) => (
            <CalendarCard
              key={c.slug}
              slug={c.slug}
              icon={c.icon}
              name={calendarName(c.slug, lang)}
              viewLabel={t.viewCalendar}
              index={i}
              onOpen={() => navigate(`/calendar/${c.slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
