import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectTotalAmount } from '@/store/cartStore';
import { formatPrice } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import MagneticButton from '@/components/MagneticButton';
import SectionReveal from '@/components/SectionReveal';

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalAmount = useCartStore(selectTotalAmount);

  const [phase, setPhase] = useState('cart'); // 'cart' | 'checkout'
  const [formData, setFormData] = useState({
    buyerName: '',
    hostelBlock: '',
    roomNo: '',
    phone: '',
    email: '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid =
    formData.buyerName.trim() &&
    formData.hostelBlock.trim() &&
    formData.roomNo.trim() &&
    formData.phone.trim().length >= 10;

  // TODO: Replace GOOGLE_FORM_URL with your actual Google Form link when ready
  const GOOGLE_FORM_URL = 'https://forms.google.com/REPLACE_WITH_YOUR_FORM_LINK';

  const handlePayment = () => {
    if (!isFormValid) return;
    // Build a prefilled query string so cart details carry over to the form
    const params = new URLSearchParams({
      'entry.name': formData.buyerName,
      'entry.block': formData.hostelBlock,
      'entry.room': formData.roomNo,
      'entry.phone': formData.phone,
      'entry.email': formData.email,
      'entry.items': items.map((i) => `${i.name} (${i.size}) x${i.qty}`).join(', '),
      'entry.total': formatPrice(totalAmount),
    });
    // Open the Google Form in a new tab
    window.open(`${GOOGLE_FORM_URL}?${params.toString()}`, '_blank');
  };

  if (items.length === 0 && phase === 'cart') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-20">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-text-muted/20">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <h2 className="text-2xl text-text-primary font-heading">Cart is Empty</h2>
        <p className="text-text-muted text-sm">Add some merch to get started</p>
        <MagneticButton variant="secondary" onClick={() => navigate('/shop')}>
          Browse Shop
        </MagneticButton>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container-hpl max-w-4xl">
        <SectionReveal>
          <h1 className="text-3xl sm:text-4xl text-text-primary mb-8">
            {phase === 'cart' ? (
              <span className="text-gradient-gold">Your Cart</span>
            ) : (
              <span className="text-gradient-gold">Checkout</span>
            )}
          </h1>
        </SectionReveal>

        <AnimatePresence mode="wait">
          {phase === 'cart' ? (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Cart Items */}
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-4 p-4 rounded-xl bg-bg-card border border-white/5"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-bg-elevated flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary font-semibold text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-text-muted text-xs mt-0.5">
                        Size: {item.size}
                      </p>
                      <p className="text-gold font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        className="text-text-muted hover:text-red-400 text-xs transition-colors"
                        onClick={() => removeItem(item.variantId)}
                      >
                        Remove
                      </button>
                      <div className="flex items-center rounded-lg border border-white/10">
                        <button
                          className="px-3 py-1 text-sm text-text-secondary hover:text-gold transition-colors"
                          onClick={() => updateQty(item.variantId, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm text-text-primary min-w-[32px] text-center">
                          {item.qty}
                        </span>
                        <button
                          className="px-3 py-1 text-sm text-text-secondary hover:text-gold transition-colors"
                          onClick={() => updateQty(item.variantId, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Proceed */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl bg-bg-card border border-gold/10">
                <div>
                  <p className="text-text-muted text-sm">Total</p>
                  <p className="text-gold font-heading text-3xl">
                    {formatPrice(totalAmount)}
                  </p>
                </div>
                <MagneticButton
                  variant="primary"
                  onClick={() => setPhase('checkout')}
                  id="proceed-checkout"
                >
                  Proceed to Checkout
                </MagneticButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <button
                className="text-text-muted text-sm hover:text-gold transition-colors mb-6 flex items-center gap-1"
                onClick={() => setPhase('cart')}
              >
                ← Back to cart
              </button>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Form */}
                <div className="md:col-span-3 space-y-5">
                  <h2 className="text-lg text-text-primary font-semibold mb-4">
                    Delivery Details
                  </h2>

                  <div>
                    <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      name="buyerName"
                      type="text"
                      value={formData.buyerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold/40 focus:outline-none transition-colors"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">
                        Hostel Block *
                      </label>
                      <input
                        name="hostelBlock"
                        type="text"
                        value={formData.hostelBlock}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold/40 focus:outline-none transition-colors"
                        placeholder="e.g. Block A"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">
                        Room No *
                      </label>
                      <input
                        name="roomNo"
                        type="text"
                        value={formData.roomNo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold/40 focus:outline-none transition-colors"
                        placeholder="e.g. 204"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">
                      Phone *
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold/40 focus:outline-none transition-colors"
                      placeholder="10-digit phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-text-secondary text-xs uppercase tracking-wider mb-1.5">
                      Email <span className="text-text-muted">(optional)</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold/40 focus:outline-none transition-colors"
                      placeholder="For order receipt"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-lg">
                      {error}
                    </p>
                  )}

                  <MagneticButton
                    variant="primary"
                    className="w-full mt-4"
                    onClick={handlePayment}
                    disabled={!isFormValid}
                    id="pay-now-btn"
                  >
                    Place Order via Google Form →
                  </MagneticButton>

                  <p className="text-text-muted text-xs text-center">
                    You'll be redirected to our Google Form to complete your order.
                  </p>
                </div>

                {/* Order Summary Sidebar */}
                <div className="md:col-span-2">
                  <div className="rounded-xl bg-bg-card border border-white/5 p-5 sticky top-20">
                    <h3 className="text-text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
                      Order Summary
                    </h3>
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.variantId} className="flex justify-between text-sm">
                          <span className="text-text-secondary truncate mr-2">
                            {item.name} ({item.size}) × {item.qty}
                          </span>
                          <span className="text-text-primary flex-shrink-0">
                            {formatPrice(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/5 pt-3 flex justify-between">
                      <span className="text-text-secondary font-semibold">Total</span>
                      <span className="text-gold font-heading text-xl">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
