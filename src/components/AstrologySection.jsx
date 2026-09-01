import { NavLink } from 'react-router-dom';
import Reveal from './Reveal';

const BG_IMAGE_URL = 'https://puja-plus-connect.lovable.app/assets/ai-guru-bg-B20UcBAf.jpg';

export default function AstrologySection() {
  return (
    <section className="relative py-20 overflow-hidden" id="astrology-cta">
   
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${BG_IMAGE_URL}')` }} />
      
      <div className="absolute inset-0" style={{ background: 'rgba(15,7,32,0.55)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <p className="text-[rgb(249,187,92)] text-xs font-semibold uppercase tracking-widest mb-3">
            PERSONALIZED ASTROLOGY
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Discover Your{' '}
            <span className="text-[rgb(249,187,92)]">Cosmic Path</span>
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Explore Vedic Astrology to understand your personality, career, relationships, health,
            and future. Get personalized horoscope insights, daily predictions, and spiritual
            guidance based on your birth chart.
          </p>
          <div className="flex justify-center">
            <NavLink to="/astrology" className="btn-primary px-8 py-3 justify-center">
              Explore Astrology →
            </NavLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
