// The Ramayana's 648 chapters (Sargas) are already stored, in order, with
// titles formatted as "{Kanda Name} · Sarga {n}" (see scriptures/ramayana.md).
// Nothing about that underlying data changes here — this file only knows
// how to *group* the existing chapter list the API already returns, so the
// UI can present it Kanda-by-Kanda instead of one long flat list.

export const KANDA_ORDER = [
    'Bala Kanda',
    'Ayodhya Kanda',
    'Aranya Kanda',
    'Kishkindha Kanda',
    'Sundara Kanda',
    'Yuddha Kanda',
    'Uttara Kanda',
];

// Short (1–2 line) descriptions + a card accent — presentational only,
// doesn't touch the scripture content itself.
export const KANDA_INFO = {
    'Bala Kanda': {
        emoji: '🌱',
        color: '#e8f5e9',
        description: "Rama's birth and childhood, his training under sage Vishwamitra, and his marriage to Sita.",
    },
    'Ayodhya Kanda': {
        emoji: '👑',
        color: '#fff3e0',
        description: "Kaikeyi's boons upend the succession, and Rama, Sita, and Lakshmana depart for exile.",
    },
    'Aranya Kanda': {
        emoji: '🌳',
        color: '#e8f0fe',
        description: 'Life in the forest, encounters with sages and demons, and the abduction of Sita by Ravana.',
    },
    'Kishkindha Kanda': {
        emoji: '🐒',
        color: '#fbe9e7',
        description: "Rama allies with Sugriva and Hanuman, and the search for Sita's whereabouts begins.",
    },
    'Sundara Kanda': {
        emoji: '🌉',
        color: '#e0f7fa',
        description: "Hanuman's leap across the ocean to Lanka, and the discovery of Sita in captivity.",
    },
    'Yuddha Kanda': {
        emoji: '⚔️',
        color: '#fce4ec',
        description: 'The great war in Lanka between the forces of Rama and Ravana.',
    },
    'Uttara Kanda': {
        emoji: '🕊️',
        color: '#f3e5f5',
        description: "Rama's return, coronation in Ayodhya, and the events that follow the war.",
    },
};

// Splits a "{Kanda Name} · Sarga {n}" chapter title into its parts.
// Falls back gracefully if a title doesn't match the expected shape.
export function parseKandaTitle(title) {
    if (!title) return { kanda: null, sargaLabel: null };
    const parts = title.split('·').map((p) => p.trim());
    if (parts.length < 2) return { kanda: title, sargaLabel: null };
    return { kanda: parts[0], sargaLabel: parts[1] };
}

// Groups a flat chapters[] (as returned by GET /api/scriptures/:slug) into
// Kanda buckets, in canonical Kanda order. Chapters that don't match a known
// Kanda name (shouldn't happen, but data is data) are dropped into "Other"
// at the end, so nothing from the original dataset silently disappears.
export function groupChaptersByKanda(chapters) {
    const buckets = new Map();

    for (const chapter of chapters || []) {
        const { kanda, sargaLabel } = parseKandaTitle(chapter.title);
        const bucketName = kanda && KANDA_ORDER.includes(kanda) ? kanda : 'Other';
        if (!buckets.has(bucketName)) buckets.set(bucketName, []);
        buckets.get(bucketName).push({ ...chapter, sargaLabel: sargaLabel || chapter.title });
    }

    const ordered = KANDA_ORDER
        .filter((name) => buckets.has(name))
        .map((name) => ({
            name,
            ...KANDA_INFO[name],
            chapters: buckets.get(name),
        }));

    if (buckets.has('Other')) {
        ordered.push({ name: 'Other', emoji: '📜', color: '#f5f0e8', description: 'Additional chapters.', chapters: buckets.get('Other') });
    }

    return ordered;
}
