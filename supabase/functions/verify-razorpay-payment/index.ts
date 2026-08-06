// supabase/functions/verify-razorpay-payment/index.ts
// Edge Function: Verifies Razorpay payment signature and marks order as paid

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify HMAC SHA256 signature
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(RAZORPAY_KEY_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    if (expectedSignature !== razorpaySignature) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Signature valid — mark order as paid
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id: razorpayPaymentId,
      })
      .eq('razorpay_order_id', razorpayOrderId)
      .select('order_number')
      .single()

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, orderNumber: order.order_number }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('verify-razorpay-payment error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Verification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
