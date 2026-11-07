import { useState, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useTeams } from '@/hooks/useTeams';
import { useProducts } from '@/hooks/useProducts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatPrice, JERSEY_STYLES } from '@/data/mockData';
import SectionReveal from '@/components/SectionReveal';
import JerseyStylePicker from '@/components/JerseyStylePicker';
import SizePicker from '@/components/SizePicker';
import PaymentModal from '@/components/PaymentModal';

/**
 * 3D Tilt Hook for interactive jersey cards
 */
function useCardTilt() {
  const cardRef = useRef(null);
  const prefersReduced = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 18 });

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

  return { cardRef, springRotateX, springRotateY, handleMouseMove, handleMouseLeave, prefersReduced };
}

/**
 * Enhanced Jersey Card for the Grid View
 */
function ShopCard({ product, onQuickBuy, onSelectTeam }) {
  const navigate = useNavigate();
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const { cardRef, springRotateX, springRotateY, handleMouseMove, handleMouseLeave, prefersReduced } = useCardTilt();

  const teamColor = product.team?.color_hex || '#d4af37';
  const frontImage = product.images?.[0]?.url || `https://placehold.co/600x800/1a1a18/d4af37?text=${encodeURIComponent(product.name)}`;
  const backImage = product.images?.[1]?.url;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="card-tilt-wrapper group relative flex flex-col h-full"
    >
      <motion.div
        ref={cardRef}
        className="card-tilt relative flex flex-col h-full rounded-2xl overflow-hidden bg-bg-card border border-white/5 hover:border-gold/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/60"
        style={prefersReduced ? {} : { rotateX: springRotateX, rotateY: springRotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Team Color Accent Line */}
        <div
          className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
          style={{ backgroundColor: teamColor }}
        />

        {/* Image Showcase Container */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-bg-elevated cursor-pointer"
          onClick={() => navigate(`/products/${product.slug}`)}
        >
          {/* Front Image */}
          <img
            src={frontImage}
            alt={`${product.name} Front`}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-500 ease-out ${
              activeSide === 'back'
                ? 'opacity-0 scale-105'
                : backImage
                  ? 'group-hover:opacity-0 scale-100 group-hover:scale-105'
                  : 'scale-100 group-hover:scale-105'
            }`}
          />

          {/* Back Image (Reveals on hover or toggle) */}
          {backImage && (
            <img
              src={backImage}
              alt={`${product.name} Back`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                activeSide === 'back'
                  ? 'opacity-100 scale-105'
                  : 'opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105'
              }`}
            />
          )}

          {/* Top Overlay Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
            {/* Team Crest Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 shadow-md">
              {product.team?.crest_url ? (
                <img
                  src={product.team.crest_url}
                  alt={product.team.name}
                  className="w-4 h-4 object-contain"
                />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamColor }} />
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary">
                {product.team?.name || 'HPL'}
              </span>
            </div>

            {/* Official Badge */}
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-gold/90 text-black font-heading rounded-md shadow-sm">
              Official Kit
            </span>
          </div>

          {/* Mobile/Quick View Front/Back Switcher */}
          {backImage && (
            <div
              className="absolute bottom-3 right-3 z-20 flex items-center bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-0.5 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${
                  activeSide === 'front' ? 'bg-gold text-black shadow-sm' : 'text-text-muted hover:text-white'
                }`}
                onClick={() => setActiveSide('front')}
                title="View Front"
              >
                Front
              </button>
              <button
                type="button"
                className={`px-2 py-1 text-[10px] font-bold rounded-full transition-all ${
                  activeSide === 'back' ? 'bg-gold text-black shadow-sm' : 'text-text-muted hover:text-white'
                }`}
                onClick={() => setActiveSide('back')}
                title="View Back"
              >
                Back
              </button>
            </div>
          )}

          {/* Subtle Ambient Team Color Gradient at Bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
            style={{
              background: `linear-gradient(to top, ${teamColor}40, transparent)`,
            }}
          />
        </div>

        {/* Card Content & Action Bar */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-bg-card">
          <div>
            {/* Cut Options Available */}
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-text-muted font-medium">3 Sport Cuts</span>
              <span className="text-gold/90 font-semibold tracking-wide">
                🏏 Collar · ⚽ Crew · 🏀 Vest
              </span>
            </div>

            {/* Product Title */}
            <h3
              className="text-base sm:text-lg font-bold text-text-primary group-hover:text-gold transition-colors truncate cursor-pointer"
              onClick={() => navigate(`/products/${product.slug}`)}
            >
              {product.name}
            </h3>

            {/* Size availability */}
            <p className="text-[11px] text-text-muted mt-0.5">
              Sizes: <span className="text-text-secondary">S, M, L, XL, XXL, 2XL, 3XL</span>
            </p>
          </div>

          {/* Pricing & CTA Buttons */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted">Special Price</p>
              <p className="text-gold font-heading text-xl sm:text-2xl leading-none">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectTeam(product.team?.slug)}
                className="px-2.5 py-2 text-xs font-medium text-text-muted hover:text-text-primary rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                title="View Team Spotlight"
              >
                Spotlight
              </button>
              <button
                type="button"
                onClick={() => onQuickBuy(product)}
                className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-gold text-black rounded-lg hover:bg-gold-bright hover:shadow-lg hover:shadow-gold/20 transition-all duration-200 active:scale-95"
              >
                Quick Buy
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Team Spotlight Hero Card (Featured when a team is selected or user chooses spotlight)
 */
function TeamSpotlightHero({ product, onBuyNow, onBackToAll }) {
  const navigate = useNavigate();
  const [selectedSide, setSelectedSide] = useState('front');
  const [selectedStyleId, setSelectedStyleId] = useState('cricket');
  const [selectedSize, setSelectedSize] = useState('L');

  if (!product) return null;

  const team = product.team;
  const teamColor = team?.color_hex || '#d4af37';
  const frontImage = product.images?.[0]?.url || `https://placehold.co/600x800/1a1a18/d4af37?text=${encodeURIComponent(product.name)}`;
  const backImage = product.images?.[1]?.url;
  const currentImage = selectedSide === 'back' && backImage ? backImage : frontImage;

  const selectedStyleObj = JERSEY_STYLES.find((s) => s.id === selectedStyleId) || JERSEY_STYLES[0];

  const handleBuy = () => {
    onBuyNow(product, selectedStyleObj, selectedSize);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl overflow-hidden border border-white/10 bg-bg-card shadow-2xl mb-12"
    >
      {/* Background Ambient Glow Flare */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{ backgroundColor: teamColor }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ backgroundColor: '#d4af37' }}
      />

      <div className="relative p-6 sm:p-8 lg:p-10">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            {team?.crest_url && (
              <div
                className="w-12 h-12 rounded-2xl p-1.5 flex items-center justify-center border shadow-md"
                style={{
                  backgroundColor: `${teamColor}20`,
                  borderColor: `${teamColor}60`,
                }}
              >
                <img
                  src={team.crest_url}
                  alt={team.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gold">
                  Official Matchday Spotlight
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: teamColor }} />
              </div>
              <h2 className="text-2xl sm:text-3xl text-text-primary leading-tight">
                {team?.name || product.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              View All 7 Teams
            </button>
          </div>
        </div>

        {/* Content Columns: Left Image Showcase, Right Config & Purchase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Interactive Dual-Side Viewer (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-2xl overflow-hidden bg-bg-elevated border border-white/10 shadow-2xl group">
              {/* Active Image */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={currentImage}
                  alt={`${product.name} ${selectedSide}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Team Watermark Crest */}
                {team?.crest_url && (
                  <img
                    src={team.crest_url}
                    alt=""
                    aria-hidden="true"
                    className="absolute -bottom-8 -right-8 w-44 h-44 object-contain opacity-10 pointer-events-none"
                  />
                )}
              </div>

              {/* View Switcher Pills */}
              {backImage && (
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-10">
                  <div className="bg-black/80 backdrop-blur-md p-1 rounded-full border border-white/15 flex items-center shadow-xl">
                    <button
                      type="button"
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                        selectedSide === 'front'
                          ? 'bg-gold text-black shadow-md'
                          : 'text-text-muted hover:text-white'
                      }`}
                      onClick={() => setSelectedSide('front')}
                    >
                      👕 Front View
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                        selectedSide === 'back'
                          ? 'bg-gold text-black shadow-md'
                          : 'text-text-muted hover:text-white'
                      }`}
                      onClick={() => setSelectedSide('back')}
                    >
                      🔄 Back View
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-text-muted text-xs mt-3 flex items-center gap-1.5">
              <span>💡</span> Click Front/Back to inspect sponsor prints and back details
            </p>
          </div>

          {/* Right Column: Specifications & Direct Purchase (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-gold font-heading text-4xl sm:text-5xl">
                  {formatPrice(product.price)}
                </span>
                <span className="text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Flat Price · All 3 Cuts
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
                Official {team?.name} match kit made with high-performance breathable fabric. Choose your preferred sport collar and cut, choose your size, and pay instantly via Indian Bank UPI.
              </p>
            </div>

            {/* Sport Cut Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  1. Choose Your Sport Cut
                </label>
                <span className="text-xs text-gold font-semibold">
                  {selectedStyleObj.shortName}
                </span>
              </div>
              <JerseyStylePicker
                styles={JERSEY_STYLES}
                selected={selectedStyleId}
                onSelect={setSelectedStyleId}
                teamColor={teamColor}
              />
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  2. Choose Garment Size
                </label>
                <span className="text-xs text-gold font-semibold">
                  Size: {selectedSize}
                </span>
              </div>
              <SizePicker
                variants={product.variants || []}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBuy}
                className="flex-1 sm:flex-none px-8 py-4 rounded-xl font-heading text-lg tracking-wider bg-gold text-black hover:bg-gold-bright hover:shadow-xl hover:shadow-gold/25 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>BUY NOW — ₹400</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/products/${product.slug}`)}
                className="px-6 py-4 rounded-xl text-sm font-semibold text-text-primary hover:text-gold bg-bg-elevated hover:bg-white/10 border border-white/10 hover:border-gold/30 transition-all duration-200"
              >
                Customize Details
              </button>
            </div>

            {/* Terms and Delivery Notice */}
            <div className="p-3 rounded-xl bg-gold/10 border border-gold/25 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[11px]">
                <span>⚠️</span>
                <span>Important Terms & Delivery Policy</span>
              </div>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                • <strong className="text-text-primary">No Refund & Return Policy:</strong> Every jersey is custom-tailored on demand. No refunds, returns, or cancellations once confirmed.
              </p>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                • <strong className="text-text-primary">Delivery Timeline:</strong> Takes <strong className="text-gold font-bold">at least 7–10 days</strong> to verify your payment and get it delivered directly to your hostel room.
              </p>
            </div>

            {/* Delivery & UPI Trust Notice */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
              <span className="flex items-center gap-1.5">
                <span className="text-gold">✓</span> Indian Bank Direct UPI
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gold">✓</span> Campus Hostel Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gold">✓</span> Instant Email Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Quick Buy Modal for fast checkout directly from the grid.
 * Fully responsive: 2-column layout on laptop/desktop, touch-friendly scrollable card on mobile.
 */
function QuickBuyModal({ product, isOpen, onClose, onProceedToPayment }) {
  const [selectedStyleId, setSelectedStyleId] = useState('cricket');
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedSide, setSelectedSide] = useState('front');

  if (!isOpen || !product) return null;

  const team = product.team;
  const teamColor = team?.color_hex || '#d4af37';
  const frontImage = product.images?.[0]?.url;
  const backImage = product.images?.[1]?.url;
  const currentImage = selectedSide === 'back' && backImage ? backImage : frontImage;
  const selectedStyleObj = JERSEY_STYLES.find((s) => s.id === selectedStyleId) || JERSEY_STYLES[0];

  const handleProceed = () => {
    onProceedToPayment(product, selectedStyleObj, selectedSize);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-lg md:max-w-3xl lg:max-w-4xl bg-bg-card border border-gold/30 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
        >
          {/* Sticky Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-bg-elevated/80 backdrop-blur-md flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              {team?.crest_url ? (
                <div
                  className="w-9 h-9 rounded-xl p-1 flex items-center justify-center border shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: `${teamColor}20`,
                    borderColor: `${teamColor}40`,
                  }}
                >
                  <img
                    src={team.crest_url}
                    alt={team.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: teamColor }} />
              )}
              <div>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-gold">
                  Quick Buy · Official 2026 Match Kit
                </p>
                <h3 className="text-base sm:text-lg font-bold text-text-primary leading-tight truncate max-w-[220px] sm:max-w-md">
                  {product.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 text-text-muted hover:text-white flex items-center justify-center border border-white/10 transition-colors flex-shrink-0"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Body: 2 Columns on Laptop/Desktop */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column (md: 5 cols): Jersey Preview + Pricing + Policy */}
              <div className="md:col-span-5 flex flex-col gap-3.5">
                {/* Large Responsive Jersey Viewer */}
                <div className="relative aspect-[3/4] w-full max-w-[220px] sm:max-w-[260px] md:max-w-none mx-auto rounded-2xl overflow-hidden bg-bg-elevated border border-white/10 shadow-lg group">
                  <img
                    src={currentImage}
                    alt={`${product.name} preview`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Watermark Crest */}
                  {team?.crest_url && (
                    <img
                      src={team.crest_url}
                      alt=""
                      aria-hidden="true"
                      className="absolute -bottom-6 -right-6 w-32 h-32 object-contain opacity-10 pointer-events-none"
                    />
                  )}

                  {/* Front/Back View Switcher */}
                  {backImage && (
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                      <div className="bg-black/85 backdrop-blur-md p-1 rounded-full border border-white/15 flex items-center shadow-lg">
                        <button
                          type="button"
                          onClick={() => setSelectedSide('front')}
                          className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                            selectedSide === 'front'
                              ? 'bg-gold text-black shadow-sm'
                              : 'text-text-muted hover:text-white'
                          }`}
                        >
                          👕 Front
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSide('back')}
                          className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all ${
                            selectedSide === 'back'
                              ? 'bg-gold text-black shadow-sm'
                              : 'text-text-muted hover:text-white'
                          }`}
                        >
                          🔄 Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Strip */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-white/5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted block">Total Amount</span>
                    <span className="text-gold font-heading text-2xl sm:text-3xl leading-none">₹400</span>
                  </div>
                  <div className="text-right text-[11px] text-text-muted">
                    <span className="block text-text-secondary font-medium">All 3 Cuts</span>
                    <span>Sizes S to 3XL</span>
                  </div>
                </div>

                {/* Terms and Delivery Notice */}
                <div className="p-3 rounded-xl bg-gold/10 border border-gold/25 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[10px]">
                    <span>⚠️</span>
                    <span>Terms & Delivery Policy</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    • <strong className="text-text-primary">No Refund & Return:</strong> Custom printed to order. No cancellations or returns.
                  </p>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    • <strong className="text-text-primary">Delivery:</strong> Takes <strong className="text-gold font-bold">at least 7–10 days</strong> to verify and get it delivered to your hostel room.
                  </p>
                </div>
              </div>

              {/* Right Column (md: 7 cols): Controls & Checkout Action */}
              <div className="md:col-span-7 flex flex-col gap-4 sm:gap-5">
                {/* 1. Style Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      1. Select Jersey Style
                    </label>
                    <span className="text-xs text-gold font-semibold">
                      {selectedStyleObj.shortName}
                    </span>
                  </div>
                  <JerseyStylePicker
                    styles={JERSEY_STYLES}
                    selected={selectedStyleId}
                    onSelect={setSelectedStyleId}
                    teamColor={teamColor}
                  />
                </div>

                {/* 2. Size Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-primary">
                      2. Select Size
                    </label>
                    <span className="text-xs text-gold font-semibold">
                      Size: {selectedSize}
                    </span>
                  </div>
                  <SizePicker
                    variants={product.variants || []}
                    selected={selectedSize}
                    onSelect={setSelectedSize}
                  />
                </div>

                {/* Selected Summary Pill */}
                <div className="p-3 rounded-xl bg-bg-elevated/70 border border-white/5 text-xs flex items-center justify-between">
                  <span className="text-text-muted">Selected Kit:</span>
                  <span className="text-text-primary font-medium text-right">
                    <strong className="text-gold">{selectedStyleObj.shortName}</strong> · Size <strong className="text-gold">{selectedSize}</strong>
                  </span>
                </div>

                {/* Submit / Proceed Button */}
                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full py-3.5 sm:py-4 rounded-xl font-heading text-base sm:text-lg tracking-wider bg-gold text-black hover:bg-gold-bright hover:shadow-xl hover:shadow-gold/25 transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO UPI PAYMENT (₹400)</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <span className="text-gold">✓</span> Indian Bank Direct UPI
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-gold">✓</span> Campus Hostel Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-gold">✓</span> Email Confirmation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * 3-Cut Style Breakdown Guide
 */
function StyleGuideSection() {
  return (
    <SectionReveal className="mt-16 sm:mt-24 pt-12 border-t border-white/10">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-gold px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
          Tailored For Every Sport
        </span>
        <h2 className="text-3xl sm:text-4xl text-text-primary mt-3 mb-2">
          3 WAYS TO WEAR YOUR TEAM
        </h2>
        <p className="text-text-secondary text-sm max-w-xl mx-auto">
          Every official HPL jersey is manufactured to order in 3 specialized cuts. Pick the style that matches your game.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {JERSEY_STYLES.map((style) => (
          <div
            key={style.id}
            className="p-6 rounded-2xl bg-bg-card border border-white/5 hover:border-gold/30 transition-all duration-300 relative group"
          >
            <div className="text-3xl mb-3">{style.sportEmoji}</div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-text-primary">{style.name}</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold">
                {style.badge}
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed mb-4">
              {style.description}
            </p>
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-text-muted">
              <span>Collar: <strong className="text-text-primary">{style.collar}</strong></span>
              <span>Sleeves: <strong className="text-text-primary">{style.sleeves}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}

/**
 * Main Shop Page
 */
export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamFilter = searchParams.get('team') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'spotlight'

  // Quick Buy state
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);

  // Payment Modal state
  const [paymentModalState, setPaymentModalState] = useState({
    isOpen: false,
    product: null,
    style: null,
    size: 'L',
  });

  const { teams } = useTeams();
  // Fetch all products so we have full list available for search & secondary shelves
  const { products: allProducts, loading } = useProducts();

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  // Filtered products based on team filter & search query
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesTeam = !teamFilter || p.team?.slug === teamFilter;
      const matchesQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTeam && matchesQuery;
    });
  }, [allProducts, teamFilter, searchQuery]);

  // Spotlight product: if team filter active, that product; otherwise first product or selected
  const spotlightProduct = useMemo(() => {
    if (teamFilter) {
      return allProducts.find((p) => p.team?.slug === teamFilter) || filteredProducts[0] || null;
    }
    return filteredProducts[0] || allProducts[0] || null;
  }, [allProducts, filteredProducts, teamFilter]);

  // Handle direct payment modal open
  const handleOpenPayment = (product, styleObj, size) => {
    setPaymentModalState({
      isOpen: true,
      product,
      style: styleObj,
      size: size || 'L',
    });
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="container-hpl">
        {/* Page Hero Header */}
        <SectionReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
              <span>🏆</span>
              <span>Official HPL 2026 Collection</span>
            </div>
            <h1 className="text-4xl sm:text-6xl text-text-primary tracking-tight mb-3">
              <span className="text-gradient-gold">HPL TEAM ARMOR</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Wear your hostel block colours with pride. Every official team jersey is custom-tailored in 3 sports cuts for ₹400.
            </p>
          </div>
        </SectionReveal>

        {/* Feature Highlights Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10 text-center">
          <div className="p-3 rounded-xl bg-bg-card border border-white/5">
            <span className="text-lg">💰</span>
            <p className="text-xs font-bold text-text-primary mt-1">₹400 Flat Price</p>
            <p className="text-[10px] text-text-muted">No hidden taxes or fees</p>
          </div>
          <div className="p-3 rounded-xl bg-bg-card border border-white/5">
            <span className="text-lg">⚡</span>
            <p className="text-xs font-bold text-text-primary mt-1">Indian Bank UPI</p>
            <p className="text-[10px] text-text-muted">Instant scan & pay checkout</p>
          </div>
          <div className="p-3 rounded-xl bg-bg-card border border-white/5">
            <span className="text-lg">🚚</span>
            <p className="text-xs font-bold text-text-primary mt-1">Hostel Delivery</p>
            <p className="text-[10px] text-text-muted">Delivered to VIT Bhopal rooms</p>
          </div>
        </div>

        {/* Team Filter Pills with Real Team Crest Icons */}
        <div className="mb-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
            Select Your Team Block
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* All Teams Button */}
            <motion.button
              type="button"
              className={`
                px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold
                border transition-all duration-200 flex items-center gap-2 shadow-sm
                ${!teamFilter
                  ? 'bg-gold text-black border-gold shadow-gold/20'
                  : 'bg-bg-card text-text-secondary border-white/10 hover:border-gold/30 hover:text-white'
                }
              `}
              onClick={() => setFilter('team', '')}
              whileTap={{ scale: 0.95 }}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              All 7 Teams
            </motion.button>

            {/* Individual Teams */}
            {teams.map((team) => {
              const isActive = teamFilter === team.slug;
              const teamColor = team.color_hex || '#d4af37';

              return (
                <motion.button
                  key={team.id}
                  type="button"
                  className={`
                    px-3.5 py-2 rounded-full text-xs uppercase tracking-wider font-bold
                    border transition-all duration-200 flex items-center gap-2 shadow-sm
                    ${isActive
                      ? 'border-gold text-white shadow-lg'
                      : 'bg-bg-card text-text-secondary border-white/10 hover:border-white/20 hover:text-white'
                    }
                  `}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${teamColor}33`,
                          borderColor: teamColor,
                          boxShadow: `0 0 15px ${teamColor}40`,
                        }
                      : {}
                  }
                  onClick={() => setFilter('team', isActive ? '' : team.slug)}
                  whileTap={{ scale: 0.95 }}
                >
                  {team.crest_url ? (
                    <img
                      src={team.crest_url}
                      alt={team.name}
                      className="w-4 h-4 object-contain"
                    />
                  ) : (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: teamColor }}
                    />
                  )}
                  <span>{team.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Search & Layout Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-bg-card/70 border border-white/5 p-3 sm:p-4 rounded-2xl">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team or jersey name..."
              className="w-full bg-bg-elevated border border-white/10 rounded-xl px-4 py-2 pl-9 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold/50"
            />
            <span className="absolute left-3 top-2.5 text-text-muted text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-text-muted hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status & View Mode */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">
              Showing <strong className="text-gold">{filteredProducts.length}</strong> of 7 kits
            </span>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-bg-elevated rounded-xl p-1 border border-white/10">
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-gold text-black shadow-sm' : 'text-text-muted hover:text-white'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <span>⊞</span> Grid
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'spotlight' ? 'bg-gold text-black shadow-sm' : 'text-text-muted hover:text-white'
                }`}
                onClick={() => setViewMode('spotlight')}
              >
                <span>🌟</span> Spotlight
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-bg-card rounded-3xl border border-white/5 p-8">
            <span className="text-4xl">🔍</span>
            <p className="text-text-primary font-bold text-lg">No jerseys found matching your search</p>
            <p className="text-text-muted text-sm max-w-md">
              We couldn't find any team kit matching "{searchQuery}". Try searching for another team or clear filters.
            </p>
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gold text-black hover:bg-gold-bright transition-all"
              onClick={() => {
                setSearchQuery('');
                setFilter('team', '');
              }}
            >
              Reset Filters & Show All
            </button>
          </div>
        )}

        {/* SPOTLIGHT HERO (Shown when a team is selected or user toggles spotlight view) */}
        {!loading && (teamFilter || viewMode === 'spotlight') && spotlightProduct && (
          <TeamSpotlightHero
            product={spotlightProduct}
            onBuyNow={handleOpenPayment}
            onBackToAll={() => {
              setFilter('team', '');
              setViewMode('grid');
            }}
          />
        )}

        {/* MAIN PRODUCT GRID */}
        {!loading && filteredProducts.length > 0 && (!teamFilter || viewMode === 'grid') && (
          <div>
            {teamFilter && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-text-primary">
                  All 7 HPL Matchday Kits
                </h3>
                <button
                  type="button"
                  onClick={() => setFilter('team', '')}
                  className="text-xs text-gold hover:underline"
                >
                  Show all teams
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ShopCard
                  key={product.id}
                  product={product}
                  onQuickBuy={setQuickBuyProduct}
                  onSelectTeam={(slug) => setFilter('team', slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Style Guide Section */}
        <StyleGuideSection />

        {/* Quick Buy Modal */}
        <QuickBuyModal
          product={quickBuyProduct}
          isOpen={!!quickBuyProduct}
          onClose={() => setQuickBuyProduct(null)}
          onProceedToPayment={handleOpenPayment}
        />

        {/* Payment Modal */}
        <PaymentModal
          isOpen={paymentModalState.isOpen}
          onClose={() => setPaymentModalState((prev) => ({ ...prev, isOpen: false }))}
          product={paymentModalState.product}
          selectedStyle={paymentModalState.style}
          selectedSize={paymentModalState.size}
        />
      </div>
    </div>
  );
}