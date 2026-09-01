import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import UpcomingFestivalCard from './UpcomingFestivalCard';

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
        <Reveal delay={0}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: '#2d1a0e' }}>
            Where Faith
            <br />
            <span style={{ color: 'rgb(102 61 2)' }}>Meets Technology</span>
          </h1>
        </Reveal>

        <Reveal delay={40}>
          <p className="text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: '#5c4a3a' }}>
            Discover sacred temples, chant daily prayers, listen to devotional bhajans, read timeless
            scriptures, and receive AI-powered spiritual guidance — all from your sacred space.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <NavLink to="/temples" className="btn-primary px-8 py-3 w-full sm:w-auto justify-center">
              Explore Temples
            </NavLink>
          </div>
        </Reveal>

        <Reveal delay={120}>
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
        </Reveal>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 pb-10">
        <Reveal delay={160} className="max-w-2xl mx-auto">
          <UpcomingFestivalCard />
        </Reveal>
      </div>
    </section>
  );
}
