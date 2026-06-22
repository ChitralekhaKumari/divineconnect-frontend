import { testimonialsData } from '../data/index';
import { Star, Quote } from 'lucide-react';

function TestimonialCard({ name, location, avatar, rating, text }) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 text-[#f59b24] fill-[#f59b24]" />
        ))}
      </div>
      <Quote className="w-6 h-6 text-[#fcd9a0]" />
      <p className="text-sm text-gray-600 leading-relaxed flex-1">{text}</p>
      <div className="flex items-center gap-3 pt-2 border-t border-[#f5e8d0]">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #f59b24, #c46206)' }}>
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#2d1a0e]">{name}</p>
          <p className="text-xs text-gray-400">{location}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-14" style={{ background: '#fdfaf5' }} id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label">DEVOTEE CORNER</p>
          <h2 className="section-title">Blessings Received</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Hear from devotees who have found their divine journey through DivineConnect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonialsData.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
