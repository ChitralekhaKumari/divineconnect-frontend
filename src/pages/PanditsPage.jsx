import { useState } from 'react';
import { Star, Clock, Search, MapPin, Phone, Check } from 'lucide-react';

const pandits = [
  { id: 1, name: 'Pt. Ramesh Shastri', speciality: 'Graha Puja, Havan', location: 'Varanasi', experience: '22 yrs', rating: 4.9, sessions: 1840, price: 1500, available: true, lang: 'Hindi, Sanskrit', initial: 'RS', gradient: 'linear-gradient(135deg, #f59b24, #c46206)', verified: true },
  { id: 2, name: 'Pt. Suresh Joshi', speciality: 'Navgraha, Kundli', location: 'Pune', experience: '17 yrs', rating: 4.8, sessions: 960, price: 1200, available: true, lang: 'Marathi, Hindi', initial: 'SJ', gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)', verified: true },
  { id: 3, name: 'Pt. Anand Bhat', speciality: 'Satyanarayana Katha', location: 'Udupi', experience: '28 yrs', rating: 5.0, sessions: 3210, price: 2000, available: false, lang: 'Kannada, Sanskrit', initial: 'AB', gradient: 'linear-gradient(135deg, #059669, #047857)', verified: true },
  { id: 4, name: 'Pt. Ganesh Tiwari', speciality: 'Vivah, Griha Pravesh', location: 'Delhi', experience: '12 yrs', rating: 4.7, sessions: 720, price: 1800, available: true, lang: 'Hindi, Punjabi', initial: 'GT', gradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)', verified: true },
  { id: 5, name: 'Smt. Lakshmi Iyer', speciality: 'Vastu, South Indian Pujas', location: 'Chennai', experience: '20 yrs', rating: 4.9, sessions: 2100, price: 1600, available: true, lang: 'Tamil, Telugu, English', initial: 'LI', gradient: 'linear-gradient(135deg, #e07c0a, #c46206)', verified: true },
  { id: 6, name: 'Pt. Dinesh Pandey', speciality: 'Rudrabhishek, Shiva Puja', location: 'Rishikesh', experience: '35 yrs', rating: 5.0, sessions: 4500, price: 2500, available: true, lang: 'Hindi, Sanskrit', initial: 'DP', gradient: 'linear-gradient(135deg, #6b21a8, #4a044e)', verified: true },
  { id: 7, name: 'Pt. Venkat Rao', speciality: 'Tirupati Seva, Archana', location: 'Tirupati', experience: '19 yrs', rating: 4.8, sessions: 1650, price: 1300, available: false, lang: 'Telugu, Sanskrit', initial: 'VR', gradient: 'linear-gradient(135deg, #0369a1, #0c4a6e)', verified: true },
  { id: 8, name: 'Pt. Krishna Murthy', speciality: 'Bhagavad Gita, Vishnu Puja', location: 'Guruvayur', experience: '24 yrs', rating: 4.9, sessions: 2800, price: 1700, available: true, lang: 'Malayalam, Sanskrit', initial: 'KM', gradient: 'linear-gradient(135deg, #0e7490, #155e75)', verified: true },
];

const rituals = ['All Pujas', 'Graha Puja', 'Havan', 'Vivah', 'Griha Pravesh', 'Rudrabhishek', 'Satyanarayana'];

export default function PanditsPage() {
  const [search, setSearch] = useState('');
  const [activeRitual, setActiveRitual] = useState('All Pujas');

  const filtered = pandits.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.speciality.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchRitual = activeRitual === 'All Pujas' || p.speciality.toLowerCase().includes(activeRitual.toLowerCase());
    return matchSearch && matchRitual;
  });

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
      <div className="relative py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #2d1a0e 0%, #5c3317 60%, #2d1a0e 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('/src/assets/images/hero-temple.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{ background: 'rgba(249,187,92,0.2)', color: '#f9bb5c', border: '1px solid rgba(249,187,92,0.3)' }}>
            VERIFIED PRIESTS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, serif' }}>
            Book a Qualified Pandit
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8">
            All our pandits are background-verified, tradition-trained, and highly rated by thousands of devotees across India.
          </p>
          <div className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ritual or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.95)', color: '#2d1a0e' }}
              />
            </div>
            <button className="btn-primary px-5">Search</button>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-white border-b border-[#edd9b3] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {rituals.map(r => (
            <button
              key={r}
              onClick={() => setActiveRitual(r)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={activeRitual === r
                ? { background: '#e07c0a', color: '#fff' }
                : { background: '#fdfaf5', color: '#5c4a3a', border: '1px solid #e8d5b0' }}
            >
              {r}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{filtered.length} pandits</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(p => (
            <div key={p.id}
              className="bg-white rounded-2xl p-5 group hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f5e8d0' }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ background: p.gradient }}>
                  {p.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-semibold text-[#2d1a0e] text-sm truncate">{p.name}</h3>
                    {p.verified && (
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium truncate" style={{ color: '#e07c0a' }}>{p.speciality}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-[#c9882a] flex-shrink-0" />
                  <span>{p.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3 text-[#c9882a] flex-shrink-0" />
                  <span>{p.experience} experience</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-[#f59b24] fill-[#f59b24]" />
                  <span className="font-semibold text-[#2d1a0e]">{p.rating}</span>
                  <span className="text-gray-400">({p.sessions.toLocaleString()} sessions)</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-4 truncate">{p.lang}</div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold text-[#2d1a0e]">₹{p.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400"> /puja</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.available ? 'Available' : 'Busy'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 text-xs font-semibold py-2.5 rounded-full transition-all"
                  style={p.available
                    ? { background: '#e07c0a', color: '#fff' }
                    : { background: '#f0e8e0', color: '#9c8672', cursor: 'not-allowed' }}
                  disabled={!p.available}
                >
                  Book Now
                </button>
                <button className="px-3 py-2.5 rounded-full text-xs font-semibold transition-all btn-outline">
                  <Phone className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-lg font-semibold text-[#2d1a0e] mb-2">No pandits found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      <div className="py-12 px-4" style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="section-label">OUR PROMISE</span>
            <h2 className="section-title">Why Book Through DivineConnect?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '✅', title: 'Background Verified', desc: 'Every pandit is thoroughly verified by our team' },
              { icon: '📚', title: 'Tradition Trained', desc: 'Trained in Vedic traditions and scriptures' },
              { icon: '⭐', title: 'Top Rated', desc: 'Only highest-rated pandits on our platform' },
              { icon: '🔒', title: 'Secure Booking', desc: 'Safe, encrypted payments and booking guarantee' },
            ].map(item => (
              <div key={item.title} className="text-center p-5 rounded-2xl" style={{ background: '#fdfaf5', border: '1px solid #f0e4cc' }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-[#2d1a0e] text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
