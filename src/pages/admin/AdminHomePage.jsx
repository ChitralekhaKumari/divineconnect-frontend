import { useEffect, useState } from 'react';
import { Loader2, Save, Plus, Trash2, GripVertical, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { adminHomeApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

// ─── Small shared UI bits ──────────────────────────────────────────────
function Card({ title, description, children, footer }) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-black/5">
                <h2 className="text-base font-bold text-[#2d1a0e]">{title}</h2>
                {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
            </div>
            <div className="p-6">{children}</div>
            {footer && <div className="px-6 py-4 bg-[#fdfaf5] border-t border-black/5">{footer}</div>}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:border-[#e07c0a] transition-colors";
const inputStyle = { borderColor: '#e5ddd0' };

export default function AdminHomePage() {
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState(null);
    const [stats, setStats] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        let cancelled = false;
        Promise.all([adminHomeApi.getContent(), adminHomeApi.listStats(), adminHomeApi.listSections()])
            .then(([c, s, sec]) => {
                if (cancelled) return;
                setContent(c.data);
                setStats(s.data);
                setSections(sec.data);
            })
            .catch(() => { if (!cancelled) showToast('Could not load home content.', 'error'); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function updateField(field, value) {
        setContent((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSaveContent() {
        setSaving(true);
        try {
            const { data } = await adminHomeApi.updateContent(content);
            setContent(data);
            showToast('Home content updated — live now.', 'success');
        } catch (err) {
            showToast(err.message || 'Save failed.', 'error');
        } finally {
            setSaving(false);
        }
    }

    // ── Stats CRUD ──
    async function handleAddStat() {
        try {
            const { data } = await adminHomeApi.createStat({ value: 'New', label: 'Stat Label', display_order: stats.length + 1 });
            setStats((prev) => [...prev, data]);
        } catch (err) {
            showToast(err.message || 'Could not add stat.', 'error');
        }
    }

    function updateStatLocal(id, field, value) {
        setStats((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    }

    async function handleSaveStat(stat) {
        try {
            await adminHomeApi.updateStat(stat.id, { value: stat.value, label: stat.label, is_active: stat.is_active });
            showToast('Stat saved.', 'success');
        } catch (err) {
            showToast(err.message || 'Could not save stat.', 'error');
        }
    }

    async function handleDeleteStat(id) {
        try {
            await adminHomeApi.deleteStat(id);
            setStats((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            showToast(err.message || 'Could not delete stat.', 'error');
        }
    }

    async function handleToggleStatActive(stat) {
        const next = !stat.is_active;
        updateStatLocal(stat.id, 'is_active', next);
        try {
            await adminHomeApi.updateStat(stat.id, { is_active: next });
        } catch {
            updateStatLocal(stat.id, 'is_active', !next); // revert on failure
            showToast('Could not update stat visibility.', 'error');
        }
    }

    // ── Sections toggle/reorder ──
    async function handleToggleSection(section) {
        const next = !section.is_active;
        setSections((prev) => prev.map((s) => (s.section_key === section.section_key ? { ...s, is_active: next } : s)));
        try {
            await adminHomeApi.updateSection(section.section_key, { is_active: next });
        } catch {
            setSections((prev) => prev.map((s) => (s.section_key === section.section_key ? { ...s, is_active: !next } : s)));
            showToast('Could not update section visibility.', 'error');
        }
    }

    async function handleMoveSection(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= sections.length) return;

        const reordered = [...sections];
        [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
        setSections(reordered);

        try {
            await adminHomeApi.reorderSections(reordered.map((s) => s.section_key));
        } catch {
            showToast('Could not save new order.', 'error');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading Home content…
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
                    Home Page
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Edit copy, hero image, stats and section order. Changes go live immediately — no deploy needed.
                </p>
            </div>

            {/* ── Hero ── */}
            <Card
                title="Hero Banner"
                description="The first thing visitors see."
                footer={
                    <button onClick={handleSaveContent} disabled={saving} className="btn-primary py-2 px-5 text-sm">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Hero & Astrology CTA</>}
                    </button>
                }
            >
                <div className="grid sm:grid-cols-2 gap-x-4">
                    <Field label="Title (line 1)">
                        <input className={inputCls} style={inputStyle} value={content.hero_title}
                            onChange={(e) => updateField('hero_title', e.target.value)} />
                    </Field>
                    <Field label="Title Highlight (line 2, accent color)">
                        <input className={inputCls} style={inputStyle} value={content.hero_title_highlight}
                            onChange={(e) => updateField('hero_title_highlight', e.target.value)} />
                    </Field>
                </div>
                <Field label="Description">
                    <textarea rows={3} className={inputCls} style={inputStyle} value={content.hero_description}
                        onChange={(e) => updateField('hero_description', e.target.value)} />
                </Field>
                <Field label="Background Image URL">
                    <input className={inputCls} style={inputStyle} value={content.hero_image_url}
                        onChange={(e) => updateField('hero_image_url', e.target.value)} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-x-4">
                    <Field label="Button Text">
                        <input className={inputCls} style={inputStyle} value={content.hero_cta_text}
                            onChange={(e) => updateField('hero_cta_text', e.target.value)} />
                    </Field>
                    <Field label="Button Link">
                        <input className={inputCls} style={inputStyle} value={content.hero_cta_link}
                            onChange={(e) => updateField('hero_cta_link', e.target.value)} />
                    </Field>
                </div>
            </Card>

            {/* ── Stats ── */}
            <Card
                title="Hero Stats"
                description="The four stat pills under the hero (e.g. '500+ Sacred Rituals')."
            >
                <div className="space-y-2">
                    {stats.map((stat) => (
                        <div key={stat.id} className="flex items-center gap-2 p-2.5 rounded-xl border" style={{ borderColor: '#e5ddd0' }}>
                            <input
                                className="w-20 px-2.5 py-1.5 rounded-lg text-sm border outline-none focus:border-[#e07c0a]"
                                style={inputStyle}
                                value={stat.value}
                                onChange={(e) => updateStatLocal(stat.id, 'value', e.target.value)}
                                onBlur={() => handleSaveStat(stat)}
                                placeholder="500+"
                            />
                            <input
                                className="flex-1 px-2.5 py-1.5 rounded-lg text-sm border outline-none focus:border-[#e07c0a]"
                                style={inputStyle}
                                value={stat.label}
                                onChange={(e) => updateStatLocal(stat.id, 'label', e.target.value)}
                                onBlur={() => handleSaveStat(stat)}
                                placeholder="Sacred Rituals"
                            />
                            <button onClick={() => handleToggleStatActive(stat)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                                title={stat.is_active ? 'Hide' : 'Show'}>
                                {stat.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-300" />}
                            </button>
                            <button onClick={() => handleDeleteStat(stat.id)}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddStat}
                    className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#e07c0a] hover:text-[#c46206]">
                    <Plus className="w-4 h-4" /> Add Stat
                </button>
            </Card>

            {/* ── Astrology CTA ── */}
            <Card
                title="Astrology CTA Section"
                description="The banner promoting the Astrology page, shown near the bottom of Home."
                footer={
                    <button onClick={handleSaveContent} disabled={saving} className="btn-primary py-2 px-5 text-sm">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Hero & Astrology CTA</>}
                    </button>
                }
            >
                <Field label="Eyebrow Label">
                    <input className={inputCls} style={inputStyle} value={content.astrology_label}
                        onChange={(e) => updateField('astrology_label', e.target.value)} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-x-4">
                    <Field label="Title">
                        <input className={inputCls} style={inputStyle} value={content.astrology_title}
                            onChange={(e) => updateField('astrology_title', e.target.value)} />
                    </Field>
                    <Field label="Title Highlight">
                        <input className={inputCls} style={inputStyle} value={content.astrology_title_highlight}
                            onChange={(e) => updateField('astrology_title_highlight', e.target.value)} />
                    </Field>
                </div>
                <Field label="Description">
                    <textarea rows={3} className={inputCls} style={inputStyle} value={content.astrology_description}
                        onChange={(e) => updateField('astrology_description', e.target.value)} />
                </Field>
                <Field label="Background Image URL">
                    <input className={inputCls} style={inputStyle} value={content.astrology_image_url}
                        onChange={(e) => updateField('astrology_image_url', e.target.value)} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-x-4">
                    <Field label="Button Text">
                        <input className={inputCls} style={inputStyle} value={content.astrology_cta_text}
                            onChange={(e) => updateField('astrology_cta_text', e.target.value)} />
                    </Field>
                    <Field label="Button Link">
                        <input className={inputCls} style={inputStyle} value={content.astrology_cta_link}
                            onChange={(e) => updateField('astrology_cta_link', e.target.value)} />
                    </Field>
                </div>
            </Card>

            {/* ── Section order/visibility ── */}
            <Card
                title="Page Sections"
                description="Toggle a section off to hide it from the live site instantly, or reorder how they stack on the page."
            >
                <div className="space-y-2">
                    {sections.map((section, i) => (
                        <div key={section.section_key}
                            className="flex items-center gap-3 p-3 rounded-xl border"
                            style={{ borderColor: '#e5ddd0', opacity: section.is_active ? 1 : 0.5 }}>
                            <GripVertical className="w-4 h-4 text-gray-300" />
                            <span className="flex-1 text-sm font-medium text-[#2d1a0e]">{section.label}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleMoveSection(i, -1)} disabled={i === 0}
                                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30">
                                    <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleMoveSection(i, 1)} disabled={i === sections.length - 1}
                                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30">
                                    <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <button onClick={() => handleToggleSection(section)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${section.is_active ? 'text-green-700' : 'text-gray-500'}`}
                                style={{ background: section.is_active ? '#ecfdf5' : '#f3f4f6' }}>
                                {section.is_active ? 'Visible' : 'Hidden'}
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
