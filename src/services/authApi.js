const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(path, body) {
    const res = await fetch(`${BASE}/auth${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || 'Something went wrong.');
        err.code = data.error;   // e.g. 'EMAIL_NOT_VERIFIED'
        err.email = data.email;   // email to redirect to verify screen
        throw err;
    }
    return data;
}

export const authApi = {
    register: (body) => request('/register', body),
    verifyEmail: (body) => request('/verify-email', body),
    login: (body) => request('/login', body),
    forgotPassword: (body) => request('/forgot-password', body),
    verifyResetOtp: (body) => request('/verify-reset-otp', body),
    resetPassword: (body) => request('/reset-password', body),
    resendOtp: (body) => request('/resend-otp', body),
};