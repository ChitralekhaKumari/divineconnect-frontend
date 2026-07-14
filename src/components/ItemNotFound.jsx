import { useNavigate } from 'react-router-dom';
import { Frown } from 'lucide-react';

// Shown when a wishlisted/linked item no longer exists.
export default function ItemNotFound({
    title = 'Item not found',
    message = 'This item may have been removed, or the link you used is incorrect.',
    backLabel = 'Back to Wishlist',
    backPath = '/wishlist',
}) {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: '#fdf0d8' }}>
                    <Frown className="w-7 h-7" style={{ color: '#e07c0a' }} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2d1a0e] mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}>
                    {title}
                </h1>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                    {message}
                </p>
                <button onClick={() => navigate(backPath)} className="btn-primary text-sm px-6 py-3">
                    {backLabel}
                </button>
            </div>
        </div>
    );
}
