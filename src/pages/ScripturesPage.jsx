import { useState } from 'react';
import { BookOpen, Heart } from 'lucide-react';

const scriptures = [
    {
        id: 1,
        emoji: '📖',
        title: 'Bhagavad Gita',
        description:
            'The song of God — a 700-verse dialogue between Arjuna and Lord Krishna on duty, righteousness, and the path to liberation.',
        meta: ['18 Books', 'Sanskrit'],
        color: '#e8f0fe',
        path: '/scriptures/bhagavad-gita',
    },
    {
        id: 2,
        emoji: '🏹',
        title: 'Ramayana',
        description:
            'The epic journey of Lord Rama — a tale of duty, devotion, and the triumph of good over evil.',
        meta: ['7 Books', 'Sanskrit'],
        color: '#fce4ec',
        path: '/scriptures/ramayana',
    },
    {
        id: 3,
        emoji: '⚔️',
        title: 'Mahabharata',
        description:
            'The great epic of the Bharata dynasty — the longest poem ever written, containing profound philosophical teachings.',
        meta: ['18 Books', 'Sanskrit'],
        color: '#ede7f6',
        path: '/scriptures/mahabharata',
    },
    {
        id: 4,
        emoji: '🕉️',
        title: 'Upanishads',
        description:
            'The philosophical texts that form the theoretical basis of Hinduism, exploring the nature of reality and self.',
        meta: ['108 Texts', 'Sanskrit'],
        color: '#e8f5e9',
        path: '/scriptures/upanishads',
    },
    {
        id: 5,
        emoji: '📜',
        title: 'Vedas',
        description:
            'The oldest sacred texts of Hinduism, composed of hymns, rituals, and philosophical discourses.',
        meta: ['4 Books', 'Sanskrit'],
        color: '#fff8e1',
        path: '/scriptures/vedas',
    },
    {
        id: 6,
        emoji: '🌌',
        title: 'Puranas',
        description:
            'Ancient texts of mythology, cosmology, and genealogies of kings, heroes, sages, and demigods.',
        meta: ['18 Books', 'Sanskrit'],
        color: '#e0f7fa',
        path: '/scriptures/puranas',
    },
];

export default function ScripturesPage() {
    const [favorites, setFavorites] = useState([]);

    const toggleFav = (id, e) => {
        e.stopPropagation();
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    return (
        <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Page Header */}
                <span className="section-label">SACRED KNOWLEDGE</span>
                <h1
                    className="text-4xl sm:text-5xl font-bold text-[#2d1a0e] mt-2 mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Scriptures
                </h1>
                <p className="text-sm sm:text-base text-gray-500 max-w-xl mb-10">
                    Explore the timeless wisdom of Hindu sacred texts —{' '}
                    <span style={{ color: '#e07c0a' }}>the foundation of Dharma.</span>
                </p>

                {/* Scripture Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scriptures.map((scripture) => {
                        const isFav = favorites.includes(scripture.id);
                        return (
                            <div
                                key={scripture.id}
                                className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300"
                                style={{
                                    border: '1px solid #f5e8d0',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Top Row: Icon + Favorite */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ background: scripture.color }}
                                    >
                                        {scripture.emoji}
                                    </div>
                                    <button
                                        onClick={(e) => toggleFav(scripture.id, e)}
                                        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                                        style={{ background: '#f7f2ea' }}
                                    >
                                        <Heart
                                            className="w-4 h-4"
                                            style={{
                                                color: isFav ? '#e07c0a' : '#9c8672',
                                                fill: isFav ? '#e07c0a' : 'none',
                                            }}
                                        />
                                    </button>
                                </div>

                                {/* Title */}
                                <h3
                                    className="text-xl font-semibold text-[#2d1a0e] mb-2"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {scripture.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                                    {scripture.description}
                                </p>

                                {/* Meta Tags */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {scripture.meta.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-3 py-1 rounded-full font-medium"
                                            style={{
                                                background: '#f5f0e8',
                                                color: '#6b5b4d',
                                                border: '1px solid #edd9b3',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Read Now Link */}
                                <button
                                    className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                                    style={{ color: '#e07c0a' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c46206')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#e07c0a')}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Read Now →
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
