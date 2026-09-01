import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { MapPin, Star, Clock, Video, Loader2 } from 'lucide-react';
import { templeApi } from '../services/templeApi';
import WishlistButton from './WishlistButton';
import Reveal from './Reveal';

const TAG_STYLE = { LIVE: '#ef4444', POPULAR: '#e07c0a', FEATURED: '#7c3aed', NEW: '#16a34a' };

const PLACEHOLDER_IMAGES = [
  '/src/assets/images/temple-kashi.jpg',
  '/src/assets/images/temple-meenakshi.jpg',
  '/src/assets/images/temple-tirupati.jpg',
  '/src/assets/images/temple-somnath.jpg',
];
function imgFor(temple, index) {
  if (temple.image_url) return temple.image_url;
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
}

function toWishlistItem(temple, img) {
  return {
    type: 'temple',
    id: temple.id,
    title: temple.name,
    subtitle: [temple.location_city, temple.location_state].filter(Boolean).join(', '),
    image: img,
  };
}

function TempleCard({ temple, index, onDetails }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group cursor-pointer shadow-card-lg">
      <div className="relative h-80 overflow-hidden">
        <img src={imgFor(temple, index)} alt={temple.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ objectPosition: 'center top' }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
          }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
        {temple.tag && (
          <div className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1"
            style={{ background: TAG_STYLE[temple.tag] || '#666' }}>
            {temple.tag === 'LIVE' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            {temple.tag}
          </div>
        )}
        {temple.tag === 'LIVE' && (
          <button className="absolute top-3 right-12 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full hover:bg-black/60 transition-all">
            <Video className="w-3 h-3" /> Watch
          </button>
        )}
        <div className="absolute top-3 right-3">
          <WishlistButton
            item={toWishlistItem(temple, imgFor(temple, index))}
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            idleColor="#ffffff"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-sm leading-tight">{temple.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-[#f9bb5c]" />
            <span className="text-white/80 text-xs">
              {temple.location_city}, {temple.location_state}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#fff8f0', color: '#c9882a', border: '1px solid #fcd9a0' }}>
            {temple.deity}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#f59b24] fill-[#f59b24]" />
            <span className="text-xs font-bold text-[#2d1a0e]">{temple.rating}</span>
            <span className="text-xs text-gray-400">({(temple.reviews || 0).toLocaleString()})</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 truncate">{temple.timings_general || '–'}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onDetails}
            className="btn-outline flex-1 justify-center text-xs py-2 hover:bg-[#fff8f0] transition-all">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TempleCards() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    templeApi.getFeatured()
      .then((res) => {
        if (cancelled) return;
        const list = res.data || [];
        if (list.length > 0) { setTemples(list.slice(0, 4)); return; }
        return templeApi.getTemples({ limit: 4 }).then((r) => {
          if (!cancelled) setTemples((r.data || []).slice(0, 4));
        });
      })
      .catch(() => { if (!cancelled) setTemples([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-12" style={{ background: '#fdfaf5' }} id="temples">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-8">
            <p className="section-label">SACRED TEMPLES</p>
            <h2 className="section-title">Featured Temples</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Explore revered temples across India, each with its own history, deity and living tradition.
            </p>
          </div>
        </Reveal>

        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading temples...</span>
          </div>
        )}

        {!loading && temples.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            Could not load temples right now. Make sure the backend is running.
          </div>
        )}

        {!loading && temples.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {temples.map((temple, i) => (
              <Reveal key={temple.id} index={i} className="h-full">
                <TempleCard
                  temple={temple}
                  index={i}
                  onDetails={() => navigate(`/temples?open=${temple.id}`)}
                />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-8 flex justify-center">
            <NavLink to="/temples" className="btn-outline">View All Temples</NavLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
