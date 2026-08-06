import { useState, useEffect } from 'react';

/**
 * Returns true if the user prefers reduced motion.
 * Used to gate 3D tilt, magnetism, shine sweep, and rack physics.
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    const handler = (e) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
