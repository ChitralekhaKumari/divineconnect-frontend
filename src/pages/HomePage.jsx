import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import TempleCards from '../components/TempleCards';
import DailyPrayers from '../components/DailyPrayers';
import FeaturedBhajans from '../components/FeaturedBhajans';
import ScripturesPreview from '../components/ScripturesPreview';
import AstrologySection from '../components/AstrologySection';
import { homeApi } from '../services/homeApi';

// section_key → component. 'hero' and 'astrology_cta' are handled
// separately below since they need the admin content/stats props threaded through.
const SECTION_COMPONENTS = {
  temples: TempleCards,
  prayers: DailyPrayers,
  bhajans: FeaturedBhajans,
  scriptures: ScripturesPreview,
};

// Default order/visibility, used until the admin-configured layout loads
// (or if the API is unreachable) — matches the page's original fixed layout.
const DEFAULT_SECTIONS = [
  { section_key: 'hero', is_active: true },
  { section_key: 'temples', is_active: true },
  { section_key: 'prayers', is_active: true },
  { section_key: 'bhajans', is_active: true },
  { section_key: 'scriptures', is_active: true },
  { section_key: 'astrology_cta', is_active: true },
];

export default function HomePage() {
  const [content, setContent] = useState(null);
  const [stats, setStats] = useState([]);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  useEffect(() => {
    let cancelled = false;
    homeApi.getHomeContent()
      .then((res) => {
        if (cancelled || !res?.data) return;
        setContent(res.data.content);
        setStats(res.data.stats || []);
        if (res.data.sections?.length) setSections(res.data.sections);
      })
      .catch(() => { /* keep defaults — Home still renders fully */ });
    return () => { cancelled = true; };
  }, []);

  const activeSections = sections.filter((s) => s.is_active);

  return (
    <>
      {activeSections.map((section) => {
        if (section.section_key === 'hero') {
          return <HeroSection key="hero" content={content} stats={stats} />;
        }
        if (section.section_key === 'astrology_cta') {
          return <AstrologySection key="astrology_cta" content={content} />;
        }
        const Component = SECTION_COMPONENTS[section.section_key];
        return Component ? <Component key={section.section_key} /> : null;
      })}
    </>
  );
}
