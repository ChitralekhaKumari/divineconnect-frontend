import logo from '../assets/images/logo.png';

import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const primaryNav = [
  { label: 'Home', path: '/home' },
  { label: 'ePuja', path: '/epuja' },
  { label: 'Temples', path: '/temples' },
  { label: 'Astrology', path: '/astrology' },
  { label: 'Prayers', path: '/prayers' },
  { label: 'Bhajans', path: '/home' },
  { label: 'Scriptures', path: '/home' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
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

          <NavLink to="/home" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logo} alt="DivineConnect" className="h-9 w-auto object-contain" />
            <span className="font-bold text-[#2d1a0e] text-base hidden sm:block">
              Divine<span style={{ color: '#e07c0a' }}>Connect</span>
            </span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-0.5">
            {primaryNav.map((link) => (
              <NavLink
                key={link.path + link.label}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-150 whitespace-nowrap ${isActive
                    ? 'text-[#e07c0a] bg-[#fff8f0]'
                    : 'text-gray-600 hover:text-[#e07c0a] hover:bg-[#fff8f0]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="hidden sm:flex items-center text-xs font-semibold text-gray-600 hover:text-[#e07c0a] transition-all px-3 py-2">
              Sign In
            </button>
            <NavLink
              to="/epuja"
              className="btn-primary px-4 py-2 text-xs hidden sm:flex"
            >
              Book Puja
            </NavLink>
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-[#fff8f0] transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#edd9b3] shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 grid grid-cols-2 gap-1">
            {primaryNav.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium py-2.5 px-3 rounded-xl transition-all ${isActive
                    ? 'text-[#e07c0a] bg-[#fff8f0] font-semibold'
                    : 'text-gray-700 hover:text-[#e07c0a] hover:bg-[#fff8f0]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="px-4 pb-4 flex gap-2 border-t border-[#f0e4cc] pt-3">
            <button className="flex-1 py-2.5 text-sm font-semibold text-[#e07c0a] border border-[#e07c0a] rounded-full hover:bg-[#fff8f0] transition-all">
              Sign In
            </button>
            <NavLink to="/epuja" className="btn-primary flex-1 justify-center text-sm">
              Book Puja
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}