---
title: The social layer: friends by link or QR, the account holder as the only profile, visible to friends only
type: decision
tags: [social, retention, privacy, safeguarding, store-compliance, family-mode]
created: 2026-10-12
updated: 2026-10-12
sources: [source-research-app-benefits-2026-10.md, concept-engagement-drivers.md, decision-2026-10-07-two-ways-to-use-it.md, strategy-backlog.md]
status: accepted
---

# The social layer: friends by link or QR, the account holder as the only profile, visible to friends only

**In one line:** People connect by an invite link or QR code with a share button, never by
searching names; the account holder (the adult who holds the phone) is the only profile; a
profile is visible to connected friends and to nobody else, so there is no public switch; and a
report and block path exists from day one, in its smallest form. Decided by Ricardo on
2026-10-12 with ease of use and customer experience as the driver. Built after the stores
unlock, never on the closed-test track.

## Context

Row 17 of [[strategy-backlog]] held two questions since 2026-09-20: what the social unit is
(parent account, household or kid) and where the kids' safeguarding line runs. On 2026-10-12
Ricardo asked whether a social page (find users, see achievements and high-level stats, a
visible-or-not toggle) changes the store process. The store answer (both stores treat visible
profiles as user-generated content: report and block, privacy forms, content rating, a second
review account) is in the parking-lot entry of that day. Ricardo then proposed the account model
that settles the unit: the adult is the account, people at the table are members under it, only
the account holder is visible socially. The research of 2026-10-11
([[source-research-app-benefits-2026-10]]) adds that social is valued as a person who notices, not
a feed, and that leaderboards and open social features rank last in what users want.

## The decision

1. **The social unit is the account holder.** The auth user, the adult who holds the phone, is
   the profile. Members (kids, a partner) are never a profile, never searchable, never shown.
   This is true by construction, not by a setting. The solo adult is the same case
   ([[decision-2026-10-07-two-ways-to-use-it]]).
2. **Connecting is by invite link or QR code, with a share button.** Generated when the account
   is created, shown in Settings and later on the social tab. Tapping a friend's link, or
   scanning the QR at the table, shows "<name> wants to connect" and one tap accepts. A short
   friend code on the profile is the typed fallback when a link cannot be sent. There is no
   search by name.
3. **Visible to friends only.** What a connected friend sees: your name and drawn avatar as
   entered at onboarding, the table's plant count this week, weeks at 30, the streak, and the
   achievements that belong to the household or to you. Never the member list, never a kid's
   cards, never which plants on which day. No public directory and therefore no public toggle;
   if a public profile ever matters, the switch can be added then, default off.
4. **Remove or block is the single control.** Removing a friend ends the visibility both ways;
   blocking also refuses a new request from that account.
5. **The smallest report path from day one.** A report button on a profile writes a row and
   sends an email to info@projectfood.dev; the admin app lists reports when it gets that module.
   Both stores require report and block before a visible profile ships.

## What follows

- **Store work before the first social build:** privacy policy section on profiles and friends;
  a fresh pass on Play Data safety and Apple privacy labels; Play content rating re-answered
  ("users interact"); a second review account and updated review notes so a reviewer can see a
  profile from the outside. Nothing on the closed-test track; iOS only after the first approval.
- **Data:** the PWA's `friendships` table (requester, addressee, status) already models
  adult-to-adult links on auth users and can carry this; a friend code per account, a block
  state and a reports table are new. No child data enters any of them.
- **Order:** the personal streak and its freeze stay first (Ricardo, 2026-09-20); a friend
  streak is a later layer and must never let one person break the other's count
  ([[concept-achievement-system]], never punishment without a freeze). Cheers between households
  ride on the same links.
- **Out of scope on purpose:** open search by name, a public directory, leaderboards, a feed,
  member-level profiles.

## Related pages

- [[strategy-backlog]] (row 17, brainstorm 18) · [[source-research-app-benefits-2026-10]] ·
  [[concept-engagement-drivers]] · [[concept-word-of-mouth]] · [[concept-stickiness-moat]] ·
  [[decision-2026-10-07-two-ways-to-use-it]] · [[concept-retention-loop]]
