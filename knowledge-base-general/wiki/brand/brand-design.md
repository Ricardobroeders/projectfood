---
title: Brand book, the design side: colour, type, shape, imagery, motion
type: brand
tags: [brand, design, motion, colour, typography, imagery, design-system]
created: 2026-10-09
updated: 2026-10-09
sources: [concept-brand-pillars.md, brand-voice.md, decision-2026-09-07-app-v1-scope.md, decision-2026-10-07-two-ways-to-use-it.md]
---

# Brand book, the design side: colour, type, shape, imagery, motion

**In one line:** The visual and motion choices behind Project Food, written down in one place so
the app, the website, the store and anything new look like one product. The words side lives in
[[brand-voice]], [[brand-humour]] and [[brand-stats-and-claims]]; this page is the other half.
Taste in four words, confirmed on device three times (2026-09-07): **minimal but noticeable.**

The rules below are the ones already in code. Where a value lives in a file, the file wins and
this page follows it (sources table at the end). Open decisions are marked as such, not guessed.

## 1. What the brand is

Four pillars ([[concept-brand-pillars]]): count, don't preach; different beats more; effortless in
the moment, meaningful by Sunday; joy, not guilt. Design reads them as: the number is the hero,
variety is shown not scored, every screen is a one-minute task, nothing on screen scolds.

Two readers since 2026-10-07 ([[decision-2026-10-07-two-ways-to-use-it]]): the adult who holds the
phone, alone or for everyone at the table. The kid is a member, never the audience. Visually that
means a calm, adult surface that a kid can enjoy: the playfulness sits in the plants, the cards,
the achievements and the motion of rewards, never in the chrome.

Three references, in this order: Things 3 and Linear for the chrome, Duolingo for the rewards.
Never the reverse.

## 2. The words, in short

Full rules in [[brand-voice]]. What design needs to know: sentence case everywhere ("Project
Food" is the one exception); digits, never spelled out; no exclamation marks; no em dashes; second
person to the adult; labels without a full stop; toast 2 to 4 words; empty state one sentence and
one action. Two registers: parent (chrome, notifications, site, store) and kid-visible
(celebration sheet, card facts, achievement names). Humour is dry, one line, intros only.

## 3. Colour

**Principle: colour comes from the food, not from the chrome.** The page is white, surfaces are a
warm grey, text is ink. The plants, the category tints, gold rewards and the member colours carry
the colour. A screen with no food on it is nearly monochrome.

Neutrals (`colors` in `theme.ts`):

| Token | Value | Use |
|---|---|---|
| bg, surface | #FFFFFF | The page and cards |
| bgSoft | #F6F5F2 | Grey surfaces on white: rows, tiles, chips, the tab bar ground |
| hairline | #ECEAE5 | 1 px lines where a surface is not enough (tab bar top, tab underline track) |
| ink | #1F1B16 | Text and icons |
| ink2 | #6B645C | Secondary text |
| ink3 | #A39B91 | Meta text, placeholders |
| locked, lockedInk | #ECEAE5, #B8B2A9 | Locked achievements and cards |

Accent, the open decision: the app runs on `marigold` #F5C518 (the PWA yellow) with the Play
screenshots built on it. The choice between a true functional blue (#1F6FEB, Ricardo's proposal
of 2026-09-10) and petrol teal (#007C9A, his Figma working colour) is open and has a cost since
2026-09-22 (every store frame remade). The role split Ricardo is converging on, whatever the
hue: **accent = interactive, gold = earned, category tints = food.** Rejected on device:
blueberry periwinkle, leaf green (crowded), coral and raspberry untested.

Role colours that do not move with the accent:

| Role | Token | Value | Rule |
|---|---|---|---|
| Earned | gold, goldSoft, goldInk | #F5C518, #F9DE72, #7A5C00 | A gold card's ground and label turn gold wherever the plant is shown; gold renders stand on goldSoft |
| Progress | success, successSoft | #00880D, #DDF1DF | Progress toward a goal and its completion; never a control colour |
| Goal gauge | gaugeLow … gaugeDone | #E22924, #EC8B00, #F4D419, #11BA11, #008A07 | Five bands along the arc, each wedge keeps its colour once lit |
| Typical household | typical | #1F6FEB | One colour for the mark, the lines and the legend in stats; never a verdict colour |

Category tints (`CATS`), fg for text and icons, bg for grounds; the same values on the website
(`lib/cats.ts`):

| Category | fg | bg |
|---|---|---|
| vegetable | #4F7A3D | #DDEACB |
| fruit | #C2533D | #FBD9CC |
| herb | #3C6A60 | #CFE5DD |
| nut_seed | #7E5530 | #F1DFC4 |
| legume | #6A4880 | #E5D6EE |
| whole_grain | #9C7A2E | #F3E6BD |
| ferment | #6B7A87 | #DFE3E8 |

Member colours (`MEMBER_COLORS`, eight saturated hues, one per person, chosen when added): they
dress the avatar and tell people at the table apart. Distinct from the category tints on purpose.

Website (`projectfood-app/app/globals.css`): the same ink and category values; page white with a
warm cream #F4EFE8 as the second surface; accent yellow. No shadows there either (2026-09-26).

Never: drop shadows, gradients in chrome (the one gradient in the product is the gold reward
sheet, gold to white), red as a warning state, a colour that judges.

## 4. Type

Plus Jakarta Sans only, in four weights: medium 500 for body, semibold 600 for labels and
secondary titles, bold 700 for row titles, extrabold 800 for screen titles and big numbers.
Numbers are set in the same face, never a mono or a serif (the adult design library's Instrument
Serif and Geist were dropped on 2026-09-07).

Sizes in use (size/line height): screen title 28/34 extrabold with a 13/18 meta line under it;
section title 17/22 bold with its meta right-aligned; stats card title 22/28 extrabold; body
15/22 medium; row title 15/20 bold; label 14/18 semibold; meta and legends 12/16 medium; big
numbers 24 to 30 extrabold. Line height is always above 100%; the Figma file's 100% line heights
are a known gap (feedback 2026-09-09).

Every locale follows the same rules; copy is written natively per language, never translated
word by word ([[brand-voice]] section 6).

## 5. Shape and layout

- **Radius follows height**, about a third of it, snapped to 12 / 18 / 24 / 32 (`radiusFor`):
  chips and pills up to 40 pt get 12; buttons and inputs to 64 get 18; rows and cards to 140 get
  24; sheets and hero cards above that get 32. Full radius only for genuinely round things
  (avatars, the check circle, dots, icon-only square buttons), never for text pills. A nested
  element takes its parent's step or one smaller, never larger.
- **No shadows anywhere.** Distinction is a grey surface on white, or a 1 px hairline.
- **Icons are Lucide**, sized at about 45% of their container (`iconFor`), minimum 16.
- **Gutters are 20 px**; stacks use 8, 12 and 16; sections breathe with 14 to 24 above.
- **Tabs are underlines, not pills**: 16 px label, bold accent when active, a 36 × 3 indicator on a
  2 px hairline track.
- **Sheets, not modals**, for anything that slides in: a bottom sheet with a 40 × 4 handle,
  32 radius, swipe down to close; the keyboard shrinks it rather than pushing it off screen.
- **Tap targets** at least 44 pt; the logging rows are taller so a kid can hit them.
- **Prototype controls never sit on a product screen**; they live in Account.

## 6. Imagery

- **Plants are 3D clay renders**, 230 in the catalogue, served from the `food-images` bucket and
  bundled with the app. They are never redrawn: 2D would lose what tells one fruit from another.
  Each plant stands on its category tint; at gold the ground turns goldSoft and a **gold render**
  replaces it (144 of 230 exist, Ricardo generates the rest, [[project-plant-image-bundling]]
  rules for new ones).
- **Achievements** are renders in the same clay feel, one per achievement, grey when locked;
  levels are bronze, silver, gold, platinum with the cups (`Cup`) in the same metals.
- **Category images** are clay renders too (the seven groups).
- **Stat tiles** (streak, longest streak, weeks at goal, best week) are small renders generated
  through Ricardo's n8n and gpt-image-1 flow from a one-composition brief, uploaded to
  `images/app-ui-images/` and fetched at build time.
- **Avatars** today are an initial on a member colour with an optional picture from a fixed set.
  The planned avatar is a Rive character built from parts (the "expression grid" architecture:
  face, hair, hat, pet, background as slots), flat vector, rounded, one or two tones per shape,
  little shading, a hint of depth, so it sits next to clay plants without clashing.
- **Everything that is not a plant animates in Rive** eventually: achievements, celebrations, the
  avatar, empty states, notification imagery. Until then, Reanimated primitives in the motion
  classes below.
- **No photography inside the app.** Photography is for marketing surfaces only. **No emoji in
  chrome.**
- **Store screenshots** are Figma mockups with an iPhone bezel and a status bar at 9:41, one set
  per locale with the UI in that language, four frames; Android frames the same without the
  navigation bar. Ricardo builds all visuals in Figma; Claude writes the brief
  ([[feedback-visual-assets-brief-not-images]]).
- **App icon**: the four-tile plant collage, generated 2026-09-20 from the Figma file; a brand
  mark beyond the icon waits for the accent decision.

## 7. Motion

Motion is picked by what the element is, never by taste (`motion.ts`). Two classes bounce,
`reward` and `expressive`, and never beyond about 8%; nothing ever leaves its own box.

| Class | What it is for | Curve | Bounce |
|---|---|---|---|
| sheet | A drawer sliding from an edge | ease-out 320 ms in, ease-in 220 ms out | Never: a drawer has a wall behind it |
| modal | Something appearing in place (card, dialog, balloon) | fade + small scale, gentle spring (damping 18, stiffness 190) | A hint of settle |
| reward | Celebrations: achievement pop, check circle, gold plant | spring (damping 12, stiffness 200), pops start at 0.7 scale, bumps peak at 1.10 | Yes, ≤ 8% |
| expressive | A menu growing out of the finger (hold a plant) | spring at damping ratio 0.65, 40 ms stagger per item, exits by timing 160 ms | Yes, about 7%; the exit never bounces |
| toggle | A control changing state (check, chip) | quick spring (damping 14, stiffness 220) | Tiny |
| press | Touch feedback | 80 ms in, spring back | No |
| flip | A card turning over | spring, overshoot clamped | No; no shadow on the rotating plane |
| number | A counter rolling to its value | ease-out 650 ms | No |
| fill | A gauge or meter filling when a screen opens | ease-out 1100 ms | No |
| swap | Content replaced in place (a list under a tab) | fade + slide in the direction of travel, 200 ms | No |
| reveal | Rows filling in over their skeleton | fade in place, 260 ms, 35 ms stagger for the first eight rows | No |
| pulse | Skeleton placeholders breathing | 700 ms symmetric | No |
| guide | The tutorial spotlight moving between controls | ease-in-out 380 ms travel, ease-out 460 ms in, ease-in 300 ms out | Never: a light being moved, not a reward |

Rules that came from device tests: a spring's overshoot grows with the distance it travels, so
reward pops start close to their target (0.7 → 1, not 0.4 → 1); a celebration is contained (an ink
ring, six small sparkles, the tasted plants sliding in) rather than full-screen confetti; the
gold sheet's sun rays turn linearly and endlessly (48 s per turn) so the turn has no visible start
or end; a sheet never bounces, because a bounce reads as a modal. Rive assets replace these
primitives per class, not per screen. Reduced motion has no spec yet (open).

## 8. Components in the app today

Primitives in `ui.tsx`: PrimaryButton, SecondaryButton, TextButton, Screen, ScreenTitle,
BackHeader, SectionTitle, SettingsRow, Chip, ErrorText, Loading. Product components: Sheet (with
SwipeDown), Tabs and TabBar, PlantRow, MemberAvatar, MemberList, MemberMenu, MemberEditorSheet,
WeekMeter, GoalGauge, ProgressBar, LevelPips, Cup, Stamp and StampShelf, AchievementSheet,
CelebrationSheet, GoldCardSheet with SunRays, FunFactCard, Skeleton, AnimatedNumber, BarChart,
LineChart, CategoryMix, TutorialOverlay, PushPromptSheet, QuestionField, DinnerTimePicker.
A Figma component library that mirrors these is wanted and blocked by the Figma plan's MCP cap
([[project-figma-component-library]]).

## 9. Open decisions

1. The accent: true blue or petrol teal, decided on device by Ricardo; carries the cost of
   remaking the store frames.
2. A brand mark beyond the app icon, once the accent is functional.
3. The Rive illustration style for characters and celebrations (flat, little shading, a hint of
   depth is the stated preference; nothing drawn yet).
4. Figma variables named by role (accent/default, surface/soft, ink/1, cat/fruit/bg) so the app
   theme can bind to them; today they are named by hue.
5. Dark mode: none, light only; tokens exist nowhere for dark.
6. Reduced motion fallbacks.

## 10. Where each rule lives

| Rule | Source of truth |
|---|---|
| Colours, radius scale, icon size, fonts, category tints, member colours | `projectfood-mobile/src/constants/theme.ts` |
| Motion classes and amplitudes | `projectfood-mobile/src/constants/motion.ts` |
| Website tokens | `projectfood-app/app/globals.css`, `lib/cats.ts`, `projectfood-app/CLAUDE.md` |
| Words | [[brand-voice]], [[brand-humour]], [[brand-stats-and-claims]] |
| Pillars | [[concept-brand-pillars]] |
| Device-test history and the family re-brief | `design-library/README.md` (local, gitignored) |
| Figma file | key `VPYLvp8PSENft0iYWdLaL8`, page "App design" |
| Store frames | [[seo-app-store-aso]] "Screenshots" |

## Related pages

- [[brand-voice]] · [[brand-humour]] · [[brand-stats-and-claims]] · [[concept-brand-pillars]] ·
  [[decision-2026-09-07-app-v1-scope]] · [[decision-2026-10-07-two-ways-to-use-it]] ·
  [[strategy-backlog]] (row 2)
