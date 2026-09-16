-- 0009 schedule the push sender every 15 minutes. Secrets live in Vault; the cron secret is
-- generated server-side and only readable by the service role (the Edge Function compares it).
select vault.create_secret('https://lkmfmdehysmbstnfdbyg.supabase.co', 'project_url');
select vault.create_secret('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrbWZtZGVoeXNtYnN0bmZkYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMDMxMzUsImV4cCI6MjA5Mjc3OTEzNX0.4uQmhZW4kVB3y5yOKbtojf6R73VFYhPaQkIv99BQ1BI', 'anon_key');
select vault.create_secret(gen_random_uuid()::text || gen_random_uuid()::text, 'cron_secret');

create or replace function public.cron_secret() returns text
language sql stable security definer set search_path = public as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret' limit 1;
$$;
revoke execute on function public.cron_secret() from public, anon, authenticated;
grant execute on function public.cron_secret() to service_role;

select cron.schedule('send-notifications', '*/15 * * * *', $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key'),
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')),
    body := jsonb_build_object('at', now()),
    timeout_milliseconds := 30000
  ) as request_id;
$$);
