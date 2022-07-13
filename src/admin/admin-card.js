import consts from '../consts.mjs';
import getScore, { getScoreString } from '../get-score.mjs';

const { rowWidth, colHeight, phases } = consts;

export default function AdminCard (parent, x, y, timeout) {
  const div = document.createElement('div');
  let score;

  const updateFromState = (state) => {
    score = getScore(x, y, state);
    div.innerHTML = getScoreString(x, y, state);

    if (state.current && state.current.x === x && state.current.y === y) {
      div.classList.add('active');
    } else {
      div.classList.remove('active');
    }
    if (
      state.round1.find((done) => done.x === x && done.y === y) ||
      state.round2.find((done) => done.x === x && done.y === y)
    ) {
      div.classList.add('done');
    } else {
      div.classList.remove('done');
    }
  };
  updateFromState({ phase: phases.round1, round1: [], round2: [] });

  div.classList.add('card');
  const adminRow = rowWidth * 0.5;
  const adminCol = colHeight * 0.5;

  const placeX = adminRow * (x - 0.5);
  const placeY = 5 + adminCol * (y - 0.5);
  div.style.width = `${adminRow * 0.8}vw`;
  div.style.height = `${adminCol * 0.8}vh`;
  div.style.fontSize = `${adminCol * 0.25}vmin`;
  div.style.marginLeft = `-${adminRow * 0.4}vw`;
  div.style.marginTop = `-${adminCol * 0.4}vh`;
  div.style.transform = `translate(${placeX}vw, ${placeY}vh)`;

  parent.appendChild(div);

  return {
    div,
    x,
    y,
    score,
    timeout,
    updateFromState,
  };
}
