import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false); // hydrated from localStorage?

    // Hydrate on mount
    useEffect(() => {
        try {
            const t = localStorage.getItem('dc_token');
            const u = localStorage.getItem('dc_user');
            if (t && u) { setToken(t); setUser(JSON.parse(u)); }
        } catch { }
        setReady(true);
    }, []);

    function saveSession(token, user) {
        setToken(token);
        setUser(user);
        localStorage.setItem('dc_token', token);
        localStorage.setItem('dc_user', JSON.stringify(user));
    }

    function clearSession() {
        setToken(null);
        setUser(null);
        localStorage.removeItem('dc_token');
        localStorage.removeItem('dc_user');
    }

    const isLoggedIn = !!token && !!user;

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, ready, saveSession, clearSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
