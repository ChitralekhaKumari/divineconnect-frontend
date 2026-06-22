import { NavLink } from 'react-router-dom';
import { pujasData } from '../data/index';

function PujaCard({ temple, name, duration, price, image }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <div className="h-52 overflow-hidden">
        <img src={image} alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold tracking-widest text-[#c9882a] mb-1">{temple}</p>
        <h3 className="font-semibold text-[#2d1a0e] text-lg mb-1" style={{ fontFamily: 'Georgia, serif' }}>{name}</h3>
        <p className="text-xs text-[#9c8672] mb-4">{duration}</p>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#2d1a0e]">₹{price.toLocaleString()}</span>
          <NavLink to="/epuja"
            className="text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            style={{ background: '#c9882a' }}
            onMouseOver={e => e.currentTarget.style.background = '#a36a18'}
            onMouseOut={e => e.currentTarget.style.background = '#c9882a'}
          >
            Book Now
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default function PujaCards() {
  return (
    <section className="py-14" style={{ background: '#faf6ef' }} id="pujas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-xl">
          <p className="section-label">POPULAR RITUALS</p>
          <h2 className="section-title mb-2">Most Booked Pujas</h2>
          <p className="text-sm text-[#7a6050]">
            Discover our most sought-after rituals, performed with devotion by experienced temple priests.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pujasData.map((puja) => (
            <PujaCard key={puja.id} {...puja} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <NavLink to="/epuja"
            className="text-sm font-semibold px-8 py-2.5 rounded-full border transition-all duration-200 hover:bg-[#faf0e0]"
            style={{ borderColor: '#c9882a', color: '#2d1a0e' }}
          >
            View All Rituals
          </NavLink>
        </div>
      </div>
    </section>
  );
}
