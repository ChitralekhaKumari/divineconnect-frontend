import { NavLink } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Sacred Rituals' },
  { value: '50+', label: 'Partner Temples' },
  { value: '1M+', label: 'Blessings Delivered' },
  { value: '24/7', label: 'Live Darshan' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/src/assets/images/hero-temple.jpg')` }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,240,210,0.15) 0%, rgba(255,220,150,0.25) 50%, rgba(255,235,190,0.4) 100%)' }} />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full pt-24 pb-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4"
          style={{ fontFamily: 'var(--font-display)', color: '#2d1a0e' }}>
          Where Faith
          <br />
          <span style={{ color: '#c9882a' }}>Meets Technology</span>
        </h1>

        <p className="text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: '#5c4a3a' }}>
          Book pujas, attend live darshan, consult astrologers, and receive AI-powered
          spiritual guidance — all from your sacred space.
        </p>

        {/* <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
          <NavLink to="/epuja" className="btn-primary px-8 py-3 w-full sm:w-auto justify-center">
            Book a Puja
          </NavLink>
          <NavLink
            to="/temples"
            className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold px-8 py-3 rounded-full border text-sm transition-all duration-200 hover:bg-white/60"
            style={{ borderColor: 'rgba(45,26,14,0.25)', color: '#2d1a0e', background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)' }}
          >
            <span>▶</span>
            Live Darshan
          </NavLink>
        </div> */}

        <div className="flex items-center justify-center gap-0 divide-x divide-[#c9882a]/30 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-6 sm:px-10">
              <span className="text-2xl sm:text-3xl font-bold text-[#2d1a0e]"
                style={{ fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </span>
              <span className="text-xs text-[#8a6a4a] mt-0.5 whitespace-nowrap">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 pb-10">
        <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm border border-[#e8d5b0] rounded-2xl px-6 py-4 flex items-center justify-between gap-4"
          style={{ boxShadow: '0 4px 24px rgba(180,130,60,0.12)' }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#fff8f0', border: '1px solid #f5d9a0' }}>
              <CalendarDays className="w-5 h-5 text-[#c9882a]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9882a] mb-0.5" style={{ fontFamily: 'var(--font-label)' }}>In 32 Days</p>
              <p className="text-sm font-bold text-[#2d1a0e]">Guru Purnima</p>
              <p className="text-xs text-[#8a6a4a]">Saturday, July 11</p>
            </div>
          </div>
          <NavLink to="/epuja" className="btn-primary px-5 py-2 text-xs whitespace-nowrap flex-shrink-0">
            View Calendar →
          </NavLink>
        </div>
      </div>
    </section>
  );
}
