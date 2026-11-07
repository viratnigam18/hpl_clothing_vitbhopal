import { supabase, isSupabaseConfigured } from './supabase';

export const PAYMENT_CONFIG = {
  accountHolder: 'Hostel Events',
  bankName: 'Indian Bank',
  accountNumber: '8356607807',
  ifscCode: 'IDIB000V143',
  upiId: 'hplevents1@indianbk',
  qrImageUrl: '/images/payment/upi_qr.jpg',
  jerseyPrice: 400, // ₹400
};

const STORAGE_KEY = 'hpl_orders_v1';

/**
 * Generate a clean order reference number
 */
export function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HPL-${timestamp}-${random}`;
}

/**
 * Retrieve all stored orders
 */
export function getAllOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read orders from storage:', err);
    return [];
  }
}

/**
 * Retrieve a specific order by orderNumber
 */
export function getOrderByNumber(orderNumber) {
  if (!orderNumber) return null;
  const orders = getAllOrders();
  return orders.find((o) => o.orderNumber === orderNumber) || null;
}

/**
 * Save a new order (stores in localStorage and Supabase if configured)
 */
export async function createOrder(orderPayload) {
  const orderNumber = orderPayload.orderNumber || generateOrderNumber();

  const newOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    orderNumber,
    createdAt: new Date().toISOString(),
    status: 'payment_submitted',
    paymentMethod: 'UPI',
    totalAmount: orderPayload.totalAmount || PAYMENT_CONFIG.jerseyPrice,
    customer: {
      name: orderPayload.buyerName || '',
      email: orderPayload.email || '',
      phone: orderPayload.phone || '',
      regNo: orderPayload.regNo || '',
      hostelBlock: orderPayload.hostelBlock || '',
      roomNo: orderPayload.roomNo || '',
    },
    items: orderPayload.items || [
      {
        productName: orderPayload.productName || 'HPL Jersey',
        teamName: orderPayload.teamName || 'HPL',
        style: orderPayload.style || 'Cricket Jersey (Collar)',
        size: orderPayload.size || 'L',
        price: orderPayload.price || PAYMENT_CONFIG.jerseyPrice,
        qty: orderPayload.qty || 1,
      },
    ],
    paymentDetails: {
      upiId: PAYMENT_CONFIG.upiId,
      utrNumber: orderPayload.utrNumber || '',
      screenshotUrl: orderPayload.screenshotUrl || null,
      accountHolder: PAYMENT_CONFIG.accountHolder,
      bankName: PAYMENT_CONFIG.bankName,
    },
  };

  // 1. Save to local storage for instant offline / client persistence
  try {
    const currentOrders = getAllOrders();
    currentOrders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentOrders));
  } catch (err) {
    console.warn('Failed to store order with screenshot in localStorage:', err);
    // Safe Fallback: if localStorage is full, strip screenshotUrl so customer order data is never lost
    try {
      const sanitizedOrder = {
        ...newOrder,
        paymentDetails: {
          ...newOrder.paymentDetails,
          screenshotUrl: null,
        },
      };
      const currentOrders = getAllOrders();
      currentOrders.unshift(sanitizedOrder);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentOrders));
    } catch (fallbackErr) {
      console.error('LocalStorage quota completely full, could not persist locally:', fallbackErr);
    }
  }

  // 2. Save to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').insert([
        {
          order_number: newOrder.orderNumber,
          buyer_name: newOrder.customer.name,
          hostel_block: newOrder.customer.hostelBlock,
          room_no: newOrder.customer.roomNo,
          phone: newOrder.customer.phone,
          email: newOrder.customer.email,
          total_amount: newOrder.totalAmount * 100, // store in paise
          status: 'pending_verification',
        },
      ]);
    } catch (sbErr) {
      console.warn('Supabase sync skipped/failed:', sbErr);
    }
  }

  // 3. Emit custom event for future email automation hooks
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('hpl:new_order', {
        detail: newOrder,
      })
    );
  }

  return newOrder;
}

