import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * SectionReveal — Wraps children in a fade+slide-up animation on scroll into view.
 */
export default function SectionReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) {
  const prefersReduced = useReducedMotion();

  const offsets = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  if (prefersReduced) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
