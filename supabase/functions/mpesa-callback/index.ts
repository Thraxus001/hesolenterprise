import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        const body = await req.json()
        console.log("M-Pesa Callback Received:", JSON.stringify(body))

        const { Body: { stkCallback } } = body
        const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback

        // Initialize Supabase Admin Client (needs service_role key to update orders securely)
        const supabaseUrl = Deno.env.get('https://paxnqyuzuxgktqlnlqxi.supabase.co')
        const supabaseKey = Deno.env.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBheG5xeXV6dXhna3RxbG5scXhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU4NzM5MCwiZXhwIjoyMDgzMTYzMzkwfQ.VSmepQhDLt5qoy0QsLgOCXiSokJFBWXtwuNelBZAlMU')
        const supabase = createClient(supabaseUrl!, supabaseKey!)

        let updates = {
            mpesa_receipt_number: null,
            mpesa_phone_number: null,
            status: 'failed',
            payment_status: 'failed'
        }

        // Process Success (ResultCode 0)
        if (ResultCode === 0) {
            updates.status = 'processing' // Paid, now processing
            updates.payment_status = 'paid'

            const items = CallbackMetadata.Item
            for (const item of items) {
                if (item.Name === 'MpesaReceiptNumber') updates.mpesa_receipt_number = item.Value
                if (item.Name === 'PhoneNumber') updates.mpesa_phone_number = item.Value
            }

            // Also record transaction
            if (updates.mpesa_receipt_number) {
                // Find order first to get amount/user
                const { data: order } = await supabase
                    .from('orders')
                    .select('id, total_amount, user_id')
                    .eq('mpesa_request_id', CheckoutRequestID)
                    .single()

                if (order) {
                    await supabase.from('transactions').insert({
                        transaction_id: updates.mpesa_receipt_number,
                        amount: order.total_amount,
                        status: 'completed',
                        payment_method: 'mpesa',
                        user_id: order.user_id,
                        order_id: order.id,
                        gateway: 'mpesa',
                        currency: 'KES'
                    })
                }
            }
        }

        // Update Order
        const { error } = await supabase
            .from('orders')
            .update(updates)
            .eq('mpesa_request_id', CheckoutRequestID)

        if (error) throw error

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
