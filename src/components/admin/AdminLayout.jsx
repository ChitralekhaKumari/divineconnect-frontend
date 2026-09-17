import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Home, Building2, Sparkles, BookOpen, Music2, ScrollText,
    CalendarDays, Mail, LogOut, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MODULES = [
    { key: 'home', label: 'Home', icon: Home, path: '/admin/home', ready: true },
    { key: 'temples', label: 'Temples', icon: Building2, path: '/admin/temples', ready: true },
    { key: 'astrology', label: 'Astrology', icon: Sparkles, path: '/admin/astrology', ready: false },
    { key: 'prayers', label: 'Prayers', icon: BookOpen, path: '/admin/prayers', ready: true },
    { key: 'bhajans', label: 'Bhajans', icon: Music2, path: '/admin/bhajans', ready: false },
    { key: 'scriptures', label: 'Scriptures', icon: ScrollText, path: '/admin/scriptures', ready: false },
    { key: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/admin/calendar', ready: false },
    { key: 'contact', label: 'Contact', icon: Mail, path: '/admin/contact', ready: false },
];

export default function AdminLayout() {
    const { user, clearSession } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        clearSession();
        navigate('/admin/login', { replace: true });
    }

    return (
        <div className="min-h-screen flex" style={{ background: '#f5f0e8' }}>
            {/* Sidebar */}
            <aside className="w-60 shrink-0 flex flex-col" style={{ background: '#2d1a0e' }}>
                <div className="px-5 py-5 flex items-center gap-2 border-b border-white/10">
                    <span className="text-xl">🕉️</span>
                    <div>
                        <div className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                            DivineConnect
                        </div>
                        <div className="text-white/40 text-[10px] tracking-wide">ADMIN PANEL</div>
                    </div>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1">
                    {MODULES.map((m) => (
                        <NavLink
                            key={m.key}
                            to={m.ready ? m.path : '#'}
                            onClick={(e) => { if (!m.ready) e.preventDefault(); }}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${m.ready
                                    ? isActive
                                        ? 'text-[#2d1a0e]'
                                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    : 'text-white/25 cursor-not-allowed'
                                }`
                            }
                            style={({ isActive }) => (m.ready && isActive ? { background: '#f9bb5c' } : {})}
                        >
                            <span className="flex items-center gap-2.5">
                                <m.icon className="w-4 h-4" />
                                {m.label}
                            </span>
                            {!m.ready && <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded-full">SOON</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-3 pb-4 pt-2 border-t border-white/10 space-y-1">
                    <a href="/home" target="_blank" rel="noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" /> View Live Site
                    </a>
                    <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0 flex flex-col">
                <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-black/5" style={{ background: '#fff' }}>
                    <div className="text-xs text-gray-400">Signed in as</div>
                    <div className="text-sm font-semibold text-[#2d1a0e]">{user?.full_name || user?.email}</div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
