-- FIX RLS POLICIES FOR ADMINS
-- Run this in your Supabase SQL Editor

-- 1. Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 2. Create Helper Function to check if user is admin (if not exists)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ORDERS POLICIES
-- Allow admins to update orders (for marking as paid)
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.is_admin());

-- Allow admins to view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (public.is_admin());


-- 4. TRANSACTIONS POLICIES
-- Allow admins to insert transactions (for manual record creation)
DROP POLICY IF EXISTS "Admins can insert transactions" ON public.transactions;
CREATE POLICY "Admins can insert transactions"
ON public.transactions
FOR INSERT
WITH CHECK (public.is_admin());

-- Allow admins to view all transactions
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
USING (public.is_admin());

-- Allow admins to update transactions (optional, but good for corrections)
DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;
CREATE POLICY "Admins can update transactions"
ON public.transactions
FOR UPDATE
USING (public.is_admin());
