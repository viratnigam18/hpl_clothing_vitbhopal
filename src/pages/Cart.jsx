import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectTotalAmount } from '@/store/cartStore';
import { formatPrice } from '@/data/mockData';
import { PAYMENT_CONFIG, createOrder } from '@/lib/orders';
import MagneticButton from '@/components/MagneticButton';
import SectionReveal from '@/components/SectionReveal';

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalAmount = useCartStore(selectTotalAmount);

  const [phase, setPhase] = useState('cart'); // 'cart' | 'details' | 'payment'
  const [formData, setFormData] = useState({
    buyerName: '',
    hostelBlock: '',
    roomNo: '',
    phone: '',
    email: '',
    utrNumber: '',
  });
  const [copiedField, setCopiedField] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isFormValid =
    formData.buyerName.trim() &&
    formData.hostelBlock.trim() &&
    formData.roomNo.trim() &&
    formData.phone.trim().length >= 10 &&
    formData.email.trim().includes('@');

  const handleProceedToPayment = () => {
    if (!isFormValid) {
      setError('Please fill all required fields correctly (Name, Hostel, Room, Phone, and Email).');
      return;
    }
    setError('');
    setPhase('payment');
  };

  const handleFinalOrderSubmit = async (e) => {
    e.preventDefault();
    if (!formData.utrNumber.trim()) {
      setError('Please enter the 12-digit UPI UTR / Transaction ID from your payment.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const order = await createOrder({
        buyerName: formData.buyerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        hostelBlock: formData.hostelBlock.trim(),
        roomNo: formData.roomNo.trim(),
        utrNumber: formData.utrNumber.trim(),
        totalAmount: totalAmount / 100,
        items: items.map((i) => ({
          productName: i.name,
          teamName: i.team?.name || 'HPL',
          style: i.style || 'Jersey',
          size: i.size || 'M',
          price: i.price / 100,
          qty: i.qty,
        })),
      });

      clearCart();
      navigate(`/order-confirmation/${order.orderNumber}`, {
        state: { order },
      });
    } catch (err) {
      console.error('Failed to create cart order:', err);
      setError('Failed to record order. Please try again.');
    } finally {
      setProcessing(false);
    }
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

  const finalRupees = totalAmount / 100;
  const upiIntentUrl = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(
    PAYMENT_CONFIG.accountHolder
  )}&am=${finalRupees}&cu=INR&tn=${encodeURIComponent('HPL Merchandise Order')}`;

  return (
    <div className="py-8 sm:py-12">
      <div className="container-hpl max-w-4xl">
        <SectionReveal>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl text-text-primary">
              {phase === 'cart' && <span className="text-gradient-gold">Your Cart</span>}
              {phase === 'details' && <span className="text-gradient-gold">Student Details</span>}
              {phase === 'payment' && <span className="text-gradient-gold">UPI Payment (₹{finalRupees})</span>}
            </h1>
            {phase !== 'cart' && (
              <button
                onClick={() => setPhase(phase === 'payment' ? 'details' : 'cart')}
                className="text-xs text-text-muted hover:text-gold uppercase tracking-wider font-semibold transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        </SectionReveal>

        <AnimatePresence mode="wait">
          {/* Phase 1: CART LIST */}
          {phase === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-4 p-4 rounded-xl bg-bg-card border border-white/5 items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-20 rounded-md overflow-hidden bg-bg-elevated flex-shrink-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{item.name}</h3>
                        <p className="text-xs text-text-muted mt-0.5">
                          {item.style && <span className="text-gold font-medium mr-2">{item.style}</span>}
                          Size: {item.size}
                        </p>
                        <p className="text-gold font-bold text-sm mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border border-white/10 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQty(item.variantId, item.qty - 1)}
                          className="text-text-muted hover:text-gold px-1"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold px-2">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.variantId, item.qty + 1)}
                          className="text-text-muted hover:text-gold px-1"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-text-muted hover:text-red-400 p-2 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-bg-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-text-muted text-xs uppercase tracking-wider block">Total Amount</span>
                  <span className="font-heading text-3xl text-gold">{formatPrice(totalAmount)}</span>
                </div>
                <MagneticButton
                  variant="primary"
                  onClick={() => setPhase('details')}
                  className="w-full sm:w-auto px-8 py-3"
                >
                  Proceed to Checkout →
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* Phase 2: STUDENT DETAILS */}
          {phase === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto p-6 rounded-2xl bg-bg-card border border-white/10 space-y-4"
            >
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  name="buyerName"
                  type="text"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@vitbhopal.ac.in"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit number"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Hostel Block *
                  </label>
                  <input
                    name="hostelBlock"
                    type="text"
                    value={formData.hostelBlock}
                    onChange={handleInputChange}
                    placeholder="e.g. Block 1"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Room No *
                  </label>
                  <input
                    name="roomNo"
                    type="text"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    placeholder="e.g. 314"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:border-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <MagneticButton
                  variant="primary"
                  className="w-full"
                  onClick={handleProceedToPayment}
                >
                  Continue to UPI Payment (₹{finalRupees}) →
                </MagneticButton>
              </div>
            </motion.div>
          )}

          {/* Phase 3: UPI PAYMENT */}
          {phase === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto p-6 rounded-2xl bg-bg-card border border-gold/30 space-y-5"
            >
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* QR Section */}
              <div className="flex flex-col items-center text-center p-5 rounded-xl bg-bg-elevated border border-white/10">
                <span className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">
                  Indian Bank · Scan & Pay
                </span>

                <div className="w-56 h-56 rounded-xl overflow-hidden bg-white p-2 border-2 border-gold/40 mb-3 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                  <img
                    src={PAYMENT_CONFIG.qrImageUrl}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <a
                  href={upiIntentUrl}
                  className="sm:hidden w-full py-2.5 rounded-lg bg-gold text-bg text-xs font-semibold uppercase tracking-wider mb-3 block"
                >
                  ⚡ Open in UPI App (Pay ₹{finalRupees})
                </a>

                <div className="w-full flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs">
                  <div className="text-left">
                    <span className="text-[10px] text-text-muted uppercase block">UPI ID</span>
                    <span className="font-mono text-gold font-medium">{PAYMENT_CONFIG.upiId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(PAYMENT_CONFIG.upiId, 'upiId')}
                    className="px-3 py-1 rounded bg-white/10 text-text-primary text-[11px]"
                  >
                    {copiedField === 'upiId' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-3.5 rounded-xl bg-bg-elevated border border-white/5 text-xs grid grid-cols-2 gap-2 text-text-secondary">
                <div>
                  <span className="text-[10px] text-text-muted block">Account Holder</span>
                  <span className="font-medium text-text-primary">{PAYMENT_CONFIG.accountHolder}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Bank</span>
                  <span className="font-medium text-text-primary">{PAYMENT_CONFIG.bankName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">Account No</span>
                  <span className="font-mono font-medium text-gold">{PAYMENT_CONFIG.accountNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block">IFSC Code</span>
                  <span className="font-mono font-medium text-gold">{PAYMENT_CONFIG.ifscCode}</span>
                </div>
              </div>

              {/* UTR Input */}
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                  12-Digit UPI Transaction / UTR ID *
                </label>
                <input
                  name="utrNumber"
                  type="text"
                  value={formData.utrNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 431289567123"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-gold/40 text-text-primary text-sm font-mono focus:border-gold focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPhase('details')}
                  className="px-4 py-2.5 rounded-lg border border-white/10 text-text-secondary hover:text-text-primary text-xs uppercase tracking-wider"
                >
                  ← Back
                </button>
                <div className="flex-1">
                  <MagneticButton
                    variant="primary"
                    className="w-full"
                    onClick={handleFinalOrderSubmit}
                    disabled={processing}
                  >
                    {processing ? 'Confirming...' : `Confirm & Place Order (₹${finalRupees}) →`}
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
