import useScrollReveal from '../hooks/useScrollReveal';

// Wrap any section, heading, card, button, image, etc. in <Reveal> to get a
// one-time fade-in + slide-up-from-bottom when it scrolls into view.
//
//   <Reveal><h2>Featured Temples</h2></Reveal>
//   <Reveal delay={60}><p>Subheading…</p></Reveal>
//
// For grids/lists, pass `index` and Reveal computes a staggered delay
// automatically — kept short on purpose (50ms/item, capped at 250ms) so a
// long grid still cascades slightly without any item feeling like it's
// "waiting" to appear.
//
//   {items.map((item, i) => <Reveal key={item.id} index={i}>...</Reveal>)}
//
// The actual transition duration/easing lives in index.css (.reveal) —
// Reveal only ever sets `transition-delay` here, never duration, so it
// can't clash with the finely-tuned per-property timing defined there.
//
// `as` picks the wrapper tag (defaults to 'div') so it can wrap inline
// content like buttons/spans without breaking layout.
const STAGGER_MS = 50;
const MAX_STAGGER_MS = 250;

export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  index,
  className = '',
  ...rest
}) {
  const [ref, visible] = useScrollReveal();

  const computedDelay = typeof index === 'number'
    ? Math.min(index * STAGGER_MS, MAX_STAGGER_MS)
    : delay;

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${computedDelay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
