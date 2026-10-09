// Deletes the calling user's account. Required by both app stores. Households the user created go
// with them through the FK cascade (members, unlocks, nudges, settings, push tokens, notification
// log, events); a household they merely joined stays. The taste rows in plant_logs stay too, as
// anonymous statistics: their ids point at nothing once this runs (migration 0015, privacy policy
// section 8).
// Since 2026-10-09 a confirmation email goes out through Resend (backlog item 13): the address and
// locale are read while the account still exists, the account is deleted, then the email is sent, so
// a failed deletion never produces a "deleted" email. A failed email never blocks the deletion.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

type Locale = 'en' | 'nl' | 'it';
const asLocale = (l: string | null | undefined): Locale => (l === 'nl' || l === 'it' ? l : 'en');

type Copy = { subject: string; title: string; body: string; keep: string; again: string; thanks: string };
// Parent register, plain: say what happened and when, no warmth theatre (brand-voice, support emails).
const COPY: Record<Locale, Copy> = {
  en: {
    subject: 'Your Project Food account has been deleted, as you asked',
    title: 'Your account is deleted',
    body: 'Your account, the household you created with its profiles, cards and achievements, your notification history and push tokens are gone. Your tastes stay only as anonymous statistics, linked to no one. Database backups expire within 30 days.',
    keep: 'If you joined a household that someone else created, that household stays with them.',
    again: 'You can start again any time with the same email address. Questions go to info@projectfood.dev.',
    thanks: 'Thank you for having been at the table.',
  },
  nl: {
    subject: 'Je Project Food-account is verwijderd, zoals je vroeg',
    title: 'Je account is verwijderd',
    body: 'Je account, het huishouden dat je hebt aangemaakt met de profielen, kaarten en prestaties, je meldingsgeschiedenis en push-tokens zijn weg. Je hapjes blijven alleen als anonieme statistiek bewaard, aan niemand gekoppeld. Databaseback-ups verlopen binnen 30 dagen.',
    keep: 'Ben je aangesloten bij een huishouden dat iemand anders heeft aangemaakt, dan blijft dat huishouden bij die persoon.',
    again: 'Je kunt altijd opnieuw beginnen met hetzelfde e-mailadres. Vragen gaan naar info@projectfood.dev.',
    thanks: 'Bedankt dat je aan tafel zat.',
  },
  it: {
    subject: 'Il tuo account Project Food è stato eliminato, come richiesto',
    title: 'Il tuo account è stato eliminato',
    body: 'Il tuo account, la casa che hai creato con i suoi profili, carte e traguardi, la cronologia delle notifiche e i token push non ci sono più. I tuoi assaggi restano solo come statistiche anonime, senza collegamento a nessuno. I backup del database scadono entro 30 giorni.',
    keep: 'Se ti sei unito a una casa creata da qualcun altro, quella casa resta a quella persona.',
    again: 'Puoi ricominciare quando vuoi con lo stesso indirizzo email. Per domande scrivi a info@projectfood.dev.',
    thanks: 'Grazie per essere stato a tavola con noi.',
  },
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The same card as supabase/templates/magic-link.html: light card on warm cream, dark text, no images, dark-mode hooks. */
function html(c: Copy, locale: Locale): string {
  const font = "'Plus Jakarta Sans',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
  return `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${esc(c.subject)}</title>
  <style>
    :root { color-scheme: light; supported-color-schemes: light; }
    @media (prefers-color-scheme: dark) {
      .bg { background-color: #F4EFE8 !important; }
      .card { background-color: #FFFFFF !important; }
      .ink { color: #1F1B16 !important; }
      .ink2 { color: #6B645C !important; }
      .ink3 { color: #A39B91 !important; }
    }
    [data-ogsb] .bg { background-color: #F4EFE8 !important; }
    [data-ogsb] .card { background-color: #FFFFFF !important; }
    [data-ogsc] .ink { color: #1F1B16 !important; }
    [data-ogsc] .ink2 { color: #6B645C !important; }
    [data-ogsc] .ink3 { color: #A39B91 !important; }
  </style>
</head>
<body class="bg" bgcolor="#F4EFE8" style="margin:0;padding:0;background-color:#F4EFE8;">
  <table role="presentation" class="bg" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#F4EFE8" style="background-color:#F4EFE8;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="card" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" style="max-width:440px;background-color:#FFFFFF;border-radius:24px;">
          <tr>
            <td style="padding:32px 28px 32px 28px;font-family:${font};">
              <p class="ink" style="margin:0 0 20px 0;font-size:15px;line-height:20px;font-weight:700;color:#1F1B16;">Project Food</p>
              <h1 class="ink" style="margin:0 0 8px 0;font-size:22px;line-height:28px;font-weight:800;color:#1F1B16;">${esc(c.title)}</h1>
              <p class="ink2" style="margin:0 0 16px 0;font-size:15px;line-height:22px;color:#6B645C;">${esc(c.body)}</p>
              <p class="ink2" style="margin:0 0 16px 0;font-size:15px;line-height:22px;color:#6B645C;">${esc(c.keep)}</p>
              <p class="ink2" style="margin:0 0 20px 0;font-size:13px;line-height:20px;color:#6B645C;">${esc(c.again)}</p>
              <p class="ink" style="margin:0;font-size:15px;line-height:22px;font-weight:600;color:#1F1B16;">${esc(c.thanks)}</p>
            </td>
          </tr>
        </table>
        <p class="ink3" style="margin:16px 0 0 0;font-family:${font};font-size:12px;line-height:18px;color:#A39B91;">Project Food &middot; projectfood.dev</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const text = (c: Copy) => `${c.title}\n\n${c.body}\n\n${c.keep}\n\n${c.again}\n\n${c.thanks}\n\nProject Food · projectfood.dev`;

/** Sends the confirmation through Resend; never throws, so a mail problem cannot undo a deletion that already happened. */
async function sendConfirmation(to: string, locale: Locale): Promise<boolean> {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return false;
  const c = COPY[locale];
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Project Food <info@projectfood.dev>', to: [to], subject: c.subject, html: html(c, locale), text: text(c) }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  const jwt = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!jwt) return json({ error: 'unauthorized' }, 401);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await admin.auth.getUser(jwt);
  if (error || !data.user) return json({ error: 'unauthorized' }, 401);

  // Read what the email needs while the row still exists; user_settings goes with the cascade.
  const email = data.user.email ?? null;
  const { data: settings } = await admin.from('user_settings').select('locale').eq('user_id', data.user.id).maybeSingle();
  const locale = asLocale((settings as { locale?: string } | null)?.locale);

  const { error: delErr } = await admin.auth.admin.deleteUser(data.user.id);
  if (delErr) return json({ error: delErr.message }, 500);

  const emailed = email ? await sendConfirmation(email, locale) : false;
  return json({ ok: true, emailed });
});
