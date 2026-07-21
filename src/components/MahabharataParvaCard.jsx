import { ArrowRight } from 'lucide-react';

export default function MahabharataParvaCard({ parva, onSelect }) {
    const chapterCount = parva.chapters.length;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(parva)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(parva)}
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
                style={{ background: parva.color }}>
                {parva.emoji}
            </div>

            <h3 className="text-xl font-semibold text-[#2d1a0e] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}>
                {parva.name}
            </h3>

            {parva.bookLabel && (
                <p className="text-xs text-gray-400 mb-3">{parva.bookLabel}</p>
            )}

            <div className="flex items-center justify-between mt-4">
                <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: '#f5f0e8', color: '#6b5b4d', border: '1px solid #edd9b3' }}>
                    {chapterCount} Adhyaya{chapterCount === 1 ? '' : 's'}
                </span>

                <button
                    onClick={(e) => { e.stopPropagation(); onSelect(parva); }}
                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: '#e07c0a' }}
                >
                    View Parva
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
