import { NavLink } from 'react-router-dom';
import { templesData } from '../data/index';
import { MapPin } from 'lucide-react';

const tagColors = {
  LIVE: 'bg-red-500',
  POPULAR: 'bg-[#e07c0a]',
  FEATURED: 'bg-purple-500',
  NEW: 'bg-green-500',
};

function TempleCard({ name, location, image, tag, distance }) {
  return (
    <NavLink to="/temples" className="relative rounded-2xl overflow-hidden group cursor-pointer block" style={{ height: '420px' }}>
      <img src={image} alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
      {tag && (
        <div className={`absolute top-3 left-3 ${tagColors[tag] || 'bg-gray-500'} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1`}>
          {tag === 'LIVE' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
          {tag}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-base leading-tight">{name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-[#f9bb5c]" />
          <span className="text-white/75 text-xs">{location}</span>
        </div>
        <p className="text-white/50 text-xs mt-1">{distance}</p>
      </div>
    </NavLink>
  );
}

export default function TempleCards() {
  return (
    <section className="py-12" style={{ background: '#fdfaf5' }} id="temples">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="section-label">SACRED TEMPLES</p>
          <h2 className="section-title">Temples of India</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Explore revered temples across India and book personalized pujas performed by temple priests.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templesData.map((temple) => (
            <TempleCard key={temple.id} {...temple} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <NavLink to="/temples" className="btn-outline">View All Temples</NavLink>
        </div>
      </div>
    </section>
  );
}
