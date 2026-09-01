import HeroSection from '../components/HeroSection';
import TempleCards from '../components/TempleCards';
import DailyPrayers from '../components/DailyPrayers';
import FeaturedBhajans from '../components/FeaturedBhajans';
import ScripturesPreview from '../components/ScripturesPreview';
import AstrologySection from '../components/AstrologySection';

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
