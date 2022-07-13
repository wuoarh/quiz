import consts from './consts.mjs';

const format = new Intl.NumberFormat('de-DE');
const { phases } = consts;

const scores = [
  100,
  200,
  500,
  1000,
];

function getScore (x, y, state) {
  let multiplier = (state && state.phase === phases.round2) ? 2 : 1;
  if (state && state.round1 && state.round1.find((entry) => entry.x === x && entry.y === y)) multiplier = 1;
  if (state && state.round2 && state.round2.find((entry) => entry.x === x && entry.y === y)) multiplier = 2;

  return scores[y - 1] * multiplier;
}
export default getScore;

export function getScoreString (x, y, state) {
  return format.format(getScore(x, y, state));
}
