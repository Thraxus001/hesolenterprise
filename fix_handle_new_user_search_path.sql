-- Fix for "Function Search Path Mutable" security warning
-- This ensures the function runs with a fixed search_path, preventing malicious code from overriding standard schemas.

ALTER FUNCTION public.handle_new_user() SET search_path = public;
