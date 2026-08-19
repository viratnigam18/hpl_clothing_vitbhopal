/**
 * GoldShine — looping gold shimmer overlay.
 * @param {string} shape - 'circle' clips to circle via clip-path, 'rect' uses overflow+border-radius
 */
export default function GoldShine({ children, className = '', shape = 'rect' }) {
  return (
    <div
      className={`gold-shine ${shape === 'circle' ? 'circle-clip' : ''} ${className}`}
      style={{ borderRadius: 'inherit' }}
    >
      {children}
    </div>
  );
}
