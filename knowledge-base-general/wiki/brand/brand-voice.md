---
title: Brand voice (tone of voice)
type: brand
tags: [brand, tone-of-voice, copy, writing-kit]
created: 2026-09-24
updated: 2026-09-24
sources: [source-brand-promise-deck.md, source-family-mode-context.md, seo-app-store-aso.md]
---

# Brand voice

**In one line:** Project Food writes like a parent who has done the reading: calm, specific, on
your side, never a lecture. Second person to the adult who holds the phone. Two registers in one
product: parent-facing calm, kid-visible playful.

> First draft 2026-09-24 (Claude, from the design-library content fundamentals, the Play listing
> rules and the SEO principles). Ricardo reads the four dials in section 2 and moves any mark;
> that reading turns backlog row 8 into a decision page. Loaded by the `pf-voice` skill before
> any user-facing copy. Companions: [[brand-humour]] · [[brand-stats-and-claims]]. Guardrails:
> [[concept-brand-pillars]].

---

## 1. Who speaks, to whom

- **The speaker** is a parent who did the reading. Not a nutritionist, not a coach, not a mascot.
  Knows the research, has stood at a table with a plate coming back untouched, and has stopped
  taking it personally.
- **The listener** is the adult who holds the phone ([[persona-household-parent]]). Always
  "you" (NL je, IT tu). The child is never addressed on the store, the site, in notifications or
  in email.
- **The child** appears in the third person. In the app's kid-visible surfaces (card fact,
  celebration sheet, achievement names) the child reads or hears a single line, and that line
  is still written by the calm parent.
- **The family is the subject and the word.** "The family tastes, you tap" ([[seo-app-store-aso]]).
  Website articles may use the search vocabulary ("kids", "kinderen", "bambini") in titles and
  body text; the store name, short description and screenshots never say "for kids".

---

## 2. The four dials

Framework: NN/g's four dimensions of tone of voice (funny to serious, formal to casual,
respectful to irreverent, enthusiastic to matter-of-fact), each a scale with a neutral middle.
Marks run 1 to 5. Two registers, side by side.

| Dial | Parent register (site, store, app chrome, notifications, printables, social, email) | Kid-visible register (celebration sheet, card facts, achievement names) | Why |
|---|---|---|---|
| Formal 1 · Casual 5 | **4, casual.** je / tu / you, contractions, short words. No slang, no "u", no "Lei". | **4.** The same words, shorter. | A parent at 18:30 is not reading a leaflet. |
| Serious 1 · Funny 5 | **2, serious with a dry smile.** At most one dry line per piece, in the intro, see [[brand-humour]]. | **3, playful through the words.** "Full table", "Big dinner", "Nice try". Never a joke about the child. | Dinner is a real worry. The smile says "we know". |
| Respectful 1 · Irreverent 5 | **1.5, respectful of the parent and the child, always.** Mild irreverence is allowed towards the clean-plate rule, the dessert bribe and "fix your picky eater" advice. | **2.** | Pillar 4: joy, not guilt. |
| Matter-of-fact 1 · Enthusiastic 5 | **2, matter-of-fact.** Digits, plain verbs, no adjectives of enthusiasm, no exclamation marks. | **3.** Enthusiasm is shown by motion (the `reward` class) and by the achievement word, never by punctuation. | Restraint is what keeps the kid layer from turning the app into a toy (design-library re-brief, 2026-09-07). |

The adult voice from the design library ("calm and confident, not chirpy; closer to Things 3 and
Linear than to Duolingo; treat the user as a capable adult") is the parent register, unchanged.
The kid-visible register adds one thing: the words themselves may be playful.

---

## 3. Registers by surface

| Surface | Register | Rules | Limits |
|---|---|---|---|
| App chrome (buttons, labels, empty states, toasts) | Parent | Sentence case; no full stop on a label; empty state = one sentence + one action; toast = 2 to 4 words | Toast title ≤ 4 words |
| Notification | Parent | A question that opens into logging: "What did the family taste tonight?" Never a nag, never a streak threat | Title ≤ 40 characters |
| Celebration sheet, achievement names | Kid-visible | One line the child can read or hear: "Full table is now silver". Names are two words with a wink. Progress is remaining effort ("2 more tastes to silver"), never a percentage | Headline ≤ 3 words, body one sentence |
| Card back | Fact: kid-visible. Tip: parent | Fact: one true, surprising sentence, no health, no nutrition. Tip: one serving idea that makes a taste likely | Fact ≤ 140, tip ≤ 200 characters |
| Store listing | Parent, family words | No "kids" in name, short description or frames; no "free"; no health claims; no exclamation marks; nothing reads as made for children | Name 30, short 80, full 4,000 |
| Website articles | Parent | Search vocabulary allowed in title, H1 and meta ("kind lust geen groente", "picky eater toddler"); the body answers without the label. Routine in the `pf-seo-article` skill | See the skill |
| Printables | Parent instruction, kid-facing chart | One instruction line for the parent; the chart itself needs no reading (boxes, a plant picture) | One A4 |
| Social | Parent | One idea per post, a talkable moment ([[concept-word-of-mouth]]); never "rate us", never a referral bribe | One line + one image |
| Support, privacy, terms, delete-account, system email | Parent, plain | No humour, no warmth theatre; say what happens and when | |

---

## 4. Sentence rules

- **Second person.** "You" is the parent. "We" only when Project Food does something ("we add it").
- **Sentence case everywhere**, in every locale. "Project Food" is the one exception.
- **Digits, never spelled out.** "10 to 15 tastes", "30 plants", "2 more to silver".
- **No exclamation marks.** Ever.
- **No em dashes.** Commas, colons, full stops.
- **No rhetorical questions in body text.** The dinner question in the notification is the one
  question we ask.
- **Answer first.** The first sentence of an article, a section and a paragraph carries its claim.
  A reader who reads only first sentences gets the whole piece.
- **Short paragraphs.** Two to four sentences on the web, one on a phone.
- **One science line per piece**, cited, then move on ([[brand-stats-and-claims]]).
- **Recurring words:** tonight, the table, a taste, together, counts.
- **Never "should", "must", "have to" aimed at the parent.** Say what works.
- **Say what the family did, not what it did not do.** "Not yet tried", never "Failed to try".
  "22 of 30, 8 to go", never "8 short, try harder" ([[concept-brand-pillars]]).

---

## 5. Vocabulary

### Use

| EN | NL | IT | Note |
|---|---|---|---|
| taste, a taste, tasted | proeven, een hap, geproefd | assaggiare, un assaggio, assaggiato | The verb of the product. "Eat" is the outcome, "taste" is the act |
| the family, the table | het gezin, aan tafel | la famiglia, a tavola | The subject |
| tonight, dinner | vanavond, het avondeten | stasera, la cena | The moment |
| card | kaart | carta | One per plant |
| achievement | prestatie | traguardo | Never "stamp" (renamed 2026-09-22) |
| Unlocks (tab) | Behaald | Collezione | Tab names |
| level up; bronze, silver, gold, platinum | een level omhoog; brons, zilver, goud, platina | salire di livello; bronzo, argento, oro, platino | Achievement tiers |
| plants (fruit, vegetables, herbs, nuts, seeds, legumes, whole grains, ferments) | planten | piante | The catalogue word |
| toddler (1 to 3) | peuter (1 to 4), kleuter (4 to 6) | bambino piccolo (1 to 3) | Age words; otherwise child / kind / bambino |
| a new food, a new plant | iets nieuws, een nieuwe plant | un cibo nuovo, una pianta nuova | |
| counts, every taste counts | telt, elke hap telt | conta, ogni assaggio conta | The promise in three words |

### Avoid

| Word | Why | Say instead |
|---|---|---|
| stamp, stamps | Renamed 2026-09-22 | achievement |
| for kids, kids app, children's app | Store policy and brand: a family app on the parent's phone | for your family, at the table |
| picky eater (as a label for a child) | Pillar 4. It is the parent's search phrase, not our word for a child | In a title when it is the query; in the body "a child who eats little", "een kind dat weinig lust", "un bambino che mangia poco" |
| fix, cure, solve (a child) | Health claim and guilt in one word | help, learn, widen |
| should, must, have to | A lecture | "one taste a day works" |
| healthy, unhealthy (as a judgment) | Preaching | Name the food |
| cheat, clean, guilty, naughty, indulgent | Diet culture | Never |
| boost, improve, strengthen (gut, immune, health) for children | Health claim | Never for children. For adults: "the 30 plants guideline", cited |
| free | Store rule, the paid plan comes later | Say nothing about price |
| let's, wow, yum, amazing, awesome, journey, super | Chirpy | The plain word |
| ! | Punctuation rule | A full stop |
| emoji in copy | Design rule | None (an inline plant emoji is an image fallback, not voice) |
| proven, guaranteed, 100% | A claim | "in the studies", cited |
| pillar, cluster, hub, funnel, keyword | Our words for how the site is built, not the reader's | "Related articles", or name the topic |

---

## 6. Per-locale conventions

- **EN.** "you", "your family". British spelling on the site and in the en-GB listing (colour,
  behaviour). Search terms keep the spelling people search with ("pediatrician"); the referral
  word in body text is "your doctor", which works on both sides of the Atlantic. "Kids" is fine
  in articles, never in the store name, short description or frames.
- **NL.** je / jij / jouw, "jullie" for the family, never "u". "Peuter" 1 to 4, "kleuter" 4 to
  6, "kind" otherwise. "Gezin", not "familie". "Proeven", not "eten", for the act. "Avondeten",
  not "diner". Referral: het consultatiebureau (JGZ) or de huisarts. Voedingscentrum by name
  when we cite it.
- **IT.** tu, "la tua famiglia". "Il bambino" generically, "i bambini" in the plural, "la
  bambina" when the text is about a girl. "Assaggiare" for the act. "A tavola", "la cena".
  Referral: il pediatra.
- **DE / FR (later).** du and tu lean (parents of young children, casual dial at 4). Decided at
  rollout, sentence case regardless.
- **All locales.** Sentence case; digits; straight quotes; decimal comma in NL and IT, decimal
  point in EN; institution names as they write them.

---

## 7. Examples

| Surface | ✅ On brand | ❌ Off brand |
|---|---|---|
| App chrome | 18 of 30 plants this week | Wow, you've eaten 18 plants! 🌱 |
| App chrome | Logged: kale | Yum! Kale logged! 🥬 |
| Empty state | Nothing tasted yet tonight | Let's get started on your plant journey! |
| Progress | 2 more tastes to silver | Only 2 more, you can do it! |
| Notification | What did the family taste tonight? | Don't forget to log your dinner! |
| Celebration | Full table is now silver. 10 plants the whole family has tasted. | AMAZING! You're crushing it! 🎉 |
| Store | The family tastes. You tap. | The fun app that gets kids to eat their veggies! |
| Article intro EN | Most toddlers refuse a new food the first time. That is normal, and it passes faster with one small taste a day than with any amount of persuasion. | Struggling with a picky eater? You're not alone! |
| Article intro NL | Een peuter die de broccoli wegschuift doet niets geks. Tussen de 2 en 6 jaar is dat de regel, en het gaat sneller over met één hapje per dag dan met overhalen. | Herken je dit? Je kind lust weer eens niets! Gelukkig hebben wij dé oplossing. |
| Article intro IT | Un bambino di 2 anni che rifiuta una verdura nuova sta facendo una cosa normalissima. Passa prima con un assaggio al giorno che con qualsiasi insistenza. | Tuo figlio non mangia le verdure? Niente paura, ecco il trucco definitivo! |
| Referral | If your child is losing weight or eats fewer than 20 different foods, talk to your doctor. That is a different situation and this article is not about it. | Warning: this could be a sign of ARFID! |
| Science line | Children in one home trial needed about two weeks of a daily taste before they liked the vegetable (Wardle, 2003). | Science proves that exposure therapy cures picky eating. |

---

## 8. The three gates

Run before anything ships, in this order.

1. **Joy, not guilt.** Read it as a tired parent at 19:00. Any sentence that makes them feel
   judged, behind or told off goes. Lead with what the family did.
2. **No health claim for a child.** Nothing promised: gut, immune, growth, weight, mood, sleep.
   Behaviour only: tasting, trying, eating more different things. For adults, "the guideline",
   cited, never "boosts".
3. **A family app, not a kids app.** Store: nothing "for kids", no child addressed, no child
   pictured. Site: no named or pictured child; households and classes only.

Then the mechanical check: no exclamation mark, no em dash, no "stamp", sentence case, digits,
the locale's referral word.

---

## Contradictions / open questions

- Ricardo has not yet read the dials; this is the first draft (2026-09-24).
- DE and FR address forms are a rollout decision.
- What a Rive character says, if anything (backlog row 8).
- "kids" is allowed in article titles on the site and forbidden in the store name, short
  description and frames. Recorded here so the two rule sets stop contradicting each other.
- The live home page still says "boosts gut diversity", a health claim; fixed under item 14.

## Related pages
- [[brand-humour]] · [[brand-stats-and-claims]] · [[concept-brand-pillars]] ·
  [[persona-household-parent]] · [[seo-app-store-aso]] · [[seo-overview]] ·
  [[concept-achievement-system]] · [[strategy-backlog]]
