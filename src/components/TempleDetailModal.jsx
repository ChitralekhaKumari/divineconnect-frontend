import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Star, Landmark, Info, Navigation, Phone, Calendar, Loader2 } from 'lucide-react';
import { templeApi } from '../services/templeApi';
import WishlistButton from './WishlistButton';

export default function TempleDetailModal({ temple, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!temple) return;
    setLoading(true);
    setError(null);
    setDetails(null);

    // If temple already has full details from the DB, use them directly
    if (temple.history && temple.full_address) {
      setDetails(normalise(temple));
      setLoading(false);
      return;
    }

    // Otherwise fetch the full record from backend
    if (temple.id) {
      templeApi.getById(temple.id)
        .then(r => { setDetails(normalise(r.data)); setLoading(false); })
        .catch(() => { setError('Could not load temple details.'); setLoading(false); });
      return;
    }

    setError('No temple ID found.');
    setLoading(false);
  }, [temple]);

  if (!temple) return null;

  const city = temple.location_city || temple.location || '';
  const state = temple.location_state || '';
  const img = temple.image_url || temple.image || '/src/assets/images/hero-temple.jpg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

        {/* Header image */}
        <div className="relative flex-shrink-0 rounded-t-3xl overflow-hidden">
          <img src={img} alt={temple.name} className="block w-full h-auto max-h-[60vh] object-contain" />
          <div className="absolute top-4 right-16">
            <WishlistButton
              item={{ type: 'temple', id: temple.id, title: temple.name, subtitle: [city, state].filter(Boolean).join(', '), image: img }}
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              idleColor="#ffffff"
            />
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all shadow-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <h2 className="text-[#2d1a0e] text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            {temple.name}
          </h2>
          {(city || state) && (
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c9882a]" />
              <span className="text-gray-500 text-sm">{[city, state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-[#e07c0a] animate-spin" />
              <p className="text-sm text-gray-500">Loading temple details…</p>
            </div>
          )}

          {error && (
            <div className="text-center py-10">
              <p className="text-red-500 text-sm mb-4">{error}</p>
            </div>
          )}

          {details && !loading && (
            <div className="space-y-5">
              {/* Rating + deity badge */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#f59b24] fill-[#f59b24]" />
                  <span className="font-bold text-[#2d1a0e]">{details.rating}</span>
                  <span className="text-xs text-gray-400">({(details.reviews || 0).toLocaleString()} reviews)</span>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: '#fff8f0', color: '#c9882a', border: '1px solid #fcd9a0' }}>
                  {details.deity}
                </span>
              </div>

              {details.famous_for && (
                <Section icon={<Landmark className="w-4 h-4" />} title="Famous For">
                  <p className="text-sm text-gray-600 leading-relaxed">{details.famous_for}</p>
                </Section>
              )}

              {details.history && (
                <Section icon={<Info className="w-4 h-4" />} title="History & Significance">
                  <p className="text-sm text-gray-600 leading-relaxed">{details.history}</p>
                </Section>
              )}

              {details.other_deities?.length > 0 && (
                <Section icon={<span className="text-base">🕉️</span>} title="Deities Worshipped">
                  <div className="flex flex-wrap gap-2">
                    <Chip label={details.deity} primary />
                    {details.other_deities.map(d => <Chip key={d} label={d} />)}
                  </div>
                </Section>
              )}

              {/* Timings */}
              <Section icon={<Clock className="w-4 h-4" />} title="Temple Timings">
                <div className="space-y-1.5 text-sm">
                  <Row label="General Hours" value={details.timings_general} />
                  {/* <Row label="Morning Aarti" value={details.timings_morning_aarti} /> */}
                  {/* <Row label="Evening Aarti" value={details.timings_evening_aarti} /> */}
                  <Row label="Closed On" value={details.timings_closed_on} />
                </div>
              </Section>

              {/* Location */}
              <Section icon={<Navigation className="w-4 h-4" />} title="Location & How to Reach">
                <div className="space-y-1.5 text-sm">
                  {details.full_address && (
                    <p className="text-gray-600">
                      {details.full_address.replace(/\s*\d{6}\s*$/, '')}
                    </p>
                  )}
                  {details.nearest_railway && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 shrink-0">🚂 Railway:</span>
                      <span className="text-[#2d1a0e]">{details.nearest_railway}</span>
                    </div>
                  )}
                  {details.nearest_airport && (
                    <div className="flex gap-2">
                      <span className="text-gray-500 shrink-0">✈️ Airport:</span>
                      <span className="text-[#2d1a0e]">{details.nearest_airport}</span>
                    </div>
                  )}
                </div>
              </Section>

              {/* Entry info */}
              {(details.entry_fee || details.dress_code) && (
                <Section icon={<span className="text-base">🎫</span>} title="Entry & Dress Code">
                  <div className="space-y-1.5 text-sm">
                    <Row label="Entry Fee" value={details.entry_fee} />
                    <Row label="Dress Code" value={details.dress_code} />
                    {details.special_darshan && <Row label="Darshan" value={details.special_darshan} />}
                  </div>
                </Section>
              )}

              {details.festivals?.length > 0 && (
                <Section icon={<Calendar className="w-4 h-4" />} title="Major Festivals">
                  <div className="flex flex-wrap gap-2">
                    {details.festivals.map(f => <Chip key={f} label={f} />)}
                  </div>
                </Section>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.best_time_visit && (
                  <InfoCard label="Best Time to Visit" value={details.best_time_visit} />
                )}
                {(details.contact_phone || details.website) && (
                  <InfoCard label="Contact">
                    {details.contact_phone && <p className="text-sm font-semibold text-[#2d1a0e]">{details.contact_phone}</p>}
                    {details.website && (
                      <a href={details.website} target="_blank" rel="noreferrer"
                        className="text-xs text-[#e07c0a] hover:underline mt-1 block truncate">
                        {details.website}
                      </a>
                    )}
                  </InfoCard>
                )}
              </div>

              {/* CTA */}
              <div className="flex gap-3 pt-2">
                {/* <button className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
                  Book Puja
                </button> */}
                <button onClick={onClose}
                  className="px-6 py-3 rounded-full text-sm font-semibold border border-[#e8d5b0] text-white  hover:bg-[#e47b02] transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #e07c0a, #c9882a)' }}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function normalise(t) {
  return {
    ...t,
    other_deities: Array.isArray(t.other_deities) ? t.other_deities : [],
    festivals: Array.isArray(t.festivals) ? t.festivals : [],
  };
}

function Section({ icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#e07c0a]">{icon}</span>
        <h3 className="text-sm font-bold text-[#2d1a0e]">{title}</h3>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="font-medium text-[#2d1a0e] text-right">{value}</span>
    </div>
  );
}

function InfoCard({ label, value, children }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: '#fff8f0', border: '1px solid #fcd9a0' }}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {value && <p className="text-sm font-semibold text-[#2d1a0e]">{value}</p>}
      {children}
    </div>
  );
}

function Chip({ label, primary }) {
  return (
    <span className="text-xs px-3 py-1 rounded-full font-medium"
      style={primary
        ? { background: '#e07c0a', color: '#fff' }
        : { background: '#fdfaf5', color: '#5c4a3a', border: '1px solid #e8d5b0' }}>
      {label}
    </span>
  );
}
