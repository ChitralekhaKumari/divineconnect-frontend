import { useState, useRef, useEffect } from 'react';
import { X, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/authApi';
import { useAuth } from '../context/AuthContext';

// ─── Screen names ─────────────────────────────────────────────────────────────
// 'login' | 'signup' | 'verify_email' | 'forgot' | 'otp_reset' | 'reset_pw'

export default function AuthModal({ onClose, defaultScreen = 'login', redirectMessage }) {
    const { saveSession } = useAuth();
    const [screen, setScreen] = useState(defaultScreen);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);

    // Shared state carried across screens
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');

    function go(s) { setScreen(s); setError(''); setSuccess(''); }

    // Close on backdrop click
    function onBackdrop(e) { if (e.target === e.currentTarget) onClose(); }

    return (
        <div
            onClick={onBackdrop}
            className="fixed inset-0 z-[100] overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-md rounded-3xl overflow-hidden"
                    style={{ background: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}
                >
                    {/* Saffron top bar */}
                    <div className="h-1.5 w-full"
                        style={{ background: 'linear-gradient(90deg, #e07c0a, #f9bb5c, #e07c0a)' }} />

                    <div className="px-8 py-7">
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-all"
                            style={{ background: '#f5f0e8', color: '#6b5b4d' }}
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="text-3xl mb-1">🕉️</div>
                            <h2 className="text-2xl font-bold text-[#2d1a0e]" style={{ fontFamily: 'var(--font-display)' }}>
                                DivineConnect
                            </h2>
                            {redirectMessage && (
                                <p className="text-xs text-[#e07c0a] mt-1 font-medium">{redirectMessage}</p>
                            )}
                        </div>

                        {/* Error / Success banners */}
                        {error && <Banner type="error" msg={error} />}
                        {success && <Banner type="success" msg={success} />}

                        {/* Screens */}
                        {screen === 'login' && <LoginScreen go={go} setEmail={setEmail} saveSession={saveSession} onClose={onClose} loading={loading} setLoading={setLoading} setError={setError} setSuccess={setSuccess} showPw={showPw} setShowPw={setShowPw} />}
                        {screen === 'signup' && <SignupScreen go={go} setEmail={setEmail} loading={loading} setLoading={setLoading} setError={setError} setSuccess={setSuccess} showPw={showPw} setShowPw={setShowPw} showPw2={showPw2} setShowPw2={setShowPw2} />}
                        {screen === 'verify_email' && <VerifyEmailScreen go={go} email={email} loading={loading} setLoading={setLoading} setError={setError} setSuccess={setSuccess} />}
                        {screen === 'forgot' && <ForgotScreen go={go} email={email} setEmail={setEmail} loading={loading} setLoading={setLoading} setError={setError} setSuccess={setSuccess} />}
                        {screen === 'otp_reset' && <OtpResetScreen go={go} email={email} setResetToken={setResetToken} loading={loading} setLoading={setLoading} setError={setError} setSuccess={setSuccess} />}
                        {screen === 'reset_pw' && <ResetPwScreen go={go} resetToken={resetToken} loading={loading} setLoading={setLoading} setError={setError} setSuccess={setSuccess} onClose={onClose} showPw={showPw} setShowPw={setShowPw} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Reusable banner ──────────────────────────────────────────────────────────
function Banner({ type, msg }) {
    const isErr = type === 'error';
    return (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
            style={{
                background: isErr ? '#fff1f1' : '#f0fdf4',
                color: isErr ? '#b91c1c' : '#15803d',
                border: `1px solid ${isErr ? '#fca5a5' : '#86efac'}`,
            }}>
            {!isErr && <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />}
            <span>{msg}</span>
        </div>
    );
}

// ─── Shared input ─────────────────────────────────────────────────────────────
function Input({ label, type = 'text', value, onChange, placeholder, right }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold text-[#5c4a3a] mb-1.5">{label}</label>
            <div className="relative">
                <input
                    type={type} value={value} onChange={onChange} placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                        border: '1.5px solid #e8d5b0',
                        background: '#fdfaf5',
                        color: '#2d1a0e',
                    }}
                    onFocus={e => e.target.style.borderColor = '#e07c0a'}
                    onBlur={e => e.target.style.borderColor = '#e8d5b0'}
                />
                {right && (
                    <button type="button" onClick={right.onClick}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {right.icon}
                    </button>
                )}
            </div>
        </div>
    );
}

function SubmitBtn({ children, loading }) {
    return (
        <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all mt-1"
            style={{ background: loading ? '#c9882a' : '#e07c0a', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Please wait…</span> : children}
        </button>
    );
}

function Divider() {
    return (
        <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: '#edd9b3' }} />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px" style={{ background: '#edd9b3' }} />
        </div>
    );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ go, setEmail, saveSession, onClose, loading, setLoading, setError, setSuccess, showPw, setShowPw }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    async function submit(e) {
        e.preventDefault();
        setError(''); setSuccess('');
        setLoading(true);
        try {
            const data = await authApi.login({ email: form.email, password: form.password });
            saveSession(data.token, data.user);
            setSuccess('Welcome back! 🙏');
            setTimeout(() => onClose(), 800);
        } catch (err) {
            if (err.code === 'EMAIL_NOT_VERIFIED') {
                setEmail(err.email || form.email);
                setError('Please verify your email first. We\'ll send you a new OTP.');
                setTimeout(() => go('verify_email'), 1500);
            } else {
                setError(err.message);
            }
        } finally { setLoading(false); }
    }

    return (
        <form onSubmit={submit}>
            <p className="text-center text-sm text-gray-500 mb-5">Sign in to your sacred account</p>
            <Input label="Email" type="email" value={form.email} onChange={f('email')} placeholder="you@example.com" />
            <Input label="Password" type={showPw ? 'text' : 'password'} value={form.password} onChange={f('password')} placeholder="••••••••"
                right={{ onClick: () => setShowPw(v => !v), icon: showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" /> }} />
            <div className="flex justify-end mb-4">
                <button type="button" onClick={() => { setEmail(form.email); go('forgot'); }}
                    className="text-xs font-semibold" style={{ color: '#e07c0a' }}>
                    Forgot Password?
                </button>
            </div>
            <SubmitBtn loading={loading}>Sign In 🙏</SubmitBtn>
            <Divider />
            <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => go('signup')} className="font-bold" style={{ color: '#e07c0a' }}>
                    Sign Up
                </button>
            </p>
        </form>
    );
}

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
function SignupScreen({ go, setEmail, loading, setLoading, setError, setSuccess, showPw, setShowPw, showPw2, setShowPw2 }) {
    const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
    const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    async function submit(e) {
        e.preventDefault();
        setError(''); setSuccess('');
        if (form.password !== form.confirm) return setError('Passwords do not match.');
        setLoading(true);
        try {
            const data = await authApi.register({ full_name: form.full_name, email: form.email, password: form.password });
            setEmail(form.email);
            if (data.devOtp) {
                setSuccess(`Dev mode: Your OTP is ${data.devOtp} (SMTP not configured yet)`);
            } else {
                setSuccess('Account created! Check your email for the OTP.');
            }
            setTimeout(() => go('verify_email'), 1500);
        } catch (err) {
            setError(err.message);
        } finally { setLoading(false); }
    }

    return (
        <form onSubmit={submit}>
            <p className="text-center text-sm text-gray-500 mb-5">Create your sacred account</p>
            <Input label="Full Name" value={form.full_name} onChange={f('full_name')} placeholder="Your full name" />
            <Input label="Email" type="email" value={form.email} onChange={f('email')} placeholder="you@example.com" />
            <Input label="Password" type={showPw ? 'text' : 'password'} value={form.password} onChange={f('password')} placeholder="Min. 6 characters"
                right={{ onClick: () => setShowPw(v => !v), icon: showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" /> }} />
            <Input label="Confirm Password" type={showPw2 ? 'text' : 'password'} value={form.confirm} onChange={f('confirm')} placeholder="Repeat password"
                right={{ onClick: () => setShowPw2(v => !v), icon: showPw2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" /> }} />
            <SubmitBtn loading={loading}>Create Account 🙏</SubmitBtn>
            <Divider />
            <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => go('login')} className="font-bold" style={{ color: '#e07c0a' }}>
                    Sign In
                </button>
            </p>
        </form>
    );
}

// ─── VERIFY EMAIL (OTP) ───────────────────────────────────────────────────────
function VerifyEmailScreen({ go, email, loading, setLoading, setError, setSuccess }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const refs = Array.from({ length: 6 }, () => useRef(null));

    function handleChange(i, val) {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp]; next[i] = val; setOtp(next);
        if (val && i < 5) refs[i + 1].current?.focus();
    }
    function handleKey(i, e) {
        if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
    }
    function handlePaste(e) {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) { setOtp(paste.split('')); refs[5].current?.focus(); }
        e.preventDefault();
    }

    async function submit(e) {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return setError('Please enter the 6-digit OTP.');
        setError(''); setSuccess(''); setLoading(true);
        try {
            await authApi.verifyEmail({ email, otp: code });
            setSuccess('Email verified! You can now sign in. 🙏');
            setTimeout(() => go('login'), 1200);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function resend() {
        setError(''); setSuccess(''); setLoading(true);
        try {
            await authApi.resendOtp({ email, type: 'email_verify' });
            setSuccess('New OTP sent to your email!');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    return (
        <form onSubmit={submit}>
            <p className="text-center text-sm text-gray-500 mb-1">Enter the 6-digit OTP sent to</p>
            <p className="text-center font-semibold text-[#e07c0a] text-sm mb-5">{email}</p>
            <OtpBoxes otp={otp} refs={refs} handleChange={handleChange} handleKey={handleKey} handlePaste={handlePaste} />
            <SubmitBtn loading={loading}>Verify Email</SubmitBtn>
            <p className="text-center text-xs text-gray-400 mt-4">
                Didn't receive it?{' '}
                <button type="button" onClick={resend} className="font-semibold" style={{ color: '#e07c0a' }}>Resend OTP</button>
            </p>
            <p className="text-center mt-3">
                <button type="button" onClick={() => go('login')} className="text-xs text-gray-400 flex items-center gap-1 mx-auto">
                    <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </button>
            </p>
        </form>
    );
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
function ForgotScreen({ go, email, setEmail, loading, setLoading, setError, setSuccess }) {
    async function submit(e) {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        try {
            await authApi.forgotPassword({ email });
            setSuccess('OTP sent! Check your email.');
            setTimeout(() => go('otp_reset'), 1000);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    return (
        <form onSubmit={submit}>
            <p className="text-center text-sm text-gray-500 mb-5">Enter your email to receive a reset OTP</p>
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            <SubmitBtn loading={loading}>Send OTP</SubmitBtn>
            <p className="text-center mt-4">
                <button type="button" onClick={() => go('login')} className="text-xs text-gray-400 flex items-center gap-1 mx-auto">
                    <ArrowLeft className="w-3 h-3" /> Back to Sign In
                </button>
            </p>
        </form>
    );
}

// ─── OTP VERIFY (reset) ───────────────────────────────────────────────────────
function OtpResetScreen({ go, email, setResetToken, loading, setLoading, setError, setSuccess }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const refs = Array.from({ length: 6 }, () => useRef(null));

    function handleChange(i, val) {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp]; next[i] = val; setOtp(next);
        if (val && i < 5) refs[i + 1].current?.focus();
    }
    function handleKey(i, e) {
        if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
    }
    function handlePaste(e) {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) { setOtp(paste.split('')); refs[5].current?.focus(); }
        e.preventDefault();
    }

    async function submit(e) {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return setError('Please enter the 6-digit OTP.');
        setError(''); setSuccess(''); setLoading(true);
        try {
            const data = await authApi.verifyResetOtp({ email, otp: code });
            setResetToken(data.resetToken);
            setSuccess('OTP verified!');
            setTimeout(() => go('reset_pw'), 700);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    async function resend() {
        setError(''); setSuccess(''); setLoading(true);
        try {
            await authApi.resendOtp({ email, type: 'forgot_password' });
            setSuccess('New OTP sent!');
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    return (
        <form onSubmit={submit}>
            <p className="text-center text-sm text-gray-500 mb-1">Enter the OTP sent to</p>
            <p className="text-center font-semibold text-[#e07c0a] text-sm mb-5">{email}</p>
            <OtpBoxes otp={otp} refs={refs} handleChange={handleChange} handleKey={handleKey} handlePaste={handlePaste} />
            <SubmitBtn loading={loading}>Verify OTP</SubmitBtn>
            <p className="text-center text-xs text-gray-400 mt-4">
                Didn't receive it?{' '}
                <button type="button" onClick={resend} className="font-semibold" style={{ color: '#e07c0a' }}>Resend</button>
            </p>
            <p className="text-center mt-3">
                <button type="button" onClick={() => go('forgot')} className="text-xs text-gray-400 flex items-center gap-1 mx-auto">
                    <ArrowLeft className="w-3 h-3" /> Change email
                </button>
            </p>
        </form>
    );
}

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
function ResetPwScreen({ go, resetToken, loading, setLoading, setError, setSuccess, onClose, showPw, setShowPw }) {
    const [form, setForm] = useState({ password: '', confirm: '' });
    const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    async function submit(e) {
        e.preventDefault();
        if (form.password !== form.confirm) return setError('Passwords do not match.');
        setError(''); setSuccess(''); setLoading(true);
        try {
            await authApi.resetPassword({ resetToken, password: form.password });
            setSuccess('Password reset! Signing you in…');
            setTimeout(() => { go('login'); }, 1200);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }

    return (
        <form onSubmit={submit}>
            <p className="text-center text-sm text-gray-500 mb-5">Choose a new password</p>
            <Input label="New Password" type={showPw ? 'text' : 'password'} value={form.password} onChange={f('password')} placeholder="Min. 6 characters"
                right={{ onClick: () => setShowPw(v => !v), icon: showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" /> }} />
            <Input label="Confirm Password" type="password" value={form.confirm} onChange={f('confirm')} placeholder="Repeat password" />
            <SubmitBtn loading={loading}>Reset Password</SubmitBtn>
        </form>
    );
}

// ─── OTP Box UI ───────────────────────────────────────────────────────────────
function OtpBoxes({ otp, refs, handleChange, handleKey, handlePaste }) {
    return (
        <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, i) => (
                <input
                    key={i} ref={refs[i]} type="text" inputMode="numeric"
                    maxLength={1} value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKey(i, e)}
                    onPaste={handlePaste}
                    className="w-11 h-12 text-center text-xl font-bold rounded-xl outline-none transition-all"
                    style={{
                        border: digit ? '2px solid #e07c0a' : '1.5px solid #e8d5b0',
                        background: digit ? '#fff8f0' : '#fdfaf5',
                        color: '#2d1a0e',
                    }}
                />
            ))}
        </div>
    );
}