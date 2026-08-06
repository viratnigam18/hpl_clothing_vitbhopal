/**
 * GoldShine — looping gold shimmer overlay for the hero crest.
 * Pure CSS animation, no JS. Wraps the child element.
 */
export default function GoldShine({ children, className = '' }) {
  return (
    <div className={`gold-shine ${className}`}>
      {children}
    </div>
  );
}
