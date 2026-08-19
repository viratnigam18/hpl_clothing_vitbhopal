import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatPrice } from '@/data/mockData';

const BUY_NOW_FORM = 'https://forms.gle/LnowDts9HkYSLohg7';

/**
 * ProductCard — 3D tilt on mouse move, hover lift, Buy Now opens Google Form.
 */
export default function ProductCard({ product, index = 0 }) {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = ((e.clientY - centerY) / (rect.height / 2)) * -8;
    const deltaY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    rotateX.set(deltaX);
    rotateY.set(deltaY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const params = new URLSearchParams({
      'entry.product': product.name,
      'entry.price': formatPrice(product.price),
      'entry.team': product.team?.name || 'HPL',
    });
    window.open(`${BUY_NOW_FORM}?${params.toString()}`, '_blank');
  };

  const teamColor = product.team?.color_hex || '#d4af37';
  const image = product.images?.[0]?.url || `https://placehold.co/600x800/1a1a18/d4af37?text=${encodeURIComponent(product.name)}`;

  return (
    <motion.div
      className="card-tilt-wrapper cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <motion.div
        ref={cardRef}
        className="card-tilt rounded-xl overflow-hidden bg-bg-card border border-white/5 hover:border-gold/20"
        style={
          prefersReduced
            ? {}
            : { rotateX: springRotateX, rotateY: springRotateY }
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/products/${product.slug}`)}
        whileHover={prefersReduced ? {} : { y: -8, transition: { duration: 0.3 } }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-bg-elevated">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Team color pip */}
          <div
            className="absolute top-3 left-3 w-3 h-3 rounded-full ring-2 ring-white/20"
            style={{ backgroundColor: teamColor }}
          />
          {/* Bestseller badge */}
          {product.is_bestseller && (
            <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gold-dim text-gold-bright rounded-full">
              Official
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <p className="text-text-muted text-xs uppercase tracking-wider">
            {product.team?.name || 'HPL'}
          </p>
          <h3 className="text-text-primary font-semibold text-sm leading-tight truncate">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gold font-bold text-lg">
              {formatPrice(product.price)}
            </span>
            <motion.button
              className="px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide
                         bg-gold/10 text-gold border border-gold/20 hover:bg-gold hover:text-bg
                         transition-all duration-200"
              whileTap={{ scale: 0.9 }}
              onClick={handleBuyNow}
              aria-label={`Buy ${product.name} now`}
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
