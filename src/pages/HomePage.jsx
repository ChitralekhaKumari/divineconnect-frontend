import HeroSection from '../components/HeroSection';
import TempleCards from '../components/TempleCards';
import DailyPrayers from '../components/DailyPrayers';
import FeaturedBhajans from '../components/FeaturedBhajans';
import ScripturesPreview from '../components/ScripturesPreview';
import AstrologySection from '../components/AstrologySection';

// Home page structure (Book Puja intentionally removed — do not add it
// back anywhere on this page. Spiritual Tours, Featured Pandits, Sacred
// Artifacts, the Hindu Calendar preview, and the Testimonials/"DEVOTEE
// CORNER" section were all removed on request too — their components still
// exist under src/components/ if ever needed again, they're just no longer
// imported/rendered here):
// 1. Hero  2. Featured Temples  4. Daily Prayers  5. Featured Bhajans
// 6. Scriptures Preview  7. Astrology (+ dynamic upcoming festival card)
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TempleCards />
      <DailyPrayers />
      <FeaturedBhajans />
      <ScripturesPreview />
      <AstrologySection />
    </>
  );
}
