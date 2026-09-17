// Maps a deity/category name to a representative image.
// Images are public-domain classical paintings (Raja Ravi Varma, d. 1906)
// served via Wikimedia Commons' Special:FilePath, which redirects straight
// to the file regardless of its storage hash — no API call needed.
const COMMONS = (file) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;

const DEITY_IMAGES = {
    ganesha: COMMONS('AshtaSiddhi.jpg'),
    shiva: COMMONS('An Oleograph of Shiva, Parvati and Nandi by Raja Ravi Varma.jpg'),
    krishna: COMMONS('Krishna as Envoy.jpg'),
    rama: COMMONS('Bharata welcoming Rama, Sita, Lakshmana and Hanuman to Ayodhya by Raja Ravi Varma.jpg'),
    hanuman: COMMONS("Hanuman fetches the herb-bearing mountain, in a print from the Ravi Varma Press, 1910's.jpg"),
    durga: COMMONS('Goddess Durga by Raja Ravi Varma.jpg'),
    lakshmi: COMMONS('Raja Ravi Varma, Goddess Lakshmi, 1896.jpg'),
    saraswati: COMMONS('Raja Ravi Varma, Goddess Saraswati.jpg'),
    vishnu: COMMONS('Vishnu Avatars.jpg'),
    surya: COMMONS('Surya poster.jpg'),
    navagraha: COMMONS('Navagraha Pooja.jpg'),
    gita: COMMONS('Krishna as Envoy.jpg'),
    savitri: COMMONS('Raja Ravi Varma, Goddess Saraswati.jpg'),
    universal: COMMONS('AshtaSiddhi.jpg'),
};

const FALLBACK = DEITY_IMAGES.universal;

/** Returns a representative image URL for a deity/category name (case-insensitive).
 *  `width` requests a resized thumbnail from Wikimedia instead of the full-size
 *  source painting (which can be several MB) — always pass one for cards. */
export function getDeityImage(deity, width = 300) {
    const base = (!deity || !DEITY_IMAGES[deity.trim().toLowerCase()]) ? FALLBACK : DEITY_IMAGES[deity.trim().toLowerCase()];
    return width ? `${base}?width=${width}` : base;
}

export default DEITY_IMAGES;
