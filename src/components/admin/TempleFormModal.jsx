import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:border-[#e07c0a] transition-colors";
const inputStyle = { borderColor: '#e5ddd0' };

function Field({ label, children, full }) {
    return (
        <div className={`mb-4 ${full ? 'sm:col-span-2' : ''}`}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

const TAGS = ['', 'LIVE', 'POPULAR', 'FEATURED', 'NEW'];

// Converts a temple record (arrays as CSV strings for the form) <-> API payload
function toFormState(temple) {
    return {
        name: temple?.name || '',
        alternate_name: temple?.alternate_name || '',
        deity: temple?.deity || '',
        other_deities: (temple?.other_deities || []).join(', '),
        category: temple?.category || '',
        location_city: temple?.location_city || '',
        location_state: temple?.location_state || '',
        full_address: temple?.full_address || '',
        timings_general: temple?.timings_general || '',
        timings_morning_aarti: temple?.timings_morning_aarti || '',
        timings_evening_aarti: temple?.timings_evening_aarti || '',
        entry_fee: temple?.entry_fee || '',
        dress_code: temple?.dress_code || '',
        famous_for: temple?.famous_for || '',
        best_time_visit: temple?.best_time_visit || '',
        festivals: (temple?.festivals || []).join(', '),
        contact_phone: temple?.contact_phone || '',
        website: temple?.website || '',
        image_url: temple?.image_url || '',
        tag: temple?.tag || '',
        rating: temple?.rating ?? '',
        reviews: temple?.reviews ?? '',
    };
}

function toPayload(form) {
    return {
        ...form,
        other_deities: form.other_deities ? form.other_deities.split(',').map((s) => s.trim()).filter(Boolean) : [],
        festivals: form.festivals ? form.festivals.split(',').map((s) => s.trim()).filter(Boolean) : [],
        rating: form.rating === '' ? null : Number(form.rating),
        reviews: form.reviews === '' ? 0 : parseInt(form.reviews, 10),
    };
}

export default function TempleFormModal({ temple, onClose, onSave }) {
    const [form, setForm] = useState(() => toFormState(temple));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const isEdit = !!temple;

    function set(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.name.trim()) { setError('Temple name is required.'); return; }
        setSaving(true);
        setError('');
        try {
            await onSave(toPayload(form));
        } catch (err) {
            setError(err.message || 'Could not save temple.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[150] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="flex min-h-full items-start justify-center p-4 py-10">
                <div className="w-full max-w-2xl rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                        <h2 className="text-lg font-bold text-[#2d1a0e]">{isEdit ? 'Edit Temple' : 'Add Temple'}</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X className="w-4 h-4" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                        {error && (
                            <div className="mb-4 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                                {error}
                            </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-x-4">
                            <Field label="Temple Name *">
                                <input className={inputCls} style={inputStyle} value={form.name} onChange={(e) => set('name', e.target.value)} required />
                            </Field>
                            <Field label="Alternate Name">
                                <input className={inputCls} style={inputStyle} value={form.alternate_name} onChange={(e) => set('alternate_name', e.target.value)} />
                            </Field>
                            <Field label="Primary Deity">
                                <input className={inputCls} style={inputStyle} value={form.deity} onChange={(e) => set('deity', e.target.value)} />
                            </Field>
                            <Field label="Other Deities (comma-separated)">
                                <input className={inputCls} style={inputStyle} value={form.other_deities} onChange={(e) => set('other_deities', e.target.value)} />
                            </Field>
                            <Field label="Category">
                                <input className={inputCls} style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Jyotirlinga, Shakti Peeth…" />
                            </Field>
                            <Field label="Tag">
                                <select className={inputCls} style={inputStyle} value={form.tag} onChange={(e) => set('tag', e.target.value)}>
                                    {TAGS.map((t) => <option key={t} value={t}>{t || 'None'}</option>)}
                                </select>
                            </Field>
                            <Field label="City">
                                <input className={inputCls} style={inputStyle} value={form.location_city} onChange={(e) => set('location_city', e.target.value)} />
                            </Field>
                            <Field label="State">
                                <input className={inputCls} style={inputStyle} value={form.location_state} onChange={(e) => set('location_state', e.target.value)} />
                            </Field>
                            <Field label="Full Address" full>
                                <input className={inputCls} style={inputStyle} value={form.full_address} onChange={(e) => set('full_address', e.target.value)} />
                            </Field>
                            <Field label="General Timings">
                                <input className={inputCls} style={inputStyle} value={form.timings_general} onChange={(e) => set('timings_general', e.target.value)} placeholder="4:00 AM – 11:00 PM" />
                            </Field>
                            <Field label="Entry Fee">
                                <input className={inputCls} style={inputStyle} value={form.entry_fee} onChange={(e) => set('entry_fee', e.target.value)} placeholder="Free / ₹50" />
                            </Field>
                            <Field label="Morning Aarti">
                                <input className={inputCls} style={inputStyle} value={form.timings_morning_aarti} onChange={(e) => set('timings_morning_aarti', e.target.value)} />
                            </Field>
                            <Field label="Evening Aarti">
                                <input className={inputCls} style={inputStyle} value={form.timings_evening_aarti} onChange={(e) => set('timings_evening_aarti', e.target.value)} />
                            </Field>
                            <Field label="Dress Code">
                                <input className={inputCls} style={inputStyle} value={form.dress_code} onChange={(e) => set('dress_code', e.target.value)} />
                            </Field>
                            <Field label="Best Time to Visit">
                                <input className={inputCls} style={inputStyle} value={form.best_time_visit} onChange={(e) => set('best_time_visit', e.target.value)} />
                            </Field>
                            <Field label="Famous For" full>
                                <textarea rows={2} className={inputCls} style={inputStyle} value={form.famous_for} onChange={(e) => set('famous_for', e.target.value)} />
                            </Field>
                            <Field label="Festivals (comma-separated)" full>
                                <input className={inputCls} style={inputStyle} value={form.festivals} onChange={(e) => set('festivals', e.target.value)} />
                            </Field>
                            <Field label="Contact Phone">
                                <input className={inputCls} style={inputStyle} value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} />
                            </Field>
                            <Field label="Website">
                                <input className={inputCls} style={inputStyle} value={form.website} onChange={(e) => set('website', e.target.value)} />
                            </Field>
                            <Field label="Image URL" full>
                                <input className={inputCls} style={inputStyle} value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://…" />
                            </Field>
                            <Field label="Rating (0–5)">
                                <input type="number" step="0.1" min="0" max="5" className={inputCls} style={inputStyle} value={form.rating} onChange={(e) => set('rating', e.target.value)} />
                            </Field>
                            <Field label="Reviews Count">
                                <input type="number" min="0" className={inputCls} style={inputStyle} value={form.reviews} onChange={(e) => set('reviews', e.target.value)} />
                            </Field>
                        </div>
                    </form>

                    <div className="flex justify-end gap-2 px-6 py-4 border-t border-black/5 bg-[#fdfaf5]">
                        <button type="button" onClick={onClose} className="btn-outline py-2 px-4 text-sm">Cancel</button>
                        <button type="button" onClick={handleSubmit} disabled={saving} className="btn-primary py-2 px-5 text-sm">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEdit ? 'Save Changes' : 'Add Temple')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
