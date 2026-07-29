import { NavLink } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';

// Mirrors a subset of the pandits already listed on the Pandits page
// (that data is defined locally there, not served via an API yet).
const pandits = [
  { id: 1, name: 'Pt. Ramesh Shastri', speciality: 'Graha Puja, Havan', experience: '22 yrs', initial: 'RS', gradient: 'linear-gradient(135deg, #f59b24, #c46206)' },
  { id: 5, name: 'Smt. Lakshmi Iyer', speciality: 'Vastu, South Indian Pujas', experience: '20 yrs', initial: 'LI', gradient: 'linear-gradient(135deg, #e07c0a, #c46206)' },
  { id: 6, name: 'Pt. Dinesh Pandey', speciality: 'Rudrabhishek, Shiva Puja', experience: '35 yrs', initial: 'DP', gradient: 'linear-gradient(135deg, #6b21a8, #4a044e)' },
  { id: 8, name: 'Pt. Krishna Murthy', speciality: 'Bhagavad Gita, Vishnu Puja', experience: '24 yrs', initial: 'KM', gradient: 'linear-gradient(135deg, #0e7490, #155e75)' },
];

function PanditCard({ pandit }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col items-center text-center shadow-card-md"
      style={{ border: '1px solid #f5e8d0' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 mb-3 relative"
        style={{ background: pandit.gradient }}>
        {pandit.initial}
        <BadgeCheck className="w-4 h-4 text-white absolute -bottom-0.5 -right-0.5 bg-[#16a34a] rounded-full p-0.5" style={{ width: 16, height: 16 }} />
      </div>
      <h3 className="text-sm font-semibold text-[#2d1a0e]">{pandit.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{pandit.speciality}</p>
      <p className="text-xs font-semibold mt-0.5" style={{ color: '#e07c0a' }}>{pandit.experience} experience</p>
      <NavLink to="/pandits"
        className="mt-4 inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-full transition-all w-full"
        style={{ background: '#f3ece1', color: '#5c3317' }}>
        View Profile
      </NavLink>
    </div>
  );
}

export default function FeaturedPandits() {
  return (
    <section className="py-12" style={{ background: '#fdfaf5' }} id="pandits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="section-label">VERIFIED PRIESTS</p>
          <h2 className="section-title">Featured Pandits</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Connect with experienced, verified pandits for guidance and rituals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pandits.map((p) => (
            <PanditCard key={p.id} pandit={p} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <NavLink to="/pandits" className="btn-outline">View All Pandits</NavLink>
        </div>
      </div>
    </section>
  );
}
