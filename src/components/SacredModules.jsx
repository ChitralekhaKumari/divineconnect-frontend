import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const platformStats = [
  { value: '11', label: 'SACRED MODULES' },
  { value: '10+', label: 'LANGUAGES' },
  { value: '5,000+', label: 'STOTRAS & PRAYERS' },
  { value: '10,000+', label: 'BHAJANS' },
  { value: '100K+', label: 'TEMPLES MAPPED' },
  { value: '108+', label: 'FESTIVALS' },
];

const modules = [
  { id: 1, title: 'Thought of the Day', desc: 'Daily spiritual inspiration', path: '/home' },
  { id: 2, title: 'Prayer Book', desc: '5,000+ stotras with meaning', path: '/home' },
  { id: 3, title: 'Bhajans', desc: 'Devotional music library', path: '/home' },
  { id: 4, title: 'Scriptures', desc: 'Gita, Vedas, Upanishads', path: '/home' },
  { id: 5, title: 'AI Guru', desc: 'Converse with divine avatars', path: '/home' },
  { id: 6, title: 'Live Darshan', desc: 'Temple streams 24/7', path: '/temples' },
  { id: 7, title: 'Pilgrim Tours', desc: 'Char Dham, Kashi & more', path: '/temples' },
  { id: 8, title: 'Pandits & Gurus', desc: 'Verified, bookable priests', path: '/pandits' },
  { id: 9, title: 'Sacred Artifacts', desc: 'Murtis, rudraksha, yantras', path: '/home' },
  { id: 10, title: 'Temple Directory', desc: 'Discover temples globally', path: '/temples' },
  { id: 11, title: 'Life Events', desc: '16 Samskaras — birth to moksha', path: '/epuja' },
];

export default function SacredModules() {
  return (
    <section className="py-16" style={{ background: '#faf6ef' }} id="modules">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <p className="section-label">PLATFORM ARCHITECTURE</p>
          <h2 className="section-title mb-3">11 Sacred Modules</h2>
          <p className="text-sm text-[#7a6050] leading-relaxed">
            Each module is a complete ecosystem designed to serve devotees with authenticity,
            technology, and spiritual depth.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-[#e8d9c4] rounded-2xl overflow-hidden mb-10 border border-[#e8d9c4]">
          {platformStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center py-5 px-3 text-center"
              style={{ background: '#fffff8' }}>
              <span className="text-lg sm:text-xl font-bold text-[#c9882a]"
                style={{ fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-[#9c8672] mt-1 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modules.map((mod) => (
            <NavLink
              key={mod.id}
              to={mod.path}
              className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer group hover:shadow-md transition-all duration-200 border border-transparent hover:border-[#f0d9b0]"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f59b24, #c46206)' }}>
                {mod.id}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#2d1a0e] leading-tight">{mod.title}</h4>
                <p className="text-xs text-[#9c8672] mt-0.5">{mod.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#c9882a] flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}
