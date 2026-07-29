import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Fires once when the element first enters the viewport, then disconnects —
// scrolling back up/down never re-triggers it (per the "only once" and
// "don't re-trigger on scroll back" requirements). Also respects
// prefers-reduced-motion: users who've asked for less motion see content
// immediately, fully visible, with no animation at all — decided up front
// via the lazy useState initializer so there's no setState-in-effect.
export default function useScrollReveal({ threshold = 0.1, rootMargin = '0px 0px -20px 0px' } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return; // already visible (reduced motion) — nothing to observe

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // once only
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin]);

  return [ref, visible];
}
