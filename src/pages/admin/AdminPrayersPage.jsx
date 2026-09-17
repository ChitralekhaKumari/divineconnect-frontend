import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Search, Pencil, Trash2, TriangleAlert } from 'lucide-react';
import { adminPrayersApi } from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import PrayerFormModal from '../../components/admin/PrayerFormModal';
import ConfirmDeployModal from '../../components/admin/ConfirmDeployModal';

export default function AdminPrayersPage() {
    const { showToast } = useToast();

    const [prayers, setPrayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [githubConfigured, setGithubConfigured] = useState(true);

    const [modalPrayer, setModalPrayer] = useState(undefined); // undefined = closed, null = new, object = edit
    const [pendingSave, setPendingSave] = useState(null);      // form payload awaiting deploy confirmation
    const [pendingDelete, setPendingDelete] = useState(null);  // prayer awaiting delete confirmation
    const [deployState, setDeployState] = useState(null);      // { loading, result, error }

    const load = useCallback(() => {
        setLoading(true);
        adminPrayersApi.list({ search })
            .then((res) => {
                setPrayers(res.data);
                setGithubConfigured(res.githubConfigured !== false);
            })
            .catch((err) => showToast(err.message || 'Could not load prayers.', 'error'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => { load(); }, [load]);

    // ── Save flow: form -> confirm deploy -> commit ──
    function handleRequestDeploy(formPayload) {
        setPendingSave(formPayload);
        setDeployState({ loading: false, result: null, error: null });
    }

    async function confirmSaveDeploy() {
        setDeployState({ loading: true, result: null, error: null });
        try {
            const res = modalPrayer
                ? await adminPrayersApi.update(modalPrayer.slug, pendingSave)
                : await adminPrayersApi.create(pendingSave);
            setDeployState({ loading: false, result: res, error: null });
        } catch (err) {
            setDeployState({ loading: false, result: null, error: err.message || 'Could not publish.' });
        }
    }

    function closeSaveFlow() {
        const wasSuccess = !!deployState?.result;
        setPendingSave(null);
        setDeployState(null);
        setModalPrayer(undefined);
        if (wasSuccess) load();
    }

    // ── Delete flow: confirm -> commit removal ──
    async function confirmDelete() {
        setDeployState({ loading: true, result: null, error: null });
        try {
            const res = await adminPrayersApi.remove(pendingDelete.slug);
            setDeployState({ loading: false, result: res, error: null });
        } catch (err) {
            setDeployState({ loading: false, result: null, error: err.message || 'Could not remove.' });
        }
    }

    function closeDeleteFlow() {
        const wasSuccess = !!deployState?.result;
        setPendingDelete(null);
        setDeployState(null);
        if (wasSuccess) load();
    }

    async function handleOpenEdit(prayer) {
        try {
            const { data } = await adminPrayersApi.get(prayer.slug);
            setModalPrayer(data);
        } catch (err) {
            showToast(err.message || 'Could not load prayer details.', 'error');
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>Prayers</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Managed as .md files in your repo. Every change here is a real GitHub commit that redeploys the site.
                    </p>
                </div>
                <button onClick={() => setModalPrayer(null)} className="btn-primary py-2.5 px-5 text-sm">
                    <Plus className="w-4 h-4" /> Add Prayer
                </button>
            </div>

            {!githubConfigured && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-4 text-sm" style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
                    <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                        <strong>GitHub publishing isn't configured yet.</strong> Set <code>GITHUB_TOKEN</code>, <code>GITHUB_OWNER</code> and <code>GITHUB_REPO</code> in the backend environment before edits here can go live.
                    </div>
                </div>
            )}

            <div className="relative mb-4 max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title or deity…"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm border outline-none focus:border-[#e07c0a]"
                    style={{ borderColor: '#e5ddd0' }}
                />
            </div>

            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading prayers…
                    </div>
                ) : prayers.length === 0 ? (
                    <div className="text-center py-16 text-sm text-gray-400">No prayers found.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-black/5">
                                <th className="px-5 py-3 font-semibold">Title</th>
                                <th className="px-5 py-3 font-semibold">Deity</th>
                                <th className="px-5 py-3 font-semibold">Frequency</th>
                                <th className="px-5 py-3 font-semibold">Slug (file)</th>
                                <th className="px-5 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prayers.map((p) => (
                                <tr key={p.slug} className="border-b border-black/5 last:border-0">
                                    <td className="px-5 py-3 font-semibold text-[#2d1a0e]">{p.title}</td>
                                    <td className="px-5 py-3 text-gray-600">{p.deity}</td>
                                    <td className="px-5 py-3 text-gray-600">{p.frequency}</td>
                                    <td className="px-5 py-3 text-gray-400 text-xs font-mono">{p.slug}.md</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleOpenEdit(p)} title="Edit"
                                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => { setPendingDelete(p); setDeployState({ loading: false, result: null, error: null }); }} title="Delete permanently"
                                                className="p-2 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit form */}
            {modalPrayer !== undefined && !pendingSave && (
                <PrayerFormModal
                    prayer={modalPrayer}
                    onClose={() => setModalPrayer(undefined)}
                    onRequestDeploy={handleRequestDeploy}
                />
            )}

            {/* Deploy confirmation for save */}
            {pendingSave && (
                <ConfirmDeployModal
                    title={modalPrayer ? `Deploy changes to "${pendingSave.title}"?` : `Publish new prayer "${pendingSave.title}"?`}
                    description="This commits the .md file directly to your GitHub repo. Vercel will pick up the push and redeploy the live site automatically."
                    loading={deployState?.loading}
                    result={deployState?.result}
                    error={deployState?.error}
                    onConfirm={confirmSaveDeploy}
                    onClose={closeSaveFlow}
                />
            )}

            {/* Delete confirmation — one step, goes straight to the deploy gate */}
            {pendingDelete && (
                <ConfirmDeployModal
                    title={`Delete "${pendingDelete.title}"?`}
                    description={`This removes ${pendingDelete.slug}.md via a GitHub commit, which redeploys the live site automatically. It's recoverable from GitHub's history, but won't undo itself here.`}
                    danger
                    loading={deployState?.loading}
                    result={deployState?.result}
                    error={deployState?.error}
                    onConfirm={confirmDelete}
                    onClose={closeDeleteFlow}
                />
            )}
        </div>
    );
}
