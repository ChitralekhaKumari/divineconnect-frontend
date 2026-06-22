import logo from '../assets/images/logo.png';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerColumns = [
  {
    title: 'SERVICES',
    links: [
      { label: 'ePuja Booking', path: '/epuja' },
      { label: 'Live Darshan', path: '/home' },
      { label: 'Astrology', path: '/astrology' },
      { label: 'AI Guru', path: '/home' },
      { label: 'Donations', path: '/contact' },
    ],
  },
  {
    title: 'TEMPLES',
    links: [
      { label: 'Kashi Vishwanath', path: '/temples' },
      { label: 'Tirupati Balaji', path: '/temples' },
      { label: 'Somnath Temple', path: '/temples' },
      { label: 'Meenakshi Amman', path: '/temples' },
      { label: 'View All Temples', path: '/temples' },
    ],
  },
  {
    title: 'QUICK LINKS',
    links: [
      { label: 'Book a Pandit', path: '/pandits' },
      { label: 'Puja Packages', path: '/epuja' },
      { label: 'Festival Calendar', path: '/home' },
      { label: 'Prasad Delivery', path: '/epuja' },
      { label: 'Sacred Shop', path: '/home' },
    ],
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'Help Center', path: '/contact' },
      { label: 'Privacy Policy', path: '/contact' },
      { label: 'Terms of Service', path: '/contact' },
      { label: 'Contact Us', path: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#f5f0e8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="DivineConnect" className="h-9 w-auto object-contain" />
              <span className="font-bold text-lg text-[#2d1a0e]">
                Divine<span style={{ color: '#e07c0a' }}>Connect</span>
              </span>
            </div>
            <p className="text-sm text-[#5c4a3a] leading-relaxed mb-5">
              Your sacred digital sanctuary. Connect with temples, book pujas, and receive
              spiritual guidance from anywhere in the world.
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
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
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
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[#e0d5c5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[#9c8672]">
            © 2026 DivineConnect. All rights reserved. Made with 🙏 in India.
          </p>
          <div className="flex items-center gap-1 text-2xl">
            <span>🕉️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
