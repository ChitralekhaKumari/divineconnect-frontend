import { NavLink } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden" id="cta">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/src/assets/images/cta.jpg')` }} />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(108,52,15,0.6) 50%, rgba(0,0,0,0.72) 100%)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[rgb(249,187,92)] text-xs font-semibold uppercase tracking-widest mb-3">
          AI POWERED MODULE
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}>
          Meet Your{' '}
          <span className="text-[rgb(249,187,92)]">Spiritual Companion</span>
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Get personalized spiritual guidance powered by AI. Ask questions about sacred texts, puja rituals,
          auspicious timings, and your spiritual path — anytime, anywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <NavLink to="/epuja" className="btn-primary px-8 py-3 justify-center">
            Talk to AI Guru →
          </NavLink>
          <NavLink to="/contact"
            className="font-semibold px-8 py-3 rounded-full border border-white/30 text-white text-sm transition-all duration-200 hover:bg-white/25 justify-center flex items-center"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
            Learn More
          </NavLink>
        </div>
        <div className="mt-10 flex justify-center opacity-20">
          <span className="text-5xl">🕉️</span>
        </div>
      </div>
    </section>
  );
}
