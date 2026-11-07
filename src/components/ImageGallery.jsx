import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ImageGallery — product image viewer with Front & Back toggles + thumbnails.
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
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-elevated border border-white/5 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[activeIndex]?.url}
            src={images[activeIndex]?.url}
            alt={images[activeIndex]?.label || `Jersey view ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          />
        </AnimatePresence>

        {/* Front / Back Switch Pill on Main Image */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center bg-black/80 backdrop-blur-md rounded-full p-1 border border-white/10 z-10 shadow-lg">
            {images.map((img, i) => (
              <button
                key={img.id || i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`
                  px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200
                  ${i === activeIndex
                    ? 'bg-gold text-bg font-bold shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {i === 0 ? 'Front' : i === 1 ? 'Back' : `View ${i + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              type="button"
              className={`
                relative w-20 sm:w-24 h-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0
                border-2 transition-all duration-200 group bg-bg-elevated
                ${i === activeIndex
                  ? 'border-gold shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-gold/40'
                }
              `}
              onClick={() => setActiveIndex(i)}
              aria-label={`View ${i === 0 ? 'Front' : 'Back'} side`}
            >
              <img
                src={img.url}
                alt={img.label || `Thumbnail ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span
                className={`
                  absolute bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                  transition-colors border
                  ${i === activeIndex
                    ? 'bg-gold text-bg border-gold'
                    : 'bg-black/85 backdrop-blur-xs text-text-primary border-white/10 group-hover:border-gold/40'
                  }
                `}
              >
                {i === 0 ? 'Front' : i === 1 ? 'Back' : `View ${i + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
