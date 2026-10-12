---
title: Market size research, Netherlands first (2026-10)
type: source
tags: [market, market-size, netherlands, flanders, italy, germany, france, business-model, channels]
created: 2026-10-12
updated: 2026-10-12
date_published: 2026-10-12
sources: [raw/market-research-2026-10/README.md]
---

# Market size research, Netherlands first (2026-10)

**In one line:** The Netherlands is a small country but the best first market in Europe for a
paid habit app: about 3.8 million adults aged 20 to 54 want to eat healthier, 1.3 million
households have a youngest child under 12, and 13% of Dutch adults aged 25 to 54 already pay for
a health or fitness app, the highest share of the five markets we looked at. The goal ladder's
"worth continuing" stage needs about 15,000 to 21,000 Dutch installs, under 1% of the people
who want to eat healthier. Germany, not Italy, is the next revenue market.

> **Live numbers:** the model artifact "Project Food model" (https://claude.ai/artifact/D38Kfd3LBPcDQqd3sW2Sku,
> built 2026-10-12) holds the editable assumptions, the markets with their sources, all 298 data
> points and a change log. It is the source of truth for the numbers from now on; this page is the
> method and the 2026-10-12 snapshot. The model blends annual and monthly payers (68% annual), so
> its net per payer (€2.49 a month) is a little above the annual-only €2.34 used below.

Ricardo's question (2026-10-12): "I don't know how big the market for our product is. Let's
say we start in the Netherlands." Data in `raw/market-research-2026-10/` (298 rows, every one
with its URL); this page is the synthesis. Status labels below: measured (official statistic),
estimate (our arithmetic, shown), secondary (an aggregator).

## 1. The problem is large, and it is the norm

| Fact (Netherlands) | Value | Period | Source |
|---|---|---|---|
| Adults 18+ eating enough vegetables (250 g) 7 days a week | 26.5% (95% interval 25.5 to 27.5) | 2024 | CBS/RIVM Leefstijlmonitor, StatLine 85457NED, measured |
| Adults meeting the fruit norm | 22.7% | 2024 | same |
| Children 4 to 11 eating enough vegetables daily | 47.3% | 2024 | same |
| Youth 12 to 15 eating enough vegetables daily | 25.9% | 2024 | same |
| Parents in a couple with children, enough vegetables daily | 26.3% | 2024 | same |
| Adults who say they want to eat healthier | 36%; 52.4% at 25 to 45 | 2022 | CBS Belevingen, news release 2023/37 and longread "(On)gezonde leefstijl 2022" |
| Children picky at some point between 1.5 and 6 years | 46%; 27.6% at age 3, 13.2% at 6, 4% persistent | Generation R, born 2002 to 2006 | Cardona Cano et al. 2015, PMID 25644130 |
| Young children with mild to moderate eating problems | 25% to 45% | 2024 | JGZ guideline "Voeding en eetgedrag" factsheet |
| Adults with overweight | 50.6% | 2025 | CBS 85457NED (context only, never in copy) |
| Self-described flexitarians | 21.3% | 2024 | CBS 85457NED |

In people: about 10.9 million Dutch adults do not eat enough vegetables every day (14.84 million
adults × 73.5%, estimate). The problem is not a niche; it is the default. The parents of young
children eat no better than everyone else (26.3%), and their children fall from 74% at age 1 to
3 to 26% by age 12 to 15. Variety, not quantity, is our angle, but the same gap drives it.

## 2. The Netherlands, from everyone to a paying customer

| Layer | People or households | How it is counted |
|---|---|---|
| Total market (TAM): adults 20 to 54, the account holder | 8.08 million | CBS 7461bev, 1 Jan 2026, measured |
| of which households whose youngest child is 0 to 11 (the household persona) | 1.29 million households (0 to 5: 752,615; 6 to 11: 533,081); 1.97 million children aged 2 to 12 | CBS 71487ned and 7461bev, 1 Jan 2026, measured (re-checked by Claude) |
| Serviceable market (SAM): adults 20 to 54 who want to eat healthier | about 3.8 million | estimate: 3.59M aged 20 to 34 × 52.4% + 4.49M aged 35 to 54 × 42.6% (midpoint of 52.4% and 32.8%) |
| On a smartphone | about 99% of 25 to 54 | CBS 84888NED 2025, measured |
| Already paying for a health or fitness app (last 3 months), ages 25 to 54 | 13.16%, about 0.91 million people | Eurostat isoc_ec_ibgs I_BHLFTS2 2025 × Eurostat population 25 to 54 (6.89M), re-checked by Claude |
| Same, ages 16 to 74 | 9.15% (2024: 7.44%) | Eurostat, measured |

The paying layer is the surprise. In 2025, 9.15% of Dutch 16 to 74 year-olds paid for a health or
fitness app, against 5.41% in the EU; at 25 to 54 it is 13.16%, and it grew a fifth in one year.
One in eight adults in our core age band already has the habit of paying for an app like ours.
The share includes fitness and sport apps, so it is a ceiling for food apps, not a count of them.

What the market already shows a free Dutch food app can reach: Voedingscentrum's Mijn Eetmeter
has about 500,000 active users (May 2025, ANP report, secondary). Yazio has 28,100 ratings on the
Dutch App Store (read 2026-10-12). And since 1 June 2026 MDL Fonds runs a free "30 Planten
Challenge" with a tracking tool that also invites children: the 30-plants idea is now a Dutch
public campaign (participant numbers not published).

## 3. What a realistic share looks like (Netherlands, three years)

Revenue per payer: €39.99 a year, minus 21% Dutch VAT (€33.05), minus the 15% store commission
both stores charge small developers on subscriptions = €28.10 a year, €2.34 a month. A €3.99
monthly plan nets €2.80 a month; 68% of Health and Fitness subscriptions are annual (RevenueCat
2026). Germany: 19% VAT, €28.56 a year.

Assumptions: freemium (the habit free, extras paid, option A), download-to-paid 2.0% (RevenueCat
2026, Western Europe, all categories) to 2.9% (Health and Fitness, global median), €28.10 net per
annual payer (€39.99 after 21% VAT and 15% store commission, [[concept-business-model]]).

| Scenario | Installs in 3 years | Share of SAM | Payers | Share of the paying pool | Net revenue a year |
|---|---|---|---|---|---|
| Conservative | 15,000 | 0.4% | 300 (2.0%) | 0.03% | about €8,400 |
| Base | 50,000 | 1.3% | 1,250 (2.5%) | 0.14% | about €35,000 |
| Ambitious (Mijn Eetmeter shows the ceiling is far higher) | 150,000 | 4.0% | 4,350 (2.9%) | 0.48% | about €122,000 |

Against the goal ladder in [[concept-business-model]]: break-even on tools (about 30 annual
payers) needs 1,000 to 1,500 installs; "worth continuing" (€1,000 net a month, about 430 annual
payers) needs **15,000 to 21,000 installs**, 0.4% to 0.6% of the Dutch adults who want to eat
healthier. That is reachable with schools, youth health care and search alone; it does not need
a viral miracle. The ceiling question is the other way round: a full-time salary needs the
ambitious case or a second market.

Reach, the mission's measure ([[decision-2026-10-12-vision-mission]] when filed): the free habit
is where the "bigger problem" is solved. 150,000 Dutch users building the habit would be 1.4%
of the 10.9 million who do not eat enough vegetables every day.

## 4. Other markets: who pays, who needs it

| Market | Adults 25 to 54 | Pay for a health app, 25 to 54 | Paying pool | Households, youngest under 12 | Language |
|---|---|---|---|---|---|
| Netherlands | 6.89M | 13.16% | 0.91M | 1.29M | Live |
| Flanders | about 2.67M (estimate, 58% of Belgium) | 5.23% (Belgium) | about 0.14M (estimate) | about 0.53M (estimate) | Live (Dutch) |
| Italy | 22.15M | 2.77% | 0.61M | 3.87M | Live |
| Germany | 31.55M | 9.59% | 3.03M | 5.92M | Planned |
| France | 25.43M | 3.83% | 0.97M | 5.65M | Planned |
| United Kingdom | n/a (no Eurostat data after 2020) | not found | not found | about 8.5M families with dependent children | Live (English) |

Sources: Eurostat demo_pjan 2025 (population), isoc_ec_ibgs 2025 (subscriptions, re-checked),
lfst_hhnhtych 2025 (households; youngest under 12 is the sum of the under-6 and 6 to 11 bands,
dependent children only). Flanders from Statistiek Vlaanderen and a population-share estimate.

What it says:
- **Germany is the next revenue market**, with 3.3 times the Dutch paying pool and the second
  highest pay share. The de/fr gate of 2026-09-23 treats German and French together; on these
  numbers German comes first and French well after. **Decided 2026-10-12:**
  [[decision-2026-10-12-germany-before-france]] (German search base from November 2026).
- **Italy is a reach market, not a revenue market.** Three times the Dutch population, two
  thirds of the paying pool; Italians pay for health apps at a fifth of the Dutch rate. The need
  is bigger: only 5.4% of Italians eat five portions of fruit and vegetables a day (ISTAT 2024)
  and 25.9% of children aged 8 to 9 do not eat fruit or vegetables daily (ISS OKkio alla SALUTE
  2023). Italy fits the mission; it does not fund it.
- **Flanders is almost free to add** (the app and the site already speak Dutch) and adds about
  37% to the Dutch total market, but only about 15% to the paying pool.
- **The UK** is large and English is live, but Eurostat has no data after 2020; its numbers wait
  for an ONS or Ofcom source if the UK ever becomes a focus.

## 5. Channels in the Netherlands, with their reach

| Channel | Reach | Source | Fit |
|---|---|---|---|
| Youth health care (JGZ, consultatiebureau), through NCJ | 669,723 children aged 0 to 3; 44 JGZ organisations (2017); its guideline already names 25% to 45% eating problems and repeated tasting | CBS 03759ned; NCJ; JGZ guideline | The household persona at the moment the problem starts; one partner (NCJ) reaches the system |
| Primary schools: EU-Schoolfruit | 2,268 schools, 398,076 pupils (2025/26), of 5,986 primary schools and 1.36M pupils | WUR/RVO; CBS 03753 | "Keep tasting at home" during the 20 fruit weeks, already announced to parents through the school app |
| Smaaklessen (taste lessons) | claims 80% of primary schools | WUR food-education platform (programme claim) | Content partner; same idea as ours |
| MDL Fonds 30 Planten Challenge | free, since 1 June 2026, children welcome | mdlfonds.nl | Direct competitor or the most natural partner for the solo adult |
| Albert Heijn | 38.2% supermarket share (NielsenIQ 2025); 7.8% of supermarket sales online (Circana) | Distrifood | Affiliate and a protein-transition reason to back variety |
| Dietitians | 1,529 first-line dietitians (2018) | Nivel | Referral for the hard cases |
| Search (the learn hub) | 36% of adults want to eat healthier; pillar 3 search data in [[seo-pillar-healthy-eating-habits]] | | Already running, one article a night |

## 6. Caveats

- The subscription share counts any health or fitness app (gym, running, meditation included).
  It measures willingness to pay in the category, not demand for a food app.
- "Want to eat healthier" is from 2022 (the latest CBS wave found). Claude could not re-open the
  CBS release on 2026-10-12 (site errors); the figure is the research agent's reading of it.
- The Leefstijlmonitor changed its nutrition questions in 2023: 2023 and 2024 are comparable,
  earlier years are not. No 2025 nutrition figures yet.
- The 8 to 15 tastes range on our stats page is a synthesis of AAP (10 or more), CDC (8 to 10)
  and trials (12 to 14); the review found in this research (Taylor and Emmett) says 10 to 15.
  Both fit the stats page wording "8 to 15, sometimes more"; no change needed.
- Conversion benchmarks are vendor data from apps with paywalls on RevenueCat; Google Play
  converts at a third of iOS (0.9% against 2.6%, all categories), and our Dutch audience is
  about two thirds Android by web traffic (StatCounter, 12-month average 63%). The conservative
  scenario is the honest planning case until our own conversion exists.
- Household and age bands differ by source (CBS 0 to 5 and 6 to 11; Eurostat under 6 and 6 to
  11, dependent children only; Flanders estimated).
- Never in public copy: none of these numbers go into store, site or social copy without a row
  on [[brand-stats-and-claims]]; market and user counts stay internal.

## 7. Verification (Claude, 2026-10-12)

Re-queried at the source: CBS 71487ned households by youngest child (752,615 and 533,081, exact
match); CBS 85457NED adults with enough vegetables 7 days a week, 2024 (26.5%, exact match, with
its interval); Eurostat isoc_ec_ibgs I_BHLFTS2 for NL, IT, DE, FR, BE, EU27, 2024 and 2025, total
and 25 to 54 (exact match); Eurostat demo_pjan 2025 population 16 to 74 and 25 to 54 (fetched
directly). Not re-checked: the 2022 CBS wish to eat healthier (site down), the Mijn Eetmeter
user count (secondary), store install bands (read by the agent on 2026-10-12).

## Related pages

- [[strategy-backlog]] (rows 9, 10, 6) · [[concept-business-model]] ·
  [[source-research-app-benefits-2026-10]] · [[persona-believer]] ·
  [[persona-household-parent]] · [[seo-site-architecture]] (the de/fr gate) ·
  [[compare-projectfood-vs-competitors]] · [[brand-stats-and-claims]]
