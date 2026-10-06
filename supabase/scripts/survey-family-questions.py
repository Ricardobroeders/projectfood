#!/usr/bin/env python3
"""Generates supabase/migrations/20261006210000_survey_family_questions.sql.

The feedback survey rewritten for the family app (Ricardo, 2026-10-06): the PWA set asked about
the leaderboard, friends and a ten-item SUS block. The old answers (two people, PWA era) go with
the old questions; keys that survive keep their key so nothing in the app changes.
"""
from pathlib import Path

EASE = {'en': '1 = Very hard · 5 = Very easy', 'nl': '1 = Heel moeilijk · 5 = Heel makkelijk', 'it': '1 = Molto difficile · 5 = Molto facile'}
MULTI = {'en': 'Select all that apply.', 'nl': 'Meerdere antwoorden mogelijk.', 'it': 'Seleziona tutte le opzioni applicabili.'}

FEATURES = [
    ('recipes', 'Recipes around the plants you have not tried yet', 'Recepten rond de planten die je nog niet hebt geproefd', 'Ricette con le piante che non avete ancora provato'),
    ('shopping_list', 'A shopping list for the gaps', 'Een boodschappenlijst voor wat ontbreekt', 'Una lista della spesa per quello che manca'),
    ('printables', 'Printable cards or a poster for the fridge', 'Printbare kaarten of een poster voor op de koelkast', 'Carte stampabili o un poster per il frigo'),
    ('garden', "A garden that grows with the family's plants", 'Een tuin die meegroeit met de planten van het gezin', 'Un giardino che cresce con le piante della famiglia'),
    ('weekly_summary', 'A weekly summary for the parents', 'Een weekoverzicht voor de ouders', 'Un riepilogo settimanale per i genitori'),
    ('share_family', 'Sharing progress with grandparents', 'Voortgang delen met opa en oma', 'Condividere i progressi con i nonni'),
    ('more_plants', 'More plants', 'Meer planten', 'Più piante'),
    ('more_achievements', 'More achievements', 'Meer prestaties', 'Più traguardi'),
]

# (key, section, type, label en/nl/it, help en/nl/it or None, options [(value, en, nl, it)] or None)
Q = [
    ('consent', 'identity', 'checkbox',
     ("I'm OK with Project Food matching my answers to my in-app activity.", 'Ik ga akkoord dat Project Food mijn antwoorden koppelt aan mijn in-app activiteit.', "Acconsento che Project Food colleghi le mie risposte alla mia attività nell'app."),
     ('Responses are reported anonymously and in aggregate.', 'Antwoorden worden anoniem en geaggregeerd gerapporteerd.', 'Le risposte vengono riportate in forma anonima e aggregata.'), None),

    ('keep-coming-back', 'why', 'text',
     ('What keeps you coming back, or what made you stop?', 'Wat maakt dat je terugkomt, of waardoor ben je gestopt?', 'Cosa ti fa tornare, o cosa ti ha fatto smettere?'), None, None),
    ('if-disappeared-feel', 'why', 'radio',
     ('If Project Food disappeared tomorrow, how would you feel?', 'Als Project Food morgen zou verdwijnen, hoe zou je je voelen?', 'Se Project Food sparisse domani, come ti sentiresti?'), None,
     [('very_disappointed', 'Very disappointed', 'Heel teleurgesteld', 'Molto deluso'),
      ('somewhat_disappointed', 'Somewhat disappointed', 'Een beetje teleurgesteld', "Un po' deluso"),
      ('not_disappointed', 'Not disappointed', 'Niet teleurgesteld', 'Per niente deluso')]),
    ('if-disappeared-miss', 'why', 'text',
     ('What would you miss most?', 'Wat zou je het meest missen?', 'Cosa ti mancherebbe di più?'), None, None),
    ('who-logs', 'why', 'radio',
     ('Who taps the plants at your table?', 'Wie tikt de planten aan bij jullie aan tafel?', 'Chi tocca le piante alla vostra tavola?'), None,
     [('me', 'Mostly me', 'Vooral ik', 'Soprattutto io'),
      ('kids', 'Mostly the kids', 'Vooral de kinderen', 'Soprattutto i bambini'),
      ('together', 'We do it together', 'Samen', 'Insieme'),
      ('nobody', 'Nobody yet', 'Nog niemand', 'Ancora nessuno')]),
    ('when-logs', 'why', 'radio',
     ('When do you usually log?', 'Wanneer houd je het meestal bij?', 'Quando registrate di solito?'), None,
     [('at_table', 'At the table', 'Aan tafel', 'A tavola'),
      ('after_dinner', 'Right after dinner', 'Meteen na het eten', 'Subito dopo cena'),
      ('evening', 'Later in the evening', 'Later op de avond', 'Più tardi la sera'),
      ('later', 'The next day or later', 'De volgende dag of later', 'Il giorno dopo o più tardi')]),
    ('stops-logging', 'why', 'checkbox',
     ('In a typical week, what stops you from logging more?', 'Wat houdt je in een gemiddelde week tegen om meer bij te houden?', 'In una settimana tipica, cosa ti impedisce di registrare di più?'), MULTI,
     [('forget', 'I forget', 'Ik vergeet het', 'Me ne dimentico'),
      ('too_fiddly', 'Too fiddly to log', 'Te veel gedoe', 'Troppo laborioso'),
      ('plant_not_in_list', 'Plant not in the list', 'Plant staat niet in de lijst', 'La pianta non è nella lista'),
      ('kids_lost_interest', 'The kids lost interest', 'De kinderen zijn de interesse kwijt', 'I bambini hanno perso interesse'),
      ('dont_see_point', "Don't see the point", 'Ik zie het nut niet', 'Non ne vedo il senso'),
      ('nothing', 'Nothing stops me', 'Niets houdt me tegen', 'Niente mi ferma')]),

    ('ease-log-plant', 'ux', 'scale', ('Logging a plant you just ate.', 'Een plant bijhouden die je net hebt gegeten.', 'Registrare una pianta che hai appena mangiato.'), EASE, None),
    ('ease-find-plant', 'ux', 'scale', ('Finding a plant in search.', 'Een plant vinden via zoeken.', 'Trovare una pianta con la ricerca.'), EASE, None),
    ('ease-pick-member', 'ux', 'scale', ('Picking who tasted what.', 'Kiezen wie wat heeft geproefd.', 'Scegliere chi ha assaggiato cosa.'), EASE, None),
    ('ease-understand-30', 'ux', 'scale', ('Knowing which plants count towards the weekly 30.', 'Weten welke planten meetellen voor de 30 van de week.', 'Capire quali piante contano per le 30 della settimana.'), EASE, None),
    ('ease-weekly-progress', 'ux', 'scale', ('Seeing how the week is going.', 'Zien hoe de week ervoor staat.', 'Vedere come va la settimana.'), EASE, None),
    ('ease-unlocks', 'ux', 'scale', ('Understanding the cards, the levels and the achievements.', 'De kaarten, niveaus en prestaties begrijpen.', 'Capire le carte, i livelli e i traguardi.'), EASE, None),
    ('ease-overall', 'ux', 'scale', ('Overall, how easy is Project Food to use?', 'Hoe makkelijk is Project Food in het algemeen in gebruik?', 'In generale, quanto è facile usare Project Food?'), EASE, None),
    ('anything-confusing', 'ux', 'text', ('Anything confusing or annoying?', 'Is er iets verwarrend of irritant?', "C'è qualcosa di confuso o fastidioso?"), None, None),

    ('table-ages', 'strategy', 'checkbox',
     ('Who eats at your table?', 'Wie eet er bij jullie aan tafel?', 'Chi mangia alla vostra tavola?'), MULTI,
     [('under_6', 'Young children, under 6', 'Jonge kinderen, onder de 6', 'Bambini piccoli, sotto i 6 anni'),
      ('primary', 'Primary school age', 'Basisschoolleeftijd', 'Età scuola primaria'),
      ('teens', 'Teenagers', 'Tieners', 'Adolescenti'),
      ('adults', 'Adults only', 'Alleen volwassenen', 'Solo adulti')]),
    ('kids-interest', 'strategy', 'scale',
     ('How much do the kids care about the plants and the cards?', 'Hoeveel geven de kinderen om de planten en de kaarten?', 'Quanto interessano ai bambini le piante e le carte?'),
     ('1 = Not at all · 5 = A lot', '1 = Helemaal niet · 5 = Heel veel', '1 = Per niente · 5 = Moltissimo'), None),
    ('kids-ask', 'strategy', 'radio',
     ('Do the kids ask to see the app?', 'Vragen de kinderen om de app te zien?', "I bambini chiedono di vedere l'app?"), None,
     [('often', 'Often', 'Vaak', 'Spesso'),
      ('sometimes', 'Sometimes', 'Soms', 'A volte'),
      ('not_yet', 'Not yet', 'Nog niet', 'Non ancora'),
      ('just_me', 'It is just for me', 'Hij is alleen voor mij', 'È solo per me')]),
    ('table-change', 'strategy', 'checkbox',
     ('Has anything changed at the table since you started?', 'Is er iets veranderd aan tafel sinds je bent begonnen?', 'È cambiato qualcosa a tavola da quando avete iniziato?'), MULTI,
     [('try_more', 'The kids try more', 'De kinderen proeven meer', 'I bambini assaggiano di più'),
      ('talk_more', 'We talk about plants more', 'We praten meer over planten', 'Parliamo di più di piante'),
      ('more_fun', 'Dinner is a bit more fun', 'Eten is wat leuker', "La cena è un po' più divertente"),
      ('nothing', 'Nothing yet', 'Nog niets', 'Ancora niente')]),
    ('notifications', 'strategy', 'radio',
     ('The notification around dinner time: how does it land?', 'De melding rond etenstijd: hoe komt die over?', "La notifica verso l'ora di cena: come la vivi?"), None,
     [('helpful', 'Helpful', 'Handig', 'Utile'),
      ('ignore', 'Fine, I mostly ignore it', 'Prima, ik negeer hem meestal', 'Va bene, di solito la ignoro'),
      ('annoying', 'Annoying', 'Irritant', 'Fastidiosa'),
      ('off', 'I turned notifications off', 'Ik heb meldingen uitgezet', 'Ho disattivato le notifiche'),
      ('none', 'I have not seen one', 'Ik heb er nog geen gezien', 'Non ne ho ancora vista una')]),
    ('other-apps', 'strategy', 'text',
     ('Do you use any other food or family apps? Which ones?', 'Gebruik je andere eet- of gezinsapps? Welke?', 'Usi altre app per il cibo o la famiglia? Quali?'), None, None),

    ('feature-value', 'features', 'checkbox',
     ('Which of these would you want next?', 'Welke hiervan zou je als volgende willen?', 'Quali di queste vorresti per prime?'), MULTI, FEATURES),
    ('feature-pay-one', 'features', 'radio',
     ('If you could pay for only one thing, which would it be?', 'Als je maar voor één ding zou betalen, wat zou dat zijn?', 'Se potessi pagare per una sola cosa, quale sarebbe?'), None,
     FEATURES + [('other', 'Something else', 'Iets anders', 'Altro'), ('nothing', 'Nothing, I would not pay', 'Niets, ik zou niet betalen', 'Niente, non pagherei')]),
    ('features-stay-free', 'features', 'checkbox',
     ("Which of today's features should stay free?", 'Welke van de huidige functies moeten gratis blijven?', 'Quali delle funzioni attuali dovrebbero restare gratuite?'), MULTI,
     [('logging', 'Logging and the weekly 30', 'Bijhouden en de 30 van de week', 'Registrare e le 30 della settimana'),
      ('cards', 'The cards and gold', 'De kaarten en goud', "Le carte e l'oro"),
      ('achievements', 'Achievements', 'Prestaties', 'I traguardi'),
      ('members', 'More than one child', 'Meer dan één kind', 'Più di un bambino'),
      ('notifications', 'Notifications', 'Meldingen', 'Le notifiche'),
      ('facts', 'Plant facts on the cards', 'Weetjes op de kaarten', 'Le curiosità sulle carte')]),

    ('vw-too-expensive', 'pricing', 'number',
     ('At what monthly price (€) would a paid Project Food be so expensive you would not consider it?', 'Bij welke maandprijs (€) zou een betaalde Project Food zo duur zijn dat je het niet eens overweegt?', 'A quale prezzo mensile (€) una versione a pagamento di Project Food sarebbe così cara da non prenderla in considerazione?'), None, None),
    ('vw-getting-pricey', 'pricing', 'number',
     ('At what price would it feel expensive, but you would still consider it?', 'Bij welke prijs voelt het duur, maar zou je het nog overwegen?', 'A quale prezzo sembrerebbe caro, ma lo prenderesti comunque in considerazione?'), None, None),
    ('vw-good-value', 'pricing', 'number',
     ('At what price would it feel like good value?', 'Bij welke prijs voelt het als een goede deal?', 'A quale prezzo sembrerebbe un buon affare?'), None, None),
    ('vw-too-cheap', 'pricing', 'number',
     ('At what price would it feel so cheap you would doubt the quality?', 'Bij welke prijs voelt het zo goedkoop dat je aan de kwaliteit twijfelt?', 'A quale prezzo sembrerebbe così economico da farti dubitare della qualità?'), None, None),

    ('nps', 'wrapup', 'scale',
     ('How likely are you to recommend Project Food to a friend or colleague?', 'Hoe waarschijnlijk is het dat je Project Food aanbeveelt aan een vriend of collega?', 'Quanto è probabile che tu raccomandi Project Food a un amico o collega?'),
     ('1 = Not at all likely · 5 = Extremely likely', '1 = Helemaal niet waarschijnlijk · 5 = Extreem waarschijnlijk', '1 = Per niente probabile · 5 = Estremamente probabile'), None),
    ('one-thing', 'wrapup', 'text',
     ('One thing we should build or fix next?', 'Eén ding dat we als volgende moeten bouwen of verbeteren?', 'Una cosa che dovremmo costruire o migliorare per prima?'), None, None),
]

LOCALES = ['en', 'nl', 'it']


def lit(s):
    return 'null' if s is None else "'" + s.replace("'", "''") + "'"


def opts_json(options, i):
    if not options:
        return 'null'
    import json
    return lit(json.dumps([{'label': o[1 + i], 'value': o[0]} for o in options], ensure_ascii=False)) + '::jsonb'


out = ["-- The feedback survey rewritten for the family app (Ricardo, 2026-10-06): no leaderboard, friends",
       "-- or SUS block; the kids, the table and the notifications instead. The PWA-era answers (two people)",
       "-- go with the old questions. Generated by supabase/scripts/survey-family-questions.py.",
       "delete from public.survey_responses;",
       "delete from public.survey_question_translations;",
       "delete from public.survey_questions;",
       "", "insert into public.survey_questions (key, section, type, options, display_order) values"]
rows = []
for n, (key, section, typ, labels, helps, options) in enumerate(Q):
    rows.append(f"  ({lit(key)}, {lit(section)}, {lit(typ)}, {opts_json(options, 0)}, {(n + 1) * 10})")
out.append(',\n'.join(rows) + ';')
out.append('')
out.append('insert into public.survey_question_translations (question_id, locale, label, help_text, options_override)')
out.append('select q.id, v.locale, v.label, v.help_text, v.options_override from (values')
rows = []
for key, section, typ, labels, helps, options in Q:
    for i, loc in enumerate(LOCALES):
        help_text = helps[i] if isinstance(helps, tuple) else (helps[loc] if helps else None)
        rows.append(f"  ({lit(key)}, {lit(loc)}, {lit(labels[i])}, {lit(help_text)}, {opts_json(options, i)})")
out.append(',\n'.join(rows))
out.append(') as v(key, locale, label, help_text, options_override) join public.survey_questions q on q.key = v.key;')

dest = Path(__file__).resolve().parents[1] / 'migrations' / '20261006210000_survey_family_questions.sql'
dest.write_text('\n'.join(out) + '\n')
print(dest, len(Q), 'questions')
