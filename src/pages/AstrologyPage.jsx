import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Star, Moon, Sun, ChevronRight, Clock } from 'lucide-react';

const astrologers = [
  { id: 1, name: 'Pt. Rajendra Sharma', speciality: 'Vedic Astrology', experience: '25 yrs', rating: 4.9, sessions: 3200, lang: 'Hindi, English', price: 500, available: true, initial: 'RS', gradient: 'linear-gradient(135deg, #f59b24, #c46206)' },
  { id: 2, name: 'Acharya Deepa Nair', speciality: 'Numerology & Vastu', experience: '18 yrs', rating: 4.8, sessions: 2100, lang: 'Tamil, English', price: 400, available: true, initial: 'DN', gradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)' },
  { id: 3, name: 'Jyotishi Vikram Das', speciality: 'Kundli & Muhurat', experience: '30 yrs', rating: 5.0, sessions: 5800, lang: 'Hindi, Sanskrit', price: 800, available: false, initial: 'VD', gradient: 'linear-gradient(135deg, #059669, #047857)' },
  { id: 4, name: 'Smt. Kamala Devi', speciality: 'Tarot & Prashna', experience: '15 yrs', rating: 4.7, sessions: 1400, lang: 'Telugu, English', price: 350, available: true, initial: 'KD', gradient: 'linear-gradient(135deg, #e07c0a, #9a3412)' },
];

const services = [
  { icon: '📜', title: 'Kundli Analysis', desc: 'Detailed birth chart reading covering life, career, relationships and health.', price: '₹799', duration: '60 min' },
  { icon: '⏰', title: 'Muhurat Selection', desc: 'Find the most auspicious timing for marriage, business, travel and events.', price: '₹499', duration: '45 min' },
  { icon: '🌟', title: 'Annual Horoscope', desc: 'Comprehensive yearly predictions with monthly breakdowns for all life areas.', price: '₹1,299', duration: '90 min' },
  { icon: '💫', title: 'Prashna Jyotish', desc: 'Instant answers to your urgent questions through ancient horary astrology.', price: '₹599', duration: '30 min' },
  { icon: '💎', title: 'Gemstone Guidance', desc: 'Personalized gemstone recommendations based on your birth chart for balance.', price: '₹399', duration: '30 min' },
  { icon: '🏠', title: 'Vastu Shastra', desc: 'Energize your home or office with Vastu principles for prosperity and peace.', price: '₹999', duration: '75 min' },
];

const rashis = [
  { name: 'Aries', symbol: '♈', en: 'Mesha' }, { name: 'Taurus', symbol: '♉', en: 'Vrishabha' },
  { name: 'Gemini', symbol: '♊', en: 'Mithuna' }, { name: 'Cancer', symbol: '♋', en: 'Karka' },
  { name: 'Leo', symbol: '♌', en: 'Simha' }, { name: 'Virgo', symbol: '♍', en: 'Kanya' },
  { name: 'Libra', symbol: '♎', en: 'Tula' }, { name: 'Scorpio', symbol: '♏', en: 'Vrishchika' },
  { name: 'Sagittarius', symbol: '♐', en: 'Dhanu' }, { name: 'Capricorn', symbol: '♑', en: 'Makara' },
  { name: 'Aquarius', symbol: '♒', en: 'Kumbha' }, { name: 'Pisces', symbol: '♓', en: 'Meena' },
];

export default function AstrologyPage() {
  const [selectedRashi, setSelectedRashi] = useState(null);

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
      <div className="relative py-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0720 0%, #1e0b4a 50%, #0f0720 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,187,92,0.3) 0%, transparent 40%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{ background: 'rgba(124,58,237,0.3)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.4)' }}>
            JYOTISH VIDYA
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, serif' }}>
            Cosmic Guidance &<br />
            <span style={{ color: '#f9bb5c' }}>Vedic Astrology</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Connect with India's top Jyotishis for personalized kundali readings, muhurat selection, and life guidance rooted in ancient Vedic wisdom.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn-primary px-8 py-3">Talk to an Astrologer</button>
            <button className="px-8 py-3 rounded-full border text-white text-sm font-semibold hover:bg-white/10 transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
              Get Free Kundli
            </button>
          </div>
        </div>
      </div>

      <div className="py-3 overflow-x-auto scrollbar-hide" style={{ background: '#1a0a2e' }}>
        <div className="flex gap-3 px-4 max-w-7xl mx-auto min-w-max">
          {rashis.map(rashi => (
            <button
              key={rashi.name}
              onClick={() => setSelectedRashi(selectedRashi === rashi.name ? null : rashi.name)}
              className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-all duration-200"
              style={selectedRashi === rashi.name
                ? { background: 'rgba(249,187,92,0.2)', border: '1px solid rgba(249,187,92,0.5)' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="text-lg">{rashi.symbol}</span>
              <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: selectedRashi === rashi.name ? '#f9bb5c' : 'rgba(255,255,255,0.7)' }}>{rashi.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <span className="section-label">CONSULTATION TYPES</span>
          <h2 className="section-title">Astrology Services</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(s => (
            <div key={s.title}
              className="bg-white rounded-2xl p-6 cursor-pointer group hover:shadow-lg transition-all duration-300 flex gap-4"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="text-3xl flex-shrink-0">{s.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#2d1a0e] text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#e07c0a]">{s.price}</span>
                    <span className="text-xs text-gray-400 ml-1.5">· {s.duration}</span>
                  </div>
                  <button className="btn-primary text-xs px-3 py-1.5">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff' }} className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">OUR JYOTISHIS</span>
            <h2 className="section-title">Expert Astrologers</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Connect with verified, experienced astrologers for personalized Vedic guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {astrologers.map(a => (
              <div key={a.id}
                className="bg-white rounded-2xl p-5 text-center group hover:shadow-xl transition-all duration-300"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f5e8d0' }}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: a.gradient }}>
                    {a.initial}
                  </div>
                  {a.available && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <h3 className="font-semibold text-[#2d1a0e] text-sm mb-0.5">{a.name}</h3>
                <p className="text-xs font-medium mb-2" style={{ color: '#e07c0a' }}>{a.speciality}</p>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-[#f59b24] fill-[#f59b24]" />
                  <span className="text-xs font-bold text-[#2d1a0e]">{a.rating}</span>
                  <span className="text-xs text-gray-400">· {a.sessions.toLocaleString()} sessions</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{a.experience}</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">{a.lang}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#2d1a0e]">₹{a.price}<span className="text-xs font-normal text-gray-400">/session</span></span>
                </div>
                <button
                  className="w-full text-xs font-semibold py-2.5 rounded-full transition-all"
                  style={a.available
                    ? { background: '#e07c0a', color: '#fff' }
                    : { background: '#f0e8e0', color: '#9c8672', cursor: 'not-allowed' }}
                  disabled={!a.available}
                >
                  {a.available ? 'Book Session' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-14 px-4" style={{ background: 'linear-gradient(135deg, #fdfaf5, #faf0dc)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-label">FREE KUNDLI</span>
            <h2 className="section-title">Generate Your Birth Chart</h2>
            <p className="text-sm text-gray-500 mt-2">Enter your birth details for an instant free kundli analysis.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Full Name', placeholder: 'Your full name', type: 'text' },
                { label: 'Date of Birth', placeholder: '', type: 'date' },
                { label: 'Time of Birth', placeholder: '', type: 'time' },
                { label: 'Place of Birth', placeholder: 'City, State, Country', type: 'text' },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-xs font-semibold text-[#5c4a3a] mb-1.5 block">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors"
                    style={{ borderColor: '#edd9b3', background: '#fdfaf5', color: '#2d1a0e' }}
                    onFocus={e => e.target.style.borderColor = '#f59b24'}
                    onBlur={e => e.target.style.borderColor = '#edd9b3'}
                  />
                </div>
              ))}
            </div>
            <button className="btn-primary w-full justify-center py-3">Generate Free Kundli →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
