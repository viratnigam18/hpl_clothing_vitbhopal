import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PAYMENT_CONFIG, createOrder } from '@/lib/orders';
import MagneticButton from './MagneticButton';

export default function PaymentModal({
  isOpen,
  onClose,
  product,
  selectedStyle,
  selectedSize,
}) {
  const navigate = useNavigate();

  // Wizard step: 'details' | 'payment'
  const [step, setStep] = useState('details');

  // Form state
  const [formData, setFormData] = useState({
    buyerName: '',
    email: '',
    phone: '',
    regNo: '',
    hostelBlock: '',
    roomNo: '',
    utrNumber: '',
  });

  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    if (!formData.buyerName.trim()) {
      setErrorMsg('Please enter your full name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address for order confirmation');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp/phone number');
      return false;
    }
    if (!formData.hostelBlock.trim() || !formData.roomNo.trim()) {
      setErrorMsg('Please enter your Hostel Block and Room Number');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep('payment');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.utrNumber.trim()) {
      setErrorMsg('Please enter the 12-digit UPI Transaction / UTR number from your payment app');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Please accept the Terms & Conditions: No Refund/Return policy and 7–10 days delivery timeline.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const styleName = selectedStyle?.name || 'Standard';
      const order = await createOrder({
        buyerName: formData.buyerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        regNo: formData.regNo.trim(),
        hostelBlock: formData.hostelBlock.trim(),
        roomNo: formData.roomNo.trim(),
        utrNumber: formData.utrNumber.trim(),
        screenshotUrl: screenshotPreview,
        productName: product?.name || 'HPL Jersey',
        teamName: product?.team?.name || 'HPL',
        style: styleName,
        size: selectedSize || 'M',
        price: PAYMENT_CONFIG.jerseyPrice,
        totalAmount: PAYMENT_CONFIG.jerseyPrice,
      });

      onClose();
      navigate(`/order-confirmation/${order.orderNumber}`, {
        state: { order },
      });
    } catch (err) {
      console.error('Order creation failed:', err);
      setErrorMsg('Failed to record order. Please try again or reach out to support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const upiIntentUrl = `upi://pay?pa=${PAYMENT_CONFIG.upiId}&pn=${encodeURIComponent(
    PAYMENT_CONFIG.accountHolder
  )}&am=${PAYMENT_CONFIG.jerseyPrice}&cu=INR&tn=${encodeURIComponent(
    `HPL ${product?.team?.name || ''} Jersey (${selectedSize || 'M'})`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          className="relative w-full max-w-xl md:max-w-3xl lg:max-w-4xl bg-bg-card border border-gold/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-bg-elevated/60">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                HPL Official Merch Checkout
              </p>
              <h2 className="text-xl sm:text-2xl font-heading text-text-primary mt-0.5">
                {step === 'details' ? '1. Student Details' : '2. Scan & Pay via UPI'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors border border-white/10"
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Order Summary Strip */}
          <div className="px-5 py-3 bg-bg-elevated/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: product?.team?.color_hex || '#d4af37' }}
              />
              <span className="font-semibold text-text-primary truncate max-w-[170px] sm:max-w-xs">
                {product?.name}
              </span>
              <span className="text-text-muted">·</span>
              <span className="text-gold font-medium">{selectedStyle?.name}</span>
              <span className="text-text-muted">·</span>
              <span className="px-2 py-0.5 rounded bg-white/5 font-semibold text-text-primary border border-white/10">
                {selectedSize}
              </span>
            </div>
            <div className="font-heading text-lg text-gold flex items-center gap-1.5 ml-auto">
              <span>₹{PAYMENT_CONFIG.jerseyPrice}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-sans font-normal">
                (Fixed Price)
              </span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: DETAILS */}
            {step === 'details' && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="student@vitbhopal.ac.in"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                    <p className="text-[10px] text-text-muted mt-1">
                      Receipt & automated email confirmation will be sent here.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Registration No / Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleInputChange}
                    placeholder="e.g. 23BCE10452"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Hostel Block *
                    </label>
                    <input
                      type="text"
                      name="hostelBlock"
                      value={formData.hostelBlock}
                      onChange={handleInputChange}
                      placeholder="e.g. Block 1 / Block 2 / Girls Hostel"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="roomNo"
                      value={formData.roomNo}
                      onChange={handleInputChange}
                      placeholder="e.g. 314"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-white/10 text-text-primary text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Terms and Delivery Notice */}
                <div className="p-3 rounded-xl bg-gold/10 border border-gold/25 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[11px]">
                    <span>⚠️</span>
                    <span>Terms & Delivery Notice</span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    • <strong className="text-text-primary">No Refund & Return Policy:</strong> Custom printed jerseys cannot be refunded, cancelled, or returned once placed.
                  </p>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    • <strong className="text-text-primary">Delivery Timeline:</strong> It takes <strong className="text-gold">at least 7–10 days</strong> to verify your payment and deliver it to your hostel room.
                  </p>
                </div>

                <div className="pt-2">
                  <MagneticButton
                    variant="primary"
                    className="w-full"
                    type="submit"
                  >
                    Proceed to Payment (₹{PAYMENT_CONFIG.jerseyPrice}) →
                  </MagneticButton>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT WITH QR & UPI */}
            {step === 'payment' && (
              <form onSubmit={handleSubmitOrder} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
                  {/* Left Column (md: 5 cols): QR Code + Bank Details */}
                  <div className="md:col-span-5 space-y-4">
                    {/* QR Section */}
                    <div className="flex flex-col items-center p-4 rounded-xl bg-bg-elevated border border-gold/20 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                          Indian Bank · Scan & Pay
                        </span>
                      </div>

                      {/* QR Image */}
                      <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-xl overflow-hidden bg-white p-2 border-2 border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-2.5">
                        <img
                          src={PAYMENT_CONFIG.qrImageUrl}
                          alt="Hostel Events UPI QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <p className="text-[11px] text-text-muted mb-2.5">
                        Scan with <span className="text-text-primary font-medium">GPay, PhonePe, Paytm, BHIM</span> or UPI app.
                      </p>

                      {/* Mobile Direct Pay Button */}
                      <a
                        href={upiIntentUrl}
                        className="sm:hidden w-full py-2.5 px-4 rounded-lg bg-gold text-bg font-semibold text-xs uppercase tracking-wider text-center mb-2.5 shadow hover:bg-gold-bright transition-colors"
                      >
                        ⚡ Open in UPI App (Pay ₹{PAYMENT_CONFIG.jerseyPrice})
                      </a>

                      {/* Copy UPI ID */}
                      <div className="w-full flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/10 text-xs">
                        <div className="text-left">
                          <span className="text-[9px] text-text-muted uppercase tracking-wider block">
                            UPI ID
                          </span>
                          <span className="font-mono font-semibold text-gold text-[11px] sm:text-xs">
                            {PAYMENT_CONFIG.upiId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(PAYMENT_CONFIG.upiId, 'upiId')}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-gold hover:text-bg text-text-primary text-[10px] sm:text-[11px] font-medium transition-all"
                        >
                          {copiedField === 'upiId' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Bank Account Details */}
                    <div className="p-3 rounded-xl bg-bg-elevated border border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary uppercase tracking-wider text-[10px]">
                          Direct Bank Transfer
                        </span>
                        <span className="text-[10px] text-text-muted">Indian Bank</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-text-secondary pt-1">
                        <div>
                          <span className="text-[9px] text-text-muted block">Account Holder</span>
                          <span className="font-medium text-text-primary text-[11px] truncate block">{PAYMENT_CONFIG.accountHolder}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-text-muted block">Account Number</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-medium text-gold text-[11px]">{PAYMENT_CONFIG.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(PAYMENT_CONFIG.accountNumber, 'acc')}
                              className="text-[9px] text-text-muted hover:text-gold"
                            >
                              {copiedField === 'acc' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] text-text-muted block">IFSC Code</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-gold text-[11px]">{PAYMENT_CONFIG.ifscCode}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(PAYMENT_CONFIG.ifscCode, 'ifsc')}
                              className="text-[9px] text-text-muted hover:text-gold"
                            >
                              {copiedField === 'ifsc' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (md: 7 cols): Verification + Terms + Action */}
                  <div className="md:col-span-7 space-y-4">
                    {/* Verification Fields: UTR and Screenshot */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">
                          UPI UTR / Transaction Reference Number *
                        </label>
                        <input
                          type="text"
                          name="utrNumber"
                          value={formData.utrNumber}
                          onChange={handleInputChange}
                          placeholder="Enter 12-digit UPI reference ID (e.g. 431289567123)"
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-gold/40 text-text-primary text-sm font-mono focus:outline-none focus:border-gold transition-colors"
                        />
                        <p className="text-[10px] text-text-muted mt-1">
                          Find this 12-digit number in Google Pay, PhonePe, or Paytm receipt right after paying.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                          Upload Payment Screenshot (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full text-xs text-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-gold hover:file:bg-gold hover:file:text-bg file:cursor-pointer cursor-pointer"
                        />
                        {screenshotPreview && (
                          <div className="mt-2 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gold/40">
                            <img
                              src={screenshotPreview}
                              alt="Payment screenshot"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms and Conditions & Delivery Disclaimer */}
                    <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[11px]">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>Terms & Conditions / Disclaimer</span>
                      </div>
                      <ul className="space-y-1 text-text-secondary text-[11px] leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-gold font-bold">•</span>
                          <span>
                            <strong className="text-text-primary">No Refund & Return Policy:</strong> Every jersey is customized and made to order. Strictly <strong className="text-text-primary">no refunds, cancellations, or returns</strong> once submitted.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-gold font-bold">•</span>
                          <span>
                            <strong className="text-text-primary">Delivery Timeline:</strong> Takes <strong className="text-gold font-bold">at least 7–10 days</strong> to verify your UPI payment and deliver to your hostel room.
                          </span>
                        </li>
                      </ul>

                      <label className="flex items-start gap-2.5 pt-2 border-t border-gold/20 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => {
                            setTermsAccepted(e.target.checked);
                            if (errorMsg) setErrorMsg('');
                          }}
                          className="mt-0.5 w-4 h-4 rounded border-gold/40 bg-bg text-gold focus:ring-gold accent-[#d4af37]"
                        />
                        <span className="text-[11px] text-text-primary font-medium">
                          I agree to the <strong className="text-gold">No Refund/Return</strong> policy and acknowledge delivery takes <strong className="text-gold">at least 7–10 days</strong>.
                        </span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep('details')}
                        className="px-4 py-3 rounded-lg border border-white/10 hover:border-white/20 text-text-secondary hover:text-text-primary text-xs uppercase tracking-wider font-semibold transition-colors"
                      >
                        ← Back
                      </button>

                      <div className="flex-1">
                        <MagneticButton
                          variant="primary"
                          className="w-full text-sm sm:text-base py-3"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Confirming Order...' : 'Confirm & Place Order →'}
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

