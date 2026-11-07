import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOrderByNumber } from '@/lib/orders';
import MagneticButton from '@/components/MagneticButton';
import SectionReveal from '@/components/SectionReveal';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order && orderNumber) {
      const found = getOrderByNumber(orderNumber);
      if (found) setOrder(found);
    }
  }, [order, orderNumber]);

  // Build WhatsApp share link
  const itemSummary = order?.items?.map((i) => `${i.productName} (${i.style}, Size ${i.size})`).join(', ') || 'Official HPL Jersey';
  const whatsappText = encodeURIComponent(
    `🏆 Just ordered my HPL Official Jersey!\n\nOrder #${orderNumber}\nItem: ${itemSummary}\nAmount: ₹${order?.totalAmount || 400}\n\nCheck out HPL Clothing: ${window.location.origin}/shop`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 sm:py-16">
      <div className="container-hpl max-w-2xl">
        <SectionReveal>
          <div className="text-center">
            {/* Success checkmark */}
            <motion.div
              className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.25)]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
            >
              <motion.svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl text-text-primary mb-2">
              Payment & Order <span className="text-gradient-gold">Confirmed!</span>
            </h1>

            <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
              Thank you for ordering. Your payment verification is received and your jersey has been booked.
            </p>

            {/* Order Number Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-card border border-gold/30 mb-8 shadow-sm">
              <span className="text-text-muted text-xs uppercase tracking-wider">
                Order Ref:
              </span>
              <span className="text-gold font-mono font-bold text-base sm:text-lg">
                {orderNumber}
              </span>
            </div>

            {/* Order Details Receipt Card */}
            {order && (
              <div className="text-left p-5 sm:p-6 rounded-2xl bg-bg-card border border-white/10 shadow-xl mb-8 space-y-5">
                {/* Header of Receipt */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider">
                      Student / Buyer
                    </p>
                    <p className="font-semibold text-text-primary text-base">
                      {order.customer?.name}
                    </p>
                    {order.customer?.regNo && (
                      <p className="text-xs text-text-muted">
                        Reg No: {order.customer.regNo}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted uppercase tracking-wider">
                      Delivery Location
                    </p>
                    <p className="font-semibold text-text-primary text-sm">
                      {order.customer?.hostelBlock}
                    </p>
                    <p className="text-xs text-text-muted">
                      Room {order.customer?.roomNo}
                    </p>
                  </div>
                </div>

                {/* Items Purchased */}
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2.5">
                    Order Items
                  </p>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated/70 border border-white/5 text-sm"
                      >
                        <div>
                          <p className="font-semibold text-text-primary">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                            <span className="text-gold font-medium">{item.style}</span>
                            <span>•</span>
                            <span className="text-text-secondary font-medium">Size: {item.size}</span>
                            <span>•</span>
                            <span>Qty: {item.qty}</span>
                          </div>
                        </div>
                        <span className="font-heading text-lg text-gold">
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-text-secondary">
                    <span>Payment Method:</span>
                    <span className="text-text-primary font-medium">
                      UPI (Indian Bank · Hostel Events)
                    </span>
                  </div>
                  {order.paymentDetails?.utrNumber && (
                    <div className="flex justify-between text-text-secondary">
                      <span>UPI UTR / Transaction ID:</span>
                      <span className="font-mono text-gold font-medium">
                        {order.paymentDetails.utrNumber}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Confirmation Email:</span>
                    <span className="text-text-primary font-medium">
                      {order.customer?.email}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>WhatsApp / Contact:</span>
                    <span className="text-text-primary font-medium">
                      {order.customer?.phone}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-primary font-semibold text-sm pt-2 border-t border-white/5">
                    <span>Total Amount Paid:</span>
                    <span className="font-heading text-xl text-gold">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Email Automation Notice */}
                <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 flex items-start gap-3">
                  <span className="text-lg">📧</span>
                  <div className="text-xs">
                    <p className="font-semibold text-gold">
                      Email Confirmation Queued
                    </p>
                    <p className="text-text-secondary mt-0.5 leading-relaxed">
                      Your order details have been recorded for automated email confirmation to{' '}
                      <span className="text-text-primary font-medium underline">
                        {order.customer?.email}
                      </span>. Merch distribution updates will be shared via email and WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Delivery Timeline & Policy Notice */}
                <div className="p-3.5 rounded-xl bg-bg-elevated border border-white/10 flex items-start gap-3 text-xs">
                  <span className="text-lg">⏳</span>
                  <div>
                    <p className="font-semibold text-text-primary">
                      Delivery & Fulfillment Notice
                    </p>
                    <p className="text-text-secondary mt-0.5 leading-relaxed text-[11px]">
                      Your payment will be verified and your jersey sent for custom printing. Delivery takes <strong className="text-gold font-bold">at least 7–10 days</strong> to be verified and delivered to your hostel room. Orders follow our strict <strong className="text-text-primary">No Refund & No Return</strong> policy.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <MagneticButton
                variant="primary"
                onClick={() => window.open(whatsappUrl, '_blank')}
                id="share-whatsapp"
              >
                <span className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share on WhatsApp
                </span>
              </MagneticButton>

              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-gold/40 text-text-secondary hover:text-gold text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                🖨️ Print / Save Receipt
              </button>

              <MagneticButton
                variant="secondary"
                onClick={() => navigate('/shop')}
                id="continue-shopping"
              >
                Continue Shopping
              </MagneticButton>
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
