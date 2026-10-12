# Market research data, 2026-10-12

Sourced data points behind [[source-research-market-size-2026-10]]. Collected on 2026-10-12 by
three research agents in Claude's session, at Ricardo's request ("how big is our market, start
with the Netherlands, document the sources"). Key figures re-checked by Claude against the
source APIs the same day (see the wiki page, section "Verification").

| File | Rows | What |
|---|---|---|
| `nl-be-demographics.csv` | 115 | Netherlands and Flanders: population by age, households by type and age of youngest child, smartphone and health-information use, mobile OS share. Mostly CBS StatLine OData, Statistiek Vlaanderen, Eurostat, StatCounter |
| `nl-problem-channels.csv` | 74 | Netherlands: fruit and vegetable guideline compliance (CBS/RIVM Leefstijlmonitor, VCP), wish to eat healthier, picky eating (Generation R), overweight, flexitarians; channels (JGZ, primary schools, EU-Schoolfruit, Smaaklessen, dietitians, supermarket shares, Mijn Eetmeter, parenting media) |
| `other-markets-benchmarks.csv` | 109 | Italy in depth; Germany, France, Belgium, UK top-line (Eurostat, ISTAT, ISS, ONS, StatCounter); app economics (RevenueCat State of Subscription Apps 2026, Sensor Tower, Eurostat paid health-app subscriptions, store install bands of comparable apps) |
| `eurostat_pop_16_74_2025.json` | | Population aged 16 to 74 and 25 to 54 per country, 1 January 2025 (Eurostat demo_pjan, query URL inside), used to turn subscription shares into head counts |

Columns: `market, metric, value, unit, period, status, source, url, (table_id,) note`.
Status: `measured` (official statistic or primary report), `estimate` (derived; the arithmetic
is in the note), `secondary` (an aggregator or press citing someone else), `not found` (what was
tried is in the note).
