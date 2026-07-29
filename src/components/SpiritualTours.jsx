import { NavLink } from 'react-router-dom';
import { MapPin } from 'lucide-react';

// NOTE: There's no dedicated Tours module/API in the app yet — only
// Temples, so these are curated highlights (reusing real temple images
// already bundled with the app) and "Explore" routes into the Temples
// page filtered/opened on that spot. Swap this static list for a real
// /tours endpoint whenever that module is built.
const destinations = [
  { name: 'Kashi (Varanasi)', state: 'Uttar Pradesh', image: '/src/assets/images/temple-kashi.jpg' },
  { name: 'Tirupati', state: 'Andhra Pradesh', image: '/src/assets/images/temple-tirupati.jpg' },
  { name: 'Somnath', state: 'Gujarat', image: '/src/assets/images/temple-somnath.jpg' },
  { name: 'Madurai', state: 'Tamil Nadu', image: '/src/assets/images/temple-meenakshi.jpg' },
];

function TourCard({ destination }) {
  return (
    <div className="relative rounded-2xl overflow-hidden group" style={{ height: '260px' }}>
      <img src={destination.image} alt={destination.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold text-base leading-tight">{destination.name}</h3>
        <div className="flex items-center gap-1 mt-1 mb-3">
          <MapPin className="w-3 h-3 text-[#f9bb5c]" />
          <span className="text-white/75 text-xs">{destination.state}</span>
        </div>
        <NavLink to="/temples"
          className="inline-flex items-center justify-center text-xs font-semibold px-4 py-1.5 rounded-full text-white transition-all hover:brightness-105"
          style={{ background: 'linear-gradient(135deg, #f59b24, #e07c0a)' }}>
          Explore
        </NavLink>
      </div>
    </div>
  );
}

export default function SpiritualTours() {
  return (
    <section className="py-12 bg-white" id="tours">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="section-label">PILGRIMAGE</p>
          <h2 className="section-title">Spiritual Tours</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Plan your journey to India's most sacred pilgrimage destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((d) => (
            <TourCard key={d.name} destination={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
