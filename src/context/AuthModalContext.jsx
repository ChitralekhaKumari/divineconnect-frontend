import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import AuthModal from '../components/AuthModal';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
    const { isLoggedIn } = useAuth();
    const [modalState, setModalState] = useState(null); // null | { screen, message }
    const pendingActionRef = useRef(null);

  
    const requireAuth = useCallback((action, message = 'Please sign in to continue') => {
        if (isLoggedIn) {
            action?.();
            return true;
        }
        pendingActionRef.current = action || null;
        setModalState({ screen: 'login', message });
        return false;
    }, [isLoggedIn]);

    const openAuthModal = useCallback((screen = 'login', message, action = null) => {
        pendingActionRef.current = action || null;
        setModalState({ screen, message });
    }, []);

    const closeAuthModal = useCallback(() => setModalState(null), []);

    // Fires the pending action exactly once, right when login flips to true.
    useEffect(() => {
        if (isLoggedIn && modalState && pendingActionRef.current) {
            const action = pendingActionRef.current;
            pendingActionRef.current = null;
            // Let the modal's own close animation/timeout finish first.
            setTimeout(() => action(), 50);
        }
    }, [isLoggedIn, modalState]);

    return (
        <AuthModalContext.Provider value={{ requireAuth, openAuthModal, closeAuthModal }}>
            {children}
            {modalState && (
                <AuthModal
                    defaultScreen={modalState.screen}
                    redirectMessage={modalState.message}
                    onClose={closeAuthModal}
                />
            )}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    return useContext(AuthModalContext);
}
