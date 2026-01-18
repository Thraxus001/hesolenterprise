import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { amount, phoneNumber, accountReference = "Hesol" } = await req.json()

        // 1. Get Access Token
        const consumerKey = Deno.env.get('6e5gjkw0fgygBeXYRAL9YgVgHrgLwBAfNliHJuKZcGLnMCpL')
        const consumerSecret = Deno.env.get('PGzwF8a3FEF7WR8gjCKqddGyDRWiSbxMp3GfYcz8798Bb18iJEcwrESx79JnmYFm')
        const passkey = Deno.env.get('MPESA_PASSKEY')
        const shortcode = Deno.env.get('MPESA_SHORTCODE') // Business Shortcode (Paybill/Till)
        const callbackUrl = Deno.env.get('MPESA_CALLBACK_URL') // Edge Function URL for callback

        if (!consumerKey || !consumerSecret || !passkey || !shortcode || !callbackUrl) {
            throw new Error('Missing M-Pesa Environment Variables')
        }

        const auth = btoa(`${consumerKey}:${consumerSecret}`)
        const tokenResp = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { 'Authorization': `Basic ${auth}` }
        })
        const { access_token } = await tokenResp.json()

        if (!access_token) throw new Error('Failed to get M-Pesa Access Token')

        // 2. Prepare STK Push
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14) // YYYYMMDDHHmmss
        const password = btoa(`${shortcode}${passkey}${timestamp}`)

        const stkPayload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline", // Or CustomerBuyGoodsOnline
            Amount: amount, // Ensure this is a whole number if needed
            PartyA: phoneNumber, // Phone sending money
            PartyB: shortcode,   // Shortcode receiving money
            PhoneNumber: phoneNumber,
            CallBackURL: callbackUrl,
            AccountReference: accountReference,
            TransactionDesc: "Order Payment"
        }

        // 3. Send STK Push
        const stkResp = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stkPayload)
        })

        const stkData = await stkResp.json()

        return new Response(
            JSON.stringify(stkData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
