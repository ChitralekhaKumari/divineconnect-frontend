import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How does ePuja booking work?', a: 'Choose a temple and ritual, select a date, provide your sankalp details (name, gotra, wish). Our verified pandit performs the puja and you receive a live stream link. Prasad is dispatched to your address.' },
  { q: 'Can I watch live darshan from outside India?', a: 'Yes! Our live darshan streams are accessible worldwide with HD quality. You can tune into morning aarti, evening ceremonies and special occasions from any country.' },
  { q: 'Are the pandits on DivineConnect verified?', a: 'Absolutely. Every pandit on our platform is background-checked, credential-verified, and rated by thousands of real devotees. We only list pandits with 4.5+ ratings.' },
  { q: 'How long does prasad delivery take?', a: 'Prasad is dispatched within 24 hours of puja completion. Delivery takes 3–7 business days within India. International deliveries take 7–14 business days.' },
  { q: 'What if I am not satisfied with the service?', a: 'We offer a full satisfaction guarantee. If you are unhappy for any reason, contact us within 48 hours and we will arrange a re-puja or full refund — no questions asked.' },
  { q: 'Is the AI Guru based on authentic scriptures?', a: 'Yes. Our AI Guru is trained on thousands of authentic Vedic texts, Puranas, Upanishads, and Gita commentaries curated by a panel of Sanskrit scholars and spiritual leaders.' },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={{ background: '#fdfaf5', minHeight: '100vh' }}>
      <div className="relative py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #2d1a0e 0%, #5c3317 50%, #2d1a0e 100%)' }}>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4"
            style={{ background: 'rgba(249,187,92,0.2)', color: '#f9bb5c', border: '1px solid rgba(249,187,92,0.3)' }}>
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Georgia, serif' }}>
            We're Here for You
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto">
            Questions about bookings, pandits, or spiritual guidance? Our team responds within 2 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">
            <h2 className="section-title mb-6">Send Us a Message</h2>

            {submitted ? (
              <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <div className="text-5xl mb-4">🙏</div>
                <h3 className="text-xl font-semibold text-[#2d1a0e] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Namaste! Message Received
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Thank you for reaching out. Our team will get back to you within 2–4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-6 sm:p-8 space-y-5"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-[#5c4a3a] mb-1.5 block uppercase tracking-wide">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                        style={{ borderColor: '#edd9b3', background: '#fdfaf5', color: '#2d1a0e' }}
                        onFocus={e => e.target.style.borderColor = '#f59b24'}
                        onBlur={e => e.target.style.borderColor = '#edd9b3'}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5c4a3a] mb-1.5 block uppercase tracking-wide">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                    style={{ borderColor: '#edd9b3', background: '#fdfaf5', color: '#2d1a0e' }}
                  >
                    {['General Inquiry', 'Puja Booking Help', 'Pandit Request', 'Technical Support', 'Astrology Consultation', 'Partnership', 'Refund / Cancellation'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5c4a3a] mb-1.5 block uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Share your question or request in detail..."
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors resize-none"
                    style={{ borderColor: '#edd9b3', background: '#fdfaf5', color: '#2d1a0e' }}
                    onFocus={e => e.target.style.borderColor = '#f59b24'}
                    onBlur={e => e.target.style.borderColor = '#edd9b3'}
                  />
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-3.5 text-sm">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 className="font-semibold text-[#2d1a0e] text-base mb-5" style={{ fontFamily: 'Georgia, serif' }}>
                Contact Information
              </h3>
              <div className="space-y-4">
                {[
                  { Icon: MapPin, label: 'Address', value: 'Godowlia, Varanasi, UP 221001, India' },
                  { Icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                  { Icon: Mail, label: 'Email', value: 'namaste@divineconnect.in' },
                  { Icon: Clock, label: 'Support Hours', value: 'Mon–Sat: 6:00 AM – 10:00 PM IST' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#fff8f0', border: '1px solid #fcd9a0' }}>
                      <Icon className="w-4 h-4 text-[#c9882a]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 mb-0.5 uppercase tracking-wide">{label}</p>
                      <p className="text-sm text-[#3d2b1f]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-[#2d1a0e] text-sm mb-1">WhatsApp Support</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Get instant help from our spiritual support team via WhatsApp — available 7 days a week.</p>
              <button className="w-full py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#25D366', color: '#fff' }}>
                Chat on WhatsApp →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <h3 className="font-semibold text-[#2d1a0e] text-sm mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Book a Puja', path: '/epuja' },
                  { label: 'Find a Pandit', path: '/pandits' },
                  { label: 'Explore Temples', path: '/temples' },
                  { label: 'Astrology Consultation', path: '/astrology' },
                ].map(link => (
                  <NavLink
                    key={link.label}
                    to={link.path}
                    className="flex items-center justify-between p-2.5 rounded-xl text-sm text-[#3d2b1f] hover:bg-[#fff8f0] hover:text-[#e07c0a] transition-all group"
                  >
                    <span className="font-medium">{link.label}</span>
                    <span className="text-[#c9882a] group-hover:translate-x-0.5 transition-transform">→</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-14 px-4" style={{ background: '#fff' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FREQUENTLY ASKED</span>
            <h2 className="section-title">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid #edd9b3', background: openFaq === i ? '#fff8f0' : '#fff' }}>
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-[#2d1a0e] text-sm">{faq.q}</span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: '#c9882a', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
