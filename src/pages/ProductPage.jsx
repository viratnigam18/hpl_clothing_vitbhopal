import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct } from '@/hooks/useProduct';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/mockData';
import ImageGallery from '@/components/ImageGallery';
import SizePicker from '@/components/SizePicker';
import MagneticButton from '@/components/MagneticButton';
import ProductCard from '@/components/ProductCard';
import SectionReveal from '@/components/SectionReveal';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(slug);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState(null);
  const [addedFeedback, setAddedFeedback] = useState(false);

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
  const canAdd = selectedVariant && selectedVariant.stock_qty > 0;
  const teamColor = product.team?.color_hex || '#d4af37';

  const handleAddToCart = () => {
    if (!canAdd) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedSize,
      price: product.price,
      qty: 1,
      image: product.images?.[0]?.url || '',
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageGallery images={product.images || []} />
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
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Picker */}
            <div className="mb-6">
              <p className="text-text-primary text-sm font-semibold mb-3 uppercase tracking-wider">
                Select Size
              </p>
              <SizePicker
                variants={product.variants || []}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
              {!selectedSize && (
                <p className="text-text-muted text-xs mt-2">
                  Please select a size
                </p>
              )}
            </div>

            {/* Add to Cart */}
            <div className="mt-auto">
              <MagneticButton
                variant="primary"
                className="w-full sm:w-auto"
                onClick={handleAddToCart}
                disabled={!canAdd}
                id="product-add-to-cart"
              >
                {addedFeedback
                  ? '✓ Added to Cart'
                  : !selectedSize
                    ? 'Select a Size'
                    : selectedVariant?.stock_qty === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'
                }
              </MagneticButton>
            </div>

            {/* Product meta */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-xs text-text-muted">
              <p>Type: <span className="text-text-secondary capitalize">{product.type}</span></p>
              <p>Category: <span className="text-text-secondary">Official HPL Merchandise</span></p>
            </div>
          </motion.div>
        </div>

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
