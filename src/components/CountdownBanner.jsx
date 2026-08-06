import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveDrop } from '@/hooks/useActiveDrop';

/**
 * CountdownBanner — shows a countdown timer for the active drop.
 * Only renders when a drop is active and hasn't ended.
 */
export default function CountdownBanner() {
  const { drop } = useActiveDrop();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!drop) return;

    const update = () => {
      const now = Date.now();
      const end = new Date(drop.ends_at).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [drop]);

  if (!drop || !timeLeft) return null;

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="w-full py-4 px-6 bg-gradient-to-r from-gold-dim/20 via-gold/10 to-gold-dim/20 border-y border-gold/10"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
      >
        <div className="container-hpl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <p className="text-gold font-heading text-lg sm:text-xl uppercase tracking-wider">
            {drop.title}
          </p>

          <div className="flex items-center gap-3">
            {units.map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <motion.span
                  key={unit.value}
                  className="text-text-primary font-heading text-2xl sm:text-3xl w-12 text-center"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
                <span className="text-text-muted text-[10px] uppercase tracking-widest mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
