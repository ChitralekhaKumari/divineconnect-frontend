import logo from '../assets/images/logo.png';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Reveal from './Reveal';

// Only real, working routes below — no links to modules that don't exist
// yet (e-puja, "Live Darshan", "AI Guru", a sacred shop, etc.).
const footerColumns = [
  {
    title: 'EXPLORE',
    links: [
      { label: 'Temples', path: '/temples' },
      { label: 'Daily Prayers', path: '/prayers' },
      { label: 'Bhajans', path: '/bhajans' },
      { label: 'Scriptures', path: '/scriptures' },
    ],
  },
  {
    title: 'MORE',
    links: [
      { label: 'Hindu Calendar', path: '/calendar' },
      { label: 'Pandits', path: '/pandits' },
      { label: 'Astrology', path: '/astrology' },
      { label: 'Wishlist', path: '/wishlist' },
    ],
  },
  {
    title: 'SUPPORT',
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
    <footer style={{ background: '#f5f0e8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <Reveal index={0} className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="DivineConnect" className="h-9 w-auto object-contain" />
              <span className="font-bold text-lg text-[#2d1a0e]">
                Divine<span style={{ color: '#e07c0a' }}>Connect</span>
              </span>
            </div>
            <p className="text-sm text-[#5c4a3a] leading-relaxed mb-5">
              Your sacred digital sanctuary. Explore temples, chant daily prayers, listen to
              bhajans, and receive spiritual guidance from anywhere in the world.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#5c4a3a]">
                <Mail className="w-4 h-4 text-[#c9882a] flex-shrink-0" />
                <span>namaste@divineconnect.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5c4a3a]">
                <Phone className="w-4 h-4 text-[#c9882a] flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5c4a3a]">
                <MapPin className="w-4 h-4 text-[#c9882a] flex-shrink-0" />
                <span>Varanasi, India</span>
              </div>
            </div>
          </Reveal>

          {footerColumns.map((col, i) => (
            <Reveal key={col.title} index={i + 1}>
              <h4 className="text-xs font-semibold tracking-widest text-[#9c8672] mb-5 uppercase">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.path}
                      className="text-sm text-[#3d2b1f] hover:text-[#e07c0a] transition-colors duration-150"
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
          <div className="mt-12 pt-6 border-t border-[#e0d5c5] flex flex-col sm:flex-row items-center justify-between gap-3">
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
