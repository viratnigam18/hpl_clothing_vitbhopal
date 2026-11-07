import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MagneticButton from '@/components/MagneticButton';
import { TEAMS } from '@/data/mockData';

/**
 * TeamWardrobe — Virtual Wardrobe & Outfit Combinator Modal.
 * Displays "Coming Soon" with outfit combination teaser.
 */
export default function TeamWardrobe({ isOpen = false, onClose }) {
  const navigate = useNavigate();

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBrowseShop = () => {
    onClose?.();
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-xl bg-bg-card border border-gold/25 rounded-3xl p-6 sm:p-10 text-center shadow-2xl z-10 overflow-hidden my-auto"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-text-muted hover:text-text-primary flex items-center justify-center transition-colors z-20"
              aria-label="Close wardrobe modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Glowing Ring Effect Behind Header */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[120px] rounded-[50%] pointer-events-none opacity-40">
              <div
                className="w-full h-full rounded-[50%] border border-gold/30"
                style={{
                  boxShadow: '0 0 50px rgba(212,175,55,0.2), inset 0 0 30px rgba(212,175,55,0.1)',
                }}
              />
            </div>

            {/* Clothes Hanger & Combine Icon */}
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Wardrobe Clothes Hanger Icon */}
                <path d="M12 2a3 3 0 0 0-3 3c0 .7.3 1.3.7 1.8L2 15a2 2 0 0 0 1.2 2.6c.3.1.5.1.8.1h16a2 2 0 0 0 2-2c0-.3 0-.5-.1-.8l-7.7-8.2c.4-.5.7-1.1.7-1.8a3 3 0 0 0-3-3z" />
                <path d="M9 18v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2" />
              </svg>
            </div>

            {/* "Coming Soon" Badge */}
            <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-gold/15 text-gold border border-gold/35 mb-4">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span>Coming Soon</span>
            </div>

            {/* Title */}
            <h2 className="relative z-10 font-heading text-3xl sm:text-5xl text-text-primary tracking-wider mb-2">
              WARDROBE
            </h2>

            {/* Subtitle */}
            <p className="relative z-10 font-semibold text-gold text-sm sm:text-base uppercase tracking-wider mb-3">
              Combine Clothes & Build Your Outfit
            </p>

            {/* Explanation */}
            <p className="relative z-10 text-text-secondary text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-6">
              Our interactive virtual locker room is in the works! Soon you will be able to combine official jerseys with shorts, hoodies, and caps, mix & match cuts (Cricket Collar, Football No Collar, Basketball Sleeveless), and style your complete matchday look before ordering.
            </p>

            {/* Feature Teaser Cards */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-left">
              <div className="p-3.5 rounded-xl bg-bg-elevated/70 border border-white/5 space-y-1">
                <span className="text-xl">👕</span>
                <p className="text-xs font-semibold text-text-primary">Combine Clothes</p>
                <p className="text-[11px] text-text-muted leading-tight">
                  Mix and match jerseys, track bottoms, and gear.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-bg-elevated/70 border border-white/5 space-y-1">
                <span className="text-xl">🔄</span>
                <p className="text-xs font-semibold text-text-primary">3D Try-On</p>
                <p className="text-[11px] text-text-muted leading-tight">
                  Inspect front & back views of full styled kits.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-bg-elevated/70 border border-white/5 space-y-1">
                <span className="text-xl">⚡</span>
                <p className="text-xs font-semibold text-text-primary">Kit Bundles</p>
                <p className="text-[11px] text-text-muted leading-tight">
                  Order your complete combination in one tap.
                </p>
              </div>
            </div>

            {/* 7 Teams Palette Preview */}
            <div className="relative z-10 p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-2 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">
                Available for all 7 teams:
              </span>
              <div className="flex items-center gap-1.5">
                {TEAMS.map((t) => (
                  <span
                    key={t.id}
                    title={t.name}
                    className="w-3.5 h-3.5 rounded-full border border-white/20 transition-transform hover:scale-125 cursor-pointer"
                    style={{ backgroundColor: t.color_hex }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <MagneticButton
                variant="primary"
                onClick={handleBrowseShop}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider"
              >
                Browse Shop Merch →
              </MagneticButton>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-white/10 hover:border-white/20 text-text-secondary hover:text-text-primary text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
