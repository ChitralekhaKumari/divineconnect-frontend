import logo from '../assets/images/logo.png';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Reveal from './Reveal';

// Only real, working routes below — no links to modules that don't exist
// yet (e-puja, "Live Darshan", "AI Guru", a sacred shop, etc.).
const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'Temples', path: '/temples' },
      { label: 'Daily Prayers', path: '/prayers' },
      { label: 'Bhajans', path: '/bhajans' },
      { label: 'Scriptures', path: '/scriptures' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Hindu Calendar', path: '/calendar' },
      { label: 'Astrology', path: '/astrology' },
      { label: 'Wishlist', path: '/wishlist' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'Help Center', path: '/contact' },
      { label: 'Privacy Policy', path: '/contact' },
      { label: 'Terms of Service', path: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(160deg, #fff8ef 0%, #fdf1de 50%, #faead0 100%)' }}>

      {/* Top accent line */}
      <div className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(224,124,10,0.35), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-8">

          <Reveal index={0}>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="DivineConnect" className="h-9 w-auto object-contain" />
              <span className="font-bold text-lg text-[#2d1a0e]">
                Divine<span style={{ color: '#e07c0a' }}>Connect</span>
              </span>
            </div>
            <p className="text-sm text-[#7a6553] leading-relaxed mb-6 max-w-xs">
              Your sacred digital sanctuary. Explore temples, chant daily prayers, listen to
              bhajans, and receive spiritual guidance from anywhere in the world.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-[#5c4a3a]">
                <span className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(224,124,10,0.10)' }}>
                  <Mail className="w-3.5 h-3.5" style={{ color: '#c9882a' }} />
                </span>
                <span>namaste@divineconnect.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#5c4a3a]">
                <span className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(224,124,10,0.10)' }}>
                  <Phone className="w-3.5 h-3.5" style={{ color: '#c9882a' }} />
                </span>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#5c4a3a]">
                <span className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(224,124,10,0.10)' }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color: '#c9882a' }} />
                </span>
                <span>Varanasi, India</span>
              </div>
            </div>
          </Reveal>

          {footerColumns.map((col, i) => (
            <Reveal key={col.title} index={i + 1}>
              <h4 className="text-xs font-semibold tracking-widest mb-5 uppercase"
                style={{ color: '#c9882a' }}>
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.path}
                      className="text-sm text-[#5c4a3a] hover:text-[#e07c0a] transition-colors duration-150"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(224,124,10,0.15)' }}>
            <p className="text-sm text-[#9c8672]">
              © 2026 DivineConnect. All rights reserved. Made with 🙏 in India.
            </p>
            <div className="flex items-center gap-1 text-2xl">
              <span>🕉️</span>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
