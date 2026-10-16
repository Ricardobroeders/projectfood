---
title: App Store repositioning after the 4.3(a) rejection: plant cards and your table, Food & Drink first
type: decision
tags: [app-store, ios, aso, store-compliance, positioning]
created: 2026-10-16
updated: 2026-10-16
sources: [seo/seo-app-store-aso.md, strategy-backlog.md, decision-2026-10-07-two-ways-to-use-it.md]
status: accepted
---

# App Store repositioning after the 4.3(a) rejection: plant cards and your table, Food & Drink first

**In one line:** Apple rejected 1.0.2 (1) on 2026-10-16 under Guideline 4.3(a) because the
listing reads like five other "30 plants a week" apps; the App Store name, subtitle, category,
keywords, description, first screenshot and review notes now lead with what none of them has (a
card per plant, several people logged from one phone), and the resubmission carries a new iOS
build with today's app. Decided by Ricardo on 2026-10-16. Reopens the name of backlog item 20
for iOS only; Google Play keeps its listing while production access is under review.

## Why Apple said spam

4.3(a) compares what a customer sees before downloading (name, subtitle, category, screenshots,
description, keywords), not the code. On 2026-10-16 the App Store held at least five apps on the
same concept, all in Health & Fitness, three with the same name suffix:

| App | Name | Subtitle |
|---|---|---|
| Eating30 | Eating30: 30 Plants a Week | Gut Health, Fiber Variety |
| Plant Points | Plant Points: 30 plants a week | Gut health & Fiber Tracker |
| PlantHabit | PlantHabit: 30 Plants a Week | Plant Forward Meal Planner |
| Eat 30 Plants | Eat 30 Plants: Enjoy diversity | Log your weekly plant variety |
| Thirty Plants | Thirty Plants | (none) |
| Project Food (rejected) | Project Food: 30 plants a week | Track your plant diversity |

Ours added "tracker" and "gut health" in the keywords, a first screenshot of the 18-of-30 gauge
(the progress ring every look-alike opens with), and review notes that opened with "a tracker for
eating a wider variety of plants". Achievements and streaks do not set us apart (Plant Points and
Eating30 have both; Thirty Plants has friends). What none of them has: logging for several
people from one phone, a card per plant with its own picture and levels, a fact for the table and
a tip for the cook.

The fix guides and forum cases agree: for an original app the fix is in the product page, not
the code; lead with the differentiator in name, subtitle, first screenshot and the first line of
the description; review notes name 3 to 5 differences with the screen where each is seen; an
appeal argued on quality alone usually fails, and repeat submissions with the same issue bring
extended review times, so everything goes in one round. Also seen: the reviewer probably ran the
build's embedded JavaScript of 2026-09-28, because expo-updates applies a downloaded update on the
next launch, so a new build shows the current app.

## The decision

1. **Name and subtitle** (Ricardo picked option 1 of 3):
   - en: **Project Food: plant cards** (25) / **Log for everyone at your table** (30)
   - nl: **Project Food: plantenkaarten** (28) / **Voor jou en iedereen aan tafel** (30)
   - it: **Project Food: carte di piante** (29) / **Per te e per tutti a tavola** (27)
2. **Categories:** Food & Drink primary, Health & Fitness secondary (was the reverse).
3. **Keywords** (no "tracker", no "gut health"; "30 plants" stays as a search word):
   - en: `30 plants,plant diversity,picky eater,tasting,family,dinner,vegetables,fruit,collection,food diary` (98)
   - nl: `30 planten,kind groente,moeilijke eter,proeven,gezin,avondeten,eetdagboek,fruit,groente,verzamelen` (98)
   - it: `30 piante,bambini verdura,neofobia,assaggiare,famiglia,cena,diario alimentare,frutta,collezione` (95)
4. **Promotional text:**
   - en: A card for every plant you taste, for you and everyone at your table. Tap what you tasted today and the collection grows toward 30 different plants a week. (155)
   - nl: Een kaart voor elke plant die je proeft, voor jou en iedereen aan tafel. Tik aan wat je vandaag proefde en je collectie groeit richting 30 planten per week. (156)
   - it: Una carta per ogni pianta che assaggi, per te e per tutti a tavola. Tocca cosa hai assaggiato oggi e la collezione cresce verso 30 piante diverse a settimana. (158)
5. **Description**, cards and the table first, the 30 last but one (below, per locale; same
   facts as the rejected text, "the family" as default subject replaced by "you" per
   [[decision-2026-10-07-two-ways-to-use-it]]).
6. **First screenshot** shows the card collection, the second the hold-to-choose menu on Log;
   the 30 gauge moves to the end (brief below; Ricardo builds the frames in Figma).
7. **Review notes:** "PURPOSE AND AUDIENCE" and a new "WHAT IS DIFFERENT" paragraph replace the
   tracker wording (below; Ricardo pastes them into App Review Information, because the review
   block never lives in the repo).
8. **A new iOS build** of the current app (1.0.40, iOS runtime acf2e071 unchanged, checked
   2026-10-16, so Play testers and over-the-air updates are untouched), and the rejected App Store
   version renamed from 1.0.2 to 1.0.40 so the build fits (EAS Metadata renames an unpublished
   version when `apple.version` changes).

### Description en

```
Project Food is a collection of plant cards that fills up at your table. Tap the plants you tasted today, for yourself or for each person at the table, and every new plant becomes a card with its own picture, a fact for the table and a tip for the cook.

A card for every plant
Over 200 fruits, vegetables, herbs, nuts, seeds, legumes, whole grains and ferments, each a card with its own picture. Taste a plant again and its card levels up. The collection only grows; nothing ever resets.

Everyone at your table, from one phone
One account, yours. Add the people you eat with: a first name and a colour, nothing more. Tap a plant to log it for yourself, hold it to choose who tasted it. Each person builds their own collection. On your own, it counts just for you.

Something to talk about while you eat
Every card comes with a fact for the table and a tip for the cook.

Achievements for what happens at the table
Explorer, Rainbow, Full table, Big dinner and more, in bronze, silver, gold and platinum. Each one shows how far you are from the next level.

30 different plants a week
Your week counts toward 30 different plants. Home shows where you are and what is still open, per category.

One question, at your dinner time
Tell the app when you usually eat, and half an hour later it asks what you tasted. That is the only notification you need. Tips and news stay off until you switch them on.

No ads. Delete everything with one tap, whenever you want.

Missing a plant? Suggest it from the search and we add it.

Project Food is available in English, Dutch and Italian. More languages are on the way.
```

### Description nl

```
Project Food is een verzameling plantenkaarten die aan jouw tafel groeit. Tik aan welke planten je vandaag hebt geproefd, voor jezelf of voor iedereen aan tafel, en elke nieuwe plant wordt een kaart met een eigen plaatje, een weetje voor aan tafel en een tip voor de kok.

Een kaart voor elke plant
Meer dan 200 soorten fruit, groente, kruiden, noten, zaden, peulvruchten, volkoren granen en gefermenteerd eten, elk een kaart met een eigen plaatje. Proef je een plant opnieuw, dan gaat zijn kaart een level omhoog. De collectie wordt alleen maar groter; er gaat nooit iets verloren.

Iedereen aan tafel, op één telefoon
Eén account, van jou. Voeg de mensen toe met wie je eet: een voornaam en een kleur, meer niet. Tik op een plant om hem voor jezelf te loggen, houd hem vast om te kiezen wie heeft geproefd. Iedereen bouwt een eigen collectie. Eet je alleen, dan telt alles voor jou.

Iets om over te praten tijdens het eten
Bij elke kaart hoort een weetje voor aan tafel en een tip voor de kok.

Prestaties voor wat er aan tafel gebeurt
Ontdekker, Regenboog, Volle tafel, Groot diner en meer, in brons, zilver, goud en platina. Elke prestatie laat zien hoe ver je bent tot het volgende level.

30 verschillende planten per week
Je week telt richting 30 verschillende planten. Op Home zie je waar je staat en wat er per categorie nog openstaat.

Eén vraag, op jouw etenstijd
Geef aan wanneer je meestal eet en een half uur later vraagt de app wat je hebt geproefd. Meer meldingen heb je niet nodig. Tips en nieuws staan uit tot jij ze aanzet.

Geen advertenties. Alles verwijderen kan met één tik, wanneer je maar wilt.

Mis je een plant? Stel hem voor via het zoekveld en we voegen hem toe.

Project Food is beschikbaar in het Nederlands, Engels en Italiaans. Meer talen volgen.
```

### Description it

```
Project Food è una collezione di carte di piante che cresce alla tua tavola. Tocca le piante che hai assaggiato oggi, per te o per ognuno a tavola, e ogni nuova pianta diventa una carta con la sua immagine, una curiosità per la tavola e un consiglio per chi cucina.

Una carta per ogni pianta
Oltre 200 tra frutta, verdura, erbe e spezie, noci, semi, legumi, cereali integrali e fermentati, ognuna una carta con la sua immagine. Assaggia di nuovo una pianta e la sua carta sale di livello. La collezione può solo crescere; niente si azzera mai.

Tutti a tavola, da un solo telefono
Un solo account, il tuo. Aggiungi le persone con cui mangi: un nome e un colore, niente di più. Tocca una pianta per registrarla per te, tienila premuta per scegliere chi l'ha assaggiata. Ognuno costruisce la propria collezione. Se a tavola ci sei solo tu, conta tutto per te.

Qualcosa di cui parlare mentre si mangia
Ogni carta ha una curiosità per la tavola e un consiglio per chi cucina.

Traguardi per quello che succede a tavola
Esploratore, Arcobaleno, Tavola piena, Grande cena e altri, in bronzo, argento, oro e platino. Ogni traguardo mostra quanto manca al livello successivo.

30 piante diverse a settimana
La tua settimana conta verso 30 piante diverse. Nella Home vedi a che punto sei e cosa manca per ogni categoria.

Una domanda, all'ora della tua cena
Indica a che ora mangi di solito e mezz'ora dopo l'app ti chiede cosa hai assaggiato. Altre notifiche non servono. Consigli e novità restano spenti finché non li attivi tu.

Nessuna pubblicità. Puoi cancellare tutto con un tocco, quando vuoi.

Manca una pianta? Suggeriscila dalla ricerca e la aggiungiamo.

Project Food è disponibile in italiano, inglese e olandese. Altre lingue in arrivo.
```

### Review notes (replace "PURPOSE AND AUDIENCE", add "WHAT IS DIFFERENT"; the other paragraphs stay)

```
PURPOSE AND AUDIENCE: a plant card collection for one adult and the people they eat with, logged from one phone. After a meal the account holder taps the plants that were tasted; every new plant becomes a card with its own picture, a fact for the table and a tip for the cook, and the week counts toward 30 different plants. The account holder is always an adult; other people at the table (a partner, children) are profiles the adult creates on their own device, with a first name and a colour only. No medical purpose, no health claims.

WHAT IS DIFFERENT FROM OTHER PLANT-VARIETY APPS (Guideline 4.3):
- Several people, one phone: on Log, tap and hold a plant to choose who tasted it (the demo household has a second member, Anna). Each person has their own collection on Unlocks.
- A card per plant: over 200 plants, each with artwork made for this app, a fact for the table and a tip for the cook (tap any plant). Cards level up with repeated tastings.
- Achievements for a shared table (Full table, Big dinner, Table talk) on Unlocks.
- One question a day at the household's own dinner time, set in Account.
All code, artwork, the plant catalogue and the texts in English, Dutch and Italian are original to this app, built by one developer; no template or white-label code.
```

### Screenshot brief (iPhone 6.9-inch, en / nl / it)

| # | Headline (en) | Screen |
|---|---|---|
| 1 | A card for every plant you taste | Unlocks: the card collection (today's frame 03) |
| 2 | Everyone at your table, from one phone | Log with the hold menu open at the finger, two or three people to choose (new capture) |
| 3 | Levels, with the next one always visible | Achievement sheet (today's frame 04) |
| 4 | 30 different plants a week | Home with the gauge (today's frame 02, moved to the end) |

The title artboard (01), if used, carries the new name. No frame says "tracker" or "gut".

## What follows

- Order: new iOS build uploaded first, then `metadata:push` with `apple.version` 1.0.40 (renames
  the version and pushes the texts and categories), then the review notes and screenshots in App
  Store Connect, then the new build selected on the version page and submitted, with one line in
  the review thread saying what changed. The reply of 2026-10-16 stays open; resubmitting does not
  withdraw it.
- If Apple rejects again under 4.3: an appeal to the App Review Board, with this page's table and
  the provenance (git history since 2026-09-07, one developer), and an App Review appointment via
  Meet with Apple.
- Google Play keeps "Project Food: 30 plants a week" until production access is decided; aligning
  both stores is a later choice.

## Related pages

- [[strategy-backlog]] (one thing line 2, item 20) · [[seo-app-store-aso]] ·
  [[decision-2026-10-07-two-ways-to-use-it]] · [[brand-voice]]
