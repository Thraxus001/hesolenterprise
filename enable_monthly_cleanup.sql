-- Enable Monthly Cleanup Job
-- This script sets up a cron job to call the 'monthly-cleanup' Edge Function.

-- 1. Enable the extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule the job
-- Schedule: 00:00 on the 1st of every month
-- Function URL: You must replace [YOUR_PROJECT_REF] and [ANON_KEY] below if not using the internal network pattern.
-- However, pg_net or an internal SQL call is needed to invoke Edge Functions from valid SQL.

-- SIMPLE APPROACH:
-- We use pg_net to call the function.
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
    'monthly-cleanup-job', -- Job name
    '0 0 1 * *',           -- Schedule (Monthly)
    $$
    select
        net.http_post(
            url:='https://paxnqyuzuxgktqlnlqxi.supabase.co/functions/v1/monthly-cleanup',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer [YOUR_SERVICE_ROLE_KEY]"}'::jsonb,
            body:='{}'::jsonb
        ) as request_id;
    $$
);

-- NOTE:
-- 1. Replace [YOUR_SERVICE_ROLE_KEY] with your actual Service Role Key (from Project Settings -> API).
--    This is required to bypass RLS and perform deletions.
-- 2. Ensure the "pg_net" extension is enabled in your project.
