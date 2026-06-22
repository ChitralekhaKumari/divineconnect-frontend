import { NavLink } from 'react-router-dom';

const features = [
  { icon: '📺', title: 'Live Darshan', desc: 'Watch live temple rituals from the comfort of your home, streamed in real time.' },
  { icon: '🙏', title: 'Book Pujas Online', desc: 'Choose from 100s of pujas, pick a pandit, and get prasad delivered to your door.' },
  { icon: '🔮', title: 'Astrology & Guidance', desc: 'Get personalized kundali readings and daily horoscopes from expert astrologers.' },
  { icon: '🎵', title: 'Bhajans & Scriptures', desc: 'Access thousands of bhajans, aarti, stotras and scripture texts anytime.' },
];

export default function AppDownload() {
  return (
    <section className="py-16 bg-white" id="app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-label">A TEMPLE IN EVERY POCKET</p>
          <h2 className="section-title max-w-xl mx-auto">A Temple in Every Pocket</h2>
          <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed">
            DivineConnect puts the entire sacred universe in your hands. From live darshan to puja booking,
            astrology to bhajans — experience the divine from anywhere in the world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl bg-[#fdfaf5] border border-[#f5e8d0] hover:border-[#f9bb5c] hover:shadow-md transition-all duration-200 group">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-3 shadow-sm group-hover:scale-110 transition-transform duration-200">
                {f.icon}
              </div>
              <h4 className="font-semibold text-[#2d1a0e] text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button className="flex items-center gap-3 bg-[#2d1a0e] text-white px-6 py-3 rounded-xl hover:bg-[#1a0e08] transition-colors">
            <span className="text-2xl">🍎</span>
            <div className="text-left">
              <p className="text-[10px] text-white/60 leading-none">Download on the</p>
              <p className="text-sm font-bold leading-tight">App Store</p>
            </div>
          </button>
          <button className="flex items-center gap-3 bg-[#2d1a0e] text-white px-6 py-3 rounded-xl hover:bg-[#1a0e08] transition-colors">
            <span className="text-2xl">▶</span>
            <div className="text-left">
              <p className="text-[10px] text-white/60 leading-none">Get it on</p>
              <p className="text-sm font-bold leading-tight">Google Play</p>
            </div>
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-[#f0e4cc] text-center">
          <p className="text-sm text-gray-500 mb-4">Ready to begin your spiritual journey?</p>
          <NavLink to="/epuja" className="btn-primary px-8 py-3">
            Book Your First Puja Free →
          </NavLink>
        </div>
      </div>
    </section>
  );
}
