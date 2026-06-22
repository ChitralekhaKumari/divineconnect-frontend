import { MapPin } from 'lucide-react';

const tagColors = {
  LIVE:     'bg-red-500',
  POPULAR:  'bg-[#e07c0a]',
  FEATURED: 'bg-purple-500',
  NEW:      'bg-green-500',
};

export default function LocationCard({ name, location, image, tag, distance }) {
  return (
    <div className="card overflow-hidden group cursor-pointer">
      <div className="relative h-44 sm:h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />

        {tag && (
          <div className={`absolute top-3 left-3 ${tagColors[tag] || 'bg-gray-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1`}>
            {tag === 'LIVE' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
            {tag}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-sm leading-tight">{name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#f9bb5c]" />
            <span className="text-white/80 text-xs">{location}</span>
          </div>
        </div>
      </div>

      <div className="p-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{distance}</span>
        <button className="text-xs text-[#e07c0a] font-semibold hover:underline">
          View Temples →
        </button>
      </div>
    </div>
  );
}
