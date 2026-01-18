-- FIX ORDER DELETION (CASCADE TRANSACTIONS)
-- Run this in your Supabase SQL Editor

-- 1. Drop the existing foreign key constraint (referencing orders)
ALTER TABLE public.transactions
DROP CONSTRAINT IF EXISTS transactions_order_id_fkey;

-- 2. Re-add the constraint with ON DELETE CASCADE
-- This ensures that when an Order is deleted, its related Transaction is also deleted automatically.
ALTER TABLE public.transactions
ADD CONSTRAINT transactions_order_id_fkey
FOREIGN KEY (order_id)
REFERENCES public.orders(id)
ON DELETE CASCADE;
