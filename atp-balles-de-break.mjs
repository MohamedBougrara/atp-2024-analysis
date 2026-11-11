// Sauver ses balles de break fait-il gagner ? Saison ATP 2024.
// Les chiffres de la fiche « balles de break » de la page Projets sortent de
// ce script, ecrit entierement en JavaScript : un bilan par joueur, puis la
// correlation avec le taux de victoire. Le coeur du calcul est celui que la
// fiche affiche sous « Voir le code ».
// Source : Jeff Sackmann, tennis_atp (CC BY-NC-SA 4.0), atp_matches_2024.csv.
// Usage : node atp-balles-de-break.mjs
import { readFileSync } from 'node:fs';

const [tete, ...lignes] = readFileSync(new URL('./atp_matches_2024.csv', import.meta.url), 'utf8').trim().split('\n');
const champs = tete.split(',');
const matches = lignes.map((l) => Object.fromEntries(l.split(',').map((v, i) => [champs[i], v])));

// One season summary per player: matches, wins, break points, serve points
const players = new Map();
function add(name, won, bpSaved, bpFaced, servePts, servePtsWon) {
  const p = players.get(name) ?? { matches: 0, wins: 0, bpSaved: 0, bpFaced: 0, servePts: 0, servePtsWon: 0 };
  p.matches += 1; p.wins += won;
  p.bpSaved += bpSaved; p.bpFaced += bpFaced;
  p.servePts += servePts; p.servePtsWon += servePtsWon;
  players.set(name, p);
}
for (const m of matches) {                    // each match counts for both players
  if (m.w_bpFaced !== '') add(m.winner_name, 1, +m.w_bpSaved, +m.w_bpFaced, +m.w_svpt, +m.w_1stWon + +m.w_2ndWon);
  if (m.l_bpFaced !== '') add(m.loser_name, 0, +m.l_bpSaved, +m.l_bpFaced, +m.l_svpt, +m.l_1stWon + +m.l_2ndWon);
}

// Players with at least 30 matches with statistics
const season = [...players].filter(([, p]) => p.matches >= 30).map(([name, p]) => ({
  name,
  winRate: p.wins / p.matches,
  bpSavedRate: p.bpSaved / p.bpFaced,
  servePtsRate: p.servePtsWon / p.servePts,
}));

// Pearson correlation between two columns
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
function corr(rows, x, y) {
  const mx = mean(rows.map((r) => r[x])), my = mean(rows.map((r) => r[y]));
  let sxy = 0, sxx = 0, syy = 0;
  for (const r of rows) {
    const dx = r[x] - mx, dy = r[y] - my;
    sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
  }
  return sxy / Math.sqrt(sxx * syy);
}
// Rank from the top (1 = best), ties share a rank
const rank = (key, r) => 1 + season.filter((s) => s[key] > r[key]).length;

console.log(matches.length, 'matchs,', season.length, "joueurs d'au moins 30 matchs avec statistiques");
console.log('correlation balles de break sauvees / victoires :', corr(season, 'bpSavedRate', 'winRate').toFixed(2));
console.log('correlation points gagnes au service / victoires :', corr(season, 'servePtsRate', 'winRate').toFixed(2));
for (const r of season.filter((s) => ['Jannik Sinner', 'Ben Shelton', 'Carlos Alcaraz'].includes(s.name))) {
  console.log(r.name, '| victoires :', rank('winRate', r) + 'e', '| balles de break sauvees :', rank('bpSavedRate', r) + 'e');
}
