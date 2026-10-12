# Comparable app downloads: sanity check for first-year installs

Research date: 2026-10-12. Purpose: test the year-1 install assumptions (NL 17k, DE 15k, IT 6k) against real apps.

## Method and how to read the numbers

- **Play installs** come from each app's public Google Play page. Next to the public band ("100K+") the page source carries Google's exact lifetime install count, e.g. `["1,000,000+",1000000,1814178,"1M+"]` for Solid Starts. Both are shown below as `band (exact)`. This is a lifetime count of users who installed, not active users. Fetched with `hl=en&gl=US` (gl=NL for AH/Jumbo).
- **Android installs per year** = exact lifetime installs / years since launch (as of 2026-10-12). It is an average; real curves are back-loaded or front-loaded.
- **Launch date**: App Store `releaseDate` (iTunes lookup API) where the Play "released on" field looked unreliable (several older apps show "Jul 4, 2024" or their last update date).
- **iOS ratings** come from the iTunes lookup API per storefront, `https://itunes.apple.com/lookup?id=<id>&country=<cc>`. They are lifetime rating counts for that country.
- **Ratings-to-installs ratio, calibrated on Dutch-only apps** (the strongest evidence here, our own derivation). For apps used almost only in NL, set iOS NL ratings against Play installs and correct for the NL split (StatCounter, mid-2026: Android ~64%, iOS ~36%, so iOS installs ≈ 0.56 × Play installs):

| NL-only app | iOS NL ratings | Play exact installs | Ratings per Play install | Implied iOS installs per rating |
|---|---|---|---|---|
| Mijn Eetmeter | 16,793 | 1,998,208 | 1 : 119 | ~1 : 67 |
| Kies Ik Gezond? | 5,502 | 577,999 | 1 : 105 | ~1 : 59 |
| GroeiGids | 1,326 | 175,857 | 1 : 133 | ~1 : 74 |
| Slim Koken | 2,426 | 348,826 | 1 : 144 | ~1 : 80 |
| ZwangerHap | 7,721 | 392,713 | 1 : 51 | ~1 : 28 |
| Ouders van Nu | 184 | 45,760 | 1 : 249 | ~1 : 139 |
| Svezzy (IT-only, Android ~75%) | 143 (IT) | 15,304 | 1 : 107 | ~1 : 36 |

  Rule of thumb: **one iOS rating ≈ 30 to 140 iOS installs, median ~70**, which falls inside the 1:50-200 brief. Public sources only give looser bounds: Marco Arment (Instapaper) put it at under 2% of *frequent* users rating ([marco.org](https://marco.org/60914660)), and one industry roundup says about 0.05% of all users review ([growave summary](https://www.growave.io/it/blog/what-percent-of-customers-leave-reviews)); a rating counts as much more than a review. Apps that prompt for ratings well (Solid Starts, Finch) get a far higher ratio, so use ratings only as an order-of-magnitude proxy.

- **Third-party estimates** are marked *(estimate)*. Most Sensor Tower, Appfigures and AppMagic pages need a login. The one public estimate found for Joon (ScreensDesign: "<5k installs, $5k/month") contradicts Play's own count (158k across its two apps), so treat such pages as unreliable.

## The table

Abbreviations: P = Play exact lifetime installs, /yr = Android installs per year since launch.

### A. Picky eating, weaning and kids' food

| App | Publisher / country | Launch | Play band (exact) | Android /yr | iOS ratings (country) | Notes / drivers | Sources |
|---|---|---|---|---|---|---|---|
| Solid Starts: Baby Food App | SolidStarts LLC, US | May 2021 | 1M+ (1,814,178) | ~333k | US 46,073; GB 6,084; DE 1,707; NL 829; IT 277 | Claims 6M users, 4.9★ from 42k+ reviews. Instagram started March 2019 and had 1.6M+ followers (2.7M by another count) **before** the app, plus a free First Foods database with ~1M visits/month. Bootstrapped, no paid ads per the case study; HarperCollins book 2025. $99.99/yr subscription. | [Play](https://play.google.com/store/apps/details?id=com.digitas.solidstarts) · [iOS US](https://apps.apple.com/us/app/id1564189151) · [Foundry case study](https://www.builtbyfoundry.io/blog/jenny-best-solid-starts-baby-food-app) · [YPulse](https://www.ypulse.com/newsfeed/2022/06/30/baby-led-weaning-has-taken-off-big-with-millennial-parents-and-solid-starts-is-teaching-them-how-its-done/) |
| Playful Eats: Fix Picky Eating | SpeakEasy Community LLC, US | Aug 2024 | 10K+ (10,611) | ~4.9k | US 8 | Closest concept to ours (picky eating, play). Android-heavy with almost no iOS ratings, which suggests Android ads or ASO rather than word of mouth. | [Play](https://play.google.com/store/apps/details?id=com.playfuleats.playfuleats) · [iOS](https://apps.apple.com/us/app/id6504419753) |
| ARFID & Picky Eaters - Pitaya | Gerard Konopielko (solo), UK/PL | iOS Sep 2023, Play Nov 2024 | 1K+ (2,434) | ~1.3k | US 130; GB 30; NL 5; DE 5 | Solo indie, ARFID niche. iOS-led: ~165 ratings ≈ 10k iOS installs in 3 years (estimate from the ratio). | [Play](https://play.google.com/store/apps/details?id=konopielko.pitaya) · [iOS](https://apps.apple.com/us/app/id6448952961) |
| Eat the Rainbow Food Journal | Dancing Robots Inc., US | Jan 2019 | 100+ (249) | <100 | US 157 | An "eat the rainbow" tracker with low reach after 7 years: an iOS-only niche. | [Play](https://play.google.com/store/apps/details?id=app.eattherainbow.android.v2) · [iOS](https://apps.apple.com/us/app/id1441463086) |
| Food Hopper (food chaining) | Brittyn Coleman Nutrition (RD), US | Dec 2025 | (iOS only) | – | US 14 | Food-chaining app by a dietitian-influencer; small after 10 months. | [iOS](https://apps.apple.com/us/app/id6753869831) |
| Easy Bites Child Feeding Coach | Easy Bites App Ltd, UK | Nov 2021 | – | – | US 31 | UK feeding-coach app; small. | [iOS](https://apps.apple.com/us/app/id1562987724) |
| First Bites: Baby Food Tracker | First Bites LLC, US | Jul 2025 | 1K+ (3,880) | ~3.2k | – | New indie weaning tracker. | [Play](https://play.google.com/store/apps/details?id=first.bites.app) |
| Happy Eaters: Weaning Recipes | Savycode Pvt Ltd, IN | Oct 2023 | 100K+ (223,494) | ~76k | US 15 | ASO/keyword publisher: big on Android, almost nothing on iOS. Shows that Android "baby food" search volume can reach 100k+, with low engagement. | [Play](https://play.google.com/store/apps/details?id=happy.eaters.picky.baby.led.weaning.feeding.BLW.toddler.recipes.solids.meal.planner.nutrition.diet.chart) · [iOS](https://apps.apple.com/us/app/id6469004584) |
| Start Solids & Baby Recipes (Eerste Hapjes / Beikost App & Babybrei / Svezzamento) | Wiserapps, TR | Oct 2023 | 100K+ (159,704) | ~54k | US 103; DE 33; IT 23; GB 16; NL 7 | Multi-locale ASO publisher with localised titles per store. Volume comes from search, not from a brand. | [Play](https://play.google.com/store/apps/details?id=co.wiserapps.babyweaningsolids) · [iOS NL](https://apps.apple.com/nl/app/id6469321012) |
| Baby Food Tracker: BLW Recipes | Avo Parenting | Mar 2022 | 50K+ (55,264) | ~12k | – | Weaning tracker. | [Play](https://play.google.com/store/apps/details?id=com.linasoft.startsolids) |
| Eat Smart Kiwi: Food Diary | Eat Smart Kiwi, NZ | Nov 2019 | 50K+ (92,834) | ~13k | – | Food diary. | [Play](https://play.google.com/store/apps/details?id=com.eatsmartkiwi.app) |
| Tiny Tastes | Little Turtle | Oct 2014 | – | – | US 2 | Effectively dead. "Kiddo" (picky eater) has no live store match; the only "Kiddo" on Play has 193 installs and is unrelated. | [iOS](https://apps.apple.com/us/app/id926928170) |

### B. Plant-diversity ("30 plants") trackers

| App | Publisher / country | Launch | Play band (exact) | Android /yr | iOS ratings (country) | Notes / drivers | Sources |
|---|---|---|---|---|---|---|---|
| Plant Points: 30 plants a week (Pflanzenpunkte, 30 planten per week) | Alexander Everett (solo), UK | Oct/Nov 2024 | 5K+ (9,424) | ~4.9k | GB 145; US 103; DE 93; NL 5; IT 0 | The category leader among indies. Localised (DE title). Total across both stores ≈ 35-45k installs in ~2 years worldwide (estimate: ~350+ ratings × ~70-100, plus Play). | [Play](https://play.google.com/store/apps/details?id=com.everettappdevelopment.plant_points) · [iOS GB](https://apps.apple.com/gb/app/id6736978153) |
| Thirty Plants | Fred Shepherd (solo), UK | Apr 2024 | 5K+ (9,567) | ~3.9k | GB 97; US 47; DE 10; NL 2 | Social "friends" feature added 2025. ≈ 20-25k installs in 2.5 years (estimate). | [Play](https://play.google.com/store/apps/details?id=thirtyplants.app) · [iOS](https://apps.apple.com/gb/app/id6447438431) |
| Eat 30 Plants: Vielfalt essen | Mehr vom Guten OG (Katharina Seiser), AT | iOS Dec 2025; Android Oct 2026 | not shown yet | – | DE 107 (in 10 months); GB 5 | Built on the author's bestselling cookbook "30 Pflanzen pro Woche" (with TU Graz microbiome researcher Gabriele Berg) and her press (futurezone). ~107 DE ratings ≈ 7-10k iOS installs in the DE store in year 1 (estimate), plus the AT store. €29.90/yr. **Closest DACH comparable for the adult angle.** | [Play](https://play.google.com/store/apps/details?id=com.mehrvomguten.eat30plants) · [iOS DE](https://apps.apple.com/de/app/id6755008948) · [futurezone](https://futurezone.at/apps/eat30plants-ernaehrungsapp-aus-oesterreich-vielfaeltig-katharina-seiser/403113912) |
| 30 Plants: Gut Health | Appstream Ltd, UK | Nov 2025 | – | – | US 34; GB 11 | Small. | [iOS](https://apps.apple.com/us/app/id6755143067) |
| Eating30, Herbyvore, Plant30, Vegeroo, Eat Thirty Plants, Eat Plants, Planty | various solo devs | 2024-2026 | 50+ to 500+ | <1k | 0-10 | A crowded long tail: most reach a few hundred installs. | [Eating30](https://play.google.com/store/apps/details?id=com.mindtrekapps.thirtyplants) · [Herbyvore](https://play.google.com/store/apps/details?id=com.kleinebroetchen.herbyvore) · [Plant30](https://play.google.com/store/apps/details?id=com.tworuby.plant30) · [Eat Thirty Plants](https://play.google.com/store/apps/details?id=com.patrickalvarez.eatthirtyplants) |
| ZOE Health | ZOE Ltd, UK | iOS Aug 2019 | 100K+ (174,928) | ~36k | GB 27,035; US 7,043; NL 47 | Scale reference, not a comparable: driven by the ZOE podcast, Tim Spector's books, COVID study fame and heavy paid ads. GB iOS ratings imply ~1.5-2M UK iOS installs (estimate). | [Play](https://play.google.com/store/apps/details?id=com.joinzoe.results) · [iOS GB](https://apps.apple.com/gb/app/id1471632228) |

### C. Dutch, German and Italian family and food apps

| App | Publisher / country | Launch | Play band (exact) | Android /yr | iOS ratings (country) | Notes / drivers | Sources |
|---|---|---|---|---|---|---|---|
| Mijn Eetmeter | Voedingscentrum, NL | Jul 2013 | 1M+ (1,998,208) | ~150k | NL 16,793 | Government nutrition authority, free, referenced by dietitians and schools. ">2.5M downloads" per press. | [Play](https://play.google.com/store/apps/details?id=nl.voedingscentrum.eetmeter) · [iOS NL](https://apps.apple.com/nl/app/id663382012) · [ID.nl](https://id.nl/huis-en-entertainment/mobiel/smartphone-en-tablet/gezonder-eten-zo-werkt-de-eetmeter-app-van-het-voedingscentrum) |
| Kies Ik Gezond? | Voedingscentrum, NL | Jan 2018 | 500K+ (577,999) | ~66k | NL 5,502 | Barcode scanner with Voedingscentrum authority and press. | [Play](https://play.google.com/store/apps/details?id=nl.voedingscentrum.voedingsapp) · [iOS NL](https://apps.apple.com/nl/app/id1184292666) |
| ZwangerHap | Voedingscentrum, NL | Feb 2019 | 100K+ (392,713) | ~51k | NL 7,721 | Pregnancy food app recommended by midwives (verloskundigen): a channel that reaches every pregnancy. | [Play](https://play.google.com/store/apps/details?id=com.voedingscentrumzwangerschapsapp) · [iOS NL](https://apps.apple.com/nl/app/id1194610209) |
| Slim Koken | Voedingscentrum, NL | 2011-12 | 100K+ (348,826) | ~24k | NL 2,426 | Recipe app. | [Play](https://play.google.com/store/apps/details?id=nl.voedingscentrum.slimkoken) · [iOS NL](https://apps.apple.com/nl/app/id477672893) |
| GroeiGids | GGD GHOR Nederland, NL | Jan 2021 | 100K+ (175,857) | ~31k | NL 1,326 | Official youth-health-care (consultatiebureau) app, handed to parents by the JGZ. **The best NL proxy for "every parent of a young child can be told about it"**: ~31k Android + ~17k iOS ≈ 45-50k/yr against ~166k births/yr. | [Play](https://play.google.com/store/apps/details?id=nl.eaglescience.groeigids) · [iOS NL](https://apps.apple.com/nl/app/id1541607856) |
| Ouders van Nu - Zwanger & Baby | DPG Media, NL | Mar 2025 | 10K+ (45,760) | ~29k | NL 184 | **The best NL year-1 benchmark**: a new app from a 40-year-old magazine brand with its own site traffic, ≈ 45-50k installs in ~19 months across both stores (estimate). | [Play](https://play.google.com/store/apps/details?id=com.dpg.oudersvannu) · [iOS NL](https://apps.apple.com/nl/app/id6741474204) |
| 24baby.nl - Zwanger & Baby | 24Baby Group B.V., NL | May 2019 | 100K+ (450,734) | ~61k | NL 8,463 | Pregnancy calendar plus community, with SEO-heavy site traffic behind it. | [Play](https://play.google.com/store/apps/details?id=nl24.baby.android) · [iOS NL](https://apps.apple.com/nl/app/id1451304370) |
| Oei, ik groei! / The Wonder Weeks | Twise Victory Publishing BV, NL | May 2012 | 500K+ (742,482, current package) | – | US 122,223; DE 39,610; GB 39,548; NL 10,139; IT 1,436 | **The NL parenting success story.** Driven by the book (since 1992, dozens of languages) and the "leaps" concept spreading by word of mouth; was a top-10 paid app in NL in 2014-15. A paid app at first. | [Play](https://play.google.com/store/apps/details?id=org.twisevictory.apps.ex) · [iOS NL](https://apps.apple.com/nl/app/id529815782) · [iCulture top 10](https://www.iculture.nl/nieuws/populairste-ios-apps-nederland-week-46-2014/) |
| Albert Heijn (scale only) | AH, NL | 2009-10 | 5M+ (7,888,432) | – | NL 213,817 | Scale ceiling for an NL consumer app. | [Play](https://play.google.com/store/apps/details?id=com.icemobile.albertheijn) |
| Jumbo (scale only) | Jumbo, NL | Dec 2014 | 1M+ (3,308,223) | – | NL 11,755 | Scale. | [Play](https://play.google.com/store/apps/details?id=com.icemobile.jumboclient) |
| Yazio (scale only) | YAZIO GmbH, DE | 2014 | 50M+ (58,378,627) | – | DE 445,615; NL 28,069 | German calorie counter built on heavy paid acquisition. | [Play](https://play.google.com/store/apps/details?id=com.yazio.android) · [iOS DE](https://apps.apple.com/de/app/id946099227) |
| Beikost App | Fabiennes Familyfood (Fabienne Uphoff), DE | Jul 2024 | 10K+ (19,980) | ~8.8k | DE 118 | **Influencer-led DACH comparable**: built by a food creator with ~183k Instagram followers (@fabiennes.familyfood). ≈ 12-15k installs/yr in both stores (estimate). | [Play](https://play.google.com/store/apps/details?id=com.familyfood.beikostapp) · [iOS DE](https://apps.apple.com/de/app/id6504430559) · [HypeAuditor](https://hypeauditor.com/instagram/fabiennes.familyfood/) |
| Grubsy: Beikost App - BLW Brei | Bytcrft Studio (Lukas Ehlers), DE | Sep 2025 | 10K+ (11,427) | ~10k | DE 40 | Indie DE weaning app; ~11k Android in year 1. The English Play listing suggests international Android traffic. | [Play](https://play.google.com/store/apps/details?id=com.fragtex.beikostapp) · [iOS DE](https://apps.apple.com/de/app/id6751953203) |
| Nutrilini - Familienernährung | nutrilini GmbH, DE | 2024 | 1K+ (3,273) | ~1.2k | DE 21 | A German startup in family nutrition with little traction: a cautionary data point for DE. | [Play](https://play.google.com/store/apps/details?id=com.nutrilini.nutrilini) · [iOS DE](https://apps.apple.com/de/app/id1631103039) |
| GrowwW: Beikost mit Kinderarzt | Becomyng GmbH, DE | Mar 2024 | – | – | DE 12 | Pediatrician-branded DE app; tiny. A pediatric label alone does not drive installs. | [iOS DE](https://apps.apple.com/de/app/id6452396412) |
| Svezzy | SVEZZY SRL, IT | Apr 2025 | 10K+ (15,304) | ~10.5k | IT 143 | **Italian comparable**: an "innovative startup" with menus written by a pediatric nutritionist. ≈ 15-18k installs in both stores in ~17 months (Italy is ~75% Android); the developer said "6,000+ downloads" at an earlier point. | [Play](https://play.google.com/store/apps/details?id=it.logixsoftware.svezzy) · [iOS IT](https://apps.apple.com/it/app/id6744905123) |

### D. Family chore and habit apps with gamification for kids

| App | Publisher / country | Launch | Play band (exact) | Android /yr | iOS ratings (country) | Notes / drivers | Sources |
|---|---|---|---|---|---|---|---|
| Joon (parent app + Joon Pet Game for kids) | Joon App Inc., US | Jun 2020 | 10K+ (25,906) + 100K+ (132,609) | – | US 6,561 (parent app); US 750 (Pet Game) | ADHD positioning, a hard paywall with a 7-day trial, paid social. Revenue *(estimate, ScreensDesign)* $5-11k/month, which looks low against the ratings. | [Play](https://play.google.com/store/apps/details?id=com.joon.android) · [Play kids](https://play.google.com/store/apps/details?id=com.JoonAppInc.JoonKids) · [iOS](https://apps.apple.com/us/app/id1482225056) · [ScreensDesign](https://screensdesign.com/apps/joon-kids-adhd-chore-tracker/) |
| S'moresUp | Rotation 5 LLC, US | Dec 2017 | 100K+ (199,108) | ~25k | US 896 | Chores app. | [Play](https://play.google.com/store/apps/details?id=com.rotation5.smoresup) · [iOS](https://apps.apple.com/us/app/id1287367596) |
| Homey - Chores and Allowance | HomeyLabs, US | Nov 2015 | 100K+ (112,579) | ~10k | US 2,777 | Chores and allowance. | [Play](https://play.google.com/store/apps/details?id=com.homey.app) · [iOS](https://apps.apple.com/us/app/id1033286805) |
| OurHome (by Elusios) | Elusios, FR | Play 2024, iOS Oct 2025 | 50K+ (60,851) | – | US 89 | Not the original 2014 OurHome, which is no longer listed. | [Play](https://play.google.com/store/apps/details?id=com.elusios.ourhome) · [iOS](https://apps.apple.com/us/app/id6753957205) |
| Brili Routines | Brili GmbH, DE | Feb 2021 | 50K+ (94,663) | ~17k | US 602; GB 118; DE 50; NL 17 | German company with an English-first market (ADHD routines). | [Play](https://play.google.com/store/apps/details?id=com.briliadult) · [iOS](https://apps.apple.com/us/app/id1516036620) |
| Child Reward | Bartosz Smyk (solo), PL | Jul 2019 | 100K+ (181,136) | ~25k | – | **Solo-dev kids reward chart**: ~25k Android a year for 7 years on ASO alone. | [Play](https://play.google.com/store/apps/details?id=com.childreward) |

### E. Habit apps, solo or small founders (scale)

| App | Publisher / country | Launch | Play band (exact) | Android /yr | iOS ratings (country) | Notes / drivers | Sources |
|---|---|---|---|---|---|---|---|
| Streaks | Crunchy Bagel (Quentin Zervaas, team of 2), AU | Jun 2015 | iOS only (paid) | – | US 27,350; GB 4,236; DE 3,613; NL 752; IT 723 | Apple Design Award 2016 plus repeated App Store featuring. A paid app. | [iOS](https://apps.apple.com/us/app/id963034692) · [Daring Fireball](https://daringfireball.net/linked/2024/11/30/streaks-and-little-streaks) |
| Habitica | HabitRPG Inc., US | 2013 web; app Jul 2015 | 5M+ (8,358,591) | ~770k | US 3,496; DE 375; NL 70 | Kickstarter 2013 (2,817 backers, $41k), Lifehacker and Reddit, an open-source community. Android-heavy. | [Play](https://play.google.com/store/apps/details?id=com.habitrpg.android.habitica) · [Wikipedia](https://en.wikipedia.org/wiki/Habitica) |
| Finch: Self-Care Pet | Finch Care PBC (2 founders), US | May 2021 | 10M+ (16,419,850) | ~3M | US 762,350; GB 77,931; DE 12,993; NL 5,981 | Word of mouth (TikTok/Tumblr), performance marketing later, Editors' Choice. ~$1M/month revenue *(estimate, press roundups)*. | [Play](https://play.google.com/store/apps/details?id=com.finch.finch) · [iOS](https://apps.apple.com/us/app/id1528595748) · [FoxData](https://foxdata.com/en/blogs/finch-as-app-store-editors-choice-a-self-care-companion/) |
| Huckleberry (parenting scale) | Huckleberry Labs, US | Jun 2017 | 1M+ (2,361,774) | – | – | VC-funded baby sleep app. | [Play](https://play.google.com/store/apps/details?id=com.huckleberry_labs.app) |
| Kinedu (parenting scale) | Kinedu Inc., MX/US | Mar 2018 | 5M+ (7,937,563) | – | – | VC-funded, heavy paid acquisition. | [Play](https://play.google.com/store/apps/details?id=com.kinedu.appkinedu) |

## Context numbers
- NL live births 2025: 166,588 ([CBS](https://www.cbs.nl/nl-nl/cijfers/detail/37201)).
- NL mobile OS share, mid-2026: Android ~64%, iOS ~36% ([StatCounter](https://gs.statcounter.com/os-market-share/mobile/netherlands)).

## Reading (summary)

**Typical indie reach.** A solo or small app in this niche with no anchor channel reaches **2-10k installs in year 1 worldwide**, and usually **10-45k after 2-3 years**. Examples: Plant Points (~35-45k in 2 years, the best of the 30-plants indies), Thirty Plants (~20-25k in 2.5 years), Pitaya (~12k in 3 years), Playful Eats (~11k Android in 2 years). Most 30-plants trackers stay under 1k. The country-specific apps with one strong channel reach **10-15k per year in one market**: Beikost App (DE, influencer with 183k followers), Svezzy (IT, pediatric-nutritionist startup), Grubsy (DE), Eat 30 Plants (DACH, a bestselling cookbook author: roughly 7-10k iOS in the DE store in year 1).

**Who passed 100k and why.**
- Audience before the app: Solid Starts (1.6M+ Instagram followers built over 2 years before launch, a free database with ~1M visits/month, no paid ads) and Wonder Weeks (a bestselling book since 1992).
- An institutional channel that reaches every parent: GroeiGids (consultatiebureau), ZwangerHap (midwives), Voedingscentrum apps (authority and press).
- A media brand with its own traffic: Ouders van Nu, 24baby.
- Store featuring or awards: Streaks, Finch.
- Kickstarter and community: Habitica.
- Pure Android ASO or paid installs: Happy Eaters, Wiserapps, Child Reward. These reach 100k+ with weak iOS signals, meaning low-quality installs.
- A "pediatric" label on its own did not drive installs (GrowwW: 12 DE ratings).

**Verdict on NL 17k in year 1 without ads: optimistic.** The two NL apps with a real reach channel did roughly 30k Android installs a year, so ~45-50k across both stores:
- Ouders van Nu, a new app in 2025 from a big media brand;
- GroeiGids, handed out by the consultatiebureau.

17k is a third of what a national media brand gets. No comparable indie in the niche reached 17k in one small country in its first year without an audience or partner. Bands for NL year 1:
- **Base case, organic only: ~3-8k.** ASO in Dutch, launch PR, personal network.
- **17k is reachable only with at least one anchor:**
  - a Dutch parenting creator (roughly 100k+ followers) who co-launches;
  - or recurring press (e.g. a Voedingscentrum or JGZ mention, an RTL/NOS item);
  - or school or daycare distribution.
- **Above 17k needs the Solid Starts pattern**: the audience exists before the app.

On the other markets:
- **DE 15k** matches the influencer-led Beikost App and Eat 30 Plants, both of which had a known creator behind them, so it is plausible only with a German partner.
- **IT 6k** is realistic, even conservative: Svezzy did ~15k in 17 months.

Rating check for later: at ~1 iOS rating per ~70 iOS installs, 17k NL installs (~6k iOS) would show as roughly 80-100 NL App Store ratings by the end of year 1.
