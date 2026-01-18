-- PROMOTE USER TO ADMIN
-- Run this in your Supabase SQL Editor

-- 1. Find your User ID from your email
-- REPLACE 'your_email@example.com' WITH YOUR ACTUAL EMAIL
UPDATE public.users
SET role = 'admin'
WHERE id = auth.uid(); 
-- auth.uid() often only works if running from client context or if "Enable View/Edit with User" is on in dashboard.
-- SAFER METHOD:
-- UPDATE public.users SET role = 'admin' WHERE email = 'your_actual_email_address_here';

-- Let's try a broad update for the current session user if possible, or just print a message
DO $$
DECLARE
   v_user_email text;
BEGIN
   -- Attempt to set all current users to admin if you are the only one (DEV ONLY)
   -- OR just ensuring the policies allow it.
   
   -- If you know your email, uncomment the line below and run it:
   -- UPDATE public.users SET role = 'admin' WHERE email = 'YOUR_EMAIL@HERE.COM';
   
   NULL;
END $$;
