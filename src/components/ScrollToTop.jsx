import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router does NOT reset scroll position on navigation by default —
// the browser just keeps whatever scrollY you were at on the previous
// page. That's why "View All Bhajans" (clicked near the bottom of Home)
// was landing near the footer of the Bhajans page, and "View All Temples"
// was opening mid-page: the new page rendered underneath the same old
// scroll offset.
//
// Mounted once near the top of the router tree (see App.jsx) so every
// navigation — not just the "View All" links — starts from the top.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 'instant' (not 'smooth') on purpose: index.css sets a global
    // `scroll-behavior: smooth`, which would otherwise animate a visible
    // scroll-up through the *new* page's content right after it renders —
    // jarring, and not what "open from the top" means here.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
