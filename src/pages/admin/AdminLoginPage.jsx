import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
    const { user, isLoggedIn, ready, saveSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Already logged in as admin — skip straight past the login form
    if (ready && isLoggedIn && user?.role === 'admin') {
        const dest = location.state?.from || '/admin/home';
        return <Navigate to={dest} replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authApi.login({ email, password });
            if (res.user?.role !== 'admin') {
                setError('This account does not have admin access.');
                setLoading(false);
                return;
            }
            saveSession(res.token, res.user);
            navigate('/admin/home', { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#1a1108' }}>
            <div className="w-full max-w-sm rounded-3xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #e07c0a, #f9bb5c, #e07c0a)' }} />
                <div className="px-8 py-8">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: '#fff8f0', border: '1px solid #fcd9a0' }}>
                            <ShieldCheck className="w-6 h-6" style={{ color: '#e07c0a' }} />
                        </div>
                        <h1 className="text-2xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
                            Admin Login
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">DivineConnect Control Panel</p>
                    </div>

                    {error && (
                        <div className="mb-4 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none focus:border-[#e07c0a] transition-colors"
                                style={{ borderColor: '#e5ddd0' }}
                                placeholder="admin@divineconnect.com"
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm border outline-none focus:border-[#e07c0a] transition-colors"
                                    style={{ borderColor: '#e5ddd0' }}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
