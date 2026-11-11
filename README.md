# The 2024 ATP season: who wins, and do break points explain it?

**Question:** who won the most in the 2024 ATP season, and is saving break points what makes a player win?

Case study (six charts, two of them interactive):
https://mohamedbougrara.github.io/portfolio-Bougrara-Mohamed/tennis-atp.html

## Key findings

- **Efficiency beats volume.** Alexander Zverev played the most matches (90), but Jannik Sinner won 91 % of his.
- **Break points are not the whole story.** Across the 87 players with at least 30 matches with statistics, the correlation between break points saved and win rate is 0.57; with all points won on serve, it is 0.71. Carlos Alcaraz is 2nd in win rate but 29th in break points saved.
- **Hard courts set the calendar.** 39 of the 69 tournaments (Davis Cup excluded) are on hard courts, which host more matches than clay and grass combined.

## How it works

- `atp-balles-de-break.mjs` (Node.js, no dependency): one season summary per player, each match counting for both players; matches without serve statistics are left out. It keeps players with at least 30 such matches, then computes the Pearson correlation of the win rate with the share of break points saved and with the share of serve points won, and ranks players on both.
- `atp-matchs.py` (Python, standard library): reduces the 3,076 matches to the eight columns the case-study charts read, stored by column with repeated names in a dictionary (about six times lighter than the CSV). The charts themselves (surfaces, most active players, player comparison, match duration, duration by ranking gap) are drawn in the browser with Observable Plot on the case-study page; their code is not in this repository.

## How to run

```bash
node atp-balles-de-break.mjs   # correlations and ranks (console output in French)
python3 atp-matchs.py          # writes out/atp-2024.json
```

## Folder

```
.
├── atp_matches_2024.csv      2024 ATP matches, Jeff Sackmann (CC BY-NC-SA 4.0)
├── atp-balles-de-break.mjs   break-point analysis
├── atp-matchs.py             compact data file for the case-study charts
└── DATA-LICENSE.md
```

## Limitations

- A correlation does not prove a cause.
- A win rate over a few matches is unstable: the case study only compares players with more than 20 matches and always shows the number of matches.
- Match durations are known for 2,838 of the 3,076 matches; the source file has none for the 2024 Roland-Garros.

## Data and licence

Data: [tennis_atp](https://github.com/JeffSackmann/tennis_atp) by Jeff Sackmann, 2024 season, licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See [DATA-LICENSE.md](DATA-LICENSE.md).
