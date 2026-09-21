#!/usr/bin/env node
// Pushes the auth email templates in this folder to the Supabase project through the Management API.
// Only the template fields are sent; nothing else in the auth config is touched. Needs a personal
// access token from https://supabase.com/dashboard/account/tokens:
//   SUPABASE_ACCESS_TOKEN=sbp_... node supabase/templates/push.mjs [--dry-run]
// The same HTML can be pasted by hand: Dashboard → Authentication → Email Templates.
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REF = 'lkmfmdehysmbstnfdbyg';
const DIR = dirname(fileURLToPath(import.meta.url));
// Supabase sends "magic_link" to existing accounts and "confirmation" to new ones when the app asks for a code.
const TEMPLATES = {
  magic_link: { subject: 'Your Project Food code', file: 'magic-link.html' },
  confirmation: { subject: 'Your Project Food code', file: 'confirm-signup.html' },
};

const tokenFile = join(homedir(), '.supabase', 'access-token');
const token = process.env.SUPABASE_ACCESS_TOKEN ?? (existsSync(tokenFile) ? readFileSync(tokenFile, 'utf8').trim() : '');
if (!token) {
  console.error('No token. Set SUPABASE_ACCESS_TOKEN (create one at https://supabase.com/dashboard/account/tokens).');
  process.exit(1);
}
const dry = process.argv.includes('--dry-run');
const api = `https://api.supabase.com/v1/projects/${REF}/config/auth`;
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

const res = await fetch(api, { headers });
if (!res.ok) {
  console.error(`could not read the auth config: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const current = await res.json();

const body = {};
for (const [key, t] of Object.entries(TEMPLATES)) {
  const content = readFileSync(join(DIR, t.file), 'utf8');
  const same = current[`mailer_templates_${key}_content`] === content && current[`mailer_subjects_${key}`] === t.subject;
  console.log(`${key}: ${same ? 'unchanged' : 'will update'} (${t.file})`);
  if (!same) {
    body[`mailer_subjects_${key}`] = t.subject;
    body[`mailer_templates_${key}_content`] = content;
  }
}
if (current.mailer_otp_exp && current.mailer_otp_exp !== 3600) console.warn(`note: codes expire after ${current.mailer_otp_exp}s; the templates say one hour`);
if (Object.keys(body).length === 0) {
  console.log('nothing to push');
  process.exit(0);
}
if (dry) {
  console.log('dry run, nothing sent');
  process.exit(0);
}
const push = await fetch(api, { method: 'PATCH', headers, body: JSON.stringify(body) });
if (!push.ok) {
  console.error(`push failed: ${push.status} ${await push.text()}`);
  process.exit(1);
}
console.log('pushed; send yourself a code from the sign-in screen to see it');
