import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';
import SectionReveal from '@/components/SectionReveal';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  // Build WhatsApp share link
  const whatsappText = encodeURIComponent(
    `🏆 Just ordered from HPL Clothing!\n\nOrder #${orderNumber}\n\nCheck out the merch: ${window.location.origin}/shop`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="container-hpl max-w-lg">
        <SectionReveal>
          <div className="text-center">
            {/* Success checkmark */}
            <motion.div
              className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            >
              <motion.svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl text-text-primary mb-3">
              Order <span className="text-gradient-gold">Confirmed!</span>
            </h1>

            <p className="text-text-secondary mb-2">
              Thank you for your order
            </p>

            <div className="inline-block px-4 py-2 rounded-lg bg-bg-card border border-gold/10 mb-8">
              <p className="text-text-muted text-xs uppercase tracking-wider">
                Order Number
              </p>
              <p className="text-gold font-heading text-xl mt-0.5">
                {orderNumber}
              </p>
            </div>

            <p className="text-text-secondary text-sm mb-8 max-w-md mx-auto">
              Your order has been placed successfully. You'll receive a confirmation on WhatsApp/email shortly. Pick up your merch at the designated collection point.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
