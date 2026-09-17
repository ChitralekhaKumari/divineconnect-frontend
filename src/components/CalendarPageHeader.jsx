import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { LANGUAGES } from '../data/calendarTypes';
import { LANG_STORAGE_KEY } from '../utils/calendarLang';

// crumbs: [{ label, to }] — last item is rendered as the current (non-link) crumb
export default function CalendarPageHeader({ crumbs, lang, onSelectLang }) {
  function selectLang(code) {
    localStorage.setItem(LANG_STORAGE_KEY, code);
    onSelectLang(code);
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb bar */}
      <div className="border-b border-cream-200" style={{ background: 'var(--color-cream-50)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-medium">
            {crumbs.map((c, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3 h-3" style={{ color: '#c9a97a' }} />}
                  {isLast || !c.to ? (
                    <span className="font-semibold truncate max-w-[160px] sm:max-w-none" style={{ color: 'var(--color-saffron-600)' }}>
                      {c.label}
                    </span>
                  ) : (
                    <Link to={c.to} className="hover:underline" style={{ color: '#8a6a4a' }}>{c.label}</Link>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Language filter bar */}
      <div className="border-b border-cream-200 bg-white sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 flex-shrink-0">
            {LANGUAGES.map((l, i) => (
              <span key={l.code} className="flex items-center">
                {i > 0 && <span className="w-px h-3.5 mx-1.5" style={{ background: 'var(--color-cream-300)' }} />}
                <button
                  onClick={() => selectLang(l.code)}
                  className="text-xs sm:text-[13px] font-medium px-1 py-1 whitespace-nowrap transition-colors rounded hover:text-[#c9882a]"
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
    </div>
  );
}
