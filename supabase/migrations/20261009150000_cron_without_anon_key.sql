-- The send-notifications cron call no longer sends the legacy anon JWT (2026-10-09): the function
-- is deployed with verify_jwt off and checks the vault-held cron secret itself, so the call keeps
-- working once the legacy API keys are disabled after the n8n leak.
select cron.alter_job(
  job_id := (select jobid from cron.job where jobname = 'send-notifications'),
  command := $cmd$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')),
    body := jsonb_build_object('at', now()),
    timeout_milliseconds := 30000
  ) as request_id;
$cmd$
);
