import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import GoldShine from '@/components/GoldShine';

import ProductCard from '@/components/ProductCard';
import SectionReveal from '@/components/SectionReveal';
import MagneticButton from '@/components/MagneticButton';

export default function Home() {
  const navigate = useNavigate();
  const { products: bestsellers } = useProducts();
  const prefersReduced = useReducedMotion();

  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);
  const [isManualMoving, setIsManualMoving] = useState(false);
  const resumeTimerRef = useRef(null);
  const touchStartXRef = useRef(0);

  const bestsellerProducts = bestsellers.filter((p) => p.is_bestseller);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  const scroll = (dir) => {
    // dir === -1: Left arrow -> move cards to the right
    // dir === 1: Right arrow -> move cards to the left
    const cardStep = typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 300;
    const setWidth = (bestsellerProducts.length || 7) * cardStep;

    setIsPaused(true);
    setIsManualMoving(true);

    setManualOffset((prev) => {
      const next = prev - dir * cardStep;
      // Wrap within buffer bounds so cards never run out
      if (next < -setWidth) return next + setWidth;
      if (next > setWidth) return next - setWidth;
      return next;
    });

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      setIsManualMoving(false);
    }, 2000);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!isManualMoving) {
      setIsPaused(false);
    }
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;

    // Swipe threshold 40px
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        scroll(1); // Swiped left -> advance cards
      } else {
        scroll(-1); // Swiped right -> go back
      }
    } else {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 2000);
    }
  };

  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="relative min-h-[82vh] sm:min-h-[90vh] flex flex-col items-center justify-start sm:justify-center pt-8 sm:pt-0 pb-12 sm:pb-0 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-card/50 to-bg" />
        <div
          className="absolute top-[32%] sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[600px] h-[480px] sm:h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Logo — golden shine effect */}
          <div className="mb-6 sm:mb-8">
            <GoldShine shape="circle" className="rounded-full inline-flex">
              <motion.div
                className="w-44 h-44 sm:w-44 sm:h-44 rounded-full border-2 border-gold/40 flex items-center justify-center bg-bg-card/90 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/images/hpl_logo.png"
                  alt="HPL Logo"
                  className="w-full h-full object-contain p-2 sm:p-3 translate-x-[3%]"
                  draggable={false}
                />
              </motion.div>
            </GoldShine>
          </div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Wear Your Team.<br />
            <span className="text-gradient-gold">Own the Field.</span>
          </motion.h1>

          <motion.p
            className="text-text-secondary text-sm sm:text-lg max-w-lg mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Official jerseys for all 7 HPL teams at VIT Bhopal.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-6 sm:px-0"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <MagneticButton variant="primary" onClick={() => navigate('/shop')} id="hero-shop-cta">
              Shop Now
            </MagneticButton>
            <MagneticButton variant="secondary" onClick={() => navigate('/shop')} id="hero-browse-cta">
              Browse Teams
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ====== BEST SELLERS ====== */}
      {bestsellerProducts.length > 0 && (
        <SectionReveal>
          <section className="py-16 sm:py-20">
            <div className="container-hpl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl sm:text-3xl text-text-primary">
                  Best <span className="text-gradient-gold">Sellers</span>
                </h2>
                {/* Scroll arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={() => scroll(-1)}
                    className="w-9 h-9 rounded-full border border-white/10 text-text-secondary hover:text-gold hover:border-gold/30 transition-all flex items-center justify-center"
                    aria-label="Scroll left"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scroll(1)}
                    className="w-9 h-9 rounded-full border border-white/10 text-text-secondary hover:text-gold hover:border-gold/30 transition-all flex items-center justify-center"
                    aria-label="Scroll right"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                className="hpl-marquee-container overflow-hidden pb-4 select-none"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Manual offset layer for smooth arrow and swipe movement */}
                <div
                  style={{
                    transform: `translateX(${manualOffset}px)`,
                    transition: isManualMoving
                      ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                      : 'none',
                    willChange: 'transform',
                  }}
                >
                  {/* Continuous infinite marquee ticker layer */}
                  <div
                    className={`hpl-marquee-track ${isPaused ? 'is-paused' : ''}`}
                    style={{
                      animationPlayState: isPaused ? 'paused' : 'running',
                      animationName: prefersReduced ? 'none' : undefined,
                    }}
                  >
                    {[0, 1, 2, 3].map((groupIndex) => (
                      <div
                        key={`marquee-group-${groupIndex}`}
                        className="flex shrink-0 gap-5 pr-5"
                        aria-hidden={groupIndex > 0 ? 'true' : undefined}
                      >
                        {bestsellerProducts.map((product, i) => (
                          <div
                            key={`${product.id}-g${groupIndex}`}
                            className="flex-shrink-0 w-[260px] sm:w-[280px]"
                          >
                            <ProductCard product={product} index={i} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SectionReveal>
      )}
    </div>
  );
}
