"""Les 3 076 matchs ATP 2024, reduits aux colonnes que le carnet utilise.

Le carnet Observable chargeait le CSV complet (49 colonnes, 650 Ko) depuis
un depot tiers, qui renvoie desormais 404. La page reprend ses calculs a
l'identique (comptages par surface, tournois distincts, victoires et
defaites par joueur, histogramme des durees, ecarts de classement) : il lui
faut donc les matchs eux-memes, pas des agregats. On n'expedie que les huit
colonnes lues par les graphiques (le tableau des matchs, qui montrait
aussi le score, le tour et la categorie, a ete retire), en colonnes, les noms dedoublonnes dans un
dictionnaire : environ six fois moins lourd que le CSV.

Usage : python3 atp-matchs.py   ->  out/atp-2024.json
"""
import csv, json, os

ICI = os.path.dirname(os.path.abspath(__file__))
SORTIE = os.path.join(ICI, 'out', 'atp-2024.json')

COLONNES = ['tourney_name', 'surface', 'winner_name', 'loser_name',
            'minutes', 'winner_rank', 'loser_rank', 'best_of']
# Colonnes texte repetitives : stockees comme indices dans un dictionnaire.
DICO = {'tourney_name', 'surface', 'winner_name', 'loser_name'}
NOMBRES = {'minutes', 'winner_rank', 'loser_rank', 'best_of'}

lignes = list(csv.DictReader(open(os.path.join(ICI, 'atp_matches_2024.csv'), encoding='utf-8')))
dictionnaire, index = [], {}
def code(v):
    if v not in index:
        index[v] = len(dictionnaire)
        dictionnaire.append(v)
    return index[v]

sortie = {'annee': 2024, 'n': len(lignes), 'dico': dictionnaire, 'colonnes': {}}
for c in COLONNES:
    if c in DICO:
        sortie['colonnes'][c] = [code(l[c]) for l in lignes]
    elif c in NOMBRES:
        # Valeur manquante -> null, jamais 0 : une duree absente n'est pas
        # un match de zero minute (d3.mean l'ignorerait, un 0 le fausserait).
        sortie['colonnes'][c] = [int(l[c]) if l[c].strip() else None for l in lignes]
    else:
        sortie['colonnes'][c] = [l[c] for l in lignes]

os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
with open(SORTIE, 'w', encoding='utf-8') as f:
    json.dump(sortie, f, ensure_ascii=False, separators=(',', ':'))
print('matchs :', len(lignes), '| poids :', os.path.getsize(SORTIE) // 1024, 'Ko')
