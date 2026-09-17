import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';

// Fallback copy — used if the admin-configured content hasn't loaded yet
// (or the API is unreachable), so the section never renders blank.
const DEFAULTS = {
  astrology_label: 'PERSONALIZED ASTROLOGY',
  astrology_title: 'Discover Your',
  astrology_title_highlight: 'Cosmic Path',
  astrology_description: 'Explore Vedic Astrology to understand your personality, career, relationships, health, and future. Get personalized horoscope insights, daily predictions, and spiritual guidance based on your birth chart.',
  astrology_image_url: 'https://puja-plus-connect.lovable.app/assets/ai-guru-bg-B20UcBAf.jpg',
  astrology_cta_text: 'Explore Astrology →',
  astrology_cta_link: '/astrology',
};

export default function AstrologySection({ content }) {
  const c = { ...DEFAULTS, ...(content || {}) };

  return (
    <section className="relative py-20 overflow-hidden" id="astrology-cta">

      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${c.astrology_image_url}')` }} />

      <div className="absolute inset-0" style={{ background: 'rgba(15,7,32,0.55)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <p className="text-[rgb(249,187,92)] text-xs font-semibold uppercase tracking-widest mb-3">
            {c.astrology_label}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            {c.astrology_title}{' '}
            <span className="text-[rgb(249,187,92)]">{c.astrology_title_highlight}</span>
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            {c.astrology_description}
          </p>
          <div className="flex justify-center">
            <NavLink to={c.astrology_cta_link} className="btn-primary px-8 py-3 justify-center">
              {c.astrology_cta_text}
            </NavLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
