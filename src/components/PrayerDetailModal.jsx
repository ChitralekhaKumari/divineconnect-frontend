import { X, BookOpen } from 'lucide-react';
import WishlistButton from './WishlistButton';

export default function PrayerDetailModal({ prayer, onClose }) {
    if (!prayer) return null;

    const wishlistItem = {
        type: 'prayer',
        id: prayer.slug || prayer.id,
        title: prayer.title,
        subtitle: `${prayer.deity} · ${prayer.frequency}`,
        meta: { emoji: '🙏' },
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

                {/* Header */}
                <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-2">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: '#fdf0d8' }}>
                            <BookOpen className="w-5 h-5" style={{ color: '#e07c0a' }} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
                                {prayer.title}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {prayer.deity} · {prayer.frequency}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <WishlistButton item={wishlistItem} />
                        <button onClick={onClose}
                            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all shadow-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 pt-4">
                    <div className="rounded-xl p-4 sm:p-5"
                        style={{ background: '#fdfaf5', border: '1px solid #f5e8d0' }}>

                        <p className="text-xs font-semibold mb-1" style={{ color: '#e07c0a' }}>SANSKRIT</p>
                        <p className="text-base sm:text-lg text-[#2d1a0e] leading-relaxed mb-3"
                            style={{ fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}>
                            {prayer.sanskrit}
                        </p>

                        <p className="text-xs font-semibold mb-1" style={{ color: '#e07c0a' }}>TRANSLITERATION</p>
                        <p className="text-xs sm:text-sm text-gray-600 italic mb-4"
                            style={{ whiteSpace: 'pre-line' }}>
                            {prayer.transliteration}
                        </p>

                        <div className="mb-3">
                            <p className="text-xs font-semibold text-[#5c4a3a] mb-1">MEANING</p>
                            <p className="text-sm text-gray-600 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                                {prayer.meaning}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-[#5c4a3a] mb-1">BENEFITS</p>
                            <p className="text-sm text-gray-600 leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                                {prayer.benefits}
                            </p>
                        </div>
                    </div>

                    {/* Bottom close button */}
                    <div className="flex justify-end pt-5">
                        <button onClick={onClose}
                            className="px-6 py-3 rounded-full text-sm font-semibold border border-[#e8d5b0] text-white hover:bg-[#e47b02] transition-all cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}