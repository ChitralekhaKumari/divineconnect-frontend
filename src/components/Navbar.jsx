import logo from '../assets/images/logo.png';
import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import AuthModal from './AuthModal';

const primaryNav = [
  { label: 'Home', path: '/home' },
  { label: 'Temples', path: '/temples' },
  { label: 'Astrology', path: '/astrology' },
  { label: 'Prayers', path: '/prayers' },
  { label: 'Bhajans', path: '/bhajans' },
  { label: 'Scriptures', path: '/scriptures' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const { isLoggedIn, user, clearSession } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'signup'
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close modal after successful login
  function handleModalClose() { setAuthModal(null); }

  const initials = user?.full_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? '#ffffff' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #edd9b3',
          boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <NavLink to="/home" className="flex items-center gap-2.5 flex-shrink-0">
              <img src={logo} alt="DivineConnect" className="h-9 w-auto object-contain" />
              <span className="font-bold text-[#2d1a0e] text-base hidden sm:block"
                style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.03em' }}>
                Divine<span style={{ color: '#e07c0a' }}>Connect</span>
              </span>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {primaryNav.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-150 whitespace-nowrap ${isActive ? 'text-[#e07c0a] bg-[#fff8f0]' : 'text-gray-600 hover:text-[#e07c0a] hover:bg-[#fff8f0]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Auth buttons / User menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Wishlist — kept immediately to the left of Sign In / Sign Up */}
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-lg transition-all duration-150 whitespace-nowrap ${isActive ? 'text-[#e07c0a] bg-[#fff8f0]' : 'text-gray-600 hover:text-[#e07c0a] hover:bg-[#fff8f0]'
                  }`
                }
              >
                <Heart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Wishlist</span>
                {isLoggedIn && wishlistItems.length > 0 && (
                  <span className="ml-0.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: '#e07c0a' }}>
                    {wishlistItems.length}
                  </span>
                )}
              </NavLink>

              {isLoggedIn ? (
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(v => !v)}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
                    style={{ border: '1.5px solid #e8d5b0', background: '#fff8f0' }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background: '#e07c0a' }}>
                      {initials}
                    </div>
                    <span className="text-xs font-semibold text-[#2d1a0e] max-w-[100px] truncate">
                      {user?.full_name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-xl border border-[#edd9b3] py-2 z-50">
                      <div className="px-4 py-2 border-b border-[#f0e4cc] mb-1">
                        <p className="text-xs font-bold text-[#2d1a0e] truncate">{user?.full_name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { clearSession(); setDropOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModal('login')}
                    className="hidden sm:flex items-center text-xs font-semibold px-4 py-2 rounded-full transition-all"
                    style={{ border: '1.5px solid #e07c0a', color: '#e07c0a', background: 'transparent' }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthModal('signup')}
                    className="btn-primary hidden sm:flex items-center text-xs font-semibold text-white px-4 py-2"
                  >
                    Sign Up
                  </button>
                </>
              )}

              <button
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-[#fff8f0] transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#edd9b3] shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 grid grid-cols-2 gap-1">
              {primaryNav.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium py-2.5 px-3 rounded-xl transition-all ${isActive ? 'text-[#e07c0a] bg-[#fff8f0] font-semibold' : 'text-gray-700 hover:text-[#e07c0a] hover:bg-[#fff8f0]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="px-4 pb-4 flex gap-2 border-t border-[#f0e4cc] pt-3">
              {isLoggedIn ? (
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: '#e07c0a' }}>{initials}</div>
                    <span className="text-sm font-semibold text-[#2d1a0e]">{user?.full_name}</span>
                  </div>
                  <button
                    onClick={clearSession}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-full text-sm text-red-600 border border-red-200"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); setAuthModal('login'); }}
                    className="flex-1 py-2.5 text-sm font-semibold rounded-full transition-all"
                    style={{ border: '1.5px solid #e07c0a', color: '#e07c0a' }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); setAuthModal('signup'); }}
                    className="btn-primary flex-1 justify-center text-sm"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          defaultScreen={authModal}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
