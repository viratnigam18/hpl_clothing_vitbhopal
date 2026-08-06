import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatPrice } from '@/data/mockData';

const DRAG_SENSITIVITY = 0.3; // degrees per pixel dragged
const SNAP_STIFFNESS = 120;
const SNAP_DAMPING = 20;

/**
 * JerseyRack — 3D circular clothing rack with drag, momentum, and snap.
 *
 * Props:
 * - products: array of product objects with images, name, price, slug, team
 * - onProductClick: optional callback(product) — defaults to navigate
 */
export default function JerseyRack({ products = [], onProductClick }) {
  const prefersReduced = useReducedMotion();
  const navigate = useNavigate();
  const viewportRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);

  const n = products.length;
  const angleStep = n > 0 ? 360 / n : 360;

  // Current rotation angle (MotionValue for smooth updates)
  const rawAngle = useMotionValue(0);
  const angle = useSpring(rawAngle, {
    stiffness: SNAP_STIFFNESS,
    damping: SNAP_DAMPING,
  });

  // Track centered product index
  const [centeredIndex, setCenteredIndex] = useState(0);

  // Update centered index when angle changes
  useEffect(() => {
    const unsubscribe = angle.on('change', (latest) => {
      if (n === 0) return;
      // Normalize to 0-360
      const normalized = ((latest % 360) + 360) % 360;
      const idx = Math.round(normalized / angleStep) % n;
      setCenteredIndex(idx);
    });
    return unsubscribe;
  }, [angle, angleStep, n]);

  // Snap to nearest product
  const snapToNearest = useCallback(
    (currentAngle, velocity = 0) => {
      if (n === 0) return;
      // Add momentum
      const projected = currentAngle + velocity * 0.1;
      const nearestSnap = Math.round(projected / angleStep) * angleStep;
      rawAngle.set(nearestSnap);
    },
    [angleStep, n, rawAngle]
  );

  // Navigate to a specific index
  const goToIndex = useCallback(
    (index) => {
      const targetAngle = index * angleStep;
      // Find the closest rotation to avoid going the long way around
      const current = rawAngle.get();
      const diff = targetAngle - (current % 360);
      const shortDiff =
        ((diff + 180) % 360) - 180 + (diff > 0 && diff % 360 === 0 ? 0 : 0);
      rawAngle.set(current + (((diff + 180) % 360) - 180));
    },
    [angleStep, rawAngle]
  );

  // --- Pointer/drag handlers ---
  const handlePointerDown = (e) => {
    if (prefersReduced) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartAngle.current = rawAngle.get();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || prefersReduced) return;
    const deltaX = e.clientX - dragStartX.current;
    const newAngle = dragStartAngle.current + deltaX * DRAG_SENSITIVITY;
    rawAngle.set(newAngle);
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const velocity = (e.clientX - dragStartX.current) * DRAG_SENSITIVITY;
    snapToNearest(rawAngle.get(), velocity);
  };

  // --- Touch handlers (for mobile momentum) ---
  const lastTouchX = useRef(0);
  const touchVelocity = useRef(0);

  const handleTouchStart = (e) => {
    if (prefersReduced) return;
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    lastTouchX.current = e.touches[0].clientX;
    dragStartAngle.current = rawAngle.get();
    touchVelocity.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || prefersReduced) return;
    const currentX = e.touches[0].clientX;
    touchVelocity.current = (currentX - lastTouchX.current) * DRAG_SENSITIVITY;
    lastTouchX.current = currentX;
    const deltaX = currentX - dragStartX.current;
    rawAngle.set(dragStartAngle.current + deltaX * DRAG_SENSITIVITY);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    snapToNearest(rawAngle.get(), touchVelocity.current * 5);
  };

  // --- Keyboard navigation ---
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const current = rawAngle.get();
      rawAngle.set(Math.round(current / angleStep) * angleStep - angleStep);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const current = rawAngle.get();
      rawAngle.set(Math.round(current / angleStep) * angleStep + angleStep);
    }
  };

  // --- Click handler ---
  const handleItemClick = (product, index) => {
    if (index === centeredIndex) {
      // Centered item → navigate
      if (onProductClick) {
        onProductClick(product);
      } else {
        navigate(`/products/${product.slug}`);
      }
    } else {
      // Non-centered → snap to it
      goToIndex(index);
    }
  };

  // --- Reduced motion fallback ---
  if (prefersReduced) {
    return <ReducedMotionCarousel products={products} onProductClick={onProductClick} />;
  }

  if (n === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        No products to display
      </div>
    );
  }

  const RADIUS = typeof window !== 'undefined' && window.innerWidth < 640 ? 200 : 320;

  return (
    <div className="relative w-full select-none" aria-label="Product rack, use arrow keys to browse">
      {/* Viewport */}
      <div
        ref={viewportRef}
        className="rack-viewport relative mx-auto overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: 420, maxWidth: 800 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="listbox"
        aria-label="Jersey rack"
      >
        {/* Gold rim light */}
        <div className="rack-rim-light absolute inset-0 z-10" />

        {/* Rotating ring */}
        <motion.div
          className="rack-ring absolute inset-0 flex items-center justify-center"
          style={{ rotateY: angle }}
        >
          {products.map((product, i) => (
            <RackItem
              key={product.id}
              product={product}
              index={i}
              total={n}
              angleStep={angleStep}
              radius={RADIUS}
              angle={angle}
              isCentered={i === centeredIndex}
              onClick={() => handleItemClick(product, i)}
            />
          ))}
        </motion.div>
      </div>

      {/* Arrow buttons (visible on mobile, subtle on desktop) */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          className="w-10 h-10 rounded-full border border-white/10 text-text-secondary hover:text-gold hover:border-gold/30 transition-colors flex items-center justify-center"
          onClick={() => {
            const current = rawAngle.get();
            rawAngle.set(Math.round(current / angleStep) * angleStep - angleStep);
          }}
          aria-label="Previous product"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Info label */}
        <AnimatePresence mode="wait">
          {products[centeredIndex] && (
            <motion.div
              key={centeredIndex}
              className="text-center min-w-[200px]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-text-muted text-xs uppercase tracking-wider">
                {products[centeredIndex].team?.name || 'HPL'}
              </p>
              <p className="text-text-primary font-semibold text-sm mt-0.5">
                {products[centeredIndex].name}
              </p>
              <p className="text-gold font-bold text-lg mt-0.5">
                {formatPrice(products[centeredIndex].price)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="w-10 h-10 rounded-full border border-white/10 text-text-secondary hover:text-gold hover:border-gold/30 transition-colors flex items-center justify-center"
          onClick={() => {
            const current = rawAngle.get();
            rawAngle.set(Math.round(current / angleStep) * angleStep + angleStep);
          }}
          aria-label="Next product"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Individual item on the rack — positioned around the circle.
 */
function RackItem({ product, index, total, angleStep, radius, angle, isCentered, onClick }) {
  const itemAngle = index * angleStep;

  // Calculate opacity and scale based on angular distance from front
  const opacity = useTransform(angle, (a) => {
    const normalized = (((a - itemAngle) % 360) + 540) % 360 - 180;
    const absDist = Math.abs(normalized);
    if (absDist < 20) return 1;
    if (absDist < 60) return 0.7;
    if (absDist < 100) return 0.4;
    return 0.15;
  });

  const scale = useTransform(angle, (a) => {
    const normalized = (((a - itemAngle) % 360) + 540) % 360 - 180;
    const absDist = Math.abs(normalized);
    if (absDist < 20) return 1;
    if (absDist < 60) return 0.85;
    if (absDist < 100) return 0.7;
    return 0.55;
  });

  const blur = useTransform(angle, (a) => {
    const normalized = (((a - itemAngle) % 360) + 540) % 360 - 180;
    const absDist = Math.abs(normalized);
    if (absDist < 20) return 'blur(0px)';
    if (absDist < 60) return 'blur(1px)';
    return 'blur(2px)';
  });

  const teamColor = product.team?.color_hex || '#d4af37';
  const image =
    product.images?.[0]?.url ||
    `https://placehold.co/280x360/${teamColor.slice(1)}/ffffff?text=${encodeURIComponent(product.name)}`;

  return (
    <motion.div
      className="rack-item"
      style={{
        transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
        marginLeft: -70,
        marginTop: -100,
        opacity,
        scale,
        filter: blur,
      }}
      onClick={onClick}
      role="option"
      aria-selected={isCentered}
      aria-label={`${product.name}, ${formatPrice(product.price)}`}
    >
      <div
        className={`
          w-[140px] sm:w-[180px] rounded-xl overflow-hidden
          transition-all duration-300 cursor-pointer
          ${isCentered
            ? 'ring-2 ring-gold/30 shadow-lg shadow-gold/10'
            : 'ring-1 ring-white/5'
          }
        `}
      >
        <div className="aspect-[3/4] bg-bg-elevated overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>
        {/* Hanger-line effect */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${teamColor}66, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

/**
 * ReducedMotionCarousel — simple arrow-button carousel fallback.
 */
function ReducedMotionCarousel({ products, onProductClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const n = products.length;

  if (n === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        No products to display
      </div>
    );
  }

  const product = products[currentIndex];
  const teamColor = product.team?.color_hex || '#d4af37';
  const image =
    product.images?.[0]?.url ||
    `https://placehold.co/400x520/${teamColor.slice(1)}/ffffff?text=${encodeURIComponent(product.name)}`;

  const goTo = (newIndex) => {
    setCurrentIndex(((newIndex % n) + n) % n);
  };

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/products/${product.slug}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          className="w-10 h-10 rounded-full border border-white/10 text-text-secondary hover:text-gold hover:border-gold/30 transition-colors flex items-center justify-center"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="Previous product"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          className="w-[200px] sm:w-[260px] rounded-xl overflow-hidden cursor-pointer ring-2 ring-gold/30 shadow-lg shadow-gold/10"
          onClick={handleClick}
        >
          <div className="aspect-[3/4] bg-bg-elevated overflow-hidden">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <button
          className="w-10 h-10 rounded-full border border-white/10 text-text-secondary hover:text-gold hover:border-gold/30 transition-colors flex items-center justify-center"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="Next product"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="text-center">
        <p className="text-text-muted text-xs uppercase tracking-wider">
          {product.team?.name || 'HPL'}
        </p>
        <p className="text-text-primary font-semibold text-sm mt-0.5">
          {product.name}
        </p>
        <p className="text-gold font-bold text-lg mt-0.5">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {products.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-gold' : 'bg-white/10'}`}
            onClick={() => goTo(i)}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
