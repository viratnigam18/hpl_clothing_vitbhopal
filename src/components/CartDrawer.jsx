import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore, selectTotalAmount } from '@/store/cartStore';
import { formatPrice } from '@/data/mockData';
import MagneticButton from './MagneticButton';

/**
 * CartDrawer — slide-in side panel showing cart contents.
 */
export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const totalAmount = useCartStore(selectTotalAmount);

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-bg-card border-l border-gold/10 z-[201] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="font-heading text-xl text-gold tracking-wider">
                YOUR CART
              </h2>
              <button
                className="text-text-muted hover:text-text-primary transition-colors p-1"
                onClick={onClose}
                aria-label="Close cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-text-muted">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p className="text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.variantId}
                    className="flex gap-4 p-3 rounded-lg bg-bg-elevated border border-white/5"
                    layout
                    exit={{ opacity: 0, x: 50 }}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 rounded-md overflow-hidden bg-bg flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Size: {item.size}
                      </p>
                      <p className="text-gold font-semibold text-sm mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Qty + Remove */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center rounded-md border border-white/10 overflow-hidden">
                          <button
                            className="px-2 py-0.5 text-xs text-text-secondary hover:text-gold hover:bg-white/5 transition-colors"
                            onClick={() => updateQty(item.variantId, item.qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-2 py-0.5 text-xs text-text-primary min-w-[24px] text-center">
                            {item.qty}
                          </span>
                          <button
                            className="px-2 py-0.5 text-xs text-text-secondary hover:text-gold hover:bg-white/5 transition-colors"
                            onClick={() => updateQty(item.variantId, item.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-text-muted hover:text-red-400 transition-colors"
                          onClick={() => removeItem(item.variantId)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer — Total + Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Total</span>
                  <span className="text-gold font-heading text-2xl">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <MagneticButton
                  variant="primary"
                  className="w-full"
                  onClick={handleCheckout}
                  id="cart-checkout-btn"
                >
                  Checkout
                </MagneticButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
