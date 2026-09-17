import { Loader2, GitCommitHorizontal, ExternalLink, CircleAlert } from 'lucide-react';

export default function ConfirmDeployModal({ title, description, danger, loading, result, error, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="w-full max-w-sm rounded-2xl bg-white p-6" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>

                {!result && !error && (
                    <>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                            style={{ background: danger ? '#fef2f2' : '#fff8f0' }}>
                            <GitCommitHorizontal className="w-5 h-5" style={{ color: danger ? '#dc2626' : '#e07c0a' }} />
                        </div>
                        <h3 className="text-base font-bold text-[#2d1a0e] mb-1.5">{title}</h3>
                        <p className="text-sm text-gray-500 mb-5">{description}</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={onClose} disabled={loading} className="btn-outline py-2 px-4 text-sm">Cancel</button>
                            <button onClick={onConfirm} disabled={loading}
                                className="py-2 px-4 rounded-full text-sm font-semibold text-white flex items-center gap-1.5"
                                style={{ background: danger ? '#dc2626' : '#e07c0a' }}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Deploy'}
                            </button>
                        </div>
                    </>
                )}

                {result && (
                    <>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#ecfdf5' }}>
                            <GitCommitHorizontal className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-base font-bold text-[#2d1a0e] mb-1.5">Pushed to GitHub</h3>
                        <p className="text-sm text-gray-500 mb-4">{result.message}</p>
                        {result.commitUrl && (
                            <a href={result.commitUrl} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-[#e07c0a] mb-4">
                                View commit <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                        <div className="flex justify-end">
                            <button onClick={onClose} className="btn-primary py-2 px-4 text-sm">Done</button>
                        </div>
                    </>
                )}

                {error && (
                    <>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#fef2f2' }}>
                            <CircleAlert className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-base font-bold text-[#2d1a0e] mb-1.5">Couldn't publish</h3>
                        <p className="text-sm text-gray-500 mb-5">{error}</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={onClose} className="btn-outline py-2 px-4 text-sm">Close</button>
                            <button onClick={onConfirm} className="btn-primary py-2 px-4 text-sm">Try Again</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
