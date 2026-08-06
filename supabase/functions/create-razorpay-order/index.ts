// supabase/functions/create-razorpay-order/index.ts
// Edge Function: Creates a Razorpay order and inserts pending order into DB

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, buyerName, hostelBlock, roomNo, phone, email } = await req.json()

    if (!items?.length || !buyerName || !phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role to bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Validate items and calculate total from DB (prevent price tampering)
    let totalAmount = 0
    const validatedItems: Array<{ variantId: string; qty: number; unitPrice: number }> = []

    for (const item of items) {
      const { data: variant } = await supabase
        .from('product_variants')
        .select('id, size, stock_qty, product:products(price)')
        .eq('id', item.variantId)
        .single()

      if (!variant || variant.stock_qty < item.qty) {
        return new Response(
          JSON.stringify({ error: `Item ${item.variantId} is out of stock or invalid` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const unitPrice = (variant as any).product.price
      totalAmount += unitPrice * item.qty
      validatedItems.push({ variantId: item.variantId, qty: item.qty, unitPrice })
    }

    // Create Razorpay order
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
      },
      body: JSON.stringify({
        amount: totalAmount, // already in paise
        currency: 'INR',
        receipt: `hpl_${Date.now()}`,
      }),
    })

    const razorpayOrder = await razorpayRes.json()
    if (!razorpayOrder.id) {
      throw new Error('Failed to create Razorpay order')
    }

    // Generate order number
    const orderNumber = `HPL-${Date.now().toString(36).toUpperCase()}`

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        buyer_name: buyerName,
        hostel_block: hostelBlock,
        room_no: roomNo,
        phone,
        email: email || null,
        status: 'pending',
        razorpay_order_id: razorpayOrder.id,
        total_amount: totalAmount,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = validatedItems.map((item) => ({
      order_id: order.id,
      product_variant_id: item.variantId,
      qty: item.qty,
      unit_price: item.unitPrice,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return new Response(
      JSON.stringify({
        razorpayOrderId: razorpayOrder.id,
        orderNumber,
        amount: totalAmount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('create-razorpay-order error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
