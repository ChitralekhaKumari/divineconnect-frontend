import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Search, Pencil, EyeOff, Eye, Trash2, Star } from 'lucide-react';
import { adminTemplesApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import TempleFormModal from '../../components/admin/TempleFormModal';

const STATUS_TABS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Hidden' },
];

export default function AdminTemplesPage() {
    const { showToast } = useToast();

    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [modalTemple, setModalTemple] = useState(undefined); // undefined = closed, null = new, object = edit
    const [confirmDelete, setConfirmDelete] = useState(null);

    const load = useCallback(() => {
        setLoading(true);
        adminTemplesApi.list({ search, status, page, limit: 12 })
            .then((res) => {
                setTemples(res.data);
                setPagination(res.pagination);
            })
            .catch((err) => showToast(err.message || 'Could not load temples.', 'error'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, status, page]);

    useEffect(() => { load(); }, [load]);

    async function handleToggleActive(temple) {
        const next = !temple.is_active;
        setTemples((prev) => prev.map((t) => (t.id === temple.id ? { ...t, is_active: next } : t)));
        try {
            await adminTemplesApi.setActive(temple.id, next);
            showToast(next ? 'Temple restored to the live site.' : 'Temple hidden from the live site.', 'success');
        } catch (err) {
            setTemples((prev) => prev.map((t) => (t.id === temple.id ? { ...t, is_active: !next } : t)));
            showToast(err.message || 'Could not update status.', 'error');
        }
    }

    async function handleDelete(temple) {
        try {
            await adminTemplesApi.remove(temple.id);
            setTemples((prev) => prev.filter((t) => t.id !== temple.id));
            setConfirmDelete(null);
            showToast('Temple permanently deleted.', 'success');
        } catch (err) {
            showToast(err.message || 'Could not delete temple.', 'error');
        }
    }

    async function handleOpenEdit(temple) {
        try {
            const { data } = await adminTemplesApi.get(temple.id);
            setModalTemple(data);
        } catch (err) {
            showToast(err.message || 'Could not load temple details.', 'error');
        }
    }

    async function handleSave(payload) {
        if (modalTemple) {
            const { data } = await adminTemplesApi.update(modalTemple.id, payload);
            setTemples((prev) => prev.map((t) => (t.id === data.id ? { ...t, ...data } : t)));
            showToast('Temple updated.', 'success');
        } else {
            await adminTemplesApi.create(payload);
            showToast('Temple added.', 'success');
            load();
        }
        setModalTemple(undefined);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>Temples</h1>
                    <p className="text-sm text-gray-500 mt-1">Add, edit, hide or remove temples shown across the site.</p>
                </div>
                <button onClick={() => setModalTemple(null)} className="btn-primary py-2.5 px-5 text-sm">
                    <Plus className="w-4 h-4" /> Add Temple
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name, deity, city…"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm border outline-none focus:border-[#e07c0a]"
                        style={{ borderColor: '#e5ddd0' }}
                    />
                </div>
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f5f0e8' }}>
                    {STATUS_TABS.map((t) => (
                        <button key={t.key} onClick={() => { setStatus(t.key); setPage(1); }}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            style={status === t.key ? { background: '#fff', color: '#2d1a0e' } : { color: '#8a6a4a' }}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading temples…
                    </div>
                ) : temples.length === 0 ? (
                    <div className="text-center py-16 text-sm text-gray-400">No temples found.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-black/5">
                                <th className="px-5 py-3 font-semibold">Temple</th>
                                <th className="px-5 py-3 font-semibold">Location</th>
                                <th className="px-5 py-3 font-semibold">Tag</th>
                                <th className="px-5 py-3 font-semibold">Rating</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {temples.map((t) => (
                                <tr key={t.id} className="border-b border-black/5 last:border-0" style={{ opacity: t.is_active ? 1 : 0.55 }}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={t.image_url || '/src/assets/images/temple-kashi.jpg'} alt=""
                                                className="w-10 h-10 rounded-lg object-cover" />
                                            <div>
                                                <div className="font-semibold text-[#2d1a0e]">{t.name}</div>
                                                <div className="text-xs text-gray-400">{t.deity}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-600">{[t.location_city, t.location_state].filter(Boolean).join(', ')}</td>
                                    <td className="px-5 py-3">
                                        {t.tag && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#fff8f0] text-[#c9882a] border border-[#fcd9a0]">{t.tag}</span>}
                                    </td>
                                    <td className="px-5 py-3">
                                        {t.rating ? (
                                            <span className="flex items-center gap-1 text-gray-700">
                                                <Star className="w-3.5 h-3.5 text-[#f59b24] fill-[#f59b24]" /> {t.rating}
                                            </span>
                                        ) : '–'}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${t.is_active ? 'text-green-700' : 'text-gray-500'}`}
                                            style={{ background: t.is_active ? '#ecfdf5' : '#f3f4f6' }}>
                                            {t.is_active ? 'LIVE' : 'HIDDEN'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleOpenEdit(t)} title="Edit"
                                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleToggleActive(t)} title={t.is_active ? 'Hide from site' : 'Restore to site'}
                                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                                                {t.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => setConfirmDelete(t)} title="Delete permanently"
                                                className="p-2 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                        className="btn-outline py-1.5 px-3 text-xs disabled:opacity-30">Previous</button>
                    <span className="text-xs text-gray-500">Page {page} of {pagination.totalPages}</span>
                    <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}
                        className="btn-outline py-1.5 px-3 text-xs disabled:opacity-30">Next</button>
                </div>
            )}

            {/* Create/Edit modal */}
            {modalTemple !== undefined && (
                <TempleFormModal
                    temple={modalTemple}
                    onClose={() => setModalTemple(undefined)}
                    onSave={handleSave}
                />
            )}

            {/* Delete confirmation */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
                        <h3 className="text-base font-bold text-[#2d1a0e] mb-1.5">Delete "{confirmDelete.name}"?</h3>
                        <p className="text-sm text-gray-500 mb-5">
                            This permanently removes the temple and can't be undone. If you just want to hide it from the site, use the eye icon instead.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setConfirmDelete(null)} className="btn-outline py-2 px-4 text-sm">Cancel</button>
                            <button onClick={() => handleDelete(confirmDelete)}
                                className="py-2 px-4 rounded-full text-sm font-semibold text-white" style={{ background: '#dc2626' }}>
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
