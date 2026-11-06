import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct } from '@/hooks/useProduct';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice, JERSEY_STYLES } from '@/data/mockData';
import ImageGallery from '@/components/ImageGallery';
import SizePicker from '@/components/SizePicker';
import JerseyStylePicker from '@/components/JerseyStylePicker';
import PaymentModal from '@/components/PaymentModal';
import MagneticButton from '@/components/MagneticButton';
import ProductCard from '@/components/ProductCard';
import SectionReveal from '@/components/SectionReveal';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(slug);

  const [selectedStyle, setSelectedStyle] = useState('cricket');
  const [selectedSize, setSelectedSize] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Get related products from the same team
  const teamSlug = product?.team?.slug;
  const { products: relatedProducts } = useProducts({
    teamSlug: teamSlug || undefined,
  });
  const moreFromTeam = relatedProducts.filter((p) => p.slug !== slug).slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-text-muted text-lg">Product not found</p>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.size === selectedSize);
  const canBuy = selectedVariant && selectedVariant.stock_qty > 0 && !!selectedStyle;
  const teamColor = product.team?.color_hex || '#d4af37';
  const selectedStyleObj = JERSEY_STYLES.find((s) => s.id === selectedStyle) || JERSEY_STYLES[0];

  const handleBuyNow = () => {
    if (!canBuy) return;
    setIsPaymentOpen(true);
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="container-hpl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-text-muted" aria-label="Breadcrumb">
          <button
            onClick={() => navigate('/shop')}
            className="hover:text-gold transition-colors"
          >
            Shop
          </button>
          <span className="mx-2">/</span>
          {product.team && (
            <>
              <button
                onClick={() => navigate(`/teams/${product.team.slug}`)}
                className="hover:text-gold transition-colors"
              >
                {product.team.name}
              </button>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-text-secondary">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Image Gallery */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <ImageGallery images={product.images || []} />
              {selectedStyleObj && (
                <div className="absolute top-3 left-3 pointer-events-none z-10 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-text-primary flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: teamColor }} />
                  <span>{selectedStyleObj.name}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Team badge link */}
            {product.team && (
              <button
                onClick={() => navigate(`/teams/${product.team.slug}`)}
                className="flex items-center gap-2 mb-4 w-fit group"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: teamColor }}
                />
                <span className="text-text-muted text-xs uppercase tracking-wider group-hover:text-gold transition-colors">
                  {product.team.name}
                </span>
              </button>
            )}

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl text-text-primary mb-2 normal-case">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-gold font-heading text-3xl mb-6">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Style Picker (3 options: Cricket Collar, Football Without Collar, Basketball Sleeveless) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-text-primary text-sm font-semibold uppercase tracking-wider">
                  Select Jersey Style
                </p>
                {selectedStyleObj && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                    {selectedStyleObj.tag}
                  </span>
                )}
              </div>
              <JerseyStylePicker
                styles={JERSEY_STYLES}
                selected={selectedStyle}
                onSelect={setSelectedStyle}
                teamColor={teamColor}
              />
            </div>

            {/* Size Picker */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-text-primary text-sm font-semibold uppercase tracking-wider">
                  Select Size
                </p>
                {selectedSize && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                    Size: {selectedSize}
                  </span>
                )}
              </div>
              <SizePicker
                variants={product.variants || []}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
              {!selectedSize && (
                <p className="text-text-muted text-xs mt-2">
                  Please select a size to continue
                </p>
              )}
            </div>

            {/* Buy Now */}
            <div className="mt-auto flex flex-col gap-3">
              <MagneticButton
                variant="primary"
                className="w-full sm:w-auto text-base py-3.5"
                onClick={handleBuyNow}
                disabled={!canBuy}
                id="product-buy-now"
              >
                {!selectedSize
                  ? 'Select a Size'
                  : selectedVariant?.stock_qty === 0
                    ? 'Out of Stock'
                    : `Buy Now — ₹400 →`
                }
              </MagneticButton>
              <p className="text-text-muted text-xs">
                {selectedStyleObj && selectedSize ? (
                  <>
                    Selected: <span className="text-gold font-medium">{selectedStyleObj.name}</span> in size <span className="text-gold font-medium">{selectedSize}</span>. Direct UPI Scan & Pay with automated email confirmation.
                  </>
                ) : (
                  <>Instant UPI Scan & Pay (₹400) · Hostel Delivery · Email Confirmation.</>
                )}
              </p>
            </div>

            {/* Product meta */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-xs text-text-muted">
              <p>Category: <span className="text-text-secondary">Official HPL Merchandise</span></p>
              <p>Available Styles: <span className="text-text-secondary">Cricket (Collar) · Football (Without Collar) · Basketball (Sleeveless)</span></p>
              <p>Selected Option: <span className="text-gold font-medium">{selectedStyleObj?.name}</span></p>
              <p>Sizes available: <span className="text-text-secondary">S · M · L · XL · XXL · 2XL · 3XL</span></p>
            </div>
          </motion.div>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          product={product}
          selectedStyle={selectedStyleObj}
          selectedSize={selectedSize}
        />

        {/* ====== MORE FROM THIS TEAM ====== */}
        {moreFromTeam.length > 0 && (
          <SectionReveal className="mt-16 sm:mt-24">
            <h2 className="text-2xl sm:text-3xl text-text-primary mb-8">
              More from{' '}
              <span style={{ color: teamColor }}>
                {product.team?.name}
              </span>
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              {moreFromTeam.map((p, i) => (
                <div
                  key={p.id}
                  className="flex-shrink-0 w-[220px] sm:w-[260px] snap-start"
                >
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </SectionReveal>
        )}
      </div>
    </div>
  );
}
