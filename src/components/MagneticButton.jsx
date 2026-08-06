import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * MagneticButton — button that subtly follows the cursor within its bounds.
 * Falls back to a plain button on prefers-reduced-motion.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className — additional classes
 * @param {string} props.variant — 'primary' | 'secondary' | 'ghost'
 * @param {function} props.onClick
 * @param {string} props.id
 * @param {boolean} props.disabled
 */
export default function MagneticButton({
  children,
  className = '',
  variant = 'primary',
  onClick,
  id,
  disabled = false,
  type = 'button',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.25;
    const deltaY = (e.clientY - centerY) * 0.25;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles = `
    relative overflow-hidden font-semibold tracking-wide
    transition-colors duration-200
    focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      px-8 py-3 rounded-lg text-sm uppercase
      bg-gold text-bg hover:bg-gold-bright
      ${disabled ? '' : 'active:scale-95'}
    `,
    secondary: `
      px-8 py-3 rounded-lg text-sm uppercase
      border border-gold/30 text-gold hover:border-gold hover:bg-gold/10
    `,
    ghost: `
      px-4 py-2 rounded-md text-sm
      text-text-secondary hover:text-gold
    `,
  };

  return (
    <motion.button
      ref={ref}
      id={id}
      type={type}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      style={prefersReduced ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileTap={prefersReduced ? {} : { scale: 0.97 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
