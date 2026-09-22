---
title: Store POC scope — ship the family app with the PWA's features first
type: decision
tags: [decision, app, scope, family-mode, stores]
created: 2026-09-16
updated: 2026-09-22
date: 2026-09-16
status: accepted
sources: [decision-2026-09-07-app-v1-scope, concept-retention-loop, concept-achievement-system, source-family-mode-context]
---

# Store POC scope — ship the family app with the PWA's features first

**Date:** 2026-09-16  **Status:** accepted

## Context
[[decision-2026-09-07-app-v1-scope]] set a greenfield v1 with eleven new features and the line
"do not rebuild to parity with the PWA". By 2026-09-16 the Expo POC had validated the pieces that
matter at the table (multi-member logging with hold-to-pick, achievements with progress, the celebration
motion), but a full design system and the eleven features would take months. Ricardo decided that a
store-listed POC, improved with real families, beats a waterfall build: get into the Play Store and
App Store with what the PWA already does well plus the family model, then iterate.

## Decision
Build the store POC on the household data model with this scope:

| In | Deferred (roadmap unchanged) | Dropped |
|---|---|---|
| Household → members (kid/adult) → per-member logs; one auth account per parent phone | Albums, avatar accessories, cheers between households, class milestone | Recipe builder and AI food suggestor (`weekly_advice`, `recipe_batches`, advice/recipes routes) |
| Log as in the PWA (catalog, fuzzy search, category tabs, missing-plant suggestion) + POC multi-member logging (tap = default set, hold = picker, "everyone", sticky default) | Sunday shopper advice and the paid plan (RevenueCat); `households.plan` exists, everything free | XP counter and any XP ledger (achievements stay) |
| Home: household week /30, per-member counts, next goals rail, today's plants, week collection, survey banner | Rive characters and card animation (Reanimated + Skia carry the motion) | Leaderboard, friends, public profiles (tables kept, screens not ported) |
| Stats renamed **Unlocks**: 16 achievements on real history (per kid + household), card levels 1/5/10, foods tried per category, plant detail page with kid fact + parent tip (`plant_facts`, AI-generated for en/nl/it, reviewed later) | de/fr UI strings and plant names (string layer accepts them, falls back to English) | Weekly goal editing, avatar borders, PWA install prompts |
| Account: members with the PWA avatar set, household name + dinner time, language en/nl/it, notifications split **essential** (dinner question, streak keeper; on) / **marketing** (card teaser, Sunday nudge; off), survey (existing tables), privacy/terms, sign out, **delete account** | "Refused" tap at logging (Brave bite) | |
| Auth: email code, Google native sign-in, Apple sign-in on iOS (mandatory next to Google) | | |
| Native push via Expo: permission asked after the first log, sender Edge Function on pg_cron every 15 min, three ignored → a week of quiet, sent/delivered/opened/logged-within-3h recorded | | |
| Family streak with a built-in freeze (one miss per rolling 7 days) | | |

## Rationale
- The PWA's features are proven and cheap to carry over; the family model is the one structural
  change that cannot be retrofitted later, so it goes in first (`plant_logs.member_id`).
- Stores are the trust channel for the class WhatsApp groups; TestFlight/Play testing needs a
  build now, not after a design system.
- Social was individual-based in the PWA and would violate D5 (never head-to-head); redoing it as
  between-household cheers belongs to the next release.
- XP was a fourth currency with no decided economy; achievements and cards already carry the reward.

## Alternatives considered
- Finish design system and the eleven v1 features first (the 2026-09-07 plan) — months before any
  family can install it; rejected by Ricardo on 2026-09-16.
- Keep shipping the PWA — no push, no store presence, adult-only model; ruled out on 2026-09-06.
- Port social as-is — re-introduces individual competition; deferred.

## Consequences
- Migrations 0001–0009 applied to the live project on 2026-09-16: households, household_users,
  household_members, `plant_logs.member_id` + `household_id` (backfilled for the 15 existing
  accounts; a BEFORE INSERT trigger keeps the legacy PWA writing), plant_facts, achievement_unlocks,
  app_events, push_tokens, extended notification_log, household RPCs incl. `household_streak`,
  delete cascades, service-role access for the scheduler, pg_cron schedule with Vault secrets.
- Edge Functions `delete-account` and `send-notifications` deployed. The Vercel cron for web
  push becomes redundant and is removed with the PWA's push routes.
- The PWA stays a legacy client until the stores are live; its RPCs are untouched.
- Instrumentation exists from day one (`app_events`, `notification_log` outcome columns) for the
  KPI list in [[strategy-backlog]] row 11.
- Still needed before testers: custom SMTP (Resend) in Supabase Auth for the email code, Google
  OAuth client ids (Android with EAS + Play SHA-1, iOS), a Firebase project for FCM, Apple
  Developer enrolment for iOS, a privacy page covering kids' data (first name + kind only), store
  listing assets, the accent decision for the icon.
- Backlog rows 4, 5, 9, 11, 13, 14, 15 updated the same day.

## Related pages
- [[overview]]
- [[decision-2026-09-07-app-v1-scope]] (partially superseded for the first release)
- [[concept-retention-loop]] · [[concept-achievement-system]] · [[source-family-mode-context]]
- [[strategy-backlog]]
