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
   entered at onboarding, your own achievements and your own plant unlocks (the cards you hold
   and their levels), plus the week's count, weeks at 30 and the streak. Household-scope
   achievements are not shared (Ricardo, 2026-10-12: "just share their own achievements and
   plant unlocks"). Never the member list, never a kid's cards, never which plants on which
   day. No public directory and therefore no public toggle; if a public profile ever matters,
   the switch can be added then, default off.
4. **Remove or block is the single control.** Removing a friend ends the visibility both ways;
   blocking also refuses a new request from that account.
5. **The smallest report path from day one.** A report button on a profile writes a row and
   sends an email to info@projectfood.dev; the admin app lists reports when it gets that module.
   Both stores require report and block before a visible profile ships.

## What follows

- **The privacy and store changes are part of the same version** (Ricardo, 2026-10-12), not a
  follow-up. The build is not done until all of these ship with it:
  - Privacy policy (en, nl, it): a section "Friends and your profile" that says what a friend
    sees (name, avatar, own achievements, own cards, week count, weeks at 30, streak), that
    members at your table are never shown, that nobody can find you without your link or code,
    how to remove or block a friend, how to report someone, and that removing a friend or
    deleting the account ends the visibility. Section 2 (what we collect) gains the friend code
    and the friend list; the retention line covers reports. Effective date bumped.
  - Play Data safety: "Name" and "User IDs" marked as shared with other users is not a field,
    so the collection answers stay and the privacy policy carries the disclosure; "Other user-
    generated content" added if avatars count; the account-deletion URL unchanged.
  - Play content rating: re-answer the questionnaire with "users can interact"; expect the
    "Users interact" label, PEGI 3 kept.
  - Apple privacy labels: re-check "Name", "User ID" and "Other user content" under data linked
    to you; Apple's app-capability questions answered for user-to-user features.
  - Review: a second review account that is already a friend of the first, so a reviewer sees a
    profile from the outside; review notes updated on both stores; the report and block buttons
    named in the notes.
  - In-app: the first time someone taps Share or Accept, one sheet says in two lines what a
    friend will see, with the link to the policy section; no other consent needed because
    nothing is visible until the person connects.
  - Timing: nothing on the closed-test track; iOS only after the first approval; the policy text
    is written when the feature is built, never before it exists.
- **Data:** the PWA's `friendships` table (requester, addressee, status) already models
  adult-to-adult links on auth users and can carry this; a friend code per account, a block
  state and a reports table are new. No child data enters any of them.
- **Order:** the personal streak and its freeze stay first (Ricardo, 2026-09-20); a friend
  streak is a later layer and must never let one person break the other's count
  ([[concept-achievement-system]], never punishment without a freeze). Cheers between households
  ride on the same links.
- **Out of scope on purpose:** open search by name, a public directory, leaderboards, a feed,
  member-level profiles.

## Growth lens (added 2026-10-12)
Every social feature is held against [[concept-network-effects]]: does it bring someone new in, does it make someone stay because of another person. Keep-features come before spread-features.

## Related pages

- [[strategy-backlog]] (row 17, brainstorm 18) · [[source-research-app-benefits-2026-10]] ·
  [[concept-engagement-drivers]] · [[concept-word-of-mouth]] · [[concept-stickiness-moat]] ·
  [[decision-2026-10-07-two-ways-to-use-it]] · [[concept-retention-loop]]
