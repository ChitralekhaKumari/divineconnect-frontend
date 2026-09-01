import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import Reveal from '../components/Reveal';

const HERO_IMAGE_URL = 'https://i.pinimg.com/736x/11/a3/af/11a3af08a74e52eb3f5bad010218fa28.jpg';

export default function AstrologyPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div>
      <div className="relative flex items-center justify-center px-4 overflow-hidden"
        style={{ minHeight: '100vh' }}>

        {/* Background photo */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }} />

        {/* Layered overlay — deep navy/violet scrim for legibility + a
            faint warm glow low-left / cool glow upper-right to echo the
            brand's saffron/violet palette without looking decorative. */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(10,5,24,0.88) 0%, rgba(15,7,32,0.82) 45%, rgba(10,5,24,0.92) 100%)' }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 85%, rgba(249,187,92,0.16) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(124,58,237,0.28) 0%, transparent 45%)' }} />

        <Reveal as="div" className="relative z-10 max-w-3xl mx-auto text-center py-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] mb-6"
            style={{ background: 'rgba(124,58,237,0.22)', color: '#dcd0fb', border: '1px solid rgba(196,181,253,0.35)' }}>
            <Sparkles className="w-3 h-3" style={{ color: '#f9bb5c' }} />
            JYOTISH VIDYA
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1]"
            style={{ fontFamily: 'var(--font-display)', textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}>
            Cosmic Guidance &<br />
            <span style={{ color: '#f9bb5c' }}>Vedic Astrology</span>
          </h1>

          <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Connect with India's top Jyotishis for personalized kundali readings, muhurat selection, and life guidance rooted in ancient Vedic wisdom.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              className="btn-primary px-9 py-3.5 text-sm sm:text-base justify-center shadow-lg"
              style={{ boxShadow: '0 12px 32px rgba(224,124,10,0.35)' }}
              onClick={() => setShowComingSoon(true)}
            >
              Talk to an Astrologer
            </button>
            <button
              className="px-9 py-3.5 rounded-full border text-white text-sm sm:text-base font-semibold backdrop-blur-sm transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)' }}
              onClick={() => setShowComingSoon(true)}
            >
              Get Free Kundli
            </button>
          </div>
        </Reveal>
      </div>

      {showComingSoon && (
        <ComingSoonModal onClose={() => setShowComingSoon(false)} />
      )}
    </div>
  );
}

function ComingSoonModal({ onClose }) {
  function onBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={onBackdrop}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="coming-soon-modal relative w-full max-w-sm rounded-3xl overflow-hidden text-center"
        style={{ background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}
      >
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #f9bb5c, #7c3aed)' }} />

        <div className="px-8 py-9">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{ background: '#f5f0e8', color: '#6b5b4d' }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-3xl mb-3">✨</div>
          <h2 className="text-xl font-bold text-[#2d1a0e] mb-7" style={{ fontFamily: 'var(--font-display)' }}>
            Coming Soon
          </h2>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: '#e07c0a' }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
