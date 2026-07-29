import { useToast } from '../context/ToastContext';

// NOTE: There's no Artifacts module/API in the app yet, so this section is
// curated, display-only content. "Explore" surfaces a friendly heads-up
// instead of linking to a page that doesn't exist. Wire this up to a real
// /artifacts endpoint once that module is built.
// Capped at 4 items to keep the homepage minimal.
const artifacts = [
  { id: 1, name: 'Brass Ganesha Murti', desc: 'Hand-cast brass idol for home altars, 6 inches.', emoji: '🐘', color: '#fdf0d8' },
  { id: 2, name: 'Rudraksha Mala', desc: '108-bead mala for japa and meditation.', emoji: '📿', color: '#f3ece1' },
  { id: 3, name: 'Sri Yantra', desc: 'Copper Sri Yantra for prosperity and focus.', emoji: '🔯', color: '#fde8e8' },
  { id: 4, name: 'Brass Diya Set', desc: 'Set of 5 traditional brass oil lamps.', emoji: '🪔', color: '#fff3d6' },
];

function ArtifactCard({ artifact, onExplore }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col h-full shadow-card-sm"
      style={{ border: '1px solid #f5e8d0' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 mb-3"
        style={{ background: artifact.color }}>
        {artifact.emoji}
      </div>
      <h3 className="text-sm font-semibold text-[#2d1a0e] leading-snug">{artifact.name}</h3>
      <p className="text-xs text-gray-500 mt-1.5 flex-1">{artifact.desc}</p>
      <button onClick={onExplore}
        className="mt-4 inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-full transition-all self-start"
        style={{ background: '#f3ece1', color: '#5c3317' }}>
        Explore
      </button>
    </div>
  );
}

export default function SacredArtifacts() {
  const { showToast } = useToast();

  function handleExplore() {
    showToast('Sacred Artifacts store is launching soon!', 'success');
  }

  return (
    <section className="py-12 bg-white" id="artifacts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="section-label">PUJA ESSENTIALS</p>
          <h2 className="section-title">Sacred Artifacts</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Authentic murtis, malas, yantras and ritual essentials for your sacred space.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {artifacts.map((a) => (
            <ArtifactCard key={a.id} artifact={a} onExplore={handleExplore} />
          ))}
        </div>
      </div>
    </section>
  );
}
