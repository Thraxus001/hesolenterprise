-- Create settings table if not exists
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text DEFAULT 'Hesol Enterprise',
  store_email text DEFAULT 'admin@hesol.com',
  currency text DEFAULT 'KES',
  tax_rate numeric DEFAULT 16,
  shipping_fee numeric DEFAULT 500,
  enable_reviews boolean DEFAULT true,
  enable_guest_checkout boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Admin read/write, Public read-only (for frontend config)
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin Update Settings" ON settings FOR UPDATE USING (
  auth.role() = 'authenticated' -- In real app, check for admin claim/role
);
CREATE POLICY "Admin Insert Settings" ON settings FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

-- Insert default row if empty
INSERT INTO settings (store_name)
SELECT 'Hesol Enterprise'
WHERE NOT EXISTS (SELECT 1 FROM settings);
