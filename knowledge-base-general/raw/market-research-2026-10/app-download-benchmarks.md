# App download benchmarks for Project Food (research notes, 2026-10-12)

Scope: web research only. Each number has source URL, publisher, year, confidence.
"EST" = a third-party model estimate (Sensor Tower, Appfigures, AppMagic, AppTweak, Statista all estimate downloads; only AppBrain's Play bands are store-published buckets).
"MINE" = my own derivation, not a source.

## 1. Distribution of app downloads

### AppBrain, Google Play lifetime install bands (store-published bands, all ~2.02M listed apps)
URL: https://www.appbrain.com/stats/android-app-downloads (page "last updated 12 Oct 2026"; numbers pulled from the page's chart data)
| Band | Apps | Share |
|---|---|---|
| <100 | 481,809 | 23.8% |
| 100-1k | 572,669 | 28.3% |
| 1k-10k | 466,947 | 23.1% |
| 10k-100k | 294,227 | 14.5% |
| 100k-500k | 110,321 | 5.5% |
| 500k-1M | 29,894 | 1.5% |
| >1M | 66,565 | 3.3% |
=> <1k lifetime: 52%; <10k lifetime: 75%; >=100k lifetime: 10.3%. Includes old and junk apps; lifetime not per year; only currently listed apps. Confidence: high (counts), but population is all apps, not serious subscription apps.

### AppBrain cohort analysis: share of Play apps passing download milestones by weeks since launch (same URL, updated daily)
| Weeks since launch | >500 | >5,000 | >50,000 |
|---|---|---|---|
| 0 | 11% | 2.5% | 0.5% |
| 4 | 32% | 10% | 2.4% |
| 8 | 30% | 12% | 3.3% |
| 12 | 27% | 10% | 2.9% |
| 23 (~5 months) | 35% | 13% | 4.0% |
=> two thirds of new Play apps have not reached 500 installs ~5 months in; ~13% pass 5k, ~4% pass 50k. Most of the movement happens in the first 4 weeks, then the curve is almost flat (launch spike, low baseline). Confidence: high on the data, medium on interpretation (cohorts differ week to week).

### Appfigures, "By the Numbers: Analyzing App Downloads" (2023), EST
URL: https://appfigures.com/resources/insights/20230714
Sample: apps with >100 and <10M downloads in the last month (i.e. already excludes apps below 100/month).
- 47.7% got 100-1k downloads in the last 30 days; 33.3% got 1k-10k; ~80% under 10k/month (~300/day).
- ~14.7% (derived) 10k-100k/month; 3.8% 100k-1M/month; 0.5% 1M-10M/month.
Confidence: medium (model estimates; survivor sample; 2023).

### RevenueCat, State of Subscription Apps 2026 (2025 data, 115k+ apps, $16B revenue)
URL: https://www.revenuecat.com/state-of-subscription-apps ; summary at https://ppc.land/the-app-middle-class-is-dying-and-revenuecats-data-shows-exactly-how-fast/ ; https://saastr.com/the-top-10-learnings-from-revenuecats-state-of-subscription-apps-how-115000-mobile-apps-deliver-16b-in-revenue-whats-working-whats-quietly-killing-growth
- New apps reaching $1k MRR within 2 years: 17.3% (19% in prior report). $10k MRR: 4.6% (5.3% prior).
- Monthly revenue 1 year after launch: median ~$72; top quartile $429+; top 10% ~$2,500+ ($2,574).
- Download-to-paid by day 35: median 2.0% overall; Health & Fitness 2.9%; hard paywall 10.7% vs freemium 2.1%.
- Revenue per install D14: $0.23 median, H&F $0.48; D60: $0.34 median, H&F $0.66.
- Trial-to-paid ~37-43% (42.5% for 17-32 day trials; 25.5% for <=4 day trials).
- Year-1 realised LTV per payer: $23 global median; $32 North America.
- MRR growth YoY: median ~5%; top quartile +80%; top 10% +306%; bottom quartile -33%.
- New app launches tracked: ~14,700/month in 2026 vs ~2,000/month in 2022 (more competition).
Confidence: high (first-party revenue data, but revenue not installs).

### RevenueCat SOSA 2025 (2024 data)
URL: https://revenuecat.com/state-of-subscription-apps-2025 ; https://athletechnews.com/fitness-apps-monetizable-winner-take-all-or-most/
- H&F median D35 download-to-paid 2.7%; top 10% H&F 12.1%; all-category median ~1% (as reported by AthleteTech News).
Confidence: medium-high.

### Adapty, State of In-App Subscriptions 2025/2026
URLs: https://adapty.io/blog/health-fitness-app-subscription-benchmarks/ ; https://ppc.land/95-of-app-subscription-revenue-goes-to-top-10-adaptys-2026-benchmark-report/ ; https://adapty.io/blog/state-of-in-app-subscriptions-2025-in-10-minutes/
- H&F install-to-trial 11.2% global (14.5% NA); trial-to-paid 42.2%; install-to-paid ~3.7%; 12-month install LTV $1.21 (highest category).
- 95% of subscription revenue goes to the top 10% of apps (92.7% in 2023). 57.7% of new apps with any revenue make $1-1,000 per year.
- Netherlands median subscription price 62% above US (2025 report).
Confidence: medium-high (Adapty customer base, skewed to paywall-heavy apps).

### TechCrunch on RevenueCat 2024 report
URL: https://techcrunch.com/2024/03/12/most-subscription-mobile-apps-dont-make-money-new-report-shows/ - "most subscription apps don't make money"; median app < $50/month after 12 months (2024 report). Confidence: high.

## 2. Indie / bootstrapped examples (self-reported)
| App | Period | Installs | Channel | Source |
|---|---|---|---|---|
| Habit Doom (habit + app blocker, iOS/Android) | month 1 (Mar 2026) / by May 2026 | 97 (83 first-time) / 726 | 90.6% App Store search; PP conversion 7.9% | https://habitdoom.com/blog/what-82-ios-downloads-taught-me (2026) |
| GainFrame (fitness, iOS) | first 20 days | 305 (+~100 TestFlight) | Reddit organic + ~$335 small ads; PP conversion 5.8%; D7 download-to-paid 3.1%; $99 rev | https://gainframe.app/blog/two-months-launching-second-app/ (2026) |
| Screenshot Swipe (same dev) | lifetime | 432 downloads, $57 lifetime | - | same |
| Headroom (Mac app) | Product Hunt launch, #16, 130 upvotes | 20 downloads, EUR 0 after 2 weeks | Product Hunt | https://chippstudio.substack.com/p/1-launch-producthunt-first-update (May 2025) |
| AnyTracker (price tracker) | ~2.5 years to Jan 2024 | 80k total; ~1k in first Reddit week; ~10k after one YouTuber video, then ~1k/week for months | Reddit, YouTube, small ads; MRR $140 | https://indiehustle.beehiiv.com/p/hitting-80-000-downloads-for-his-price-tracking-app (2024) |
| Indie Hackers dev (portfolio of apps) | first full year (from Apr 2022) | ~120k downloads; $50,861 revenue; $3,012 MRR; 3,630 subs | not stated | https://www.indiehackers.com/post/50-000-revenue-in-one-year-0276d6a7df (2023) |
| HabitKit (Sebastian Roehl, habit tracker, solo, DE) | launched Nov 2022; $15k MRR at 18 months; $10k MRR end 2024; 2025: $602k revenue, $28k MRR, 25.1k subs | 272k App Store + 290k Google Play (period unclear, likely lifetime by end 2025) | no paid ads; build in public, ASO (top 5 for "habit tracker" US), MKBHD/YouTube features | https://sebastianroehl.substack.com/p/2025-the-year-that-changed-everything ; https://sebastianroehl.substack.com/p/2024-my-indie-app-business-year-in ; https://www.starterstory.com/habit-kit-breakdown |
| 21 Days Challenge (habit app) | 2018-2024, organic, no focused growth | 100k installs, 2k MAU (~17k/year) | organic | https://www.indiehackers.com/post/heres-my-build-in-public-challenge-for-2024-get-my-habit-tracker-app-to-1-million-downloads-6a186648f9 |
Note: HabitKit is the outlier and is global English with a "habit tracker" head keyword; it is the success case, not the base case.

## 3. Category sizes (Health & Fitness, Food & Drink)
- Sensor Tower: global H&F downloads 3.6B in 2024 (+6% YoY); Jan 2025 H&F IAP revenue $385M record (New Year spike). EST. https://sensortower.com/blog/state-of-mobile-health-and-fitness-in-2025 (2025). Confidence medium.
- AppTweak: H&F ~1.83B downloads Jan-Nov 2025; top 500 apps = ~78% of category downloads. EST, different methodology from Sensor Tower. https://www.apptweak.com/en/reports/most-downloaded-health-fitness-apps (Dec 2025).
- Sensor Tower (via ASO Mobile): Food & Drink ~2B downloads 2024 (+11% from 1.78B in 2023). EST. https://asomobile.net/en/blog/aso-in-the-food-drinks-category-trends-and-best-practices-for-2025/ Confidence medium-low (secondary).
- No public source gives a median downloads-per-app by category; RevenueCat/Adapty give conversion and revenue, not downloads.

## 4. Netherlands and Germany market
- NL total downloads 2023: ~583M (App Store + Google Play), Statista from DataReportal/data.ai, Feb 2024. EST; figure seen in search snippet, paywalled. https://www.statista.com/statistics/1382611/mobile-apps-downloads-netherlands/ Confidence medium. ~33 downloads per resident per year (MINE, 17.9M people).
- Statista Market Insights projected 591.4M NL downloads for 2022. https://www.statista.com/outlook/amo/app/netherlands/ EST.
- MINE: if H&F ~2.6% of downloads (3.6B of ~137B global) and Food & Drink ~1.5%, NL H&F ~15M/yr and F&D ~9M/yr installs. Low confidence.
- NL mobile OS share (StatCounter, web traffic not installs): Android 68.2% / iOS 31.8% (Sep 2026); June 2026 64.2/35.8. https://gs.statcounter.com/os-market-share/mobile/netherlands Confidence medium (pageview-based).
- Germany: ~2.4-2.46B downloads/yr (Statista outlook 2022 / AppMagic via Business of Apps 2023). EST. https://www.businessofapps.com/?p=90159 ; Bitkom/research2guidance: 2018 >2B (Play 1.4B / iOS 704M = 67/33), 2019 2.3B. https://www.mobiflip.de/deutscher-app-markt-auf-rekordkurs/amp/
- Top-of-chart daily downloads, NL H&F, Sensor Tower Q-reports (EST):
  - Q3 2025 Android NL top 5: Blood Pressure app peak 16.7k/week; komoot 10.2k->3.3k/week; LazyFit up to 11.1k/week; Step Counter 5-6.5k/week; Strava ~5k/week. => ~700-2,400/day for the top 5 on Android. https://sensortower.com/blog/2025-q3-android-top-5-health%20and%20fitness-units-nl-600af518241bc16eb8dce802
  - Q1 2025 Android NL top 5: LazyFit 15k->5.8k/week; Step Counter 5.5-8.4k; Foodvisor 10.3k->4k; YAZIO 15k->2.6k (January peak then decay); Strava 4.4-5.7k. https://sensortower.com/blog/2025-q1-android-top-5-health%20and%20fitness-units-nl-600af518241bc16eb8dce802
  - Q2 2024 unified NL: StepUp pedometer peak 60.7k/week; Strava 13.6k->9.8k/week. https://sensortower.com/blog/2024-q2-unified-top-5-health%20and%20fitness-units-nl-600af518241bc16eb8dce802
  - Q1 2025 unified Belgium top 5: Macadam peak 20k/week; Ma MC 8-10k; Helena 7-10k; Basic-Fit 12.3k->5.7k; Foodvisor 11.7k declining. https://sensortower.com/blog/2025-q1-unified-top-5-health%20and%20fitness-units-be-600af518241bc16eb8dce802
  - Q1 2024 Germany: YAZIO 91k/week in early Jan -> 28k late March; Flo 21-36k/week. https://sensortower.com/blog/2024-q1-unified-top-5-health%20and%20fitness-revenue-de-600af518241bc16eb8dce802
  - Q4 2025 NL food: Too Good To Go peak ~18k/week. https://sensortower.com/blog/2025-q4-unified-top-5-food-delivery-services-units-nl-63da96fbe1714cfff1c1e5a1
  Most top-5 apps run paid UA; these are not organic benchmarks.
- US benchmarks for scale (Sensor Tower 2022): top 10 overall non-game iPhone 52k/day, #1 156k/day; top 10 Entertainment category 25k/day iPhone, 18k Android. https://sensortower.com/blog/app-downloads-to-number-one-2022
- AppTweak: Germany is the most competitive European market; Germany Travel #1 on Play ~8k/day; Spain Travel #1 ~4.4k/day. https://www.apptweak.com/en/aso-blog/number-of-downloads-to-reach-top-rankings (updated Jul 2025, 2022 data).
- No public source found for downloads needed for top 100 in a NL category. MINE (low confidence): with the top 5 at ~700-2,400/day on Android and steep power-law decay, rank ~50-100 in NL H&F or Food & Drink probably needs tens of downloads per day per store (order 15-60/day); rank ~10 a few hundred/day. Verify with Appfigures/AppTweak trial or Apple's own App Analytics once live.
- Apple: ~65-70% of App Store downloads follow a search. https://www.marketingdive.com/news/apple-rides-momentum-of-app-store-search-ads-into-new-countries/440932 (2016); https://gummicube.com/blog/apple-releases-new-search-ads-statistics . Confidence medium (old Apple stat).

## 5. Launch curves, Product Hunt
- AppBrain cohort (above): most new apps get most early installs in the first ~4 weeks, then flatten.
- H&F seasonality: January is the peak month (Sensor Tower; YAZIO DE 91k/week early Jan -> 28k by March; NL LazyFit and YAZIO similar decay).
- Product Hunt traffic poll (~2023): 52% of launches <1k unique visitors; 28% 1-5k; 7% 5-10k; 14% >10k. MindOne: ~1,000 app users from its launch. https://www.producthunt.com/p/general/poll-how-much-traffic-did-you-get-from-your-recent-launches-on-product-hunt
- Product Hunt guides: strong launches 5k-50k visitors in 48h; PH audience is desktop/web-heavy and drives web clicks more reliably than App Store installs. https://screenfast.app/blog/how-to-launch-ios-app-product-hunt (Jul 2026). Headroom #16 -> 20 downloads (above). One Task X #4 -> ~2,000 site visitors in 2 weeks. https://akoskm.substack.com/p/launch-now-think-later (2025)
- Product page view -> install conversion for small indie apps: 5.8% (GainFrame), 7.9% (Habit Doom).

## 6. Referral / word of mouth (k-factor)
- Rahul Vohra (2012), consumer internet: sustainable 0.15-0.25, great 0.4, outstanding 0.7. Via https://www.saxifrage.xyz/post/k-factor-benchmarks (Michael Taylor, 2020). Confidence medium.
- Extole referral program model: ~0.05 (19% advocates x 2 shares x 13% conversion). Same source.
- Dropbox with incentives ~0.6-0.7; k>1 sustained only for social/messaging. https://founderpath.com/viral-coefficient-calculator ; https://echai.ventures/startingup/retention-referral/what-s-a-viral-coefficient-and-is-chasing-a-k-factor-above-1-realistic-for-my-kind-of-product
- A claimed "Adjust median 0.45" could not be verified on Adjust's page (https://www.adjust.com/blog/measuring-k-factor/ only gives a worked example); do not use.
- MINE: invites to a partner or grandparent join an existing household and do not add a new family; for new families expect k ~0.05-0.2 => multiplier 1/(1-k) = 1.05-1.25x on other channels.

## 7. Triangulation (MINE)
- RevenueCat median app revenue ~$72/month after year 1 (~$860/yr). With 12-month revenue per install ~$0.5-1.2 (RevenueCat D60 RPI $0.34 all / $0.66 H&F; Adapty H&F 12-mo install LTV $1.21), the median subscription app sees roughly 1k-2k installs a year; top quartile ($429/mo) ~4-10k; top 10% (~$2.5k/mo) ~25-60k. Crude, global, all markets combined.
- Project Food base case NL alone 17k = 47/day all year; conservative 5k = 14/day; ambitious 50k = 137/day.
- Base across six markets (year 1 per market): 17+15+6+9+3+3 = 53k; conservative 17k; ambitious 153k.
