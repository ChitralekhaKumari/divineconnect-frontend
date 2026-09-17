import { useState } from 'react';
import { X } from 'lucide-react';

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:border-[#e07c0a] transition-colors";
const inputStyle = { borderColor: '#e5ddd0' };
const disabledStyle = { borderColor: '#e5ddd0', background: '#f5f0e8', color: '#8a6a4a' };

function Field({ label, children, full }) {
    return (
        <div className={`mb-4 ${full ? 'sm:col-span-2' : ''}`}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

const FREQUENCIES = ['Daily', 'Evening', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday', 'Healing'];

function toFormState(prayer) {
    return {
        title: prayer?.title || '',
        deity: prayer?.deity || '',
        frequency: prayer?.frequency || 'Daily',
        slug: prayer?.slug || '',
        image: prayer?.image || '',
        sanskrit: prayer?.sanskrit || '',
        transliteration: prayer?.transliteration || '',
        meaning: prayer?.meaning || '',
        benefits: prayer?.benefits || '',
    };
}

// onRequestDeploy(payload) — called once the form is valid; the parent page
// owns the actual "want to deploy?" confirmation and the GitHub commit call.
export default function PrayerFormModal({ prayer, onClose, onRequestDeploy }) {
    const [form, setForm] = useState(() => toFormState(prayer));
    const [error, setError] = useState('');
    const isEdit = !!prayer;

    function set(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim() || !form.deity.trim()) {
            setError('Title and deity are required.');
            return;
        }
        onRequestDeploy(form);
    }

    return (
        <div className="fixed inset-0 z-[150] overflow-y-auto" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="flex min-h-full items-start justify-center p-4 py-10">
                <div className="w-full max-w-2xl rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                        <h2 className="text-lg font-bold text-[#2d1a0e]">{isEdit ? 'Edit Prayer' : 'Add Prayer'}</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100"><X className="w-4 h-4" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                        {error && (
                            <div className="mb-4 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                                {error}
                            </div>
                        )}
                        <div className="mb-4 px-3 py-2 rounded-lg text-xs" style={{ background: '#fff8f0', color: '#8a6a4a', border: '1px solid #fcd9a0' }}>
                            Saving this commits directly to your GitHub repo, which triggers a live Vercel deploy — you'll confirm before it happens.
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-4">
                            <Field label="Title *">
                                <input className={inputCls} style={inputStyle} value={form.title} onChange={(e) => set('title', e.target.value)} required />
                            </Field>
                            <Field label="Deity *">
                                <input className={inputCls} style={inputStyle} value={form.deity} onChange={(e) => set('deity', e.target.value)} placeholder="Shiva, Vishnu, Ganesha…" required />
                            </Field>
                            <Field label="Frequency / Day">
                                <select className={inputCls} style={inputStyle} value={form.frequency} onChange={(e) => set('frequency', e.target.value)}>
                                    {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </Field>
                            <Field label="Slug (used as the filename)">
                                <input
                                    className={inputCls}
                                    style={isEdit ? disabledStyle : inputStyle}
                                    value={form.slug}
                                    disabled={isEdit}
                                    onChange={(e) => set('slug', e.target.value)}
                                    placeholder="auto-generated from title if left blank"
                                />
                            </Field>
                        </div>

                        <Field label="Image URL" full>
                            <input className={inputCls} style={inputStyle} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://…" />
                        </Field>

                        <Field label="Sanskrit" full>
                            <textarea rows={4} className={inputCls} style={inputStyle} value={form.sanskrit} onChange={(e) => set('sanskrit', e.target.value)} />
                        </Field>
                        <Field label="Transliteration" full>
                            <textarea rows={4} className={inputCls} style={inputStyle} value={form.transliteration} onChange={(e) => set('transliteration', e.target.value)} />
                        </Field>
                        <Field label="Meaning" full>
                            <textarea rows={3} className={inputCls} style={inputStyle} value={form.meaning} onChange={(e) => set('meaning', e.target.value)} />
                        </Field>
                        <Field label="Benefits" full>
                            <textarea rows={3} className={inputCls} style={inputStyle} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} />
                        </Field>
                    </form>

                    <div className="flex justify-end gap-2 px-6 py-4 border-t border-black/5 bg-[#fdfaf5]">
                        <button type="button" onClick={onClose} className="btn-outline py-2 px-4 text-sm">Cancel</button>
                        <button type="button" onClick={handleSubmit} className="btn-primary py-2 px-5 text-sm">
                            {isEdit ? 'Save Changes' : 'Add Prayer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
