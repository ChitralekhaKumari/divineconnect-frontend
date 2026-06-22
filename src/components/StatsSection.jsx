import { statsData } from '../data/index';

function StatItem({ value, label }) {
  return (
    <div className="flex flex-col items-center text-center px-6">
      <span className="text-2xl sm:text-3xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'Georgia, serif' }}>{value}</span>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-white border-b border-[#edd9b3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Location pill */}
          <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm border border-[#edd9b3]" style={{ background: '#fdfaf5' }}>
            <span className="text-lg">📍</span>
            <span className="text-gray-600 font-medium text-sm">Geeta Pariseva</span>
            <span className="text-gray-400 text-xs ml-1">▼</span>
            <button
              className="ml-3 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors"
              style={{ background: '#e07c0a' }}
              onMouseOver={e => e.target.style.background = '#c46206'}
              onMouseOut={e => e.target.style.background = '#e07c0a'}
            >
              Book Puja
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center divide-x divide-[#edd9b3]">
            {statsData.map((stat) => (
              <StatItem key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
