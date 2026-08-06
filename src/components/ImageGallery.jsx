import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ImageGallery — product image viewer with main image + thumbnails.
 * Swipeable on mobile via Framer Motion drag.
 */
export default function ImageGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[3/4] rounded-xl bg-bg-elevated flex items-center justify-center text-text-muted">
        No image
      </div>
    );
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -50 && activeIndex < images.length - 1) {
      setActiveIndex((i) => i + 1);
    } else if (info.offset.x > 50 && activeIndex > 0) {
      setActiveIndex((i) => i - 1);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-bg-elevated">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[activeIndex]?.url}
            src={images[activeIndex]?.url}
            alt={`Product image ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          />
        </AnimatePresence>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-black/60 text-text-primary text-xs">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              className={`
                w-16 h-20 rounded-lg overflow-hidden flex-shrink-0
                border-2 transition-all duration-200
                ${i === activeIndex
                  ? 'border-gold opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-80'
                }
              `}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
