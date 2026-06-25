import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Star, Clock, Search, ChevronRight, Check, Package, Truck, Video, FileText } from 'lucide-react';

const pujaList = [
  { id: 1, temple: 'KASHI VISHWANATH', name: 'Rudrabhishek', duration: '1.5 hours', price: 2100, rating: 4.9, reviews: 412, tag: 'BESTSELLER', image: '/src/assets/images/temple-kashi.jpg', includes: ['Pandit', 'Samagri', 'Live Stream', 'Prasad'] },
  { id: 2, temple: 'KASHI VISHWANATH', name: 'Ganga Aarti', duration: '45 mins', price: 1100, rating: 4.8, reviews: 867, tag: 'POPULAR', image: '/src/assets/images/ritual-aarti.jpg', includes: ['Pandit', 'Samagri', 'Live Stream', 'Prasad'] },
  { id: 3, temple: 'TIRUPATI BALAJI', name: 'Suprabhatam Seva', duration: '30 mins', price: 3500, rating: 5.0, reviews: 234, tag: 'FEATURED', image: '/src/assets/images/temple-tirupati.jpg', includes: ['Pandit', 'Samagri', 'Video Recording', 'Prasad'] },
  { id: 4, temple: 'SOMNATH TEMPLE', name: 'Evening Aarti', duration: '30 mins', price: 501, rating: 4.7, reviews: 1203, tag: 'POPULAR', image: '/src/assets/images/temple-somnath.jpg', includes: ['Pandit', 'Samagri', 'Live Stream'] },
  { id: 5, temple: 'MEENAKSHI AMMAN', name: 'Sahasranama Archana', duration: '2 hours', price: 1800, rating: 4.8, reviews: 345, tag: 'NEW', image: '/src/assets/images/temple-meenakshi.jpg', includes: ['Pandit', 'Samagri', 'Live Stream', 'Prasad'] },
  { id: 6, temple: 'KASHI VISHWANATH', name: 'Satyanarayan Katha', duration: '3 hours', price: 4500, rating: 4.9, reviews: 189, tag: 'FEATURED', image: '/src/assets/images/cta.jpg', includes: ['Pandit', 'Full Samagri', 'Live Stream', 'Prasad', 'Certificate'] },
  { id: 7, temple: 'TIRUPATI BALAJI', name: 'Kalyanotsavam', duration: '1 hour', price: 2800, rating: 5.0, reviews: 523, tag: 'BESTSELLER', image: '/src/assets/images/ritual-aarti.jpg', includes: ['Pandit', 'Samagri', 'Video', 'Prasad'] },
  { id: 8, temple: 'SOMNATH TEMPLE', name: 'Mahamrityunjaya Jaap', duration: '2 hours', price: 3200, rating: 4.8, reviews: 276, tag: 'POPULAR', image: '/src/assets/images/temple-somnath.jpg', includes: ['Pandit', 'Samagri', 'Certificate'] },
];

const tagColors = { BESTSELLER: '#f59b24', POPULAR: '#e07c0a', FEATURED: '#7c3aed', NEW: '#16a34a' };

const steps = [
  { icon: <FileText className="w-5 h-5" />, title: 'Choose & Book', desc: 'Select your puja, temple and date. Fill in your sankalp details.' },
  { icon: <Package className="w-5 h-5" />, title: 'Pandit Assigned', desc: 'An expert pandit is assigned and samagri is prepared with care.' },
  { icon: <Video className="w-5 h-5" />, title: 'Live Streaming', desc: 'Watch your puja live from the temple — feel every moment.' },
  { icon: <Truck className="w-5 h-5" />, title: 'Prasad Delivered', desc: 'Sacred prasad is dispatched and delivered right to your door.' },
];

export default function EPujaPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const temples = ['All', 'Kashi Vishwanath', 'Tirupati Balaji', 'Somnath', 'Meenakshi'];

  const filtered = pujaList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.temple.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || p.temple.toLowerCase().includes(activeFilter.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
      <div className="relative py-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2d1a0e 0%, #7c3a14 50%, #2d1a0e 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url('/src/assets/images/ritual-aarti.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4" style={{ fontFamily: 'var(--font-label)' }}
            style={{ background: 'rgba(249,187,92,0.2)', color: '#f9bb5c', border: '1px solid rgba(249,187,92,0.3)' }}>
            BOOK YOUR PUJA ONLINE
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}>
            Sacred Pujas,<br />
            <span style={{ color: '#f9bb5c' }}>Performed With Devotion</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Choose from 500+ authentic rituals performed by verified pandits at renowned temples.
            Watch live, receive prasad at home.
          </p>
          <div className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pujas..."
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

      <div className="py-12" style={{ background: '#fff' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center section-title mb-8">How It Works</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #f9bb5c, #e07c0a)', color: '#fff' }}>
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-[#e07c0a] mb-1">0{i + 1}</div>
                <h4 className="font-semibold text-[#2d1a0e] text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <span className="section-label">SACRED RITUALS</span>
            <h2 className="section-title">Book a Puja</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {temples.map(t => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                style={activeFilter === t
                  ? { background: '#e07c0a', color: '#fff' }
                  : { background: '#fdfaf5', color: '#5c4a3a', border: '1px solid #e8d5b0' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(puja => (
            <div key={puja.id}
              className="bg-white rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <div className="relative h-48 overflow-hidden">
                <img src={puja.image} alt={puja.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {puja.tag && (
                  <div className="absolute top-3 left-3 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase"
                    style={{ background: tagColors[puja.tag] || '#666' }}>
                    {puja.tag}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold tracking-widest text-[#c9882a] mb-1" style={{ fontFamily: 'var(--font-label)' }}>{puja.temple}</p>
                <h3 className="font-semibold text-[#2d1a0e] text-base mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}>{puja.name}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{puja.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#f59b24] fill-[#f59b24]" />
                    <span className="text-xs font-semibold text-[#2d1a0e]">{puja.rating}</span>
                    <span className="text-xs text-gray-400">({puja.reviews})</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {puja.includes.map(inc => (
                    <span key={inc} className="flex items-center gap-0.5 text-[10px] text-[#5c4a3a] px-2 py-0.5 rounded-full"
                      style={{ background: '#fdfaf5', border: '1px solid #e8d5b0' }}>
                      <Check className="w-2.5 h-2.5 text-[#c9882a]" /> {inc}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#2d1a0e]">₹{puja.price.toLocaleString()}</span>
                  <button className="btn-primary text-xs px-4 py-2">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #2d1a0e, #5c3317)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">🕉️</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Need Help Choosing a Puja?
          </h2>
          <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
            Our spiritual experts will guide you to the right ritual for your needs — health, wealth, marriage, or peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <NavLink to="/contact" className="btn-primary px-8 py-3 justify-center">
              Talk to an Expert →
            </NavLink>
            <NavLink to="/pandits" className="px-8 py-3 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all justify-center flex items-center gap-2">
              Browse Pandits
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
