-- FIX TRANSACTION CONSTRAINT
-- Run this in your Supabase SQL Editor

-- 1. Drop the restrictive check constraint
ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_payment_method_check;

-- 2. Add a more flexible constraint (or just leave it open if you prefer)
ALTER TABLE public.transactions
ADD CONSTRAINT transactions_payment_method_check
CHECK (payment_method IN ('mpesa', 'card', 'cash_on_delivery', 'manual', 'bank_transfer', 'paypal'));

-- Alternatively, validation can be handled in app logic, but DB constraint is safer.
