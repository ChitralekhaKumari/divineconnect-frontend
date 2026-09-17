import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';
import UpcomingFestivalCard from './UpcomingFestivalCard';

// Fallback copy — used if the admin-configured content hasn't loaded yet
// (or the API is unreachable), so the hero never renders blank.
const DEFAULTS = {
  hero_title: 'Where Faith',
  hero_title_highlight: 'Meets Technology',
  hero_description: 'Discover sacred temples, chant daily prayers, listen to devotional bhajans, read timeless scriptures, and receive AI-powered spiritual guidance — all from your sacred space.',
  hero_image_url: '/src/assets/images/hero-temple.jpg',
  hero_cta_text: 'Explore Temples',
  hero_cta_link: '/temples',
};

const DEFAULT_STATS = [
  { id: 'd1', value: '500+', label: 'Sacred Rituals' },
  { id: 'd2', value: '50+', label: 'Partner Temples' },
  { id: 'd3', value: '1M+', label: 'Blessings Delivered' },
  { id: 'd4', value: '24/7', label: 'Live Darshan' },
];

export default function HeroSection({ content, stats }) {
  const c = { ...DEFAULTS, ...(content || {}) };
  const statList = stats && stats.length > 0 ? stats : DEFAULT_STATS;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${c.hero_image_url}')` }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,240,210,0.15) 0%, rgba(255,220,150,0.25) 50%, rgba(255,235,190,0.4) 100%)' }} />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full pt-24 pb-8">
        <Reveal delay={0}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: '#2d1a0e' }}>
            {c.hero_title}
            <br />
            <span style={{ color: 'rgb(102 61 2)' }}>{c.hero_title_highlight}</span>
          </h1>
        </Reveal>

        <Reveal delay={40}>
          <p className="text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: '#5c4a3a' }}>
            {c.hero_description}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <NavLink to={c.hero_cta_link} className="btn-primary px-8 py-3 w-full sm:w-auto justify-center">
              {c.hero_cta_text}
            </NavLink>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex items-center justify-center gap-0 divide-x divide-[#c9882a]/30 mb-16">
            {statList.map((stat) => (
              <div key={stat.id || stat.label} className="flex flex-col items-center px-6 sm:px-10">
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
