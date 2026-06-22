import { useState } from 'react';
import { trackerStepsData } from '../data/index';
import { Search } from 'lucide-react';

export default function PujaTracker() {
  const [bookingId, setBookingId] = useState('');
  const [activeStep, setActiveStep] = useState(2);

  return (
    <section className="py-14 bg-white" id="tracker">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="section-label">PUJA STATUS</p>
        <h2 className="section-title mb-3">Track Your Puja</h2>
        <p className="text-sm text-gray-500 mb-8">
          Monitor real-time puja booking status, pandit assignment, and prasad delivery — all on one platform.
        </p>

        {/* Search Bar */}
        <div className="flex gap-2 max-w-md mx-auto mb-12">
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Enter booking ID / order number"
            className="flex-1 border border-[#edd9b3] rounded-full px-5 py-2.5 text-sm outline-none focus:border-[#f59b24]"
            style={{ background: '#fdfaf5' }}
          />
          <button className="btn-primary gap-1.5">
            <Search className="w-4 h-4" />
            Track
          </button>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Background line */}
          <div className="absolute top-6 left-[10%] right-[10%] h-0.5 hidden sm:block" style={{ background: '#edd9b3' }} />
          {/* Active line */}
          <div
            className="absolute top-6 left-[10%] h-0.5 hidden sm:block transition-all duration-700"
            style={{ width: `${(activeStep / (trackerStepsData.length - 1)) * 80}%`, background: '#e07c0a' }}
          />

          <div className="grid grid-cols-5 gap-2 relative">
            {trackerStepsData.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 border-2 transition-all duration-200"
                  style={{
                    background: index <= activeStep ? '#e07c0a' : '#ffffff',
                    borderColor: index <= activeStep ? '#e07c0a' : '#edd9b3',
                    transform: index <= activeStep ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: index <= activeStep ? '0 4px 20px rgba(224,124,10,0.3)' : 'none',
                  }}
                >
                  {step.icon}
                </div>
                <span className="text-xs font-medium text-center leading-tight"
                  style={{ color: index <= activeStep ? '#c46206' : '#6b7280' }}>
                  {step.label}
                </span>
                {index <= activeStep && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#e07c0a' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <button className="btn-primary px-10 py-3">Book a Puja</button>
        </div>
      </div>
    </section>
  );
}
