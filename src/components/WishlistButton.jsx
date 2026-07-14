import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

// item: { type: 'prayer'|'scripture'|'temple', id, title, subtitle, image, meta }
export default function WishlistButton({ item, size = 'md', className = '', style = {}, idleColor = '#9c8672' }) {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const active = isWishlisted(item.type, item.id);

    const dims = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-10 h-10' : 'w-9 h-9';
    const iconDims = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

    function handleClick(e) {
        e.stopPropagation();
        e.preventDefault();
        toggleWishlist(item);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-pressed={active}
            aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`wishlist-heart-btn ${dims} rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-150 ${className}`}
            style={{ background: '#f7f2ea', ...style }}
        >
            <Heart
                className={`${iconDims} wishlist-heart-icon ${active ? 'wishlist-heart-pop' : ''}`}
                style={{ color: active ? '#e07c0a' : idleColor, fill: active ? '#e07c0a' : 'none' }}
            />
        </button>
    );
}
