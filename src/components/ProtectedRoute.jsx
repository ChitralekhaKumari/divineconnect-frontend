import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function ProtectedRoute({ children, label }) {
    const { isLoggedIn, ready } = useAuth();
    const [dismissed, setDismissed] = useState(false);

    // Still hydrating from localStorage — render nothing
    if (!ready) return null;

    // Logged in → show the page
    if (isLoggedIn) return children;

    // Not logged in and user dismissed the modal → go home
    if (dismissed) return <Navigate to="/home" replace />;

    // Show the auth modal over a blank background
    return (
        <>
            <div style={{ minHeight: '100vh', background: '#fdfaf5' }} />
            <AuthModal
                defaultScreen="login"
                redirectMessage={`Please sign in to access ${label}`}
                onClose={() => setDismissed(true)}
            />
        </>
    );
}
