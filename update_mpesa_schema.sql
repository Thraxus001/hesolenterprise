-- Add M-Pesa tracking columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS mpesa_request_id text,
ADD COLUMN IF NOT EXISTS mpesa_receipt_number text,
ADD COLUMN IF NOT EXISTS mpesa_phone_number text;

-- Add checking for duplicate payments if needed later
CREATE INDEX IF NOT EXISTS idx_orders_mpesa_request_id ON orders(mpesa_request_id);
