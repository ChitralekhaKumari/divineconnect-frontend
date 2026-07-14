import { createContext, useContext, useCallback, useRef, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const showToast = useCallback((message, type = 'success', duration = 2200) => {
        const id = ++idCounter;
        setToasts((prev) => [...prev, { id, message, type }]);
        timers.current[id] = setTimeout(() => dismiss(id), duration);
        return id;
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast stack */}
            <div
                className="fixed z-[200] flex flex-col gap-2 items-center sm:items-end"
                style={{ bottom: '1.25rem', left: '1rem', right: '1rem', pointerEvents: 'none' }}
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        onClick={() => dismiss(t.id)}
                        className="wishlist-toast flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold shadow-lg cursor-pointer"
                        style={{
                            background: t.type === 'error' ? '#fff1f0' : '#fff8f0',
                            color: t.type === 'error' ? '#c0392b' : '#2d1a0e',
                            border: `1px solid ${t.type === 'error' ? '#f5c2bd' : '#f5e0b8'}`,
                            pointerEvents: 'auto',
                            maxWidth: '360px',
                        }}
                    >
                        {t.type === 'error'
                            ? <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#c0392b' }} />
                            : <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#e07c0a' }} />}
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
