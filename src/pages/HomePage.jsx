import HeroSection from '../components/HeroSection';
import SacredModules from '../components/SacredModules';
import TempleCards from '../components/TempleCards';
import PujaCards from '../components/PujaCards';
import PujaTracker from '../components/PujaTracker';
import OfferSection from '../components/OfferSection';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import AppDownload from '../components/AppDownload';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SacredModules />
      <TempleCards />
      <PujaCards />
      <PujaTracker />
      <OfferSection />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <AppDownload />
    </>
  );
}
