-- Safely create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text DEFAULT 'Hesol Enterprise',
  store_email text DEFAULT 'hesolenterprises@gmail.com',
  currency text DEFAULT 'KES',
  tax_rate numeric DEFAULT 16,
  shipping_fee numeric DEFAULT 0,
  enable_reviews boolean DEFAULT true,
  enable_guest_checkout boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read Settings" ON settings;
DROP POLICY IF EXISTS "Admin Update Settings" ON settings;
DROP POLICY IF EXISTS "Admin Insert Settings" ON settings;

-- Create Policies
-- 1. Check for authenticated users for updates (In a real app, you'd check for a specific admin role)
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin Update Settings" ON settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Insert Settings" ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Ensure at least one row exists
INSERT INTO settings (store_name)
SELECT 'Hesol Enterprise'
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Grant permissions (just in case)
GRANT ALL ON TABLE settings TO authenticated;
GRANT SELECT ON TABLE settings TO anon;
GRANT ALL ON TABLE settings TO service_role;
