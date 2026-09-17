import ScriptureChapterCard from './ScriptureChapterCard';
import { KANDA_ORDER } from '../utils/ramayanaKandas';

/**
 * RamayanaKandaCard — one Kanda tile in the "Choose a Kanda" grid.
 * Renders through the same ScriptureChapterCard used for Bhagavad Gita's
 * chapter grid, so every book in the Scriptures section shares one card
 * design.
 */
export default function RamayanaKandaCard({ kanda, onSelect }) {
    const sargaCount = kanda.chapters.length;
    const orderIndex = KANDA_ORDER.indexOf(kanda.name);

    return (
        <ScriptureChapterCard
            number={orderIndex >= 0 ? orderIndex + 1 : undefined}
            unitLabel="Kanda"
            title={kanda.name}
            description={kanda.description}
            meta={`${sargaCount} Sarga${sargaCount === 1 ? '' : 's'}`}
            accentColor={kanda.color}
            onRead={() => onSelect(kanda)}
        />
    );
}
