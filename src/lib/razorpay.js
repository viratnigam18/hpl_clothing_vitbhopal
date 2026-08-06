/**
 * Opens Razorpay Checkout with UPI as the default/first payment method.
 * Requires the checkout.js script to be loaded in index.html.
 */
export function openRazorpayCheckout({
  orderId,
  amount,
  buyerName,
  phone,
  email,
  onSuccess,
  onFailure,
}) {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount,
    currency: 'INR',
    name: 'HPL Clothing',
    description: 'HPL Merch Order',
    order_id: orderId,
    prefill: {
      name: buyerName,
      contact: phone,
      ...(email && { email }),
    },
    config: {
      display: {
        blocks: {
          upi: {
            name: 'Pay via UPI',
            instruments: [{ method: 'upi' }],
          },
          other: {
            name: 'Other Methods',
            instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }],
          },
        },
        sequence: ['block.upi', 'block.other'],
        preferences: { show_default_blocks: false },
      },
    },
    handler: (response) => {
      onSuccess?.({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
    modal: {
      ondismiss: () => {
        onFailure?.('Payment cancelled by user');
      },
    },
    theme: {
      color: '#d4af37',
      backdrop_color: 'rgba(10, 10, 10, 0.85)',
    },
  };

  if (window.Razorpay) {
    const rzp = new window.Razorpay(options);
    rzp.open();
  } else {
    console.error('Razorpay script not loaded');
    onFailure?.('Payment gateway not available');
  }
}
