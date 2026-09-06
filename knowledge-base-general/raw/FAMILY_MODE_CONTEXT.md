# Project Food — Family Mode: Strategic Context

**Status:** Direction agreed, not yet validated. Pre-build.
**Date:** 2026-09-06
**Owner:** Ricardo
**Purpose of this file:** Give any agent or session working on this repo the reasoning behind the pivot to family mode and native apps, so implementation decisions stay consistent with it. Read this before touching product scope, data model, notifications, or growth work.

---

## 1. Summary (read this if nothing else)

Project Food started as a gut-health tracker for adults ("30 different plants a week"). Real-world observation — kids at a family birthday abandoning chips to hunt for fruit and vegetables once they saw the app as a game — plus the difficulty of retaining solo adult users has led to a repositioning:

**Project Food becomes a family app.** Parents are the payer and the logger. Kids are the motivation engine. Dinner is the habit anchor. Groceries are the planning moment. The AI weekly advice is rewritten for the household shopper.

Consequences:

1. **Build native iOS + Android (Expo / React Native).** The PWA validated the concept but fails at the first step for parents: "add to home screen" before push works is a non-starter for this audience. App Store link in a class WhatsApp group is the distribution unit.
2. **New data model:** household → members (adults and kids) → per-member plant collections. Cooperative goals inside the household, asynchronous comparison between households.
3. **Retention = the dinner habit,** measured per household, not per individual.
4. **Launch channel = the school class,** not SEO. SEO stays as a compounding background asset.

Everything on the backend stays: Supabase, plant catalog, plant images, advice prompt, n8n image pipeline. Only the client and the data model above it change.

---

## 2. What stays true

These were locked before the pivot and still hold. Do not relitigate.

- **Brand promise:** "Eat 30 different plants a week. Good gut, good life."
- **Four pillars:** Count, don't preach · Different beats more · Effortless in the moment, meaningful by Sunday · Joy, not guilt.
- **Daily logging beats weekly recall.** Weekly recall undercounts and demotivates.
- **No health claims in marketing** (YMYL risk). Family mode makes this easier: "learn to eat everything" is a behaviour outcome, not a medical one.
- **Proprietary user-derived data is the moat,** not content and not AI advice on its own.
- **Less is more.** The brand does not preach. Eco/seasonal/local is texture inside the advice, never a fourth message.
- **Concept validation over financial targets** for year one, measured on active households.

Note on pillar 4: family mode is the purest expression of "Joy, not guilt." Any feature that turns dinner into pressure (sibling competition, streak punishment, clean-plate framing) violates it.

---

## 3. The pivot, in reasoning order

### 3.1 The observation
At a nephew's birthday, kids who saw the app on a parent's phone immediately treated it as a game and went looking for plants to "score" instead of eating chips. Nobody preached; the counting mechanic was intrinsically motivating. One data point, but a strong one, and consistent with what the pillars were designed to produce.

### 3.2 Why kids/family is the market, not just a segment
- Zoe (main incumbent) cannot follow: adult gut testing, medical framing, stricter YMYL for children.
- The science on children is behavioural and public: the Food Dudes school programme (peer modelling + small rewards) and Lucy Cooke's Tiny Tastes work at UCL both show that rewarding **tasting** — not clean plates — increases what kids will eat, and that food neophobia breaks after roughly 10–15 exposures. This is "Different beats more" with a research base, and it requires no health claims.
- Parent willingness to pay is proven in adjacent categories (Duolingo ABC, Khan Kids, family plans are a normal price point).
- Founder observation: it is easier to keep a habit for the household than for yourself. Accountability to the family beats willpower. This is the honest retention model.

### 3.3 Why a family app, not a kids app
- Kids apps mean COPPA / GDPR-K, no analytics freedom, Apple Kids Category restrictions, and a child needs their own device.
- Family mode: parent's account, one collection per household member, parent holds the phone, **kid does the tapping.** Rate the app 4+ but do **not** enroll in Apple's Kids Category.

### 3.4 Why native
- iOS PWA push requires home-screen install first. Parents will not do this. Founder had to explain PWA vs app to a mother — that is the validated learning.
- App Store presence is trust and is the thing that gets shared in a parents' WhatsApp group.
- Expo was chosen in April 2026, PWA was chosen instead to validate faster. That was right then. Validation is done.
- Do not use Capacitor to wrap the Next.js app: App Router does not export cleanly and Apple rejects thin web wrappers.
- Do not rebuild to parity with the PWA. Build family mode only.

---

## 4. Decisions (agreed)

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Native iOS + Android via Expo / React Native, EAS builds, expo-notifications | See 3.4 |
| D2 | Next.js stays for marketing site + SEO. Supabase unchanged. | Backend and content assets are reusable |
| D3 | Household is the primary unit: `household` → `members` (adult/kid) → per-member logs and collections | Family mode data model |
| D4 | Cooperative goal inside the household (family reaches 30 together, everyone's plants count) | Sibling competition creates losers at dinner → violates pillar 4 |
| D5 | Competitive/social layer is asynchronous and **between** households (cousins, class) — collections and milestones, never head-to-head | Matches how the party actually played out |
| D6 | Collective milestones for groups ("our class ate 100 different plants") — no loser, shareable | Word of mouth container |
| D7 | Family streak has a built-in freeze | Pizza night must not lose the whole household |
| D8 | Plant images (3D clay renders, `food-images` bucket) become a collectable card mechanic: taste a plant → unlock its card | Intrinsic reward, avoids extrinsic-reward trap, most shareable artifact |
| D9 | Push permission requested only after the first successful log, never at onboarding | iOS gives one shot |
| D10 | Notification copy is a question ("What did the kids eat today?") that opens directly into logging | It is the dinner-table question, not a nag |
| D11 | AI weekly advice is rewritten for the household shopper | What the family hasn't had in 3 weeks, what's in season, how to serve it so kids taste it — this is the paid feature |
| D12 | Eco / seasonal / local stays as texture inside advice (cheaper, tastes better), not a brand theme | Less is more; brand does not preach |
| D13 | Retention metric = dinners logged per household per week, checked at week 4 and week 8 | Not individual DAU |
| D14 | Paid acquisition stays off until household lifetime value is known | — |

---

## 5. The habit loop (design target)

Two rituals already exist in every household. The app borrows them rather than creating new ones.

**Daily — dinner (logging)**
- Cue: dinner ends. Notification fires ~30 min after the household's *real* dinner time. Ask for dinner time at onboarding, then correct it from actual log timestamps after week one. Not a fixed 19:00. Localize defaults (NL ~18:00, IT ~20:00).
- Routine: parent asks "what did you eat today?", kid taps the plants on the parent's phone. Under one minute.
- Reward: instant card unlock / progress toward the family's 30. The kid must see it. If the parent logs while the kid watches, it is a chore, not a game.

**Weekly — groceries (planning)**
- Sunday advice for the shopper (D11). Dinner logs feed the advice, the advice shapes the basket, the basket brings new plants to the table. Pillar 3 ("meaningful by Sunday") made concrete.

**Instrumentation from day one (four numbers):**
1. Notification → open rate
2. Time from notification to log
3. Dinners logged per household per week
4. Where the week-4 cliff sits

**Notification hygiene:** three ignored notifications in a row → the notification moves or goes quiet automatically. Burning permission is worse than missing a day.

---

## 6. Growth plan

- **SEO is not the launch channel.** Keep the marketing site ticket (locale routes, sitemap, hreflang, JSON-LD). Parent search intent is real and non-medical ("kind lust geen groente" cluster and Italian equivalents) — but it is a 12-month compounding asset. Volumes still to be pulled via DataForSEO before investing in content.
- **Launch channel = the school class.** Not the school (sales cycle). The class parents' WhatsApp group. One parent starts a class challenge, kids come home asking about it, other parents ask what the app is.
- **Timing hook:** EU school fruit scheme (NL: roughly Nov–Apr, IT: "Frutta e verdura nelle scuole"). Every class in it already has a "what did you eat at school today?" moment.
- **Sequence:**
  1. Now → 5 families (sister's family first) to confirm the dinner habit holds past week 4.
  2. November → one class as the playbook.
  3. If it replicates in a second class the founder did not personally seed → it is a channel.
- **Group units that work:** cousins, school class. **Neighbourhood** does not bootstrap (nobody knows who is on the app).

---

## 7. Validation plan (before redesign)

- **Do not wait on the survey.** 2–3 responses so far, and it targets the wrong audience (current adult gut-health users cannot answer family questions).
- **Behavioural data first** (already in Supabase): users logging past week 4, hour of day they log, plants per week reached, drop-off point. Decides what to **keep**.
- **Five parent conversations,** ~15 min each (sister, party parents). Ask in this order: what does dinner look like, what do you already ask your kids, what would you pay for. Decides what to **build**.

---

## 8. Open questions

- Is family mode *the* wedge or one segment alongside the adult product? Test before answering.
- Pricing for a household plan (current assumption: annual-only ~€29.99/yr via Lemon Squeezy — revisit for family tier).
- Class challenge mechanics: how does a group form, who can see what, what is the shareable artifact (poster, card, milestone screen)?
- School-lunch logging: NL kids bring lunch from home, IT schools have a mensa. Minor, but affects "what did you eat at school" UX.
- Keyword volumes for the parent-search cluster (DataForSEO) — needed before content investment.

---

## 9. Next steps

1. Pull behavioural numbers from Supabase (section 7).
2. Run the five parent conversations.
3. Phase 1 ticket: family-mode data model (household, members, per-member logs/collections, cooperative weekly goal, streak freeze). Both the native rebuild and the habit instrumentation hang off this.
4. Expo project scaffold; marketing site stays on Next.js.
5. Rewrite the advice prompt for the household shopper.
6. Class-challenge playbook draft, timed for November.

---

## 10. Things not to do

- Do not add sibling-vs-sibling competition.
- Do not punish a missed dinner without a freeze.
- Do not ask for push permission at onboarding.
- Do not make eco/seasonal/local a brand message.
- Do not build calorie or macro tracking.
- Do not build a recipe library (AI suggestions tied to gaps only).
- Do not wrap the PWA in Capacitor.
- Do not enroll in Apple's Kids Category.
- Do not gate the redesign on survey responses.
