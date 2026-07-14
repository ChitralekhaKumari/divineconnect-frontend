import { ArrowRight } from 'lucide-react';

// One Kanda, shown as a clickable card — same visual language as the
// scripture cards on /scriptures (white bg, soft border, icon chip, hover
// lift), just scoped to a single Kanda's info + sarga count.
export default function RamayanaKandaCard({ kanda, onSelect }) {
    const sargaCount = kanda.chapters.length;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(kanda)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(kanda)}
            className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300"
            style={{ border: '1px solid #f5e8d0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: kanda.color }}>
                {kanda.emoji}
            </div>

            <h3 className="text-xl font-semibold text-[#2d1a0e] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}>
                {kanda.name}
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {kanda.description}
            </p>

            <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: '#f5f0e8', color: '#6b5b4d', border: '1px solid #edd9b3' }}>
                    {sargaCount} Sarga{sargaCount === 1 ? '' : 's'}
                </span>

                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(kanda); }}
                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: '#e07c0a' }}
                >
                    View Kanda
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
