import ScriptureChapterCard from './ScriptureChapterCard';

/**
 * MahabharataParvaCard — one Parva tile in the "Choose a Parva" grid.
 * Renders through the same ScriptureChapterCard used for Bhagavad Gita's
 * chapter grid, so every book in the Scriptures section shares one card
 * design.
 */
export default function MahabharataParvaCard({ parva, onSelect }) {
    const chapterCount = parva.chapters.length;
    const bookMatch = parva.bookLabel && parva.bookLabel.match(/Book (\d+)/);

    return (
        <ScriptureChapterCard
            number={bookMatch ? Number(bookMatch[1]) : undefined}
            unitLabel="Book"
            title={parva.name}
            meta={`${chapterCount} Adhyaya${chapterCount === 1 ? '' : 's'}`}
            accentColor={parva.color}
            onRead={() => onSelect(parva)}
        />
    );
}
