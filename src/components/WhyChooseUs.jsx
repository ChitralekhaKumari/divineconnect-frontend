import { whyChooseUsData } from '../data/index';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card flex items-start gap-4 p-5 group hover:-translate-y-0.5">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors"
        style={{ background: '#fff8f0' }}>
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-[#2d1a0e] text-sm mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="py-14 bg-white" id="why">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="section-label">WHY CHOOSE US</p>
          <h2 className="section-title">A Complete Sacred Experience</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
            Everything you need for your spiritual journey, brought together in one divine platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyChooseUsData.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
