import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminProtectedRoute({ children }) {
    const { user, isLoggedIn, ready } = useAuth();
    const location = useLocation();

    // Still hydrating auth from localStorage — render nothing to avoid a flash redirect
    if (!ready) return null;

    if (!isLoggedIn || user?.role !== 'admin') {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}
