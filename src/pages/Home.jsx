import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import GoldShine from '@/components/GoldShine';

import ProductCard from '@/components/ProductCard';
import SectionReveal from '@/components/SectionReveal';
import MagneticButton from '@/components/MagneticButton';

export default function Home() {
  const navigate = useNavigate();
  const { products: bestsellers } = useProducts();
  const scrollRef = useRef(null);

  const bestsellerProducts = bestsellers.filter((p) => p.is_bestseller);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg-card/50 to-bg" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Logo — golden shine effect */}
          <div className="mb-8">
            <GoldShine shape="circle" className="rounded-full">
              <motion.div
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-gold/30 flex items-center justify-center bg-bg-card/80 overflow-hidden"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src="/images/hpl_logo.png"
                  alt="HPL Logo"
                  className="w-full h-full object-contain p-3"
                  draggable={false}
                />
              </motion.div>
            </GoldShine>
          </div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary mb-4"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Wear Your Team.<br />
            <span className="text-gradient-gold">Own the Field.</span>
          </motion.h1>

          <motion.p
            className="text-text-secondary text-base sm:text-lg max-w-lg mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Official jerseys for all 7 HPL teams at VIT Bhopal.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
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
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
              >
                {bestsellerProducts.map((product, i) => (
                  <div key={product.id} className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start">
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </SectionReveal>
      )}
    </div>
  );
}
